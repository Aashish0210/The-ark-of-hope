"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer,
    Tooltip, PieChart, Pie, Cell
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
    const [addAmount, setAddAmount] = useState<string>('');
    const [amountMode, setAmountMode] = useState<'add' | 'direct'>('add');
    const [isDevUnlocked, setIsDevUnlocked] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [unlockPass, setUnlockPass] = useState('');
    const [trends, setTrends] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>({ email: '', image: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
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
                setShowPassword(false);
                showToast(payload.password ? 'Password & Profile updated successfully!' : 'Profile updated successfully!');
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
            const currentRaised = Number(settings?.raised || 0);
            const increment = parseFloat(addAmount) || 0;
            const newRaised = (amountMode === 'add' && increment !== 0)
                ? currentRaised + increment
                : Number(settings?.raised || 0);

            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    raised: newRaised,
                    addAmount: (amountMode === 'add' && increment !== 0) ? increment : undefined,
                    goal: settings.goal,
                    maintenanceMode: settings.maintenanceMode
                })
            });

            if (res.ok) {
                const updated = await res.json();
                setSettings(updated);
                setAddAmount('');
                // Refresh trends so the monthly tracker chart updates immediately
                const resTrends = await fetch('/api/trend', { cache: 'no-store' });
                if (resTrends.ok) setTrends(await resTrends.json());
                showToast(`Site settings updated successfully! Total raised: $${Number(updated.raised).toLocaleString()}`);
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

    const isDeveloperSession = Boolean((session?.user as any)?.isDeveloper);
    const isDeveloper = isDeveloperSession || isDevUnlocked;

    const handleHardReset = async () => {
        setIsResetting(true);
        try {
            const res = await fetch('/api/admin/hard-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ developerPassword: 'arkofhope@2026' })
            });

            const data = await res.json();
            if (res.ok) {
                showToast('Hard Reset Successful! Raised amount is $0 and password is arkofhope@2026');
                setSettings((prev: any) => ({ ...prev, raised: 0 }));
                setTrends([]);
                setShowResetModal(false);
            } else {
                showToast(data.error || 'Hard reset failed', 'error');
            }
        } catch (err) {
            showToast('Error executing hard reset', 'error');
        } finally {
            setIsResetting(false);
        }
    };

    const handleUnlockDeveloper = (e: React.FormEvent) => {
        e.preventDefault();
        if (unlockPass === 'arkofhope@2026') {
            setIsDevUnlocked(true);
            setShowUnlockModal(false);
            setUnlockPass('');
            showToast('Developer Console Unlocked!');
        } else {
            showToast('Invalid universal developer password', 'error');
        }
    };

    const raised = Number(settings?.raised || 0);
    const goal = Number(settings?.goal || 7000000);
    const percentage = goal > 0 ? ((raised / goal) * 100) : 0;
    const percentageStr = percentage.toFixed(1);

    const universalMonths = [
        { key: 'Jan', name: 'January' },
        { key: 'Feb', name: 'February' },
        { key: 'Mar', name: 'March' },
        { key: 'Apr', name: 'April' },
        { key: 'May', name: 'May' },
        { key: 'Jun', name: 'June' },
        { key: 'Jul', name: 'July' },
        { key: 'Aug', name: 'August' },
        { key: 'Sep', name: 'September' },
        { key: 'Oct', name: 'October' },
        { key: 'Nov', name: 'November' },
        { key: 'Dec', name: 'December' }
    ];

    const currentMonthIndex = new Date().getMonth(); // 8 for September in 2026

    // Map monthly points from trends table (type === 'MONTHLY')
    const monthlyTrends = trends.filter((t: any) => t.type === 'MONTHLY');
    const hasMonthlyRecords = monthlyTrends.length > 0 && monthlyTrends.some((t: any) => Number(t.value1) > 0);

    const monthlyRaisedData = universalMonths.map((m, idx) => {
        let amount = 0;
        if (hasMonthlyRecords) {
            const found = monthlyTrends.find((t: any) => t.label === m.key || Number(t.order) === idx);
            amount = found ? Number(found.value1 || 0) : 0;
        } else {
            // No synthetic division across months!
            // The whole inputted amount is placed directly on the active month (e.g. September)
            amount = (idx === currentMonthIndex) ? raised : 0;
        }
        return {
            month: m.key,
            fullName: m.name,
            "Amount Raised": amount,
            isCurrent: idx === currentMonthIndex
        };
    });

    const CustomBarTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const dataItem = payload[0]?.payload;
            return (
                <div className="bg-[#08111b] border border-gold/40 text-white p-3 rounded-xl shadow-2xl text-xs space-y-1.5 z-50 min-w-[140px]">
                    <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1">
                        <p className="font-bold text-gold text-xs">
                            {dataItem?.fullName || label}
                        </p>
                        {dataItem?.isCurrent && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-semibold">
                                Active Month
                            </span>
                        )}
                    </div>
                    <div className="flex items-center justify-between gap-3 pt-1">
                        <span className="text-slate-400">Amount Raised:</span>
                        <span className="font-mono font-bold text-white text-sm">
                            ${Number(payload[0].value).toLocaleString()}
                        </span>
                    </div>
                </div>
            );
        }
        return null;
    };

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
                        {isDeveloper ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300 flex items-center gap-1.5 shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                                Developer Console
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowUnlockModal(true)}
                                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition-colors text-xs flex items-center gap-1 hover:bg-slate-100"
                                title="Developer Access"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            </button>
                        )}
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
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-base font-bold text-slate-800">Live Financial Progress</h3>
                                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                Universal Monthly Tracker
                                            </span>
                                        </div>
                                        <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                                            Total Raised: <span className="text-gold font-mono font-bold">${raised.toLocaleString()} USD</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-4">
                                        Universal monthly tracker across all 12 calendar months (Jan – Dec). Funds inputted are attributed directly to the active month without synthetic division.
                                    </p>
                                </div>

                                <div className="h-[280px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={monthlyRaisedData} margin={{ top: 15, right: 10, left: 5, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                                            <YAxis
                                                stroke="#64748b"
                                                fontSize={11}
                                                tickLine={false}
                                                tickFormatter={(val) => val >= 1000000 ? `$${(val / 1000000).toFixed(1)}M` : val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`}
                                            />
                                            <Tooltip content={<CustomBarTooltip />} />
                                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                            <Bar
                                                name="Amount Raised ($ USD)"
                                                dataKey="Amount Raised"
                                                radius={[5, 5, 0, 0]}
                                            >
                                                {monthlyRaisedData.map((entry, index) => (
                                                    <Cell
                                                        key={`bar-cell-${index}`}
                                                        fill={entry.isCurrent ? '#F59E0B' : entry["Amount Raised"] > 0 ? '#D4AF37' : '#cbd5e1'}
                                                    />
                                                ))}
                                            </Bar>
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
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                                {amountMode === 'add' ? 'Insert Amount to Add ($ USD)' : 'Exact Raised Amount ($ USD)'}
                                            </label>
                                            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-semibold text-slate-600">
                                                <button
                                                    type="button"
                                                    onClick={() => setAmountMode('add')}
                                                    className={`px-2 py-0.5 rounded transition-all ${amountMode === 'add' ? 'bg-white shadow-sm text-slate-900 font-bold' : 'hover:text-slate-900'}`}
                                                >
                                                    ➕ Add to Previous
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setAmountMode('direct')}
                                                    className={`px-2 py-0.5 rounded transition-all ${amountMode === 'direct' ? 'bg-white shadow-sm text-slate-900 font-bold' : 'hover:text-slate-900'}`}
                                                >
                                                    ✏️ Direct Total
                                                </button>
                                            </div>
                                        </div>

                                        {/* Display Previous / Last Amount */}
                                        <div className="mb-2 px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                                            <span className="text-slate-600 font-medium">Last / Current Amount:</span>
                                            <span className="font-bold text-slate-900 font-mono text-sm">
                                                ${Number(settings?.raised || 0).toLocaleString()}
                                            </span>
                                        </div>

                                        {amountMode === 'add' ? (
                                            <div>
                                                <div className="relative">
                                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">+ $</span>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        value={addAmount}
                                                        onChange={(e) => setAddAmount(e.target.value)}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-800 focus:outline-none focus:border-gold focus:bg-white transition-all font-semibold text-lg"
                                                        placeholder="Enter amount to add (e.g. 5000)"
                                                    />
                                                </div>

                                                {/* Live Addition Preview */}
                                                {Boolean(addAmount && !isNaN(parseFloat(addAmount)) && parseFloat(addAmount) !== 0) && (
                                                    <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs flex items-center justify-between text-amber-900 animate-in fade-in duration-200">
                                                        <span>
                                                            ${Number(settings?.raised || 0).toLocaleString()} + ${parseFloat(addAmount).toLocaleString()}
                                                        </span>
                                                        <span className="font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded">
                                                            New Total: ${(Number(settings?.raised || 0) + parseFloat(addAmount)).toLocaleString()}
                                                        </span>
                                                    </div>
                                                )}

                                                <span className="text-[11px] text-slate-500 mt-1 block">
                                                    Inserted amount will be added to the last amount (e.g. $10,000 + $5,000 = $15,000).
                                                </span>
                                            </div>
                                        ) : (
                                            <div>
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
                                                    Direct total override mode.
                                                </span>
                                            </div>
                                        )}
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
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={profile.password || ''}
                                                onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                                                className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 focus:outline-none focus:border-gold text-sm"
                                                placeholder="Enter new password"
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                                                title={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? (
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                                        <line x1="2" x2="22" y1="2" y2="22" />
                                                    </svg>
                                                ) : (
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                                        <circle cx="12" cy="12" r="3" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        <span className="text-[11px] text-slate-400 block">Leave blank to keep current password</span>
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

                    {/* SECTION 6: DEVELOPER CONSOLE & HARD RESET (ONLY VISIBLE TO DEVELOPER) */}
                    {isDeveloper && (
                        <section id="developer" className="scroll-mt-20">
                            <div className="bg-red-950/10 border-2 border-red-500/40 rounded-2xl p-6 md:p-8 shadow-sm">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-red-500/20">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="bg-red-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                                                Developer Mode Active
                                            </span>
                                            <span className="text-xs font-mono text-red-600 font-bold">Universal Key: arkofhope@2026</span>
                                        </div>
                                        <h2 className="text-xl font-bold text-red-800">Emergency System Hard Reset</h2>
                                        <p className="text-xs text-slate-600 max-w-xl mt-1">
                                            This action is strictly restricted to developers. Performing a Hard Reset will instantly wipe the raised amount back to <strong>$0</strong> and reset the system password to <strong>arkofhope@2026</strong>. Regular admins cannot see or access this button.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowResetModal(true)}
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-red-600/25 active:scale-95 text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 self-start md:self-auto"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                        Execute Hard Reset ($0 & arkofhope@2026)
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                    <div className="p-4 bg-white rounded-xl border border-red-200 shadow-sm">
                                        <span className="font-bold text-slate-800 block mb-1">Raised Amount Reset</span>
                                        <p className="text-slate-500">
                                            Resets the live platform financial raised balance back to <strong className="text-red-600 font-mono text-sm block mt-0.5">$0.00 USD</strong>
                                        </p>
                                    </div>
                                    <div className="p-4 bg-white rounded-xl border border-red-200 shadow-sm">
                                        <span className="font-bold text-slate-800 block mb-1">Password Restoration</span>
                                        <p className="text-slate-500">
                                            Restores the universal admin password to <strong className="text-red-600 font-mono text-sm block mt-0.5">arkofhope@2026</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </div>

            {/* Hard Reset Confirmation Modal */}
            {showResetModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#08111b]/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl border-2 border-red-500 animate-in zoom-in-95 duration-200">
                        <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 text-center mb-2">Confirm Developer Hard Reset</h3>
                        <p className="text-xs text-slate-600 text-center mb-6 leading-relaxed">
                            Are you sure you want to perform a hard reset? This action will set the raised amount to <strong>$0</strong> and restore the admin password to <strong>arkofhope@2026</strong>.
                        </p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowResetModal(false)}
                                disabled={isResetting}
                                className="flex-1 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all uppercase tracking-wider"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleHardReset}
                                disabled={isResetting}
                                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-wider"
                            >
                                {isResetting ? "Resetting..." : "Yes, Hard Reset"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Developer Mode Unlock Modal */}
            {showUnlockModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#08111b]/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
                        <div className="text-center mb-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            </div>
                            <h3 className="text-base font-bold text-slate-800">Developer Access</h3>
                            <p className="text-xs text-slate-500 mt-1">Enter universal developer password to unlock emergency console.</p>
                        </div>
                        <form onSubmit={handleUnlockDeveloper} className="space-y-4">
                            <input
                                type="password"
                                value={unlockPass}
                                onChange={(e) => setUnlockPass(e.target.value)}
                                placeholder="Enter universal password"
                                autoFocus
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-gold font-mono"
                            />
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowUnlockModal(false)}
                                    className="flex-1 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 rounded-lg bg-[#08111b] text-gold font-bold text-xs hover:bg-slate-800"
                                >
                                    Unlock
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
