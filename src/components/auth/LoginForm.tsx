"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { login } from "@/actions/auth"
import { Fingerprint, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [phoneOrCnic, setPhoneOrCnic] = useState("")
  const [password, setPassword] = useState("")

  const handleDemoLogin = () => {
    setPhoneOrCnic("+971501234567")
    setPassword("password123")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else if (result?.redirect) {
      router.push(result.redirect)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-card border border-border shadow-2xl">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
        <p className="text-muted-foreground mt-2 text-sm">Log in to your Diaspora-Grid dashboard.</p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email, Phone or CNIC</label>
          <div className="relative">
            <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input name="phoneOrCnic" value={phoneOrCnic} onChange={(e) => setPhoneOrCnic(e.target.value)} className="pl-10 bg-black/20" placeholder="user@example.com, +9715... or 12345..." required />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 bg-black/20" placeholder="••••••••" required />
          </div>
        </div>

        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
            <>
              Login <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
        <p className="text-sm text-muted-foreground mb-2">Want to skip registration?</p>
        <Button type="button" variant="outline" size="sm" onClick={handleDemoLogin} className="w-full text-xs h-8 border-primary/30 hover:bg-primary/20 text-white">
          Auto-fill Demo Account
        </Button>
      </div>

      <div className="mt-6">
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">New to Diaspora-Grid?</span>
          </div>
        </div>
        <Link href="/en/signup" className="w-full flex">
          <Button type="button" variant="outline" className="w-full">
            Create an Account
          </Button>
        </Link>
      </div>
    </div>
  )
}
