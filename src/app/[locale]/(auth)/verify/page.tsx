import VerifyForm from "@/components/auth/VerifyForm"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function VerifyPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/en/login")
  }

  const isEmailVerified = session.user.isEmailVerified
  const isPhoneVerified = session.user.isPhoneVerified
  const isCnicVerified = session.user.isCnicVerified

  if (isEmailVerified && isPhoneVerified && isCnicVerified) {
    redirect("/en/dashboard/rooh-network")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 mix-blend-screen animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-50 mix-blend-screen animate-pulse delay-1000" />
      
      <div className="relative z-10 w-full">
        <VerifyForm 
          userId={session.user.id!} 
          isEmailVerified={isEmailVerified}
          isPhoneVerified={isPhoneVerified} 
          isCnicVerified={isCnicVerified} 
        />
      </div>
    </div>
  )
}
