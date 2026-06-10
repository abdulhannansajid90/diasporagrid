'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Shield, FileCheck, Wallet, Heart, Activity, Globe, Scale, Timer } from 'lucide-react';


export function Sidebar() {
  const pathname = usePathname();

  const modules = [
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'SafarCheck', path: '/dashboard/safar-check', icon: FileCheck },
    { name: 'Passport-SOS', path: '/dashboard/passport-sos', icon: Shield, isDanger: true },
    { name: 'Qiyam-Tracker', path: '/dashboard/qiyam-tracker', icon: Timer },
    { name: 'Ujrat-Tracker', path: '/dashboard/ujrat-tracker', icon: Scale },
    { name: 'Hawaala-Buster', path: '/dashboard/hawaala-buster', icon: Globe },
    { name: 'Ghar-Wallet', path: '/dashboard/ghar-wallet', icon: Wallet },
    { name: 'Amaanat-Shield', path: '/dashboard/amaanat-shield', icon: Heart },
    { name: 'Rooh-Network', path: '/dashboard/rooh-network', icon: Activity },
  ];

  return (
    <div className="hidden md:flex w-[280px] flex-col bg-card/50 backdrop-blur-xl border-r border-border min-h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
          DIASPORA-GRID
        </h2>
      </div>
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {modules.map((m) => {
          const isActive = pathname.includes(m.path) && (m.path !== '/dashboard' || pathname.endsWith('/dashboard'));
          return (
            <Link
              key={m.name}
              href={`/en${m.path}`}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive ? "bg-primary/20 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(0,184,124,0.1)]" : "text-muted-foreground hover:bg-white/5 hover:text-white",
                m.isDanger && isActive && "bg-destructive/20 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(229,62,62,0.15)]",
                m.isDanger && !isActive && "hover:text-red-400"
              )}
            >
              <m.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{m.name}</span>
              {m.isDanger && (
                <span className="ml-auto flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-r from-red-500/10 to-transparent p-4 rounded-xl border border-red-500/20">
          <p className="text-xs text-red-400 uppercase tracking-widest font-bold mb-1">Emergency</p>
          <p className="text-sm text-muted-foreground mb-3">Require immediate embassy assistance?</p>
          <Link href="/en/dashboard/passport-sos" className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 rounded-lg transition-colors block text-center">
            Trigger SOS
          </Link>
        </div>
      </div>
    </div>
  );
}
