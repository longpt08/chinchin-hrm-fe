export interface CreateArticlePayload {
  title: string
  category: string
  content: string
  targetRoles: string[]
  status: 'draft' | 'published'
}

export interface UpdateArticlePayload extends Partial<CreateArticlePayload> {
  id: string
}
