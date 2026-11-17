import { archiveExtensions, documentExtension } from '@/lib/document-formats';
const pdf = { url: '/__l5e/assets-v1/60364b82-fc23-48ce-8e68-bc7ac36fa169/e3f2c139-pdf.webp' };
const word = { url: '/__l5e/assets-v1/2e43b433-2488-4588-8fac-9fc2f44b1137/cd164d7b-word.webp' };
const excel = { url: '/__l5e/assets-v1/518d68b5-28b9-421f-8509-637ab43f9aa1/76c3c917-excel.webp' };
const powerpoint = { url: '/__l5e/assets-v1/50ab4b4f-101a-4fe1-baee-226e4b53d843/995dbb07-powerpoint.webp' };
const archive = { url: '/__l5e/assets-v1/e9a9a044-43e9-4f92-b8ac-44708eb48b71/e3e38388-archive.webp' };
const rtf = { url: '/__l5e/assets-v1/c650618c-8009-4d36-9f4d-2fc5b34437e9/03dc7ab4-rtf.png' };
const txt = { url: '/__l5e/assets-v1/c2ca0655-fa22-4f22-820c-d7d1efa406d5/cd7794b8-txt.webp' };

const placeholders = { pdf, word, excel, powerpoint, archive, rtf, txt };

export function documentPlaceholder(url: string) {
  const extension = documentExtension(url);
  if (extension === 'pdf') return placeholders.pdf;
  if (['doc', 'docx'].includes(extension)) return placeholders.word;
  if (['xls', 'xlsx'].includes(extension)) return placeholders.excel;
  if (['ppt', 'pptx', 'pps', 'ppsx'].includes(extension)) return placeholders.powerpoint;
  if (extension === 'rtf') return placeholders.rtf;
  if (extension === 'txt') return placeholders.txt;
  if (archiveExtensions.includes(extension)) return placeholders.archive;
  return null;
}
