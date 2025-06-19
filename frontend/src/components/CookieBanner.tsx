import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';

interface CookieBannerProps {
  onAccept: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onAccept }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          {t('cookie.message')}
        </div>
        <Button
          onClick={onAccept}
          className="bg-white text-gray-900 hover:bg-gray-100"
        >
          {t('cookie.okay')}
        </Button>
      </div>
    </div>
  );
};

export default CookieBanner;
