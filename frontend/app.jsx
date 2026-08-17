const { useState, useEffect } = React;
const { motion, AnimatePresence } = window.Motion;

const formFields = [
    { name: 'age', label: 'Age', type: 'number', placeholder: 'e.g. 45' },
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

const Navbar = ({ setPage, isDark, toggleTheme, user, setUser }) => {
    return (
        <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center transition-colors duration-300">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setPage('home')}>
                <i className="ph-fill ph-heartbeat text-3xl text-primary drop-shadow-md"></i>
                <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    KidneyCare AI
                </span>
            </div>
            <div className="hidden md:flex space-x-6 items-center font-medium">
                <a onClick={() => setPage('home')} className="cursor-pointer hover:text-primary transition">Home</a>
                <a onClick={() => setPage('about')} className="cursor-pointer hover:text-primary transition">About</a>
                
                {user ? (
                    <>
                        <a onClick={() => setPage('dashboard')} className="cursor-pointer hover:text-primary transition">Dashboard</a>
                        <a onClick={() => setPage('history')} className="cursor-pointer hover:text-primary transition">History</a>
                        <button onClick={() => { setUser(null); setPage('home'); }} className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition">Logout</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setPage('login')} className="px-5 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl transition font-semibold">Sign In</button>
                        <button onClick={() => setPage('register')} className="px-5 py-2 bg-primary hover:bg-blue-600 text-white rounded-xl transition shadow-lg shadow-primary/40 font-semibold">Sign Up</button>
                    </>
                )}
                
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition text-xl">
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
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">Leveraging state-of-the-art machine learning to provide accurate, early detection of chronic kidney diseases. Empowering doctors and patients with instant insights.</p>
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
        <h2 className="text-4xl font-bold mb-8 text-center">About The Project</h2>
        <div className="glass p-8 rounded-2xl shadow-lg prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed">The Kidney Disease Prediction System is a modern web application designed to assist medical professionals in diagnosing Chronic Kidney Disease (CKD). By utilizing a trained Machine Learning model (Random Forest Classifier), the system analyzes 24 distinct medical parameters to provide an instant prediction along with a confidence score.</p>
            <h3 className="text-2xl font-semibold mt-6 mb-4">Technology Stack</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                    <i className="ph-fill ph-browsers text-4xl text-primary mb-2"></i>
                    <h4 className="font-bold">Frontend</h4>
                    <p className="text-sm">React, Tailwind CSS, Framer Motion</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                    <i className="ph-fill ph-hard-drives text-4xl text-secondary mb-2"></i>
                    <h4 className="font-bold">Backend</h4>
                    <p className="text-sm">Python, FastAPI, SQLite</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                    <i className="ph-fill ph-brain text-4xl text-purple-500 mb-2"></i>
                    <h4 className="font-bold">Machine Learning</h4>
                    <p className="text-sm">Scikit-learn, Random Forest</p>
                </div>
            </div>
        </div>
    </motion.div>
);

const AuthPage = ({ setPage, setUser, isLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

        if (isLogin) {
            const user = storedUsers.find(u => u.email === email && u.password === password);
            if (user) {
                setUser({ name: user.name, email: user.email });
                setPage('dashboard');
            } else if (email === 'doctor@hospital.com' && password === 'password123') {
                // Keep the mock fallback
                setUser({ name: 'Dr. Jane Doe', email: 'doctor@hospital.com' });
                setPage('dashboard');
            } else {
                setError('Invalid email or password.');
            }
        } else {
            if (email && password && name) {
                const userExists = storedUsers.some(u => u.email === email);
                if (userExists) {
                    setError('Email already registered.');
                } else {
                    storedUsers.push({ email, password, name });
                    localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));
                    setUser({ name, email });
                    setPage('dashboard');
                }
            } else {
                setError('Please fill in all fields.');
            }
        }
    };
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 gradient-bg">
            <div className="glass p-10 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
                <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-white">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-xl mb-4 text-sm font-semibold">{error}</div>}
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
                    <button type="submit" className="w-full py-3 mt-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:opacity-90 transition shadow-lg shadow-primary/30">
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

const API_BASE_URLS = ['http://localhost:8000', 'http://127.0.0.1:8000'];

const resolveApiBaseUrl = async () => {
    for (const baseUrl of API_BASE_URLS) {
        try {
            await axios.get(`${baseUrl}/docs`, { timeout: 1500 });
            return baseUrl;
        } catch (error) {
            // Try the next local backend URL.
        }
    }

    return API_BASE_URLS[0];
};

