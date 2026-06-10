import { SafarCheckForm } from "@/components/pre-departure/SafarCheckForm";

export default function SafarCheckPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">SafarCheck</h2>
        <p className="text-muted-foreground mt-2">AI-powered pre-departure fraud detection. Don&apos;t sign until our AI clears it.</p>
      </div>

      <SafarCheckForm />
    </div>
  );
}
