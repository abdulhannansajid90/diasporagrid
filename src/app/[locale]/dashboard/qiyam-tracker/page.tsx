'use client';

import { useState, useEffect } from 'react';
import { Timer, AlertTriangle, CheckCircle2, FileText, Scale, CalendarDays } from 'lucide-react';

const COUNTRY_VISA_RULES: Record<string, {
  gracePeriodDays: number;
  finePerDay: string;
  portalName: string;
  portalLink: string;
  preExpiryWarning: string;
  postExpiryWarning: string;
  defaultActionItems: { title: string; link: string | null }[];
}> = {
  "UAE": {
    gracePeriodDays: 30,
    finePerDay: "50 AED",
    portalName: "ICP / GDRFA Portal",
    portalLink: "https://smartservices.icp.gov.ae/",
    preExpiryWarning: "Critical deadline approaching. You must secure your visa extension immediately.",
    postExpiryWarning: "Your visa has expired. You are currently in the grace period.",
    defaultActionItems: [
      { title: "Complete Medical Fitness Test", link: "https://smart.dha.gov.ae/Smart_DHA/default.aspx" },
      { title: "Renew Emirates ID", link: "https://icp.gov.ae/en/service/renew-emirates-id-card/" },
      { title: "Submit application on ICP Portal", link: "https://smartservices.icp.gov.ae/" }
    ]
  },
  "Saudi Arabia": {
    gracePeriodDays: 60,
    finePerDay: "500 SAR",
    portalName: "Absher / Muqeem",
    portalLink: "https://www.absher.sa/",
    preExpiryWarning: "Your Iqama is expiring soon. Ensure your employer renews it.",
    postExpiryWarning: "Your Iqama has expired. Fines will apply after the grace period.",
    defaultActionItems: [
      { title: "Check health insurance validity", link: "https://www.cchi.gov.sa/" },
      { title: "Pay Maktab Amal fees", link: "https://muqeem.sa/" },
      { title: "Renew via Absher", link: "https://www.absher.sa/" }
    ]
  },
  "Qatar": {
    gracePeriodDays: 30,
    finePerDay: "10 QAR",
    portalName: "Metrash2 / MOI",
    portalLink: "https://portal.moi.gov.qa/",
    preExpiryWarning: "QID expiring soon. Renew via Metrash2.",
    postExpiryWarning: "QID expired. Grace period is active.",
    defaultActionItems: [
      { title: "Medical Commission test", link: "https://www.moph.gov.qa/" },
      { title: "Fingerprint verification", link: "https://portal.moi.gov.qa/" },
      { title: "Renew via Metrash2", link: "https://portal.moi.gov.qa/" }
    ]
  },
  "UK": {
    gracePeriodDays: 14,
    finePerDay: "Possible ban",
    portalName: "GOV.UK Visas",
    portalLink: "https://www.gov.uk/browse/visas-immigration",
    preExpiryWarning: "Visa expiring. Submit your extension application before expiry.",
    postExpiryWarning: "You are overstaying. Legal advice is strongly recommended immediately.",
    defaultActionItems: [
      { title: "Gather financial documents", link: "https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-finance" },
      { title: "Book biometric appointment", link: "https://www.ukvcas.co.uk/" },
      { title: "Submit online application", link: "https://www.gov.uk/extend-visa" }
    ]
  },
  "USA": {
    gracePeriodDays: 0,
    finePerDay: "Deportation risk",
    portalName: "USCIS",
    portalLink: "https://www.uscis.gov/",
    preExpiryWarning: "Status expiring. File I-539 for extension before your I-94 expires.",
    postExpiryWarning: "You are out of status. Unlawful presence is accruing.",
    defaultActionItems: [
      { title: "Check I-94 expiry date", link: "https://i94.cbp.dhs.gov/I94/" },
      { title: "Prepare I-539 form", link: "https://www.uscis.gov/i-539" },
      { title: "Pay filing fees", link: "https://www.uscis.gov/forms/filing-fees" }
    ]
  },
  "Other": {
    gracePeriodDays: 0,
    finePerDay: "Varies",
    portalName: "Local Immigration Office",
    portalLink: "#",
    preExpiryWarning: "Visa expiring soon. Contact local authorities.",
    postExpiryWarning: "Visa expired. Resolve your status immediately.",
    defaultActionItems: [
      { title: "Check local immigration rules", link: null },
      { title: "Prepare extension documents", link: null }
    ]
  }
};

