import React, { useState } from 'react';
import Loader from '../common/Loader';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: 'Academy Career Guidance',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSent(true);
                setFormData({ name: '', email: '', category: 'Academy Career Guidance', message: '' });
                // Reset success message after 5 seconds
                setTimeout(() => setSent(false), 5000);
            } else {
                setError(data.message || 'Transmission failed. Please try again.');
            }
        } catch (err) {
            setError('Connection failed. Please ensure your network is stable.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen py-20 px-4 md:px-6 w-full mx-auto flex flex-col justify-center bg-white relative overflow-hidden" id="contact">
            {/* Professional Background Layers */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4"></div>

            <div className="w-full mx-auto px-4 md:px-12 lg:px-24 relative z-10">
                <div className="grid lg:grid-cols-12 gap-16 md:gap-20 items-start">

                    {/* Left: Global Support Hub (40%) */}
                    <div className="lg:col-span-5 space-y-10 md:space-y-12 text-left">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-black text-[10px] md:text-[11px] mb-6 uppercase tracking-widest leading-none border border-primary/20">
                                <span className="material-symbols-outlined text-sm">support_agent</span>
                                Global Support Hub
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black font-headline mb-6 text-on-surface leading-tight italic">
                                We're here to <br /> <span className="text-primary italic">guide your journey.</span>
                            </h2>
                            <p className="text-base md:text-lg text-on-surface-variant leading-relaxed font-medium max-w-md opacity-80">
                                Have questions about AI mapping or institutional plans? Our expert advisors are ready to help you navigate the 2026 career landscape.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:gap-6">
                            {[
                                { title: 'Direct Email', detail: 'support@edudisha.ai', icon: 'alternate_email', color: 'bg-indigo-50 text-indigo-600' },
                                { title: 'Expert Hotline', detail: '+91 8789406792', icon: 'call', color: 'bg-emerald-50 text-emerald-600' },
                                { title: 'Global HQ', detail: 'Jamshedpur, Jharkhand', icon: 'hub', color: 'bg-slate-100 text-slate-800' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-5 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group cursor-pointer hover:border-primary/30 hover:bg-white transition-all shadow-sm hover:shadow-md">
                                    <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <span className="material-symbols-outlined text-2xl font-black">{item.icon}</span>
                                    </div>
                                    <div className="overflow-hidden">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.title}</h4>
                                        <p className="text-base md:text-lg font-black text-on-surface truncate group-hover:text-primary transition-colors">{item.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Response Guarantee Trust Badge */}
                        <div className="flex items-center gap-4 py-6 border-t border-slate-100">
                            <div className="flex -space-x-3">
                                {[
                                    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=100&h=100",
                                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100",
                                    "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100&h=100"
                                ].map((url, i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                                        <img src={url} alt={`Expert ${i + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-on-surface uppercase tracking-widest">Response Guarantee</p>
                                <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                                    <span className="material-symbols-outlined text-xs">verified</span>
                                    Average response time: &lt; 2 hours
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: High-Fidelity Interactive Form (60%) */}
                    <div className="lg:col-span-7 bg-white p-8 md:p-14 rounded-[3.5rem] shadow-2xl border border-slate-50 relative group min-h-[600px] flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full group-hover:bg-primary/10 transition-all duration-700"></div>

                        <div className="relative z-10 text-left flex-grow">
                            <div className="mb-10 lg:mb-12">
                                <h3 className="text-xl md:text-2xl font-black text-on-surface mb-2 font-headline italic">Send a Message</h3>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">AI routing ensures your query reaches the right expert</p>
                            </div>

                            {sent ? (
                                <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500 py-20">
                                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/10">
                                        <span className="material-symbols-outlined text-5xl text-emerald-600 font-black">done_all</span>
                                    </div>
                                    <h4 className="text-2xl font-black text-on-surface mb-4 italic">Broadcast Received!</h4>
                                    <p className="text-on-surface-variant font-medium leading-relaxed max-w-xs mx-auto">
                                        Your query has been securely transmitted. An expert advisor will reach out within <span className="text-emerald-600 font-black">2 hours</span>.
                                    </p>
                                    <button 
                                        onClick={() => setSent(false)}
                                        className="mt-10 text-primary font-black text-[11px] uppercase tracking-widest hover:underline"
                                    >
                                        Send Another Inquiry
                                    </button>
                                </div>
                            ) : (
                                <form className="space-y-8" onSubmit={handleSubmit}>
                                    {error && (
                                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-3 animate-pulse">
                                            <span className="material-symbols-outlined">error</span>
                                            {error}
                                        </div>
                                    )}

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-on-surface ml-1 uppercase tracking-[0.2em] opacity-60">Professional Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Enter your full name"
                                                className="w-full px-7 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-bold text-sm shadow-sm"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-on-surface ml-1 uppercase tracking-[0.2em] opacity-60">Verified Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="name@institution.com"
                                                className="w-full px-7 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-bold text-sm shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-on-surface ml-1 uppercase tracking-[0.2em] opacity-60">Enquiry Category</label>
                                        <div className="relative">
                                            <select 
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className="w-full px-7 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-bold appearance-none text-sm shadow-sm cursor-pointer"
                                            >
                                                <option>Academy Career Guidance</option>
                                                <option>Institutional Partnership</option>
                                                <option>Technical Platform Support</option>
                                                <option>NEP 2020 Compliance Query</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-on-surface ml-1 uppercase tracking-[0.2em] opacity-60">Your Inquiry</label>
                                        <textarea
                                            name="message"
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="5"
                                            placeholder="How can we assist your professional journey today?"
                                            className="w-full px-7 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-bold resize-none text-sm shadow-sm"
                                        ></textarea>
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.3em] shadow-xl hover:bg-primary hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                                    >
                                        {loading ? <Loader type="inline" message="Transmitting..." /> : 'Broadcast Message'}
                                        {!loading && <span className="material-symbols-outlined text-xl font-black group-hover:translate-x-1 transition-transform">send</span>}
                                    </button>

                                    <div className="flex items-center justify-center gap-2 opacity-60">
                                        <span className="material-symbols-outlined text-sm text-emerald-600 font-black">enhanced_encryption</span>
                                        <p className="text-[9px] font-black uppercase tracking-widest">AES-256 Encrypted Communication Hub</p>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
