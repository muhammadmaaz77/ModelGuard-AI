import { useState, useEffect, useMemo } from 'react'
import {
    LineChart, Line, PieChart, Pie, Cell,
    ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'
import { getMetrics, getLogs } from '../services/api'
import MetricCard from '../components/MetricCard'
import {
    BarChart3, TrendingUp, Smile, ShieldAlert,
    Calendar, ChevronDown, UploadCloud, AlertTriangle, FileText, Database
} from 'lucide-react'

/* ═══════════════════════════════════════════
   GLASS TOOLTIP
   ═══════════════════════════════════════════ */
const GlassTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div style={{
            background: 'var(--surface-container-highest)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 16px',
            fontSize: 'var(--body-sm)',
            border: 'var(--border-card)',
            boxShadow: 'var(--shadow-card)',
        }}>
            {label && <div style={{ color: 'var(--outline)', fontSize: 'var(--label-sm)', marginBottom: '4px' }}>{label}</div>}
            {payload.map((entry, idx) => (
                <div key={idx} style={{ color: entry.color, fontWeight: 700, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color }} />
                    {entry.name}: {entry.value}%
                </div>
            ))}
        </div>
    )
}

/* ═══════════════════════════════════════════
   MINI GAUGE — System Health Arc
   ═══════════════════════════════════════════ */
