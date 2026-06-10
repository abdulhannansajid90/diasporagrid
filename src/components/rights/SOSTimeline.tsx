import { FileText, Building, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SOSTimeline({ report }: { report: { createdAt: Date | string } | null }) {
  const isActive = !!report;
  const steps = [
    {
      title: "SOS Triggered",
      description: "Report filed and anchored to Polygon blockchain.",
      time: isActive && report?.createdAt ? new Date(report.createdAt).toLocaleString() : "-",
      icon: FileText,
      active: isActive,
      completed: isActive,
    },
    {
      title: "Consulate Notified",
      description: "Alert sent to Pakistan Embassy, Abu Dhabi.",
      time: isActive ? "Pending" : "-",
      icon: Building,
      active: isActive,
      completed: false,
    },
    {
      title: "Legal Notice Generated",
      description: "AI drafting automated notice to employer.",
      time: "Pending",
      icon: FileText,
      active: false,
      completed: false,
    },
    {
      title: "Resolution",
      description: "Passport recovered or temporary travel document issued.",
      time: "Pending",
      icon: CheckCircle,
      active: false,
      completed: false,
    }
  ];

  return (
    <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-6">Recovery Timeline</h3>
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {steps.map((step, index) => (
          <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className={cn("flex items-center justify-center w-10 h-10 rounded-full border-4 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow", step.completed ? 'bg-emerald-500 border-emerald-900 text-white' : step.active ? 'bg-amber-500 border-amber-900 text-white animate-pulse' : 'bg-muted border-background text-muted-foreground')}>
              <step.icon className="w-4 h-4" />
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-black/20 p-4 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-1">
                <h4 className={cn("font-bold text-sm", step.completed ? 'text-emerald-400' : step.active ? 'text-amber-400' : 'text-muted-foreground')}>{step.title}</h4>
                <span className="text-xs text-muted-foreground">{step.time}</span>
              </div>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
