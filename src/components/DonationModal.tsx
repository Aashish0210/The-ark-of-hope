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

  const bankDetails = {
    international: {
      bankName: "Sanima Bank",
      branch: "Kupondole Lalitpur",
      accountName: "The Ark Of Hope Pvt. Ltd.",
      accountNumber: "108010010000602",
      swift: "SNMANPKA",
    }
  };

  const handleSentNotification = () => {
    const subject = encodeURIComponent("Donation Confirmation - Build the Ark");
    const body = encodeURIComponent(`Hello,\n\nI have sent a donation of $${initialAmount || '___'} via Bank Transfer.\n\nPlease find the confirmation attached/below.\n\nName: \nAmount: \nReference/UTR: `);
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
            <p className="text-gold text-xs uppercase tracking-widest mt-1 font-semibold">Nepal Bank Transfer</p>
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
                  <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-sm"><strong className="text-black block mb-3 text-base">STEP 6 — Enter Receiver Details</strong><span className="mb-2 block">Sender copies these details exactly:</span><ul className="space-y-1 ml-2"><li>Receiver Name: <strong className="text-black">The Ark Of Hope Pvt. Ltd.</strong></li><li>Purpose: <strong className="text-black">Ark Building</strong></li><li>Bank Name: <strong className="text-black">Sanima Bank</strong></li><li>Branch: <strong className="text-black">Kupondole Lalitpur</strong></li><li>Account Number: <strong className="text-black">108010010000602</strong></li><li>SWIFT Code: <strong className="text-black">SNMANPKA</strong></li><li>Country: <strong className="text-black">Nepal</strong></li></ul></div>
                  <div><strong className="text-black block mb-1">STEP 7 — Enter Amount</strong>Example: Amount to Send: $100 USD<br/>The system shows: Transfer fee, Exchange rate, Amount received in NPR</div>
                  <div><strong className="text-black block mb-1">STEP 8 — Review Details Carefully</strong>Sender checks: Receiver name spelling, Account number, SWIFT code, Amount</div>
                  <div><strong className="text-black block mb-1">STEP 9 — Pay for the Transfer</strong>Sender pays using: Debit card, Credit card, Bank account</div>
                  <div><strong className="text-black block mb-1">STEP 10 — Confirm and Send</strong>Sender clicks: CONFIRM / SEND MONEY</div>
                </div>
              </div>
            )}

            <div className="bg-navy p-6 rounded-xl border border-navy-border space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gold uppercase tracking-widest font-bold">Account Holder Name</label>
                    <div className="flex justify-between items-center group">
                      <span className="text-white font-medium">{bankDetails.international.accountName}</span>
                      <button onClick={() => handleCopy(bankDetails.international.accountName, 'Name')} className="text-white/30 hover:text-gold transition-colors p-1" title="Copy Account Name">
                        {copied === 'Name' ? '✓' : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gold uppercase tracking-widest font-bold">Account Number</label>
                    <div className="flex justify-between items-center group">
                      <span className="text-white font-mono text-lg">{bankDetails.international.accountNumber}</span>
                      <button onClick={() => handleCopy(bankDetails.international.accountNumber, 'Account')} className="text-white/30 hover:text-gold transition-colors p-1" title="Copy Account Number">
                        {copied === 'Account' ? '✓' : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="flex flex-col gap-1">
                       <label className="text-[10px] text-gold uppercase tracking-widest font-bold">Bank Name</label>
                       <span className="text-white font-medium">{bankDetails.international.bankName}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <label className="text-[10px] text-gold uppercase tracking-widest font-bold">Branch</label>
                       <span className="text-white font-medium">{bankDetails.international.branch}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gold uppercase tracking-widest font-bold">SWIFT/BIC Code</label>
                    <div className="flex justify-between items-center group">
                      <span className="text-white font-mono">{bankDetails.international.swift}</span>
                      <button onClick={() => handleCopy(bankDetails.international.swift, 'SWIFT')} className="text-white/30 hover:text-gold transition-colors p-1" title="Copy SWIFT Code">
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
                    <strong className="text-gold">Recommendation:</strong> For the lowest fees and fastest clearance from the US/Europe, we recommend using <a href="https://wise.com" target="_blank" className="text-gold underline">Wise.com</a> to send to the details above.
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
