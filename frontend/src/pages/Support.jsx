import { useState } from 'react'
import {
    Book, MessageSquare, ShieldAlert,
    ChevronDown, ChevronUp, FileText, Send, HelpCircle, AlertCircle
} from 'lucide-react'

/* ═══════════════════════════════════════════
   ACCORDION ITEM
   ═══════════════════════════════════════════ */
function FaqItem({ question, answer, isOpen, onClick }) {
    return (
        <div style={{
            borderBottom: '1px solid rgba(226,232,255,0.04)',
            overflow: 'hidden',
        }}>
            <button
                onClick={onClick}
                style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 0',
                    background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left', color: '#FFFFFF',
                    fontFamily: 'var(--font-body)', fontSize: 'var(--body-md)',
                    fontWeight: isOpen ? 700 : 500,
                    transition: 'all 0.2s ease'
                }}
            >
                {question}
                <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: isOpen ? 'rgba(165,53,53,0.1)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease',
                }}>
                    {isOpen ? <ChevronUp size={16} color="var(--primary-red)" /> : <ChevronDown size={16} color="var(--outline)" />}
                </div>
            </button>
            <div style={{
                height: isOpen ? 'auto' : 0,
                opacity: isOpen ? 1 : 0,
                paddingBottom: isOpen ? '16px' : 0,
                color: 'var(--on-surface-variant)',
                fontSize: 'var(--body-sm)',
                lineHeight: 1.6,
                transition: 'all 0.3s ease',
            }}>
                {answer}
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════
   SUPPORT PAGE
   ═══════════════════════════════════════════ */
export default function Support() {
    const [openFaq, setOpenFaq] = useState(0)

    const faqs = [
        {
            q: "How do I interpret the Data Drift PSI score?",
            a: "The Population Stability Index (PSI) measures the shift in your model's input data distribution over time. A PSI < 0.1 indicates no significant drift. A PSI between 0.1 and 0.2 means slight drift (monitor closely). A PSI > 0.2 indicates significant drift, suggesting the model may need retraining."
        },
        {
            q: "What format should my uploaded model be?",
            a: "We currently support Scikit-Learn pipelines saved as .pkl or .joblib files. Ensure your pipeline includes all necessary preprocessing steps, or upload a separate preprocessor artifact."
        },
        {
            q: "Why are my recent predictions showing 'Low Confidence'?",
            a: "Our system flags any prediction where the model's highest class probability is below your configured threshold (default 65%). This usually happens when the model encounters edge cases or data that differs significantly from its training set."
        },
        {
            q: "Can I connect the monitoring dashboard to an external database?",
            a: "Yes. Enterprise users can configure webhook endpoints and database connections in the Settings panel to stream inference logs directly to Snowflake, BigQuery, or Amazon S3."
        }
    ]

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>

            {/* ═══ Header ═══ */}
            <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{
                        fontFamily: 'var(--font-display)', fontSize: 'var(--headline-lg)',
                        fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px',
                    }}>
                        <span className="gradient-text">Help Center</span>
                    </h1>
                    <p style={{ color: 'var(--outline)', fontSize: 'var(--body-md)' }}>
                        Documentation, FAQs, and technical support.
                    </p>
                </div>
            </div>

            {/* ═══ Quick Links ═══ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-md)' }}>
                {[
                    { title: 'Documentation', desc: 'Integration guides & API reference', icon: Book, color: 'var(--primary-red)' },
                    { title: 'Community Forum', desc: 'Connect with other ML engineers', icon: MessageSquare, color: 'var(--primary-purple)' },
                    { title: 'System Status', desc: 'All services operational', icon: ShieldAlert, color: 'var(--primary-green)' },
                ].map((card, i) => (
                    <div key={i} className="metric-card fade-up" style={{
                        background: 'var(--surface)',
                        borderRadius: 'var(--radius-lg)',
                        border: 'var(--border-card)',
                        padding: 'var(--space-xl)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                        animationDelay: `${i * 100}ms`
                    }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: 'var(--radius-sm)',
                            background: `rgba(255,255,255,0.05)`, // Avoid applying hex opacity to var
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '16px',
                        }}>
                            <card.icon size={24} color={card.color} />
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--title-md)', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                            {card.title}
                        </h3>
                        <p style={{ fontSize: 'var(--body-sm)', color: 'var(--outline)' }}>
                            {card.desc}
                        </p>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 'var(--space-lg)' }}>
                {/* ── Left Column: FAQs ── */}
                <div className="fade-up" style={{
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: 'var(--border-card)',
                    padding: 'var(--space-xl)',
                    animationDelay: '300ms'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                            background: 'rgba(165,53,53,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <HelpCircle size={20} color="var(--primary-red)" />
                        </div>
                        <div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--title-md)', fontWeight: 700, color: '#FFFFFF' }}>Frequently Asked Questions</h3>
                            <p style={{ fontSize: 'var(--body-sm)', color: 'var(--outline)' }}>Common issues and solutions</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {faqs.map((faq, i) => (
                            <FaqItem
                                key={i}
                                question={faq.q}
                                answer={faq.a}
                                isOpen={openFaq === i}
                                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                            />
                        ))}
                    </div>
                </div>

                {/* ── Right Column: Contact Form ── */}
                <div className="fade-up" style={{
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: 'var(--border-card)',
                    padding: 'var(--space-xl)',
                    animationDelay: '400ms'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                            background: 'rgba(217,101,43,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <AlertCircle size={20} color="var(--primary-orange)" />
                        </div>
                        <div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--title-md)', fontWeight: 700, color: '#FFFFFF' }}>Report an Issue</h3>
                            <p style={{ fontSize: 'var(--body-sm)', color: 'var(--outline)' }}>Our team usually responds in 24h</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 'var(--label-sm)', color: 'var(--outline)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Category</label>
                            <select style={{
                                width: '100%', padding: '12px 16px',
                                background: 'var(--surface-container)', border: 'var(--border-input)',
                                borderRadius: 'var(--radius-sm)', color: '#FFFFFF',
                                fontFamily: 'var(--font-body)', fontSize: 'var(--body-sm)',
                                outline: 'none', cursor: 'pointer',
                                appearance: 'none',
                            }}>
                                <option>Technical Support</option>
                                <option>Billing</option>
                                <option>Bug Report</option>
                                <option>Feature Request</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 'var(--label-sm)', color: 'var(--outline)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Message</label>
                            <textarea
                                placeholder="Describe your issue in detail..."
                                rows={5}
                                style={{
                                    width: '100%', padding: '12px 16px',
                                    background: 'var(--surface-container)', border: 'var(--border-input)',
                                    borderRadius: 'var(--radius-sm)', color: '#FFFFFF',
                                    fontFamily: 'var(--font-body)', fontSize: 'var(--body-sm)',
                                    resize: 'vertical',
                                }}
                            />
                        </div>
                        <button className="btn-primary" style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
                            <Send size={16} /> Submit Ticket
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
