'use client';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, ShieldAlert, Globe, ArrowRightLeft, TrendingUp, CheckCircle, CheckCircle2, Loader2 } from 'lucide-react';

const getProviders = (amount: number) => [
  {
    id: 'formal-digital',
    name: 'Ghar-Wallet / Digital Transfer',
    type: 'Digital',
    rate: 76.5,
    fee: '0 AED (Subsidized)',
    time: 'Instant',
    risk: 'Zero',
    isLegal: true,
    recommended: true,
    icon: Globe,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10'
  },
  {
    id: 'formal-bank',
    name: 'Standard Bank Transfer',
    type: 'Bank',
    rate: 76.2,
    fee: amount > 5000 ? '0 AED' : '15 AED',
    time: '2-3 Business Days',
    risk: 'Zero',
    isLegal: true,
    recommended: false,
    icon: Building2,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10'
  },
  {
    id: 'informal-hundi',
    name: 'Informal Hundi / Hawaala',
    type: 'Black Market',
    rate: Number((78.0 + (amount > 10000 ? 0.5 : 0)).toFixed(2)),
    fee: `${(amount * 0.02).toFixed(2)} AED (Hidden 2% fee)`,
    time: 'Uncertain',
    risk: amount > 10000 ? 'Extreme (Immediate Flagging)' : 'High (Asset Seizure, Deportation)',
    isLegal: false,
    recommended: false,
    icon: ShieldAlert,
    color: 'text-red-400',
    bg: 'bg-red-500/10'
  }
];

export function RemittanceComparator() {
  const [amount, setAmount] = useState<number>(1000);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [successProvider, setSuccessProvider] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setIsProcessing(id);
    setTimeout(() => {
      setIsProcessing(null);
      setSuccessProvider(id);
      setTimeout(() => setSuccessProvider(null), 3000);
    }, 1500);
  };

  const currentProviders = getProviders(amount || 0);

  return (
    <div className="space-y-8">
      {successProvider && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          <div>
            <p className="text-emerald-400 font-bold">Transfer Initiated Successfully</p>
            <p className="text-xs text-emerald-400/80">Funds are being routed via {currentProviders.find(p => p.id === successProvider)?.name}. You have avoided Hawaala risk.</p>
          </div>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-500/10 via-amber-500/10 to-transparent p-6 rounded-2xl border border-red-500/20 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex shrink-0 items-center justify-center border border-red-500/30">
          <ShieldAlert className="w-8 h-8 text-red-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Why Avoid Hawaala?</h3>
          <p className="text-muted-foreground text-sm">
            Using informal remittance channels (Hawaala/Hundi) is illegal and puts your hard-earned money at massive risk of seizure. It also exposes you to deportation risks and supports illicit networks. <strong>Always use legal channels.</strong>
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-card/50 backdrop-blur-xl border border-border p-6 rounded-2xl">
        <div className="max-w-xl mx-auto space-y-4">
          <label className="text-sm font-medium text-slate-300">Amount to Send (AED)</label>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">AED</span>
              <Input 
                type="number" 
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="pl-16 h-14 text-lg font-bold bg-white/5 border-white/10"
              />
            </div>
            <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0">
              <ArrowRightLeft className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">PKR</span>
              <div className="pl-16 h-14 text-lg font-bold bg-white/5 border-white/10 rounded-xl flex items-center text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] overflow-hidden">
                {Math.floor((amount || 0) * currentProviders[0].rate).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison List */}
      <div className="space-y-4">
        {currentProviders.map((provider) => {
          const receives = (amount || 0) * provider.rate;
          
          return (
            <div 
              key={provider.id} 
              className={`relative bg-card/50 backdrop-blur-xl border p-6 rounded-2xl flex flex-col md:flex-row gap-6 md:items-center transition-all ${
                provider.recommended 
                  ? 'border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.15)] bg-emerald-500/5' 
                  : provider.isLegal 
                    ? 'border-border hover:border-primary/50' 
                    : 'border-red-500/30 opacity-75 grayscale hover:grayscale-0'
              }`}
            >
              {provider.recommended && (
                <div className="absolute -top-3 right-6 bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Recommended Legal Route
                </div>
              )}

              <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border ${provider.bg} ${provider.color.replace('text-', 'border-')}/30`}>
                <provider.icon className={`w-6 h-6 ${provider.color}`} />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">{provider.name}</h3>
                  {!provider.isLegal && <Badge variant="destructive" className="uppercase text-[10px]">Illegal</Badge>}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> Rate: {provider.rate}
                  </span>
                  <span>•</span>
                  <span>Fee: {provider.fee}</span>
                  <span>•</span>
                  <span>Time: {provider.time}</span>
                </div>
                {!provider.isLegal && (
                  <p className="text-xs text-red-400 mt-2 font-medium">Risk: {provider.risk}</p>
                )}
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm text-muted-foreground mb-1">Recipient Gets</p>
                <p className={`text-2xl font-bold font-mono ${provider.isLegal ? 'text-white' : 'text-slate-400 line-through'}`}>
                  Rs {receives.toLocaleString()}
                </p>
                {provider.isLegal ? (
                  <Button 
                    className={`w-full mt-3 ${provider.recommended ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                    onClick={() => handleSelect(provider.id)}
                    disabled={isProcessing === provider.id || successProvider !== null || !amount}
                  >
                    {isProcessing === provider.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Select'}
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full mt-3 border-red-500/30 text-red-400 hover:bg-red-500/10 pointer-events-none">
                    Blocked by System
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