function HealthGauge({ value, size = 200 }) {
    const pct = Math.min(value, 100)
    const angle = (pct / 100) * 270 // 270 degree arc
    const radius = size * 0.35
    const sw = size * 0.08
    const cx = size / 2
    const cy = size * 0.55

    const polarToCartesian = (ccx, ccy, r, deg) => {
        // -225 start angle to center the gap at bottom
        const rad = ((deg - 225) * Math.PI) / 180
        return { x: ccx + r * Math.cos(rad), y: ccy + r * Math.sin(rad) }
    }

    const describeArc = (ccx, ccy, r, startAngle, endAngle) => {
        const start = polarToCartesian(ccx, ccy, r, endAngle)
        const end = polarToCartesian(ccx, ccy, r, startAngle)
        const large = endAngle - startAngle <= 180 ? '0' : '1'
        return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`
    }

    return (
        <div style={{ position: 'relative', height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <path d={describeArc(cx, cy, radius, 0, 270)} fill="none" stroke="var(--surface-container-highest)" strokeWidth={sw} strokeLinecap="round" />
                <path d={describeArc(cx, cy, radius, 0, angle)} fill="none" stroke="var(--primary-green)" strokeWidth={sw} strokeLinecap="round" />
            </svg>
            <div style={{
                position: 'absolute', top: '55%', left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
            }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1 }}>{pct}%</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--outline)', marginTop: '4px' }}>Healthy</div>
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════
   DASHBOARD PAGE
   ═══════════════════════════════════════════ */
export default function Dashboard() {
    const [metrics, setMetrics] = useState(null)
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([getMetrics(), getLogs()])
            .then(([m, l]) => { setMetrics(m); setLogs(l) })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const total = logs.length ? logs.length : 50342
    const avgConf = logs.length ? (logs.reduce((s, l) => s + l.confidence, 0) / logs.length) : 0.789

    /* Mock Data matching screenshot */
    const lineData = [
        { name: 'May 20', Confidence: 50, Accuracy: 35, Satisfaction: 15 },
        { name: 'May 21', Confidence: 75, Accuracy: 48, Satisfaction: 20 },
        { name: 'May 22', Confidence: 60, Accuracy: 38, Satisfaction: 18 },
        { name: 'May 23', Confidence: 80, Accuracy: 55, Satisfaction: 25 },
        { name: 'May 24', Confidence: 70, Accuracy: 42, Satisfaction: 20 },
        { name: 'May 25', Confidence: 90, Accuracy: 60, Satisfaction: 30 },
        { name: 'May 26', Confidence: 65, Accuracy: 45, Satisfaction: 22 },
        { name: 'May 27', Confidence: 85, Accuracy: 58, Satisfaction: 28 },
    ]

    const satDonut = [
        { name: 'Satisfied', value: 79, color: 'var(--primary-green)' },
        { name: 'Neutral', value: 15, color: 'var(--primary-yellow)' },
        { name: 'Unsatisfied', value: 6, color: 'var(--primary-red)' },
    ]

    const distDonut = [
        { name: 'Classification', value: 10, color: 'var(--primary-red)' },
        { name: 'Regression', value: 6, color: 'var(--primary-orange)' },
        { name: 'Clustering', value: 4, color: 'var(--primary-green)' },
        { name: 'Anomaly Detection', value: 4, color: 'var(--primary-purple)' },
    ]

    const recentActivity = [
        { icon: UploadCloud, color: 'var(--primary-green)', title: 'New model "Customer Churn v2" uploaded', time: '2 minutes ago' },
        { icon: AlertTriangle, color: 'var(--primary-orange)', title: 'Anomaly detected in "User Behavior Model"', time: '15 minutes ago' },
        { icon: FileText, color: 'var(--primary-yellow)', title: 'Performance report generated', time: '1 hour ago' },
        { icon: Database, color: 'var(--primary-purple)', title: 'Dataset "Marketing Data Q2" updated', time: '3 hours ago' },
    ]

    if (loading) return null

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', marginTop: '24px' }}>

            {/* ═══ Top Header Row ═══ */}
            <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '8px' }}>
                        Welcome back
                    </div>
                    <h1 style={{
                        fontFamily: 'var(--font-display)', fontSize: '2.2rem',
                        fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em',
                        marginBottom: '8px', lineHeight: 1
                    }}>ModelGuard AI</h1>
                    <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>
                        Monitor, analyze and improve your AI models in real-time.
                    </p>
                </div>

                {/* Date Picker Button */}
                <button style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 16px', borderRadius: 'var(--radius-full)',
                    background: 'var(--surface-container-high)', border: '1px solid rgba(255,255,255,0.05)',
                    color: '#FFFFFF', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-body)'
                }}>
                    May 20 – May 27, 2025 <Calendar size={16} color="var(--outline)" />
                </button>
            </div>

            {/* ═══ 4 Metric Cards Row ═══ */}
            <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-lg)' }}>
                <MetricCard label="Total Predictions" value={total.toLocaleString()} icon={BarChart3} color="var(--primary-red)" trend="23.5% vs last 7 days" trendUp={true} />
                <MetricCard label="Avg. Confidence" value={`${(avgConf * 100).toFixed(1)}%`} icon={TrendingUp} color="var(--primary-orange)" trend="5.3% vs last 7 days" trendUp={true} />
                <MetricCard label="Satisfied Rate" value="79%" icon={Smile} color="var(--primary-green)" trend="4.1% vs last 7 days" trendUp={true} />
                <MetricCard label="Model Alerts" value="3" icon={ShieldAlert} color="var(--primary-purple)" trend="-2 vs last 7 days" trendUp={false} />
            </div>

            {/* ═══ Middle Row: Performance Line + Satisfaction Donut ═══ */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-lg)' }}>

                {/* Performance Overview Line Chart */}
                <div className="chart-card fade-up" style={{
                    background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '24px', border: 'var(--border-card)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600 }}>Performance Overview</h3>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--on-surface-variant)',
                            padding: '6px 12px', background: 'var(--surface-container)', borderRadius: 'var(--radius-full)'
                        }}>
                            This Week <ChevronDown size={14} />
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: 'var(--outline)', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: 'var(--outline)', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<GlassTooltip />} />
                            <Line type="monotone" dataKey="Confidence" stroke="var(--primary-red)" strokeWidth={3} dot={{ r: 4, fill: 'var(--surface)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="Accuracy" stroke="var(--primary-yellow)" strokeWidth={3} dot={{ r: 4, fill: 'var(--surface)', strokeWidth: 2 }} />
                            <Line type="monotone" dataKey="Satisfaction" stroke="var(--primary-green)" strokeWidth={3} dot={{ r: 4, fill: 'var(--surface)', strokeWidth: 2 }} />
                        </LineChart>
                    </ResponsiveContainer>
                    {/* Legend */}
                    <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}><div style={{ width: 12, height: 6, borderRadius: 3, background: 'var(--primary-red)' }} /> Confidence</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}><div style={{ width: 12, height: 6, borderRadius: 3, background: 'var(--primary-yellow)' }} /> Accuracy</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}><div style={{ width: 12, height: 6, borderRadius: 3, background: 'var(--primary-green)' }} /> Satisfaction</div>
                    </div>
                </div>

                {/* Satisfaction Breakdown Donut */}
                <div className="chart-card fade-up" style={{
                    background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '24px', border: 'var(--border-card)'
                }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, marginBottom: '24px' }}>Satisfaction Breakdown</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ position: 'relative', width: '180px', height: '180px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={satDonut} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}>
                                        {satDonut.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{
                                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>79%</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--outline)' }}>Satisfied</div>
                            </div>
                        </div>
                        {/* Right Legend */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                            {satDonut.map((d, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                        <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color }} />
                                        {d.name}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{d.value}%</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ Bottom Row: Activity, Dist, Health ═══ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 'var(--space-lg)' }}>

                {/* Recent Activity List */}
                <div className="chart-card fade-up" style={{
                    background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '24px', border: 'var(--border-card)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600 }}>Recent Activity</h3>
                        <button style={{
                            background: 'var(--surface-container)', border: 'none', color: 'var(--on-surface-variant)',
                            padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', cursor: 'pointer'
                        }}>See all</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {recentActivity.map((act, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                                    background: `${act.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <act.icon size={18} color={act.color} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{act.title}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--outline)' }}>{act.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Model Distribution Donut */}
                <div className="chart-card fade-up" style={{
                    background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '24px', border: 'var(--border-card)'
                }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, marginBottom: '24px' }}>Model Distribution</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={distDonut} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={0}>
                                        {distDonut.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{
                                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>24</div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--outline)' }}>Total Models</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                            {distDonut.map((d, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
                                        <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                                        {d.name}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{d.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* System Health Gauge */}
                <div className="chart-card fade-up" style={{
                    background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '24px', border: 'var(--border-card)',
                    display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden'
                }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>System Health</h3>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        <HealthGauge value={98} />
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--outline)', zIndex: 2 }}>
                        All systems are running smoothly
                    </div>

                    {/* Decorative Bottom Wave */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', zIndex: 1
                    }}>
                        <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: '100%', height: '100%', opacity: 0.3 }}>
                            <path d="M0,20 C20,40 40,0 60,20 C80,40 90,10 100,20 L100,40 L0,40 Z" fill="none" stroke="var(--primary-green)" strokeWidth="1" />
                            <path d="M0,25 C30,5 50,45 80,15 C90,5 95,20 100,25" fill="none" stroke="var(--primary-green)" strokeWidth="0.5" />
                        </svg>
                    </div>
                </div>

            </div>
        </div>
    )
}