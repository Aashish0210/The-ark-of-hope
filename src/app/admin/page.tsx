"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { signOut, useSession } from "next-auth/react";

// SVG Icons
const ArrowUp = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 inline-block mr-1"><path d="m18 15-6-6-6 6" /></svg>;

const LayoutIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>;
const SettingsIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>;
const LogOutIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
const UserIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const BoatIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 13h20" /><path d="M22 13a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4" /><path d="M12 2v11" /><path d="M12 2 3 13" /></svg>;


export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [settings, setSettings] = useState<any>({
        raised: 0,
        goal: 7000000,
        maintenanceMode: false
    });
    const [trends, setTrends] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>({ email: '', image: '', password: '' });
    const [activeSection, setActiveSection] = useState('overview');
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    // Client-side session guard
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/admin/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (status !== 'authenticated') return;

        async function fetchData() {
            try {
                const [resSettings, resTrends] = await Promise.all([
                    fetch('/api/settings', { cache: 'no-store' }),
                    fetch('/api/trend', { cache: 'no-store' })
                ]);

                if (resSettings.ok) setSettings(await resSettings.json());
                if (resTrends.ok) setTrends(await resTrends.json());

                const resProfile = await fetch('/api/admin/profile', { cache: 'no-store' });
                if (resProfile.ok) {
                    const profileData = await resProfile.json();
                    if (profileData) {
                        setProfile({ ...profileData, password: '' });
                    }
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                showToast('Failed to load dashboard data', 'error');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [status]);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-10% 0px -80% 0px',
            threshold: 0
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const sections = ['overview', 'settings', 'account'];

        sections.forEach((id) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [loading]);

    const saveProfile = async (e?: React.FormEvent, dataToSave?: any) => {
        if (e) e.preventDefault();

        const payload = dataToSave || profile;

        try {
            const res = await fetch('/api/admin/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json();
                setProfile({ ...data, password: '' });
                showToast('Profile updated successfully!');
            } else {
                const errorData = await res.json().catch(() => ({}));
                showToast(errorData.details || errorData.error || 'Failed to update profile.', 'error');
            }
        } catch (error) {
            showToast('Network error updating profile', 'error');
        }
    };

    const handleFileUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            showToast('Please upload an image file.', 'error');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                const updatedProfile = { ...profile, image: data.url };
                setProfile(updatedProfile);
                await saveProfile(undefined, updatedProfile);
                showToast('Image uploaded and profile updated!');
            } else {
                showToast('Upload failed.', 'error');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            showToast('Upload error.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileUpload(file);
    };

    const saveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    raised: settings.raised,
                    goal: settings.goal,
                    maintenanceMode: settings.maintenanceMode
                })
            });

            if (res.ok) {
                const updated = await res.json();
                setSettings(updated);
                showToast('Site settings updated successfully!');
            } else {
                const errorData = await res.json().catch(() => ({}));
                showToast(errorData.details || errorData.error || 'Failed to save settings.', 'error');
            }
        } catch (error) {
            showToast('Error saving settings.', 'error');
        }
    };



    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-[#071220] flex flex-col items-center justify-center gap-4 text-white">
                <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
                <div className="text-gold font-heading text-lg tracking-widest uppercase">Loading Ark Dashboard...</div>
            </div>
        );
    }

    const raised = Number(settings?.raised || 0);
    const goal = Number(settings?.goal || 7000000);
    const percentage = goal > 0 ? ((raised / goal) * 100) : 0;
    const percentageStr = percentage.toFixed(1);

    const historyTrends = trends.filter(t => t.type === 'HISTORY');

    const pieData = [
        { name: 'Raised', value: raised, fill: '#D4AF37' },
        { name: 'Remaining Gap', value: Math.max(0, goal - raised), fill: '#1e293b' }
    ];

    return (
        <div className="flex min-h-screen bg-[#f4f6f8] text-slate-900 font-sans">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-semibold transition-all duration-300 animate-bounce ${
                    toast.type === 'success' ? 'bg-[#08111b] text-gold border border-gold/40' : 'bg-red-600 text-white'
                }`}>
                    <span>{toast.type === 'success' ? '✓' : '⚠️'}</span>
                    <span>{toast.message}</span>
                </div>
            )}

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-screen w-[280px] bg-[#08111b] text-white border-r border-white/5 z-50 flex flex-col p-6 overflow-y-auto hidden lg:flex">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center text-navy shadow-lg shadow-gold/20">
                        <BoatIcon />
                    </div>
                    <div>
                        <h2 className="font-heading text-lg tracking-wider leading-none">ARK</h2>
                        <span className="text-[10px] text-gold font-bold tracking-[2px] uppercase">Control Panel</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[2px] mb-4 px-2">Main Menu</div>

                    <a
                        href="#overview"
                        className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'overview' ? 'bg-white/5 text-gold font-bold shadow-lg shadow-black/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        {activeSection === 'overview' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gold rounded-r-full shadow-[0_0_15px_rgba(234,179,8,0.5)]" />}
                        <LayoutIcon />
                        <span>Overview</span>
                    </a>

                    <a
                        href="#settings"
                        className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'settings' ? 'bg-white/5 text-gold font-bold shadow-lg shadow-black/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        {activeSection === 'settings' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gold rounded-r-full shadow-[0_0_15px_rgba(234,179,8,0.5)]" />}
                        <SettingsIcon />
                        <span>Site Settings</span>
                    </a>



                    <a
                        href="#account"
                        className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'account' ? 'bg-white/5 text-gold font-bold shadow-lg shadow-black/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        {activeSection === 'account' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gold rounded-r-full shadow-[0_0_15px_rgba(234,179,8,0.5)]" />}
                        <UserIcon />
                        <span>Account</span>
                    </a>
                </nav>

                <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold overflow-hidden border border-gold/40">
                            {profile.image ? <img src={profile.image} alt="Admin" className="w-full h-full object-cover" /> : "A"}
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-xs font-bold text-white truncate">{profile.email || session?.user?.email || 'admin@ark.com'}</div>
                            <div className="text-[10px] text-slate-400">Super Administrator</div>
                        </div>
                    </div>

                    <button
                        onClick={() => signOut({ callbackUrl: '/admin/login' })}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors w-full text-xs font-bold"
                    >
                        <LogOutIcon />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-[280px] min-h-screen flex flex-col">
                {/* Top Bar */}
                <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
                        {settings?.maintenanceMode ? (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                Maintenance Active
                            </span>
                        ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Site Live
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-4 rounded-lg transition-colors border border-slate-300 flex items-center gap-2"
                        >
                            <span>Preview Live Site ↗</span>
                        </a>
                        <button
                            onClick={() => signOut({ callbackUrl: '/admin/login' })}
                            className="lg:hidden text-red-600 hover:bg-red-50 p-2 rounded-lg"
                        >
                            <LogOutIcon />
                        </button>
                    </div>
                </header>

                {/* Dashboard Body */}
                <div className="p-6 md:p-10 max-w-[1400px] w-full mx-auto space-y-12">
                    {/* SECTION 1: OVERVIEW & ANALYTICS */}
                    <section id="overview" className="scroll-mt-20">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Total Raised</span>
                                <h3 className="text-3xl font-bold text-slate-800 tracking-tight text-gold">
                                    ${raised.toLocaleString()}
                                </h3>
                                <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                    <ArrowUp />
                                    <span>{percentageStr}% of ${goal.toLocaleString()} goal</span>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Active Goal</span>
                                <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
                                    ${goal.toLocaleString()}
                                </h3>
                                <div className="text-xs text-slate-500 mt-2">
                                    Target amount to complete Ark
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Platform Status</span>
                                <h3 className={`text-2xl font-bold tracking-tight ${settings?.maintenanceMode ? 'text-amber-600' : 'text-green-600'}`}>
                                    {settings?.maintenanceMode ? 'Maintenance' : 'Operational'}
                                </h3>
                                <div className="text-xs text-slate-500 mt-2">
                                    {settings?.maintenanceMode ? 'Public sees maintenance screen' : 'Public website fully accessible'}
                                </div>
                            </div>
                        </div>

                        {/* Overview Graphs & Live Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Live Activity & Goal Breakdown Card */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-base font-bold text-slate-800">Live Financial Progress</h3>
                                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                            Tracking Active (Fresh from Now)
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-6">
                                        Live donation data and progress tracking initialized. As incoming donations are processed, historical breakdown bars will automatically plot here.
                                    </p>
                                </div>

                                <div className="h-[260px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={historyTrends.length > 0 ? historyTrends.map(t => ({ name: t.label, Generated: t.value1, Target: t.value2 ?? 0 })) : [
                                            { name: 'Week 1', Generated: 0, Target: 0 },
                                            { name: 'Week 2', Generated: 0, Target: 0 },
                                            { name: 'Week 3', Generated: 0, Target: 0 },
                                            { name: 'Week 4', Generated: 0, Target: 0 },
                                        ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                                            <YAxis stroke="#94a3b8" fontSize={11} />
                                            <Legend wrapperStyle={{ fontSize: '12px' }} />
                                            <Bar dataKey="Generated" fill="#08111b" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="Target" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Goal Pie */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-slate-800 mb-1">Goal Completion Ratio</h3>
                                    <p className="text-xs text-slate-500">Ark Project Building Progress</p>
                                </div>

                                <div className="h-[200px] w-full flex items-center justify-center relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                innerRadius={55}
                                                outerRadius={75}
                                                paddingAngle={4}
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute text-center">
                                        <span className="text-2xl font-bold text-slate-800 block">{percentageStr}%</span>
                                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Completed</span>
                                    </div>
                                </div>

                                <div className="flex justify-around text-xs border-t border-slate-100 pt-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-gold"></div>
                                        <span className="text-slate-600 font-medium">Raised (${(raised / 1000000).toFixed(2)}M)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#1e293b]"></div>
                                        <span className="text-slate-600 font-medium">Remaining</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <hr className="border-slate-200" />

                    {/* SECTION 2: SITE SETTINGS & MAINTENANCE MODE (AMOUNT & STATE ONLY) */}
                    <section id="settings" className="scroll-mt-20">
                        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Financial & Maintenance Settings</h2>
                                    <p className="text-xs text-slate-500">Configure the raised amount, financial target goal, and maintenance status.</p>
                                </div>
                                <button
                                    onClick={saveSettings}
                                    className="bg-gold hover:bg-amber-500 text-[#08111b] font-bold px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-95 text-sm self-start md:self-auto"
                                >
                                    Save Settings
                                </button>
                            </div>

                            <form onSubmit={saveSettings} className="space-y-6">
                                {/* Maintenance Mode Toggle */}
                                <div className={`p-5 rounded-xl border transition-all ${settings?.maintenanceMode ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-50 border-slate-200'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-slate-800">Maintenance Mode (Live Production)</span>
                                                {settings?.maintenanceMode && (
                                                    <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 max-w-xl">
                                                When enabled, visitors on the live production site will see the cinematic "Under Maintenance / Preparing the Ark" page. You can still access this admin dashboard and test locally.
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={Boolean(settings?.maintenanceMode)}
                                                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                            Raised Amount ($ USD)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                            <input
                                                type="number"
                                                step="any"
                                                value={settings?.raised ?? 0}
                                                onChange={(e) => setSettings({ ...settings, raised: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-slate-800 focus:outline-none focus:border-gold focus:bg-white transition-all font-semibold text-lg"
                                                placeholder="0"
                                            />
                                        </div>
                                        <span className="text-[11px] text-slate-500 mt-1 block">
                                            Directly drives the boat progress tracker and percentage.
                                        </span>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                            Goal Amount ($ USD)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                            <input
                                                type="number"
                                                step="any"
                                                value={settings?.goal ?? 7000000}
                                                onChange={(e) => setSettings({ ...settings, goal: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-slate-800 focus:outline-none focus:border-gold focus:bg-white transition-all font-semibold text-lg"
                                                placeholder="7000000"
                                            />
                                        </div>
                                        <span className="text-[11px] text-slate-500 mt-1 block">
                                            Ark Target Goal (e.g. $7,000,000).
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        className="bg-[#08111b] hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md active:scale-95 text-sm"
                                    >
                                        Save Financial Settings
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>



                    <hr className="border-slate-200" />

                    {/* SECTION 5: ADMIN ACCOUNT */}
                    <section id="account" className="scroll-mt-20">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-[#08111b] px-6 py-4 flex items-center justify-between text-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                                        <UserIcon />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-white">Admin Account & Password</h2>
                                        <p className="text-slate-400 text-xs">Update your credentials and dashboard avatar.</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={saveProfile} className="p-6 md:p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Admin Email</label>
                                        <input
                                            type="email"
                                            value={profile.email || ''}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-gold text-sm"
                                            placeholder="admin@ark.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Change Password</label>
                                        <input
                                            type="password"
                                            value={profile.password || ''}
                                            onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-gold text-sm"
                                            placeholder="Leave blank to keep current"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Profile Image</label>
                                        <div
                                            onDragOver={onDragOver}
                                            onDragLeave={onDragLeave}
                                            onDrop={onDrop}
                                            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 transition-all ${
                                                isDragging ? 'border-gold bg-gold/5' : 'border-slate-200 hover:border-gold/50 bg-slate-50'
                                            } ${isUploading ? 'opacity-50' : 'cursor-pointer'}`}
                                            onClick={() => document.getElementById('adminFileInput')?.click()}
                                        >
                                            <input
                                                id="adminFileInput"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                            />

                                            {profile.image ? (
                                                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-gold shadow-md">
                                                    <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400">
                                                    <UserIcon />
                                                </div>
                                            )}

                                            <div className="mt-3 text-center">
                                                <p className="text-xs font-bold text-slate-700">
                                                    {isUploading ? 'Uploading Image...' : (profile.image ? 'Click or drop to replace image' : 'Click or drop avatar here')}
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WebP</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-gold hover:bg-amber-500 text-[#08111b] font-bold px-8 py-3 rounded-xl transition-all shadow-md active:scale-95 text-xs uppercase tracking-wider"
                                    >
                                        Update Admin Profile & Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
