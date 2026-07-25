"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { saveClaim, updateClaim } from "@/lib/storage";
import { ClaimData } from "@/types/claim";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Car, Building, FileText, X } from "lucide-react";

export const claimSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  reportingDate: z.string().min(1, "Reporting Date is required"),
  createdBy: z.string().min(1, "Created By is required"),

  dailyClaimsReceived: z.string().optional(),
  dailyFirstVisitCompleted: z.string().optional(),
  dailyApproxClaimAmount: z.string().optional(),
  cumulativeClaimsReceived: z.string().optional(),
  cumulativeFirstVisitCompleted: z.string().optional(),
  cumulativeApproxClaimAmount: z.string().optional(),
  approvedClaimsCount: z.string().optional(),
  approvedClaimAmount: z.string().optional(),
  motorWithdrawClaimsCount: z.string().optional(),
  rejectedClaimsCount: z.string().optional(),
  rejectionReason: z.string().optional(),

  propertyDailyClaimsReceived: z.string().optional(),
  propertyDailyFirstVisitCompleted: z.string().optional(),
  propertyDailyApproxClaimAmount: z.string().optional(),
  propertyCumulativeClaimsReceived: z.string().optional(),
  propertyCumulativeFirstVisitCompleted: z.string().optional(),
  propertyCumulativeApproxClaimAmount: z.string().optional(),
  propertyApprovedClaimsCount: z.string().optional(),
  propertyApprovedClaimAmount: z.string().optional(),
  propertyRejectedClaimsCount: z.string().optional(),
  propertyWithdrawClaimsCount: z.string().optional(),
  propertyRejectionReason: z.string().optional(),

  createdDate: z.string().min(1, "Created Date is required"),
});

export type ClaimFormValues = z.infer<typeof claimSchema>;

export const defaultValues = {
  companyName: "", reportingDate: "", createdBy: "", createdDate: new Date().toISOString().split('T')[0],
  dailyClaimsReceived: "", dailyFirstVisitCompleted: "", dailyApproxClaimAmount: "",
  cumulativeClaimsReceived: "", cumulativeFirstVisitCompleted: "", cumulativeApproxClaimAmount: "",
  approvedClaimsCount: "", approvedClaimAmount: "", motorWithdrawClaimsCount: "", rejectedClaimsCount: "", rejectionReason: "",
  propertyDailyClaimsReceived: "", propertyDailyFirstVisitCompleted: "", propertyDailyApproxClaimAmount: "",
  propertyCumulativeClaimsReceived: "", propertyCumulativeFirstVisitCompleted: "", propertyCumulativeApproxClaimAmount: "",
  propertyApprovedClaimsCount: "", propertyApprovedClaimAmount: "", propertyRejectedClaimsCount: "", propertyWithdrawClaimsCount: "", propertyRejectionReason: ""
};

