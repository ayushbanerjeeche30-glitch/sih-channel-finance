"use client";

import React, { useState } from "react";
import { ArrowLeft, Building2, Search, CheckCircle2, Circle, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const t = {
  "English": { title: "Track your application", sub: "Every stage, timestamped — no more counter visits to ask for status." },
  "हिन्दी": { title: "अपने आवेदन को ट्रैक करें", sub: "हर चरण, टाइमस्टैम्प किया गया — स्थिति पूछने के लिए काउंटर पर जाने की आवश्यकता नहीं।" },
  "मराठी": { title: "तुमचा अर्ज ट्रॅक करा", sub: "प्रत्येक टप्पा, टाइमस्टॅम्प केलेले." },
  "বাংলা": { title: "আপনার আবেদন ট্র্যাক করুন", sub: "প্রতিটি পর্যায়, টাইমস্ট্যাম্প করা।" },
  "தமிழ்": { title: "உங்கள் விண்ணப்பத்தைக் கண்காணிக்கவும்", sub: "ஒவ்வொரு கட்டமும், நேர முத்திரையிடப்பட்டது." }
};

const stages = ["Submitted", "Under review", "Approved", "Disbursed"];

export default function TrackApplication() {
  const [language, setLanguage] = useState("English");
  const [appId, setAppId] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [app, setApp] = useState<any>(null);

  const [showGrievanceForm, setShowGrievanceForm] = useState(false);
  const [grievanceMessage, setGrievanceMessage] = useState("");
  const [grievanceSubmitting, setGrievanceSubmitting] = useState(false);
  const [grievanceResult, setGrievanceResult] = useState<{ success: boolean; message: string } | null>(null);

  const langText = t[language as keyof typeof t] || t["English"];

  const handleSearch = async () => {
    setError("");
    setApp(null);
    setGrievanceResult(null);
    setShowGrievanceForm(false);

    if (!appId.trim() || !phone.trim()) {
      setError("Please enter both your Application ID and registered mobile number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/applications?id=${encodeURIComponent(appId.trim())}&phone=${encodeURIComponent(phone.trim())}`
      );
      const result = await res.json();

      if (result.success) {
        setApp(result.data);
      } else {
        setError(result.message || "No matching application found.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGrievanceSubmit = async () => {
    if (!grievanceMessage.trim()) return;
    setGrievanceSubmitting(true);
    setGrievanceResult(null);

    try {
      const res = await fetch('/api/grievance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: appId.trim(),
          applicant_phone: phone.trim(),
          message: grievanceMessage.trim(),
        }),
      });
      const result = await res.json();
      setGrievanceResult({ success: result.success, message: result.message });
      if (result.success) {
        setGrievanceMessage("");
        setShowGrievanceForm(false);
        // Refresh the application to show updated escalation level
        handleSearch();
      }
    } catch (err) {
      setGrievanceResult({ success: false, message: "Something went wrong. Please try again." });
    } finally {
      setGrievanceSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Submitted": return <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">Submitted</span>;
      case "Under review": return <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">Under review</span>;
      case "Approved": return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Approved</span>;
      case "Disbursed": return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Disbursed</span>;
      default: return null;
    }
  };

  const getEscalationBadge = (level: string) => {
    if (!level || level === "Normal") return null;
    const isCritical = level.includes("Level 2");
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${isCritical ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
        <AlertTriangle size={12} /> {level}
      </span>
    );
  };

  const currentStageIndex = app ? stages.indexOf(app.status) : -1;

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
        <div className="flex gap-4">
          <a href="/scheme-finder">
            <Button className="bg-[#1e3a8a] hover:bg-blue-800 text-white rounded-full px-6">Find my scheme</Button>
          </a>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 md:px-8 max-w-2xl mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">{langText.title}</h2>
          <p className="text-slate-500">{langText.sub}</p>
        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm mb-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Application ID</label>
            <input
              type="text"
              placeholder="e.g. SS-2026-483920"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              className="w-full p-3 border-2 rounded-xl text-sm focus:outline-none focus:border-[#1e3a8a]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Registered Mobile Number</label>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border-2 rounded-xl text-sm focus:outline-none focus:border-[#1e3a8a]"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white rounded-xl py-6"
          >
            <Search size={18} className="mr-2" />
            {loading ? "Searching..." : "Check Status"}
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {app && (
          <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <div className="text-xs text-slate-500 font-semibold tracking-wider mb-1">REFERENCE</div>
                <div className="text-xl font-bold text-[#1e3a8a] mb-1">{app.application_id}</div>
                <div className="font-semibold text-slate-900">{app.applicant_name}</div>
                {app.scheme && <div className="text-sm text-slate-500">{app.scheme}</div>}
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                {getStatusBadge(app.status)}
                {getEscalationBadge(app.escalation_level)}
                {app.amount && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">₹ {app.amount.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-slate-500">Sanctioned amount</div>
                  </div>
                )}
              </div>
            </div>

            <div className="relative flex justify-between items-start mb-6">
              <div className="absolute top-3 left-6 right-6 h-0.5 bg-slate-200 -z-10"></div>
              {stages.map((stage, index) => {
                const isCompleted = index < currentStageIndex;
                const isCurrent = index === currentStageIndex;

                return (
                  <div key={stage} className="flex flex-col items-center flex-1 bg-white relative">
                    <div className="bg-white px-2 mb-2">
                      {isCompleted || (isCurrent && stage === "Disbursed") ? (
                        <CheckCircle2 size={24} className="text-green-500 bg-white" fill="currentColor" color="white" />
                      ) : isCurrent ? (
                        <Clock size={24} className={stage === "Under review" ? "text-orange-500" : "text-blue-500"} />
                      ) : (
                        <Circle size={24} className="text-slate-300" />
                      )}
                    </div>
                    {index > 0 && (isCompleted || isCurrent) && (
                      <div className="absolute top-3 right-[50%] w-full h-0.5 bg-green-500 -z-10"></div>
                    )}
                    <span className={`text-sm font-semibold text-center mb-1 ${isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>

            {app.partner_name && (
              <div className="pt-4 border-t flex items-center gap-2 text-sm text-slate-600 mb-4">
                <Building2 size={16} className="text-slate-400" />
                <span>Channel Partner: <strong>{app.partner_name}</strong></span>
              </div>
            )}

            {/* Grievance section */}
            <div className="pt-4 border-t">
              {!showGrievanceForm ? (
                <button
                  onClick={() => setShowGrievanceForm(true)}
                  className="text-sm text-red-600 font-semibold hover:underline flex items-center gap-1.5"
                >
                  <AlertTriangle size={14} /> Facing a delay or issue? Raise a grievance
                </button>
              ) : (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700 block">Describe your issue</label>
                  <textarea
                    value={grievanceMessage}
                    onChange={(e) => setGrievanceMessage(e.target.value)}
                    placeholder="e.g. My application has been under review for over 3 weeks with no update."
                    className="w-full p-3 border-2 rounded-xl text-sm focus:outline-none focus:border-red-500 min-h-[80px]"
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={handleGrievanceSubmit}
                      disabled={grievanceSubmitting || !grievanceMessage.trim()}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {grievanceSubmitting ? "Submitting..." : "Submit Grievance"}
                    </Button>
                    <Button variant="ghost" onClick={() => setShowGrievanceForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {grievanceResult && (
                <p className={`text-sm mt-3 ${grievanceResult.success ? "text-green-600" : "text-red-500"}`}>
                  {grievanceResult.message}
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}