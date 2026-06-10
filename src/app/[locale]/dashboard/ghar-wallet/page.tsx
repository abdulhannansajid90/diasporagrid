"use client";

import { useState } from "react";
import { Wallet, ArrowUpRight, ArrowDownLeft, CreditCard, Activity, Send, Building2, ShieldCheck, CheckCircle2, X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GharWalletPage() {
  const [balance, setBalance] = useState(0.00);
  const [isSending, setIsSending] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [sendSuccess, setSendSuccess] = useState(false);
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean, title: string, message: string } | null>(null);

  const [transactions, setTransactions] = useState<{ id: number, type: string, to: string, amount: string, date: string, status: string, icon: React.ElementType, color: string, bg: string }[]>([]);

  const handleSendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0 || amount > balance) return;
    
    setIsSending(true);

    try {
      await fetch('/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: `Remittance Receipt: $${amount.toFixed(2)} USD Sent`,
          message: `You have successfully sent $${amount.toFixed(2)} USD to the provided recipient.`,
          actionType: 'REMITTANCE'
        })
      });

      setBalance(prev => prev - amount);
      setTransactions(prev => [
        { id: Date.now(), type: "Send", to: "Direct Transfer", amount: `-$${amount.toFixed(2)}`, date: "Just now", status: "Completed", icon: ArrowUpRight, color: "text-red-400", bg: "bg-red-400/10" },
        ...prev
      ]);
      setSendSuccess(true);
      setTimeout(() => {
        setIsSending(false);
        setSendSuccess(false);
        setSendAmount("");
      }, 2000);
    } catch (e) {
      console.error(e);
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ghar-Wallet</h2>
          <p className="text-muted-foreground mt-1">Cross-Border Financial Control Hub</p>
        </div>
        <div className="flex gap-3">
          <Button 
            className="rounded-full shadow-lg hover:shadow-primary/25 transition-all"
            onClick={() => setIsSending(true)}
          >
            <Send className="w-4 h-4 mr-2" /> Send Money
          </Button>
          <Button variant="outline" className="rounded-full">
            <Activity className="w-4 h-4 mr-2" /> View Analytics
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Balance Card */}
        <div className="col-span-1 md:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700 p-8 shadow-2xl group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 group-hover:bg-primary/30 transition-all duration-700" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-slate-300 mb-2">
              <Wallet className="w-5 h-5" />
              <span className="font-medium">Total Available Balance</span>
            </div>
            <div className="flex items-baseline gap-3">
              <h1 className="text-5xl font-black text-white tracking-tight">${balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h1>
              <span className="text-xl text-emerald-400 font-semibold">USD</span>
            </div>
            <p className="text-slate-400 mt-2">≈ {(balance * 278).toLocaleString(undefined, {maximumFractionDigits: 0})} PKR (Current Rate: 278.00)</p>

            <div className="flex gap-4 mt-8">
              <button 
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex-1 backdrop-blur-sm"
                onClick={() => setIsSending(true)}
              >
                <ArrowUpRight className="w-6 h-6 text-emerald-400 mb-2" />
                <span className="text-sm font-medium text-slate-200">Transfer</span>
              </button>
              <button 
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex-1 backdrop-blur-sm"
                onClick={() => setAlertModal({ isOpen: true, title: "Early Access", message: "Payment request feature is currently in early access. You will be notified when it unlocks for your region." })}
              >
                <ArrowDownLeft className="w-6 h-6 text-blue-400 mb-2" />
                <span className="text-sm font-medium text-slate-200">Request</span>
              </button>
              <button 
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex-1 backdrop-blur-sm"
                onClick={() => document.getElementById('family-cards')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <CreditCard className="w-6 h-6 text-purple-400 mb-2" />
                <span className="text-sm font-medium text-slate-200">Cards</span>
              </button>
              <button 
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex-1 backdrop-blur-sm"
                onClick={() => setAlertModal({ isOpen: true, title: "No Pending Bills", message: "You currently have no pending utility bills, school fees, or recurring subscriptions linked to this account." })}
              >
                <Building2 className="w-6 h-6 text-amber-400 mb-2" />
                <span className="text-sm font-medium text-slate-200">Bills</span>
              </button>
            </div>
          </div>
        </div>

        {/* Family Cards Control */}
        <div id="family-cards" className="col-span-1 rounded-3xl bg-card border border-border p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Family Cards</h3>
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>

          <div className="space-y-4 flex-1">
             <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-xl">
               No cards issued yet.
             </div>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full mt-4 text-primary hover:text-primary/80 hover:bg-primary/10"
            onClick={() => setAlertModal({ isOpen: true, title: "KYC Restriction", message: "Family Card issuance is restricted in your region pending KYC Level 2 verification. Please contact support to upgrade your account." })}
          >
            + Issue New Card
          </Button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold tracking-tight">Recent Transactions</h3>
          <Button variant="link" className="text-muted-foreground hover:text-primary">View All</Button>
        </div>
        
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="divide-y divide-border">
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No recent transactions.</p>
              </div>
            ) : transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.bg} ${tx.color} group-hover:scale-110 transition-transform duration-300`}>
                    <tx.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{tx.to}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.amount.startsWith('+') ? 'text-emerald-400' : ''}`}>
                    {tx.amount}
                  </p>
                  <p className="text-xs text-muted-foreground">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Send Money Modal Overlay */}
      {isSending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-2xl w-full max-w-md relative">
            <button 
              onClick={() => setIsSending(false)} 
              className="absolute top-4 right-4 text-muted-foreground hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            {sendSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-400">Transfer Successful</h3>
                <p className="text-muted-foreground">Funds have been sent securely.</p>
              </div>
            ) : (
              <form onSubmit={handleSendSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold">Send Money</h3>
                  <p className="text-sm text-muted-foreground">Transfer funds instantly to any account.</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground font-semibold uppercase">Amount (USD)</label>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      className="text-2xl h-14 bg-black/20"
                      autoFocus
                      required
                      max={balance}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-semibold uppercase">Recipient</label>
                    <Input placeholder="Account number or email" className="bg-black/20" required />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 text-lg">
                  Confirm Transfer
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Alert Modal Overlay */}
      {alertModal && alertModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-2xl w-full max-w-sm relative text-center">
            <button 
              onClick={() => setAlertModal(null)} 
              className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 mt-4 animate-in zoom-in">
              <Lock className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{alertModal.title}</h3>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              {alertModal.message}
            </p>
            
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => setAlertModal(null)}
            >
              Understood
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
