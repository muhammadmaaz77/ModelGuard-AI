import { useState } from 'react'
import {
    Save, Shield, Bell, Key, Database, Globe,
    Smartphone, Mail, Lock, User, CheckCircle
} from 'lucide-react'

/* ═══════════════════════════════════════════
   CUSTOM TOGGLE
   ═══════════════════════════════════════════ */
function Toggle({ checked, onChange }) {
    return (
        <div
            onClick={() => onChange(!checked)}
            style={{
                width: 40, height: 20,
                borderRadius: '10px',
                background: checked ? 'var(--primary-red)' : 'var(--surface-container-high)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.3s ease',
            }}
        >
            <div style={{
                position: 'absolute', top: 2, left: checked ? 22 : 2,
                width: 16, height: 16,
                borderRadius: '50%',
                background: '#FFFFFF',
                transition: 'left 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }} />
        </div>
    )
}

/* ═══════════════════════════════════════════
   SETTINGS PAGE
   ═══════════════════════════════════════════ */
export default function Settings() {
    const [settings, setSettings] = useState({
        emailAlerts: true,
        pushAlerts: false,
        driftAutoRetrain: false,
        publicDashboard: false,
        apiKeyActive: true,
    })

    const [saved, setSaved] = useState(false)

    const toggle = (key) => {
        setSettings(s => ({ ...s, [key]: !s[key] }))
        setSaved(false)
    }

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    const InputField = ({ label, type = 'text', defaultValue, icon: Icon }) => (
        <div style={{ marginBottom: '16px' }}>
            <label style={{
                display: 'block',
                fontFamily: 'var(--font-label)',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--outline)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
            }}>{label}</label>
            <div style={{ position: 'relative' }}>
                <div style={{
                    position: 'absolute', top: '50%', left: '16px',
                    transform: 'translateY(-50%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Icon size={16} color="var(--outline)" />
                </div>
                <input
                    type={type}
                    defaultValue={defaultValue}
                    style={{
                        width: '100%',
                        padding: '12px 16px 12px 44px',
                        background: 'var(--surface-container)',
                        border: 'var(--border-input)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--body-sm)',
                        transition: 'all 0.2s ease',
                    }}
                />
            </div>
        </div>
    )

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>

            {/* ═══ Header ═══ */}
            <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{
                        fontFamily: 'var(--font-display)', fontSize: 'var(--headline-lg)',
                        fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px',
                    }}>
                        <span className="gradient-text">Configuration</span>
                    </h1>
                    <p style={{ color: 'var(--outline)', fontSize: 'var(--body-md)' }}>
                        Manage your account, API keys, and notification preferences.
                    </p>
                </div>
                <button className="btn-primary" onClick={handleSave} style={{
                    padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                    {saved ? <CheckCircle size={16} /> : <Save size={16} />}
                    {saved ? 'Saved' : 'Save Changes'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 'var(--space-lg)' }}>

                {/* ── Left Column: Profile & API ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

                    {/* Profile Setup */}
                    <div className="fade-up" style={{
                        background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
                        border: 'var(--border-card)', padding: 'var(--space-xl)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                                background: 'rgba(0,117,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <User size={20} color="var(--primary)" />
                            </div>
                            <div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--title-md)', fontWeight: 700, color: '#FFFFFF' }}>Profile Information</h3>
                                <p style={{ fontSize: 'var(--body-sm)', color: 'var(--outline)' }}>Update your account details</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <InputField label="First Name" defaultValue="Admin" icon={User} />
                            <InputField label="Last Name" defaultValue="User" icon={User} />
                        </div>
                        <InputField label="Email Address" type="email" defaultValue="admin@modelguard.ai" icon={Mail} />
                    </div>

                    {/* API Configuration */}
                    <div className="fade-up" style={{
                        background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
                        border: 'var(--border-card)', padding: 'var(--space-xl)',
                        animationDelay: '100ms'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                                background: 'rgba(117,81,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Key size={20} color="var(--tertiary)" />
                            </div>
                            <div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--title-md)', fontWeight: 700, color: '#FFFFFF' }}>API Keys</h3>
                                <p style={{ fontSize: 'var(--body-sm)', color: 'var(--outline)' }}>Manage access to your models</p>
                            </div>
                        </div>

                        <div style={{
                            background: 'var(--surface-container)', padding: '16px',
                            borderRadius: 'var(--radius-sm)', border: '1px dashed rgba(226,232,255,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            marginBottom: '16px'
                        }}>
                            <div>
                                <div style={{ fontSize: 'var(--body-sm)', fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>Production API Key</div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--label-sm)', color: 'var(--outline)' }}>
                                    sk_prod_************************8f92
                                </div>
                            </div>
                            <button className="btn-secondary" style={{ padding: '6px 12px' }}>Regenerate</button>
                        </div>
                    </div>
                </div>

                {/* ── Right Column: Preferences ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

                    {/* Notification Preferences */}
                    <div className="fade-up" style={{
                        background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
                        border: 'var(--border-card)', padding: 'var(--space-xl)',
                        animationDelay: '200ms'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                                background: 'rgba(1,181,116,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Bell size={20} color="var(--secondary)" />
                            </div>
                            <div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--title-md)', fontWeight: 700, color: '#FFFFFF' }}>Notifications</h3>
                                <p style={{ fontSize: 'var(--body-sm)', color: 'var(--outline)' }}>Alerts and reports</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: 'var(--body-sm)' }}>Email Alerts</div>
                                    <div style={{ fontSize: 'var(--label-sm)', color: 'var(--outline)' }}>Daily summaries and drift alerts</div>
                                </div>
                                <Toggle checked={settings.emailAlerts} onChange={() => toggle('emailAlerts')} />
                            </div>
                            <div style={{ height: 1, background: 'rgba(226,232,255,0.04)' }} />
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: 'var(--body-sm)' }}>Push Notifications</div>
                                    <div style={{ fontSize: 'var(--label-sm)', color: 'var(--outline)' }}>Critical anomalies only</div>
                                </div>
                                <Toggle checked={settings.pushAlerts} onChange={() => toggle('pushAlerts')} />
                            </div>
                        </div>
                    </div>

                    {/* Security & Access */}
                    <div className="fade-up" style={{
                        background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
                        border: 'var(--border-card)', padding: 'var(--space-xl)',
                        animationDelay: '300ms'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                                background: 'rgba(227,26,26,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Shield size={20} color="var(--error)" />
                            </div>
                            <div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--title-md)', fontWeight: 700, color: '#FFFFFF' }}>Security</h3>
                                <p style={{ fontSize: 'var(--body-sm)', color: 'var(--outline)' }}>Access and permissions</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: 'var(--body-sm)' }}>Public Dashboard</div>
                                    <div style={{ fontSize: 'var(--label-sm)', color: 'var(--outline)' }}>Allow unauthenticated access to metrics</div>
                                </div>
                                <Toggle checked={settings.publicDashboard} onChange={() => toggle('publicDashboard')} />
                            </div>
                            <div style={{ height: 1, background: 'rgba(226,232,255,0.04)' }} />
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: 'var(--body-sm)' }}>Auto-Retrain on Drift</div>
                                    <div style={{ fontSize: 'var(--label-sm)', color: 'var(--outline)' }}>Trigger pipeline if PSI {'>'} 0.1</div>
                                </div>
                                <Toggle checked={settings.driftAutoRetrain} onChange={() => toggle('driftAutoRetrain')} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
