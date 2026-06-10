"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <select 
      value={locale} 
      onChange={(e) => router.replace(pathname, { locale: e.target.value })}
      className="bg-transparent border border-border rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
    >
      <option value="en" className="bg-background text-white">English</option>
      <option value="ur" className="bg-background text-white">اردو (Urdu)</option>
      <option value="pa" className="bg-background text-white">پنجابی (Punjabi)</option>
      <option value="ps" className="bg-background text-white">پښتو (Pashto)</option>
      <option value="sd" className="bg-background text-white">سنڌي (Sindhi)</option>
      <option value="ar" className="bg-background text-white">العربية (Arabic)</option>
    </select>
  );
}
