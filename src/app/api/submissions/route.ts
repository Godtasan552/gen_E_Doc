import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const submissions = await prisma.submission.findMany({
      include: {
        template: {
          select: {
            name: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(submissions);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
