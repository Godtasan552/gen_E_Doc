import libre from 'libreoffice-convert';
import { promisify } from 'util';
import path from 'path';

const convertAsync = promisify(libre.convert);

/**
 * Converts a DOCX buffer to a PDF buffer using LibreOffice.
 */
export async function convertToPdf(docxBuffer: Buffer): Promise<Buffer> {
    try {
        // The convert function takes (buffer, format, undefined, callback)
        const pdfBuffer = await convertAsync(docxBuffer, '.pdf', undefined);
        return pdfBuffer;
    } catch (error) {
        console.error('Error converting DOCX to PDF:', error);
        throw new Error('Failed to convert document to PDF. Ensure LibreOffice is installed.');
    }
}
