import { useState } from "react";
import { X, Bookmark } from "lucide-react";

export function SavePromptModal({ isOpen, onClose, onSave, promptContent }) {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Por favor, insira um título para o prompt");
      return;
    }

    setSaving(true);
    setError("");

    try {
      console.log("Saving prompt:", {
        title: title.trim(),
        content: promptContent,
      });

      const result = await onSave(title.trim(), promptContent);
      console.log("Save result:", result);

      if (result && result !== false) {
        setTitle("");
        onClose();
      } else {
        setError(
          "Erro ao salvar prompt. Verifique se você tem permissão para salvar neste workspace.",
        );
      }
    } catch (error) {
      console.error("Error saving prompt:", error);
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FF7A1A] rounded-lg flex items-center justify-center">
              <Bookmark size={16} className="text-white" />
            </div>
            <h2 className="text-lg font-semibold text-[#0A0A0A]">
              Salvar Prompt
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-[#6B7280] hover:text-[#0A0A0A] rounded-lg transition-colors duration-150"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
              Título do prompt
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Análise de dados, Criação de conteúdo..."
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#FF7A1A] text-[#0A0A0A]"
              autoFocus
              disabled={saving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
              Conteúdo do prompt
            </label>
            <div className="bg-[#F4F5F7] rounded-lg p-3 max-h-32 overflow-y-auto">
              <p className="text-sm text-[#6B7280] whitespace-pre-wrap">
                {promptContent}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#E5E7EB]">
          <button
            onClick={handleClose}
            disabled={saving}
            className="px-4 py-2 text-[#6B7280] hover:text-[#0A0A0A] font-medium transition-colors duration-150 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || saving}
            className="px-6 py-2 bg-[#FF7A1A] hover:bg-[#E6691A] disabled:bg-[#E5E7EB] disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-150"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
