"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Building2, FileText, Search, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const t = {
  "English": { title: "Why this platform matters", sub: "Financial literacy, transparency and efficiency for households that the formal credit system has historically missed." },
  "हिन्दी": { title: "यह मंच क्यों महत्वपूर्ण है", sub: "उन परिवारों के लिए वित्तीय साक्षरता, पारदर्शिता और दक्षता जिन्हें औपचारिक ऋण प्रणाली ने ऐतिहासिक रूप से छोड़ दिया है।" },
  "मराठी": { title: "हे प्लॅटफॉर्म का महत्त्वाचे आहे", sub: "औपचारिक कर्ज प्रणालीने ऐतिहासिकदृष्ट्या गमावलेल्या कुटुंबांसाठी आर्थिक साक्षरता, पारदर्शकता." },
  "বাংলা": { title: "কেন এই প্ল্যাটফর্মটি গুরুত্বপূর্ণ", sub: "যে পরিবারগুলোকে আনুষ্ঠানিক ক্রেডিট সিস্টেম ঐতিহাসিকভাবে মিস করেছে তাদের জন্য আর্থিক সাক্ষরতা।" },
  "தமிழ்": { title: "இந்த தளம் ஏன் முக்கியமானது", sub: "முறையான கடன் அமைப்பு வரலாற்று ரீதியாகத் தவறிய குடும்பங்களுக்கான நிதி எழுத்தறிவு மற்றும் வெளிப்படைத்தன்மை." }
};

const slideImages = [
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb9?auto=format&fit=crop&w=1600&q=80"
];

