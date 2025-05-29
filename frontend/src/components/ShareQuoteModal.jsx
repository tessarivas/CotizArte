import React, { useState } from 'react';
import { Download, Copy, Check, Share2 } from 'lucide-react';
import { generateQuotePDF } from '@/services/pdfService';
import GradientText from "../blocks/TextAnimations/GradientText/GradientText";

export function ShareQuoteModal({ isOpen, onClose, quote, pricingProfile }) {
  const [linkCopied, setLinkCopied] = useState(false);

  if (!isOpen || !quote) return null;

  const shareableLink = `${window.location.origin}/shared-quote/${quote.shareableLink}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
      const textArea = document.createElement('textarea');
      textArea.value = shareableLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const handleDownloadPDF = () => {
    try {
      const pdf = generateQuotePDF(quote, pricingProfile);
      pdf.download(`Cotización_${quote.project?.title || quote.id}_${new Date().getFullYear()}.pdf`);
      onClose();
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF');
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm z-50 font-regular-text">
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-7 w-[450px]">
        <div className="flex justify-center items-center gap-2 mb-4">
          <GradientText className="text-4xl font-logo-text mb-2">
            Compartir Cotización
          </GradientText>
        </div>

        <div className="bg-gray-50/50 backdrop-blur-sm rounded-lg p-4 mb-4 border border-gray-200/50">
          <h4 className="font-semibold text-gray-900 mb-2 text-lg">
            {quote.project?.title || 'Sin título'}
          </h4>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Cliente:</span> {quote.client?.name || quote.project?.client?.name || 'N/A'}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Total:</span> ${quote.finalPriceAfterDiscount?.toFixed(2) || '0.00'}
          </p>
        </div>

        <div className="relative mb-4">
          <button
            onClick={handleDownloadPDF}
            className="btn btn-primary w-full flex items-center justify-center gap-3"
          >
            <Download size={20} />
            Descargar PDF
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enlace compartible
          </label>
          <div className="relative">
            <input
              type="text"
              value={shareableLink}
              readOnly
              className="input input-bordered w-full pr-20 text-sm"
              placeholder="Enlace compartible"
            />
            <button
              onClick={handleCopyLink}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-md flex items-center gap-1 text-xs transition-colors ${
                linkCopied
                  ? 'bg-success/20 text-success border border-success/30'
                  : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              {linkCopied ? (
                <>
                  <Check size={14} />
                  ¡Copiado!
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copiar
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Comparte este enlace para que otros puedan ver la cotización
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="btn btn-secondary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}