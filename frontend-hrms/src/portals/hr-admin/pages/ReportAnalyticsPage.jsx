import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BarChart3, Download, TrendingUp } from 'lucide-react';
import {
  dummyChartDays,
  dummyInternshipOverview,
  dummyMetrics,
  dummyUniversities,
} from '../../../common/utils/mockAuth.js';
import GenerateReportModal from './GenerateReportModal';

const METRIC_STYLES = [
  {
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-200',
    iconText: 'text-emerald-600',
  },
  {
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-200',
    iconText: 'text-amber-600',
  },
  {
    border: 'border-rose-200',
    bg: 'bg-rose-50',
    iconBg: 'bg-rose-200',
    iconText: 'text-rose-600',
  },
];

const OVERVIEW_TICKS = [0, 10, 20, 30, 40, 50];
const OVERVIEW_MAX = 50;
const OVERVIEW_HEIGHT = 260;
const OVERVIEW_SERIES = [
  { key: 'finalizing', label: 'Finalizing', color: '#fb7185', text: 'text-rose-600' },
  { key: 'incoming', label: 'Incoming', color: '#fde047', text: 'text-amber-600' },
  { key: 'active', label: 'Active', color: '#6ee7b7', text: 'text-emerald-600' },
];
const LINE_COLORS = ['#4f46e5', '#8b5cf6', '#6ee7b7'];