const Dashboard = ({ setPage, user, historyData, setPredictionData }) => {
    const totalPredictions = historyData.length;
    const positiveCases = historyData.filter(h => h.status === 'Detected').length;
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-3xl border border-primary/20">
                <div>
                    <h2 className="text-4xl font-bold mb-2">Hello, {user.name} 👋</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Ready to make new predictions today?</p>
                </div>
                <button onClick={() => setPage('predict')} className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/40 hover:scale-105 transition transform flex items-center gap-2">
                    <i className="ph-bold ph-plus"></i> New Prediction
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl shadow-md border-l-4 border-primary">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 font-semibold">Total Predictions</h3>
                        <i className="ph-fill ph-chart-line-up text-2xl text-primary"></i>
                    </div>
                    <p className="text-4xl font-black">{totalPredictions}</p>
                    <p className="text-sm text-green-500 mt-2"><i className="ph ph-trend-up"></i> Live updates</p>
                </div>
                <div className="glass p-6 rounded-2xl shadow-md border-l-4 border-red-500">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 font-semibold">Positive Cases</h3>
                        <i className="ph-fill ph-warning-circle text-2xl text-red-500"></i>
                    </div>
                    <p className="text-4xl font-black">{positiveCases}</p>
                    <p className="text-sm text-gray-500 mt-2">Requires attention</p>
                </div>
                <div className="glass p-6 rounded-2xl shadow-md border-l-4 border-secondary">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-gray-500 dark:text-gray-400 font-semibold">Model Accuracy</h3>
                        <i className="ph-fill ph-target text-2xl text-secondary"></i>
                    </div>
                    <p className="text-4xl font-black">98.0%</p>
                    <p className="text-sm text-gray-500 mt-2">Based on test dataset</p>
                </div>
            </div>

            <div className="glass p-8 rounded-3xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">Recent Predictions</h3>
                    <button onClick={() => setPage('history')} className="text-primary hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                                <th className="p-3">Patient ID</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Risk Level</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyData.slice(0, 5).map((row, i) => (
                                <tr key={i} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                    <td className="p-3 font-semibold">{row.id}</td>
                                    <td className="p-3">{row.date}</td>
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
                                                probability: parseInt(row.confidence) / 100,
                                                risk_level: row.risk
                                            });
                                            setPage('result');
                                        }} className="text-primary hover:text-blue-700"><i className="ph-bold ph-eye"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

