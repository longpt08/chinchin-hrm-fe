import React, { useState, useMemo } from 'react'
import { Check, Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { useArticles, useAcknowledgeArticle } from '../hooks/useHandbook'
import { ArticleCard } from './ArticleCard'
import { MarkdownViewer } from './MarkdownViewer'
import { HandbookArticle } from '@/types'

export const EmployeeHandbook: React.FC = () => {
  const { t } = useTranslation()
  const { data: articles = [], isLoading } = useArticles()
  const acknowledgeArticle = useAcknowledgeArticle()
  
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewingArticle, setViewingArticle] = useState<HandbookArticle | null>(null)

  // Mock current user
  const currentUserId = 'employee-1'

  // Filter for published & employee role
  const availableArticles = useMemo(() => {
    return articles.filter(a => 
      a.status === 'published' && 
      a.targetRoles.includes('employee')
    )
  }, [articles])

  const categories = useMemo(() => {
    const cats = new Set<string>()
    availableArticles.forEach(a => cats.add(a.category))
    return ['All', ...Array.from(cats)]
  }, [availableArticles])

  const filteredArticles = useMemo(() => {
    return availableArticles.filter(a => {
      const matchCategory = activeCategory === 'All' || a.category === activeCategory
      const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.content.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [availableArticles, activeCategory, searchQuery])

  const handleAcknowledge = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    await acknowledgeArticle.mutateAsync(id)
    
    // Update local state if viewing
    if (viewingArticle && viewingArticle.id === id) {
      setViewingArticle({
        ...viewingArticle,
        acknowledgedBy: [...viewingArticle.acknowledgedBy, currentUserId]
      })
    }
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-textMain">{t('handbook.employeeTitle', 'Company Handbook')}</h1>
          <p className="text-brand-textMuted text-sm mt-1">
            {t('handbook.employeeDesc', 'Read and acknowledge important company policies.')}
          </p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-textMuted w-4 h-4" />
          <input
            type="text"
            placeholder={t('common.search', 'Search...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-brand-border rounded-md bg-white focus:outline-none focus:border-brand-primary"
          />
        </div>
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
                isManager={false}
                currentUserId={currentUserId}
                onAcknowledge={() => handleAcknowledge(article.id)}
                onView={() => setViewingArticle(article)}
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex justify-center items-center">
            <EmptyState
              title={t('handbook.noArticles', 'No articles found')}
              description={t('handbook.noArticlesDesc', 'There are no handbook articles available at the moment.')}
            />
          </div>
        )}
      </div>

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
            
            <div className="mt-6 flex justify-between items-center bg-brand-bg p-4 rounded-md border border-brand-border">
              <div className="text-sm text-brand-textMain font-medium">
                {t('handbook.pleaseAcknowledge', 'Please read and acknowledge this article.')}
              </div>
              
              {viewingArticle.acknowledgedBy.includes(currentUserId) ? (
                <div className="flex items-center text-status-success font-medium">
                  <Check className="w-5 h-5 mr-2" />
                  {t('handbook.acknowledged', 'Acknowledged')}
                </div>
              ) : (
                <Button 
                  onClick={() => handleAcknowledge(viewingArticle.id)}
                  isLoading={acknowledgeArticle.isPending}
                >
                  <Check className="w-5 h-5 mr-2" />
                  {t('handbook.acknowledge', 'Acknowledge')}
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
