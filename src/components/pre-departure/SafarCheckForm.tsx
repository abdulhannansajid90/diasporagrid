'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileCheck, UploadCloud, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { TrustScoreGauge } from './TrustScoreGauge';

export function SafarCheckForm() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisData, setAnalysisData] = useState<{agentVerified: boolean, salaryMeetsMinimum: boolean, riskyClauses: string[]} | null>(null);
  const [isReportExpanded, setIsReportExpanded] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setResult(null); // Reset result on new file upload
      setAnalysisData(null);
    }
  };

  const handleScan = async () => {
    if (!selectedFile) return;
    setIsScanning(true);
    setResult(null);
    setAnalysisData(null);
    setIsReportExpanded(false);
    setErrorMsg(null);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/analyze-contract', {
        method: 'POST',
        body: formData,
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Failed to parse response');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data.trustScore);
      setAnalysisData(data);
    } catch (error: unknown) {
      console.error("Error scanning document:", error);
      setErrorMsg(error instanceof Error ? error.message : "Failed to analyze document. Please ensure the file is readable.");
      setResult(null);
      setAnalysisData(null);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Upload Section */}
      <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-2">Upload Contract or Visa</h3>
        <p className="text-sm text-muted-foreground mb-6">Don&apos;t sign your future away blindly. Upload your employment contract, visa, or agent agreement, and our AI will immediately verify its authenticity, cross-check against blacklisted entities, and highlight hidden risky clauses, extreme fees, and verify the recruitment agent&apos;s legitimacy.</p>
        
        <div className="border-2 border-dashed border-border hover:border-emerald-500/50 transition-colors rounded-xl p-8 flex flex-col items-center justify-center bg-black/20 relative group">
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            onChange={handleFileChange}
            accept=".pdf,.jpg,.png"
          />
          <UploadCloud className={`w-12 h-12 mb-4 transition-colors ${selectedFile ? 'text-emerald-400' : 'text-muted-foreground group-hover:text-emerald-400/70'}`} />
          <p className="font-medium text-center break-all px-4">
            {selectedFile ? selectedFile.name : "Drag & drop your documents here"}
          </p>
          <p className="text-xs text-muted-foreground mt-2">Supports PDF, JPG, PNG (Max 10MB)</p>
          <Button variant="outline" className="mt-6 border-border pointer-events-none">
            {selectedFile ? "Change File" : "Browse Files"}
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label>Agent / Company License Number (Optional)</Label>
            <Input placeholder="e.g. OEP-12345" className="bg-black/20 border-border" />
          </div>
          <Button 
            className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-white" 
            onClick={handleScan}
            disabled={isScanning || !selectedFile}
          >
            {isScanning ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                AI Analysis in Progress...
              </span>
            ) : "Analyze Contract & Agent"}
          </Button>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6 flex flex-col items-center justify-center min-h-[400px]">
        {!result && !isScanning && !errorMsg && (
          <div className="text-center opacity-50">
            <ShieldAlert className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p>Upload a document to generate a Trust Score</p>
          </div>
        )}

        {errorMsg && !isScanning && (
          <div className="w-full bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center animate-in fade-in zoom-in">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-red-400 mb-2">Analysis Failed</h3>
            <p className="text-sm text-red-300/80 mb-4">{errorMsg}</p>
            <p className="text-xs text-muted-foreground">If this is an API Quota error, please ensure your Gemini API Key is valid and has billing enabled.</p>
          </div>
        )}

        {isScanning && (
          <div className="text-center animate-pulse">
            <div className="w-24 h-24 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin mx-auto mb-6"></div>
            <p className="text-emerald-400 font-medium">Extracting clauses via AWS Textract...</p>
            <p className="text-sm text-muted-foreground mt-2">Cross-referencing agent database...</p>
          </div>
        )}

        {result !== null && !isScanning && (
          <div className="w-full animate-in fade-in zoom-in duration-500 flex flex-col items-center">
            <TrustScoreGauge score={result} />
            
            <div className="w-full mt-8 space-y-3">
              <div className={`border p-3 rounded-lg flex items-start gap-3 ${analysisData?.agentVerified ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                {analysisData?.agentVerified ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />}
                <div>
                  <p className={`text-sm font-medium ${analysisData?.agentVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {analysisData?.agentVerified ? 'Agent Verified' : 'Unverified Agent'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {analysisData?.agentVerified ? 'Appears to be from a legitimate recruiting agency or employer.' : 'Document lacks proper verifiable agency or employer details.'}
                  </p>
                </div>
              </div>
              <div className={`border p-3 rounded-lg flex items-start gap-3 ${analysisData?.salaryMeetsMinimum ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                {analysisData?.salaryMeetsMinimum ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> : <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                <div>
                  <p className={`text-sm font-medium ${analysisData?.salaryMeetsMinimum ? 'text-emerald-400' : 'text-red-400'}`}>
                    {analysisData?.salaryMeetsMinimum ? 'Salary Meets Standards' : 'Salary Risk'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {analysisData?.salaryMeetsMinimum ? 'Contracted wage appears fair and compliant.' : 'Salary is hidden, ambiguous, or extremely low.'}
                  </p>
                </div>
              </div>
              
              {analysisData?.riskyClauses && analysisData.riskyClauses.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg space-y-2 mt-4">
                  <h4 className="text-sm font-bold text-red-400 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> Risky Clauses Detected
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {analysisData.riskyClauses.map((clause, idx) => (
                      <li key={idx} className="text-xs text-red-300">{clause}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <Button 
              className="w-full mt-6" 
              variant="outline"
              onClick={() => setIsReportExpanded(!isReportExpanded)}
            >
              {isReportExpanded ? "Hide Detailed AI Report" : "View Detailed AI Report"}
            </Button>

            {isReportExpanded && analysisData && (
              <div className="w-full mt-4 p-4 bg-black/40 border border-border rounded-xl text-left overflow-auto max-h-[250px] animate-in fade-in slide-in-from-top-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-emerald-400">
                  <FileCheck className="w-4 h-4" /> 
                  Full Diagnostic JSON
                </h4>
                <div className="p-4 bg-black/60 rounded-lg border border-white/5 shadow-inner">
                  <pre className="text-[11px] md:text-xs text-emerald-300/80 whitespace-pre-wrap font-mono leading-relaxed">
                    {JSON.stringify(analysisData, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
