import { useState, useEffect } from 'react'
import {
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area,
} from 'recharts'
import { getMetrics } from '../services/api'
import { AlertCircle, Activity, BrainCircuit, Target, CheckCircle, ChevronDown, Calendar } from 'lucide-react'

/* ═══════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════ */
const radarData = [
    { metric: 'Accuracy', value: 85, fullMark: 100 },
    { metric: 'Recall', value: 78, fullMark: 100 },
    { metric: 'Precision', value: 82, fullMark: 100 },
    { metric: 'F1 Score', value: 80, fullMark: 100 },
    { metric: 'Latency', value: 90, fullMark: 100 },
    { metric: 'Robustness', value: 75, fullMark: 100 },
]

const scatterData = Array.from({ length: 50 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    z: Math.random() * 400 + 100,
}))

const areaData = [
    { time: '00:00', val: 12 }, { time: '04:00', val: 15 },
    { time: '08:00', val: 45 }, { time: '12:00', val: 32 },
    { time: '16:00', val: 55 }, { time: '20:00', val: 25 },
    { time: '24:00', val: 18 },
]

const HEATMAP_COLS = 12
const HEATMAP_ROWS = 4
const HEATMAP_COLORS = [
    'rgba(255,255,255,0.02)', // Lowest
    'rgba(165,53,53,0.2)',    // Low
    'rgba(165,53,53,0.5)',    // Medium
    'rgba(165,53,53,0.8)',    // High
    'var(--primary-red)',     // Highest
]

function Heatmap() {
    const cells = Array.from({ length: HEATMAP_COLS * HEATMAP_ROWS }, () => Math.floor(Math.random() * 5))
    return (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${HEATMAP_COLS}, 1fr)`, gap: '4px' }}>
            {cells.map((val, i) => (
                <div key={i} title={`Activity level ${val}`} style={{
                    aspectRatio: '1',
                    background: HEATMAP_COLORS[val],
                    borderRadius: '2px',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                   onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'} />
            ))}
        </div>
    )
}

/* ═══════════════════════════════════════════
   ANALYSIS PAGE
   ═══════════════════════════════════════════ */
export default function Analysis() {
    const [metrics, setMetrics] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMetrics().then(setMetrics).finally(() => setLoading(false))
    }, [])

    if (loading) return null

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', marginTop: '24px' }}>

            {/* ═══ Header ═══ */}
            <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{
                        fontFamily: 'var(--font-display)', fontSize: '1.8rem',
                        fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px',
                    }}>Model Diagnostics</h1>
                    <p style={{ color: 'var(--outline)', fontSize: '0.85rem' }}>Deep dive into model performance, latency, and operational health.</p>
                </div>
                <button style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 16px', borderRadius: 'var(--radius-full)',
                    background: 'var(--surface-container-high)', border: '1px solid rgba(255,255,255,0.05)',
                    color: '#FFFFFF', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-body)'
                }}>
                    Last 30 Days <Calendar size={16} color="var(--outline)" />
                </button>
            </div>

            {/* ═══ Top Summary Cards ═══ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-md)' }}>
                {[
                    { title: 'Global Accuracy', val: '84.2%', icon: Target, c: 'var(--primary-red)' },
                    { title: 'Data Drift (PSI)', val: '0.04', icon: AlertCircle, c: 'var(--primary-orange)' },
                    { title: 'Avg Latency', val: '124ms', icon: Activity, c: 'var(--primary-purple)' },
                    { title: 'Model Status', val: 'Healthy', icon: CheckCircle, c: 'var(--primary-green)' },
                ].map((item, i) => (
                    <div key={i} className="chart-card fade-up" style={{
                        background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '20px', border: 'var(--border-card)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: `${item.c}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <item.icon size={16} color={item.c} />
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>{item.title}</span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF' }}>{item.val}</div>
                    </div>
                ))}
            </div>

            {/* ═══ Main Charts Row 1 ═══ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                {/* Radar Chart */}
                <div className="chart-card fade-up" style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '24px', border: 'var(--border-card)' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, marginBottom: '24px' }}>Performance Vector</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--outline)', fontSize: 11 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="Model A" dataKey="value" stroke="var(--primary-red)" fill="var(--primary-red)" fillOpacity={0.4} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Heatmap & Activity */}
                <div className="chart-card fade-up" style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '24px', border: 'var(--border-card)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600 }}>Inference Density</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--on-surface-variant)', padding: '6px 12px', background: 'var(--surface-container)', borderRadius: 'var(--radius-full)' }}>
                            Hourly <ChevronDown size={14} />
                        </div>
                    </div>
                    <Heatmap />
                    
                    <div style={{ marginTop: '40px' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px', color: 'var(--outline)' }}>Peak Load Curve</h3>
                        <ResponsiveContainer width="100%" height={120}>
                            <AreaChart data={areaData}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary-orange)" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="var(--primary-orange)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" hide />
                                <YAxis hide />
                                <Tooltip contentStyle={{ background: 'var(--surface-container-highest)', border: 'none', borderRadius: '4px', fontSize: '0.75rem' }} />
                                <Area type="monotone" dataKey="val" stroke="var(--primary-orange)" fillOpacity={1} fill="url(#colorVal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ═══ Scatter Distribution ═══ */}
            <div className="chart-card fade-up" style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '24px', border: 'var(--border-card)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, marginBottom: '24px' }}>Feature Space Distribution</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                            <XAxis type="number" dataKey="x" name="Feature 1" tick={{ fill: 'var(--outline)', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis type="number" dataKey="y" name="Feature 2" tick={{ fill: 'var(--outline)', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: 'var(--surface-container-highest)', border: 'none', borderRadius: '4px', fontSize: '0.75rem' }} />
                            <Scatter name="Data" data={scatterData} fill="var(--primary-green)" fillOpacity={0.6} line />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    )
}
