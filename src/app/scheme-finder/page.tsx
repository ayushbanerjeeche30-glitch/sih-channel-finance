"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import VoiceInput from "@/components/VoiceInput"; // Added VoiceInput import

const t = {
  "English": { 
    title: "Smart Scheme Recommender", sub: "Five short questions. A ranked, explained recommendation.", next: "Next", back: "Back", finish: "Get my recommendation",
    step1Q: "What do you need the loan for?", 
    step2Q: "What is the estimated project or course cost?", exactAmount: "Exact amount",
    step3Q: "What is your annual family income?", withinCeil: "✓ Within the ₹5,00,000 family income ceiling for concessional channel finance.", exceedsCeil: "Exceeds the ₹5,00,000 family income ceiling for this scheme.",
    step4Q: "A few details about the applicant", gender: "Applicant gender", category: "Category", student: "Currently a student / seeking admission",
    step5Q: "Where will the activity be based?",
    analyzing: "Analyzing eligibility with AI...", bestMatch: "Best match found", closestMatch: "Closest matching scheme found",
    eligibleBadge: "You are eligible", notEligibleBadge: "You do not currently meet this scheme's criteria",
    maxLimitLabel: "Scheme's max limit", maxLoanLabel: "Max Loan/Subsidy Amount", intRate: "Interest Rate", coverage: "Coverage", moratorium: "Moratorium",
    aiAnalysis: "AI Scheme Analysis", incThreshold: "Income threshold:", whatToCheck: "What to check", whyFits: "Why this fits",
    proceedCalc: "Proceed to calculator", findPartner: "Find a partner", dlPdf: "Download eligibility report as PDF",
    altTitle: "You may qualify for these instead",
    purposes: ["Petty trade / micro business", "Small enterprise / shop", "Transport (auto, e-rickshaw, tempo)", "Agriculture & allied", "Artisan / handicraft unit", "Higher education / course", "Housing-linked livelihood", "Medical emergency"],
    genders: ["Female", "Male", "Other"], categories: ["Scheduled Caste", "Other category"]
  },
  "हिन्दी": { 
    title: "स्मार्ट योजना अनुशंसाकर्ता", sub: "पाँच छोटे प्रश्न। एक क्रमबद्ध, स्पष्ट अनुशंसा।", next: "अगला", back: "पीछे", finish: "मेरी अनुशंसा प्राप्त करें",
    step1Q: "आपको लोन किस लिए चाहिए?", 
    step2Q: "परियोजना या पाठ्यक्रम की अनुमानित लागत क्या है?", exactAmount: "सटीक राशि",
    step3Q: "आपकी वार्षिक पारिवारिक आय क्या है?", withinCeil: "✓ रियायती वित्त के लिए ₹5,00,000 की पारिवारिक आय सीमा के भीतर।", exceedsCeil: "इस योजना के लिए ₹5,00,000 की पारिवारिक आय सीमा से अधिक है।",
    step4Q: "आवेदक के बारे में कुछ विवरण", gender: "आवेदक का लिंग", category: "श्रेणी", student: "वर्तमान में एक छात्र / प्रवेश के इच्छुक",
    step5Q: "गतिविधि कहाँ आधारित होगी?",
    analyzing: "AI के साथ पात्रता का विश्लेषण...", bestMatch: "सबसे अच्छा मैच मिला", closestMatch: "निकटतम मेल खाने वाली योजना मिली",
    eligibleBadge: "आप पात्र हैं", notEligibleBadge: "आप वर्तमान में इस योजना के मानदंडों को पूरा नहीं करते हैं",
    maxLimitLabel: "योजना की अधिकतम सीमा", maxLoanLabel: "अधिकतम ऋण/सब्सिडी राशि", intRate: "ब्याज दर", coverage: "कवरेज", moratorium: "मोरेटोरियम",
    aiAnalysis: "AI योजना विश्लेषण", incThreshold: "आय सीमा:", whatToCheck: "क्या जाँचना है", whyFits: "यह क्यों फिट बैठता है",
    proceedCalc: "कैलकुलेटर पर जाएं", findPartner: "भागीदार खोजें", dlPdf: "पात्रता रिपोर्ट PDF के रूप में डाउनलोड करें",
    altTitle: "आप इनके लिए पात्र हो सकते हैं",
    purposes: ["छोटा व्यापार", "छोटा उद्यम / दुकान", "परिवहन (ऑटो, ई-रिक्शा)", "कृषि और संबद्ध", "कारीगर / हस्तशिल्प", "उच्च शिक्षा", "आवास से जुड़ी आजीविका", "चिकित्सा आपातकाल"],
    genders: ["महिला", "पुरुष", "अन्य"], categories: ["अनुसूचित जाति", "अन्य श्रेणी"]
  },
  "मराठी": { 
    title: "स्मार्ट योजना शिफारसकर्ता", sub: "पाच छोटे प्रश्न. एक क्रमबद्ध, स्पष्ट शिफारस.", next: "पुढील", back: "मागे", finish: "माझी शिफारस मिळवा",
    step1Q: "तुम्हाला कर्ज कशासाठी हवे आहे?", 
    step2Q: "प्रकल्पाची किंवा अभ्यासक्रमाची अंदाजित किंमत किती आहे?", exactAmount: "अचूक रक्कम",
    step3Q: "तुमचे वार्षिक कौटुंबिक उत्पन्न किती आहे?", withinCeil: "✓ सवलतीच्या वित्तासाठी ₹5,00,000 च्या कौटुंबिक उत्पन्न मर्यादेच्या आत.", exceedsCeil: "या योजनेसाठी ₹5,00,000 च्या कौटुंबिक उत्पन्न मर्यादेपेक्षा जास्त.",
    step4Q: "अर्जदाराचे काही तपशील", gender: "अर्जदाराचे लिंग", category: "श्रेणी", student: "सध्या विद्यार्थी / प्रवेशाच्या शोधात",
    step5Q: "उपक्रम कोठे असेल?",
    analyzing: "AI सह पात्रतेचे विश्लेषण करत आहे...", bestMatch: "सर्वोत्तम जुळणी सापडली", closestMatch: "सर्वात जवळची जुळणारी योजना सापडली",
    eligibleBadge: "तुम्ही पात्र आहात", notEligibleBadge: "तुम्ही सध्या या योजनेचे निकष पूर्ण करत नाही",
    maxLimitLabel: "योजनेची कमाल मर्यादा", maxLoanLabel: "कमाल कर्ज/सबसिडी रक्कम", intRate: "व्याज दर", coverage: "कव्हरेज", moratorium: "मोरेटोरियम",
    aiAnalysis: "AI योजना विश्लेषण", incThreshold: "उत्पन्न मर्यादा:", whatToCheck: "काय तपासायचे", whyFits: "हे का बसते",
    proceedCalc: "कॅल्क्युलेटरकडे जा", findPartner: "भागीदार शोधा", dlPdf: "पात्रता अहवाल PDF म्हणून डाउनलोड करा",
    altTitle: "तुम्ही याऐवजी यांसाठी पात्र असू शकता",
    purposes: ["छोटा व्यापार", "लघु उद्योग / दुकान", "वाहतूक (ऑटो, ई-रिक्षा)", "कृषी आणि संलग्न", "कारागीर / हस्तकला", "उच्च शिक्षण", "घराशी जोडलेली उपजीविका", "वैद्यकीय आणीबाणी"],
    genders: ["महिला", "पुरुष", "इतर"], categories: ["अनुसूचित जाती", "इतर श्रेणी"]
  },
  "বাংলা": { 
    title: "স্মার্ট স্কিম সুপারিশকারী", sub: "পাঁচটি ছোট প্রশ্ন। একটি র‍্যাঙ্ক করা, ব্যাখ্যা করা সুপারিশ।", next: "পরবর্তী", back: "পেছনে", finish: "আমার সুপারিশ পান",
    step1Q: "লোন কিসের জন্য প্রয়োজন?", 
    step2Q: "প্রকল্প বা কোর্সের আনুমানিক ব্যয় কত?", exactAmount: "সঠিক পরিমাণ",
    step3Q: "আপনার বার্ষিক পারিবারিক আয় কত?", withinCeil: "✓ ছাড়যুক্ত অর্থের জন্য ₹5,00,000 পারিবারিক আয় সীমার মধ্যে।", exceedsCeil: "এই স্কিমের জন্য ₹5,00,000 পারিবারিক আয়ের সীমা অতিক্রম করেছে।",
    step4Q: "আবেদনকারীর কিছু বিবরণ", gender: "আবেদনকারীর লিঙ্গ", category: "বিভাগ", student: "বর্তমানে একজন ছাত্র / ভর্তির খুঁজছেন",
    step5Q: "কার্যকলাপ কোথায় হবে?",
    analyzing: "AI দিয়ে যোগ্যতার বিশ্লেষণ করা হচ্ছে...", bestMatch: "সেরা ম্যাচ পাওয়া গেছে", closestMatch: "কাছাকাছি ম্যাচিং স্কিম পাওয়া গেছে",
    eligibleBadge: "আপনি যোগ্য", notEligibleBadge: "আপনি বর্তমানে এই স্কিমের মানদণ্ড পূরণ করছেন না",
    maxLimitLabel: "স্কিমের সর্বোচ্চ সীমা", maxLoanLabel: "সর্বোচ্চ ঋণ/ভর্তুকির পরিমাণ", intRate: "সুদের হার", coverage: "কভারেজ", moratorium: "মরেটোরিয়াম",
    aiAnalysis: "AI স্কিম বিশ্লেষণ", incThreshold: "আয় সীমা:", whatToCheck: "কী পরীক্ষা করবেন", whyFits: "কেন এটি মানানসই",
    proceedCalc: "ক্যালকুলেটরে যান", findPartner: "অংশীদার খুঁজুন", dlPdf: "যোগ্যতা রিপোর্ট PDF হিসাবে ডাউনলোড করুন",
    altTitle: "আপনি এগুলোর জন্যও যোগ্য হতে পারেন",
    purposes: ["ছোট ব্যবসা", "ক্ষুদ্র উদ্যোগ / দোকান", "পরিবহন (অটো, ই-রিকশা)", "কৃষি ও আনুষঙ্গিক", "কারিগর / হস্তশিল্প", "উচ্চ শিক্ষা", "আবাসন-যুক্ত জীবিকা", "মেডিকেল ইমার্জেন্সি"],
    genders: ["মহিলা", "পুরুষ", "অন্যান্য"], categories: ["তফসিলি জাতি", "অন্যান্য বিভাগ"]
  },
  "தமிழ்": { 
    title: "ஸ்மார்ட் திட்டம் பரிந்துரையாளர்", sub: "ஐந்து சிறிய கேள்விகள். தரவரிசைப்படுத்தப்பட்ட, விளக்கப்பட்ட பரிந்துரை.", next: "அடுத்து", back: "பின்னால்", finish: "எனது பரிந்துையைப் பெறுக",
    step1Q: "கடன் எதற்காக தேவை?", 
    step2Q: "திட்டம் அல்லது பாடநெறியின் மதிப்பிடப்பட்ட செலவு என்ன?", exactAmount: "சரியான தொகை",
    step3Q: "உங்கள் ஆண்டு குடும்ப வருமானம் என்ன?", withinCeil: "✓ ₹5,00,000 குடும்ப வருமான வரம்பிற்குள் உள்ளது.", exceedsCeil: "இந்தத் திட்டத்திற்கான ₹5,00,000 குடும்ப வருமான வரம்பை மீறுகிறது.",
    step4Q: "விண்ணப்பதாரர் பற்றிய சில விவரங்கள்", gender: "விண்ணப்பதாரரின் பாலினம்", category: "வகை", student: "தற்போது மாணவர் / சேர்க்கை தேடுபவர்",
    step5Q: "செயல்பாடு எங்கு அமையும்?",
    analyzing: "AI மூலம் தகுதியை பகுப்பாய்வு செய்கிறது...", bestMatch: "சிறந்த பொருத்தம் கண்டறியப்பட்டது", closestMatch: "மிக நெருக்கமான திட்டம் கண்டறியப்பட்டது",
    eligibleBadge: "நீங்கள் தகுதியானவர்", notEligibleBadge: "இந்தத் திட்டத்தின் நிபந்தனைகளை நீங்கள் தற்போது பூர்த்தி செய்யவில்லை",
    maxLimitLabel: "திட்டத்தின் அதிகபட்ச வரம்பு", maxLoanLabel: "அதிகபட்ச கடன்/மானியம்", intRate: "வட்டி விகிதம்", coverage: "கவரேஜ்", moratorium: "மக்கள்தொகை",
    aiAnalysis: "AI திட்ட பகுப்பாய்வு", incThreshold: "வருமான வரம்பு:", whatToCheck: "என்ன சரிபார்க்க வேண்டும்", whyFits: "இது ஏன் பொருந்துகிறது",
    proceedCalc: "கால்குலேட்டருக்குச் செல்லவும்", findPartner: "கூட்டாளரைக் கண்டறியவும்", dlPdf: "தகுதி அறிக்கையை PDF ஆக பதிவிறக்கவும்",
    altTitle: "மாறாக இவற்றுக்கு நீங்கள் தகுதி பெறலாம்",
    purposes: ["சிறு வணிகம்", "சிறிய நிறுவனம் / கடை", "போக்குவரத்து (ஆட்டோ)", "விவசாயம்", "கைவினைஞர்", "உயர் கல்வி", "வீட்டு வசதி", "மருத்துவ அவசரம்"],
    genders: ["பெண்", "ஆண்", "மற்றவை"], categories: ["பட்டியலிடப்பட்ட சாதி", "பிற வகை"]
  }
};

