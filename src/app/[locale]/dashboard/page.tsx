import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();
  const userName = session?.user?.name || "User";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {userName}.</h2>
        <p className="text-muted-foreground mt-2">Here is the status of your protection and services.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Mock Status Cards */}
        <div className="bg-card/50 backdrop-blur-xl border border-border p-6 rounded-2xl">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Protection Status</p>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
            <h3 className="text-2xl font-semibold text-emerald-400">Active</h3>
          </div>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-border p-6 rounded-2xl">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Unpaid Wages</p>
          <h3 className="text-2xl font-semibold font-mono">0.00 AED</h3>
          <p className="text-xs text-emerald-500 mt-1">No reported shortages</p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-border p-6 rounded-2xl">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Ghar Wallet</p>
          <h3 className="text-2xl font-semibold font-mono">0 PKR</h3>
          <p className="text-xs text-muted-foreground mt-1">Remitted this month</p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-border p-6 rounded-2xl border-emerald-500/20 bg-emerald-500/5">
          <p className="text-sm font-medium text-emerald-400 uppercase tracking-wider mb-2">Passport Status</p>
          <h3 className="text-2xl font-semibold text-white">Secure</h3>
          <p className="text-xs text-emerald-400 mt-1">No SOS Active</p>
        </div>
      </div>
    </div>
  );
}
