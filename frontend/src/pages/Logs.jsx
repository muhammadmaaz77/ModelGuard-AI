import { useState, useEffect, useMemo } from 'react'
import {
    AreaChart, Area, ResponsiveContainer,
    PieChart, Pie, Cell,
} from 'recharts'
import { getLogs, getMetrics } from '../services/api'
import {
    Database, Activity, TrendingUp, AlertTriangle, Terminal, Cpu,
    Search, Filter, ChevronDown, ChevronUp, ArrowUpRight, ArrowDownRight,
    Clock, Shield, Zap, Eye, Download, RefreshCw, CheckCircle,
    XCircle, BarChart3, Layers,
} from 'lucide-react'

/* ═══════════════════════════════════════════
   SPARKLINE
   ═══════════════════════════════════════════ */
function Sparkline({ data, color = 'var(--primary-red)', height = 36 }) {
    return (
        <ResponsiveContainer width="100%" height={height} minWidth={50} minHeight={20}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id={`logSpark-${color.replace(/[^a-zA-Z0-9-]/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5}
                    fill={`url(#logSpark-${color.replace(/[^a-zA-Z0-9-]/g, '')})`} dot={false} />
            </AreaChart>
        </ResponsiveContainer>
    )
}

/* ═══════════════════════════════════════════
   MINI DONUT
   ═══════════════════════════════════════════ */
const DONUT_COLORS = ['var(--primary-green)', 'var(--primary-red)']

function MiniDonut({ class0, class1, size = 100 }) {
    const data = [
        { name: 'Class 0', value: class0 },
        { name: 'Class 1', value: class1 },
    ]
    const total = class0 + class1

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={50} minHeight={50}>
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%"
                        innerRadius={size * 0.32} outerRadius={size * 0.45}
                        paddingAngle={3} dataKey="value" strokeWidth={0}>
                        {data.map((_, i) => (
                            <Cell key={i} fill={DONUT_COLORS[i]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
            }}>
                <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: size * 0.18,
                    fontWeight: 700,
                    color: '#FFFFFF',
                    lineHeight: 1,
                }}>{total}</div>
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════
   CONFIDENCE TIMELINE BAR
   ═══════════════════════════════════════════ */
function ConfidenceTimeline({ logs }) {
    const last20 = useMemo(() => [...logs].reverse().slice(-30), [logs])
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '48px' }}>
            {last20.map((log, i) => {
                const h = log.confidence * 100
                const color = log.prediction === 'Class 1' ? 'var(--primary-red)' : 'var(--primary-green)'
                return (
                    <div key={i} title={`${(log.confidence * 100).toFixed(1)}% — ${log.prediction}`} style={{
                        flex: 1,
                        height: `${h}%`,
                        minHeight: '4px',
                        background: `linear-gradient(180deg, ${color}, transparent)`,
                        borderRadius: '2px 2px 0 0',
                        transition: 'height 0.5s ease',
                        cursor: 'pointer',
                        opacity: 0.7 + (i / last20.length) * 0.3,
                    }} />
                )
            })}
        </div>
    )
}

/* ═══════════════════════════════════════════
   LOGS PAGE
   ═══════════════════════════════════════════ */
