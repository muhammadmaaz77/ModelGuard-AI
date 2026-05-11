import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { uploadModel, getStatus, loadDemo } from '../services/api'
import {
    Upload as UploadIcon, FileCheck, AlertCircle, CheckCircle,
    Package, Database, List, ArrowRight, RefreshCw, Sparkles,
    FileText, Server, Cpu, Layers, Zap, Brain, Shield, Activity,
    ChevronRight,
} from 'lucide-react'

const REQUIRED_FILES = [
    { key: 'model', label: 'Model File', accept: '.pkl,.joblib', desc: 'Serialized model (pickle / joblib)', icon: Package },
    { key: 'preprocessor', label: 'Preprocessor', accept: '.pkl,.joblib', desc: 'Feature preprocessor pipeline', icon: Database },
    { key: 'reference', label: 'Reference Data', accept: '.csv', desc: 'Training reference (X_train.csv)', icon: List },
    { key: 'features', label: 'Feature Names', accept: '.json', desc: 'Feature name mapping (JSON)', icon: FileText },
]

/* ═══════════════════════════════════════════
   PIPELINE STEP — Upload Flow
   ═══════════════════════════════════════════ */
function PipelineStep({ step, total, label, isActive, isDone }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: isDone ? 'var(--primary-green)' : isActive ? 'var(--primary-red)' : 'var(--surface-container)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--label-sm)',
                fontWeight: 700,
                color: '#FFFFFF',
                boxShadow: isDone ? '0 0 12px rgba(108,122,63,0.3)' : isActive ? '0 0 12px rgba(165,53,53,0.3)' : 'none',
                transition: 'all 0.4s ease',
            }}>
                {isDone ? <CheckCircle size={16} /> : step}
            </div>
            <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--body-sm)',
                fontWeight: isActive || isDone ? 700 : 500,
                color: isActive || isDone ? '#FFFFFF' : 'var(--on-surface-variant)',
            }}>{label}</span>
            {step < total && (
                <ChevronRight size={14} color="var(--outline)" style={{ marginLeft: '8px' }} />
            )}
        </div>
    )
}

/* ═══════════════════════════════════════════
   UPLOAD PAGE
   ═══════════════════════════════════════════ */
