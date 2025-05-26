import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// ✅ CORREGIR LA CONFIGURACIÓN DE FUENTES
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts;

// ✅ IMPORTAR LOS LOGOS BASE64
import logoChico from '@/assets/base64/logo_chico.txt?raw';
import logoCotizarteNombre from '@/assets/base64/logo_cotizarte_nombre.txt?raw';

export const generateQuotePDF = (quote, pricingProfile) => {
  // ✅ CALCULAR DATOS IGUAL QUE EN QUOTEDETAILSMODAL
  const commercialPercentage = quote.commercialPercentage ||
    (quote.commercialLicenseFee && quote.basePrice
      ? ((quote.commercialLicenseFee / quote.basePrice) * 100).toFixed(2)
      : "0");

  const urgencyPercentage = quote.rapidDeliveryPercentage !== undefined &&
    quote.rapidDeliveryPercentage !== null
      ? Number(quote.rapidDeliveryPercentage).toFixed(2)
      : quote.urgencyFee && quote.basePrice
      ? ((quote.urgencyFee / quote.basePrice) * 100).toFixed(2)
      : "0";

  // ✅ USAR LOS MISMOS DATOS QUE QUOTEDETAILSMODAL
  const basePrice = quote.basePrice || 0;
  const commercialFee = quote.commercialLicenseFee || 0;
  const urgencyFee = quote.urgencyFee || 0;
  const materialsCost = quote.materialsCost || 0;
  const shippingFee = quote.shippingFee || 0;
  const certificateFee = quote.certificateFee || 0;
  
  const subtotal = quote.finalPrice || 0;
  const discountAmount = quote.discountPercentage > 0 
    ? (quote.discountPercentage / 100) * subtotal 
    : 0;
  const finalTotal = quote.finalPriceAfterDiscount || 0;

  // Definir el documento
  const documentDefinition = {
    pageSize: 'LETTER',
    pageMargins: [40, 40, 40, 40],

    // Contenido principal
    content: [
      {
        text: '',
        margin: [0, 0, 0, 0] 
      },

      // ✅ LOGO GRANDE Y DATOS DE LA EMPRESA
      {
        columns: [
          {
            image: `data:image/png;base64,${logoCotizarteNombre.trim()}`,
            width: 120,
            height: 40,
            margin: [0, 15, 0, 0]
          },
          {
            text: [
              { text: 'Servicios de Arte y Diseño\n', style: 'companySubtitle' },
              { text: 'contacto@cotizarte.com\n', style: 'contactInfo' },
              { text: '+1 234 567 8900', style: 'contactInfo' }
            ],
            alignment: 'right',
            margin: [0, 10] // Alinear verticalmente con el logo
          }
        ],
        margin: [0, 0, 0, 40] // Más espacio después del logo
      },

      // Información del cliente y proyecto
      {
        columns: [
          {
            text: [
              { text: 'CLIENTE:\n', style: 'sectionTitlePrimary' },
              { text: `${quote.client?.name || quote.project?.client?.name || 'N/A'}\n`, style: 'clientInfo' },
              { text: `Teléfono: ${quote.client?.phone || quote.project?.client?.phone || 'N/A'}\n`, style: 'clientInfo' },
              { text: `Empresa: ${quote.client?.company || quote.project?.client?.company || 'N/A'}`, style: 'clientInfo' }
            ]
          },
          {
            text: [
              { text: 'PROYECTO:\n', style: 'sectionTitlePrimary' },
              { text: `${quote.project?.title || 'Sin título'}\n`, style: 'projectInfo' },
              { text: `Tipo: ${quote.project?.artType?.name || 'N/A'}\n`, style: 'projectInfo' },
              { text: `Fecha: ${formatDate(quote.createdAt)}`, style: 'projectInfo' }
            ],
            alignment: 'right'
          }
        ],
        margin: [0, 0, 0, 30]
      },

      // Descripción del proyecto
      {
        text: 'DESCRIPCIÓN DEL PROYECTO',
        style: 'sectionTitlePrimary',
        margin: [0, 0, 0, 10]
      },
      {
        text: quote.project?.description || 'Sin descripción',
        style: 'description',
        margin: [0, 0, 0, 20]
      },

      // Especificaciones
      {
        text: 'ESPECIFICACIONES',
        style: 'sectionTitlePrimary',
        margin: [0, 0, 0, 10]
      },
      {
        table: {
          widths: ['25%', '25%', '25%', '25%'],
          body: [
            [
              { text: 'Nivel de detalle:', style: 'tableLabel' },
              { text: quote.project?.detailLevel || quote.detailLevel || 'N/A', style: 'tableValue' },
              { text: 'Horas trabajadas:', style: 'tableLabel' },
              { text: quote.project?.hoursWorked || quote.hoursWorked || 'N/A', style: 'tableValue' }
            ],
            [
              { text: 'Uso comercial:', style: 'tableLabel' },
              { text: (quote.commercialLicenseFee > 0 || quote.isCommercial) ? 'Sí' : 'No', style: 'tableValue' },
              { text: 'Descuento:', style: 'tableLabel' },
              { text: `${quote.discountPercentage || 0}%`, style: 'tableValue' }
            ]
          ]
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 20]
      },

      // Desglose de precios
      {
        text: 'DESGLOSE DE PRECIOS',
        style: 'sectionTitlePrimary',
        margin: [0, 0, 0, 10]
      },
      {
        table: {
          widths: ['70%', '30%'],
          body: [
            [
              { text: 'Precio Base:', style: 'tableCell' },
              { text: `$${basePrice.toFixed(2)}`, style: 'tableAmount' }
            ],
            
            ...(commercialFee > 0 ? [[
              { text: `Uso Comercial (${commercialPercentage}%):`, style: 'tableCell' },
              { text: `+$${commercialFee.toFixed(2)}`, style: 'tableAmount' }
            ]] : []),
            
            ...(urgencyFee > 0 ? [[
              { text: `Urgencia (${urgencyPercentage}%):`, style: 'tableCell' },
              { text: `+$${urgencyFee.toFixed(2)}`, style: 'tableAmount' }
            ]] : []),
            
            ...(materialsCost > 0 ? [[
              { text: 'Materiales:', style: 'tableCell' },
              { text: `+$${materialsCost.toFixed(2)}`, style: 'tableAmount' }
            ]] : []),
            
            ...(shippingFee > 0 ? [[
              { text: 'Envío:', style: 'tableCell' },
              { text: `+$${shippingFee.toFixed(2)}`, style: 'tableAmount' }
            ]] : []),
            
            ...(certificateFee > 0 ? [[
              { text: 'Certificado:', style: 'tableCell' },
              { text: `+$${certificateFee.toFixed(2)}`, style: 'tableAmount' }
            ]] : []),

            [
              { text: 'Subtotal:', style: 'tableCellBold' },
              { text: `$${subtotal.toFixed(2)}`, style: 'tableAmountBold' }
            ],
            
            ...(quote.discountPercentage > 0 ? [[
              { text: `Descuento (${quote.discountPercentage}%):`, style: 'tableCell', color: 'red' },
              { text: `-$${discountAmount.toFixed(2)}`, style: 'tableAmount', color: 'red' }
            ]] : []),
            
            [
              { text: 'TOTAL:', style: 'tableCellTotal' },
              { 
                text: `$${finalTotal.toFixed(2)}`, 
                style: 'tableAmountTotal',
                fillColor: '#44ebd2 '
              }
            ]
          ]
        },
        layout: {
          hLineWidth: (i, node) => i === node.table.body.length - 1 ? 2 : 1,
          vLineWidth: () => 0,
          hLineColor: (i, node) => i === node.table.body.length - 1 ? '#000' : '#ddd',
          paddingLeft: () => 8,
          paddingRight: () => 8,
          paddingTop: () => 4,
          paddingBottom: () => 4
        },
        margin: [0, 0, 0, 30]
      },

      // Notas
      {
        text: 'NOTAS',
        style: 'sectionTitlePrimary',
        margin: [0, 0, 0, 10]
      },
      {
        text: quote.notes || 'Sin notas adicionales.',
        style: 'notes',
        margin: [0, 0, 0, 20]
      },

      // Términos y condiciones
      {
        text: 'TÉRMINOS Y CONDICIONES',
        style: 'sectionTitlePrimary',
        margin: [0, 0, 0, 10]
      },
      {
        ul: [
          'Esta cotización es válida por 30 días.',
          'Se requiere un anticipo del 50% para iniciar el proyecto.',
          'Los cambios mayores pueden generar costos adicionales.',
          'El tiempo de entrega puede variar según la complejidad.'
        ],
        style: 'terms'
      }
    ],

    // Pie de página
    footer: (currentPage, pageCount) => ({
      text: `Página ${currentPage} de ${pageCount}`,
      alignment: 'center',
      style: 'footer'
    }),

    // ✅ ESTILOS (sin cambios)
    styles: {
      companySubtitle: {
        fontSize: 14,
        bold: true,
        color: '#000'
      },
      contactInfo: {
        fontSize: 12,
        color: '#000'
      },
      sectionTitlePrimary: {
        fontSize: 14,
        bold: true,
        color: '#005c57'
      },
      sectionTitle: {
        fontSize: 14,
        bold: true,
        color: '#262629'
      },
      clientInfo: {
        fontSize: 12,
        color: '#262629'
      },
      projectInfo: {
        fontSize: 12,
        color: '#262629'
      },
      description: {
        fontSize: 10,
        color: '#555',
        lineHeight: 1.4
      },
      tableLabel: {
        fontSize: 10,
        bold: true,
        color: '#666'
      },
      tableValue: {
        fontSize: 10,
        color: '#262629'
      },
      tableCell: {
        fontSize: 12,
        color: '#262629'
      },
      tableCellBold: {
        fontSize: 12,
        bold: true,
        color: '#262629'
      },
      tableCellTotal: {
        fontSize: 14,
        bold: true,
        color: '#262629'
      },
      tableAmount: {
        fontSize: 10,
        alignment: 'right',
        color: '#262629'
      },
      tableAmountBold: {
        fontSize: 12,
        bold: true,
        alignment: 'right',
        color: '#262629'
      },
      tableAmountTotal: {
        fontSize: 14,
        bold: true,
        alignment: 'right',
        color: '#005c57' // Tu color original
      },
      notes: {
        fontSize: 12,
        color: '#555',
        lineHeight: 1.4
      },
      terms: {
        fontSize: 10,
        color: '#666',
        lineHeight: 1.3
      },
      footer: {
        fontSize: 8,
        color: '#999'
      }
    }
  };

  return pdfMake.createPdf(documentDefinition);
};

// Funciones auxiliares
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};