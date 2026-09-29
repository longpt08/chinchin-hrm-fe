import React from 'react'
import { clsx } from 'clsx'

interface MarkdownViewerProps {
  content: string
  className?: string
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, className }) => {
  const renderMarkdown = (text: string) => {
    if (!text) return ''
    
    const lines = text.split('\n')
    let html = ''
    let inList = false
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i]
      
      // Inline parsing
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      line = line.replace(/\*(.*?)\*/g, '<em>$1</em>')
      line = line.replace(/`(.*?)`/g, '<code class="bg-brand-border px-1 py-0.5 rounded text-sm font-mono text-brand-textMain">$1</code>')
      
      // Block parsing
      if (line.startsWith('### ')) {
        if (inList) { html += '</ul>\n'; inList = false; }
        html += `<h3 class="text-xl font-semibold text-brand-textMain mt-4 mb-2">${line.slice(4)}</h3>\n`
      } else if (line.startsWith('## ')) {
        if (inList) { html += '</ul>\n'; inList = false; }
        html += `<h2 class="text-2xl font-semibold text-brand-textMain mt-5 mb-3">${line.slice(3)}</h2>\n`
      } else if (line.startsWith('# ')) {
        if (inList) { html += '</ul>\n'; inList = false; }
        html += `<h1 class="text-3xl font-bold text-brand-textMain mt-6 mb-4">${line.slice(2)}</h1>\n`
      } else if (line.startsWith('- ')) {
        if (!inList) { html += '<ul class="list-disc pl-5 my-2 space-y-1">\n'; inList = true; }
        html += `<li>${line.slice(2)}</li>\n`
      } else {
        if (inList) { html += '</ul>\n'; inList = false; }
        if (line.trim()) {
          html += `<p class="my-2">${line}</p>\n`
        } else {
          html += '<br/>\n'
        }
      }
    }
    
    if (inList) { html += '</ul>\n' }
    
    return html
  }

  return (
    <div 
      className={clsx('text-brand-textMain leading-relaxed', className)}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  )
}