const PredictionForm = ({ setPage, setPredictionData, addHistory }) => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setApiError('');

        try {
            const dataToSubmit = {};
            formFields.forEach(f => {
                dataToSubmit[f.name] = formData[f.name] || (f.type === 'number' ? '0' : f.options[0]);
                if (f.type === 'number') dataToSubmit[f.name] = parseFloat(dataToSubmit[f.name]);
            });

            const apiBaseUrl = await resolveApiBaseUrl();
            const res = await axios.post(`${apiBaseUrl}/predict`, dataToSubmit, { timeout: 10000 });
            const resultData = res.data;
            setPredictionData(resultData);

            addHistory({
                id: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                risk: resultData.risk_level,
                status: resultData.prediction.includes('No Kidney') ? 'Normal' : 'Detected',
                confidence: `${Math.round(resultData.probability * 100)}%`,
                ageGender: `${dataToSubmit.age || 45} / M`
            });

            setPage('result');
        } catch (error) {
            console.error('Prediction Error:', error);
            const detail = error?.response?.data?.detail || '';
            setApiError(
                detail ||
                'Unable to connect to the prediction server. Start the backend with: cd backend && python main.py'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 max-w-5xl mx-auto">
            <div className="glass p-10 rounded-3xl shadow-xl">
                <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h2 className="text-3xl font-extrabold flex items-center gap-3">
                        <i className="ph-duotone ph-file-text text-primary"></i> Patient Medical Data
                    </h2>
                    <p className="text-gray-500 mt-2">Fill in the 24 clinical features to run the prediction model.</p>
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
                                        required 
                                        onChange={handleChange}
                                        className="w-full bg-transparent outline-none cursor-pointer text-gray-900 dark:text-white"
                                    >
                                        <option value="" disabled selected hidden>Select option</option>
                                        {field.options.map(opt => <option key={opt} value={opt} className="dark:bg-gray-800">{opt}</option>)}
                                    </select>
                                ) : (
                                    <input 
                                        type={field.type} 
                                        name={field.name} 
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
                    
                    <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
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
        setPage('dashboard');
        return null;
    }

    const isDetected = predictionData.prediction.includes('Detected') && !predictionData.prediction.includes('No ');
    const probPercent = Math.round(predictionData.probability * 100);
    const circleCircumference = 2 * Math.PI * 60;
    const strokeDashoffset = circleCircumference - (probPercent / 100) * circleCircumference;

    return (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-8 max-w-4xl mx-auto">
            <div className={`glass p-12 rounded-3xl shadow-2xl border-t-8 ${isDetected ? 'border-red-500' : 'border-green-500'} relative overflow-hidden`}>
                
                <div className="text-center mb-10 z-10 relative">
                    <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-2">Analysis Complete</h2>
                    <h1 className={`text-4xl md:text-5xl font-black ${isDetected ? 'text-red-500' : 'text-green-500'}`}>
                        {predictionData.prediction}
                    </h1>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-around gap-10 z-10 relative">
                    
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
                            <span className="text-xs text-gray-500 uppercase tracking-wide">Confidence</span>
                        </div>
                    </div>

                    <div className="space-y-6 flex-1 w-full">
                        <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-500 mb-1">Risk Level</h3>
                            <p className={`text-2xl font-black ${
                                predictionData.risk_level === 'High' ? 'text-red-500' :
                                predictionData.risk_level === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                            }`}>{predictionData.risk_level}</p>
                        </div>
                        <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-500 mb-2">Recommendation</h3>
                            <p className="text-sm font-medium">
                                {isDetected ? 
                                "Immediate consultation with a nephrologist is recommended. Further clinical tests such as GFR estimation and ultrasound are advised." : 
                                "Patient parameters are within normal ranges. Suggest regular annual check-ups to maintain healthy kidney function."}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex justify-center gap-4 z-10 relative">
                    <button onClick={() => setPage('dashboard')} className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl font-bold transition">
                        Back to Dashboard
                    </button>
                    <button onClick={() => {
                        const recommendation = isDetected ? 
                            "Immediate consultation with a nephrologist is recommended. Further clinical tests such as GFR estimation and ultrasound are advised." : 
                            "Patient parameters are within normal ranges. Suggest regular annual check-ups to maintain healthy kidney function.";
                        const element = document.createElement("a");
                        const file = new Blob([`KidneyCare AI Report\n\nResult: ${predictionData.prediction}\nConfidence: ${probPercent}%\nRisk Level: ${predictionData.risk_level}\nRecommendation: ${recommendation}`], {type: 'text/plain'});
                        element.href = URL.createObjectURL(file);
                        element.download = "prediction_report.txt";
                        document.body.appendChild(element);
                        element.click();
                    }} className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition shadow-lg shadow-primary/30 flex items-center gap-2">
                        <i className="ph-bold ph-download-simple"></i> Download Report
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
        const matchSearch = row.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchFilter = filterStatus === 'All' || row.status === filterStatus;
        return matchSearch && matchFilter;
    });

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Prediction History</h2>
            <div className="glass rounded-3xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center gap-4 flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                        <i className="ph ph-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input 
                            type="text" 
                            placeholder="Search Patient ID..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none" 
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 font-semibold">Filter:</span>
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
                        >
                            <option value="All">All</option>
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
                            <th className="p-4 font-semibold">Age/Gender</th>
                            <th className="p-4 font-semibold">Result</th>
                            <th className="p-4 font-semibold">Confidence</th>
                            <th className="p-4 font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHistory.map((row, i) => (
                            <tr key={i} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="p-4">{row.date}</td>
                                <td className="p-4 font-bold text-primary">{row.id}</td>
                                <td className="p-4">{row.ageGender}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${row.status === 'Detected' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                                        {row.status}
                                    </span>
                                </td>
                                <td className="p-4 font-mono">{row.confidence}</td>
                                <td className="p-4"><button onClick={() => {
                                    setPredictionData({
                                        prediction: row.status === 'Detected' ? 'Kidney Disease Detected' : 'No Kidney Disease Detected',
                                        probability: parseInt(row.confidence) / 100,
                                        risk_level: row.risk
                                    });
                                    setPage('result');
                                }} className="text-gray-400 hover:text-primary transition"><i className="ph-bold ph-eye"></i></button></td>
                            </tr>
                        ))}
                        {filteredHistory.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500">No matching records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

const App = () => {
    const [page, setPage] = useState('home');
    const [isDark, setIsDark] = useState(true);
    const [user, setUser] = useState(null);
    const [predictionData, setPredictionData] = useState(null);
    const [historyData, setHistoryData] = useState([
        { id: 'PT-1042', date: 'Oct 24, 2026', risk: 'High', status: 'Detected', confidence: '89%', ageGender: '45 / M' },
        { id: 'PT-1043', date: 'Oct 24, 2026', risk: 'Low', status: 'Normal', confidence: '95%', ageGender: '32 / F' },
        { id: 'PT-1044', date: 'Oct 23, 2026', risk: 'Medium', status: 'Detected', confidence: '72%', ageGender: '55 / M' }
    ]);

    const addHistory = (newRecord) => {
        setHistoryData(prev => [newRecord, ...prev]);
    };

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <div className="min-h-screen text-gray-900 dark:text-gray-100 selection:bg-primary selection:text-white">
            <Navbar setPage={setPage} isDark={isDark} toggleTheme={toggleTheme} user={user} setUser={setUser}/>
            
            <AnimatePresence mode="wait">
                {page === 'home' && <LandingPage key="home" setPage={setPage} />}
                {page === 'about' && <AboutPage key="about" setPage={setPage} />}
                {page === 'login' && <AuthPage key="login" setPage={setPage} setUser={setUser} isLogin={true} />}
                {page === 'register' && <AuthPage key="register" setPage={setPage} setUser={setUser} isLogin={false} />}
                {page === 'dashboard' && <Dashboard key="dashboard" setPage={setPage} user={user} historyData={historyData} setPredictionData={setPredictionData} />}
                {page === 'predict' && <PredictionForm key="predict" setPage={setPage} setPredictionData={setPredictionData} addHistory={addHistory} />}
                {page === 'result' && <ResultPage key="result" setPage={setPage} predictionData={predictionData} />}
                {page === 'history' && <HistoryPage key="history" setPage={setPage} historyData={historyData} setPredictionData={setPredictionData} />}
            </AnimatePresence>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
