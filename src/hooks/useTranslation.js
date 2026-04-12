import { useSelector } from 'react-redux';
import { getTranslation } from '../utils/translations';

export const useTranslation = () => {
  const language = useSelector(state => state.theme.language);
  const langCode = language === 'Hindi' ? 'hi' : 'en';
  const t = getTranslation(langCode);

  return { t, language: langCode };
};