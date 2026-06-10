import { LedgerDashboard } from "@/components/ujrat-tracker/LedgerDashboard";

export default function UjratTrackerPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Ujrat-Tracker</h2>
        <p className="text-muted-foreground mt-2">Wage Protection Ledger. Track your expected vs received salary, and auto-report wage theft.</p>
      </div>
      
      <LedgerDashboard />
    </div>
  );
}
