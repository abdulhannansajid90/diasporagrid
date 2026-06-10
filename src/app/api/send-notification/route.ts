import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subject, message, actionType } = await req.json();

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });

    if (process.env.RESEND_API_KEY && user?.email) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      let html = `<p>${message}</p>`;
      
      if (actionType === 'WAGE_THEFT') {
        html = `
          <h2 style="color: #dc2626;">Wage Theft Report Submitted</h2>
          <p><strong>Worker:</strong> ${user.name} (${user.cnic})</p>
          <p>${message}</p>
          <p>This report has been forwarded to the Ministry of Labor portal.</p>
        `;
      } else if (actionType === 'REMITTANCE') {
        html = `
          <h2 style="color: #10b981;">Remittance Receipt</h2>
          <p><strong>Sender:</strong> ${user.name}</p>
          <p>${message}</p>
          <p>Thank you for using legal channels via Ghar-Wallet.</p>
        `;
      }

      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: user.email,
        subject: subject,
        html: html
      });
      
      console.log(`[Resend] Sent ${actionType} notification to ${user.email}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification Error:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
