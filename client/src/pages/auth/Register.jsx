import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Student',
    phoneNumber: '',
    // Student specific
    age: '',
    className: '',
    schoolName: '',
    interests: '',
    // Parent specific
    childName: '',
    childGrade: '',
    // Teacher specific
    subject: '',
    board: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSub = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    setError('');
    setLoading(true);

    try {
      const payload = { ...formData };
      if (payload.role === 'Admin') payload.role = 'SuperAdmin';

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login with success message instead of auto-logging in
        navigate('/login', { state: { message: 'Registration successful! Please login to continue.' } });
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection to server failed. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center justify-center p-4 font-body">
      {/* Auth Background Elements */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-[60%] -right-[10%] w-[35%] h-[45%] bg-indigo-500/15 blur-[100px] rounded-full"></div>
      </div>

      {/* Registration Container */}
      <main className="w-full max-w-5xl bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(44,52,55,0.06)] overflow-hidden flex flex-col md:flex-row border border-white/50">
        
        {/* Brand/Marketing Side */}
        <section className="hidden md:flex md:w-5/12 bg-gradient-to-br from-[#0062a5] to-[#2498f5] p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 mb-12 group">
              <span className="material-symbols-outlined text-white text-2xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
              <span className="font-bold opacity-80 hover:opacity-100 transition-opacity">Return to Hub</span>
            </Link>
            <h1 className="font-headline text-2xl font-black tracking-tight mb-10">The Academic Curator</h1>
            <div className="space-y-8">
              <h2 className="font-headline text-5xl font-black leading-[1.1] text-white">Your journey to <span className="text-blue-100">clarity</span> starts here.</h2>
              <p className="text-blue-50/80 text-lg leading-relaxed font-medium">Join thousands of students and educators discovering their perfect career pathways through AI-driven insights.</p>
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md group-hover:bg-white/30 transition-colors">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <p className="font-black text-sm uppercase tracking-wider">AI-Powered Guidance</p>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md group-hover:bg-white/30 transition-colors">
                <span className="material-symbols-outlined">trending_up</span>
              </div>
              <p className="font-black text-sm uppercase tracking-wider">Real-time Strategy</p>
            </div>
          </div>
          
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]"></div>
        </section>

        {/* Form Side */}
        <section className="w-full md:w-7/12 p-8 md:p-14 overflow-y-auto max-h-[921px]">
          <header className="mb-12">
            <h3 className="font-headline text-4xl font-black text-slate-800 mb-3 tracking-tight">Create Identity</h3>
            <p className="text-slate-500 font-medium font-body">Sign up to access your personalized career strategy.</p>
          </header>

          {error && (
            <div className="mb-8 p-5 bg-red-50 text-red-600 rounded-[1.5rem] text-sm font-bold border border-red-100 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSub} className="space-y-10">
            {/* Role Selection */}
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Select Your Profession</label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { id: 'Student', icon: 'school' },
                  { id: 'Parent', icon: 'family_restroom' },
                  { id: 'Teacher', icon: 'cast_for_education' },
                  { id: 'Admin', icon: 'admin_panel_settings' }
                ].map(r => (
                  <label key={r.id} className="cursor-pointer group">
                    <input 
                      checked={formData.role === r.id}
                      onChange={() => setFormData({ ...formData, role: r.id })}
                      className="peer sr-only" 
                      name="role" 
                      type="radio" 
                      value={r.id}
                    />
                    <div className="p-4 text-center border-2 border-slate-50 bg-slate-50/50 rounded-2xl peer-checked:border-[#2498f5] peer-checked:bg-blue-50/50 peer-checked:shadow-lg peer-checked:shadow-blue-500/5 transition-all group-hover:bg-slate-100">
                      <span className={`material-symbols-outlined block mb-1 text-2xl transition-colors ${formData.role === r.id ? 'text-[#0062a5]' : 'text-slate-400'}`}>{r.icon}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${formData.role === r.id ? 'text-[#0062a5]' : 'text-slate-500'}`}>{r.id}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Professional Name</label>
                <input 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 focus:ring-8 focus:ring-blue-500/5 focus:border-[#2498f5] focus:bg-white transition-all font-bold text-sm shadow-sm" 
                  placeholder="Alex Johnson" 
                  type="text"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                <input 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 focus:ring-8 focus:ring-blue-500/5 focus:border-[#2498f5] focus:bg-white transition-all font-bold text-sm shadow-sm" 
                  placeholder="alex@school.edu" 
                  type="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Secure Password</label>
                <input 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 focus:ring-8 focus:ring-blue-500/5 focus:border-[#2498f5] focus:bg-white transition-all font-bold text-sm shadow-sm" 
                  placeholder="••••••••" 
                  type="password"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Verify Password</label>
                <input 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 focus:ring-8 focus:ring-blue-500/5 focus:border-[#2498f5] focus:bg-white transition-all font-bold text-sm shadow-sm" 
                  placeholder="••••••••" 
                  type="password"
                  required
                />
              </div>
            </div>

            {/* Role Specific Fields */}
            <div className="p-8 bg-slate-50 rounded-[2rem] border-2 border-slate-100 shadow-inner">
              {formData.role === 'Student' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Age</label>
                    <input 
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full bg-white border-2 border-transparent rounded-xl px-6 py-4 focus:border-[#2498f5] transition-all font-bold text-sm shadow-md shadow-slate-200/50" 
                      placeholder="16" 
                      type="number"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Class / Grade</label>
                    <input 
                      name="className"
                      value={formData.className}
                      onChange={handleChange}
                      className="w-full bg-white border-2 border-transparent rounded-xl px-6 py-4 focus:border-[#2498f5] transition-all font-bold text-sm shadow-md shadow-slate-200/50" 
                      placeholder="10th Grade" 
                      type="text"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Academic Institution</label>
                    <input 
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleChange}
                      className="w-full bg-white border-2 border-transparent rounded-xl px-6 py-4 focus:border-[#2498f5] transition-all font-bold text-sm shadow-md shadow-slate-200/50" 
                      placeholder="International Academy of Sciences" 
                      type="text"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Interests & Aspirations</label>
                    <textarea 
                      name="interests"
                      value={formData.interests}
                      onChange={handleChange}
                      className="w-full bg-white border-2 border-transparent rounded-xl px-6 py-4 focus:border-[#2498f5] transition-all font-bold text-sm resize-none shadow-md shadow-slate-200/50" 
                      placeholder="Robotics, Digital Illustration, Piano..." 
                      rows="2"
                    ></textarea>
                  </div>
                </div>
              )}

              {formData.role === 'Parent' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Child's Name</label>
                    <input 
                      name="childName"
                      value={formData.childName}
                      onChange={handleChange}
                      className="w-full bg-white border-2 border-transparent rounded-xl px-6 py-4 focus:border-[#2498f5] transition-all font-bold text-sm" 
                      type="text"
                      placeholder="Firstname Lastname"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Child's Grade</label>
                    <input 
                      name="childGrade"
                      value={formData.childGrade}
                      onChange={handleChange}
                      className="w-full bg-white border-2 border-transparent rounded-xl px-6 py-4 focus:border-[#2498f5] transition-all font-bold text-sm" 
                      type="text"
                      placeholder="Class 10"
                    />
                  </div>
                </div>
              )}

              {formData.role === 'Teacher' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Primary Subject</label>
                    <input 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-white border-2 border-transparent rounded-xl px-6 py-4 focus:border-[#2498f5] transition-all font-bold text-sm" 
                      type="text"
                      placeholder="Mathematics / Science"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Academic Board</label>
                    <input 
                      name="board"
                      value={formData.board}
                      onChange={handleChange}
                      className="w-full bg-white border-2 border-transparent rounded-xl px-6 py-4 focus:border-[#2498f5] transition-all font-bold text-sm" 
                      type="text"
                      placeholder="CBSE / ICSE / IB"
                    />
                  </div>
                </div>
              )}

              {formData.role === 'Admin' && (
                <div className="flex items-center justify-center py-8 text-slate-400 font-bold italic animate-in fade-in">
                  Administrative Identity Activation Ready
                </div>
              )}
            </div>

            <div className="space-y-6 pt-4">
              <button 
                className="group w-full py-5 bg-gradient-to-r from-[#0062a5] to-[#2498f5] text-white rounded-full font-headline font-black text-lg shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 transform hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70" 
                type="submit"
                disabled={loading}
              >
                {loading ? <Loader type="inline" message="Establishing Identity..." /> : 'Register Identity'}
                {!loading && <span className="material-symbols-outlined font-black group-hover:translate-x-2 transition-transform">join_right</span>}
              </button>
              <p className="text-center text-sm font-black text-slate-500">
                Already on the journey? 
                <Link className="text-[#2498f5] hover:underline underline-offset-4 ml-1" to="/login">Sign In here</Link>
              </p>
            </div>
          </form>
        </section>
      </main>

      {/* Footer Details */}
      <footer className="mt-12 w-full max-w-5xl flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-slate-400 px-6 gap-6 font-black opacity-60 hover:opacity-100 transition-opacity">
        <p>© 2024 The Academic Curator. Elevating Futures.</p>
        <div className="flex gap-8">
          <a className="hover:text-[#2498f5] transition-colors" href="#">Privacy Protocol</a>
          <a className="hover:text-[#2498f5] transition-colors" href="#">Global Terms</a>
          <a className="hover:text-[#2498f5] transition-colors" href="#">Curator Support</a>
        </div>
      </footer>
    </div>
  );
};

export default Register;
