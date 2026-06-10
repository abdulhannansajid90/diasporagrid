import { Bell, User, Settings } from 'lucide-react';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { MobileMenu } from '@/components/layout/MobileMenu';

export function Topbar({ user }: { user?: { name?: string | null, isCnicVerified?: boolean } }) {
  return (
    <header className="h-[72px] border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-2 md:gap-4">
        <MobileMenu />
        {/* Breadcrumbs or Page Title could go here */}
        <h1 className="text-lg md:text-xl font-semibold font-heading truncate max-w-[150px] md:max-w-none">Mission Control</h1>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden md:block">
          <LanguageSwitcher />
        </div>
        <button className="p-2 text-muted-foreground hover:text-white rounded-full hover:bg-white/5 transition-colors relative hidden sm:block">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
        </button>
        <button className="p-2 text-muted-foreground hover:text-white rounded-full hover:bg-white/5 transition-colors hidden sm:block">
          <Settings className="w-5 h-5" />
        </button>
        <div className="hidden md:block">
          <LogoutButton />
        </div>
        <div className="h-8 w-px bg-border mx-1 md:mx-2 hidden sm:block"></div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-white">{user?.name || "Verified User"}</p>
            <p className="text-xs text-emerald-400">{user?.isCnicVerified ? "Verified CNIC" : "Unverified"}</p>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center border border-border">
            <User className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
