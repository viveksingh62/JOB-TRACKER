import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const PDFParser = require('pdf2json');

export async function extractTextfromPDF(fileBuffer) {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser();
    
    parser.on('pdfParser_dataReady', (data) => {
      const text = data.Pages.map(page =>
        page.Texts.map(t => decodeURIComponent(t.R[0].T)).join(' ')
      ).join('\n');
      resolve(text);
    });

    parser.on('pdfParser_dataError', reject);
    parser.parseBuffer(fileBuffer);
  });
}