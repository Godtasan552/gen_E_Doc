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
    
    console.log("--- DEBUG: Generation Start ---");
    console.log("Template ID:", templateId);
    console.log("Expected Fields (from DB):", template.fields);
    console.log("Received Data (from UI):", JSON.stringify(data, null, 2));

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
    const encodedFilename = encodeURIComponent(`${template.name}_filled.pdf`);
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodedFilename}`,
      },
    });
  } catch (error: unknown) {
    console.error("Generation Error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
