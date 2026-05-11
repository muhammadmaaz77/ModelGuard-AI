import { NavLink, useLocation } from 'react-router-dom'
import {
    LayoutDashboard, Upload, BarChart3, ScrollText,
    Bell, Settings, Users, HelpCircle, Activity,
    ChevronRight, Hexagon
} from 'lucide-react'

const mainLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/upload', icon: Upload, label: 'Upload Model' },
    { to: '/analysis', icon: BarChart3, label: 'Analysis' },
    { to: '/logs', icon: ScrollText, label: 'Logs' },
    { to: '/alerts', icon: Bell, label: 'Alerts' },
]

const accountLinks = [
    { to: '/settings', icon: Settings, label: 'Settings' },
    { to: '/team', icon: Users, label: 'Team' },
    { to: '/support', icon: HelpCircle, label: 'Support' },
]

export default function Sidebar() {
    const location = useLocation()

    const renderNavItem = ({ to, icon: Icon, label }) => {
        // Simple active check
        const isActive = location.pathname.startsWith(to)

        return (
            <NavLink key={to} to={to} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem', fontWeight: isActive ? 600 : 500,
                background: isActive ? 'var(--primary-red)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--on-surface-variant)',
                margin: '0 16px 4px',
                transition: 'all 0.2s ease',
            }}>
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                {label}
            </NavLink>
        )
    }

    return (
        <aside style={{
            width: '240px', minHeight: '100vh',
            background: 'var(--background)',
            display: 'flex', flexDirection: 'column',
            paddingTop: '24px', flexShrink: 0,
            borderRight: '1px solid rgba(255,255,255,0.02)',
        }}>
            {/* ── Logo ── */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                marginBottom: '40px', padding: '0 24px',
            }}>
                <div style={{
                    position: 'relative', width: 28, height: 28,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <Hexagon size={28} fill="var(--primary-red)" color="var(--primary-red)" />
                    <div style={{
                        position: 'absolute', width: 14, height: 14,
                        background: 'var(--primary-orange)', borderRadius: '50%',
                        transform: 'translate(4px, -4px)'
                    }} />
                </div>
                <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    letterSpacing: '-0.01em',
                }}>
                    ModelGuard
                </div>
            </div>

            {/* ── Main Nav ── */}
            <nav style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
                {mainLinks.map(renderNavItem)}
            </nav>

            {/* ── Section Label ── */}
            <div style={{
                padding: '0 32px 12px',
                fontFamily: 'var(--font-label)',
                fontSize: '0.65rem',
                fontWeight: 600,
                color: 'var(--outline)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
            }}>
                Account
            </div>

            {/* ── Account Nav ── */}
            <nav style={{ display: 'flex', flexDirection: 'column' }}>
                {accountLinks.map(renderNavItem)}
            </nav>

            {/* ── Bottom Status Card ── */}
            <div style={{
                marginTop: 'auto',
                margin: 'auto 16px 24px',
                padding: '20px',
                background: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                border: 'var(--border-card)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{
                        fontFamily: 'var(--font-display)', fontSize: '0.85rem',
                        fontWeight: 600, color: '#FFFFFF', marginBottom: '6px'
                    }}>System Status</div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '30px' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary-green)' }} />
                        <span style={{ fontSize: '0.65rem', color: 'var(--on-surface-variant)' }}>
                            All systems operational
                        </span>
                    </div>

                    <button style={{
                        width: '100%', padding: '10px',
                        background: 'rgba(217, 101, 43, 0.05)', border: '1px solid rgba(217, 101, 43, 0.3)',
                        borderRadius: 'var(--radius-sm)', color: 'var(--primary-orange)',
                        fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        transition: 'background 0.2s',
                    }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(217, 101, 43, 0.15)'}
                       onMouseOut={(e) => e.currentTarget.style.background = 'rgba(217, 101, 43, 0.05)'}>
                        View Status <ChevronRight size={14} />
                    </button>
                </div>

                {/* Decorative Wave/Gradient */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px',
                    zIndex: 1
                }}>
                    <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: '100%', height: '100%', opacity: 0.8 }}>
                        <path d="M0,20 C30,40 70,0 100,20 L100,40 L0,40 Z" fill="rgba(217, 101, 43, 0.15)" />
                        <path d="M0,25 C40,5 60,35 100,15" fill="none" stroke="var(--primary-orange)" strokeWidth="1" />
                    </svg>
                </div>
            </div>
        </aside>
    )
}