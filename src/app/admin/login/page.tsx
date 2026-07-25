"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { LockKeyhole, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "admin123") {
      localStorage.setItem("admin_auth", "true");
      router.push("/admin");
    } else {
      setError("Invalid passcode. Try 'admin123'");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md space-y-4">
        <Link href="/">
          <Button variant="ghost" className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Form
          </Button>
        </Link>
        <Card className="bg-white border-zinc-300 shadow-sm rounded-xl">
          <CardHeader className="space-y-2 items-center text-center pb-8">
            <div className="w-12 h-12 bg-zinc-900 text-white rounded-full flex items-center justify-center mb-2 border border-zinc-900 shadow-sm">
              <LockKeyhole className="w-5 h-5" />
            </div>
            <CardTitle className="text-3xl text-zinc-900 font-extrabold tracking-tight">Admin Access</CardTitle>
            <CardDescription className="text-zinc-500 font-medium text-base">
              Enter the passcode to view the dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input 
                  type="password" 
                  placeholder="Passcode" 
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="bg-white border-zinc-400 text-zinc-900 text-center text-xl tracking-[0.25em] font-medium h-14 focus-visible:ring-zinc-900 focus-visible:ring-2 focus-visible:border-transparent rounded-lg"
                />
                {error && <p className="text-red-500 text-sm text-center font-bold mt-2">{error}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800 text-white h-14 shadow-md transition-transform active:scale-95 font-bold text-lg tracking-wide rounded-lg">
                Unlock Dashboard
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