export default function ImpactPage() {
  const [language, setLanguage] = useState("English");
  const [currentSlide, setCurrentSlide] = useState(0);
  const langText = t[language as keyof typeof t] || t["English"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
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
        <div className="flex gap-4">
          <a href="/scheme-finder">
            <Button className="bg-[#1e3a8a] hover:bg-blue-800 text-white rounded-full px-6">Find my scheme</Button>
          </a>
        </div>
      </header>

      {/* Hero Section with Automated Slideshow Background */}
      <section className="relative text-white py-20 px-4 md:px-8 overflow-hidden">
        {slideImages.map((imgSrc, idx) => (
          <div
            key={imgSrc}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              idx === currentSlide ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
            style={{
              backgroundImage: `url(${imgSrc})`,
              transition: "opacity 1s ease-in-out, transform 6s ease-out"
            }}
          />
        ))}
        <div className="absolute inset-0 bg-slate-950/75" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-md">{langText.title}</h2>
          <p className="text-blue-100 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed drop-shadow">
            {langText.sub}
          </p>
        </div>
      </section>

      <main className="flex-1 py-16 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-24">
        
        {/* The gap we are closing */}
        <section>
          <h3 className="text-3xl font-bold mb-10">The gap we are closing</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-red-50 w-12 h-12 flex items-center justify-center rounded-full text-red-500 mb-6">
                <FileText size={24} />
              </div>
              <h4 className="font-bold text-lg mb-3">Scheme opacity</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Four concessional windows with different ceilings, rates and moratoria are published as PDF circulars. Applicants pick the wrong one and get rejected months later.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-red-50 w-12 h-12 flex items-center justify-center rounded-full text-red-500 mb-6">
                <Search size={24} />
              </div>
              <h4 className="font-bold text-lg mb-3">Partner blindness</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Loans flow through 100+ Channel Partners — SCAs, PSBs, RRBs and NBFC-MFIs. Citizens have no way to know which of them still has funds to disburse.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-red-50 w-12 h-12 flex items-center justify-center rounded-full text-red-500 mb-6">
                <CheckCircle2 size={24} />
              </div>
              <h4 className="font-bold text-lg mb-3">Status black-box</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                After submitting a file, applicants make repeated counter visits simply to ask where it is stuck.
              </p>
            </div>
          </div>
        </section>

        {/* Impact we design for */}
        <section>
          <h3 className="text-3xl font-bold mb-10">Impact we design for</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-white p-8 rounded-2xl border flex flex-col justify-between hover:border-blue-200 transition-colors">
              <div className="flex justify-between items-start mb-6">
                <h4 className="font-bold text-lg w-2/3">Circulars replaced by one guided flow</h4>
                <span className="text-3xl font-bold text-slate-800">5 → 1</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">Rule-encoded eligibility converts brochure language into a personal answer with reasons the applicant can read aloud.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border flex flex-col justify-between hover:border-blue-200 transition-colors">
              <div className="flex justify-between items-start mb-6">
                <h4 className="font-bold text-lg w-2/3">Cost visibility before application</h4>
                <span className="text-3xl font-bold text-slate-800">100%</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">Interest, moratorium capitalisation, EMI and total repayment shown up front — the core of financial literacy.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border flex flex-col justify-between hover:border-blue-200 transition-colors">
              <div className="flex justify-between items-start mb-6">
                <h4 className="font-bold text-lg w-2/3">Fund-health signaling</h4>
                <span className="text-3xl font-bold text-slate-800">3-tier</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">Green / amber / red badges built from NPA levels and unutilised funds move demand towards partners that can actually disburse.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border flex flex-col justify-between hover:border-blue-200 transition-colors">
              <div className="flex justify-between items-start mb-6">
                <h4 className="font-bold text-lg w-2/3">Targeted reduction in idle waiting</h4>
                <span className="text-3xl font-bold text-slate-800">~40%</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">Stage-wise tracking removes the need for status-enquiry visits and surfaces partners with the fastest turnaround.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border flex flex-col justify-between hover:border-blue-200 transition-colors">
              <div className="flex justify-between items-start mb-6">
                <h4 className="font-bold text-lg w-2/3">Languages at launch</h4>
                <span className="text-3xl font-bold text-slate-800">5</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">English, Hindi, Marathi, Bengali and Tamil, with a structure that scales to all scheduled languages.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border flex flex-col justify-between hover:border-blue-200 transition-colors">
              <div className="flex justify-between items-start mb-6">
                <h4 className="font-bold text-lg w-2/3">Focused eligibility band</h4>
                <span className="text-3xl font-bold text-slate-800">₹5L</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">Every screen is built for households under the ₹5,00,000 family income ceiling — the population the scheme exists for.</p>
            </div>

          </div>
        </section>

        {/* How the money actually moves */}
        <section>
          <h3 className="text-3xl font-bold mb-10">How the money actually moves</h3>
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-[20px] left-[10%] right-[10%] h-0.5 bg-slate-200 -z-10"></div>
            
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3 bg-white inline-block pr-2">Stage 1</div>
              <h4 className="font-bold text-lg text-[#1e3a8a] mb-2">Apex corporation</h4>
              <p className="text-sm text-slate-600 leading-relaxed">Releases finance against sanctioned state-wise allocations.</p>
            </div>
            
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3 bg-white inline-block pr-2">Stage 2</div>
              <h4 className="font-bold text-lg text-[#1e3a8a] mb-2">Channel Partner</h4>
              <p className="text-sm text-slate-600 leading-relaxed">SCA, PSB, RRB or NBFC-MFI appraises and on-lends to the beneficiary.</p>
            </div>

            <div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3 bg-white inline-block pr-2">Stage 3</div>
              <h4 className="font-bold text-lg text-[#1e3a8a] mb-2">Beneficiary</h4>
              <p className="text-sm text-slate-600 leading-relaxed">Receives concessional credit at 4%-15% with a built-in moratorium.</p>
            </div>

            <div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3 bg-white inline-block pr-2">Stage 4</div>
              <h4 className="font-bold text-lg text-[#1e3a8a] mb-2">Repayment loop</h4>
              <p className="text-sm text-slate-600 leading-relaxed">Recoveries replenish the corpus. NPA feeds back into partner health.</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center py-16">
          <h3 className="text-2xl font-bold mb-6">See the whole journey in under two minutes</h3>
          <a href="/scheme-finder">
            <Button className="bg-[#1e3a8a] hover:bg-blue-800 text-white font-semibold px-8 py-6 rounded-full text-lg shadow-md">
              Find my scheme <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
        </section>

      </main>
      
      {/* Simple Footer */}
      <footer className="bg-white border-t py-8 text-center text-sm text-slate-500">
          © 2026 SamruddhiSetu Prototype. Built for Smart India Hackathon.
      </footer>
    </div>
  );
}