interface ClaimFormProps {
  initialData?: ClaimData | null;
  onSuccess: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export function ClaimForm({ initialData, onSuccess, onCancel, isModal = false }: ClaimFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editId = initialData?.id || null;

  const getInitialValues = () => {
    if (!initialData) return defaultValues;
    const mappedData = { ...initialData };
    for (const key in mappedData) {
      if (mappedData[key as keyof ClaimData] === "-") {
        (mappedData as any)[key] = "";
      }
    }
    return mappedData;
  };

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    defaultValues: getInitialValues() as ClaimFormValues,
  });

  const onSubmit = (data: ClaimFormValues) => {
    setIsSubmitting(true);
    try {
      const formattedData = {
        ...data,
        dailyClaimsReceived: data.dailyClaimsReceived || "-",
        dailyFirstVisitCompleted: data.dailyFirstVisitCompleted || "-",
        dailyApproxClaimAmount: data.dailyApproxClaimAmount || "-",
        cumulativeClaimsReceived: data.cumulativeClaimsReceived || "-",
        cumulativeFirstVisitCompleted: data.cumulativeFirstVisitCompleted || "-",
        cumulativeApproxClaimAmount: data.cumulativeApproxClaimAmount || "-",
        approvedClaimsCount: data.approvedClaimsCount || "-",
        approvedClaimAmount: data.approvedClaimAmount || "-",
        motorWithdrawClaimsCount: data.motorWithdrawClaimsCount || "-",
        rejectedClaimsCount: data.rejectedClaimsCount || "-",
        rejectionReason: data.rejectionReason || "-",
        propertyDailyClaimsReceived: data.propertyDailyClaimsReceived || "-",
        propertyDailyFirstVisitCompleted: data.propertyDailyFirstVisitCompleted || "-",
        propertyDailyApproxClaimAmount: data.propertyDailyApproxClaimAmount || "-",
        propertyCumulativeClaimsReceived: data.propertyCumulativeClaimsReceived || "-",
        propertyCumulativeFirstVisitCompleted: data.propertyCumulativeFirstVisitCompleted || "-",
        propertyCumulativeApproxClaimAmount: data.propertyCumulativeApproxClaimAmount || "-",
        propertyApprovedClaimsCount: data.propertyApprovedClaimsCount || "-",
        propertyApprovedClaimAmount: data.propertyApprovedClaimAmount || "-",
        propertyRejectedClaimsCount: data.propertyRejectedClaimsCount || "-",
        propertyWithdrawClaimsCount: data.propertyWithdrawClaimsCount || "-",
        propertyRejectionReason: data.propertyRejectionReason || "-",
      };

      if (editId) {
        updateClaim(editId, formattedData);
      } else {
        saveClaim(formattedData);
      }
      
      if (!isModal) {
          reset(defaultValues);
      }
      setIsSubmitting(false);
      onSuccess();
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  const SectionCard = ({ title, icon: Icon, children, colorClass }: any) => (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
        <Icon className={`w-32 h-32 ${colorClass}`} />
      </div>
      <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-4 relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${colorClass.replace('text-', 'bg-').replace('-500', '-500/10')} ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-800">{title}</h2>
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );

  const inputClass = "bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 focus-visible:ring-2 focus-visible:border-transparent text-slate-800 font-medium h-12 rounded-xl transition-all shadow-inner shadow-slate-100/50 hover:bg-slate-100/50 focus:bg-white";
  const labelClass = "text-slate-600 font-bold text-sm tracking-wide uppercase mb-1.5 block";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative">
      
      {/* GENERAL INFO CARD */}
      <SectionCard title="General Information" icon={FileText} colorClass="text-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-1">
            <Label htmlFor="companyName" className={labelClass}>Company Name <span className="text-rose-500">*</span></Label>
            <Input id="companyName" className={inputClass} placeholder="e.g. Acme Insurance" {...register("companyName")} />
            {errors.companyName && <p className="text-rose-500 text-xs mt-1.5 font-bold">{errors.companyName.message}</p>}
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="reportingDate" className={labelClass}>Reporting Date <span className="text-rose-500">*</span></Label>
            <Input id="reportingDate" type="date" className={inputClass} {...register("reportingDate")} />
            {errors.reportingDate && <p className="text-rose-500 text-xs mt-1.5 font-bold">{errors.reportingDate.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="createdBy" className={labelClass}>Created By <span className="text-rose-500">*</span></Label>
            <Input id="createdBy" className={inputClass} placeholder="Your Name" {...register("createdBy")} />
            {errors.createdBy && <p className="text-rose-500 text-xs mt-1.5 font-bold">{errors.createdBy.message}</p>}
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="createdDate" className={labelClass}>Created Date <span className="text-rose-500">*</span></Label>
            <Input id="createdDate" type="date" className={inputClass} {...register("createdDate")} />
            {errors.createdDate && <p className="text-rose-500 text-xs mt-1.5 font-bold">{errors.createdDate.message}</p>}
          </div>
        </div>
      </SectionCard>

      {/* MOTOR CLAIMS CARD */}
      <SectionCard title="Motor Claims" icon={Car} colorClass="text-indigo-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
          {[
            { id: "dailyClaimsReceived", label: "Daily Received", placeholder: "e.g. 10" },
            { id: "dailyFirstVisitCompleted", label: "Daily First Visit", placeholder: "e.g. 5" },
            { id: "dailyApproxClaimAmount", label: "Daily Approx Amt", placeholder: "e.g. 50000" },
            { id: "cumulativeClaimsReceived", label: "Cumulative Received", placeholder: "e.g. 150" },
            { id: "cumulativeFirstVisitCompleted", label: "Cumulative First Visit", placeholder: "e.g. 100" },
            { id: "cumulativeApproxClaimAmount", label: "Cumulative Approx Amt", placeholder: "e.g. 1500000" },
            { id: "approvedClaimsCount", label: "Approved Count", placeholder: "e.g. 120" },
            { id: "approvedClaimAmount", label: "Approved Amount", placeholder: "e.g. 1200000" },
            { id: "motorWithdrawClaimsCount", label: "Withdraw Count", placeholder: "e.g. 5" },
            { id: "rejectedClaimsCount", label: "Rejected Count", placeholder: "e.g. 25" },
          ].map((field) => (
            <div key={field.id} className="space-y-1">
              <Label htmlFor={field.id} className={labelClass}>{field.label}</Label>
              <Input id={field.id} className={inputClass} placeholder={field.placeholder} {...register(field.id as any)} />
            </div>
          ))}
          <div className="space-y-1 md:col-span-3 pt-4 border-t border-slate-100">
            <Label htmlFor="rejectionReason" className={labelClass}>Rejection Reason</Label>
            <Input id="rejectionReason" className={inputClass} placeholder="If any claims were rejected, specify reason" {...register("rejectionReason")} />
          </div>
        </div>
      </SectionCard>

      {/* PROPERTY CLAIMS CARD */}
      <SectionCard title="Property Claims" icon={Building} colorClass="text-emerald-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mb-8">
          {[
            { id: "propertyDailyClaimsReceived", label: "Daily Received", placeholder: "e.g. 2" },
            { id: "propertyDailyFirstVisitCompleted", label: "Daily First Visit", placeholder: "e.g. 1" },
            { id: "propertyDailyApproxClaimAmount", label: "Daily Approx Amt", placeholder: "e.g. 150000" },
            { id: "propertyCumulativeClaimsReceived", label: "Cumulative Received", placeholder: "e.g. 40" },
            { id: "propertyCumulativeFirstVisitCompleted", label: "Cumulative First Visit", placeholder: "e.g. 35" },
            { id: "propertyCumulativeApproxClaimAmount", label: "Cumulative Approx Amt", placeholder: "e.g. 5000000" },
            { id: "propertyApprovedClaimsCount", label: "Approved Count", placeholder: "e.g. 30" },
            { id: "propertyApprovedClaimAmount", label: "Approved Amount", placeholder: "e.g. 4000000" },
            { id: "propertyWithdrawClaimsCount", label: "Withdraw Count", placeholder: "e.g. 2" },
            { id: "propertyRejectedClaimsCount", label: "Rejected Count", placeholder: "e.g. 8" },
          ].map((field) => (
            <div key={field.id} className="space-y-1">
              <Label htmlFor={field.id} className={labelClass}>{field.label}</Label>
              <Input id={field.id} className={inputClass} placeholder={field.placeholder} {...register(field.id as any)} />
            </div>
          ))}
          <div className="space-y-1 md:col-span-3 pt-4 border-t border-slate-100">
            <Label htmlFor="propertyRejectionReason" className={labelClass}>Rejection Reason</Label>
            <Input id="propertyRejectionReason" className={inputClass} placeholder="If any claims were rejected, specify reason" {...register("propertyRejectionReason")} />
          </div>
        </div>
      </SectionCard>

      {/* STICKY SAVE BAR */}
      <div className={`sticky bottom-6 mt-8 bg-white/90 backdrop-blur-xl border border-slate-200/60 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50 transition-all rounded-2xl ${isModal ? 'absolute bottom-0 w-full rounded-t-none rounded-b-2xl border-none' : ''}`}>
        <div className="flex justify-between items-center w-full px-2 sm:px-4">
          <div className="flex items-center gap-3 hidden md:flex">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <Save className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-sm text-slate-500 font-bold tracking-wide uppercase">
              {editId ? "Editing Record" : "Double-check entries"}
            </span>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            {onCancel && (
              <Button type="button" variant="ghost" onClick={onCancel} className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-bold h-12 px-6 rounded-xl w-full md:w-auto">
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
              {isSubmitting ? "Saving..." : (editId ? "Update Claim Record" : "Save Claim Record")}
              <Save className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
