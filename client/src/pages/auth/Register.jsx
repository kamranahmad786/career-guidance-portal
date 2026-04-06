import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Loader from '../../components/common/Loader';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSub = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, phoneNumber })
      });

      const data = await response.json();

      if (response.ok) {
        login(data, data.token);
        // Role-based redirection
        if (data.role === 'Student') navigate('/student/dashboard');
        else if (data.role === 'Teacher') navigate('/teacher/dashboard');
        else if (data.role === 'Parent') navigate('/parent/dashboard');
        else navigate('/');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection to server failed. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'Student', icon: 'school', desc: 'I am a learner' },
    { id: 'Parent', icon: 'family_restroom', desc: 'I am a guardian' },
    { id: 'Teacher', icon: 'person_book', desc: 'I am an educator' }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] relative bg-background font-body py-20 px-4">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-secondary-fixed rounded-full blur-[100px] -z-10 opacity-30 pointer-events-none"></div>

      {/* Return to Home */}
      <div className="absolute top-8 left-8">
        <Link to="/" className="text-on-surface-variant hover:text-primary font-medium transition-colors flex items-center gap-2 group">
           <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
           Back to Home
        </Link>
      </div>

      <div className="bg-surface-container-lowest p-8 md:p-10 rounded-[2.5rem] ambient-shadow w-full max-w-xl border border-white z-10">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2.5 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg text-white">
                    <span className="material-symbols-outlined text-3xl shrink-0">explore</span>
                </div>
                <div className="text-3xl font-black tracking-tight text-primary font-headline mt-1">EduDisha</div>
          </div>
          <h2 className="text-3xl font-extrabold text-on-surface mb-2 font-headline">Join Our Community</h2>
          <p className="text-on-surface-variant font-medium">Empowering every stakeholder in the learning journey</p>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-2xl text-sm font-bold border border-error/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <span className="material-symbols-outlined">error</span>
                {error}
            </div>
        )}

        <form onSubmit={handleSub} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-bold text-on-surface mb-4">I am joining as a...</label>
            <div className="grid grid-cols-3 gap-3">
                {roles.map((r) => (
                    <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id)}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${
                            role === r.id 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-outline-variant hover:border-primary/50 text-on-surface-variant'
                        }`}
                    >
                        <span className={`material-symbols-outlined text-2xl ${role === r.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                            {r.icon}
                        </span>
                        <span className="text-xs font-black uppercase tracking-wider">{r.id}</span>
                        <p className="text-[10px] opacity-70 whitespace-nowrap">{r.desc}</p>
                    </button>
                ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Full Name</label>
                <input 
                type="text" 
                required
                placeholder="John Doe"
                className="w-full px-5 py-3.5 bg-surface border border-outline-variant rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-on-surface font-medium"
                value={name} onChange={e => setName(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Email Address</label>
                <input 
                type="email" 
                required
                placeholder="you@example.com"
                className="w-full px-5 py-3.5 bg-surface border border-outline-variant rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-on-surface font-medium"
                value={email} onChange={e => setEmail(e.target.value)}
                />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Phone Number</label>
                <input 
                type="tel" 
                required
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-5 py-3.5 bg-surface border border-outline-variant rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-on-surface font-medium"
                value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Password</label>
                <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full px-5 py-3.5 bg-surface border border-outline-variant rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-on-surface font-medium"
                value={password} onChange={e => setPassword(e.target.value)}
                />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="group w-full flex items-center justify-center gap-2 py-4 mt-8 bg-primary hover:bg-primary-container text-white rounded-2xl font-black transition-all shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader type="inline" message="Creating Account..." /> : 'Create Account'}
            {!loading && <span className="material-symbols-outlined font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>}
          </button>
        </form>
        
        <p className="mt-10 text-center text-sm text-on-surface-variant font-bold">
          Already have an account? <Link to="/login" className="ml-1 text-primary hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
