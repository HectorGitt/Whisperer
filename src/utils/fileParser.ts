/**
 * File Parser Utility
 * Handles parsing of PDF, TXT, and Markdown files
 */

import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set worker path for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export interface ParsedFile {
  content: string;
  title?: string;
}

/**
 * Parse a text file
 */
async function parseTextFile(file: File): Promise<ParsedFile> {
  const content = await file.text();
  return {
    content: content.trim(),
    title: file.name.replace(/\.(txt|md)$/i, ''),
  };
}

/**
 * Parse a markdown file
 */
async function parseMarkdownFile(file: File): Promise<ParsedFile> {
  const content = await file.text();
  
  // Extract title from first # heading if present
  const lines = content.split('\n');
  let title = file.name.replace(/\.md$/i, '');
  let contentWithoutTitle = content;
  
  if (lines[0]?.startsWith('# ')) {
    title = lines[0].replace(/^#\s+/, '').trim();
    contentWithoutTitle = lines.slice(1).join('\n').trim();
  }
  
  return {
    content: contentWithoutTitle,
    title,
  };
}

/**
 * Parse a PDF file
 */
async function parsePDFFile(file: File): Promise<ParsedFile> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  
  // Extract text from all pages
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n\n';
  }
  
  return {
    content: fullText.trim(),
    title: file.name.replace(/\.pdf$/i, ''),
  };
}

/**
 * Parse a file based on its type
 */
export async function parseFile(file: File): Promise<ParsedFile> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'txt':
      return parseTextFile(file);
    case 'md':
    case 'markdown':
      return parseMarkdownFile(file);
    case 'pdf':
      return parsePDFFile(file);
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
}

/**
 * Validate file type
 */
export function isValidFileType(file: File): boolean {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return ['txt', 'md', 'markdown', 'pdf'].includes(extension || '');
}

/**
 * Get accepted file types for input
 */
export const ACCEPTED_FILE_TYPES = '.txt,.md,.markdown,.pdf';
