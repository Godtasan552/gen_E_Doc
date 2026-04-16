import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractTags } from "@/lib/docx";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/templates
    const fileName = `${Date.now()}_${file.name}`;
    const uploadPath = path.join(process.cwd(), "public", "templates", fileName);
    
    fs.writeFileSync(uploadPath, buffer);

    // Extract tags
    const tags = extractTags(uploadPath);

    // Save to database
    const template = await prisma.documentTemplate.create({
      data: {
        name: file.name.replace(".docx", ""),
        filePath: fileName,
        fields: JSON.stringify(tags),
      },
    });

    return NextResponse.json({ 
        message: "Template uploaded successfully", 
        id: template.id,
        fields: tags 
    });
  } catch (error: unknown) {
    console.error("Upload Error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
