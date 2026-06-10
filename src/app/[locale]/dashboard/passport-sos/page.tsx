import { PassportSOSButton } from "@/components/rights/PassportSOSButton";
import { SOSTimeline } from "@/components/rights/SOSTimeline";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function PassportSOSPage() {
  const session = await auth();
  
  let activeReport = null;
  try {
    if (session?.user?.id) {
      activeReport = await prisma.passportSOSReport.findFirst({
        where: { userId: session.user.id, status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' }
      });
    }
  } catch (error) {
    console.error("Prisma lookup failed in PassportSOSPage, using fallback null:", error);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-red-500 flex items-center gap-3">
          Passport-SOS
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </h2>
        <p className="text-muted-foreground mt-2">Immediate legal and diplomatic response for passport confiscation.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <PassportSOSButton initialActive={!!activeReport} />
        <SOSTimeline report={activeReport} />
      </div>
    </div>
  );
}

