import { FileData } from '@/types/app';

export function parseCSV(text: string, fileName: string): FileData {
  const lines = text.trim().split('\n');
  if (lines.length === 0) return { name: fileName, headers: [], rows: [] };

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = lines.slice(1).map(line =>
    line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
  );

  return { name: fileName, headers, rows };
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function fileToJSON(data: FileData): object[] {
  return data.rows.map(row => {
    const obj: Record<string, string> = {};
    data.headers.forEach((h, i) => { obj[h] = row[i] || ''; });
    return obj;
  });
}
