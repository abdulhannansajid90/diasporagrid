import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Resolve the active SOS report
    await prisma.passportSOSReport.updateMany({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
      data: {
        status: "RESOLVED"
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Passport SOS Cancel Error:", error);
    return NextResponse.json(
      { error: "Failed to cancel SOS report" },
      { status: 500 }
    );
  }
}
