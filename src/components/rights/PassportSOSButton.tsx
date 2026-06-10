'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, Fingerprint, MapPin, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function PassportSOSButton({ initialActive = false }: { initialActive?: boolean }) {
  const [stage, setStage] = useState<'idle' | 'confirm' | 'active'>(initialActive ? 'active' : 'idle');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSOS = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/passport-sos', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit SOS');
      }
      
      setStage('active');
      router.refresh(); // Refresh page to update timeline
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSOS = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/passport-sos/cancel', { method: 'POST' });
      setStage('idle');
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (stage === 'active') {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center relative overflow-hidden flex flex-col items-center">
        <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <Fingerprint className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-red-400 mb-2">SOS Activated</h3>
          <p className="text-muted-foreground max-w-md mb-6">Your passport confiscation report has been securely anchored to the blockchain and transmitted to the nearest Pakistani consulate.</p>
          
          <Button 
            variant="outline" 
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            onClick={handleCancelSOS}
            disabled={isLoading}
          >
            {isLoading ? 'Canceling...' : 'Cancel SOS (False Alarm)'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6 flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-xl font-bold mb-2">Report Confiscation</h3>
      <p className="text-sm text-muted-foreground mb-8 max-w-sm">
        It is illegal for employers to hold your passport. Triggering this SOS will immediately notify authorities and begin a legal recovery process.
      </p>

      {stage === 'idle' ? (
        <Button 
          onClick={() => setStage('confirm')}
          size="lg" 
          className="w-full max-w-xs bg-red-600 hover:bg-red-700 text-white h-14 text-lg font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)]"
        >
          I Don&apos;t Have My Passport
        </Button>
      ) : (
        <div className="w-full max-w-md space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-black/20 p-4 rounded-xl text-left border border-border space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span className="text-sm">Location attached: Dubai, UAE</span>
            </div>
            <div className="flex items-center gap-3">
              <Fingerprint className="w-5 h-5 text-emerald-400" />
              <span className="text-sm">Verified via CNIC Biometrics</span>
            </div>
          </div>
          <p className="text-xs text-red-400 font-medium">Are you sure? This action will alert the consulate.</p>
          {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStage('idle')} disabled={isLoading}>Cancel</Button>
            <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={handleSOS} disabled={isLoading}>
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Sending...' : 'Confirm & Send SOS'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
