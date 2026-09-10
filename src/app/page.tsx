"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, MapPin, Building2, 
  CheckCircle2, Sparkles, TrendingUp, Users, Leaf,
  Briefcase, GraduationCap 
} from "lucide-react";

const translations = {
  "English": {
    heroTitle: "Concessional credit for every eligible SC family — without the guesswork",
    heroSub: "Find the right scheme, understand the exact cost of your loan, and reach a healthy Channel Partner near you. One guided journey, five languages, zero paperwork to begin.",
    findScheme: "Find my scheme",
    calcEmi: "Calculate my EMI",
    locatePartner: "Locate a partner",
    badge: "Aligned with NBCFDC channel-partner lending",
    incomeText: "Family income up to ₹5,00,000 · Interest from 4% to 15% p.a.",
    stepsTitle: "Three steps from confusion to credit",
    step1Title: "Answer 5 questions",
    step1Desc: "Tell us your project, its cost and your family income. Rule-based logic maps you to the right scheme tier.",
    step2Title: "See the real cost",
    step2Desc: "Scheme-specific interest, moratorium and a year-by-year amortisation schedule — before you apply.",
    step3Title: "Reach a healthy partner",
    step3Desc: "Compare SCAs, public sector banks, RRBs and NBFC-MFIs by fund health and processing time near you.",
    windowsTitle: "The four concessional windows",
    windowsSub: "Every rupee is routed through a Channel Partner, not a direct government loan.",
    
    microName: "Micro Finance Scheme",
    microDesc: "Small-ticket credit routed through Channel Partners for petty trade, services and self-employment.",
    mahilaName: "Mahila Samriddhi Yojana",
    mahilaDesc: "Women-focused micro-credit at the most concessional rate, with priority processing through SCAs and NBFC-MFIs.",
    termName: "Term Loan Scheme",
    termDesc: "Larger project finance for enterprises, transport, agriculture allied units and housing-linked livelihoods.",
    eduName: "Educational Loan Scheme",
    eduDesc: "Covers tuition, hostel, books, equipment and travel for professional and technical courses in India and abroad.",

    projUpTo: "Projects up to",
    interest: "Interest",
    coverage: "Coverage",
    moratorium: "Moratorium",
    open: "Open",
    browse: "Browse",

    explore: "Explore",
    resources: "Resources",
    footerDesc: "Channel Finance System for SC Beneficiaries. Demonstration prototype built for Smart India Hackathon. Not an official government portal."
  },
  "हिन्दी": {
    heroTitle: "हर पात्र एससी परिवार के लिए रियायती ऋण — बिना किसी अनुमान के",
    heroSub: "सही योजना खोजें, अपने ऋण की सटीक लागत समझें, और अपने पास एक स्वस्थ चैनल पार्टनर तक पहुंचें। एक निर्देशित यात्रा, पांच भाषाएं, शुरू करने के लिए कोई कागजी कार्रवाई नहीं।",
    findScheme: "मेरी योजना खोजें",
    calcEmi: "अपनी ईएमआई की गणना करें",
    locatePartner: "पार्टनर खोजें",
    badge: "NBCFDC चैनल-पार्टनर ऋण के साथ संरेखित",
    incomeText: "पारिवारिक आय ₹5,00,000 तक · 4% से 15% प्रति वर्ष ब्याज",
    stepsTitle: "भ्रम से ऋण तक तीन चरण",
    step1Title: "5 प्रश्नों के उत्तर दें",
    step1Desc: "हमें अपना प्रोजेक्ट, उसकी लागत और पारिवारिक आय बताएं। नियम-आधारित तर्क आपको सही योजना तक पहुँचाता है।",
    step2Title: "वास्तविक लागत देखें",
    step2Desc: "आवेदन करने से पहले योजना-विशिष्ट ब्याज, मोरेटोरियम और वर्ष-दर-वर्ष परिशोधन अनुसूची देखें।",
    step3Title: "एक स्वस्थ पार्टनर तक पहुँचें",
    step3Desc: "फंड स्वास्थ्य और प्रोसेसिंग समय के आधार पर SCA, सार्वजनिक क्षेत्र के बैंकों, RRB और NBFC-MFI की तुलना करें।",
    windowsTitle: "चार रियायती विंडो",
    windowsSub: "हर रुपया प्रत्यक्ष सरकारी ऋण के माध्यम से नहीं, बल्कि चैनल पार्टनर के माध्यम से प्रवाहित होता है।",
    
    microName: "माइक्रो फाइनेंस योजना",
    microDesc: "खुदरा व्यापार, सेवाओं और स्व-रोज़गार के लिए चैनल पार्टनर के माध्यम से छोटे टिकट का ऋण।",
    mahilaName: "महिला समृद्धि योजना",
    mahilaDesc: "SCA और NBFC-MFI के माध्यम से प्राथमिकता के साथ महिलाओं पर केंद्रित सूक्ष्म-ऋण।",
    termName: "टर्म लोन योजना",
    termDesc: "उद्यमों, परिवहन, कृषि और आवास-संबद्ध आजीविका के लिए बड़ी परियोजना वित्तपोषण।",
    eduName: "शैक्षणिक ऋण योजना",
    eduDesc: "भारत और विदेशों में पेशेवर और तकनीकी पाठ्यक्रमों के लिए ट्यूशन, हॉस्टल, किताबें और यात्रा शामिल हैं।",

    projUpTo: "परियोजनाएं",
    interest: "ब्याज",
    coverage: "कवर",
    moratorium: "मोरेटोरियम",
    open: "खोलें",
    browse: "ब्राउज़ करें",

    explore: "अन्वेषण करें",
    resources: "संसाधन",
    footerDesc: "एससी लाभार्थियों के लिए चैनल फाइनेंस सिस्टम। स्मार्ट इंडिया हैकथॉन के लिए निर्मित प्रोटोटाइप। आधिकारिक सरकारी पोर्टल नहीं है।"
  },
  "मराठी": {
    heroTitle: "प्रत्येक पात्र SC कुटुंबासाठी सवलतीचे कर्ज — कोणत्याही अंदाजाशिवाय",
    heroSub: "योग्य योजना शोधा, तुमच्या कर्जाची अचूक किंमत समजून घ्या आणि जवळच्या निरोगी चॅनेल भागीदारापर्यंत पोहोचा. एक मार्गदर्शित प्रवास, पाच भाषा, सुरू करण्यासाठी कोणतीही कागदपत्रे नाहीत.",
    findScheme: "माझी योजना शोधा",
    calcEmi: "माझ्या ईएमआयची गणना करा",
    locatePartner: "भागीदार शोधा",
    badge: "NBCFDC चॅनेल-पार्टनर कर्जाशी सुसंगत",
    incomeText: "कौटुंबिक उत्पन्न ₹५,00,000 पर्यंत · व्याज ४% ते १५% दरवर्षी",
    stepsTitle: "संभ्रमातून कर्जापर्यंत तीन टप्पे",
    step1Title: "५ प्रश्नांची उत्तरे द्या",
    step1Desc: "आम्हाला तुमचा प्रकल्प, त्याची किंमत आणि कौटुंबिक उत्पन्न सांगा. नियम-आधारित तर्क तुम्हाला योग्य योजनेशी जोडतो.",
    step2Title: "वास्तविक किंमत पहा",
    step2Desc: "अर्ज करण्यापूर्वी योजना-विशिष्ट व्याज, स्थगिती आणि वर्ष-दर-वर्ष परिशोधन अनुसूची पहा.",
    step3Title: "निरोगी भागीदारापर्यंत पोहोचा",
    step3Desc: "फंड आरोग्य आणि प्रक्रिया वेळेनुसार SCA, सार्वजनिक बँका, RRB आणि NBFC-MFI ची तुलना करा.",
    windowsTitle: "चार सवलतीचे खिडकी मार्ग",
    windowsSub: "प्रत्येक रुपया थेट सरकारी कर्जाद्वारे नाही, तर चॅनेल पार्टनरद्वारे प्रवाहित केला जातो.",
    
    microName: "सूक्ष्म वित्त योजना",
    microDesc: "किरकोळ व्यापार आणि स्व-रोजगारासाठी चॅनेल पार्टनरद्वारे छोटे कर्ज.",
    mahilaName: "महिला समृद्धी योजना",
    mahilaDesc: "महिला-केंद्रित सूक्ष्म-कर्ज, SCA आणि NBFC-MFI द्वारे प्राधान्याने प्रक्रिया.",
    termName: "मुदत कर्ज योजना",
    termDesc: "उद्योग, वाहतूक आणि शेतीसाठी मोठ्या प्रकल्पाचे वित्तपोषण.",
    eduName: "शैक्षणिक कर्ज योजना",
    eduDesc: "भारत आणि परदेशातील व्यावसायिक आणि तांत्रिक अभ्यासक्रमांसाठी शिक्षण शुल्क, वस्तीगृह, पुस्तके कव्हर करते.",

    projUpTo: "प्रकल्प",
    interest: "व्याज",
    coverage: "कव्हरेज",
    moratorium: "स्थगिती",
    open: "उघडा",
    browse: "ब्राउझ करा",

    explore: "एक्सप्लोर करा",
    resources: "संसाधने",
    footerDesc: "SC लाभार्थ्यांसाठी चॅनेल फायनान्स सिस्टम. स्मार्ट इंडिया हॅकाथॉनसाठी तयार केलेले प्रोटोटाइप."
  },
  "বাংলা": {
    heroTitle: "প্রতিটি যোগ্য এসসি পরিবারের জন্য রেয়াতি ঋণ — কোনো অনুমান ছাড়াই",
    heroSub: "সঠিক স্কিম খুঁজুন, আপনার ঋণের সঠিক খরচ বুঝুন এবং আপনার কাছাকাছি একটি স্বাস্থ্যকর চ্যানেল পার্টনারের কাছে পৌঁছান। একটি নির্দেশিত যাত্রা, পাঁচটি ভাষা, শুরু করার জন্য শূন্য কাগজপত্র।",
    findScheme: "আমার স্কিম খুঁজুন",
    calcEmi: "আমার ইএমআই গণনা করুন",
    locatePartner: "একটি অংশীদার সনাক্ত করুন",
    badge: "NBCFDC চ্যানেল-পার্টনার ঋণের সাথে সারিবদ্ধ",
    incomeText: "পারিবারিক আয় ₹৫,০০,০০০ পর্যন্ত · সুদের হার ৪% থেকে ১৫% বার্ষিক",
    stepsTitle: "বিভ্রান্তি থেকে ঋণের তিনটি ধাপ",
    step1Title: "৫টি প্রশ্নের উত্তর দিন",
    step1Desc: "আমাদের আপনার প্রকল্প, এর খরচ এবং আপনার পারিবারিক আয় বলুন। নিয়ম-ভিত্তিক লজিক আপনাকে সঠিক স্কিমের সাথে যুক্ত করে।",
    step2Title: "প্রকৃত খরচ দেখুন",
    step2Desc: "আবেদন করার আগে স্কিম-নির্দিষ্ট সুদ, স্থগিতাদেশ এবং বছরওয়ারী পরিশোধের সময়সূচী দেখুন।",
    step3Title: "একটি সুস্থ অংশীদারের কাছে পৌঁছান",
    step3Desc: "তহবিলের স্বাস্থ্য এবং প্রক্রিয়াকরণের সময় দ্বারা SCA, পাবলিক সেক্টর ব্যাংক, RRB এবং NBFC-MFI তুলনা করুন।",
    windowsTitle: "চারটি রেয়াতি জানালা",
    windowsSub: "প্রতিটি টাকা সরাসরি সরকারি ঋণের মাধ্যমে নয়, চ্যানেল পার্টনারের মাধ্যমে প্রবাহিত হয়.",
    
    microName: "মাইক্রো ফাইন্যান্স স্কিম",
    microDesc: "খুচরা ব্যবসা এবং স্ব-কর্মসংস্থানের জন্য চ্যানেল পার্টনারদের মাধ্যমে ছোট ঋণ।",
    mahilaName: "মহিলা সমৃদ্ধি যোজনা",
    mahilaDesc: "মহিলা-কেন্দ্রিক ক্ষুদ্রঋণ, SCA এবং NBFC-MFI এর মাধ্যমে অগ্রাধিকার ভিত্তিতে প্রক্রিয়াকরণ।",
    termName: "মেয়াদী ঋণ স্কিম",
    termDesc: "এন্টারপ্রাইজ, পরিবহন এবং কৃষির জন্য বৃহত্তর প্রকল্প অর্থায়ন।",
    eduName: "শিক্ষা ঋণ স্কিম",
    eduDesc: "ভারত এবং বিদেশে পেশাদার এবং প্রযুক্তিগত কোর্সের জন্য টিউশন, হোস্টেল, বই এবং ভ্রমণ কভার করে।",

    projUpTo: "প্রকল্প",
    interest: "সুদ",
    coverage: "কভারেজ",
    moratorium: "স্থগিতাদেশ",
    open: "খুলুন",
    browse: "ব্রাউজ করুন",

    explore: "অন্বেষণ করুন",
    resources: "সম্পদ",
    footerDesc: "এসসি সুবিধাভোগীদের জন্য চ্যানেল ফাইন্যান্স সিস্টেম। স্মার্ট ইন্ডিয়া হ্যাকাথনের জন্য তৈরি প্রোটোটाइপ।"
  },
  "தமிழ்": {
    heroTitle: "ஒவ்வொரு தகுதியான SC குடும்பத்திற்கும் சலுகை கடன் — எந்த யூகமும் இல்லாமல்",
    heroSub: "சரியான திட்டத்தைக் கண்டறியவும், உங்கள் கடனின் சரியான விலையைப் புரிந்து கொள்ளவும், உங்களுக்கு அருகிலுள்ள நம்பகமான கூட்டாளரை அணுகவும். ஒரு வழிகாட்டப்பட்ட பயணம், ஐந்து மொழிகள், தொடங்க காகித வேலைகள் இல்லை.",
    findScheme: "என் திட்டத்தை கண்டுபிடி",
    calcEmi: "எனது EMI ஐ கணக்கிடுங்கள்",
    locatePartner: "கூட்டாளரைக் கண்டறியவும்",
    badge: "NBCFDC சேனல்-பார்ட்னர் கடனுடன் இணைக்கப்பட்டுள்ளது",
    incomeText: "குடும்ப வருமானம் ₹5,00,000 வரை · வட்டி விகிதம் 4% முதல் 15% வரை",
    stepsTitle: "குழப்பத்திலிருந்து கடன் வரை மூன்று படிகள்",
    step1Title: "5 கேள்விகளுக்கு பதிலளிக்கவும்",
    step1Desc: "உங்கள் திட்டம், அதன் செலவு மற்றும் உங்கள் குடும்ப வருமானத்தை எங்களிடம் கூறவும். விதி அடிப்படையிலான தர்க்கம் உங்களை சரியான திட்டத்திற்கு அழைத்துச் செல்லும்.",
    step2Title: "உண்மையான செலவைக் காண்க",
    step2Desc: "விண்ணப்பிப்பதற்கு முன், திட்டம் சார்ந்த வட்டி, தள்ளிவைப்பு மற்றும் ஆண்டு வாரியான திருப்பிச் செலுத்தும் அட்டவணையைப் பார்க்கவும்.",
    step3Title: "நம்பகமான கூட்டாளரை அணுகவும்",
    step3Desc: "நிதி ஆரோக்கியம் மற்றும் செயலாக்க நேரத்தின் மூலம் SCA கள், பொதுத்துறை வங்கிகள், RRB கள் மற்றும் NBFC-MFI களை ஒப்பிடுக.",
    windowsTitle: "நான்கு சலுகை சாளரங்கள்",
    windowsSub: "ஒவ்வொரு ரூபாயும் நேரடி அரசாங்கக் கடன் மூலம் அல்லாமல், சேனல் கூட்டாளர் மூலம் செலுத்தப்படுகிறது.",
    
    microName: "நுண்கடன் திட்டம்",
    microDesc: "சிறு வணிகம் மற்றும் சுயதொழிலுக்காக சேனல் கூட்டாளர்கள் மூலம் சிறு கடன் வழங்கப்படுகிறது.",
    mahilaName: "மகளிர் சிருத்தி யோஜனா",
    mahilaDesc: "பெண்களை மையமாகக் கொண்ட நுண்கடன், SCA மற்றும் NBFC-MFI மூலம் முன்னுரிமை செயலாக்கம்.",
    termName: "கால கடன் திட்டம்",
    termDesc: "நிறுவனங்கள், போக்குவரத்து மற்றும் விவசாயத்திற்கான பெரிய திட்ட நிதி.",
    eduName: "கல்விக் கடன் திட்டம்",
    eduDesc: "இந்தியா மற்றும் வெளிநாடுகளில் உள்ள கல்வி மற்றும் தொழில்நுட்ப படிப்புகளுக்கான கட்டணம், விடுதி, புத்தகங்களை உள்ளடக்கியது.",

    projUpTo: "திட்டங்கள்",
    interest: "வட்டி",
    coverage: "கவரேஜ்",
    moratorium: "தள்ளிவைப்பு",
    open: "திற",
    browse: "உலாவு",

    explore: "ஆராய்க",
    resources: "வளங்கள்",
    footerDesc: "SC பயனாளிகளுக்கான சேனல் நிதி அமைப்பு. ஸ்மார்ட் இந்தியா ஹேக்கத்தான் முன்மாதிரி."
  }
};

