import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fillTemplate } from "@/lib/docx";
import { convertToPdf } from "@/lib/pdf";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { templateId, data } = await req.json();

    if (!templateId || !data) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const template = await prisma.documentTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const templatePath = path.join(process.cwd(), "public", "templates", template.filePath);
    
    // 1. Fill DOCX
    const filledDocxBuffer = fillTemplate(templatePath, data);

    // 2. Convert to PDF
    const pdfBuffer = await convertToPdf(filledDocxBuffer);

    // 3. Save Submission to DB
    await prisma.submission.create({
        data: {
            templateId: templateId,
            data: JSON.stringify(data),
        }
    });

    // 4. Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${template.name}_filled.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
