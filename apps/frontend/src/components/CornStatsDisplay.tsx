import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { CornStatsDisplayProps } from './types';

export const CornStatsDisplay = memo(function CornStatsDisplay({
  cornTotal,
  isLoading,
}: CornStatsDisplayProps) {
  const t = useTranslations('purchase');

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
      <div className="text-center">
        <div className="text-6xl mb-2">🌽</div>
        <div className="text-3xl font-bold text-yellow-600 mb-1">
          {isLoading ? '...' : cornTotal}
        </div>
        <div className="text-sm text-gray-600">
          {t('cornsPurchased')}
        </div>
      </div>
    </div>
  );
});