const slideImages = [
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb9?auto=format&fit=crop&w=1600&q=80"
];

export default function Home() {
  const [language, setLanguage] = useState("English");
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = translations[language as keyof typeof translations] || translations["English"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen font-sans text-slate-900 bg-slate-50/50">
      {/* Top Government Bar */}
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

      {/* Navbar with Indian Emblem */}
      <nav className="bg-white py-4 px-4 md:px-8 flex justify-between items-center border-b sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center p-1 mr-1">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
              alt="State Emblem of India" 
              className="h-10 w-auto opacity-90"
            />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight text-xl">SamruddhiSetu</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider hidden sm:block">Channel Finance System for SC Beneficiaries</p>
          </div>
        </div>
        
        <div className="hidden lg:flex gap-6 text-sm font-medium text-slate-600">
          <a href="/" className="text-slate-900 font-semibold border-b-2 border-[#1e3a8a] pb-1">Home</a>
          <a href="/scheme-finder" className="hover:text-[#1e3a8a] transition-colors">Scheme Finder</a>
          <a href="/calculator" className="hover:text-[#1e3a8a] transition-colors">EMI Calculator</a>
          <a href="/locator" className="hover:text-[#1e3a8a] transition-colors">Partner Locator</a>
          <a href="/track" className="hover:text-[#1e3a8a] transition-colors">Track Application</a>
          <a href="/impact" className="hover:text-[#1e3a8a] transition-colors">Impact</a>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex relative">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none bg-white border border-slate-300 text-slate-700 py-2 pl-10 pr-8 rounded-full text-sm font-medium focus:outline-none cursor-pointer"
            >
              <option value="English">English</option>
              <option value="हिन्दी">हिन्दी</option>
              <option value="मराठी">मराठी</option>
              <option value="বাংলা">বাংলা</option>
              <option value="தமிழ்">தமிழ்</option>
            </select>
            <span className="absolute left-3 top-2.5">🌐</span>
          </div>
          <a href="/scheme-finder">
            <Button className="bg-[#1e3a8a] hover:bg-blue-800 text-white rounded-full px-6">
              {t.findScheme}
            </Button>
          </a>
        </div>
      </nav>

      {/* Hero Section with Automated Slideshow Background */}
      <main className="relative text-white py-16 px-4 md:px-8 overflow-hidden">
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

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-semibold border border-orange-500/30 backdrop-blur-sm">
              <Sparkles size={14} /> {t.badge}
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-md">
              {t.heroTitle}
            </h2>
            <p className="text-blue-100 text-lg max-w-lg leading-relaxed drop-shadow">
              {t.heroSub}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a href="/scheme-finder">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-6 rounded-md shadow-lg">
                  {t.findScheme} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <a href="/calculator">
                <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 font-semibold px-6 py-6 rounded-md backdrop-blur-sm">
                  {t.calcEmi}
                </Button>
              </a>
              <a href="/locator">
                <Button variant="ghost" className="text-white hover:bg-white/10 font-semibold px-6 py-6 rounded-md">
                  {t.locatePartner}
                </Button>
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-200 pt-2">
              <CheckCircle2 size={16} />
              <span>{t.incomeText}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/60 border border-white/10 p-6 rounded-xl space-y-4 backdrop-blur-md shadow-xl">
              <Building2 className="text-orange-400" size={24} />
              <div>
                <p className="text-3xl font-bold">38</p>
                <p className="text-sm text-blue-200">Channel Partners mapped</p>
              </div>
            </div>
            <div className="bg-slate-900/60 border border-white/10 p-6 rounded-xl space-y-4 backdrop-blur-md shadow-xl">
              <TrendingUp className="text-orange-400" size={24} />
              <div>
                <p className="text-3xl font-bold">4% - 15%</p>
                <p className="text-sm text-blue-200">Concessional interest band</p>
              </div>
            </div>
            <div className="bg-slate-900/60 border border-white/10 p-6 rounded-xl space-y-4 backdrop-blur-md shadow-xl">
              <MapPin className="text-orange-400" size={24} />
              <div>
                <p className="text-3xl font-bold">18</p>
                <p className="text-sm text-blue-200">States & UTs covered</p>
              </div>
            </div>
            <div className="bg-slate-900/60 border border-white/10 p-6 rounded-xl space-y-4 backdrop-blur-md shadow-xl">
              <Users className="text-orange-400" size={24} />
              <div>
                <p className="text-3xl font-bold">₹5 Lakh</p>
                <p className="text-sm text-blue-200">Income eligibility ceiling</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3 Steps section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold mb-10 text-center">{t.stepsTitle}</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border shadow-sm">
            <span className="text-4xl font-bold text-slate-300 block mb-4">01</span>
            <h4 className="font-bold text-lg mb-2">{t.step1Title}</h4>
            <p className="text-slate-600 text-sm mb-6">{t.step1Desc}</p>
            <a href="/scheme-finder" className="text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 hover:underline">{t.open} <ArrowRight size={14}/></a>
          </div>
          <div className="bg-white p-8 rounded-2xl border shadow-sm">
            <span className="text-4xl font-bold text-slate-300 block mb-4">02</span>
            <h4 className="font-bold text-lg mb-2">{t.step2Title}</h4>
            <p className="text-slate-600 text-sm mb-6">{t.step2Desc}</p>
            <a href="/calculator" className="text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 hover:underline">{t.open} <ArrowRight size={14}/></a>
          </div>
          <div className="bg-white p-8 rounded-2xl border shadow-sm">
            <span className="text-4xl font-bold text-slate-300 block mb-4">03</span>
            <h4 className="font-bold text-lg mb-2">{t.step3Title}</h4>
            <p className="text-slate-600 text-sm mb-6">{t.step3Desc}</p>
            <a href="/locator" className="text-[#1e3a8a] font-semibold text-sm flex items-center gap-1 hover:underline">{t.open} <ArrowRight size={14}/></a>
          </div>
        </div>
      </section>

      {/* The four concessional windows */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <h3 className="text-3xl font-bold mb-2">{t.windowsTitle}</h3>
        <p className="text-slate-500 mb-10">{t.windowsSub}</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center text-[#1e3a8a] mb-4">
              <Leaf size={24} />
            </div>
            <h4 className="font-bold text-lg mb-2">{t.microName}</h4>
            <p className="text-slate-600 text-sm mb-6 flex-grow">{t.microDesc}</p>
            <div className="space-y-3 text-sm border-t pt-4 mb-6">
              <div className="flex justify-between border-b pb-2"><span className="text-slate-500">{t.projUpTo}</span><span className="font-bold">₹1,40,000</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-slate-500">{t.interest}</span><span className="font-bold">5.5% - 6.5%</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-slate-500">{t.coverage}</span><span className="font-bold">90%</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{t.moratorium}</span><span className="font-bold">3 months</span></div>
            </div>
            <a href="/scheme-finder"><Button variant="outline" className="w-full">{t.browse}</Button></a>
          </div>

          <div className="bg-white rounded-2xl border p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="bg-pink-50 w-12 h-12 rounded-full flex items-center justify-center text-pink-600 mb-4">
              <Users size={24} />
            </div>
            <h4 className="font-bold text-lg mb-2">{t.mahilaName}</h4>
            <p className="text-slate-600 text-sm mb-6 flex-grow">{t.mahilaDesc}</p>
            <div className="space-y-3 text-sm border-t pt-4 mb-6">
              <div className="flex justify-between border-b pb-2"><span className="text-slate-500">{t.projUpTo}</span><span className="font-bold">₹1,40,000</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-slate-500">{t.interest}</span><span className="font-bold">4% - 5%</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-slate-500">{t.coverage}</span><span className="font-bold">90%</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{t.moratorium}</span><span className="font-bold">3 months</span></div>
            </div>
            <a href="/scheme-finder"><Button variant="outline" className="w-full">{t.browse}</Button></a>
          </div>

          <div className="bg-white rounded-2xl border p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center text-orange-600 mb-4">
              <Briefcase size={24} />
            </div>
            <h4 className="font-bold text-lg mb-2">{t.termName}</h4>
            <p className="text-slate-600 text-sm mb-6 flex-grow">{t.termDesc}</p>
            <div className="space-y-3 text-sm border-t pt-4 mb-6">
              <div className="flex justify-between border-b pb-2"><span className="text-slate-500">{t.projUpTo}</span><span className="font-bold">₹50,00,000</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-slate-500">{t.interest}</span><span className="font-bold">8.5% - 12%</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-slate-500">{t.coverage}</span><span className="font-bold">80%</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{t.moratorium}</span><span className="font-bold">6 months</span></div>
            </div>
            <a href="/scheme-finder"><Button variant="outline" className="w-full">{t.browse}</Button></a>
          </div>

          <div className="bg-white rounded-2xl border p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="bg-purple-50 w-12 h-12 rounded-full flex items-center justify-center text-purple-600 mb-4">
              <GraduationCap size={24} />
            </div>
            <h4 className="font-bold text-lg mb-2">{t.eduName}</h4>
            <p className="text-slate-600 text-sm mb-6 flex-grow">{t.eduDesc}</p>
            <div className="space-y-3 text-sm border-t pt-4 mb-6">
              <div className="flex justify-between border-b pb-2"><span className="text-slate-500">{t.projUpTo}</span><span className="font-bold">₹30,00,000</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-slate-500">{t.interest}</span><span className="font-bold">4.5% - 6.5%</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-slate-500">{t.coverage}</span><span className="font-bold">90%</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{t.moratorium}</span><span className="font-bold">12 months</span></div>
            </div>
            <a href="/scheme-finder"><Button variant="outline" className="w-full">{t.browse}</Button></a>
          </div>
        </div>
      </section>

      {/* Footer with Emblem */}
      <footer className="bg-white border-t pt-16 pb-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
                alt="State Emblem of India" 
                className="h-12 w-auto opacity-90"
              />
              <h4 className="font-bold text-xl text-slate-900">SamruddhiSetu</h4>
            </div>
            <p className="text-sm text-slate-500 mb-4">{t.footerDesc}</p>
          </div>
          <div>
            <h5 className="font-bold mb-4 text-slate-900">{t.explore}</h5>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="/scheme-finder" className="hover:text-blue-600">Scheme Finder</a></li>
              <li><a href="/calculator" className="hover:text-blue-600">EMI Calculator</a></li>
              <li><a href="/locator" className="hover:text-blue-600">Partner Locator</a></li>
              <li><a href="/track" className="hover:text-blue-600">Track Application</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4 text-slate-900">{t.resources}</h5>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="/impact" className="hover:text-blue-600">Impact</a></li>
              <li><a href="/scheme-finder" className="hover:text-blue-600">{t.microName}</a></li>
              <li><a href="/calculator" className="hover:text-blue-600">{t.termName}</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t pt-8 text-center text-sm text-slate-400">
          © 2026 SamruddhiSetu Prototype
        </div>
      </footer>
    </div>
  );
}