"use client";

import { useState, useEffect } from "react";
import { getClaims } from "@/lib/storage";
import { ClaimData } from "@/types/claim";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit2, LayoutDashboard, ShieldCheck, Database, ListTodo, PlusCircle } from "lucide-react";
import { ClaimForm } from "@/components/ClaimForm";
import { Modal } from "@/components/Modal";
import Link from "next/link";

import { seedDatabase } from "@/lib/storage";
import { seedData } from "@/lib/seedData";

export default function Home() {
  const [activeView, setActiveView] = useState<"form" | "claims">("form");
  const [editClaim, setEditClaim] = useState<ClaimData | null>(null);
  const [claims, setClaims] = useState<ClaimData[]>([]);

  const refreshClaims = () => {
    setClaims(getClaims());
  };

  useEffect(() => {
    refreshClaims();
  }, []);

  const handleEdit = (claim: ClaimData) => {
    setEditClaim(claim);
  };

  const closeEditModal = () => {
    setEditClaim(null);
  };

  const handleEditSuccess = () => {
    refreshClaims();
    closeEditModal();
  };

  const handleSeedData = () => {
    seedDatabase(seedData);
    refreshClaims();
    alert("Seed data successfully injected!");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-24 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Premium Glassmorphism Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-[1600px] w-full mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-800 tracking-tight leading-tight">Insight<span className="text-indigo-600">Dash</span></h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Entry Portal</p>
            </div>
          </div>

          <div className="flex flex-1 justify-center max-md:hidden">
            <div className="bg-slate-100/50 p-1 rounded-xl border border-slate-200/50 flex gap-1 shadow-inner">
              <button
                onClick={() => setActiveView("form")}
                className={`flex items-center gap-2 px-5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeView === "form" 
                    ? "bg-white text-indigo-600 shadow-sm border border-slate-200/60" 
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
                }`}
              >
                <PlusCircle className="w-4 h-4" /> New Claim
              </button>
              <button
                onClick={() => setActiveView("claims")}
                className={`flex items-center gap-2 px-5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeView === "claims" 
                    ? "bg-white text-indigo-600 shadow-sm border border-slate-200/60" 
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
                }`}
              >
                <ListTodo className="w-4 h-4" /> Directory ({claims.length})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleSeedData} variant="outline" size="sm" className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all h-9 rounded-lg font-semibold shadow-sm">
              <Database className="w-4 h-4 mr-2" /> Seed Data
            </Button>
            <div className="h-4 w-px bg-slate-200 mx-1"></div>
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg font-semibold">
                <LayoutDashboard className="w-4 h-4 mr-2" /> Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* VIEW: FORM */}
        {activeView === "form" && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Claim Entry Portal</h2>
              <p className="text-slate-500 font-medium text-lg">Input new insurance claims securely into the system.</p>
            </div>

            <ClaimForm onSuccess={refreshClaims} />
          </div>
        )}

        {/* VIEW: MY CLAIMS */}
        {activeView === "claims" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <ListTodo className="w-32 h-32 text-indigo-500" />
              </div>
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Submitted Claims</h3>
                  <p className="text-slate-500 font-medium text-sm mt-1">Review and manage your local records</p>
                </div>
              </div>
              
              <div className="relative z-10 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-slate-100 hover:bg-transparent">
                      <TableHead className="font-semibold text-slate-400 uppercase text-xs tracking-wider py-4">Company Details</TableHead>
                      <TableHead className="font-semibold text-slate-400 uppercase text-xs tracking-wider py-4">Reporting Date</TableHead>
                      <TableHead className="font-semibold text-slate-400 uppercase text-xs tracking-wider py-4 text-right">Motor (Rec/App)</TableHead>
                      <TableHead className="font-semibold text-slate-400 uppercase text-xs tracking-wider py-4 text-right">Property (Rec/App)</TableHead>
                      <TableHead className="font-semibold text-slate-400 uppercase text-xs tracking-wider py-4 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {claims.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-16 text-slate-400 font-medium bg-slate-50 rounded-xl">
                          No claims found. Please add a new claim or seed test data.
                        </TableCell>
                      </TableRow>
                    ) : (
                      claims.map((claim) => (
                        <TableRow key={claim.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                          <TableCell className="py-4">
                            <div className="font-bold text-slate-800">{claim.companyName}</div>
                            <div className="text-xs text-slate-400 font-medium">{claim.createdBy}</div>
                          </TableCell>
                          <TableCell className="py-4 text-slate-600 font-medium">{claim.reportingDate}</TableCell>
                          <TableCell className="py-4 text-right">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100">
                              <span>{claim.dailyClaimsReceived || "-"}</span>
                              <span className="text-indigo-300">/</span>
                              <span>{claim.approvedClaimsCount || "-"}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 text-right">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-100">
                              <span>{claim.propertyDailyClaimsReceived || "-"}</span>
                              <span className="text-emerald-300">/</span>
                              <span>{claim.propertyApprovedClaimsCount || "-"}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-4">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEdit(claim)}
                              className="border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 font-semibold transition-all rounded-lg"
                            >
                              <Edit2 className="w-4 h-4 mr-2" /> Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Premium Edit Modal */}
      <Modal 
        isOpen={!!editClaim} 
        onClose={closeEditModal} 
        title="Edit Claim Record"
      >
        {editClaim && (
          <div className="p-1">
            <ClaimForm 
              initialData={editClaim} 
              onSuccess={handleEditSuccess} 
              onCancel={closeEditModal}
              isModal={true}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
