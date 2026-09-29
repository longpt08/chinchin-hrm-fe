import React from 'react'
import { Check, Edit, Eye, FileText, Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { HandbookArticle } from '@/types'

interface ArticleCardProps {
  article: HandbookArticle
  isManager: boolean
  currentUserId: string
  onEdit?: () => void
  onAcknowledge?: () => void
  onView: () => void
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  isManager,
  currentUserId,
  onEdit,
  onAcknowledge,
  onView,
}) => {
  const { t } = useTranslation()
  const isAcknowledged = article.acknowledgedBy.includes(currentUserId)

  return (
    <Card className="flex flex-col h-full hover:shadow-medium transition-shadow cursor-pointer" onClick={onView}>
      <div className="flex justify-between items-start mb-4">
        <Badge variant="default" className="bg-brand-bg text-brand-textMuted border-brand-border">
          {article.category}
        </Badge>
        {isManager && (
          <Badge variant={article.status === 'published' ? 'success' : 'default'}>
            {t(`handbook.status.${article.status}`, article.status)}
          </Badge>
        )}
      </div>

      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-brand-textMain mb-2 line-clamp-2">
          {article.title}
        </h3>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {article.targetRoles.map(role => (
            <span key={role} className="text-xs px-2 py-1 rounded bg-brand-bg text-brand-textMuted">
              {t(`roles.${role}`, role)}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-brand-border">
        <div className="flex items-center text-sm text-brand-textMuted">
          <FileText className="w-4 h-4 mr-1" />
          <span>{new Date(article.updatedAt).toLocaleDateString()}</span>
        </div>

        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
          {isManager ? (
            <>
              {onEdit && (
                <Button variant="ghost" size="sm" onClick={onEdit} className="text-brand-textMuted hover:text-brand-primary">
                  <Edit className="w-4 h-4" />
                </Button>
              )}
            </>
          ) : (
            <>
              {isAcknowledged ? (
                <div className="flex items-center text-status-success text-sm font-medium">
                  <Check className="w-4 h-4 mr-1" />
                  {t('handbook.acknowledged', 'Acknowledged')}
                </div>
              ) : (
                onAcknowledge && (
                  <Button variant="outline" size="sm" onClick={onAcknowledge} className="text-brand-primary">
                    <Check className="w-4 h-4 mr-1" />
                    {t('handbook.acknowledge', 'Acknowledge')}
                  </Button>
                )
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  )
}
