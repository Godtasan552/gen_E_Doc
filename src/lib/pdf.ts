import libre from "libreoffice-convert";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const convertAsync = promisify(libre.convert);

/**
 * Converts a DOCX buffer to a PDF buffer using LibreOffice.
 * This provides 100% layout preservation as it uses the actual LibreOffice engine.
 */
export async function convertToPdf(docxBuffer: Buffer): Promise<Buffer> {
    try {
        // Find LibreOffice path from environment or use default
        // On Windows, libreoffice-convert tries to find it automatically, 
        // but we can specify it if it's in a custom location.
        const sofficePath = process.env.LIBREOFFICE_PATH;
        
        console.log("--- DEBUG: PDF Conversion Start (LibreOffice) ---");
        if (sofficePath) {
            console.log("Using LibreOffice at:", sofficePath);
        }

        // Convert the document
        // .pdf is the output extension
        const pdfBuffer = await convertAsync(docxBuffer, ".pdf", undefined);

        return pdfBuffer;
    } catch (error: unknown) {
        console.error("Error converting DOCX to PDF (LibreOffice):", error);
        
        // Fallback or better error message
        const message = error instanceof Error ? error.message : "Internal conversion error";
        throw new Error(`PDF Conversion Failed: Ensure LibreOffice is installed and path is correct. Details: ${message}`);
    }
}
