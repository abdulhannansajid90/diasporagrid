import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/en/login');
  }

  // Ensure they are fully verified by checking the fresh DB state, not the stale JWT cookie
  if (session.user.id !== "demo-user-12345") {
    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    
    if (!dbUser || !dbUser.isPhoneVerified || !dbUser.isCnicVerified) {
      redirect('/en/verify');
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Topbar user={session.user} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 z-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        {/* Background glow effects for dashboard */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/40 blur-[120px]" />
        </div>
      </div>
    </div>
  );
}
