import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractTags } from "@/lib/docx";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure upload directory exists
    const templateDir = path.join(process.cwd(), "public", "templates");
    if (!fs.existsSync(templateDir)) {
      fs.mkdirSync(templateDir, { recursive: true });
    }

    const fileName = `${Date.now()}_${file.name}`;
    const uploadPath = path.join(templateDir, fileName);
    
    fs.writeFileSync(uploadPath, buffer);

    // Extract tags with context (returns DocumentField[])
    const fields = extractTags(uploadPath);

    // Save to database
    const template = await prisma.documentTemplate.create({
      data: {
        name: file.name.replace(".docx", ""),
        filePath: fileName,
        fields: JSON.stringify(fields), // Now stores the array of objects
      },
    });

    return NextResponse.json({ 
        message: "Template uploaded and analyzed successfully", 
        id: template.id,
        fields: fields 
    });
  } catch (error: unknown) {
    console.error("Upload Error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
