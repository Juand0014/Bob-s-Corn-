'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { memo } from 'react';

const LanguageSelector = memo(function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');

    const newPath = `/${newLocale}${pathWithoutLocale}`;

    router.push(newPath);
  };

  return (
    <div className="relative inline-block">
      <select
        value={locale}
        onChange={e => handleLanguageChange(e.target.value)}
        className="appearance-none bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-full px-4 py-2 text-lg font-semibold text-yellow-700 hover:from-yellow-100 hover:to-orange-100 hover:border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <option value="en">🇺🇸</option>
        <option value="es">🇪🇸</option>
      </select>
    </div>
  );
});

export default LanguageSelector;
