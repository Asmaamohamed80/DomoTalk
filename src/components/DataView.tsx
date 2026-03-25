// src/components/DataView.tsx
import React from 'react';
import { FileData } from '../types/app';

interface DataViewProps {
  fileData: FileData;
}

export default function DataView({ fileData }: DataViewProps) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 16, overflow: 'hidden' }}>
      <h2 style={{ marginBottom: 8 }}>Imported Data</h2>
      <p style={{ marginBottom: 16, color: '#666' }}>{fileData.name}</p>

      <div style={{ overflowX: 'auto', maxHeight: '600px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {fileData.headers.map((header) => (
                <th
                  key={header}
                  style={{
                    textAlign: 'left',
                    padding: '10px',
                    borderBottom: '1px solid #ddd',
                    background: '#f5f5f5',
                    position: 'sticky',
                    top: 0,
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {fileData.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    style={{
                      padding: '10px',
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
