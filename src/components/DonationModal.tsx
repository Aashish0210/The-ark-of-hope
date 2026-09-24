"use client";

import { useState, useEffect } from 'react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: number;
}

export default function DonationModal({ isOpen, onClose, initialAmount }: DonationModalProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedBank, setSelectedBank] = useState<'sanima' | 'sbi'>('sanima');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const bankAccounts = {
    sanima: {
      id: 'sanima',
      shortName: 'Sanima Bank',
      bankName: "Sanima Bank",
      branch: "Kupondole Lalitpur",
      accountName: "The Ark Of Hope Pvt. Ltd.",
      accountNumber: "108010010000602",
      swift: "SNMANPKA",
      country: "Nepal"
    },
    sbi: {
      id: 'sbi',
      shortName: 'Nepal SBI Bank',
      bankName: "Nepal SBI Bank Ltd",
      branch: "Patan Branch, Lalitpur, Nepal",
      accountName: "Shanti Foundation Trust",
      accountNumber: "20225240200633",
      swift: "NSBINPKA",
      country: "Nepal"
    }
  };

  const currentBank = bankAccounts[selectedBank];

  const handleSentNotification = () => {
    const subject = encodeURIComponent("Donation Confirmation - Build the Ark");
    const body = encodeURIComponent(`Hello,\n\nI have sent a donation of $${initialAmount || '___'} via Bank Transfer to ${currentBank.bankName} (${currentBank.accountNumber}).\n\nPlease find the confirmation attached/below.\n\nName: \nAmount: \nBank Selected: ${currentBank.bankName}\nReceiver: ${currentBank.accountName}\nReference/UTR: `);
    window.location.href = `mailto:info@buildtheark.org?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy/90 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-navy-light w-full max-w-[600px] max-h-[90vh] flex flex-col border border-gold/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="relative shrink-0 h-32 bg-[url('/ark-bg.jpg')] bg-cover bg-center flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-navy/60 to-navy-light"></div>
          <div className="relative z-10 text-center">
            <h3 className="text-2xl font-bold tracking-[2px] heading-font text-white drop-shadow-lg">GIVE YOUR GIFT</h3>
            <p className="text-gold text-xs uppercase tracking-widest mt-1 font-semibold">Nepal Bank Transfer (Choose Account)</p>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto">
          {/* Content */}
          <div className="space-y-6">

            <button 
              onClick={() => setShowInstructions(!showInstructions)}
              className="w-full flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl text-white hover:bg-white/10 transition-colors shadow-sm"
            >
              <span className="font-semibold heading-font tracking-wider text-sm flex items-center">
                <svg className="w-5 h-5 mr-3 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                HOW TO SEND MONEY (STEP-BY-STEP GUIDE)
              </span>
              <span className="text-gold text-2xl leading-none font-light">{showInstructions ? '−' : '+'}</span>
            </button>

            {showInstructions && (
              <div className="bg-white text-black p-6 sm:p-8 rounded-xl shadow-inner text-sm space-y-5 font-sans animate-in slide-in-from-top-2 duration-300">
                <div className="text-center border-b-2 border-black/10 pb-4 mb-2">
                  <h4 className="font-black text-xl tracking-tight uppercase">How To Send Money</h4>
                  <p className="text-black/60 text-xs font-semibold mt-1 uppercase tracking-widest">For the Ark Building</p>
                </div>
                
                <div className="space-y-5 text-black/80 leading-relaxed">
                  <div><strong className="text-black block mb-1">STEP 1 — Open Money Transfer Website/App</strong>Sender opens: Wise OR Remitly OR Western Union</div>
                  <div><strong className="text-black block mb-1">STEP 2 — Create Account / Login</strong>Sender: Signs up, Verifies email and phone, Logs into account</div>
                  <div><strong className="text-black block mb-1">STEP 3 — Click “Send Money”</strong>Button usually says: “Send”, “Transfer Money”, or “Send Internationally”</div>
                  <div><strong className="text-black block mb-1">STEP 4 — Select Receiving Country</strong>Sender chooses: Receiving Country: Nepal</div>
                  <div><strong className="text-black block mb-1">STEP 5 — Choose Delivery Method</strong>Sender selects: Send to: Bank Account</div>
                  <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-sm">
                    <strong className="text-black block mb-2 text-base">STEP 6 — Enter Receiver Details (Choose Either Account)</strong>
                    <span className="mb-3 block text-slate-600 text-xs">Copy these exact details into your transfer provider:</span>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-white rounded-lg border border-slate-200">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-block mb-1.5">Account 1: Sanima Bank</span>
                        <ul className="space-y-0.5 text-xs">
                          <li>Receiver Name: <strong className="text-black">The Ark Of Hope Pvt. Ltd.</strong></li>
                          <li>Purpose: <strong className="text-black">Ark Building</strong></li>
                          <li>Bank Name: <strong className="text-black">Sanima Bank</strong></li>
                          <li>Branch: <strong className="text-black">Kupondole Lalitpur</strong></li>
                          <li>Account Number: <strong className="text-black font-mono">108010010000602</strong></li>
                          <li>SWIFT Code: <strong className="text-black font-mono">SNMANPKA</strong></li>
                          <li>Country: <strong className="text-black">Nepal</strong></li>
                        </ul>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-slate-200">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 bg-slate-200 px-2 py-0.5 rounded inline-block mb-1.5">Account 2: Nepal SBI Bank</span>
                        <ul className="space-y-0.5 text-xs">
                          <li>Receiver Name: <strong className="text-black">Shanti Foundation Trust</strong></li>
                          <li>Purpose: <strong className="text-black">Ark Building</strong></li>
                          <li>Bank Name: <strong className="text-black">Nepal SBI Bank Ltd</strong></li>
                          <li>Branch: <strong className="text-black">Patan Branch, Lalitpur, Nepal</strong></li>
                          <li>Account Number: <strong className="text-black font-mono">20225240200633</strong></li>
                          <li>SWIFT Code: <strong className="text-black font-mono">NSBINPKA</strong></li>
                          <li>Country: <strong className="text-black">Nepal</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div><strong className="text-black block mb-1">STEP 7 — Enter Amount</strong>Example: Amount to Send: $100 USD<br/>The system shows: Transfer fee, Exchange rate, Amount received in NPR</div>
                  <div><strong className="text-black block mb-1">STEP 8 — Review Details Carefully</strong>Sender checks: Receiver name spelling, Account number, SWIFT code, Amount</div>
                  <div><strong className="text-black block mb-1">STEP 9 — Pay for the Transfer</strong>Sender pays using: Debit card, Credit card, Bank account</div>
                  <div><strong className="text-black block mb-1">STEP 10 — Confirm and Send</strong>Sender clicks: CONFIRM / SEND MONEY</div>
                </div>
              </div>
            )}

            {/* Bank Account Selector Tabs */}
            <div className="space-y-2">
              <label className="text-[10px] text-gold uppercase tracking-widest font-bold block">
                Select Bank Account:
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-navy/90 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedBank('sanima')}
                  className={`py-2 px-3 rounded-lg text-left transition-all ${
                    selectedBank === 'sanima'
                      ? 'bg-gold/20 border border-gold text-white shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs heading-font tracking-wide">Sanima Bank</span>
                    <span className="text-[9px] bg-gold/20 text-gold px-1.5 py-0.5 rounded font-mono">SNMANPKA</span>
                  </div>
                  <span className="text-[10px] text-white/50 block truncate mt-0.5">The Ark Of Hope Pvt. Ltd.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBank('sbi')}
                  className={`py-2 px-3 rounded-lg text-left transition-all ${
                    selectedBank === 'sbi'
                      ? 'bg-gold/20 border border-gold text-white shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs heading-font tracking-wide">Nepal SBI Bank</span>
                    <span className="text-[9px] bg-gold/20 text-gold px-1.5 py-0.5 rounded font-mono">NSBINPKA</span>
                  </div>
                  <span className="text-[10px] text-white/50 block truncate mt-0.5">Shanti Foundation Trust</span>
                </button>
              </div>
            </div>

            {/* Active Bank Account Details Card */}
            <div className="bg-navy p-6 rounded-xl border border-navy-border space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gold uppercase tracking-widest font-bold">Account Holder Name</label>
                    <div className="flex justify-between items-center group">
                      <span className="text-white font-medium">{currentBank.accountName}</span>
                      <button onClick={() => handleCopy(currentBank.accountName, 'Name')} className="text-white/30 hover:text-gold transition-colors p-1" title="Copy Account Name">
                        {copied === 'Name' ? '✓' : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gold uppercase tracking-widest font-bold">Account Number</label>
                    <div className="flex justify-between items-center group">
                      <span className="text-white font-mono text-lg font-bold">{currentBank.accountNumber}</span>
                      <button onClick={() => handleCopy(currentBank.accountNumber, 'Account')} className="text-white/30 hover:text-gold transition-colors p-1" title="Copy Account Number">
                        {copied === 'Account' ? '✓' : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="flex flex-col gap-1">
                       <label className="text-[10px] text-gold uppercase tracking-widest font-bold">Bank Name</label>
                       <span className="text-white font-medium">{currentBank.bankName}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <label className="text-[10px] text-gold uppercase tracking-widest font-bold">Branch</label>
                       <span className="text-white font-medium">{currentBank.branch}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gold uppercase tracking-widest font-bold">SWIFT/BIC Code</label>
                    <div className="flex justify-between items-center group">
                      <span className="text-white font-mono font-bold">{currentBank.swift}</span>
                      <button onClick={() => handleCopy(currentBank.swift, 'SWIFT')} className="text-white/30 hover:text-gold transition-colors p-1" title="Copy SWIFT Code">
                        {copied === 'SWIFT' ? '✓' : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-3 bg-gold/5 border border-gold/10 p-4 rounded-lg">
                  <div className="text-gold mt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                    <strong className="text-gold">Recommendation:</strong> For the lowest fees and fastest clearance from the US/Europe, we recommend using <a href="https://wise.com" target="_blank" className="text-gold underline">Wise.com</a> to send to either account above.
                  </p>
                </div>

            <button 
              onClick={handleSentNotification}
              className="w-full py-4 bg-transparent border-2 border-gold text-gold font-bold heading-font tracking-[2px] rounded-xl hover:bg-gold hover:text-navy transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.1)] active:scale-95 text-sm"
            >
              I HAVE SENT MY GIFT →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
