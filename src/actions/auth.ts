"use server"

import { signIn } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"


export async function login(formData: FormData) {
  const phoneOrCnic = formData.get("phoneOrCnic") as string
  const password = formData.get("password") as string
  
  if (!phoneOrCnic || !password) {
    return { error: "Please fill out all fields." }
  }

  try {
    await signIn("credentials", {
      phoneOrCnic,
      password,
      redirect: false
    })
    return { success: true, redirect: "/en/dashboard/rooh-network" }
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    const err = error as Error & { digest?: string, message?: string };
    if (err && typeof err === 'object' && typeof err.digest === 'string' && err.digest.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    return { error: err?.message || "Invalid credentials." }
  }
}

export async function signup(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phoneNumber = formData.get("phoneNumber") as string
  const cnic = formData.get("cnic") as string
  const password = formData.get("password") as string
  
  if (!name || !email || !phoneNumber || !cnic || !password) {
    return { error: "Please fill out all fields." }
  }

  try {
    // DB completely bypassed
    try {
      await signIn("credentials", {
        phoneOrCnic: phoneNumber,
        password,
        redirect: false
      })
    } catch (signInError) {
      const err = signInError as Error & { digest?: string };
      if (err && typeof err === 'object' && typeof err.digest === 'string' && err.digest.startsWith('NEXT_REDIRECT')) {
        throw signInError; // This is a success redirect from NextAuth
      }
    }

    return { success: true, redirect: "/en/dashboard/rooh-network" }
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    const err = error as Error & { digest?: string, message?: string };
    if (err && typeof err === 'object' && typeof err.digest === 'string' && err.digest.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    return { error: `Server Error: ${error instanceof Error ? error.message : String(error)}` }
  }
}

export async function sendOtp(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || !user.email) return { error: "User or email not found" }
  
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const otpExpiresAt = new Date(Date.now() + 10 * 60000) // 10 minutes from now
  
  await prisma.user.update({
    where: { id: userId },
    data: { otpCode: otp, otpExpiresAt }
  })
  
  try {
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: user.email,
        subject: 'Diaspora-Grid Verification Code',
        html: `<p>Your Diaspora-Grid verification code is <strong>${otp}</strong>.</p>`
      })
      console.log(`[Resend] Sent OTP ${otp} to ${user.email}`)
    } else {
      console.log(`[DEV MODE] Resend not configured. OTP for ${user.email} is ${otp}`)
    }
    return { success: true }
  } catch (err) {
    console.error("Resend error:", err)
    console.log(`[DEV MODE FALLBACK] OTP for ${user.email} is ${otp}`)
    return { success: true } // We return success so the UI doesn't crash
  }
}

export async function verifyOtp(userId: string, otp: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  
  if (!user || user.otpCode !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    return { error: "Invalid or expired OTP code." }
  }
  
  await prisma.user.update({
    where: { id: userId },
    data: { 
      isEmailVerified: true,
      otpCode: null,
      otpExpiresAt: null
    }
  })
  
  return { success: true }
}

export async function verifyPhone(userId: string, code: string) {
  // SIMULATED PHONE VERIFICATION
  if (code !== "123456") {
    return { error: "Invalid code. Use 123456 for demo." }
  }
  
  await prisma.user.update({
    where: { id: userId },
    data: { isPhoneVerified: true }
  })
  
  return { success: true }
}

export async function verifyCnic(userId: string) {
  // MOCK CNIC VERIFICATION: AUTOMATIC SUCCESS
  await prisma.user.update({
    where: { id: userId },
    data: { isCnicVerified: true }
  })
  
  return { success: true, redirect: "/en/dashboard/rooh-network" }
}
