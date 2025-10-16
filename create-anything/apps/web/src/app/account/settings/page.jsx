"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import { User, Mail, Lock, Globe, ArrowLeft } from "lucide-react";

export default function AccountSettingsPage() {
  const { data: user, loading: userLoading, refetch } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [locale, setLocale] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setCountry(user.country || "PT");
      setLocale(user.locale || "pt");
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao atualizar perfil");
      }

      setSuccess("Perfil atualizado com sucesso");
      await refetch();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveRegionalSettings = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: country,
          locale: locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Erro ao atualizar configurações regionais",
        );
      }

      setSuccess("Configurações regionais atualizadas");
      await refetch();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating regional settings:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("As passwords não coincidem");
      return;
    }

    if (newPassword.length < 8) {
      setError("A password deve ter pelo menos 8 caracteres");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao alterar password");
      }

      setSuccess("Password alterada com sucesso");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error changing password:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-[#FF7A1A] rounded-lg animate-pulse mx-auto mb-4"></div>
          <p className="text-[#6B7280]">A carregar...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/sign-in";
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/dashboard"
            className="text-[#6B7280] hover:text-[#0A0A0A] mb-4 text-sm flex items-center gap-2 transition-colors duration-150"
          >
            <ArrowLeft size={16} />
            Voltar ao Dashboard
          </a>
          <h1 className="text-3xl font-bold text-[#0A0A0A]">
            Configurações da Conta
          </h1>
          <p className="text-[#6B7280] mt-2">
            Gerir as suas informações pessoais e segurança
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Information */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FF7A1A] rounded-lg flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#0A0A0A]">
                  Informações do Perfil
                </h2>
                <p className="text-sm text-[#6B7280]">
                  Atualize as suas informações pessoais
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#FF7A1A] focus:ring-2 focus:ring-[#FF7A1A] focus:ring-opacity-20 outline-none transition-colors duration-150"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                  Email
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="flex-1 px-4 py-3 rounded-lg border border-[#E5E7EB] bg-[#F4F5F7] text-[#6B7280] cursor-not-allowed"
                  />
                  <Mail size={20} className="text-[#6B7280]" />
                </div>
                <p className="text-xs text-[#6B7280] mt-1">
                  O email não pode ser alterado
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving || !name.trim()}
                  className="px-6 py-3 bg-[#FF7A1A] text-white rounded-lg font-semibold hover:bg-[#E6691A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  {saving ? "A guardar..." : "Guardar Alterações"}
                </button>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FF7A1A] rounded-lg flex items-center justify-center">
                <Lock size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#0A0A0A]">
                  Alterar Password
                </h2>
                <p className="text-sm text-[#6B7280]">
                  Atualize a sua password de acesso
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                  Password Atual
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#FF7A1A] focus:ring-2 focus:ring-[#FF7A1A] focus:ring-opacity-20 outline-none transition-colors duration-150"
                  placeholder="Insira a password atual"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                  Nova Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#FF7A1A] focus:ring-2 focus:ring-[#FF7A1A] focus:ring-opacity-20 outline-none transition-colors duration-150"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                  Confirmar Nova Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#FF7A1A] focus:ring-2 focus:ring-[#FF7A1A] focus:ring-opacity-20 outline-none transition-colors duration-150"
                  placeholder="Confirme a nova password"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={handleChangePassword}
                  disabled={
                    saving ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword
                  }
                  className="px-6 py-3 bg-[#FF7A1A] text-white rounded-lg font-semibold hover:bg-[#E6691A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  {saving ? "A alterar..." : "Alterar Password"}
                </button>
              </div>
            </div>
          </div>

          {/* Language & Region */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FF7A1A] rounded-lg flex items-center justify-center">
                <Globe size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#0A0A0A]">
                  Idioma e Região
                </h2>
                <p className="text-sm text-[#6B7280]">
                  Configure as suas preferências regionais
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                  Idioma
                </label>
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#FF7A1A] focus:ring-2 focus:ring-[#FF7A1A] focus:ring-opacity-20 outline-none transition-colors duration-150"
                >
                  <option value="pt">Português (Portugal)</option>
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                  País/Região
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#FF7A1A] focus:ring-2 focus:ring-[#FF7A1A] focus:ring-opacity-20 outline-none transition-colors duration-150"
                >
                  <option value="PT">Portugal</option>
                  <option value="BR">Brasil</option>
                  <option value="ES">España</option>
                  <option value="FR">France</option>
                  <option value="DE">Deutschland</option>
                  <option value="GB">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="IT">Italia</option>
                  <option value="NL">Netherlands</option>
                </select>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSaveRegionalSettings}
                  disabled={saving}
                  className="px-6 py-3 bg-[#FF7A1A] text-white rounded-lg font-semibold hover:bg-[#E6691A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  {saving ? "A guardar..." : "Guardar Configurações"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
