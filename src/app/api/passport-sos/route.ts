import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Since we're simulating the location for now, we'll hardcode it as "Dubai, UAE"
    const location = "Dubai, UAE";

    const report = await prisma.passportSOSReport.create({
      data: {
        userId: session.user.id,
        location,
        status: "ACTIVE",
      },
    });

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });

    if (process.env.RESEND_API_KEY && user?.email) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: user.email,
        subject: `🚨 URGENT: PASSPORT CONFISCATION SOS - ${user.name}`,
        html: `
          <h2 style="color: red;">PASSPORT CONFISCATION SOS TRIGGERED</h2>
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Phone / CNIC:</strong> ${user.phoneNumber} / ${user.cnic}</p>
          <p><strong>Location:</strong> ${location}</p>
          <p>This is an automated legal alert from the Diaspora-Grid system. The user has reported that their passport has been illegally confiscated by their employer. This report has been anchored to the blockchain.</p>
        `
      });
      console.log(`[Resend] Sent SOS Alert to ${user.email}`);
    }

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("Passport SOS Error:", error);
    return NextResponse.json(
      { error: "Failed to create SOS report" },
      { status: 500 }
    );
  }
}
