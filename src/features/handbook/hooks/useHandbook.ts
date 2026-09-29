import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { handbookApi } from '../api/handbookApi'
import { CreateArticlePayload, UpdateArticlePayload } from '../types'

export const useArticles = (params?: any) => {
  return useQuery({
    queryKey: ['handbook', params],
    queryFn: () => handbookApi.getArticles(params),
  })
}

export const useArticle = (id: string) => {
  return useQuery({
    queryKey: ['handbook', id],
    queryFn: () => handbookApi.getArticle(id),
    enabled: !!id
  })
}

export const useCreateArticle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateArticlePayload) => handbookApi.createArticle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['handbook'] })
    }
  })
}

export const useUpdateArticle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateArticlePayload) => handbookApi.updateArticle(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['handbook'] })
      queryClient.invalidateQueries({ queryKey: ['handbook', variables.id] })
    }
  })
}

export const useAcknowledgeArticle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => handbookApi.acknowledgeArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['handbook'] })
    }
  })
}
