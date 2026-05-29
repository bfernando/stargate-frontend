'use client';

import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';

type HealthStatus = 'operational' | 'degraded' | 'down';
type Incident = {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  startTime: string;
  endTime?: string;
  impact: string;
};

export default function StatusPage() {
  const [status, setStatus] = useState<HealthStatus>('operational');
  const [uptime, setUptime] = useState(99.98);
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: '1',
      title: 'Webhook Delivery Delays',
      status: 'resolved',
      startTime: new Date(Date.now() - 86400000 * 3).toISOString(),
      endTime: new Date(Date.now() - 86400000 * 2).toISOString(),
      impact: 'Webhooks were delayed by up to 5 minutes',
    },
    {
      id: '2',
      title: 'Payment Processing Slowdown',
      status: 'monitoring',
      startTime: new Date(Date.now() - 3600000).toISOString(),
      impact: 'Payment processing times increased by 20%',
    },
  ]);

  const [history, setHistory] = useState<Array<{ date: string; uptime: number }>>([]);

  useEffect(() => {
    // Generate mock uptime history
    const historyData = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString(),
      uptime: 99.5 + Math.random() * 0.5,
    }));
    setHistory(historyData);
  }, []);

  const getStatusColor = (s: HealthStatus) => {
    switch (s) {
      case 'operational':
        return 'text-mint';
      case 'degraded':
        return 'text-yellow-500';
      case 'down':
        return 'text-red-500';
    }
  };

  const getStatusBg = (s: HealthStatus) => {
    switch (s) {
      case 'operational':
        return 'bg-mint/10';
      case 'degraded':
        return 'bg-yellow-50';
      case 'down':
        return 'bg-red-50';
    }
  };

  const getIncidentColor = (s: Incident['status']) => {
    switch (s) {
      case 'resolved':
        return 'text-slate-500';
      case 'monitoring':
        return 'text-yellow-600';
      case 'investigating':
      case 'identified':
        return 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-ink">Stargate API Status</h1>
          <p className="mt-2 text-slate-600">Real-time status and incident history</p>
        </div>

        {/* Current Status */}
        <Card className={`mb-6 p-6 ${getStatusBg(status)}`}>
          <div className="flex items-center gap-4">
            {status === 'operational' && <CheckCircle className={`${getStatusColor(status)} flex-shrink-0`} size={32} />}
            {status === 'degraded' && <AlertCircle className={`${getStatusColor(status)} flex-shrink-0`} size={32} />}
            {status === 'down' && <AlertCircle className={`${getStatusColor(status)} flex-shrink-0`} size={32} />}
            <div>
              <div className={`text-lg font-semibold ${getStatusColor(status)}`}>
                {status === 'operational' && 'All Systems Operational'}
                {status === 'degraded' && 'Degraded Performance'}
                {status === 'down' && 'Service Down'}
              </div>
              <div className="text-sm text-slate-600">Last updated: {new Date().toLocaleString()}</div>
            </div>
          </div>
        </Card>

        {/* Uptime Stats */}
        <Card className="mb-6 p-6">
          <h2 className="mb-4 text-lg font-semibold text-ink">Uptime</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-slate-600">This Month</div>
              <div className="text-2xl font-bold text-ink">{uptime.toFixed(2)}%</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Last 90 Days</div>
              <div className="text-2xl font-bold text-ink">99.97%</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">All Time</div>
              <div className="text-2xl font-bold text-ink">99.99%</div>
            </div>
          </div>
          <div className="mt-6">
            <div className="mb-2 text-sm font-medium text-slate-700">30-Day History</div>
            <div className="flex gap-1">
              {history.map((day, i) => (
                <div
                  key={i}
                  className={`h-8 flex-1 rounded-sm ${day.uptime > 99.9 ? 'bg-mint' : day.uptime > 99.5 ? 'bg-yellow-300' : 'bg-red-400'}`}
                  title={`${day.date}: ${day.uptime.toFixed(2)}%`}
                />
              ))}
            </div>
          </div>
        </Card>

        {/* Incidents */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-ink">Incident History</h2>
          <div className="space-y-4">
            {incidents.length === 0 ? (
              <div className="text-center text-sm text-slate-500">No incidents reported</div>
            ) : (
              incidents.map((incident) => (
                <div key={incident.id} className="border-l-4 border-slate-200 pl-4 py-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-ink">{incident.title}</div>
                      <div className={`text-sm font-medium ${getIncidentColor(incident.status)}`}>
                        {incident.status === 'resolved' && '✓ Resolved'}
                        {incident.status === 'monitoring' && '⏱ Monitoring'}
                        {incident.status === 'investigating' && '🔍 Investigating'}
                        {incident.status === 'identified' && '⚠ Identified'}
                      </div>
                      <div className="mt-1 text-sm text-slate-600">{incident.impact}</div>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <div>{new Date(incident.startTime).toLocaleDateString()}</div>
                      {incident.endTime && <div>{new Date(incident.endTime).toLocaleDateString()}</div>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-600">
          <p>Subscribe to updates at <span className="font-mono">status@stargate.dev</span></p>
        </div>
      </div>
    </div>
  );
}