export default function Upload() {
    const [files, setFiles] = useState({})
    const [uploading, setUploading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [currentStep, setCurrentStep] = useState(1)
    const [status, setStatus] = useState(null)
    const [demoLoading, setDemoLoading] = useState(false)

    useEffect(() => {
        getStatus().then(setStatus).catch(console.error)
    }, [])

    const handleFileDrop = useCallback((key) => (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setFiles(prev => ({ ...prev, [key]: acceptedFiles[0] }))
            setError(null)
        }
    }, [])

    const handleUpload = async () => {
        const missing = REQUIRED_FILES.filter(f => !files[f.key])
        if (missing.length > 0) {
            setError(`Missing: ${missing.map(f => f.label).join(', ')}`)
            return
        }

        setUploading(true)
        setCurrentStep(2)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('model', files.model)
            formData.append('preprocessor', files.preprocessor)
            formData.append('reference_data', files.reference)
            formData.append('feature_names', files.features)

            setCurrentStep(3)
            const res = await uploadModel(formData)
            setCurrentStep(4)
            setResult(res)
            getStatus().then(setStatus).catch(console.error)
        } catch (err) {
            setError(err.response?.data?.detail || 'Upload failed. Please try again.')
            setCurrentStep(1)
        } finally {
            setUploading(false)
        }
    }

    const handleDemo = async () => {
        setDemoLoading(true)
        try {
            await loadDemo()
            setResult({ message: 'Demo model loaded successfully!' })
            setCurrentStep(4)
            getStatus().then(setStatus).catch(console.error)
        } catch (err) {
            setError('Demo model failed to load.')
        } finally {
            setDemoLoading(false)
        }
    }

    const fileCount = Object.keys(files).length
    const allFilesReady = REQUIRED_FILES.every(f => files[f.key])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

            {/* ═══ Pipeline Progress ═══ */}
            <div className="fade-up" style={{
                background: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                border: 'var(--border-card)',
                padding: '24px var(--space-xl)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                {[
                    { step: 1, label: 'Select Files' },
                    { step: 2, label: 'Validation' },
                    { step: 3, label: 'Processing' },
                    { step: 4, label: 'Complete' },
                ].map(p => (
                    <PipelineStep key={p.step} step={p.step} total={4} label={p.label}
                        isActive={currentStep === p.step} isDone={currentStep > p.step} />
                ))}
            </div>

            {/* ═══ File Upload Grid ═══ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                {REQUIRED_FILES.map((req) => {
                    const file = files[req.key]
                    const { getRootProps, getInputProps, isDragActive } = useDropzone({
                        onDrop: handleFileDrop(req.key),
                        accept: Object.fromEntries(req.accept.split(',').map(ext => [`application/${ext.replace('.', '')}`, [ext]])),
                        maxFiles: 1,
                    })

                    return (
                        <div key={req.key} {...getRootProps()} className="drop-zone" style={{
                            background: isDragActive ? 'rgba(165,53,53,0.04)' : 'var(--surface)',
                            borderRadius: 'var(--radius-lg)',
                            border: file ? '2px solid var(--primary-green)' : isDragActive ? '2px dashed var(--primary-red)' : '2px dashed rgba(255,255,255,0.08)',
                            padding: 'var(--space-xl)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                        }}>
                            <input {...getInputProps()} />
                            <div style={{
                                width: 48, height: 48, borderRadius: 'var(--radius-sm)',
                                background: file ? 'rgba(108,122,63,0.1)' : 'var(--surface-container)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 14px',
                            }}>
                                {file
                                    ? <FileCheck size={22} color="var(--primary-green)" />
                                    : <req.icon size={22} color="var(--outline)" />
                                }
                            </div>
                            <div style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'var(--title-md)',
                                fontWeight: 700,
                                color: '#FFFFFF',
                                marginBottom: '6px',
                            }}>{req.label}</div>
                            <div style={{
                                fontSize: 'var(--body-sm)',
                                color: 'var(--on-surface-variant)',
                                marginBottom: '10px',
                            }}>{req.desc}</div>
                            {file ? (
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    padding: '4px 12px', borderRadius: 'var(--radius-full)',
                                    background: 'rgba(1,181,116,0.1)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: 'var(--label-sm)',
                                    color: 'var(--secondary)',
                                    fontWeight: 600,
                                }}>
                                    <FileCheck size={12} /> {file.name}
                                </div>
                            ) : (
                                <div style={{
                                    fontSize: 'var(--label-sm)',
                                    color: 'var(--outline)',
                                    fontWeight: 600,
                                }}>
                                    {isDragActive ? 'Drop here' : `Drag & drop or click — ${req.accept}`}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* ═══ Error Banner ═══ */}
            {error && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '16px 20px', borderRadius: 'var(--radius-lg)',
                    background: 'rgba(227,26,26,0.08)',
                    border: '1px solid rgba(227,26,26,0.15)',
                }}>
                    <AlertCircle size={18} color="var(--error)" />
                    <span style={{ color: 'var(--error)', fontSize: 'var(--body-sm)', fontWeight: 600 }}>{error}</span>
                </div>
            )}

            {/* ═══ Success Banner ═══ */}
            {result && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '16px 20px', borderRadius: 'var(--radius-lg)',
                    background: 'rgba(1,181,116,0.08)',
                    border: '1px solid rgba(1,181,116,0.15)',
                }}>
                    <CheckCircle size={18} color="var(--secondary)" />
                    <span style={{ color: 'var(--secondary)', fontSize: 'var(--body-sm)', fontWeight: 600 }}>
                        {result.message || 'Model deployed successfully!'}
                    </span>
                </div>
            )}

            {/* ═══ Action Buttons ═══ */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button className="btn-primary" onClick={handleUpload} disabled={!allFilesReady || uploading}
                    style={{
                        padding: '14px 28px',
                        display: 'flex', alignItems: 'center', gap: '10px',
                        fontSize: 'var(--body-sm)',
                    }}>
                    {uploading ? (
                        <>
                            <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                            Deploying...
                        </>
                    ) : (
                        <>
                            <UploadIcon size={16} />
                            Deploy Model ({fileCount}/4)
                        </>
                    )}
                </button>

                <button className="btn-secondary" onClick={handleDemo} disabled={demoLoading}
                    style={{
                        padding: '14px 28px',
                        display: 'flex', alignItems: 'center', gap: '10px',
                        fontSize: 'var(--body-sm)',
                    }}>
                    <Sparkles size={16} />
                    {demoLoading ? 'Loading...' : 'Load Demo'}
                </button>

                <button className="btn-secondary" onClick={() => { setFiles({}); setResult(null); setError(null); setCurrentStep(1) }}
                    style={{
                        padding: '14px 28px',
                        display: 'flex', alignItems: 'center', gap: '10px',
                        fontSize: 'var(--body-sm)',
                    }}>
                    <RefreshCw size={16} />
                    Reset
                </button>
            </div>

            {/* ═══ Current Model Info ═══ */}
            {status?.model_loaded && (
                <div style={{
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: 'var(--border-card)',
                    padding: 'var(--space-lg)',
                }}>
                    <span className="label-text" style={{ marginBottom: '16px', display: 'block' }}>Currently Loaded Model</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        {[
                            { icon: Cpu, label: 'Model', value: status.model_name || 'Unknown', color: '#0075FF' },
                            { icon: Layers, label: 'Features', value: `${status.n_features || '—'} features`, color: '#7551FF' },
                            { icon: Shield, label: 'Status', value: 'Active', color: '#01B574' },
                        ].map((info, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                                background: 'var(--surface-container)',
                            }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: '8px',
                                    background: `${info.color}12`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <info.icon size={16} color={info.color} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <div style={{
                                        fontFamily: 'var(--font-label)', fontSize: '0.6rem',
                                        color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.05em',
                                    }}>{info.label}</div>
                                    <div style={{
                                        fontFamily: 'var(--font-display)', fontSize: 'var(--body-sm)',
                                        color: '#FFFFFF', fontWeight: 600,
                                    }}>{info.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}