export default function ReportsAndAnalytics() {
  const [showGenerateReport, setShowGenerateReport] = useState(false);
  const location = useLocation();
  const metrics = dummyMetrics;
  const internshipOverview = dummyInternshipOverview;
  const universities = dummyUniversities;
  const chartDays = dummyChartDays;

  const total = useMemo(() => universities.reduce((sum, item) => sum + item.value, 0), [universities]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("action") === "generate-report") {
      setShowGenerateReport(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Reports &amp; Analytics</h1>
          <p className="mt-1 text-xs text-slate-400">Performance Tracking</p>
        </div>
        <button
          onClick={() => setShowGenerateReport(true)}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
        >
          <TrendingUp size={15} />
          Generate Report
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {metrics.slice(0, 3).map((metric, index) => {
          const style = METRIC_STYLES[index] || METRIC_STYLES[0];
          return (
            <div
              key={metric.label}
              className={`rounded-2xl border ${style.border} ${style.bg} px-5 py-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)]`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">{metric.label}</p>
                  <p className="mt-1 text-3xl font-semibold text-slate-900">{metric.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${style.iconBg}`}>
                  <BarChart3 size={16} className={style.iconText} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/** Internship Overview 
      <section className="rounded-2xl border border-slate-200 bg-white px-7 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-slate-900">
            Internship Overview (Incoming, Active and Finalizing)
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex h-9 items-center gap-2 rounded-xl bg-violet-500 px-4 text-sm font-medium text-white transition hover:bg-violet-600">
              <Download size={14} />
              Export
            </button>
            <select className="h-9 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none">
              <option>All Department</option>
            </select>
            <select className="h-9 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none">
              <option>Week</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-hidden pb-1">
          <div className="min-w-[1120px]">
            <div className="relative h-[260px] pl-11 pr-4">
              <div className="absolute bottom-0 left-11 right-4 border-b border-slate-300" />
              <div className="absolute bottom-0 left-11 top-0 border-l border-slate-300" />

              <div className="pointer-events-none absolute inset-y-0 left-11 right-4 h-[260px]">
                {OVERVIEW_TICKS.map((tick) => {
                  const y = ((OVERVIEW_MAX - tick) / OVERVIEW_MAX) * OVERVIEW_HEIGHT;
                  return (
                    <div
                      key={`tick-${tick}`}
                      className="absolute left-0 right-0 border-t border-dashed border-slate-300/70"
                      style={{ top: `${y}px` }}
                    />
                  );
                })}
                {internshipOverview.slice(0, -1).map((_, index) => (
                  <div
                    key={`column-${index}`}
                    className="absolute top-0 bottom-0 border-l border-dashed border-slate-300/50"
                    style={{ left: `${((index + 1) / internshipOverview.length) * 100}%` }}
                  />
                ))}
              </div>

              {OVERVIEW_TICKS.map((tick) => {
                const y = ((OVERVIEW_MAX - tick) / OVERVIEW_MAX) * OVERVIEW_HEIGHT;
                return (
                  <span
                    key={`label-${tick}`}
                    className="absolute left-0 -translate-y-1/2 text-[11px] font-medium text-slate-500"
                    style={{ top: `${y}px` }}
                  >
                    {tick}
                  </span>
                );
              })}

              <div
                className="relative grid h-full items-end gap-5"
                style={{ gridTemplateColumns: `repeat(${internshipOverview.length}, minmax(0, 1fr))` }}
              >
                {internshipOverview.map((item) => (
                  <div key={item.label} className="flex min-w-0 justify-center">
                    <div className="flex h-[260px] w-14 flex-col-reverse justify-start">
                      {OVERVIEW_SERIES.map((series) => {
                        const rawValue = Number(item[series.key]) || 0;
                        const height = (rawValue / OVERVIEW_MAX) * OVERVIEW_HEIGHT;
                        return (
                          <div
                            key={`${item.label}-${series.key}`}
                            className="flex items-center justify-center text-[10px] font-semibold"
                            style={{
                              height: `${Math.max(height, 0)}px`,
                              backgroundColor: series.color,
                              color: height > 15 ? '#334155' : 'transparent',
                              minHeight: height > 0 ? '1px' : '0px',
                            }}
                            title={`${series.label}: ${rawValue}`}
                          >
                            {height > 15 ? rawValue : ''}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="grid gap-5 pl-11 pr-4 pt-3"
              style={{ gridTemplateColumns: `repeat(${internshipOverview.length}, minmax(0, 1fr))` }}
            >
              {internshipOverview.map((item) => (
                <span
                  key={`x-label-${item.label}`}
                  className="mx-auto min-h-8 max-w-[118px] text-center text-[11px] font-medium leading-tight text-slate-600"
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-6">
          {OVERVIEW_SERIES.map((series) => (
            <div key={series.key} className="flex items-center gap-2 text-[12px] text-slate-600">
              <span className="h-2 w-2 rounded-[2px]" style={{ backgroundColor: series.color }} />
              {series.label}
            </div>
          ))}
        </div>
      </section>**/}

      {/* Interns by University */}
      <section className="rounded-2xl border border-slate-200 bg-white px-7 py-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-slate-900">Interns by University</h2>
          <div className="flex items-center gap-2">
            <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-500 px-5 text-sm font-medium text-white transition hover:bg-violet-600">
              <Download size={14} />
              Export
            </button>
            <select className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none">
              <option>Week</option>
            </select>
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-center">
          <div className="flex justify-center lg:justify-start lg:pl-8">
            <div className="relative h-48 w-48">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3.8" />
                {(() => {
                  let cumulative = 0;

                  return universities.map((item) => {
                    const percent = (item.value / total) * 100;
                    const circle = (
                      <circle
                        key={item.name}
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="3.8"
                        strokeDasharray={`${percent} ${100 - percent}`}
                        strokeDashoffset={-cumulative}
                      />
                    );

                    cumulative += percent;
                    return circle;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[18px] font-semibold text-slate-800">{total}</span>
              </div>
            </div>
          </div>

          <div className="space-y-5 pt-1">
            {universities.map((item) => (
              <div key={item.name} className="flex items-center gap-3 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                <span className="h-10 w-1 rounded-full" style={{ backgroundColor: item.color }} />
                <p className="text-[14px] font-medium text-slate-700">{item.name || 'Unknown University'}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
          
      {/* Task Completion Rate */}
      <section className="rounded-2xl border border-slate-200 bg-white px-7 py-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-slate-900">Task Completion Rate</h2>
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-500 px-5 text-sm font-medium text-white transition hover:bg-violet-600">
              <Download size={14} />
              Export
            </button>
            <select className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none">
              <option>All Department</option>
            </select>
            <select className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none">
              <option>Week</option>
            </select>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_170px] xl:items-start">
          <div className="min-w-0">
            <svg viewBox="0 0 620 270" className="h-[320px] w-full">
              <defs>
                {LINE_COLORS.map((color, index) => (
                  <linearGradient key={color} id={`completion-gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.85" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.08" />
                  </linearGradient>
                ))}
              </defs>

              {[0, 20, 40, 60, 80, 100].map((tick) => {
                const y = 230 - (tick / 100) * 185;
                return (
                  <g key={`line-${tick}`}>
                    <line x1="38" y1={y} x2="548" y2={y} stroke="#94a3b8" strokeDasharray="2 3" strokeOpacity="0.65" />
                    <text x="26" y={y + 4} textAnchor="end" fontSize="11" fill="#64748b">
                      {tick}
                    </text>
                  </g>
                );
              })}

              {Array.from({ length: 12 }).map((_, index) => {
                const x = 38 + (510 / 11) * index;
                return (
                  <g key={`x-${index}`}>
                    <line x1={x} y1="45" x2={x} y2="230" stroke="#94a3b8" strokeDasharray="2 3" strokeOpacity="0.45" />
                    <text x={x} y="248" textAnchor="middle" fontSize="11" fill="#64748b">
                      {index + 1}
                    </text>
                  </g>
                );
              })}

              <line x1="38" y1="230" x2="548" y2="230" stroke="#94a3b8" strokeOpacity="0.65" />
              <line x1="38" y1="45" x2="38" y2="230" stroke="#94a3b8" strokeOpacity="0.65" />

              {chartDays.map((series, index) => {
                const path = series.values
                  .map((value, valueIndex) => {
                    const x = 38 + (510 / (series.values.length - 1)) * valueIndex;
                    const y = 230 - (value / 100) * 185;
                    return `${valueIndex === 0 ? 'M' : 'L'} ${x} ${y}`;
                  })
                  .join(' ');

                return (
                  <g key={series.week}>
                    <path d={`${path} L 548 230 L 38 230 Z`} fill={`url(#completion-gradient-${index})`} />
                    <path d={path} fill="none" stroke={LINE_COLORS[index]} strokeWidth="2.6" strokeLinecap="round" />
                    {series.values.map((value, valueIndex) => {
                      const x = 38 + (510 / (series.values.length - 1)) * valueIndex;
                      const y = 230 - (value / 100) * 185;
                      return (
                        <g key={`${series.week}-${valueIndex}`}>
                          <circle cx={x} cy={y} r="6" fill="#ffffff" fillOpacity="0.3" />
                          <circle cx={x} cy={y} r="3.2" fill={LINE_COLORS[index]} stroke="#ffffff" strokeWidth="1" />
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </svg>

            <div className="mt-1 flex flex-wrap items-center justify-center gap-4">
              {chartDays.map((series, index) => (
                <div key={series.week} className="flex items-center gap-2 text-[12px] text-slate-500">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: LINE_COLORS[index] }} />
                  {series.week}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-14 text-[15px] font-semibold text-slate-900">Summary</div>
        </div>
      </section>
      {showGenerateReport && (
        <GenerateReportModal onClose={() => setShowGenerateReport(false)} />
      )}
    </div>
  );
}