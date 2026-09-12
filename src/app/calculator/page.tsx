"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Building2, Info, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const t = {
  "English": { title: "Financial & EMI Calculator", sub: "Scheme-aware interest, moratorium handling and full amortisation.", calc: "Calculator", comp: "Side-by-side comparison" },
  "हिन्दी": { title: "वित्तीय और ईएमआई कैलकुलेटर", sub: "योजना-जागरूक ब्याज, मोरेटोरियम हैंडलिंग और पूर्ण परिशोधन।", calc: "कैलकुलेटर", comp: "तुलना" },
  "मराठी": { title: "आर्थिक आणि ईएमआय कॅल्क्युलेटर", sub: "योजना-जागरूक व्याज, स्थगिती हाताळणी.", calc: "कॅल्क्युलेटर", comp: "तुलना" },
  "বাংলা": { title: "আর্থিক এবং ইএমআই ক্যালকুলেটর", sub: "স্কিম-সচেতন সুদ, স্থগিতাদেশ পরিচালনা।", calc: "কैलকুলেটর", comp: "তুলনা" },
  "தமிழ்": { title: "நிதி மற்றும் EMI கால்குलेटर", sub: "திட்டம் சார்ந்த வட்டி, தள்ளிவைப்பு கையாளுதல்.", calc: "கால்குलेटर", comp: "ஒப்பீடு" }
};

interface Scheme {
  id: string;
  name: string;
  maxLoan: number;
  baseRateFemale: number;
  moratorium: number;
  locked?: boolean;
}

const schemes: Scheme[] = [
  { id: "micro", name: "Micro Finance Scheme", maxLoan: 140000, baseRateFemale: 5.5, moratorium: 3 },
  { id: "mahila", name: "Mahila Samriddhi Yojana", maxLoan: 140000, baseRateFemale: 4.0, moratorium: 3 },
  { id: "term", name: "Term Loan Scheme", maxLoan: 5000000, baseRateFemale: 9.0, moratorium: 6 },
  { id: "edu", name: "Educational Loan Scheme", maxLoan: 3000000, baseRateFemale: 6.5, moratorium: 12 },
];

