const { useState, useEffect, useRef } = React;
const { motion, AnimatePresence } = window.Motion;

const formFields = [
    { name: 'age', label: 'Age', type: 'number', placeholder: 'e.g. 45' },
    { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
    { name: 'blood_pressure', label: 'Blood Pressure', type: 'number', placeholder: 'e.g. 80' },
    { name: 'specific_gravity', label: 'Specific Gravity', type: 'select', options: ['1.005', '1.010', '1.015', '1.020', '1.025'] },
    { name: 'albumin', label: 'Albumin', type: 'number', placeholder: '0 to 5', min: 0, max: 5 },
    { name: 'sugar', label: 'Sugar', type: 'number', placeholder: '0 to 5', min: 0, max: 5 },
    { name: 'red_blood_cells', label: 'Red Blood Cells', type: 'select', options: ['normal', 'abnormal'] },
    { name: 'pus_cell', label: 'Pus Cell', type: 'select', options: ['normal', 'abnormal'] },
    { name: 'pus_cell_clumps', label: 'Pus Cell Clumps', type: 'select', options: ['present', 'notpresent'] },
    { name: 'bacteria', label: 'Bacteria', type: 'select', options: ['present', 'notpresent'] },
    { name: 'blood_glucose_random', label: 'Blood Glucose Random', type: 'number', placeholder: 'e.g. 121' },
    { name: 'blood_urea', label: 'Blood Urea', type: 'number', placeholder: 'e.g. 36' },
    { name: 'serum_creatinine', label: 'Serum Creatinine', type: 'number', placeholder: 'e.g. 1.2', step: "0.1" },
    { name: 'sodium', label: 'Sodium', type: 'number', placeholder: 'e.g. 135' },
    { name: 'potassium', label: 'Potassium', type: 'number', placeholder: 'e.g. 4.5', step: "0.1" },
    { name: 'hemoglobin', label: 'Hemoglobin', type: 'number', placeholder: 'e.g. 15.4', step: "0.1" },
    { name: 'packed_cell_volume', label: 'Packed Cell Volume', type: 'number', placeholder: 'e.g. 44' },
    { name: 'white_blood_cell_count', label: 'White Blood Cell Count', type: 'number', placeholder: 'e.g. 7800' },
    { name: 'red_blood_cell_count', label: 'Red Blood Cell Count', type: 'number', placeholder: 'e.g. 5.2', step: "0.1" },
    { name: 'hypertension', label: 'Hypertension', type: 'select', options: ['yes', 'no'] },
    { name: 'diabetes_mellitus', label: 'Diabetes Mellitus', type: 'select', options: ['yes', 'no'] },
    { name: 'coronary_artery_disease', label: 'Coronary Artery Disease', type: 'select', options: ['yes', 'no'] },
    { name: 'appetite', label: 'Appetite', type: 'select', options: ['good', 'poor'] },
    { name: 'pedal_edema', label: 'Pedal Edema', type: 'select', options: ['yes', 'no'] },
    { name: 'anemia', label: 'Anemia', type: 'select', options: ['yes', 'no'] },
];

const API_BASE_URLS = ['http://127.0.0.1:8000', 'http://localhost:8000'];
let cachedApiBaseUrl = null;

const resolveApiBaseUrl = async () => {
    if (cachedApiBaseUrl) {
        try {
            await axios.get(`${cachedApiBaseUrl}/health`, { timeout: 2000 });
            return cachedApiBaseUrl;
        } catch (e) {
            cachedApiBaseUrl = null;
        }
    }

    for (const baseUrl of API_BASE_URLS) {
        try {
            const res = await axios.get(`${baseUrl}/health`, { timeout: 2500 });
            if (res.data && res.data.status === 'ok') {
                cachedApiBaseUrl = baseUrl;
                return baseUrl;
            }
        } catch (error) {
            try {
                await axios.get(`${baseUrl}/docs`, { timeout: 2000 });
                cachedApiBaseUrl = baseUrl;
                return baseUrl;
            } catch (err) {}
        }
    }

    return API_BASE_URLS[0];
};

const Navbar = ({ setPage, isDark, toggleTheme, user, setUser, serverStatus }) => {
    return (
        <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center transition-colors duration-300">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setPage('home')}>
                <i className="ph-fill ph-heartbeat text-3xl text-primary drop-shadow-md"></i>
                <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    KidneyCare AI
                </span>
                <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    serverStatus === 'online' ? 'bg-green-500/10 text-green-500 border border-green-500/30' :
                    serverStatus === 'checking' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30' :
                    'bg-red-500/10 text-red-500 border border-red-500/30'
                }`}>
                    <span className={`w-2 h-2 rounded-full ${
                        serverStatus === 'online' ? 'bg-green-500 animate-pulse' :
                        serverStatus === 'checking' ? 'bg-yellow-500 animate-ping' :
                        'bg-red-500'
                    }`}></span>
                    {serverStatus === 'online' ? 'Server Connected' : serverStatus === 'checking' ? 'Connecting...' : 'Offline Mode'}
                </span>
            </div>
            <div className="hidden md:flex space-x-6 items-center font-medium">
                <a onClick={() => setPage('home')} className="cursor-pointer hover:text-primary transition">Home</a>
                <a onClick={() => setPage('about')} className="cursor-pointer hover:text-primary transition">About</a>
                <a onClick={() => setPage('admin')} className="cursor-pointer hover:text-primary transition flex items-center gap-1"><i className="ph-bold ph-shield-check"></i> Admin Portal</a>
                
                {user ? (
                    <>
                        <a onClick={() => setPage('dashboard')} className="cursor-pointer hover:text-primary transition">Dashboard</a>
                        <a onClick={() => setPage('history')} className="cursor-pointer hover:text-primary transition">History</a>
                        <button onClick={() => { setUser(null); setPage('home'); }} className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition font-semibold">Logout</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setPage('login')} className="px-5 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl transition font-semibold">Sign In</button>
                        <button onClick={() => setPage('register')} className="px-5 py-2 bg-primary hover:bg-blue-600 text-white rounded-xl transition shadow-lg shadow-primary/40 font-semibold">Sign Up</button>
                    </>
                )}
                
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition text-xl" title="Toggle Theme">
                    {isDark ? <i className="ph-fill ph-sun text-yellow-400"></i> : <i className="ph-fill ph-moon text-indigo-900"></i>}
                </button>
            </div>
        </nav>
    );
};

const LandingPage = ({ setPage }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-[calc(100vh-80px)] gradient-bg flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="glass p-12 rounded-3xl max-w-4xl w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"></div>
            
            <motion.i animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="ph-duotone ph-stethoscope text-7xl text-primary mb-6 inline-block"></motion.i>
            <h1 className="text-6xl font-black mb-6 text-gray-900 dark:text-white tracking-tight">Predict Kidney Disease with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">AI</span></h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">Leveraging state-of-the-art machine learning to provide accurate, early detection of chronic kidney diseases. Auto-syncing history & clinical parameters in SQLite database.</p>
            <div className="flex gap-4 justify-center">
                <button onClick={() => setPage('register')} className="px-8 py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-blue-600 transition shadow-xl shadow-primary/40 flex items-center gap-2 group">
                    Get Started <i className="ph-bold ph-arrow-right group-hover:translate-x-1 transition-transform"></i>
                </button>
                <button onClick={() => setPage('about')} className="px-8 py-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md text-gray-900 dark:text-white text-lg font-bold rounded-xl border border-gray-300/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-700 transition">
                    Learn More
                </button>
            </div>
        </motion.div>
    </motion.div>
);

const AboutPage = ({ setPage }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen p-10 max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center">About KidneyCare AI</h2>
        <div className="glass p-8 rounded-2xl shadow-lg prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed">KidneyCare AI is a clinical decision-support tool for reviewing risk patterns associated with chronic kidney disease (CKD). It evaluates patient-provided laboratory findings, vital signs, urine observations and relevant medical conditions to help identify assessments that may need professional follow-up.</p>
            <h3 className="text-2xl font-semibold mt-8 mb-4">Kidney Health Signals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                <div className="p-5 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                    <h4 className="font-bold flex items-center gap-2"><i className="ph-fill ph-test-tube text-primary"></i> Renal function</h4>
                    <p className="text-sm mt-2">Serum creatinine, blood urea, sodium and potassium help provide a picture of kidney filtration and electrolyte balance.</p>
                </div>
                <div className="p-5 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                    <h4 className="font-bold flex items-center gap-2"><i className="ph-fill ph-drop text-secondary"></i> Urine findings</h4>
                    <p className="text-sm mt-2">Albumin, sugar, specific gravity, red blood cells, pus cells and bacteria describe important urine patterns.</p>
                </div>
                <div className="p-5 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                    <h4 className="font-bold flex items-center gap-2"><i className="ph-fill ph-heartbeat text-red-500"></i> Blood and vital markers</h4>
                    <p className="text-sm mt-2">Blood pressure, hemoglobin, packed cell volume and blood cell counts add context to the kidney risk assessment.</p>
                </div>
                <div className="p-5 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                    <h4 className="font-bold flex items-center gap-2"><i className="ph-fill ph-shield-warning text-yellow-500"></i> Related conditions</h4>
                    <p className="text-sm mt-2">Diabetes, hypertension, coronary artery disease, anemia, appetite changes and pedal edema are considered as related risk factors.</p>
                </div>
            </div>
            <div className="mt-8 p-5 rounded-xl border-l-4 border-primary bg-primary/10 not-prose">
                <h3 className="text-lg font-bold flex items-center gap-2"><i className="ph-fill ph-info text-primary"></i> Important clinical note</h3>
                <p className="text-sm mt-2">This tool supports screening and record review. It does not confirm or rule out CKD, replace eGFR or urine testing, or provide a diagnosis. A qualified healthcare professional should interpret results alongside the patient’s history, examination and laboratory reports.</p>
            </div>
        </div>
    </motion.div>
);

const AuthPage = ({ setPage, setUser, setUserPreferences, isLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const apiBaseUrl = await resolveApiBaseUrl();
            const endpoint = isLogin ? `${apiBaseUrl}/login` : `${apiBaseUrl}/register`;
            const payload = isLogin ? { email, password } : { name, email, password };
            
            const res = await axios.post(endpoint, payload, { timeout: 8000 });
            if (res.data && res.data.user) {
                setUser(res.data.user);
                if (res.data.preferences) {
                    setUserPreferences(res.data.preferences);
                }
                setPage('dashboard');
            }
        } catch (err) {
            console.error('Auth Error:', err);
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else if (err.code === "ECONNABORTED" || err.message?.includes('Network Error')) {
                setError("Unable to connect to backend server at http://127.0.0.1:8000. Please ensure the server is running.");
            } else {
                setError('Authentication failed. Please check your credentials and server connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 gradient-bg">
            <div className="glass p-10 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
                <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-white">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-4 text-sm font-semibold flex items-center gap-2">
                    <i className="ph-fill ph-warning-circle text-xl flex-shrink-0"></i>
                    <span>{error}</span>
                </div>}
                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Full Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary outline-none backdrop-blur-sm" placeholder="Dr. John Doe"/>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary outline-none backdrop-blur-sm" placeholder="doctor@hospital.com"/>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Password</label>
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-900/50 focus:ring-2 focus:ring-primary outline-none backdrop-blur-sm" placeholder="••••••••"/>
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none">
                                {showPassword ? <i className="ph-fill ph-eye-slash text-lg"></i> : <i className="ph-fill ph-eye text-lg"></i>}
                            </button>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-3 mt-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:opacity-90 transition shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                        {loading && <i className="ph-bold ph-spinner animate-spin text-lg"></i>}
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span className="text-primary font-bold cursor-pointer hover:underline" onClick={() => setPage(isLogin ? 'register' : 'login')}>
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </span>
                </p>
            </div>
        </motion.div>
    );
};

const Dashboard = ({ setPage, user, historyData, setPredictionData }) => {
    const totalPredictions = historyData.length;
    const positiveCases = historyData.filter(h => h.status === 'Detected').length;
    const highRiskCases = historyData.filter(h => h.risk === 'High').length;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-3xl border border-primary/20">
                <div>
                    <h2 className="text-4xl font-bold mb-2">Hello, {user.name} 👋</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Review renal risk indicators and document the next CKD screening assessment. Patient results are saved to your clinical history.</p>
                </div>
                <button onClick={() => setPage('predict')} className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/40 hover:scale-105 transition transform flex items-center gap-2">
                    <i className="ph-bold ph-plus"></i> New CKD Assessment
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl shadow-md border-l-4 border-primary">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 font-semibold">Total Predictions</h3>
                        <i className="ph-fill ph-chart-line-up text-2xl text-primary"></i>
                    </div>
                    <p className="text-4xl font-black">{totalPredictions}</p>
                    <p className="text-sm text-green-500 mt-2"><i className="ph ph-database"></i> CKD screening records available</p>
                </div>
                <div className="glass p-6 rounded-2xl shadow-md border-l-4 border-red-500">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 font-semibold">CKD-Positive Assessments</h3>
                        <i className="ph-fill ph-warning-circle text-2xl text-red-500"></i>
                    </div>
                    <p className="text-4xl font-black">{positiveCases}</p>
                    <p className="text-sm text-gray-500 mt-2">Flagged for clinical review</p>
                </div>
                <div className="glass p-6 rounded-2xl shadow-md border-l-4 border-secondary">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 font-semibold">Clinical Review Queue</h3>
                        <i className="ph-fill ph-clipboard-text text-2xl text-secondary"></i>
                    </div>
                    <p className="text-4xl font-black">{highRiskCases}</p>
                    <p className="text-sm text-gray-500 mt-2">High-risk kidney assessments</p>
                    <p className="text-xs text-gray-400 mt-1">Review with a qualified healthcare professional</p>
                </div>
            </div>

            <div className="glass p-6 rounded-2xl shadow-md border border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                    <i className="ph-fill ph-first-aid-kit text-2xl text-primary"></i>
                    <div>
                        <h3 className="text-xl font-bold">Renal Risk Profile</h3>
                        <p className="text-sm text-gray-500">Key clinical domains used for CKD screening</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/10">
                        <p className="font-bold text-primary">Renal function</p>
                        <p className="text-xs text-gray-500 mt-1">Serum creatinine, blood urea, sodium and potassium</p>
                    </div>
                    <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/10">
                        <p className="font-bold text-secondary">Urine findings</p>
                        <p className="text-xs text-gray-500 mt-1">Albumin, sugar, specific gravity and infection markers</p>
                    </div>
                    <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/10">
                        <p className="font-bold text-yellow-600 dark:text-yellow-400">Blood markers</p>
                        <p className="text-xs text-gray-500 mt-1">Hemoglobin, cell counts and packed cell volume</p>
                    </div>
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/10">
                        <p className="font-bold text-red-500">Comorbidities</p>
                        <p className="text-xs text-gray-500 mt-1">Blood pressure, diabetes, hypertension and anemia</p>
                    </div>
                </div>
            </div>

            <div className="glass p-8 rounded-3xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">Recent CKD Screening Assessments</h3>
                    <button onClick={() => setPage('history')} className="text-primary font-bold hover:underline">View All ({historyData.length})</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                                <th className="p-3">Patient ID</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Age / Gender</th>
                                <th className="p-3">Kidney Risk</th>
                                <th className="p-3">Screening Result</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyData.slice(0, 5).map((row, i) => (
                                <tr key={i} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                    <td className="p-3 font-semibold text-primary">{row.id}</td>
                                    <td className="p-3">{row.date}</td>
                                    <td className="p-3 font-medium">{row.ageGender || '45 / Male'}</td>
                                    <td className="p-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            row.risk === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                            row.risk === 'Medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                            'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                        }`}>{row.risk}</span>
                                    </td>
                                    <td className="p-3 font-medium">{row.status}</td>
                                    <td className="p-3">
                                        <button onClick={() => {
                                            setPredictionData({
                                                prediction: row.status === 'Detected' ? 'Kidney Disease Detected' : 'No Kidney Disease Detected',
                                                status: row.status,
                                                probability: parseInt(row.confidence) / 100,
                                                confidence: row.confidence,
                                                risk_level: row.risk,
                                                patient_id: row.id,
                                                date: row.date,
                                                ageGender: row.ageGender,
                                                inputs: row.inputs || {}
                                            });
                                            setPage('result');
                                        }} className="text-primary hover:text-blue-700 font-semibold flex items-center gap-1"><i className="ph-bold ph-eye"></i> View</button>
                                    </td>
                                </tr>
                            ))}
                            {historyData.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">No CKD screening assessments recorded yet. Start a new assessment to review renal risk.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

const PredictionForm = ({ setPage, user, userPreferences, saveDraftPreferences, setPredictionData, addHistory }) => {
    const [formData, setFormData] = useState(() => {
        return (userPreferences && userPreferences.draft_form_data && Object.keys(userPreferences.draft_form_data).length > 0)
            ? userPreferences.draft_form_data
            : { gender: 'Male' };
    });
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [autoSaveStatus, setAutoSaveStatus] = useState('Saved');
    const autoSaveTimerRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...formData, [name]: value };
        setFormData(updated);
        setAutoSaveStatus('Saving...');

        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = setTimeout(() => {
            if (user?.email && saveDraftPreferences) {
                saveDraftPreferences(updated);
            }
            setAutoSaveStatus('Auto-saved');
        }, 1200);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setApiError('');

        try {
            const dataToSubmit = {};
            formFields.forEach(f => {
                dataToSubmit[f.name] = formData[f.name] !== undefined && formData[f.name] !== '' 
                    ? formData[f.name] 
                    : (f.type === 'number' ? '0' : f.options[0]);
                if (f.type === 'number') dataToSubmit[f.name] = parseFloat(dataToSubmit[f.name]);
            });
            if (user?.email) {
                dataToSubmit.user_email = user.email;
            }

            const apiBaseUrl = await resolveApiBaseUrl();
            const res = await axios.post(`${apiBaseUrl}/predict`, dataToSubmit, { timeout: 12000 });
            const resultData = res.data;
            
            const formattedResult = {
                prediction: resultData.prediction,
                status: resultData.status || (resultData.prediction.includes('No ') ? 'Normal' : 'Detected'),
                probability: resultData.probability,
                confidence: resultData.confidence || `${Math.round(resultData.probability * 100)}%`,
                risk_level: resultData.risk_level,
                patient_id: resultData.patient_id || resultData.record?.id || `PT-${Math.floor(1000 + Math.random() * 9000)}`,
                ageGender: resultData.ageGender || resultData.record?.ageGender || `${dataToSubmit.age || 45} / ${dataToSubmit.gender || 'Male'}`,
                date: resultData.date || resultData.record?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                inputs: dataToSubmit,
                record: resultData.record
            };

            setPredictionData(formattedResult);

            if (resultData.record) {
                addHistory(resultData.record);
            } else {
                addHistory({
                    id: formattedResult.patient_id,
                    date: formattedResult.date,
                    risk: formattedResult.risk_level,
                    status: formattedResult.status,
                    confidence: formattedResult.confidence,
                    ageGender: formattedResult.ageGender,
                    inputs: dataToSubmit
                });
            }

            setPage('result');
        } catch (error) {
            console.error('Prediction Error:', error);
            const detail = error?.response?.data?.detail || '';
            setApiError(
                detail ||
                'Unable to connect to the prediction server at http://127.0.0.1:8000.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 max-w-5xl mx-auto">
            <div className="glass p-10 rounded-3xl shadow-xl">
                <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6 flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold flex items-center gap-3">
                            <i className="ph-duotone ph-file-text text-primary"></i> Patient Medical Data
                        </h2>
                        <p className="text-gray-500 mt-2">Fill in the 24 clinical features to run the prediction model.</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-xs font-bold border border-primary/20">
                        <i className="ph-bold ph-floppy-disk text-sm"></i>
                        <span>{autoSaveStatus} to Database</span>
                    </div>
                </div>
                
                {apiError && (
                    <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-r-lg">
                        <p className="font-bold flex items-center gap-2"><i className="ph-fill ph-warning-circle text-xl"></i> Connection Error</p>
                        <p className="text-sm mt-1">{apiError}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {formFields.map((field, idx) => (
                            <div key={idx} className="bg-white/40 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary transition duration-300 focus-within:ring-2 focus-within:ring-primary/20">
                                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">{field.label}</label>
                                {field.type === 'select' ? (
                                    <select 
                                        name={field.name} 
                                        value={formData[field.name] || field.options[0]}
                                        required 
                                        onChange={handleChange}
                                        className="w-full bg-transparent outline-none cursor-pointer text-gray-900 dark:text-white"
                                    >
                                        {field.options.map(opt => <option key={opt} value={opt} className="dark:bg-gray-800 text-gray-900 dark:text-white">{opt}</option>)}
                                    </select>
                                ) : (
                                    <input 
                                        type={field.type} 
                                        name={field.name} 
                                        value={formData[field.name] !== undefined ? formData[field.name] : ''}
                                        placeholder={field.placeholder} 
                                        min={field.min} 
                                        max={field.max}
                                        step={field.step}
                                        required 
                                        onChange={handleChange}
                                        className="w-full bg-transparent outline-none placeholder-gray-400 dark:placeholder-gray-500"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button type="button" onClick={() => setFormData({ gender: 'Male' })} className="px-5 py-2.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-xl font-bold transition text-sm">
                            Clear Draft
                        </button>
                        <button type="submit" disabled={loading} className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-70 flex items-center gap-2">
                            {loading ? <i className="ph-bold ph-spinner animate-spin text-2xl"></i> : <i className="ph-bold ph-cpu text-2xl"></i>}
                            {loading ? 'Analyzing...' : 'Run Prediction Model'}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

const ResultPage = ({ setPage, predictionData }) => {
    if (!predictionData) {
        return (
            <div className="p-12 text-center">
                <p className="text-gray-500 mb-4">No active prediction report found.</p>
                <button onClick={() => setPage('dashboard')} className="px-6 py-3 bg-primary text-white font-bold rounded-xl">
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const isDetected = predictionData.status === 'Detected' || 
        (predictionData.prediction && predictionData.prediction.includes('Detected') && !predictionData.prediction.includes('No '));
    
    const probPercent = Math.round((predictionData.probability || 0) * 100);
    const circleCircumference = 2 * Math.PI * 60;
    const strokeDashoffset = circleCircumference - (probPercent / 100) * circleCircumference;

    const patientId = predictionData.patient_id || predictionData.record?.id || 'PT-1042';
    const ageGender = predictionData.ageGender || predictionData.record?.ageGender || '45 / Male';
    const examDate = predictionData.date || predictionData.record?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const inputs = predictionData.inputs || predictionData.record?.inputs || {};

    return (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-8 max-w-4xl mx-auto space-y-6">
            <div className="glass p-6 rounded-2xl flex flex-wrap justify-between items-center gap-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                        <i className="ph-fill ph-user-gear"></i>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-400">Patient ID:</span>
                            <span className="font-bold text-lg text-primary">{patientId}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            <i className="ph ph-user"></i> Age & Gender: <span className="font-semibold text-gray-800 dark:text-gray-200">{ageGender}</span>
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xs text-gray-400 block font-semibold uppercase">Exam Date</span>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{examDate}</span>
                </div>
            </div>

            <div className={`glass p-10 rounded-3xl shadow-2xl border-t-8 ${isDetected ? 'border-red-500' : 'border-green-500'} relative overflow-hidden space-y-8`}>
                
                <div className="text-center z-10 relative">
                    <span className="text-xs font-black tracking-widest text-gray-400 uppercase bg-gray-100 dark:bg-gray-800 px-4 py-1.5 rounded-full">
                        AI Clinical Analysis Result
                    </span>
                    <h1 className={`text-4xl md:text-5xl font-black mt-4 ${isDetected ? 'text-red-500' : 'text-green-500'}`}>
                        {isDetected ? 'Kidney Disease Detected' : 'No Kidney Disease Detected'}
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        {isDetected ? 'High likelihood of Chronic Kidney Disease detected from clinical parameters.' : 'Clinical values indicate healthy, normal kidney function.'}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-around gap-8 z-10 relative bg-white/40 dark:bg-gray-900/40 p-8 rounded-2xl border border-gray-100 dark:border-gray-800">
                    
                    <div className="relative flex items-center justify-center">
                        <svg className="w-48 h-48 transform -rotate-90">
                            <circle cx="96" cy="96" r="60" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-200 dark:text-gray-700" />
                            <motion.circle 
                                initial={{ strokeDashoffset: circleCircumference }}
                                animate={{ strokeDashoffset }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                cx="96" cy="96" r="60" stroke="currentColor" strokeWidth="12" fill="transparent" 
                                strokeDasharray={circleCircumference}
                                className={isDetected ? 'text-red-500' : 'text-green-500'}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center text-center">
                            <span className="text-4xl font-black">{probPercent}%</span>
                            <span className="text-xs text-gray-500 uppercase tracking-wide font-bold">Confidence</span>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1 w-full">
                        <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase">Risk Level</h3>
                                <p className={`text-xl font-black ${
                                    predictionData.risk_level === 'High' ? 'text-red-500' :
                                    predictionData.risk_level === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                                }`}>{predictionData.risk_level || 'Low'}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                predictionData.risk_level === 'High' ? 'bg-red-100 text-red-600' :
                                predictionData.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                            }`}>{predictionData.risk_level || 'Low'} Risk</span>
                        </div>

                        <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                            <h3 className="text-xs font-bold text-gray-500 uppercase mb-1">Clinical Recommendation</h3>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
                                {isDetected ? 
                                "Immediate consultation with a nephrologist is strongly advised. Additional diagnostic workups such as estimated GFR, renal ultrasound, and urinalysis are recommended." : 
                                "All submitted clinical biomarkers are within normal reference ranges. Recommend annual routine check-ups to maintain optimal renal health."}
                            </p>
                        </div>
                    </div>
                </div>

                {inputs && Object.keys(inputs).length > 0 && (
                    <div className="z-10 relative bg-white/30 dark:bg-gray-900/30 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <i className="ph-duotone ph-list-checks text-primary"></i> Saved Patient Biomarkers & Features
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            {Object.entries(inputs).filter(([k]) => k !== 'user_email').map(([key, val]) => (
                                <div key={key} className="p-2.5 rounded-lg bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50">
                                    <span className="block text-gray-400 font-semibold capitalize">{key.replace(/_/g, ' ')}</span>
                                    <span className="font-bold text-gray-800 dark:text-gray-200">{String(val)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap justify-center gap-4 z-10 relative pt-4">
                    <button onClick={() => setPage('dashboard')} className="px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-bold transition">
                        Back to Dashboard
                    </button>
                    <button onClick={() => setPage('predict')} className="px-6 py-3 bg-white dark:bg-gray-800 border border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-bold transition">
                        Predict Another Patient
                    </button>
                    <button onClick={() => {
                        const recommendation = isDetected ? 
                            "Immediate consultation with a nephrologist is recommended. Further clinical tests such as GFR estimation and ultrasound are advised." : 
                            "Patient parameters are within normal ranges. Suggest regular annual check-ups to maintain healthy kidney function.";
                        const reportText = `KIDNEYCARE AI DIAGNOSTIC REPORT\n---------------------------------------\nPatient ID: ${patientId}\nDate: ${examDate}\nAge & Gender: ${ageGender}\nResult: ${isDetected ? 'Kidney Disease Detected' : 'No Kidney Disease Detected'}\nConfidence Score: ${probPercent}%\nRisk Level: ${predictionData.risk_level || 'Low'}\nRecommendation: ${recommendation}\n`;
                        const reportWindow = window.open('', '_blank');
                        if (reportWindow) {
                            const reportPre = reportWindow.document.createElement('pre');
                            reportPre.textContent = reportText;
                            reportPre.style.cssText = 'font: 16px/1.6 system-ui, sans-serif; max-width: 800px; margin: 40px auto; white-space: pre-wrap;';
                            reportWindow.document.body.appendChild(reportPre);
                            reportWindow.document.title = `KidneyCare Report - ${patientId}`;
                            reportWindow.document.close();
                        }
                    }} className="px-6 py-3 bg-white dark:bg-gray-800 border border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-bold transition flex items-center gap-2">
                        <i className="ph-bold ph-eye"></i> View Report
                    </button>
                    <button onClick={() => {
                        const recommendation = isDetected ? 
                            "Immediate consultation with a nephrologist is recommended. Further clinical tests such as GFR estimation and ultrasound are advised." : 
                            "Patient parameters are within normal ranges. Suggest regular annual check-ups to maintain healthy kidney function.";
                        const reportText = `KIDNEYCARE AI DIAGNOSTIC REPORT\n---------------------------------------\nPatient ID: ${patientId}\nDate: ${examDate}\nAge & Gender: ${ageGender}\nResult: ${isDetected ? 'Kidney Disease Detected' : 'No Kidney Disease Detected'}\nConfidence Score: ${probPercent}%\nRisk Level: ${predictionData.risk_level || 'Low'}\nRecommendation: ${recommendation}\n`;
                        const element = document.createElement("a");
                        const file = new Blob([reportText], {type: 'text/plain'});
                        const reportUrl = URL.createObjectURL(file);
                        element.href = reportUrl;
                        element.download = `Report_${patientId}.txt`;
                        document.body.appendChild(element);
                        element.click();
                        element.remove();
                        setTimeout(() => URL.revokeObjectURL(reportUrl), 1000);
                    }} className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition shadow-lg shadow-primary/30 flex items-center gap-2">
                        <i className="ph-bold ph-download-simple"></i> Download Official Report
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const HistoryPage = ({ setPage, historyData, setPredictionData }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const filteredHistory = historyData.filter(row => {
        const matchSearch = row.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (row.ageGender && row.ageGender.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchFilter = filterStatus === 'All' || row.status === filterStatus;
        return matchSearch && matchFilter;
    });

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold">Prediction History</h2>
                    <p className="text-gray-500 text-sm mt-1">All saved patient predictions synced with database</p>
                </div>
                <button onClick={() => setPage('predict')} className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-blue-600 transition flex items-center gap-2">
                    <i className="ph-bold ph-plus"></i> New Prediction
                </button>
            </div>

            <div className="glass rounded-3xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center gap-4 flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                        <i className="ph ph-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input 
                            type="text" 
                            placeholder="Search by Patient ID or Age..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none" 
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 font-semibold">Filter Status:</span>
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
                        >
                            <option value="All">All Results</option>
                            <option value="Detected">Detected</option>
                            <option value="Normal">Normal</option>
                        </select>
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-100/50 dark:bg-gray-800/30 text-gray-500">
                        <tr>
                            <th className="p-4 font-semibold">Date</th>
                            <th className="p-4 font-semibold">Patient ID</th>
                            <th className="p-4 font-semibold">Age / Gender</th>
                            <th className="p-4 font-semibold">Risk Level</th>
                            <th className="p-4 font-semibold">Result</th>
                            <th className="p-4 font-semibold">Confidence</th>
                            <th className="p-4 font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHistory.map((row, i) => (
                            <tr key={i} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                <td className="p-4 text-sm">{row.date}</td>
                                <td className="p-4 font-bold text-primary">{row.id}</td>
                                <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">{row.ageGender || '45 / Male'}</td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                        row.risk === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                        row.risk === 'Medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                        'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                    }`}>{row.risk}</span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${row.status === 'Detected' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                                        {row.status}
                                    </span>
                                </td>
                                <td className="p-4 font-mono font-bold text-sm">{row.confidence}</td>
                                <td className="p-4">
                                    <button onClick={() => {
                                        setPredictionData({
                                            prediction: row.status === 'Detected' ? 'Kidney Disease Detected' : 'No Kidney Disease Detected',
                                            status: row.status,
                                            probability: parseInt(row.confidence) / 100,
                                            confidence: row.confidence,
                                            risk_level: row.risk,
                                            patient_id: row.id,
                                            date: row.date,
                                            ageGender: row.ageGender,
                                            inputs: row.inputs || {}
                                        });
                                        setPage('result');
                                    }} className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition font-semibold text-sm flex items-center gap-1">
                                        <i className="ph-bold ph-eye"></i> View Report
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredHistory.length === 0 && (
                            <tr>
                                <td colSpan="7" className="p-8 text-center text-gray-500">No matching prediction records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

const AdminPage = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [adminName, setAdminName] = useState('');
    const [isRegistering, setIsRegistering] = useState(null);
    const [token, setToken] = useState(() => sessionStorage.getItem('adminToken') || '');
    const [records, setRecords] = useState([]);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const loadRecords = async (adminToken) => {
        try {
            const apiBaseUrl = await resolveApiBaseUrl();
            const response = await axios.get(`${apiBaseUrl}/admin/predictions`, {
                headers: { 'X-Admin-Token': adminToken }
            });
            setRecords(response.data.predictions || []);
            setError('');
        } catch (err) {
            if (err.response?.status === 403) {
                sessionStorage.removeItem('adminToken');
                setToken('');
                setIsRegistering(false);
                setError('Your administrator session expired. Please sign in again.');
            } else {
                setError(err.response?.data?.detail || 'Unable to load administrator records.');
            }
        }
    };

    useEffect(() => {
        if (token) {
            loadRecords(token);
            return;
        }
        const loadAdminStatus = async () => {
            try {
                const apiBaseUrl = await resolveApiBaseUrl();
                const response = await axios.get(`${apiBaseUrl}/admin/status`);
                setIsRegistering(Boolean(response.data.can_register));
            } catch (err) {
                setError('Unable to check administrator setup status.');
                setIsRegistering(false);
            }
        };
        loadAdminStatus();
    }, [token]);

    const submitAdminAccess = async (event) => {
        event.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const apiBaseUrl = await resolveApiBaseUrl();
            if (isRegistering) {
                await axios.post(`${apiBaseUrl}/admin/register`, { name: adminName, ...credentials });
                setIsRegistering(false);
                setCredentials({ email: credentials.email, password: '' });
                setError('Administrator account created. Sign in to continue.');
            } else {
                const response = await axios.post(`${apiBaseUrl}/admin/login`, credentials);
                sessionStorage.setItem('adminToken', response.data.token);
                setToken(response.data.token);
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Administrator sign-in failed.');
        } finally {
            setSubmitting(false);
        }
    };

    const downloadReport = async (patientId) => {
        try {
            const apiBaseUrl = await resolveApiBaseUrl();
            const path = patientId ? `/admin/predictions/${encodeURIComponent(patientId)}/download` : '/admin/predictions/download';
            const response = await axios.get(`${apiBaseUrl}${path}`, {
                headers: { 'X-Admin-Token': token },
                responseType: 'blob'
            });
            const url = URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.download = patientId ? `KidneyCare_${patientId}.csv` : 'KidneyCare_All_Assessments.csv';
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (err) {
            setError('The report could not be downloaded.');
        }
    };

    const viewReport = (record) => {
        const reportWindow = window.open('', '_blank');
        if (!reportWindow) return;
        const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[character]));
        const result = record.status === 'Detected' ? 'Kidney Disease Detected' : 'No Kidney Disease Detected';
        const inputRows = Object.entries(record.inputs || {}).filter(([key]) => key !== 'user_email').map(([key, value]) => (
            `<tr><td>${escapeHtml(key.replace(/_/g, ' '))}</td><td>${escapeHtml(value)}</td></tr>`
        )).join('');
        reportWindow.document.write(`<!doctype html><html><head><title>KidneyCare Report - ${escapeHtml(record.patient_id)}</title><style>body{font:16px/1.5 system-ui,sans-serif;max-width:900px;margin:40px auto;padding:0 24px;color:#172033}h1{color:#087ea4}table{border-collapse:collapse;width:100%;margin-top:20px}td,th{border:1px solid #d8dee8;padding:10px;text-align:left}th{background:#eef5f7}.summary{padding:16px;background:#eef8fa;border-left:4px solid #0ea5e9}</style></head><body><h1>KidneyCare AI CKD Screening Report</h1><div class="summary"><strong>Patient ID:</strong> ${escapeHtml(record.patient_id)}<br><strong>Result:</strong> ${escapeHtml(result)}<br><strong>Kidney Risk:</strong> ${escapeHtml(record.risk)}<br><strong>Confidence:</strong> ${escapeHtml(record.confidence)}<br><strong>Date:</strong> ${escapeHtml(record.date)}<br><strong>Submitted by:</strong> ${escapeHtml(record.name)} (${escapeHtml(record.user_email)})</div><h2>Clinical Assessment Inputs</h2><table><thead><tr><th>Clinical marker</th><th>Recorded value</th></tr></thead><tbody>${inputRows || '<tr><td colspan="2">No detailed inputs recorded</td></tr>'}</tbody></table><p>This report supports clinical review and does not replace professional diagnosis.</p></body></html>`);
        reportWindow.document.close();
    };

    if (!token && isRegistering === null) {
        return <div className="p-12 text-center text-gray-500">Checking administrator setup...</div>;
    }

    if (!token) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 gradient-bg">
                <form onSubmit={submitAdminAccess} className="glass p-10 rounded-3xl w-full max-w-md shadow-2xl">
                    <div className="text-center mb-8">
                        <i className="ph-fill ph-shield-check text-5xl text-primary"></i>
                        <h2 className="text-3xl font-extrabold mt-3">{isRegistering ? 'Create Administrator Account' : 'Administrator Login'}</h2>
                        <p className="text-sm text-gray-500 mt-2">{isRegistering ? 'Register the first administrator for this kidney screening system' : 'Sign in to manage kidney screening records'}</p>
                    </div>
                    {error && <p className="mb-4 p-3 rounded-lg bg-primary/10 text-primary text-sm font-semibold">{error}</p>}
                    <div className="space-y-4">
                        {isRegistering && <input type="text" required placeholder="Administrator name" value={adminName} onChange={e => setAdminName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-900/50 outline-none" />}
                        <input type="email" required placeholder="Administrator email" value={credentials.email} onChange={e => { setError(''); setCredentials({ ...credentials, email: e.target.value }); }} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-900/50 outline-none" />
                        <input type="password" minLength="8" required placeholder="Administrator password (8+ characters)" value={credentials.password} onChange={e => { setError(''); setCredentials({ ...credentials, password: e.target.value }); }} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-900/50 outline-none" />
                        <button type="submit" disabled={submitting} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition disabled:opacity-60">{submitting ? 'Signing In...' : isRegistering ? 'Create Administrator Account' : 'Sign In Securely'}</button>
                        {isRegistering && <button type="button" onClick={() => { setIsRegistering(false); setError(''); }} className="w-full text-sm text-primary font-semibold hover:underline">Already registered? Sign in</button>}
                    </div>
                </form>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold flex items-center gap-3"><i className="ph-fill ph-shield-check text-primary"></i> Administrator Portal</h2>
                    <p className="text-gray-500 text-sm mt-1">All patient CKD screening assessments and report exports</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => downloadReport()} className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl flex items-center gap-2"><i className="ph-bold ph-download-simple"></i> Download All CSV</button>
                    <button onClick={() => { sessionStorage.removeItem('adminToken'); setToken(''); }} className="px-5 py-2.5 bg-red-500/10 text-red-500 font-bold rounded-xl">Sign Out</button>
                </div>
            </div>
            {error && <p className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm font-semibold">{error}</p>}
            <div className="glass rounded-3xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-5 border-b border-gray-200 dark:border-gray-700"><span className="font-bold">{records.length}</span> saved patient assessments</div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100/50 dark:bg-gray-800/30 text-gray-500"><tr><th className="p-4">Patient</th><th className="p-4">Submitted By</th><th className="p-4">Date</th><th className="p-4">Kidney Risk</th><th className="p-4">Result</th><th className="p-4">Action</th></tr></thead>
                        <tbody>
                            {records.map(record => <tr key={record.record_id} className="border-b border-gray-100 dark:border-gray-800">
                                <td className="p-4 font-bold text-primary">{record.patient_id}</td>
                                <td className="p-4"><span className="font-semibold">{record.name || 'Unknown user'}</span><span className="block text-xs text-gray-500">{record.user_email}</span></td>
                                <td className="p-4 text-sm">{record.date}</td>
                                <td className="p-4 font-semibold">{record.risk}</td>
                                <td className="p-4 font-semibold">{record.status} ({record.confidence})</td>
                                <td className="p-4"><div className="flex flex-wrap gap-2"><button onClick={() => viewReport(record)} className="px-3 py-1.5 bg-secondary/10 text-secondary rounded-lg font-semibold text-sm flex items-center gap-1"><i className="ph-bold ph-eye"></i> View Report</button><button onClick={() => downloadReport(record.patient_id)} className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg font-semibold text-sm flex items-center gap-1"><i className="ph-bold ph-download-simple"></i> Patient CSV</button></div></td>
                            </tr>)}
                            {records.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-gray-500">No patient assessments are available.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

const App = () => {
    const [page, setPage] = useState('home');
    const [isDark, setIsDark] = useState(true);
    const [serverStatus, setServerStatus] = useState('checking');
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('currentUser');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });
    const [userPreferences, setUserPreferences] = useState({
        theme: 'dark',
        auto_save: true,
        draft_form_data: {}
    });
    const [predictionData, setPredictionData] = useState(null);
    const [historyData, setHistoryData] = useState([]);

    const fetchHealthStatus = async () => {
        try {
            const apiBaseUrl = await resolveApiBaseUrl();
            const res = await axios.get(`${apiBaseUrl}/health`, { timeout: 3000 });
            if (res.data && res.data.status === 'ok') {
                setServerStatus('online');
            } else {
                setServerStatus('offline');
            }
        } catch (e) {
            setServerStatus('offline');
        }
    };

    const fetchHistory = async (userEmail) => {
        if (!userEmail) {
            setHistoryData([]);
            return;
        }
        try {
            const apiBaseUrl = await resolveApiBaseUrl();
            const res = await axios.get(`${apiBaseUrl}/history/${encodeURIComponent(userEmail)}`);
            if (res.data && res.data.history) {
                setHistoryData(res.data.history);
            }
        } catch (err) {
            console.error('Failed to fetch user prediction history:', err);
        }
    };

    const fetchUserPreferences = async (userEmail) => {
        if (!userEmail) return;
        try {
            const apiBaseUrl = await resolveApiBaseUrl();
            const res = await axios.get(`${apiBaseUrl}/preferences/${encodeURIComponent(userEmail)}`);
            if (res.data) {
                setUserPreferences(res.data);
                if (res.data.theme) {
                    setIsDark(res.data.theme === 'dark');
                }
            }
        } catch (err) {
            console.error('Failed to fetch user preferences:', err);
        }
    };

    const saveDraftPreferences = async (draftData) => {
        if (!user?.email) return;
        try {
            const apiBaseUrl = await resolveApiBaseUrl();
            const updatedPrefs = {
                ...userPreferences,
                theme: isDark ? 'dark' : 'light',
                draft_form_data: draftData
            };
            setUserPreferences(updatedPrefs);
            await axios.post(`${apiBaseUrl}/preferences/${encodeURIComponent(user.email)}`, updatedPrefs);
        } catch (e) {
            console.error("Failed to auto-save draft preferences:", e);
        }
    };

    useEffect(() => {
        fetchHealthStatus();
        const interval = setInterval(fetchHealthStatus, 15000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (user?.email) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            fetchHistory(user.email);
            fetchUserPreferences(user.email);
        } else {
            localStorage.removeItem('currentUser');
            setHistoryData([]);
        }
    }, [user]);

    const addHistory = (newRecord) => {
        setHistoryData(prev => [newRecord, ...prev]);
    };

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        if (user?.email) {
            const syncTheme = async () => {
                try {
                    const apiBaseUrl = await resolveApiBaseUrl();
                    await axios.post(`${apiBaseUrl}/preferences/${encodeURIComponent(user.email)}`, {
                        theme: isDark ? 'dark' : 'light',
                        auto_save: userPreferences.auto_save,
                        draft_form_data: userPreferences.draft_form_data || {}
                    });
                } catch (e) {}
            };
            syncTheme();
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <div className="min-h-screen text-gray-900 dark:text-gray-100 selection:bg-primary selection:text-white">
            <Navbar setPage={setPage} isDark={isDark} toggleTheme={toggleTheme} user={user} setUser={setUser} serverStatus={serverStatus} />
            
            <AnimatePresence mode="wait">
                {page === 'home' && <LandingPage key="home" setPage={setPage} />}
                {page === 'about' && <AboutPage key="about" setPage={setPage} />}
                {page === 'login' && <AuthPage key="login" setPage={setPage} setUser={setUser} setUserPreferences={setUserPreferences} isLogin={true} />}
                {page === 'register' && <AuthPage key="register" setPage={setPage} setUser={setUser} setUserPreferences={setUserPreferences} isLogin={false} />}
                {page === 'dashboard' && <Dashboard key="dashboard" setPage={setPage} user={user} historyData={historyData} setPredictionData={setPredictionData} />}
                {page === 'predict' && <PredictionForm key="predict" setPage={setPage} user={user} userPreferences={userPreferences} saveDraftPreferences={saveDraftPreferences} setPredictionData={setPredictionData} addHistory={addHistory} />}
                {page === 'result' && <ResultPage key="result" setPage={setPage} predictionData={predictionData} />}
                {page === 'history' && <HistoryPage key="history" setPage={setPage} historyData={historyData} setPredictionData={setPredictionData} />}
                {page === 'admin' && <AdminPage key="admin" />}
            </AnimatePresence>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