const langCodes: Record<string, string> = {
  "English": "en-IN",
  "हिन्दी": "hi-IN",
  "मराठी": "mr-IN",
  "বাংলা": "bn-IN",
  "தமிழ்": "ta-IN"
};

interface AlternativeScheme {
  schemeName: string;
  maxLoanAmount: string;
  interestRate: string;
  incomeThreshold: string;
  reasoning: string;
}

interface AIRecommendation {
  schemeName: string;
  maxLoanAmount: string;
  interestRate: string;
  incomeThreshold: string;
  reasoning: string;
  eligible: boolean;
  alternatives?: AlternativeScheme[];
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

  const DRAFT_KEY = "samruddhisetu_scheme_finder_draft";
  const [draftRestored, setDraftRestored] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const hasActualData = parsed.formData && Object.values(parsed.formData).some((val) => val !== "" && val !== null);
        if (hasActualData) {
          setFormData(parsed.formData);
          setStep(parsed.step || 1);
          setDraftRestored(true);
          setTimeout(() => setDraftRestored(false), 5000);
        }
      }
    } catch (e) {} finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized && step < 6) {
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ formData, step })); } catch (e) {}
    }
  }, [formData, step, isInitialized]);

  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const langText = t[language as keyof typeof t] || t["English"];

  const nextStep = () => setStep((p) => Math.min(p + 1, 6));
  const prevStep = () => setStep((p) => Math.max(p - 1, 1));

  const fetchRecommendation = async () => {
    if (!navigator.onLine) {
      const provisionalId = `CFS-PENDING-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const queuedApp = { payload: formData, provisionalId, timestamp: new Date().toISOString() };
      const existingQueue = JSON.parse(localStorage.getItem("samruddhisetu_offline_queue") || "[]");
      existingQueue.push(queuedApp);
      localStorage.setItem("samruddhisetu_offline_queue", JSON.stringify(existingQueue));
      localStorage.removeItem(DRAFT_KEY);
      alert(`You are offline. Application saved locally! Provisional ID: ${provisionalId}. It will auto-sync when you reconnect.`);
      return;
    }

    setLoading(true); setStep(6); setRecommendation(null); setFetchError(null);

    try {
      const response = await fetch('/api/schemes/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ income: formData.income, cost: formData.cost, purpose: formData.purpose, state: formData.state }),
      });
      const data = await response.json();
      if (data.success) {
        setRecommendation(data.recommendation);
      } else {
        setFetchError(data.error || "Could not fetch recommendation at this time.");
      }
    } catch (error) {
      setFetchError("An error occurred while analyzing your eligibility.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    doc.setFontSize(16); doc.setFont("helvetica", "bold");
    doc.text("SamruddhiSetu — Eligibility Report", pageWidth / 2, y, { align: "center" });
    y += 8; doc.setFontSize(10); doc.setFont("helvetica", "normal");
    doc.text("Channel Finance System for SC Beneficiaries", pageWidth / 2, y, { align: "center" });
    y += 12; doc.setDrawColor(200); doc.line(15, y, pageWidth - 15, y); y += 10;

    doc.setFontSize(12); doc.setFont("helvetica", "bold");
    doc.text("Applicant Details", 15, y); y += 7;
    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    doc.text(`Purpose: ${formData.purpose || "N/A"}`, 15, y); y += 6;
    doc.text(`Project/Course Cost: Rs. ${formData.cost.toLocaleString('en-IN')}`, 15, y); y += 6;
    doc.text(`Annual Family Income: Rs. ${formData.income.toLocaleString('en-IN')}`, 15, y); y += 6;
    doc.text(`Gender: ${formData.gender || "N/A"}`, 15, y); y += 6;
    doc.text(`Category: ${formData.category}`, 15, y); y += 6;
    doc.text(`State: ${formData.state || "N/A"}`, 15, y); y += 10;
    doc.line(15, y, pageWidth - 15, y); y += 10;

    doc.setFontSize(12); doc.setFont("helvetica", "bold");
    doc.text("Recommended Scheme", 15, y); y += 8;

    if (recommendation) {
      doc.setFontSize(13); doc.setTextColor(30, 58, 138); doc.text(recommendation.schemeName, 15, y); y += 8;
      doc.setTextColor(0, 0, 0); doc.setFontSize(10); doc.setFont("helvetica", "normal");
      doc.text(`Max Loan/Subsidy Amount: ${recommendation.maxLoanAmount}`, 15, y); y += 6;
      doc.text(`Interest Rate: ${recommendation.interestRate}`, 15, y); y += 6;
      doc.text(`Income Threshold: ${recommendation.incomeThreshold}`, 15, y); y += 6;
      doc.text(`Eligibility Status: ${recommendation.eligible ? "Eligible" : "Not Eligible"}`, 15, y); y += 10;

      doc.setFont("helvetica", "bold"); doc.text("AI Analysis:", 15, y); y += 7;
      doc.setFont("helvetica", "normal");
      const reasoningLines = doc.splitTextToSize(recommendation.reasoning, pageWidth - 30);
      doc.text(reasoningLines, 15, y);
      y += reasoningLines.length * 6 + 4;
    }

    doc.setFontSize(8); doc.setTextColor(150);
    doc.text("This is an indicative, AI-assisted estimate and not a final loan sanction. Generated by SamruddhiSetu.", 15, 285);
    doc.save(`SamruddhiSetu-Eligibility-Report-${Date.now()}.pdf`);
  };

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
                key={l} onClick={() => setLanguage(l)}
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
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="State Emblem of India" className="h-10 w-auto opacity-90"/>
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-900 leading-tight">SamruddhiSetu</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider hidden sm:block">Channel Finance System for SC Beneficiaries</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 px-4 flex justify-center">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{langText.title}</h2>
            <p className="text-slate-500">{langText.sub}</p>
          </div>

          {draftRestored && step < 6 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg px-4 py-3 mb-6 flex items-center justify-between shadow-sm animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> We restored your saved progress from where you left off.
              </div>
              <button onClick={() => setDraftRestored(false)} className="text-amber-600 hover:text-amber-900">✕</button>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border p-8">
            
            {step < 6 && (
              <div className="mb-8">
                <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
                  <span>Step {step} of 5</span>
                  <span>{step * 20}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#1e3a8a] h-full transition-all duration-300" style={{ width: `${step * 20}%` }}></div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-stretch">
                  
                  {/* LEFT SIDE: Current Step 1 Manual Selection */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">{langText.step1Q}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                      {langText.purposes.map((p) => (
                        <button
                          key={p}
                          onClick={() => setFormData({ ...formData, purpose: p })}
                          className={`p-3.5 text-left rounded-xl border-2 text-sm transition-all ${
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

                  {/* CENTER: Visual "OR" Divider */}
                  <div className="flex lg:flex-col items-center justify-center gap-2 py-2 lg:py-0">
                    <div className="h-[1px] lg:h-full w-full lg:w-[1px] bg-slate-200"></div>
                    <span className="bg-slate-100 text-slate-500 font-bold text-xs uppercase px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                      OR
                    </span>
                    <div className="h-[1px] lg:h-full w-full lg:w-[1px] bg-slate-200"></div>
                  </div>

                  {/* RIGHT SIDE: Direct Voice Assistant Express Match */}
                  <div>
                    <VoiceInput 
                      languageCode={language === "हिन्दी" ? "hi-IN" : language === "বাংলा" ? "bn-IN" : language === "தமிழ்" ? "ta-IN" : language === "मराठी" ? "mr-IN" : "en-IN"}
                      onExpressSubmit={async (spokenTranscript) => {
                        if (!navigator.onLine) {
                          alert("You are offline. Please select an option on the left.");
                          return;
                        }
                        // Skip steps 2, 3, 4, 5 directly to Step 6
                        setStep(6);
                        setLoading(true);
                        setRecommendation(null);
                        setFetchError(null);

                        try {
                          const response = await fetch('/api/schemes/recommend', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ voiceTranscript: spokenTranscript }),
                          });
                          const data = await response.json();
                          if (data.success) {
                            setRecommendation(data.recommendation);
                          } else {
                            setFetchError(data.error || "Could not recommend a scheme from voice.");
                          }
                        } catch (err) {
                          setFetchError("An error occurred during voice analysis.");
                        } finally {
                          setLoading(false);
                        }
                      }}
                    />
                  </div>

                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-bold mb-6">{langText.step2Q}</h3>
                <div className="mb-8">
                  <span className="text-4xl font-bold text-[#1e3a8a]">₹{formData.cost.toLocaleString('en-IN')}</span>
                </div>
                <input type="range" min="10000" max="5000000" step="10000" value={formData.cost || 10000}
                  onChange={(e) => setFormData({...formData, cost: parseInt(e.target.value, 10)})}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a8a]" />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>₹10,000</span><span>₹50,00,000</span>
                </div>
                <div className="mt-8">
                  <label className="text-sm font-medium text-slate-700 block mb-2">{langText.exactAmount}</label>
                  <input type="number" value={formData.cost || ""}
                    onChange={(e) => setFormData({...formData, cost: e.target.value === "" ? 0 : parseInt(e.target.value, 10)})}
                    className="w-full md:w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-bold mb-6">{langText.step3Q}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-[#1e3a8a]">₹{formData.income.toLocaleString('en-IN')}</span>
                </div>
                {formData.income <= 500000 ? (
                  <p className="text-sm text-green-600 font-medium mb-6">{langText.withinCeil}</p>
                ) : (
                  <p className="text-sm text-red-500 font-medium mb-6">{langText.exceedsCeil}</p>
                )}
                <input type="range" min="30000" max="1000000" step="10000" value={formData.income || 30000} 
                  onChange={(e) => setFormData({...formData, income: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a8a]" />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>₹30,000</span><span>₹10,00,000</span>
                </div>
                <div className="mt-8">
                  <label className="text-sm font-medium text-slate-700 block mb-2">{langText.exactAmount}</label>
                  <input type="number" value={formData.income || ""}
                    onChange={(e) => setFormData({...formData, income: e.target.value === "" ? 0 : parseInt(e.target.value, 10)})}
                    className="w-full md:w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]" />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
                <h3 className="text-xl font-bold mb-6">{langText.step4Q}</h3>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-3">{langText.gender}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {langText.genders.map(g => (
                      <button key={g} onClick={() => setFormData({...formData, gender: g})}
                        className={`py-3 rounded-lg border-2 ${formData.gender === g ? 'border-[#1e3a8a] bg-blue-50 font-semibold text-[#1e3a8a]' : 'border-slate-200 text-slate-600'}`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-3">{langText.category}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {langText.categories.map(c => (
                      <button key={c} onClick={() => setFormData({...formData, category: c})}
                        className={`py-3 rounded-lg border-2 ${formData.category === c ? 'border-[#1e3a8a] bg-blue-50 font-semibold text-[#1e3a8a]' : 'border-slate-200 text-slate-600'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                  <span className="font-medium text-slate-700">{langText.student}</span>
                  <button onClick={() => setFormData({...formData, isStudent: !formData.isStudent})}
                    className={`w-12 h-6 rounded-full transition-colors relative ${formData.isStudent ? 'bg-[#1e3a8a]' : 'bg-slate-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${formData.isStudent ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-bold mb-6">{langText.step5Q}</h3>
                <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {states.map((s) => (
                      <button key={s} onClick={() => setFormData({ ...formData, state: s })}
                        className={`p-3 text-sm text-center rounded-lg border-2 transition-all ${
                          formData.state === s 
                            ? "border-[#1e3a8a] bg-blue-50 text-[#1e3a8a] font-semibold" 
                            : "border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-slate-50"
                        }`}>
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
                    <p className="text-slate-600 font-medium">{langText.analyzing}</p>
                  </div>
                ) : fetchError ? (
                  <div className="text-center py-12">
                    <p className="text-red-500 font-medium">{fetchError}</p>
                    <Button onClick={fetchRecommendation} className="mt-4 bg-[#1e3a8a] text-white">Try again</Button>
                  </div>
                ) : (
                  <>
                    <div className={`flex items-center gap-2 mb-6 font-semibold ${recommendation?.eligible === false ? "text-red-600" : "text-green-600"}`}>
                      <CheckCircle2 size={24} /> {recommendation?.eligible === false ? langText.closestMatch : langText.bestMatch}
                    </div>

                    <div className="border rounded-2xl overflow-hidden mb-8">
                      <div className={`p-6 border-b flex justify-between items-start ${recommendation?.eligible === false ? "bg-red-50" : "bg-slate-50"}`}>
                        <div>
                          <h3 className="text-2xl font-bold text-[#1e3a8a] mb-1">
                            {recommendation?.schemeName || "Scheme"}
                          </h3>
                          <p className="text-sm text-slate-500">
                            Indicative amount for your region
                          </p>
                          {recommendation && (
                            <span className={`inline-block mt-2 text-xs font-bold px-2 py-1 rounded-full ${recommendation.eligible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {recommendation.eligible ? langText.eligibleBadge : langText.notEligibleBadge}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-slate-500 block mb-1">
                            {recommendation?.eligible === false ? langText.maxLimitLabel : langText.maxLoanLabel}
                          </span>
                          <span className={`text-3xl font-bold ${recommendation?.eligible === false ? "text-slate-400" : "text-slate-900"}`}>
                            {recommendation?.maxLoanAmount || `₹${(formData.cost * 0.9).toLocaleString('en-IN')}`}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 divide-x border-b">
                        <div className="p-4 text-center">
                          <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">{langText.intRate}</span>
                          <span className="font-bold text-lg">{recommendation?.interestRate || "-"}</span>
                        </div>
                        <div className="p-4 text-center">
                          <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">{langText.coverage}</span>
                          <span className="font-bold text-lg">90%</span>
                        </div>
                        <div className="p-4 text-center">
                          <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">{langText.moratorium}</span>
                          <span className="font-bold text-lg">12 mos</span>
                        </div>
                      </div>

                      {recommendation && (
                        <div className={`p-6 border-b ${recommendation.eligible ? "bg-blue-50" : "bg-red-50"}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={`font-bold flex items-center gap-2 ${recommendation.eligible ? "text-[#1e3a8a]" : "text-red-700"}`}>
                              <span className={`h-2 w-2 rounded-full ${recommendation.eligible ? "bg-blue-600" : "bg-red-600"}`}></span>
                              {langText.aiAnalysis}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-600 font-medium mb-2">{langText.incThreshold} {recommendation.incomeThreshold}</p>
                          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{recommendation.reasoning}</p>
                        </div>
                      )}

                      <div className="p-6">
                        <h4 className="font-bold mb-4">{recommendation?.eligible === false ? langText.whatToCheck : langText.whyFits}</h4>
                        {recommendation?.eligible === false ? (
                          <ul className="space-y-3 text-sm text-slate-700">
                            <li className="flex gap-2 text-red-600">⚠ Your income or project cost is outside this specific scheme's limits.</li>
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
                      
                      {/* --- NEW ALTERNATIVES UI BLOCK --- */}
                      {recommendation?.eligible === false && recommendation.alternatives && recommendation.alternatives.length > 0 && (
                        <div className="p-6 border-t bg-green-50">
                          <h4 className="font-bold mb-4 text-green-800 flex items-center gap-2">
                            <CheckCircle2 size={18} /> {langText.altTitle}
                          </h4>
                          <div className="space-y-4">
                            {recommendation.alternatives.map((alt, idx) => (
                              <div key={idx} className="bg-white border border-green-200 rounded-xl p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-bold text-slate-900">{alt.schemeName}</h5>
                                  <span className="text-sm font-bold text-green-700">{alt.maxLoanAmount}</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-2">{alt.interestRate} • Income limit: {alt.incomeThreshold}</p>
                                <p className="text-sm text-slate-700">{alt.reasoning}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* --------------------------------- */}
                      
                    </div>

                    <div className="flex gap-4 mb-4">
                      <a href="/calculator" className="flex-1">
                        <Button className="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white py-6">
                          {langText.proceedCalc} <ArrowRight size={16} className="ml-2"/>
                        </Button>
                      </a>
                      <a href="/locator" className="flex-1">
                        <Button variant="outline" className="w-full py-6">{langText.findPartner}</Button>
                      </a>
                    </div>

                    {recommendation && (
                      <Button onClick={downloadPDF} variant="outline" className="w-full py-6 mb-12 border-2 border-[#1e3a8a] text-[#1e3a8a] hover:bg-blue-50">
                        <Download size={16} className="mr-2" /> {langText.dlPdf}
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}

            {step < 6 && (
              <div className="flex justify-between items-center mt-10 pt-6 border-t">
                <Button variant="ghost" onClick={prevStep} disabled={step === 1 || loading} className={step === 1 ? 'opacity-0' : 'opacity-100'}>
                  <ArrowLeft size={16} className="mr-2" /> {langText.back}
                </Button>
                
                <Button className="bg-[#1e3a8a] hover:bg-blue-800 text-white px-8" disabled={loading} onClick={step === 5 ? fetchRecommendation : nextStep}>
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