export default function Logs() {
    const [logs, setLogs] = useState([])
    const [metrics, setMetrics] = useState(null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterPrediction, setFilterPrediction] = useState('all')
    const [sortField, setSortField] = useState('id')
    const [sortDir, setSortDir] = useState('desc')
    const [expandedRow, setExpandedRow] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 12

    useEffect(() => {
        Promise.all([getLogs(), getMetrics()])
            .then(([l, m]) => { setLogs(l); setMetrics(m) })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const total = logs.length
    const avgConf = total ? (logs.reduce((s, l) => s + l.confidence, 0) / total) : 0
    const class1Count = logs.filter(l => l.prediction === 'Class 1').length
    const highConf = logs.filter(l => l.confidence >= 0.85).length
    const class0Count = logs.filter(l => l.prediction === 'Class 0').length
    const lowConf = logs.filter(l => l.confidence < 0.65).length

    const sparkData = useMemo(() =>
        [...logs].reverse().slice(-20).map((l, i) => ({ i, v: l.confidence })),
    [logs])

    const filteredLogs = useMemo(() => {
        let result = [...logs]
        if (filterPrediction !== 'all') result = result.filter(l => l.prediction === filterPrediction)
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            result = result.filter(l => String(l.id).includes(term) || l.prediction.toLowerCase().includes(term))
        }
        return result
    }, [logs, filterPrediction, searchTerm])

    const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    const totalPages = Math.ceil(filteredLogs.length / pageSize)

    if (loading) return null

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', marginTop: '24px' }}>

            <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{
                        fontFamily: 'var(--font-display)', fontSize: '1.8rem',
                        fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px',
                    }}>Prediction Logs</h1>
                    <p style={{ color: 'var(--outline)', fontSize: '0.85rem' }}>Real-time inference stream with filtering, search, and deep drill-down</p>
                </div>
            </div>

            {/* ═══ Stats Row ═══ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-md)' }}>
                {[
                    { label: 'Total Logs', value: total.toLocaleString(), icon: Database, color: 'var(--primary-red)', trend: '+12.4%', up: true },
                    { label: 'Avg. Confidence', value: `${(avgConf * 100).toFixed(1)}%`, icon: Activity, color: 'var(--primary-orange)', trend: '+2.1%', up: true },
                    { label: 'Class 1 Predictions', value: class1Count.toLocaleString(), icon: AlertTriangle, color: 'var(--primary-yellow)', trend: '0%', up: false },
                    { label: 'High Confidence', value: highConf.toLocaleString(), icon: Shield, color: 'var(--primary-green)', trend: '+5.1%', up: true },
                ].map((stat, i) => (
                    <div key={i} className="chart-card fade-up" style={{
                        background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '20px', border: 'var(--border-card)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--on-surface-variant)' }}>{stat.label}</span>
                            <div style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: 'var(--surface-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <stat.icon size={14} color={stat.color} />
                            </div>
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '10px' }}>{stat.value}</div>
                        <div style={{ marginTop: '10px', marginLeft: '-8px', marginRight: '-8px' }}>
                            <Sparkline data={sparkData} color={stat.color} height={30} />
                        </div>
                    </div>
                ))}
            </div>

            {/* ═══ Visual Row ═══ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr 1fr', gap: 'var(--space-md)' }}>
                {/* Timeline */}
                <div className="chart-card" style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', border: 'var(--border-card)' }}>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}>Inference Timeline</h3>
                    <ConfidenceTimeline logs={logs} />
                </div>
                {/* Donut */}
                <div className="chart-card" style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', border: 'var(--border-card)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Split</h3>
                    <MiniDonut class0={class0Count} class1={class1Count} size={110} />
                </div>
                {/* Insights */}
                <div className="chart-card" style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', border: 'var(--border-card)' }}>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}>Quick Insights</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                            { label: 'High Confidence', value: highConf, pct: total ? ((highConf / total) * 100).toFixed(1) : 0, color: 'var(--primary-green)' },
                            { label: 'Low Confidence', value: lowConf, pct: total ? ((lowConf / total) * 100).toFixed(1) : 0, color: 'var(--primary-red)' },
                            { label: 'Class 1 Rate', value: class1Count, pct: total ? ((class1Count / total) * 100).toFixed(1) : 0, color: 'var(--primary-orange)' },
                        ].map((item, i) => (
                            <div key={i} style={{ padding: '8px 12px', background: 'var(--surface-container)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--outline)' }}>{item.label}</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: item.color }}>{item.pct}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══ Table ═══ */}
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: 'var(--border-card)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '50px 70px 1fr 140px 180px 200px', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                    {['#', 'ID', 'Input', 'Result', 'Confidence', 'Timestamp'].map(c => <span key={c} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--outline)' }}>{c}</span>)}
                </div>
                {paginatedLogs.map((log, idx) => {
                    const confPct = log.confidence * 100
                    const isClass1 = log.prediction === 'Class 1'
                    const barColor = isClass1 ? 'var(--primary-red)' : 'var(--primary-green)'
                    return (
                        <div key={log.id} style={{ display: 'grid', gridTemplateColumns: '50px 70px 1fr 140px 180px 200px', padding: '14px 24px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--outline)' }}>{idx + 1}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', fontFamily: 'var(--font-mono)' }}>#{log.id}</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--outline)' }}>Feature Vector</span>
                            <span className={`status-badge ${isClass1 ? 'status-badge--class1' : 'status-badge--class0'}`}>{log.prediction}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ flex: 1, height: '4px', background: 'var(--surface-container)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${confPct}%`, background: barColor }} />
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{confPct.toFixed(0)}%</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--outline)' }}>{log.timestamp?.slice(0, 19)}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}