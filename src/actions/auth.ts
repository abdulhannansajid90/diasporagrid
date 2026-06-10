"use server"

import { signIn } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
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
    
    let formattedCnic = phoneOrCnic;
    if (/^\d{13}$/.test(phoneOrCnic)) {
      formattedCnic = `${phoneOrCnic.slice(0, 5)}-${phoneOrCnic.slice(5, 12)}-${phoneOrCnic.slice(12)}`;
    }

    // Check verification status
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ phoneNumber: phoneOrCnic }, { cnic: phoneOrCnic }, { cnic: formattedCnic }, { email: phoneOrCnic }]
      }
    })
    
    if (user && (!user.isEmailVerified || !user.isPhoneVerified || !user.isCnicVerified)) {
      return { success: true, redirect: "/en/verify" }
    }
    
    return { success: true, redirect: "/en/dashboard/rooh-network" }
  } catch {
    return { error: "Invalid credentials." }
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

  let formattedCnic = cnic;
  if (/^\d{13}$/.test(cnic)) {
    formattedCnic = `${cnic.slice(0, 5)}-${cnic.slice(5, 12)}-${cnic.slice(12)}`;
  }

  // Prevent common email typos
  const emailLower = email.toLowerCase();
  const commonTypos = ['gmaill.com', 'gmail.con', 'yaho.com', 'yahoo.con', 'hotmai.com', 'gmal.com'];
  for (const typo of commonTypos) {
    if (emailLower.endsWith(`@${typo}`)) {
      return { error: `It looks like there's a typo in your email domain (@${typo}). Did you mean something else?` };
    }
  }

  // CNIC basic regex validation (format: XXXXX-XXXXXXX-X)
  const cnicRegex = /^\d{5}-\d{7}-\d$/
  if (!cnicRegex.test(formattedCnic)) {
    return { error: "Invalid CNIC format. Use XXXXX-XXXXXXX-X or 13 digits" }
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ phoneNumber }, { cnic: formattedCnic }, { email }]
      }
    })

    if (existingUser) {
      return { error: "Email, Phone number, or CNIC already registered." }
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        cnic: formattedCnic,
        passwordHash
      }
    })
    
    // Automatically log them in
    await signIn("credentials", {
      phoneOrCnic: phoneNumber,
      password,
      redirect: false
    })

    return { success: true, redirect: "/en/verify" }
  } catch {
    return { error: "Failed to create account." }
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
