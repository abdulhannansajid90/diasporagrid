import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations('Index');

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24 bg-background relative overflow-hidden">
      {/* Decorative gradient background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary blur-[120px] opacity-30" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[120px] opacity-20" />
      </div>

      <div className="z-10 text-center max-w-4xl flex flex-col items-center gap-8">
        <h1 className="text-5xl md:text-7xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight leading-tight">
          {t('title')}
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
          {t('subtitle')}
        </p>

        <div className="flex gap-4 mt-8">
          <Link href="/dashboard" className="inline-flex">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white font-medium text-lg px-8 h-12">
              Get Protected Now
            </Button>
          </Link>
          <Link href="/dashboard/passport-sos" className="inline-flex">
            <Button size="lg" variant="destructive" className="animate-pulse bg-destructive hover:bg-destructive/90 text-white font-medium text-lg px-8 h-12">
              Emergency SOS
            </Button>
          </Link>
        </div>

        <div className="flex gap-4 mt-4 text-sm">
          <Link href="/login" className="text-muted-foreground hover:text-white transition-colors underline underline-offset-4">
            Log in to your account
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link href="/signup" className="text-muted-foreground hover:text-white transition-colors underline underline-offset-4">
            Create an account
          </Link>
        </div>
      </div>
    </main>
  );
}
