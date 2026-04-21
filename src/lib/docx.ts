import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";

export interface DocumentField {
  tag: string;
  label: string;
  context?: string;
  isDotLine?: boolean;
}

/**
 * Extracts all placeholders from a .docx file.
 */
export function extractTags(filePath: string): DocumentField[] {
  const content = fs.readFileSync(filePath);
  const zip = new PizZip(content);
  
  const xmlFiles = ["word/document.xml", "word/header1.xml", "word/header2.xml", "word/footer1.xml", "word/footer2.xml"];
  const fieldsMap = new Map<string, DocumentField>();
  let dotLineCounter = 0;
  
  xmlFiles.forEach(file => {
    if (zip.files[file]) {
      const text = zip.files[file].asText();
      
      // 1. Detect {tags} 
      const curlyRegex = /(?:>([^<]{1,100})<[^>]*?)?\{([^}]+)\}/g;
      let match;
      while ((match = curlyRegex.exec(text)) !== null) {
          const rawContext = match[1] || "";
          const tag = match[2].replace(/<[^>]+>/g, "").trim();
          if (tag && !tag.includes(" ") && tag.length < 100) {
              if (!fieldsMap.has(tag)) {
                  fieldsMap.set(tag, { tag, label: cleanContext(rawContext) || formatTag(tag), context: rawContext.trim() });
              }
          }
      }

      // 2. Detect dotted lines (5 or more dots/underscores)
      const dotRegex = />([^<]*?([.]{5,}|[_]{5,})[^<]*?)</g;
      while ((match = dotRegex.exec(text)) !== null) {
          const fullText = match[1];
          const labelPart = fullText.split(/[.]{3,}|[_]{3,}/)[0].trim();
          const tag = `dot_field_${++dotLineCounter}`;
          fieldsMap.set(tag, { tag, label: labelPart || `Field ${dotLineCounter}`, isDotLine: true, context: fullText });
      }
    }
  });

  return Array.from(fieldsMap.values());
}

/**
 * Fills a .docx template with the provided data.
 * Replaces both {tags} and handles "Dotted Lines" by pre-processing the XML.
 */
export function fillTemplate(templatePath: string, data: Record<string, unknown>): Buffer {
  const content = fs.readFileSync(templatePath);
  const zip = new PizZip(content);
  
  // High-Fidelity Pre-processing for Dotted Lines
  const xmlFiles = ["word/document.xml", "word/header1.xml", "word/footer1.xml"];
  let dotLineCounter = 0;

  xmlFiles.forEach(file => {
    if (zip.files[file]) {
        let xml = zip.files[file].asText();
        
        // Find dotted lines and replace them with a bracket tag {dot_field_X}
        // This allows docxtemplater to handle the actual replacement
        xml = xml.replace(/([.]{5,}|[_]{5,})/g, (match) => {
            const tag = `dot_field_${++dotLineCounter}`;
            if (data[tag]) {
                return `{${tag}}`;
            }
            return match; // Keep dots if no data provided
        });

        zip.file(file, xml);
    }
  });

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.setData(data);

  try {
    doc.render();
  } catch (error: unknown) {
    console.error("Docxtemplater Render Error:", error);
    throw error;
  }

  return doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });
}

function cleanContext(ctx: string): string {
    return ctx.replace(/[:：]/g, "").trim().substring(0, 50);
}

function formatTag(tag: string): string {
    return tag.replace(/_/g, " ").replace(/([A-Z])/g, " $1").trim();
}
