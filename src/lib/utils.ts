import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DashboardAnalysis, FileData , KPIItem }from '../types/app';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


function toNumber(value: string): number | null {
  if (!value) return null;

  const cleaned = value
    .toString()
    .trim()
    .replace(/,/g, '')
    .replace('%', '');

  if (cleaned === '') return null;

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

export function analyzeFile(fileData: FileData): DashboardAnalysis {
  const numericHeaders = fileData.headers.filter((header, colIndex) => {
    return fileData.rows.some((row) => toNumber(row[colIndex]) !== null);
  });

  const chartData = fileData.rows.map((row, rowIndex) => {
    const item: Record<string, string | number> = {
      name: row[0] || `Row ${rowIndex + 1}`,
    };

    fileData.headers.forEach((header, colIndex) => {
      const numericValue = toNumber(row[colIndex]);
      if (numericValue !== null) {
        item[header] = numericValue;
      }
    });

    return item;
  });

  const kpis: KPIItem[] = [
    { label: 'Rows', value: fileData.rows.length },
    { label: 'Columns', value: fileData.headers.length },
    { label: 'Numeric Fields', value: numericHeaders.length },
  ];

  numericHeaders.slice(0, 3).forEach((header) => {
    const colIndex = fileData.headers.indexOf(header);
    const values = fileData.rows
      .map((row) => toNumber(row[colIndex]))
      .filter((value): value is number => value !== null);

    if (values.length > 0) {
      const sum = values.reduce((acc, val) => acc + val, 0);
      const avg = sum / values.length;

      kpis.push({
        label: `${header} Avg`,
        value: Number(avg.toFixed(2)),
      });
    }
  });

  return {
    chartData,
    numericHeaders,
    kpis,
  };
}

