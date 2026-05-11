import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Navbar from './components/navbar'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Logs from './pages/Logs'
import Analysis from './pages/Analysis'
import Settings from './pages/Settings'
import Support from './pages/Support'

function App() {
    return (
        <Router>
            <div style={{
                display: 'flex',
                height: '100vh',
                background: 'var(--background)',
                color: 'var(--on-surface)',
                fontFamily: 'var(--font-body)',
                overflow: 'hidden' // prevent body scroll, handle scroll in content area
            }}>
                {/* Fixed Sidebar */}
                <Sidebar />

                {/* Main Content Area */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden', // Contain scrolling to the inner div
                    position: 'relative'
                }}>
                    {/* Fixed Navbar at the top of content */}
                    <Navbar />

                    {/* Scrollable Content */}
                    <main style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '0 var(--space-lg) var(--space-2xl)', // spacing around content
                    }}>
                        <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
                            <Routes>
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/upload" element={<Upload />} />
                                <Route path="/logs" element={<Logs />} />
                                <Route path="/analysis" element={<Analysis />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="/support" element={<Support />} />
                            </Routes>
                        </div>
                    </main>
                </div>
            </div>
        </Router>
    )
}

export default App