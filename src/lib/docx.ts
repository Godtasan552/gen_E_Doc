import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import path from "path";

/**
 * Extracts all placeholders in the format {variable} from a .docx file.
 */
export function extractTags(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "binary");
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    delimiters: { start: "{", end: "}" },
  });

  const text = zip.files["word/document.xml"].asText();
  // Regex to find content inside { }
  // Note: Word sometimes splits tags with XML tags like <w:t>{<w:t> <w:t>name<w:t> <w:t>}<w:t>
  // A better way is to use docxtemplater's internal mechanism if possible, 
  // but for simple cases, we can try to clean the XML or use a more robust regex.
  
  // High-level extraction strategy:
  const tags = new Set<string>();
  const regex = /\{([^}]+)\}/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
      // Clean tag from any potential XML tags inside
      const cleanTag = match[1].replace(/<[^>]+>/g, "").trim();
      if (cleanTag && !cleanTag.includes(" ")) {
          tags.add(cleanTag);
      }
  }

  return Array.from(tags);
}

/**
 * Fills a .docx template with the provided data.
 * Returns a Buffer of the filled document.
 */
export function fillTemplate(templatePath: string, data: Record<string, any>): Buffer {
  const content = fs.readFileSync(templatePath, "binary");
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.render(data);

  return doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });
}
