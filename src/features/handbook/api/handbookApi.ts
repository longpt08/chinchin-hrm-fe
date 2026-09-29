import { HandbookArticle } from '@/types'
import { CreateArticlePayload, UpdateArticlePayload } from '../types'

export const handbookApi = {
  getArticles: async (params?: any) => {
    // Mock API response
    return [] as HandbookArticle[]
  },
  getArticle: async (id: string) => {
    return null as unknown as HandbookArticle
  },
  createArticle: async (payload: CreateArticlePayload) => {
    return { 
      ...payload, 
      id: Math.random().toString(), 
      acknowledgedBy: [], 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    } as HandbookArticle
  },
  updateArticle: async (payload: UpdateArticlePayload) => {
    return payload as unknown as HandbookArticle
  },
  publishArticle: async (id: string) => {
    return { id, status: 'published' } as unknown as HandbookArticle
  },
  acknowledgeArticle: async (id: string) => {
    return { success: true }
  }
}
