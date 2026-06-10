import { RemittanceComparator } from "@/components/hawaala-buster/RemittanceComparator";

export default function HawaalaBusterPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
          Hawaala-Buster
        </h2>
        <p className="text-muted-foreground mt-2">
          Compare legal remittance options and protect your hard-earned money from informal market risks.
        </p>
      </div>

      <RemittanceComparator />
    </div>
  );
}
