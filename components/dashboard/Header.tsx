
"use client";

import { LogOut, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    // Clear auth and redirect to login
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    router.push('/login');
  };

  return (
    <div className="flex items-center justify-between p-6 border-b border-white/5 bg-slate-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-900/50 sticky top-0 z-50 transition-all duration-200">
      {/* Left: Logo & Title */}
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 w-10 h-10 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-sm">
          Manajemen <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Mahasiswa</span>
        </h1>
      </div>

      {/* Right: Logout Button */}
      <Button 
        onClick={handleLogout} 
        variant="ghost" 
        className="text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300"
      >
        <LogOut className="h-5 w-5 mr-2" />
        Logout
      </Button>
    </div>
  );
}
