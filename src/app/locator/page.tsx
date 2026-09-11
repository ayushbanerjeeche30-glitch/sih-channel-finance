"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Search, MapPin, Building2, Phone } from "lucide-react";
import { PARTNERS_DATA } from "@/data/partnersData";

const AgencyMap = dynamic(() => import("@/components/AgencyMap"), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-500 text-sm">Loading Interactive Map...</div>
});

export default function PartnerLocator() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPartnerId, setSelectedPartnerId] = useState<number | null>(null);

  const allStates = ["All", ...new Set(PARTNERS_DATA.map((partner) => partner.state))];
  const allTypes = ["All", ...new Set(PARTNERS_DATA.map((partner) => partner.type))];
  const allCategories = ["All", ...new Set(PARTNERS_DATA.map((partner) => partner.loanCategory))];

  const filteredPartners = PARTNERS_DATA.filter(partner => {
    const matchesSearch = 
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.pincode.includes(searchQuery);

    const matchesState = selectedState === "All" || partner.state === selectedState;
    const matchesType = selectedType === "All" || partner.type === selectedType;
    const matchesCategory = selectedCategory === "All" || partner.loanCategory === selectedCategory;

    return matchesSearch && matchesState && matchesType && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
     <header className="bg-white border-b px-6 py-4">
        <h1 className="font-bold text-xl text-slate-900">Channel Partner Locator</h1>
       <p className="text-xs text-slate-500 mt-0.5">Steer clear of stressed lenders. Find authorized State Channelizing Agencies and Bank branches.</p>
<p className="text-xs text-slate-400 mt-1">📍 Map pins show the branch's local area — exact street-level position may vary.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search city, district, pincode..." 
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select 
            className="border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="All">All States ({allStates.length - 1})</option>
            {allStates.filter(s => s !== "All").map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>

          <select 
            className="border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="All">All Partner Types</option>
            {allTypes.filter(t => t !== "All").map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select 
            className="border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Loan Categories</option>
            {allCategories.filter(c => c !== "All").map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row">
        <aside className="w-full md:w-[420px] bg-white border-r flex flex-col">
          <div className="p-3 border-b bg-slate-50 text-xs font-semibold text-slate-600">
            {filteredPartners.length} authorized partner(s) found
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[70vh] md:max-h-none">
            {filteredPartners.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                No matching partner nodes found for your search criteria.
              </div>
            ) : (
              filteredPartners.map(partner => (
                <div
                  key={partner.id}
                  onClick={() => setSelectedPartnerId(partner.id)}
                  className={`p-4 border rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer shadow-sm ${
                    selectedPartnerId === partner.id ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900 text-sm flex items-start gap-2">
                      <Building2 size={16} className="text-[#1e3a8a] shrink-0 mt-0.5" />
                      {partner.name}
                    </h3>
                  </div>
                  
                  <div className="ml-6 mt-2 space-y-1">
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-medium rounded text-slate-600">{partner.type}</span>
                      <span className="px-2 py-0.5 bg-blue-50 text-[10px] font-medium rounded text-blue-700">{partner.loanCategory}</span>
                    </div>
                    <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1"><MapPin size={13} className="text-slate-400"/> {partner.address} — <b>{partner.pincode}</b></p>
                    <p className="text-xs text-slate-600 flex items-center gap-1.5"><Phone size={13} className="text-slate-400"/> {partner.phone}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        <section className="flex-1 h-[50vh] md:h-auto relative">
          <AgencyMap partners={filteredPartners} selectedPartnerId={selectedPartnerId} />
        </section>
      </main>
    </div>
  );
}