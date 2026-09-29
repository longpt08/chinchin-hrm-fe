import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { HandbookArticle } from '@/types'
import { MarkdownViewer } from './MarkdownViewer'

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  content: z.string().min(1, 'Content is required'),
  targetRoles: z.array(z.string()).min(1, 'Select at least one role'),
  status: z.enum(['draft', 'published']),
})

type ArticleFormValues = z.infer<typeof articleSchema>

interface ArticleEditorProps {
  article?: HandbookArticle
  onSuccess: (data: any) => void
  onCancel: () => void
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({ article, onSuccess, onCancel }) => {
  const { t } = useTranslation()
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title || '',
      category: article?.category || '',
      content: article?.content || '',
      targetRoles: article?.targetRoles || ['employee'],
      status: article?.status || 'draft',
    },
  })

  const contentValue = watch('content')

  const onSubmit = async (data: ArticleFormValues) => {
    onSuccess(data)
  }

  return (
    <div className="flex flex-col h-full bg-brand-surface">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-brand-textMain">
          {article ? t('handbook.editArticle', 'Edit Article') : t('handbook.newArticle', 'New Article')}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} type="button">
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            {t('common.save', 'Save')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow overflow-hidden">
        {/* Editor Form */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-2">
          <Input
            label={t('handbook.title', 'Title')}
            {...register('title')}
            error={errors.title?.message}
          />

          <Input
            label={t('handbook.category', 'Category')}
            {...register('category')}
            error={errors.category?.message}
          />

          <div>
            <label className="block text-sm font-medium text-brand-textMain mb-1">
              {t('handbook.targetRoles', 'Target Roles')}
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-brand-textMain">
                <input
                  type="checkbox"
                  value="manager"
                  {...register('targetRoles')}
                  className="rounded border-brand-border text-brand-primary focus:ring-brand-primary"
                />
                {t('roles.manager', 'Manager')}
              </label>
              <label className="flex items-center gap-2 text-sm text-brand-textMain">
                <input
                  type="checkbox"
                  value="employee"
                  {...register('targetRoles')}
                  className="rounded border-brand-border text-brand-primary focus:ring-brand-primary"
                />
                {t('roles.employee', 'Employee')}
              </label>
            </div>
            {errors.targetRoles && (
              <p className="mt-1 text-sm text-status-danger">{errors.targetRoles.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-textMain mb-1">
              {t('handbook.status.label', 'Status')}
            </label>
            <select
              {...register('status')}
              className="w-full rounded-md border border-brand-border bg-white px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
            >
              <option value="draft">{t('handbook.status.draft', 'Draft')}</option>
              <option value="published">{t('handbook.status.published', 'Published')}</option>
            </select>
          </div>

          <div className="flex flex-col flex-grow">
            <label className="block text-sm font-medium text-brand-textMain mb-1">
              {t('handbook.content', 'Content')}
            </label>
            <textarea
              {...register('content')}
              className="w-full flex-grow min-h-[300px] rounded-md border border-brand-border bg-white px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary resize-y font-mono"
              placeholder="# Markdown supported..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-status-danger">{errors.content.message}</p>
            )}
          </div>
        </div>

        {/* Live Preview */}
        <div className="hidden lg:flex flex-col rounded-md border border-brand-border overflow-hidden bg-white">
          <div className="bg-brand-bg px-4 py-2 border-b border-brand-border">
            <h3 className="text-sm font-medium text-brand-textMain">{t('handbook.preview', 'Live Preview')}</h3>
          </div>
          <div className="p-6 overflow-y-auto flex-grow">
            {contentValue ? (
              <MarkdownViewer content={contentValue} />
            ) : (
              <div className="h-full flex items-center justify-center text-brand-textMuted text-sm italic">
                {t('handbook.previewEmpty', 'Start typing to see preview...')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
