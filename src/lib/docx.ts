import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";

/**
 * Extracts all placeholders in the format {variable} from a .docx file.
 * Improved to handle XML splitting by cleaning the XML first.
 */
export function extractTags(filePath: string): string[] {
  const content = fs.readFileSync(filePath);
  const zip = new PizZip(content);
  
  // We need to look at all XML files that might contain tags
  const xmlFiles = ["word/document.xml", "word/header1.xml", "word/header2.xml", "word/footer1.xml", "word/footer2.xml"];
  const tags = new Set<string>();
  
  xmlFiles.forEach(file => {
    if (zip.files[file]) {
      const text = zip.files[file].asText();
      // Clean XML to find tags that might be split across multiple <w:t> tags
      // This is a common issue in Word
      const regex = /\{([^}]+)\}/g;
      let match;
      while ((match = regex.exec(text)) !== null) {
          const cleanTag = match[1].replace(/<[^>]+>/g, "").trim();
          if (cleanTag && !cleanTag.includes(" ") && cleanTag.length < 100) {
              tags.add(cleanTag);
          }
      }
    }
  });

  return Array.from(tags);
}

/**
 * Fills a .docx template with the provided data.
 * Returns a Buffer of the filled document.
 */
export function fillTemplate(templatePath: string, data: Record<string, unknown>): Buffer {
  const content = fs.readFileSync(templatePath);
  const zip = new PizZip(content);
  
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  // IMPORTANT: For modern Word documents, tags are often split by XML tags.
  // We use the data as provided.
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
