// src/components/DashboardView.tsx
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { DashboardAnalysis } from '../types/app';

interface DashboardViewProps {
  analysis: DashboardAnalysis;
}

export default function DashboardView({ analysis }: DashboardViewProps) {
  const firstMetric = analysis.numericHeaders[0];
  const secondMetric = analysis.numericHeaders[1];

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {analysis.kpis.map((kpi) => (
          <div
            key={kpi.label}
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 16,
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            }}
          >
            <div style={{ fontSize: 14, color: '#666' }}>{kpi.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {firstMetric && (
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}
        >
          <h3 style={{ marginBottom: 12 }}>{firstMetric} Overview</h3>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={analysis.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey={firstMetric} fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {secondMetric && (
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: 16,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}
        >
          <h3 style={{ marginBottom: 12 }}>{secondMetric} Trend</h3>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={analysis.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey={secondMetric} stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
