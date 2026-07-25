"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getClaims, seedDatabase } from "@/lib/storage";
import { seedData } from "@/lib/seedData";
import { ClaimData } from "@/types/claim";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, LogOut, Search, FileDown, TrendingUp, ShieldCheck, DollarSign, Activity, CheckCircle2, XCircle, MinusCircle, Car, Home } from "lucide-react";
import Link from "next/link";
import * as XLSX from 'xlsx';
import { Input } from "@/components/ui/input";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const router = useRouter();
  const [claims, setClaims] = useState<ClaimData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isSeeding, setIsSeeding] = useState(false);

  const refreshClaims = async () => {
    setIsLoading(true);
    const data = await getClaims();
    setClaims(data);
    setIsLoading(false);
  };

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (!auth) {
      router.push("/admin/login");
    } else {
      refreshClaims();
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    router.push("/");
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    await seedDatabase(seedData);
    await refreshClaims();
    setIsSeeding(false);
    alert("Seed data successfully injected into Firebase!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  // --- Utility functions ---
  const parseNum = (val?: string) => {
    if (!val || val === "-") return 0;
    return parseFloat(val) || 0;
  };

  const formatCr = (num: number) => {
    return (num / 10000000).toFixed(2) + " Cr";
  };

  // --- Calculations ---
  const motorReceived = claims.reduce((acc, c) => acc + (parseNum(c.cumulativeClaimsReceived) || parseNum(c.dailyClaimsReceived)), 0);
  const motorFirstVisit = claims.reduce((acc, c) => acc + (parseNum(c.cumulativeFirstVisitCompleted) || parseNum(c.dailyFirstVisitCompleted)), 0);
  const motorApproxAmt = claims.reduce((acc, c) => acc + (parseNum(c.cumulativeApproxClaimAmount) || parseNum(c.dailyApproxClaimAmount)), 0);
  const motorApprovedAmt = claims.reduce((acc, c) => acc + parseNum(c.approvedClaimAmount), 0);
  const motorApproved = claims.reduce((acc, c) => acc + parseNum(c.approvedClaimsCount), 0);
  const motorRejected = claims.reduce((acc, c) => acc + parseNum(c.rejectedClaimsCount), 0);
  const motorWithdraw = claims.reduce((acc, c) => acc + parseNum(c.motorWithdrawClaimsCount), 0);

  const propReceived = claims.reduce((acc, c) => acc + (parseNum(c.propertyCumulativeClaimsReceived) || parseNum(c.propertyDailyClaimsReceived)), 0);
  const propFirstVisit = claims.reduce((acc, c) => acc + (parseNum(c.propertyCumulativeFirstVisitCompleted) || parseNum(c.propertyDailyFirstVisitCompleted)), 0);
  const propApproxAmt = claims.reduce((acc, c) => acc + (parseNum(c.propertyCumulativeApproxClaimAmount) || parseNum(c.propertyDailyApproxClaimAmount)), 0);
  const propApprovedAmt = claims.reduce((acc, c) => acc + parseNum(c.propertyApprovedClaimAmount), 0);
  const propApproved = claims.reduce((acc, c) => acc + parseNum(c.propertyApprovedClaimsCount), 0);
  const propRejected = claims.reduce((acc, c) => acc + parseNum(c.propertyRejectedClaimsCount), 0);
  const propWithdraw = claims.reduce((acc, c) => acc + parseNum(c.propertyWithdrawClaimsCount), 0);

  // Top Companies for Charts
  const chartData = claims.map(c => ({
    name: c.companyName.length > 15 ? c.companyName.substring(0, 15) + '...' : c.companyName,
    "Motor Approved": parseNum(c.approvedClaimsCount),
    "Property Approved": parseNum(c.propertyApprovedClaimsCount),
  })).sort((a, b) => (b["Motor Approved"] + b["Property Approved"]) - (a["Motor Approved"] + a["Property Approved"])).slice(0, 10); // Top 10

  // Export functions
  const exportExcel = (type: 'Motor' | 'Property') => {
    const ws = XLSX.utils.json_to_sheet(claims.map(c => {
      const isM = type === 'Motor';
      return {
        "Company Name": c.companyName,
        "Reporting Date": c.reportingDate,
        "Daily Received": isM ? c.dailyClaimsReceived : c.propertyDailyClaimsReceived,
        "Cumulative Received": isM ? c.cumulativeClaimsReceived : c.propertyCumulativeClaimsReceived,
        "Approved Count": isM ? c.approvedClaimsCount : c.propertyApprovedClaimsCount,
        "Approx Amount": isM ? c.cumulativeApproxClaimAmount : c.propertyCumulativeApproxClaimAmount,
      }
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${type} Claims`);
    XLSX.writeFile(wb, `${type}_Analytics.xlsx`);
  };

  const filteredClaims = claims.filter(c => c.companyName.toLowerCase().includes(searchTerm.toLowerCase()));

  // UI Components
  const MetricCard = ({ title, value, subtext, icon: Icon, colorClass, delay }: any) => (
    <div className={`bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4`} style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}>
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
        <Icon className={`w-24 h-24 ${colorClass}`} />
      </div>
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2.5 rounded-xl ${colorClass.replace('text-', 'bg-').replace('-500', '-50')} ${colorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-500 tracking-wide uppercase">{title}</h3>
        </div>
        <div>
          <div className="text-3xl font-black text-slate-800 tracking-tight mb-1">{value}</div>
          {subtext && <div className="text-sm text-slate-400 font-medium">{subtext}</div>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-24 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Premium Glassmorphism Navbar */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-[1600px] w-full mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white tracking-tight leading-tight">Insight<span className="text-indigo-400">Dash</span></h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Claim Analytics</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button onClick={handleSeedData} disabled={isSeeding} variant="outline" size="sm" className="bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all h-9 rounded-lg">
              {isSeeding ? "Seeding..." : "Seed Test Data"}
            </Button>
            <div className="h-4 w-px bg-slate-800 mx-1"></div>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg">
                <ArrowLeft className="w-4 h-4 mr-2" /> Application
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] w-full mx-auto px-6 py-10 space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Executive Overview</h2>
            <p className="text-slate-500 font-medium text-lg">Comprehensive analytics across all insurance portfolios.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => exportExcel('Motor')} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm rounded-xl h-11 px-5 font-semibold transition-all hover:shadow-md">
              <FileDown className="w-4 h-4 mr-2 text-indigo-500" /> Export Motor
            </Button>
            <Button onClick={() => exportExcel('Property')} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm rounded-xl h-11 px-5 font-semibold transition-all hover:shadow-md">
              <FileDown className="w-4 h-4 mr-2 text-emerald-500" /> Export Property
            </Button>
          </div>
        </div>

        {/* Global KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard delay={100} title="Total Claims" value={(motorReceived + propReceived).toLocaleString()} subtext="Motor & Property combined" icon={Activity} colorClass="text-indigo-500" />
          <MetricCard delay={200} title="Total Approved" value={(motorApproved + propApproved).toLocaleString()} subtext="Successfully processed" icon={CheckCircle2} colorClass="text-emerald-500" />
          <MetricCard delay={300} title="Approx Value" value={formatCr(motorApproxAmt + propApproxAmt)} subtext="Total requested amount" icon={DollarSign} colorClass="text-amber-500" />
          <MetricCard delay={400} title="Total Rejected" value={(motorRejected + propRejected).toLocaleString()} subtext="Failed validation" icon={XCircle} colorClass="text-rose-500" />
        </div>

        {/* Deep Dive Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Charts Area */}
          <div className="xl:col-span-2 bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 animate-in fade-in duration-700 delay-300 fill-mode-both">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Approval Trends</h3>
                <p className="text-slate-500 font-medium text-sm">Top 10 companies by volume</p>
              </div>
              <div className="flex items-center gap-4 text-sm font-semibold">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500"></div>Motor</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div>Property</div>
              </div>
            </div>
            
            <div className="h-[350px] w-full">
              {claims.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMotor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorProp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}
                      itemStyle={{ color: '#475569', fontSize: '14px', fontWeight: 500 }}
                    />
                    <Area type="monotone" dataKey="Motor Approved" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorMotor)" />
                    <Area type="monotone" dataKey="Property Approved" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProp)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 font-medium bg-slate-50 rounded-2xl border border-slate-100">No data available. Seed data to view chart.</div>
              )}
            </div>
          </div>

          {/* Portfolio Breakdown */}
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700 delay-400 fill-mode-both">
            
            {/* Motor Mini Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl p-6 shadow-xl shadow-indigo-500/20 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Car className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6 text-indigo-100 font-semibold tracking-wide uppercase text-sm">
                  <Car className="w-5 h-5" /> Motor Portfolio
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-indigo-200 text-sm font-medium mb-1">Total Received</div>
                    <div className="text-3xl font-black tracking-tight">{motorReceived.toLocaleString()}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-indigo-400/30">
                    <div>
                      <div className="text-indigo-200 text-xs font-medium mb-1">Approved</div>
                      <div className="text-xl font-bold">{motorApproved.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-indigo-200 text-xs font-medium mb-1">Value (Cr)</div>
                      <div className="text-xl font-bold">{formatCr(motorApproxAmt)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Mini Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-3xl p-6 shadow-xl shadow-emerald-500/20 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Home className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6 text-emerald-100 font-semibold tracking-wide uppercase text-sm">
                  <Home className="w-5 h-5" /> Property Portfolio
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-emerald-200 text-sm font-medium mb-1">Total Received</div>
                    <div className="text-3xl font-black tracking-tight">{propReceived.toLocaleString()}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-400/30">
                    <div>
                      <div className="text-emerald-200 text-xs font-medium mb-1">Approved</div>
                      <div className="text-xl font-bold">{propApproved.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-emerald-200 text-xs font-medium mb-1">Value (Cr)</div>
                      <div className="text-xl font-bold">{formatCr(propApproxAmt)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 animate-in fade-in duration-700 delay-500 fill-mode-both">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Claim Directory</h3>
              <p className="text-slate-500 font-medium text-sm">Detailed breakdown by provider</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search provider..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full md:w-72 h-11 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-indigo-500 font-medium transition-all"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100 hover:bg-transparent">
                  <TableHead className="font-semibold text-slate-400 uppercase text-xs tracking-wider py-4">Provider Name</TableHead>
                  <TableHead className="font-semibold text-slate-400 uppercase text-xs tracking-wider py-4">Date</TableHead>
                  <TableHead className="font-semibold text-slate-400 uppercase text-xs tracking-wider py-4 text-right">Motor (Rec/App)</TableHead>
                  <TableHead className="font-semibold text-slate-400 uppercase text-xs tracking-wider py-4 text-right">Property (Rec/App)</TableHead>
                  <TableHead className="font-semibold text-slate-400 uppercase text-xs tracking-wider py-4 text-right">Motor Val (Cr)</TableHead>
                  <TableHead className="font-semibold text-slate-400 uppercase text-xs tracking-wider py-4 text-right">Prop Val (Cr)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClaims.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-500 font-medium">No providers found matching your search.</TableCell>
                  </TableRow>
                ) : (
                  filteredClaims.map((c) => {
                    const mR = parseNum(c.cumulativeClaimsReceived) || parseNum(c.dailyClaimsReceived);
                    const mA = parseNum(c.approvedClaimsCount);
                    const pR = parseNum(c.propertyCumulativeClaimsReceived) || parseNum(c.propertyDailyClaimsReceived);
                    const pA = parseNum(c.propertyApprovedClaimsCount);
                    
                    return (
                      <TableRow key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                        <TableCell className="py-4">
                          <div className="font-bold text-slate-800">{c.companyName}</div>
                          <div className="text-xs text-slate-400 font-medium">{c.createdBy}</div>
                        </TableCell>
                        <TableCell className="py-4 text-slate-600 font-medium">{c.reportingDate}</TableCell>
                        <TableCell className="py-4 text-right">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100">
                            <span>{mR}</span>
                            <span className="text-indigo-300">/</span>
                            <span>{mA}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-100">
                            <span>{pR}</span>
                            <span className="text-emerald-300">/</span>
                            <span>{pA}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-right font-bold text-slate-700">
                          {formatCr(parseNum(c.cumulativeApproxClaimAmount) || parseNum(c.dailyApproxClaimAmount))}
                        </TableCell>
                        <TableCell className="py-4 text-right font-bold text-slate-700">
                          {formatCr(parseNum(c.propertyCumulativeApproxClaimAmount) || parseNum(c.propertyDailyApproxClaimAmount))}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

      </main>
    </div>
  );
}
