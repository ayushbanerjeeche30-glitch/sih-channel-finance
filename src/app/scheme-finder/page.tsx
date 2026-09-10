"use client";

import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";

const t = {
  "English": { title: "Smart Scheme Recommender", sub: "Five short questions. A ranked, explained recommendation.", next: "Next", back: "Back", finish: "Get my recommendation" },
  "हिन्दी": { title: "स्मार्ट योजना अनुशंसाकर्ता", sub: "पाँच छोटे प्रश्न। एक क्रमबद्ध, स्पष्ट अनुशंसा।", next: "अगला", back: "पीछे", finish: "मेरी अनुशंसा प्राप्त करें" },
  "मराठी": { title: "स्मार्ट योजना शिफारसकर्ता", sub: "पाच छोटे प्रश्न. एक क्रमबद्ध, स्पष्ट शिफारस.", next: "पुढील", back: "मागे", finish: "माझी शिफारस मिळवा" },
  "বাংলা": { title: "স্মার্ট স্কিম সুপারিশকারী", sub: "পাঁচটি ছোট প্রশ্ন। একটি র‍্যাঙ্ক করা, ব্যাখ্যা করা সুপারিশ।", next: "পরবর্তী", back: "পেছনে", finish: "আমার সুপারিশ পান" },
  "தமிழ்": { title: "ஸ்மார்ட் திட்டம் பரிந்துரையாளர்", sub: "ஐந்து சிறிய கேள்விகள். தரவரிசைப்படுத்தப்பட்ட, விளக்கப்பட்ட பரிந்துரை.", next: "அடுத்து", back: "பின்னால்", finish: "எனது பரிந்துையைப் பெறுக" }
};

interface AIRecommendation {
  schemeName: string;
  maxLoanAmount: string;
  interestRate: string;
  incomeThreshold: string;
  reasoning: string;
  eligible: boolean;
}