export default function QiyamTrackerPage() {
  const [visaConfigured, setVisaConfigured] = useState(false);
  const [visaStart, setVisaStart] = useState<Date | null>(null);
  const [visaDurationYears, setVisaDurationYears] = useState<number>(2);
  const [visaType, setVisaType] = useState<string>("Work Visa");
  const [country, setCountry] = useState<string>("UAE");

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const [actionItems, setActionItems] = useState<{ id: number, title: string, link: string | null, completed: boolean, isStarting?: boolean }[]>([]);
  const [newTask, setNewTask] = useState("");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setActionItems(prev => [...prev, { id: Date.now(), title: newTask, link: null, completed: false, isStarting: false }]);
    setNewTask("");
  };

  const handleStartTask = (id: number) => {
    setActionItems(prev => prev.map(item => item.id === id ? { ...item, isStarting: true } : item));
    setTimeout(() => {
      setActionItems(prev => prev.map(item => item.id === id ? { ...item, completed: true, isStarting: false } : item));
    }, 1500);
  };

  if (!visaConfigured || !visaStart) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Qiyam Tracker
            </h1>
            <p className="text-muted-foreground mt-2">
              Monitor your legal stay duration and prepare for permanent residency.
            </p>
          </div>
        </div>
        
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-3xl p-12 max-w-2xl mx-auto mt-12 shadow-2xl">
          <CalendarDays className="w-16 h-16 text-emerald-500 mx-auto mb-6 opacity-80" />
          <h2 className="text-2xl font-bold mb-4 text-center">Configure Your Visa</h2>
          <p className="text-muted-foreground mb-8 text-center">Set up your Qiyam tracker to begin monitoring your legal stay and deadlines.</p>
          
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            const defaultItems = COUNTRY_VISA_RULES[country].defaultActionItems.map((item, i) => ({
              id: Date.now() + i, title: item.title, link: item.link, completed: false, isStarting: false
            }));
            setActionItems(defaultItems);
            setVisaConfigured(true); 
          }} className="space-y-5 max-w-md mx-auto">
            <div>
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Host Country</label>
              <select required value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 mt-2 text-white">
                <option value="UAE">UAE</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Qatar">Qatar</option>
                <option value="UK">UK</option>
                <option value="USA">USA</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Visa Issue Date</label>
              <input type="date" required onChange={(e) => setVisaStart(new Date(e.target.value))} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 mt-2 text-white" />
            </div>
            <div>
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Duration (Years)</label>
              <input type="number" required min="1" max="10" defaultValue={2} onChange={(e) => setVisaDurationYears(parseInt(e.target.value))} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 mt-2 text-white" />
            </div>
            <div>
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Visa Type</label>
              <input type="text" required placeholder="e.g. Work Visa, Student Visa" onChange={(e) => setVisaType(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 mt-2 text-white" />
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold transition-colors mt-6">
              Start Tracking
            </button>
          </form>
        </div>
      </div>
    );
  }

  const visaEnd = new Date(visaStart);
  visaEnd.setFullYear(visaEnd.getFullYear() + visaDurationYears);

  const totalTime = visaEnd.getTime() - visaStart.getTime();
  const rawRemaining = visaEnd.getTime() - now.getTime();
  const isExpired = rawRemaining < 0;
  
  const elapsed = isExpired ? totalTime : now.getTime() - visaStart.getTime();
  const progressPercent = Math.min(Math.max((elapsed / totalTime) * 100, 0), 100);
  
  const remainingDays = isExpired ? 0 : Math.ceil(rawRemaining / (1000 * 60 * 60 * 24));
  const overstayDays = isExpired ? Math.ceil(Math.abs(rawRemaining) / (1000 * 60 * 60 * 24)) : 0;
  const remainingMonths = Math.floor(remainingDays / 30);

  const rules = COUNTRY_VISA_RULES[country];
  const inGracePeriod = isExpired && overstayDays <= rules.gracePeriodDays;
  
  let textColor = "text-emerald-400";
  let bgColor = "bg-emerald-500/10";
  let borderColor = "border-emerald-500/20";
  
  if (isExpired) {
    textColor = "text-red-500"; bgColor = "bg-red-500/10"; borderColor = "border-red-500/30";
  } else if (remainingDays < 180) { 
    textColor = "text-red-400"; bgColor = "bg-red-500/10"; borderColor = "border-red-500/20";
  } else if (remainingDays < 365) { 
    textColor = "text-amber-400"; bgColor = "bg-amber-500/10"; borderColor = "border-amber-500/20";
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Qiyam Tracker
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor your legal stay duration and prepare for permanent residency.
          </p>
        </div>
        <div className="bg-card/50 backdrop-blur-xl border border-border p-3 rounded-2xl flex items-center gap-3">
          <div className={`p-2 rounded-xl ${bgColor}`}>
            <CalendarDays className={`w-5 h-5 ${textColor}`} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">End Date</p>
            <p className="text-sm font-medium text-white">{visaEnd.toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Main Countdown Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gauge Card */}
        <div className="col-span-1 md:col-span-2 bg-card/50 backdrop-blur-xl border border-border rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Circular Progress (Simplified with Conic Gradient) */}
            <div className="relative w-48 h-48 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: `conic-gradient(var(--tw-gradient-stops))`,
                // We'll simulate the gradient manually since arbitrary conic gradients can be tricky, 
                // instead let's use an SVG for a perfect ring.
              }}
            >
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="transparent" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  strokeDasharray={`${progressPercent * 2.827} 282.7`} 
                  strokeLinecap="round"
                  className={textColor}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-bold text-white font-heading">{Math.floor(progressPercent)}%</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{isExpired ? 'EXPIRED' : 'ELAPSED'}</span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <p className="text-muted-foreground uppercase tracking-wider text-sm font-bold mb-2">Time Remaining</p>
                <div className="flex items-baseline justify-center md:justify-start gap-2">
                  <span className={`text-5xl font-bold ${textColor} drop-shadow-lg`}>{isExpired ? 0 : remainingDays}</span>
                  <span className="text-xl text-muted-foreground">days</span>
                </div>
                {!isExpired && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Approximately <span className="text-white font-medium">{remainingMonths} months</span> left before expiry.
                  </p>
                )}
                {isExpired && (
                  <p className="text-sm text-red-500 font-bold mt-2">
                    Overstay: {overstayDays} days
                  </p>
                )}
              </div>

              {/* Dynamic Alert Banner based on Country Rules */}
              {(remainingDays < 365 || isExpired) && (
                <div className={`mt-6 p-4 rounded-2xl border ${borderColor} ${bgColor} flex gap-4 items-start`}>
                  <AlertTriangle className={`w-5 h-5 ${textColor} shrink-0 mt-0.5`} />
                  <div className="flex-1">
                    <h4 className={`text-sm font-bold ${textColor}`}>
                      {isExpired ? (inGracePeriod ? 'Grace Period Active' : 'Overstay Fine Accruing') : 'Action Required'}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">
                      {isExpired ? rules.postExpiryWarning : (remainingDays < 180 ? rules.preExpiryWarning : "You have less than a year remaining. Begin preparation.")}
                    </p>
                    {isExpired && !inGracePeriod && (
                      <p className="text-xs font-mono text-red-400 mb-3 bg-red-500/10 inline-block px-2 py-1 rounded">
                        Estimated Fine: {rules.finePerDay} / day
                      </p>
                    )}
                    <a href={rules.portalLink} target="_blank" rel="noreferrer" className={`inline-block px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors ${isExpired ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                      Open {rules.portalName} ↗
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Column */}
        <div className="flex flex-col gap-6">
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-3xl p-6 flex-1 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">
              <Timer className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Visa Duration</p>
            <p className="text-2xl font-bold text-white">{visaDurationYears} Years</p>
          </div>
          
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-3xl p-6 flex-1 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">
              <Scale className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Legal Status</p>
            <p className="text-2xl font-bold text-white">{visaType}</p>
          </div>
        </div>
      </div>

      {/* Action Items List */}
      <div className="bg-card/50 backdrop-blur-xl border border-border rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <FileText className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">PR Action Plan</h3>
            <p className="text-sm text-muted-foreground">Follow these steps to secure your permanent residency.</p>
          </div>
        </div>

        <form onSubmit={handleAddTask} className="flex gap-3 mb-6">
          <input 
            type="text" 
            placeholder="Add new action item..." 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 rounded-xl font-medium transition-colors">
            Add
          </button>
        </form>

        <div className="space-y-4">
          {actionItems.length === 0 && (
            <div className="text-center p-8 text-muted-foreground border border-dashed border-white/10 rounded-2xl">
              No action items tracked. Add your first step above.
            </div>
          )}
          {actionItems.map((item) => (
            <div 
              key={item.id} 
              className={`p-4 rounded-2xl border transition-all duration-200 flex items-center gap-4 ${
                item.completed 
                  ? "bg-white/5 border-white/5 opacity-60 hover:opacity-100" 
                  : "bg-white/10 border-white/10 hover:bg-white/15 cursor-pointer"
              }`}
            >
              <div className={`shrink-0 ${item.completed ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                {item.completed ? <CheckCircle2 className="w-6 h-6" /> : <div className="w-6 h-6 rounded-full border-2 border-current"></div>}
              </div>
              <span className={`flex-1 font-medium ${item.completed ? 'text-muted-foreground line-through' : 'text-white'}`}>
                {item.title}
              </span>
              {!item.completed && (
                <>
                  {item.link ? (
                    <a 
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors font-bold flex items-center gap-2"
                    >
                      Open Portal ↗
                    </a>
                  ) : (
                    <button 
                      onClick={() => handleStartTask(item.id)}
                      disabled={item.isStarting}
                      className="text-xs bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-2"
                    >
                      {item.isStarting ? (
                        <>
                          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          Starting...
                        </>
                      ) : "Start"}
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
