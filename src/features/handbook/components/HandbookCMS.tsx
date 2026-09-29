import React, { useState, useMemo } from 'react'
import { Plus, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { useArticles, useCreateArticle, useUpdateArticle } from '../hooks/useHandbook'
import { ArticleCard } from './ArticleCard'
import { ArticleEditor } from './ArticleEditor'
import { MarkdownViewer } from './MarkdownViewer'
import { HandbookArticle } from '@/types'

export const HandbookCMS: React.FC = () => {
  const { t } = useTranslation()
  const { data: articles = [], isLoading } = useArticles()
  const createArticle = useCreateArticle()
  const updateArticle = useUpdateArticle()

  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [editingArticle, setEditingArticle] = useState<HandbookArticle | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  
  const [viewingArticle, setViewingArticle] = useState<HandbookArticle | null>(null)

  // Mock current user
  const currentUserId = 'manager-1'

  const categories = useMemo(() => {
    const cats = new Set<string>()
    articles.forEach(a => cats.add(a.category))
    return ['All', ...Array.from(cats)]
  }, [articles])

  const filteredArticles = useMemo(() => {
    if (activeCategory === 'All') return articles
    return articles.filter(a => a.category === activeCategory)
  }, [articles, activeCategory])

  const handleAddClick = () => {
    setEditingArticle(null)
    setIsEditorOpen(true)
  }

  const handleEditClick = (article: HandbookArticle) => {
    setEditingArticle(article)
    setIsEditorOpen(true)
  }

  const handleEditorSuccess = async (data: any) => {
    if (editingArticle) {
      await updateArticle.mutateAsync({ ...data, id: editingArticle.id })
    } else {
      await createArticle.mutateAsync(data)
    }
    setIsEditorOpen(false)
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-textMain">{t('handbook.cmsTitle', 'Handbook CMS')}</h1>
          <p className="text-brand-textMuted text-sm mt-1">
            {t('handbook.cmsDesc', 'Manage company policies and documents')}
          </p>
        </div>
        <Button onClick={handleAddClick}>
          <Plus className="w-5 h-5 mr-2" />
          {t('handbook.addArticle', 'Add Article')}
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === category
                ? 'bg-brand-primary text-white shadow-md'
                : 'bg-brand-bg text-brand-textMuted hover:bg-brand-secondary hover:text-white'
            }`}
          >
            {category === 'All' ? t('common.all', 'All') : category}
          </button>
        ))}
      </div>

      <div className="flex-grow overflow-y-auto">
        {isLoading ? (
          <div className="h-full flex justify-center items-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <ArticleCard
                key={article.id}
                article={article}
                isManager={true}
                currentUserId={currentUserId}
                onEdit={() => handleEditClick(article)}
                onView={() => setViewingArticle(article)}
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex justify-center items-center">
            <EmptyState
              title={t('handbook.emptyTitle', 'No Articles Found')}
              description={t('handbook.emptyDesc', 'Create an article to get started.')}
            />
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <Modal 
          isOpen={isEditorOpen} 
          onClose={() => setIsEditorOpen(false)}
          className="max-w-6xl w-[90vw] h-[90vh] flex flex-col"
        >
          <div className="h-full overflow-hidden">
            <ArticleEditor
              article={editingArticle || undefined}
              onSuccess={handleEditorSuccess}
              onCancel={() => setIsEditorOpen(false)}
            />
          </div>
        </Modal>
      )}

      {/* Article Detail Modal */}
      {viewingArticle && (
        <Modal 
          isOpen={!!viewingArticle} 
          onClose={() => setViewingArticle(null)}
          className="max-w-4xl w-[90vw] max-h-[90vh]"
        >
          <div className="flex flex-col h-full max-h-[80vh]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-brand-textMain mb-2">{viewingArticle.title}</h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm px-2 py-1 bg-brand-bg text-brand-textMuted rounded">
                    {viewingArticle.category}
                  </span>
                  <span className="text-sm text-brand-textMuted">
                    {t('handbook.lastUpdated', 'Last updated:')} {new Date(viewingArticle.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setViewingArticle(null)}
                className="p-2 text-brand-textMuted hover:text-brand-primary rounded-full hover:bg-brand-bg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto bg-white rounded-md border border-brand-border p-6 shadow-sm">
              <MarkdownViewer content={viewingArticle.content} />
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setViewingArticle(null)}>
                {t('common.close', 'Close')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
