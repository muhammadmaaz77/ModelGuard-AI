import { Search, Bell, ChevronDown } from 'lucide-react'

export default function Navbar() {
    return (
        <header style={{
            height: '80px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 var(--space-xl)', flexShrink: 0,
            background: 'transparent',
            marginTop: '16px',
        }}>
            {/* ── Search Bar (Left-aligned relative to content) ── */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 20px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--surface)',
                border: '1px solid rgba(255,255,255,0.02)',
                minWidth: '400px',
            }}>
                <Search size={16} color="var(--outline)" strokeWidth={2} />
                <input 
                    type="text" 
                    placeholder="Search models, logs, metrics..." 
                    style={{
                        background: 'transparent', border: 'none', outline: 'none',
                        color: 'var(--on-surface)', fontFamily: 'var(--font-body)',
                        fontSize: '0.85rem', width: '100%'
                    }}
                />
            </div>

            {/* ── Right side ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>

                {/* Notifications */}
                <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'var(--surface)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.02)',
                }}>
                    <Bell size={18} color="var(--on-surface-variant)" />
                    <div style={{
                        position: 'absolute', top: 0, right: 0,
                        width: 14, height: 14, borderRadius: '50%',
                        background: 'var(--primary-red)',
                        color: '#FFF', fontSize: '8px', fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid var(--background)'
                    }}>
                        3
                    </div>
                </div>

                {/* User Profile */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: 'var(--surface-container-high)',
                        overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        {/* Placeholder image for Alex Morgan */}
                        <img 
                            src="https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=transparent" 
                            alt="Alex Morgan" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#e0e0e0' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ 
                            fontFamily: 'var(--font-body)', fontSize: '0.85rem', 
                            fontWeight: 600, color: '#FFFFFF', lineHeight: 1.2
                        }}>Alex Morgan</span>
                        <span style={{ 
                            fontFamily: 'var(--font-body)', fontSize: '0.7rem', 
                            color: 'var(--outline)', lineHeight: 1.2, marginTop: '2px'
                        }}>Data Scientist</span>
                    </div>
                    <ChevronDown size={14} color="var(--outline)" style={{ marginLeft: '4px' }} />
                </div>

            </div>
        </header>
    )
}