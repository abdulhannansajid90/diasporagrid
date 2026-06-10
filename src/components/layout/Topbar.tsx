import { Bell, User, Settings } from 'lucide-react';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

export function Topbar({ user }: { user?: { name?: string | null, isCnicVerified?: boolean } }) {
  return (
    <header className="h-[72px] border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Breadcrumbs or Page Title could go here */}
        <h1 className="text-xl font-semibold font-heading">Mission Control</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <button className="p-2 text-muted-foreground hover:text-white rounded-full hover:bg-white/5 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
        </button>
        <button className="p-2 text-muted-foreground hover:text-white rounded-full hover:bg-white/5 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <LogoutButton />
        <div className="h-8 w-px bg-border mx-2"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-white">{user?.name || "Verified User"}</p>
            <p className="text-xs text-emerald-400">{user?.isCnicVerified ? "Verified CNIC" : "Unverified"}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border border-border">
            <User className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
