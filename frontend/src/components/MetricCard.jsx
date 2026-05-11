import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function MetricCard({ label, value, icon: Icon, color, trend, trendUp }) {
    // The new design uses solid backgrounds with slight gradients
    // Red: #A53535, Orange: #D9652B, Olive: #6C7A3F, Plum: #7D3B73

    return (
        <div
            className="fade-up chart-card"
            style={{
                background: color, // Solid color because CSS var concatenation fails
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
                flex: 1,
            }}
        >
            {/* Top row — label + icon */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '16px',
            }}>
                <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.9)',
                }}>{label}</span>
                
                {Icon && (
                    <div style={{
                        width: 32, height: 32,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Icon size={16} color="#FFFFFF" strokeWidth={2} />
                    </div>
                )}
            </div>

            {/* Value */}
            <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1,
                marginBottom: '12px'
            }}>
                {value}
            </div>

            {/* Trend Row */}
            {trend && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {trendUp ? (
                        <ArrowUpRight size={14} color="rgba(255,255,255,0.8)" />
                    ) : (
                        <ArrowDownRight size={14} color="rgba(255,255,255,0.8)" />
                    )}
                    <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: 'rgba(255,255,255,0.8)',
                    }}>
                        {trend}
                    </span>
                </div>
            )}
        </div>
    )
}