export default function SchemeFinder() {
  const [language, setLanguage] = useState("English");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    purpose: "",
    cost: 120000,
    income: 80000,
    gender: "",
    category: "Scheduled Caste",
    isStudent: false,
    state: ""
  });

  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const langText = t[language as keyof typeof t] || t["English"];

  const nextStep = () => setStep((p) => Math.min(p + 1, 6));
  const prevStep = () => setStep((p) => Math.max(p - 1, 1));

  const fetchRecommendation = async () => {
    setLoading(true);
    setStep(6);
    setRecommendation(null);
    setFetchError(null);

    try {
      const response = await fetch('/api/schemes/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          income: formData.income,
          cost: formData.cost,
          purpose: formData.purpose,
          state: formData.state
        }),
      });
      const data = await response.json();
      if (data.success) {
        setRecommendation(data.recommendation);
      } else {
        setFetchError(data.error || "Could not fetch recommendation at this time.");
      }
    } catch (error) {
      console.error(error);
      setFetchError("An error occurred while analyzing your eligibility.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("SamruddhiSetu — Eligibility Report", pageWidth / 2, y, { align: "center" });
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Channel Finance System for SC Beneficiaries", pageWidth / 2, y, { align: "center" });
    y += 12;

    doc.setDrawColor(200);
    doc.line(15, y, pageWidth - 15, y);
    y += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Applicant Details", 15, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Purpose: ${formData.purpose || "N/A"}`, 15, y); y += 6;
    doc.text(`Project/Course Cost: Rs. ${formData.cost.toLocaleString('en-IN')}`, 15, y); y += 6;
    doc.text(`Annual Family Income: Rs. ${formData.income.toLocaleString('en-IN')}`, 15, y); y += 6;
    doc.text(`Gender: ${formData.gender || "N/A"}`, 15, y); y += 6;
    doc.text(`Category: ${formData.category}`, 15, y); y += 6;
    doc.text(`State: ${formData.state || "N/A"}`, 15, y); y += 10;

    doc.line(15, y, pageWidth - 15, y);
    y += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Recommended Scheme", 15, y);
    y += 8;

    if (recommendation) {
      doc.setFontSize(13);
      doc.setTextColor(30, 58, 138);
      doc.text(recommendation.schemeName, 15, y);
      y += 8;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Max Loan/Subsidy Amount: ${recommendation.maxLoanAmount}`, 15, y); y += 6;
      doc.text(`Interest Rate: ${recommendation.interestRate}`, 15, y); y += 6;
      doc.text(`Income Threshold: ${recommendation.incomeThreshold}`, 15, y); y += 6;
      doc.text(`Eligibility Status: ${recommendation.eligible ? "Eligible" : "Not Eligible"}`, 15, y); y += 10;

      doc.setFont("helvetica", "bold");
      doc.text("AI Analysis:", 15, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      const reasoningLines = doc.splitTextToSize(recommendation.reasoning, pageWidth - 30);
      doc.text(reasoningLines, 15, y);
      y += reasoningLines.length * 6 + 4;
    }

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      "This is an indicative, AI-assisted estimate and not a final loan sanction. Generated by SamruddhiSetu.",
      15,
      285
    );

    doc.save(`SamruddhiSetu-Eligibility-Report-${Date.now()}.pdf`);
  };

  const purposes = [
    "Petty trade / micro business", "Small enterprise / shop", 
    "Transport (auto, e-rickshaw, tempo)", "Agriculture & allied",
    "Artisan / handicraft unit", "Higher education / course",
    "Housing-linked livelihood", "Medical emergency"
  ];

  const states = [
    "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", 
    "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", 
    "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", 
    "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", 
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", 
    "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
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

      <main className="flex-1 py-12 px-4 flex justify-center">
        <div className="max-w-3xl w-full">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{langText.title}</h2>
            <p className="text-slate-500">{langText.sub}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-8">
            
            {step < 6 && (
              <div className="mb-8">
                <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
                  <span>Step {step} of 5</span>
                  <span>{step * 20}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#1e3a8a] h-full transition-all duration-300"
                    style={{ width: `${step * 20}%` }}
                  ></div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-bold mb-6">What do you need the loan for?</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {purposes.map((p) => (
                    <button
                      key={p}
                      onClick={() => setFormData({ ...formData, purpose: p })}
                      className={`p-4 text-left rounded-xl border-2 transition-all ${
                        formData.purpose === p 
                          ? "border-[#1e3a8a] bg-blue-50 text-[#1e3a8a] font-semibold" 
                          : "border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-bold mb-6">What is the estimated project or course cost?</h3>
                <div className="mb-8">
                  <span className="text-4xl font-bold text-[#1e3a8a]">₹{formData.cost.toLocaleString('en-IN')}</span>
                </div>
                <input 
                  type="range" 
                  min="10000" 
                  max="5000000" 
                  step="10000"
                  value={formData.cost || 10000}
                  onChange={(e) => setFormData({...formData, cost: parseInt(e.target.value, 10)})}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a8a]"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>₹10,000</span>
                  <span>₹50,00,000</span>
                </div>
                <div className="mt-8">
                  <label className="text-sm font-medium text-slate-700 block mb-2">Exact amount</label>
                  <input 
                    type="number" 
                    value={formData.cost || ""}
                    onChange={(e) => setFormData({...formData, cost: e.target.value === "" ? 0 : parseInt(e.target.value, 10)})}
                    className="w-full md:w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-bold mb-6">What is your annual family income?</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-[#1e3a8a]">₹{formData.income.toLocaleString('en-IN')}</span>
                </div>
                {formData.income <= 500000 ? (
                  <p className="text-sm text-green-600 font-medium mb-6">✓ Within the ₹5,00,000 family income ceiling for concessional channel finance.</p>
                ) : (
                  <p className="text-sm text-red-500 font-medium mb-6">Exceeds the ₹5,00,000 family income ceiling for this scheme.</p>
                )}
                <input 
                  type="range" 
                  min="30000" 
                  max="1000000" 
                  step="10000"
                  value={formData.income || 30000} 
                  onChange={(e) => setFormData({...formData, income: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a8a]"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>₹30,000</span>
                  <span>₹10,00,000</span>
                </div>
                <div className="mt-8">
                  <label className="text-sm font-medium text-slate-700 block mb-2">Exact amount</label>
                  <input 
                    type="number" 
                    value={formData.income || ""}
                    onChange={(e) => setFormData({...formData, income: e.target.value === "" ? 0 : parseInt(e.target.value, 10)})}
                    className="w-full md:w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
                <h3 className="text-xl font-bold mb-6">A few details about the applicant</h3>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-3">Applicant gender</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Female", "Male", "Other"].map(g => (
                      <button key={g} onClick={() => setFormData({...formData, gender: g})}
                        className={`py-3 rounded-lg border-2 ${formData.gender === g ? 'border-[#1e3a8a] bg-blue-50 font-semibold text-[#1e3a8a]' : 'border-slate-200 text-slate-600'}`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-3">Category</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Scheduled Caste", "Other category"].map(c => (
                      <button key={c} onClick={() => setFormData({...formData, category: c})}
                        className={`py-3 rounded-lg border-2 ${formData.category === c ? 'border-[#1e3a8a] bg-blue-50 font-semibold text-[#1e3a8a]' : 'border-slate-200 text-slate-600'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                  <span className="font-medium text-slate-700">Currently a student / seeking admission</span>
                  <button 
                    onClick={() => setFormData({...formData, isStudent: !formData.isStudent})}
                    className={`w-12 h-6 rounded-full transition-colors relative ${formData.isStudent ? 'bg-[#1e3a8a]' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${formData.isStudent ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-bold mb-6">Where will the activity be based?</h3>
                <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {states.map((s) => (
                      <button
                        key={s}
                        onClick={() => setFormData({ ...formData, state: s })}
                        className={`p-3 text-sm text-center rounded-lg border-2 transition-all ${
                          formData.state === s 
                            ? "border-[#1e3a8a] bg-blue-50 text-[#1e3a8a] font-semibold" 
                            : "border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-slate-50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-12 h-12 border-4 border-[#1e3a8a] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-600 font-medium">Analyzing eligibility with AI...</p>
                  </div>
                ) : fetchError ? (
                  <div className="text-center py-12">
                    <p className="text-red-500 font-medium">{fetchError}</p>
                    <Button onClick={fetchRecommendation} className="mt-4 bg-[#1e3a8a] text-white">
                      Try again
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className={`flex items-center gap-2 mb-6 font-semibold ${recommendation?.eligible === false ? "text-red-600" : "text-green-600"}`}>
                      <CheckCircle2 size={24} /> {recommendation?.eligible === false ? "Closest matching scheme found" : "Best match found"}
                    </div>

                    <div className="border rounded-2xl overflow-hidden mb-8">
                      <div className={`p-6 border-b flex justify-between items-start ${recommendation?.eligible === false ? "bg-red-50" : "bg-slate-50"}`}>
                        <div>
                          <h3 className="text-2xl font-bold text-[#1e3a8a] mb-1">
                            {recommendation?.schemeName || (formData.purpose === "Higher education / course" || formData.isStudent ? "Educational Loan Scheme" : "Micro Finance Scheme")}
                          </h3>
                          <p className="text-sm text-slate-500">Indicative amount from {formData.state || "Selected State"}</p>
                          {recommendation && (
                            <span className={`inline-block mt-2 text-xs font-bold px-2 py-1 rounded-full ${recommendation.eligible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {recommendation.eligible ? "You are eligible" : "You do not currently meet this scheme's criteria"}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-slate-500 block mb-1">
                            {recommendation?.eligible === false ? "Scheme's max limit" : "Max Loan/Subsidy Amount"}
                          </span>
                          <span className={`text-3xl font-bold ${recommendation?.eligible === false ? "text-slate-400" : "text-slate-900"}`}>
                            {recommendation?.maxLoanAmount || `₹${(formData.cost * 0.9).toLocaleString('en-IN')}`}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 divide-x border-b">
                        <div className="p-4 text-center">
                          <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Interest Rate</span>
                          <span className="font-bold text-lg">{recommendation?.interestRate || (formData.gender === "Female" ? "4.5% p.a." : "5.5% p.a.")}</span>
                        </div>
                        <div className="p-4 text-center">
                          <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Coverage</span>
                          <span className="font-bold text-lg">90% of cost</span>
                        </div>
                        <div className="p-4 text-center">
                          <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Moratorium</span>
                          <span className="font-bold text-lg">12 months</span>
                        </div>
                      </div>

                      {recommendation && (
                        <div className={`p-6 border-b ${recommendation.eligible ? "bg-blue-50" : "bg-red-50"}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={`font-bold flex items-center gap-2 ${recommendation.eligible ? "text-[#1e3a8a]" : "text-red-700"}`}>
                              <span className={`h-2 w-2 rounded-full ${recommendation.eligible ? "bg-blue-600" : "bg-red-600"}`}></span>
                              AI Scheme Analysis
                            </h4>
                          </div>
                          <p className="text-xs text-slate-600 font-medium mb-2">
                            Income threshold: {recommendation.incomeThreshold}
                          </p>
                          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                            {recommendation.reasoning}
                          </p>
                        </div>
                      )}

                      <div className="p-6">
                        <h4 className="font-bold mb-4">{recommendation?.eligible === false ? "What to check" : "Why this fits"}</h4>
                        {recommendation?.eligible === false ? (
                          <ul className="space-y-3 text-sm text-slate-700">
                            <li className="flex gap-2 text-red-600">⚠ Your income or project cost is outside this specific scheme's limits — see the AI analysis above for exact figures.</li>
                            <li className="flex gap-2">💡 Try a different purpose category, or check the Partner Locator for schemes with higher income ceilings.</li>
                          </ul>
                        ) : (
                          <ul className="space-y-3 text-sm text-slate-700">
                            <li className="flex gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0"/> Family income ₹{formData.income.toLocaleString('en-IN')} fits within {recommendation?.incomeThreshold || "the scheme's income ceiling"}.</li>
                            <li className="flex gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0"/> Project cost fits the scheme's ceiling limit.</li>
                            <li className="flex gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0"/> Covers up to 90% of project cost — about ₹{(formData.cost * 0.9).toLocaleString('en-IN')}.</li>
                          </ul>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4 mb-4">
                      <a href="/calculator" className="flex-1">
                        <Button className="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white py-6">
                          Proceed to calculator <ArrowRight size={16} className="ml-2"/>
                        </Button>
                      </a>
                      <a href="/locator" className="flex-1">
                        <Button variant="outline" className="w-full py-6">
                          Find a partner
                        </Button>
                      </a>
                    </div>

                    {recommendation && (
                      <Button
                        onClick={downloadPDF}
                        variant="outline"
                        className="w-full py-6 mb-12 border-2 border-[#1e3a8a] text-[#1e3a8a] hover:bg-blue-50"
                      >
                        <Download size={16} className="mr-2" /> Download eligibility report as PDF
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}

            {step < 6 && (
              <div className="flex justify-between items-center mt-10 pt-6 border-t">
                <Button 
                  variant="ghost" 
                  onClick={prevStep} 
                  disabled={step === 1 || loading}
                  className={step === 1 ? 'opacity-0' : 'opacity-100'}
                >
                  <ArrowLeft size={16} className="mr-2" /> {langText.back}
                </Button>
                
                <Button 
                  className="bg-[#1e3a8a] hover:bg-blue-800 text-white px-8"
                  disabled={loading}
                  onClick={step === 5 ? fetchRecommendation : nextStep}
                >
                  {step === 5 ? langText.finish : langText.next} <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}