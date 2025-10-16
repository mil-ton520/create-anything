"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function LogoutPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleLogout = async () => {
      setIsLoggingOut(true);
      
      try {
        // Sign out by redirecting to the sign-in page
        // This will clear the session
        window.location.href = "/sign-in";
      } catch (error) {
        console.error("Logout error:", error);
        // Still redirect even if there's an error
        window.location.href = "/sign-in";
      }
    };

    handleLogout();
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center">
      <div className="max-w-md mx-auto px-6">
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-8 text-center">
          <div className="w-16 h-16 bg-[#FF7A1A] rounded-xl flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 bg-white/20 rounded-lg animate-pulse"></div>
          </div>
          
          <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">
            A terminar sessão...
          </h1>
          
          <p className="text-[#6B7280] mb-6">
            Aguarde enquanto encerramos a sua sessão de forma segura.
          </p>
          
          {!isLoggingOut && (
            <div className="space-y-4">
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#0A0A0A] text-sm transition-colors duration-150"
              >
                <ArrowLeft size={16} />
                Voltar ao Dashboard
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}