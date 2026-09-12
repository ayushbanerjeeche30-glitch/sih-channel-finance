"use client";

import React, { useState } from "react";
import { ArrowLeft, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Suggestion {
  action: string;
  newProbability: number;
}

interface CoachResult {
  schemeName: string;
  approvalProbability: number;
  reasons: string[];
  suggestions: Suggestion[];
}

export default function ApprovalCoach() {
  const [language, setLanguage] = useState("English");

  const [formData, setFormData] = useState({
    projectCost: 120000,
    familyIncome: 80000,
    category: "Scheduled Caste",
    gender: "",
    hasCoApplicant: false,
    hasExistingLoans: false,
    documentReadiness: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CoachResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    formData.gender !== "" &&
    formData.documentReadiness !== "" &&
    formData.projectCost > 0 &&
    formData.familyIncome > 0;

  const handleSubmit = async () => {
    if (!canSubmit || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/approval-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.error || "Could not analyze approval readiness right now.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while analyzing your readiness.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

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
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Approval Readiness Coach</h2>
            <p className="text-slate-500">Get an AI-estimated approval score and concrete steps to raise it — before you apply.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-8">

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Project / course cost</label>
                <input
                  type="number"
                  value={formData.projectCost || ""}
                  onChange={(e) => setFormData({ ...formData, projectCost: e.target.value === "" ? 0 : parseInt(e.target.value, 10) })}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  placeholder="₹"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Annual family income</label>
                <input
                  type="number"
                  value={formData.familyIncome || ""}
                  onChange={(e) => setFormData({ ...formData, familyIncome: e.target.value === "" ? 0 : parseInt(e.target.value, 10) })}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  placeholder="₹"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-3">Category</label>
              <div className="grid grid-cols-2 gap-3">
                {["Scheduled Caste", "Other category"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setFormData({ ...formData, category: c })}
                    className={`py-3 rounded-lg border-2 ${formData.category === c ? 'border-[#1e3a8a] bg-blue-50 font-semibold text-[#1e3a8a]' : 'border-slate-200 text-slate-600'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-3">Gender</label>
              <div className="grid grid-cols-3 gap-3">
                {["Female", "Male", "Other"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={`py-3 rounded-lg border-2 ${formData.gender === g ? 'border-[#1e3a8a] bg-blue-50 font-semibold text-[#1e3a8a]' : 'border-slate-200 text-slate-600'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-3">Document readiness</label>
              <div className="grid grid-cols-3 gap-3">
                {["Complete", "Partial", "Minimal"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setFormData({ ...formData, documentReadiness: d })}
                    className={`py-3 rounded-lg border-2 ${formData.documentReadiness === d ? 'border-[#1e3a8a] bg-blue-50 font-semibold text-[#1e3a8a]' : 'border-slate-200 text-slate-600'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                <span className="font-medium text-slate-700">Have a co-applicant</span>
                <button
                  onClick={() => setFormData({ ...formData, hasCoApplicant: !formData.hasCoApplicant })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${formData.hasCoApplicant ? 'bg-[#1e3a8a]' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${formData.hasCoApplicant ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                <span className="font-medium text-slate-700">Existing outstanding loans</span>
                <button
                  onClick={() => setFormData({ ...formData, hasExistingLoans: !formData.hasExistingLoans })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${formData.hasExistingLoans ? 'bg-[#1e3a8a]' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${formData.hasExistingLoans ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
              className="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white py-6"
            >
              {loading ? "Analyzing with AI..." : "Check my approval readiness"}
            </Button>

            {error && (
              <div className="text-center">
                <p className="text-red-500 font-medium">{error}</p>
                <Button onClick={handleSubmit} className="mt-4 bg-[#1e3a8a] text-white">
                  Try again
                </Button>
              </div>
            )}

            {result && (
              <div className="border rounded-2xl overflow-hidden animate-in fade-in duration-300">
                <div className="p-6 border-b bg-slate-50 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                      <ShieldCheck size={16} /> Best-fit scheme
                    </div>
                    <h3 className="text-2xl font-bold text-[#1e3a8a]">{result.schemeName}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-slate-500 block mb-1">Approval probability</span>
                    <span className={`text-4xl font-bold ${getScoreColor(result.approvalProbability)}`}>
                      {result.approvalProbability}%
                    </span>
                  </div>
                </div>

                <div className="p-6 border-b bg-blue-50">
                  <h4 className="font-bold text-[#1e3a8a] flex items-center gap-2 mb-3">
                    <Sparkles size={16} /> Why this score
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {result.reasons.map((reason, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-[#1e3a8a] font-bold">•</span> {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <TrendingUp size={16} className="text-green-600" /> How to improve your chances
                  </h4>
                  <div className="space-y-3">
                    {result.suggestions.map((s, i) => (
                      <div key={i} className="flex justify-between items-center p-4 border rounded-xl bg-slate-50">
                        <span className="text-sm text-slate-700 pr-4">{s.action}</span>
                        <span className="text-sm font-bold text-green-600
