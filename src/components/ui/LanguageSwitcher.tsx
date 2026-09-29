import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'vi' ? 'en' : 'vi'
    i18n.changeLanguage(newLang)
    localStorage.setItem('chinchin-lang', newLang)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-brand-textMuted hover:bg-brand-border transition-colors"
      title="Switch language"
    >
      <Languages className="w-4 h-4" />
      <span className="uppercase text-xs">{i18n.language}</span>
    </button>
  )
}
