import { WelfareDashboard } from "@/components/amaanat-shield/WelfareDashboard";

export default function AmaanatShieldPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
          Amaanat-Shield
        </h2>
        <p className="text-muted-foreground mt-2">
          Secure, direct-to-school stipends and verifiable health checks for your left-behind children.
        </p>
      </div>

      <WelfareDashboard />
    </div>
  );
}