function EMICalculatorInner() {
  const searchParams = useSearchParams();

  const recommendedScheme = useMemo<Scheme | null>(() => {
    const name = searchParams.get("scheme");
    const rateParam = searchParams.get("rate");
    const maxLoanParam = searchParams.get("maxLoan");
    if (!rateParam) return null;

    const rate = parseFloat(rateParam);
    if (Number.isNaN(rate)) return null;

    return {
      id: "ai-recommended",
      name: name || "Your Recommended Scheme",
      maxLoan: maxLoanParam ? parseInt(maxLoanParam, 10) : 500000,
      baseRateFemale: rate,
      moratorium: 3,
      locked: true,
    };
  }, [searchParams]);

  const allSchemes = useMemo(
    () => (recommendedScheme ? [recommendedScheme, ...schemes] : schemes),
    [recommendedScheme]
  );

  const [language, setLanguage] = useState("English");
  const [activeTab, setActiveTab] = useState("calculator");
  const [selectedScheme, setSelectedScheme] = useState<Scheme>(allSchemes[0]);

  useEffect(() => {
    if (recommendedScheme) {
      setSelectedScheme(recommendedScheme);
      const amountParam = searchParams.get("amount");
      if (amountParam) {
        setLoanAmount(Math.min(parseInt(amountParam, 10), recommendedScheme.maxLoan));
      }
    }
    // run once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [loanAmount, setLoanAmount] = useState(0);
  const [tenure, setTenure] = useState(48);
  const [gender, setGender] = useState("Female");

  const langText = t[language as keyof typeof t] || t["English"];
  const appliedRate = selectedScheme.locked
    ? selectedScheme.baseRateFemale
    : gender === "Female" ? selectedScheme.baseRateFemale : selectedScheme.baseRateFemale + 1.0;
  
  const principal = loanAmount || 0;
  const ratePerMonth = appliedRate / 12 / 100;
  
  const accruedInterest = principal * ratePerMonth * selectedScheme.moratorium;
  const newPrincipal = principal + accruedInterest;
  const repaymentMonths = Math.max(tenure - selectedScheme.moratorium, 1);

  const emi = principal > 0 
    ? (newPrincipal * ratePerMonth * Math.pow(1 + ratePerMonth, repaymentMonths)) / 
      (Math.pow(1 + ratePerMonth, repaymentMonths) - 1)
    : 0;

  const totalRepayment = principal > 0 ? emi * repaymentMonths : 0;
  const totalInterestPayable = principal > 0 ? totalRepayment - principal : 0;

  const maxAccrued = selectedScheme.maxLoan * ratePerMonth * selectedScheme.moratorium;
  const maxNewPrincipal = selectedScheme.maxLoan + maxAccrued;
  const maxEmi = (maxNewPrincipal * ratePerMonth * Math.pow(1 + ratePerMonth, repaymentMonths)) / (Math.pow(1 + ratePerMonth, repaymentMonths) - 1);
  const yAxisMax = (maxEmi * 12) || 1;

  const generateSchedule = () => {
    if (principal === 0) return [];
    let balance = newPrincipal;
    const schedule = [];
    const years = Math.min(10, Math.ceil(repaymentMonths / 12));
    
    for (let i = 1; i <= years; i++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;
      let startBalance = balance;

      for (let m = 0; m < 12; m++) {
        if (balance <= 0) break;
        const interestForMonth = balance * ratePerMonth;
        let principalForMonth = emi - interestForMonth;
        
        if (balance - principalForMonth < 0) {
          principalForMonth = balance;
        }
        
        yearlyInterest += interestForMonth;
        yearlyPrincipal += principalForMonth;
        balance -= principalForMonth;
      }

      schedule.push({
        year: i,
        opening: startBalance,
        principalPaid: yearlyPrincipal,
        interestPaid: yearlyInterest,
        totalPaid: yearlyPrincipal + yearlyInterest,
        closing: Math.max(balance, 0)
      });
    }
    return schedule;
  };

  const schedule = generateSchedule();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Government Bar with 5 Languages */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-orange-500"></span>
          <span>Government of India | Ministry of Social Justice & Empowerment</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-pink-400">📞 Helpline 1800-11-8848</span>
          <div className="flex gap-2">
            {["English", "हिन्दी", "मराठी", "বাংলা", "தமிழ்"].map((l) => (
              <button 
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${language === l ? 'bg-white text-slate-900' : 'text-white hover:text-gray-300'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Header with State Emblem */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <a href="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </a>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center p-1">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
                alt="State Emblem of India" 
                className="h-10 w-auto opacity-90"
              />
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-900 leading-tight">SamruddhiSetu</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider hidden sm:block">Channel Finance System for SC Beneficiaries</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{langText.title}</h2>
            <p className="text-slate-500">{langText.sub}</p>
          </div>
          <a href="/locator" className="hidden md:flex text-blue-700 font-semibold hover:underline items-center">
            Find a partner for this scheme <ArrowLeft size={16} className="ml-1 rotate-180"/>
          </a>
        </div>

        <div className="flex gap-6 border-b mb-8">
          <button 
            className={`pb-3 font-semibold text-sm transition-colors ${activeTab === 'calculator' ? 'border-b-2 border-[#1e3a8a] text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('calculator')}
          >
            {langText.calc}
          </button>
          <button 
            className={`pb-3 font-semibold text-sm transition-colors ${activeTab === 'comparison' ? 'border-b-2 border-[#1e3a8a] text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('comparison')}
          >
            {langText.comp}
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 bg-white rounded-2xl border p-6 h-fit">
            <div className="flex items-center gap-2 mb-6 font-bold text-slate-900">
              <span className="bg-slate-100 p-2 rounded-lg"><Building2 size={18}/></span> Calculator
            </div>

            <div className="space-y-4 mb-8">
              <label className="text-sm font-bold text-slate-700">Scheme</label>
              <div className="space-y-2">
                {schemes.map((s) => (
                  <div 
                    key={s.id}
                    onClick={() => { setSelectedScheme(s); if(loanAmount > s.maxLoan) setLoanAmount(s.maxLoan); }}
                    className={`p-3 border rounded-xl cursor-pointer transition-all ${selectedScheme.id === s.id ? 'border-[#1e3a8a] bg-blue-50' : 'hover:bg-slate-50'}`}
                  >
                    <div className="font-semibold text-sm text-slate-900">{s.name}</div>
                    <div className="text-xs text-slate-500">up to ₹{s.maxLoan.toLocaleString('en-IN')} · {s.moratorium} mo moratorium</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-slate-700">Loan amount</label>
              </div>
              <input 
                type="number" 
                value={loanAmount || ""}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full p-2 border rounded-md mb-4 font-semibold text-lg"
                placeholder="0"
              />
              <input 
                type="range" 
                min="0" 
                max={selectedScheme.maxLoan} 
                step="10000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a8a]"
              />
            </div>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-slate-700">Tenure (months): {tenure}</label>
              </div>
              <input 
                type="range" 
                min={12} 
                max={120} 
                step={6}
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a8a]"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 block mb-3">Beneficiary</label>
              <div className="grid grid-cols-3 gap-2">
                {["Female", "Male", "Other"].map(g => (
                  <button 
                    key={g} 
                    onClick={() => setGender(g)}
                    className={`py-2 text-sm rounded-lg border transition-colors ${gender === g ? 'border-[#1e3a8a] bg-blue-50 font-semibold text-[#1e3a8a]' : 'text-slate-600'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            
            {activeTab === 'calculator' ? (
              <>
                {selectedScheme.id === 'mahila' && gender !== 'Female' && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 items-start animate-in fade-in">
                    <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                    <p className="text-sm text-amber-900 leading-relaxed">
                      <strong>Note:</strong> Mahila Samriddhi Yojana is exclusively for female entrepreneurs. Selecting Male/Other applies standard interest rates for demonstration purposes.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-300">
                  <div className="bg-white p-5 rounded-2xl border">
                    <div className="text-xs text-slate-500 mb-1">Monthly EMI</div>
                    <div className="text-2xl font-bold text-[#1e3a8a]">₹{Math.round(emi).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border">
                    <div className="text-xs text-slate-500 mb-1">Applied interest rate</div>
                    <div className="text-2xl font-bold text-slate-900">{appliedRate}% p.a.</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border">
                    <div className="text-xs text-slate-500 mb-1">Total interest payable</div>
                    <div className="text-2xl font-bold text-slate-900">₹{Math.round(totalInterestPayable).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border">
                    <div className="text-xs text-slate-500 mb-1">Total repayment</div>
                    <div className="text-2xl font-bold text-slate-900">₹{Math.round(totalRepayment).toLocaleString('en-IN')}</div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start animate-in fade-in duration-300">
                  <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-blue-900 leading-relaxed">
                    <strong>Moratorium period: {selectedScheme.moratorium} months.</strong> Interest of ₹{Math.round(accruedInterest).toLocaleString('en-IN')} accrues during the moratorium and is added to the principal. EMI is then payable over {repaymentMonths} months.
                  </p>
                </div>

                <div className="bg-white border p-6 rounded-2xl animate-in fade-in duration-300">
                  <h3 className="font-bold text-slate-900 mb-2">Year-by-year amortisation</h3>
                  
                  {principal === 0 ? (
                    <div className="h-64 flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-dashed mt-6">
                      Enter a loan amount to generate schedule
                    </div>
                  ) : (
                    <>
                      <div className="h-64 flex items-end justify-around mt-8 mb-6 border-b border-l border-slate-200 p-4 relative bg-slate-50/50">
                        <div className="absolute -left-2 top-2 text-[10px] font-medium text-slate-400 -translate-x-full">
                          ₹{Math.round(yAxisMax / 1000)}k
                        </div>
                        
                        {schedule.map((row) => {
                          const totalHeightPct = Math.min((row.totalPaid / yAxisMax) * 100, 100);
                          const interestHeightPct = row.totalPaid > 0 ? (row.interestPaid / row.totalPaid) * 100 : 0;
                          const principalHeightPct = row.totalPaid > 0 ? (row.principalPaid / row.totalPaid) * 100 : 0;

                          return (
                            <div key={row.year} className="flex-1 flex flex-col justify-end items-center h-full group px-2 sm:px-4">
                              <div 
                                className="w-full max-w-[80px] flex flex-col justify-end transition-all duration-300 ease-out" 
                                style={{ height: `${totalHeightPct}%` }}
                              >
                                <div 
                                  className="w-full bg-orange-400 rounded-t-sm transition-all duration-300" 
                                  style={{ height: `${interestHeightPct}%` }}
                                ></div>
                                <div 
                                  className="w-full bg-[#1e3a8a] rounded-b-sm transition-all duration-300" 
                                  style={{ height: `${principalHeightPct}%` }}
                                ></div>
                              </div>
                              <div className="text-xs font-medium text-slate-500 mt-3">Y{row.year}</div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-center gap-6 text-sm mb-8">
                        <div className="flex items-center gap-2 font-medium">
                          <span className="w-4 h-4 bg-[#1e3a8a] rounded-sm shadow-sm"></span> Principal
                        </div>
                        <div className="flex items-center gap-2 font-medium">
                          <span className="w-4 h-4 bg-orange-400 rounded-sm shadow-sm"></span> Interest
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-right">
                          <thead>
                            <tr className="text-slate-500 border-b">
                              <th className="pb-3 font-medium text-left">Year</th>
                              <th className="pb-3 font-medium">Opening balance</th>
                              <th className="pb-3 font-medium">Principal paid</th>
                              <th className="pb-3 font-medium">Interest paid</th>
                              <th className="pb-3 font-medium">Closing balance</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {schedule.map((row) => (
                              <tr key={row.year} className="hover:bg-slate-50 transition-colors">
                                <td className="py-4 text-left font-medium">Y{row.year}</td>
                                <td className="py-4 text-slate-600">₹{Math.round(row.opening).toLocaleString('en-IN')}</td>
                                <td className="py-4 font-medium text-[#1e3a8a]">₹{Math.round(row.principalPaid).toLocaleString('en-IN')}</td>
                                <td className="py-4 font-medium text-orange-600">₹{Math.round(row.interestPaid).toLocaleString('en-IN')}</td>
                                <td className="py-4 font-bold text-slate-900">₹{Math.round(row.closing).toLocaleString('en-IN')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {schemes.map((s) => {
                  const sAppliedRate = gender === "Female" ? s.baseRateFemale : s.baseRateFemale + 1.0;
                  const sPrincipal = Math.min(loanAmount || 0, s.maxLoan); 
                  const sRatePerMonth = sAppliedRate / 12 / 100;
                  const sAccrued = sPrincipal * sRatePerMonth * s.moratorium;
                  const sNewPrincipal = sPrincipal + sAccrued;
                  const sRepaymentMonths = Math.max(tenure - s.moratorium, 1);
                  const sEmi = sPrincipal > 0 
                    ? (sNewPrincipal * sRatePerMonth * Math.pow(1 + sRatePerMonth, sRepaymentMonths)) / 
                      (Math.pow(1 + sRatePerMonth, sRepaymentMonths) - 1)
                    : 0;
                  const sTotalRepayment = sPrincipal > 0 ? sEmi * sRepaymentMonths : 0;
                  const sTotalInterest = sPrincipal > 0 ? sTotalRepayment - sPrincipal : 0;

                  return (
                    <div 
                      key={s.id} 
                      className={`bg-white border-2 rounded-2xl p-6 flex flex-col hover:shadow-md transition-all ${selectedScheme.id === s.id ? 'border-[#1e3a8a] shadow-sm' : 'border-slate-200'}`}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="font-bold text-lg text-slate-900 pr-2 leading-tight">{s.name}</h3>
                        {selectedScheme.id === s.id && (
                          <span className="bg-[#1e3a8a] text-white text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-bold shrink-0">Selected</span>
                        )}
                      </div>
                      
                      <div className="space-y-3 flex-1 mb-6">
                        <div className="flex justify-between text-sm border-b pb-2">
                          <span className="text-slate-500">Loan amount</span>
                          <span className="font-bold text-slate-900">₹{sPrincipal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-sm border-b pb-2">
                          <span className="text-slate-500">Applied interest rate</span>
                          <span className="font-bold text-slate-900">{sAppliedRate}% p.a.</span>
                        </div>
                        <div className="flex justify-between text-sm border-b pb-2">
                          <span className="text-slate-500">Moratorium period</span>
                          <span className="font-bold text-slate-900">{s.moratorium} months</span>
                        </div>
                        <div className="flex justify-between text-sm border-b pb-2 bg-blue-50/50 p-2 rounded -mx-2">
                          <span className="text-slate-700 font-bold">Monthly EMI</span>
                          <span className="font-bold text-[#1e3a8a]">₹{Math.round(sEmi).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-sm border-b pb-2">
                          <span className="text-slate-500">Total interest payable</span>
                          <span className="font-bold text-orange-600">₹{Math.round(sTotalInterest).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-1">
                          <span className="text-slate-500">Total repayment</span>
                          <span className="font-bold text-slate-900">₹{Math.round(sTotalRepayment).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      
                      <Button 
                        variant={selectedScheme.id === s.id ? "default" : "outline"}
                        className={`w-full ${selectedScheme.id === s.id ? 'bg-[#1e3a8a] hover:bg-blue-800' : 'text-slate-700 border-slate-300 hover:bg-slate-50'}`}
                        onClick={() => { setSelectedScheme(s); setActiveTab('calculator'); if(loanAmount > s.maxLoan) setLoanAmount(s.maxLoan); }}
                      >
                        {selectedScheme.id === s.id ? (
                          <span className="flex items-center gap-2"><Check size={16}/> Currently viewing</span>
                        ) : 'Use this scheme'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

export default function EMICalculator() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading calculator...</div>}>
      <EMICalculatorInner />
    </Suspense>
  );
}