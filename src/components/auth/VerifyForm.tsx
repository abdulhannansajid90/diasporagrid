"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { verifyOtp, verifyCnic, sendOtp, verifyPhone } from "@/actions/auth"
import { Mail, Fingerprint, CheckCircle2, ShieldCheck, Loader2, RefreshCw, Smartphone } from "lucide-react"

export default function VerifyForm({ 
  userId, 
  isEmailVerified,
  isPhoneVerified, 
  isCnicVerified 
}: { 
  userId: string, 
  isEmailVerified: boolean,
  isPhoneVerified: boolean, 
  isCnicVerified: boolean 
}) {
  const router = useRouter()
  const [emailStep, setEmailStep] = useState(!isEmailVerified)
  const [phoneStep, setPhoneStep] = useState(isEmailVerified && !isPhoneVerified)
  const [cnicStep, setCnicStep] = useState(isEmailVerified && isPhoneVerified && !isCnicVerified)
  
  const [otp, setOtp] = useState("")
  const [phoneOtp, setPhoneOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const hasSentOtpRef = useRef(false)

  // Send OTP when component loads
  useEffect(() => {
    if (emailStep && !hasSentOtpRef.current) {
      hasSentOtpRef.current = true
      sendOtp(userId).then(res => {
        if (res?.error) setError(res.error)
      })
    }
  }, [emailStep, userId])

  const handleResend = async () => {
    setIsLoading(true)
    setError("")
    setOtp("")
    const res = await sendOtp(userId)
    if (res?.error) setError(res.error)
    else setError("A new OTP has been sent to your email.")
    setIsLoading(false)
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    const result = await verifyOtp(userId, otp)
    if (result.error) {
      setError(result.error)
    } else {
      setEmailStep(false)
      setPhoneStep(true)
    }
    setIsLoading(false)
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    const result = await verifyPhone(userId, phoneOtp)
    if (result.error) {
      setError(result.error)
    } else {
      setPhoneStep(false)
      setCnicStep(true)
    }
    setIsLoading(false)
  }

  const handleCnicVerify = async () => {
    setIsLoading(true)
    const result = await verifyCnic(userId)
    if (result.redirect) {
      router.push(result.redirect)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-card border border-border shadow-2xl">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Identity Verification</h2>
        <p className="text-muted-foreground mt-2 text-sm">Secure your account to access the dashboard.</p>
      </div>

      {error && (
        <div className="mb-4 space-y-3">
          <p className="text-sm text-destructive text-center">{error}</p>
          {error.includes("not found") && (
            <Button 
              variant="outline" 
              className="w-full text-xs" 
              onClick={() => signOut({ callbackUrl: '/en/signup' })}
            >
              Start Over
            </Button>
          )}
        </div>
      )}

      {emailStep && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
            <Mail className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">Verify Email Address</p>
              <p className="text-xs text-muted-foreground">We sent a 6-digit code to your email.</p>
            </div>
          </div>

          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <Input 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit Email OTP" 
              className="text-center tracking-widest text-lg bg-black/20"
              maxLength={6}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading || otp.length < 6}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Email"}
            </Button>
          </form>
          
          <div className="text-center mt-4">
            <button 
              type="button" 
              onClick={handleResend}
              className="text-xs text-muted-foreground hover:text-primary flex items-center justify-center gap-2 mx-auto"
              disabled={isLoading}
            >
              <RefreshCw className="w-3 h-3" /> Resend Email Code
            </button>
          </div>
        </div>
      )}

      {phoneStep && (
        <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-sm font-semibold">Email Verified</p>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
            <Smartphone className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">Verify Phone Number</p>
              <p className="text-xs text-muted-foreground">We sent an SMS to your registered phone.</p>
            </div>
          </div>

          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <Input 
              value={phoneOtp}
              onChange={(e) => setPhoneOtp(e.target.value)}
              placeholder="Enter SMS Code (Try 123456)" 
              className="text-center tracking-widest text-lg bg-black/20"
              maxLength={6}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading || phoneOtp.length < 6}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Phone"}
            </Button>
          </form>
        </div>
      )}

      {cnicStep && (
        <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-sm font-semibold">Phone Verified</p>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
            <Fingerprint className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">CNIC Background Check</p>
              <p className="text-xs text-muted-foreground">Running against secure database.</p>
            </div>
          </div>
          
          <Button onClick={handleCnicVerify} className="w-full" variant="outline" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                <ShieldCheck className="w-4 h-4 mr-2" /> Run Database Check
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
