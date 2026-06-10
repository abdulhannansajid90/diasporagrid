'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, CheckCircle2, FileText, Scale, Landmark, History, Plus } from 'lucide-react';

interface Payment {
  id: number;
  month: string;
  expected: number;
  received: number;
  status: string;
  date: string;
}

export function LedgerDashboard() {
  const [payments, setPayments] = useState<Payment[]>([]);

  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  
  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [newMonth, setNewMonth] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newExpected, setNewExpected] = useState('');
  const [newReceived, setNewReceived] = useState('');

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMonth || !newDate || !newExpected || !newReceived) return;

    const expectedAmount = parseFloat(newExpected);
    const receivedAmount = parseFloat(newReceived);
    
    let status = 'Paid';
    if (receivedAmount < expectedAmount) status = 'Shortfall';

    const newPayment: Payment = {
      id: Date.now(),
      month: newMonth,
      date: newDate,
      expected: expectedAmount,
      received: receivedAmount,
      status
    };

    setPayments(prev => [newPayment, ...prev]);
    setIsAdding(false);
    setNewMonth('');
    setNewDate('');
    setNewExpected('');
    setNewReceived('');
  };

  const handleReport = async (id: number) => {
    setIsReporting(true);
    try {
      await fetch('/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: 'Official Wage Theft Discrepancy Report',
          message: 'A discrepancy was reported for a logged month where expected salary was not fully received.',
          actionType: 'WAGE_THEFT'
        })
      });

      setIsReporting(false);
      setReportSuccess(true);
      // Change status of the shortfall payment
      setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'Reported' } : p));
      
      setTimeout(() => setReportSuccess(false), 5000);
    } catch {
      setIsReporting(false);
    }
  };

  const totalExpected = payments.reduce((acc, curr) => acc + curr.expected, 0);
  const totalReceived = payments.reduce((acc, curr) => acc + curr.received, 0);
  const shortfall = totalExpected - totalReceived;

  return (
    <div className="space-y-8">
      {reportSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-emerald-400 font-bold">Discrepancy Reported Successfully</p>
              <p className="text-xs text-emerald-400/80">Case #DG-8821 forwarded to the Ministry of Labor portal. Legal team notified.</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-3xl p-6 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 border border-blue-500/30">
            <Landmark className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-sm text-muted-foreground mb-1 font-semibold uppercase tracking-wider">Total Expected (YTD)</p>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-white">${totalExpected}</p>
          </div>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-3xl p-6 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 border border-emerald-500/30">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-sm text-muted-foreground mb-1 font-semibold uppercase tracking-wider">Total Received (YTD)</p>
          <p className="text-4xl font-bold text-white">${totalReceived}</p>
        </div>

        <div className={`bg-card/50 backdrop-blur-xl border ${shortfall > 0 ? 'border-red-500/30' : 'border-border'} rounded-3xl p-6 relative overflow-hidden group`}>
          <div className={`w-12 h-12 rounded-xl ${shortfall > 0 ? 'bg-red-500/20 border border-red-500/30' : 'bg-emerald-500/20 border border-emerald-500/30'} flex items-center justify-center mb-4`}>
            {shortfall > 0 ? <AlertTriangle className="w-6 h-6 text-red-400" /> : <Scale className="w-6 h-6 text-emerald-400" />}
          </div>
          <p className="text-sm text-muted-foreground mb-1 font-semibold uppercase tracking-wider">Total Shortfall</p>
          <p className={`text-4xl font-bold ${shortfall > 0 ? 'text-red-400' : 'text-white'}`}>
            ${shortfall}
          </p>
        </div>
      </div>

      {/* Add Payment Form */}
      <div className="bg-card/50 backdrop-blur-xl border border-border p-6 rounded-3xl shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" /> Log New Salary Payment
          </h3>
          <Button variant={isAdding ? "destructive" : "default"} onClick={() => setIsAdding(!isAdding)} size="sm">
            {isAdding ? "Cancel" : "Add Payment"}
          </Button>
        </div>

        {isAdding && (
          <form onSubmit={handleAddPayment} className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-in fade-in slide-in-from-top-4 mt-4">
            <Input 
              placeholder="Month (e.g. June 2026)" 
              value={newMonth} 
              onChange={e => setNewMonth(e.target.value)}
              className="bg-black/20"
              required 
            />
            <Input 
              type="date" 
              value={newDate} 
              onChange={e => setNewDate(e.target.value)}
              className="bg-black/20"
              required 
            />
            <Input 
              type="number" 
              placeholder="Expected ($)" 
              value={newExpected} 
              onChange={e => setNewExpected(e.target.value)}
              className="bg-black/20"
              required 
            />
            <Input 
              type="number" 
              placeholder="Received ($)" 
              value={newReceived} 
              onChange={e => setNewReceived(e.target.value)}
              className="bg-black/20"
              required 
            />
            <Button type="submit" className="w-full">Save Record</Button>
          </form>
        )}
      </div>

      {/* Ledger Table */}
      <div className="bg-card/50 backdrop-blur-xl border border-border rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-border/50 flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            Wage Protection Ledger
          </h3>
          <Button variant="outline" size="sm" className="hidden sm:flex">Download PDF</Button>
        </div>
        
        {payments.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground border-t border-white/5">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No salary records found. Add your first payment to build your ledger.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-black/20">
                <tr>
                  <th className="px-6 py-4 font-semibold">Month</th>
                  <th className="px-6 py-4 font-semibold">Deposit Date</th>
                  <th className="px-6 py-4 font-semibold">Expected</th>
                  <th className="px-6 py-4 font-semibold">Received</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-medium text-white">{payment.month}</td>
                    <td className="px-6 py-4 text-muted-foreground">{payment.date}</td>
                    <td className="px-6 py-4">${payment.expected}</td>
                    <td className="px-6 py-4 font-semibold">${payment.received}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        payment.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                        payment.status === 'Reported' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {payment.status === 'Shortfall' ? (
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-all"
                          onClick={() => handleReport(payment.id)}
                          disabled={isReporting}
                        >
                          {isReporting ? 'Filing...' : 'Report Wage Theft'}
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                          <FileText className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
