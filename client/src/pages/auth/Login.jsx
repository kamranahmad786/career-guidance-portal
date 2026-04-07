import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Loader from '../../components/common/Loader';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const successMsg = location.state?.message;

  const handleSub = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        login(data, data.token);
        // Redirect to main website (Home) after successful login
        navigate('/');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Connection to server failed. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased">
      <main className="min-h-screen flex items-center justify-center p-4 md:p-0">
        <div className="max-w-6xl w-full h-auto md:h-[800px] flex overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-[0_20px_40px_rgba(44,52,55,0.08)] border border-slate-100">
          
          {/* Branding Side */}
          <section className="hidden md:flex flex-1 relative bg-gradient-to-br from-[#0062a5] to-[#2498f5] overflow-hidden p-12 flex-col justify-between">
            <div className="relative z-10">
              <Link to="/" className="flex items-center gap-2 mb-8 group">
                <span className="material-symbols-outlined text-white text-3xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
                <span className="text-white font-bold opacity-80 hover:opacity-100 transition-opacity">Back to Home</span>
              </Link>
              <h1 className="text-white font-headline text-5xl font-extrabold tracking-tight mb-4">
                The Academic Curator
              </h1>
              <p className="text-blue-100 text-lg font-medium max-w-sm opacity-90 leading-relaxed">
                Charting your unique path to excellence through personalized AI guidance.
              </p>
            </div>

            <div className="relative z-10 flex flex-col gap-6">
              <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl max-w-sm transform hover:scale-105 transition-transform duration-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#0062a5]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                  </div>
                  <span className="font-headline font-bold text-white text-lg">Smart Analysis</span>
                </div>
                <p className="text-blue-50 text-sm leading-relaxed opacity-90">
                  Our AI observes your learning patterns and strengths to curate career pathways that truly fit your personality.
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-15 pointer-events-none mix-blend-overlay">
              <img 
                alt="abstract network" 
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_nfs_-G-JLdPiPXqs96xG1nsJtisqaXrN1kppMjjFMAlkzTGhaZlyqLwV4zQqJIm-f1pUvpwMsOLYEDZfKKkEJjFCSZNz6X2zy0uiOakOM6tw0WHZXHo4DAltMkl66VtpdMOZcTfmOFLMOYBF9SohxjsamrxABnb0B7ZjOqaTk74Jw-9Yt7Lip5E3MGuv-yLeYvidKXS-zD_evq-EPSZZUBPZSZSrfOr8NonEMDgO7IXC4FcO8xeJAb9bwX_398ZRdqMfQ_yyUnYz" 
              />
            </div>
          </section>

          {/* Form Side */}
          <section className="flex-1 flex flex-col p-8 md:p-16 overflow-y-auto">
            <div className="w-full max-w-md mx-auto flex flex-col h-full">
              <div className="mb-10 text-center md:text-left">
                <h2 className="font-headline text-4xl font-black text-[#2c3437] mb-3 tracking-tight">Welcome back</h2>
                <p className="text-slate-500 font-body font-medium">Please enter your details to sign in.</p>
              </div>

              {successMsg && (
                <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-sm font-bold border border-emerald-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                  {successMsg}
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3 animate-pulse">
                  <span className="material-symbols-outlined">error</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleSub} className="space-y-6 flex-grow">
                <div className="space-y-4">
                  <label className="block text-[11px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">Choose your role</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'student', icon: 'school', label: 'Student' },
                      { id: 'teacher', icon: 'cast_for_education', label: 'Teacher' },
                      { id: 'parent', icon: 'family_restroom', label: 'Parent' },
                      { id: 'admin', icon: 'admin_panel_settings', label: 'Admin' }
                    ].map(type => (
                      <label key={type.id} className="relative cursor-pointer group">
                        <input 
                          checked={role === type.id}
                          onChange={() => setRole(type.id)}
                          className="peer sr-only" 
                          name="role" 
                          type="radio" 
                          value={type.id}
                        />
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border-2 border-transparent peer-checked:border-[#2498f5] peer-checked:bg-blue-50 transition-all hover:bg-slate-100">
                          <span className={`material-symbols-outlined text-xl transition-colors ${role === type.id ? 'text-[#0062a5]' : 'text-slate-400'}`}>{type.icon}</span>
                          <span className={`text-sm font-bold transition-colors ${role === type.id ? 'text-[#0062a5]' : 'text-slate-600'}`}>{type.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1" htmlFor="email">Email address</label>
                  <input 
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#2498f5] focus:bg-white transition-all font-bold text-sm placeholder:text-slate-300 shadow-sm"
                    id="email" 
                    placeholder="alex@academy.edu" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1" htmlFor="password">Password</label>
                  <div className="relative">
                    <input 
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-[#2498f5] focus:bg-white transition-all font-bold text-sm placeholder:text-slate-300 shadow-sm"
                      id="password" 
                      placeholder="••••••••" 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2498f5] transition-colors"
                    >
                      <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="w-5 h-5 rounded-lg border-slate-200 text-[#2498f5] focus:ring-[#2498f5] transition-all" type="checkbox"/>
                    <span className="text-sm font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Keep me signed in</span>
                  </label>
                  <a className="text-sm font-black text-[#2498f5] hover:text-[#0062a5] transition-colors" href="#">Forgot secret?</a>
                </div>

                <button 
                  className="w-full py-5 bg-gradient-to-r from-[#0062a5] to-[#2498f5] text-white font-headline font-black rounded-full shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 transform hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <Loader type="inline" message="Connecting..." /> : 'Access Account'}
                  {!loading && <span className="material-symbols-outlined font-black">login</span>}
                </button>
              </form>

              <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                <p className="text-slate-500 font-bold text-sm">
                  New to the Curated Path? 
                  <Link to="/register" className="text-[#2498f5] font-black hover:underline underline-offset-4 ml-1">Create Identity</Link>
                </p>
              </div>

              <footer className="mt-auto pt-8 flex justify-center gap-8 opacity-40 hover:opacity-100 transition-opacity">
                <a className="text-[10px] uppercase tracking-widest text-[#747c80] font-bold hover:text-[#0062a5]" href="#">Privacy Protocol</a>
                <a className="text-[10px] uppercase tracking-widest text-[#747c80] font-bold hover:text-[#0062a5]" href="#">Global Terms</a>
              </footer>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Login;
