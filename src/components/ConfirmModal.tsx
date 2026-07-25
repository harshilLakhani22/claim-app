"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isProcessing?: boolean;
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, description, isProcessing }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col mx-4 animate-in zoom-in-95 duration-200 overflow-hidden border border-slate-100">
        
        <div className="p-6 text-center pt-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 shadow-inner">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">{title}</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex gap-3 p-6 bg-slate-50 border-t border-slate-100">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 bg-white border-slate-200 text-slate-600 hover:bg-slate-100 font-bold h-12 rounded-xl"
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-red-600/20 active:scale-95 transition-all"
          >
            {isProcessing ? "Deleting..." : "Yes, Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
