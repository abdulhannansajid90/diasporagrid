'use client';
import { useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Stethoscope, Wallet, CheckCircle2, Clock, AlertCircle, Loader2, Plus, UserPlus } from 'lucide-react';

interface Child {
  id: string;
  name: string;
  age: number;
  school: { attendance: number; status: string; lastUpdate: string };
  health: { lastCheckup: string; status: string; needsAttention: boolean };
  stipend: { status: string; amount: string; date: string };
}

export function WelfareDashboard() {
  const [children, setChildren] = useState<Child[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Form State
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAge) return;

    const newChild: Child = {
      id: Date.now().toString(),
      name: newName,
      age: parseInt(newAge),
      school: { attendance: 100, status: 'Excellent', lastUpdate: 'Just now' },
      health: { lastCheckup: 'Pending', status: 'Requires initial checkup', needsAttention: true },
      stipend: { status: 'Processing', amount: '15,000 PKR', date: 'Pending' }
    };

    setChildren([newChild, ...children]);
    setNewName('');
    setNewAge('');
    setIsAdding(false);
  };

  const handleReleaseStipend = (id: string) => {
    setProcessingId(id);
    setTimeout(() => {
      setChildren(prev => prev.map(child => {
        if (child.id === id) {
          return {
            ...child,
            stipend: { ...child.stipend, status: 'Delivered', date: 'Just now' }
          };
        }
        return child;
      }));
      setProcessingId(null);
    }, 2000);
  };

  // Calculate dynamic stats based on actual children array
  const totalStipend = children.reduce((acc, c) => acc + parseInt(c.stipend.amount.replace(/,/g, '')), 0);
  const avgAttendance = children.length > 0 
    ? (children.reduce((acc, c) => acc + c.school.attendance, 0) / children.length).toFixed(1)
    : '0.0';
  const healthAlerts = children.filter(c => c.health.needsAttention).length;

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card/50 backdrop-blur-xl border border-border p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <GraduationCap className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Avg Attendance</p>
            <h3 className="text-2xl font-bold">{avgAttendance}%</h3>
          </div>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-border p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
            <Stethoscope className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Health Status</p>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              {healthAlerts} Alert{healthAlerts !== 1 ? 's' : ''} {healthAlerts > 0 && <AlertCircle className="w-5 h-5 text-amber-400" />}
            </h3>
          </div>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-border p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Wallet className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Stipend (Mo)</p>
            <h3 className="text-2xl font-bold">{totalStipend.toLocaleString()} PKR</h3>
          </div>
        </div>
      </div>

      {/* Add Dependent Form */}
      <div className="bg-card/50 backdrop-blur-xl border border-border p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" /> Track New Dependent
          </h3>
          <Button variant={isAdding ? "destructive" : "default"} onClick={() => setIsAdding(!isAdding)} size="sm">
            {isAdding ? "Cancel" : <><Plus className="w-4 h-4 mr-1" /> Add Dependent</>}
          </Button>
        </div>

        {isAdding && (
          <form onSubmit={handleAddChild} className="flex flex-col md:flex-row gap-4 animate-in fade-in slide-in-from-top-4">
            <Input 
              placeholder="Child's Full Name" 
              value={newName} 
              onChange={e => setNewName(e.target.value)}
              className="bg-black/20"
              required 
            />
            <Input 
              type="number" 
              placeholder="Age" 
              value={newAge} 
              onChange={e => setNewAge(e.target.value)}
              className="bg-black/20 w-full md:w-32"
              min={1}
              max={25}
              required 
            />
            <Button type="submit" className="shrink-0">Save Dependent</Button>
          </form>
        )}
      </div>

      {/* Children Cards */}
      {children.length === 0 ? (
        <div className="text-center py-12 bg-black/10 rounded-2xl border border-border border-dashed">
          <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium">No Dependents Tracked</h3>
          <p className="text-muted-foreground">Click &quot;Add Dependent&quot; to start monitoring their education and health.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {children.map((child) => (
            <div key={child.id} className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl overflow-hidden group hover:border-primary/50 transition-colors flex flex-col">
              
              <div className="p-6 border-b border-border/50 flex justify-between items-center bg-black/10">
                <div>
                  <h3 className="text-xl font-bold">{child.name}</h3>
                  <p className="text-sm text-muted-foreground">{child.age} years old</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center font-bold text-lg border border-white/10 uppercase">
                  {child.name.charAt(0)}
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* School */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-blue-400" />
                      <span className="font-medium text-sm text-slate-300">School Attendance</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                      child.school.attendance >= 90 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {child.school.status}
                    </span>
                  </div>
                  <Progress value={child.school.attendance} className="h-2" 
                    indicatorColor={child.school.attendance >= 90 ? "bg-emerald-500" : "bg-amber-500"} 
                  />
                  <p className="text-xs text-muted-foreground text-right">{child.school.attendance}% • Updated {child.school.lastUpdate}</p>
                </div>

                {/* Health */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-rose-400" />
                      <span className="font-medium text-sm text-slate-300">Health & Wellness</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                      child.health.needsAttention ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {child.health.status}
                    </span>
                  </div>
                  <div className="bg-black/20 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                    {child.health.needsAttention ? <AlertCircle className="w-5 h-5 text-amber-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    <span className="text-sm text-muted-foreground">Last Checkup: <span className="text-white">{child.health.lastCheckup}</span></span>
                  </div>
                </div>

                {/* Stipend */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-emerald-400" />
                      <span className="font-medium text-sm text-slate-300">Direct Stipend</span>
                    </div>
                  </div>
                  <div className="bg-black/20 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold font-mono">{child.stipend.amount}</p>
                      <p className="text-xs text-muted-foreground">{child.stipend.date}</p>
                    </div>
                    <div className={`flex items-center gap-2 text-sm font-medium ${
                      child.stipend.status === 'Delivered' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {child.stipend.status === 'Delivered' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      {child.stipend.status}
                    </div>
                  </div>
                </div>

                {/* Action */}
                {child.stipend.status === 'Processing' && (
                  <div className="pt-4 border-t border-white/10 mt-auto">
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => handleReleaseStipend(child.id)}
                      disabled={processingId === child.id}
                    >
                      {processingId === child.id ? (
                        <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Releasing Funds via Direct-to-School...</>
                      ) : "Release Pending Stipend"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
