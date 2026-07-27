import { jsPDF } from "jspdf";
import { ReportMetadata, ReportFooter, ReportImage, PageConfig } from "../types";
import { CSIS_COVER_BANNER_SVG_MARKUP } from "../components/CsisCoverBanner";

// SVG Markups as strings for rendering to canvas
const SANTANDER_SVG_MARKUP = `
<svg viewBox="0 0 500 450" xmlns="http://www.w3.org/2000/svg">
  <g fill="#EC0000">
    <path d="M 250 35 C 240 65, 232 105, 232 140 C 232 175, 245 205, 245 205 C 220 185, 198 150, 192 125 C 188 100, 192 75, 192 75 C 178 98, 168 128, 168 162 C 168 205, 188 238, 188 238 C 128 238, 60 272, 60 332 C 60 392, 145 432, 250 432 C 355 432, 440 392, 440 332 C 440 272, 372 238, 312 238 C 312 238, 328 212, 328 178 C 328 132, 292 80, 250 35 Z"/>
  </g>
  <g fill="#FFFFFF">
    <path d="M 125 315 C 125 282, 172 260, 218 260 C 248 260, 262 278, 250 302 C 235 330, 185 365, 155 380 C 138 365, 125 342, 125 315 Z"/>
    <path d="M 205 292 C 218 262, 242 238, 262 208 C 278 185, 282 162, 276 142 C 288 168, 288 200, 272 228 C 255 258, 228 285, 218 312 C 210 338, 222 362, 242 378 C 222 368, 202 342, 205 292 Z"/>
  </g>
</svg>
`;

const COMEXA_SVG_MARKUP = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="15" y="10" width="70" height="60" fill="#000000" />
  <g stroke="#FFFFFF" stroke-width="2">
    <line x1="15" y1="14" x2="85" y2="14" />
    <line x1="15" y1="18" x2="85" y2="18" />
    <line x1="15" y1="22" x2="85" y2="22" />
    <line x1="15" y1="26" x2="85" y2="26" />
    <line x1="15" y1="30" x2="85" y2="30" />
    <line x1="15" y1="34" x2="85" y2="34" />
    <line x1="15" y1="38" x2="85" y2="38" />
    <line x1="15" y1="42" x2="85" y2="42" />
    <line x1="15" y1="46" x2="85" y2="46" />
    <line x1="15" y1="50" x2="85" y2="50" />
    <line x1="15" y1="54" x2="85" y2="54" />
    <line x1="15" y1="58" x2="85" y2="58" />
    <line x1="15" y1="62" x2="85" y2="62" />
    <line x1="15" y1="66" x2="85" y2="66" />
  </g>
  <path
    d="M 20 62 C 20 54, 25 45, 30 40 C 33 37, 36 36, 40 36 C 45 36, 49 38, 54 38 C 62 38, 71 35, 75 32 C 80 28, 83 23, 79 19 C 75 15, 68 17, 64 21 C 57 26, 55 29, 50 27 C 46 25, 49 19, 52 13 C 55 7, 50 3, 44 6 C 39 9, 38 16, 39 21 C 35 17, 31 13, 25 11 C 19 9, 15 13, 19 17 C 22 20, 27 22, 31 24 C 27 26, 21 29, 15 33 C 10 37, 12 43, 18 41 C 23 39, 29 35, 33 33 C 29 39, 25 47, 25 55 C 25 61, 28 66, 30 66 Z"
    fill="#FFE500"
  />
  <text
    x="50"
    y="92"
    text-anchor="middle"
    fill="#009EE0"
    font-size="17"
    font-weight="950"
    font-style="italic"
    font-family="sans-serif"
    letter-spacing="0.5"
  >
    COMEXA®
  </text>
</svg>
`;

const CITI_SVG_MARKUP = `
<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
  <path d="M 12 28 C 30 11, 70 11, 88 28 C 81 23, 66 18, 50 18 C 34 18, 19 23, 12 28 Z" fill="#ED1C24" />
  <text x="50" y="49" text-anchor="middle" fill="#002D62" font-size="29" font-weight="900" font-family="sans-serif" letter-spacing="-1.5">citi</text>
</svg>
`;

// Converts SVG markup directly to PNG Base64 for placement in jsPDF
const svgToPngDataUrl = (
  svgMarkup: string,
  width: number,
  height: number
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    const svg = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svg);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
      }
      const dataUrl = canvas.toDataURL("image/png");
      URL.revokeObjectURL(url);
      resolve(dataUrl);
    };
    img.onerror = () => {
      resolve("");
    };
    img.src = url;
  });
};

// Processed image handles: Sizing, rotation, and clipping to cell bounds
const processImageForCell = (
  imageUrl: string,
  rotation: number,
  fit: "contain" | "cover",
  targetWidth: number, // pixels
  targetHeight: number // pixels
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(imageUrl);
        return;
      }

      // Draw clean white background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Save state, translate to center to rotate
      ctx.save();
      ctx.translate(targetWidth / 2, targetHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      // Determine dimensions after rotation (is90or270 swaps visible dimensions)
      const is90or270 = rotation === 90 || rotation === 270;
      const originalWidth = img.naturalWidth || img.width || 800;
      const originalHeight = img.naturalHeight || img.height || 600;
      const rotatedWidth = is90or270 ? originalHeight : originalWidth;
      const rotatedHeight = is90or270 ? originalWidth : originalHeight;

      let drawW = originalWidth;
      let drawH = originalHeight;

      if (fit === "contain") {
        const scale = Math.min(
          targetWidth / rotatedWidth,
          targetHeight / rotatedHeight
        );
        drawW = originalWidth * scale;
        drawH = originalHeight * scale;
      } else {
        // cover
        const scale = Math.max(
          targetWidth / rotatedWidth,
          targetHeight / rotatedHeight
        );
        drawW = originalWidth * scale;
        drawH = originalHeight * scale;
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };
    img.onerror = () => {
      resolve(imageUrl);
    };
    img.src = imageUrl;
  });
};

export const generateReportPDF = async (
  metadata: ReportMetadata,
  footer: ReportFooter,
  images: ReportImage[],
  pageConfigs: PageConfig[],
  onProgress?: (progress: number) => void
): Promise<jsPDF> => {
  // Create jsPDF instance (Letter format, portrait, dimensions in mm)
  // Letter: 215.9 x 279.4 mm
  const isVideo = metadata.reportType === "extraccion_video";
  const doc = new jsPDF({
    orientation: isVideo ? "landscape" : "portrait",
    unit: "mm",
    format: "letter",
    compress: true,
  });

  const pageWidth = isVideo ? 279.4 : 215.9;
  const pageHeight = isVideo ? 215.9 : 279.4;

  if (isVideo) {
    // ==========================================
    // --- FORMAT B: VIDEO EXTRACTION (CITI) ---
    // ==========================================
    const citiLogoPng = await svgToPngDataUrl(CITI_SVG_MARKUP, 200, 120);
    const csisBannerPng = await svgToPngDataUrl(CSIS_COVER_BANNER_SVG_MARKUP, 1200, 650);
    const totalPages = 1 + Math.max(1, Math.ceil(images.length / 4));

    for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
      if (pageIdx > 0) {
        doc.addPage();
      }

      if (onProgress) {
        onProgress(Math.round(((pageIdx + 1) / totalPages) * 100));
      }

      const pageConfig = pageConfigs.find((c) => c.pageIndex === pageIdx) || {
        pageIndex: pageIdx,
        subHeader: "Evidencia de equipos Nvr´s USB",
        showSubHeader: true,
      };

      if (pageIdx === 0) {
        // --- COVER PAGE (NO IMAGES) ---
        if (metadata.coverImageUrl) {
          try {
            doc.addImage(metadata.coverImageUrl, "JPEG", 0, 0, 279.4, 115, undefined, "FAST");
          } catch {
            if (csisBannerPng) {
              doc.addImage(csisBannerPng, "PNG", 0, 0, 279.4, 115, undefined, "FAST");
            } else {
              doc.setFillColor(10, 15, 29);
              doc.rect(0, 0, 279.4, 115, "F");
            }
          }
        } else if (csisBannerPng) {
          doc.addImage(csisBannerPng, "PNG", 0, 0, 279.4, 115, undefined, "FAST");
        } else {
          // Top CSIS Banner fallback background
          doc.setFillColor(10, 15, 29);
          doc.rect(0, 0, 279.4, 115, "F");
        }

        // Cyan Metadata Box
        doc.setFillColor(0, 114, 206);
        doc.rect(0, 115, 279.4, 85, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(36);
        doc.text("Regional Command Center", 20, 135);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(18);
        doc.text("Evidencia de extracciones de vídeo en Nvr´s", 80, 152);

        doc.setFontSize(16);
        doc.text(`Sucursal: ${(metadata.sucursal || "").toUpperCase()}`, 20, 172);
        doc.text(`Incidente: ${(metadata.incidenteTask || "").toUpperCase()}`, 20, 182);
        doc.text(`Tecnico que atiende: ${(metadata.tecnicoAtiende || "").toUpperCase()}`, 20, 192);

        // Footer
        if (citiLogoPng) {
          doc.addImage(citiLogoPng, "PNG", 15, 202, 22, 13.2);
        }
      } else {
        // --- EVIDENCE PAGE (pageIdx > 0) ---
        if (pageConfig.showSubHeader && pageConfig.subHeader) {
          doc.setTextColor(37, 99, 235); // #2563EB - bright blue
          doc.setFont("helvetica", "normal");
          doc.setFontSize(22);
          doc.text(pageConfig.subHeader, pageWidth / 2, 15, { align: "center" });
        }

        // Slice 4 images for pageIdx - 1
        const currentImages = images.slice((pageIdx - 1) * 4, pageIdx * 4);

        for (let imgIdx = 0; imgIdx < 4; imgIdx++) {
          const image = currentImages[imgIdx];
          if (!image) continue;

          let cellX = 15;
          let cellY = 22;
          if (imgIdx === 1) cellX = 142.2;
          if (imgIdx === 2) cellY = 112;
          if (imgIdx === 3) { cellX = 142.2; cellY = 112; }

          const cellW = 122;
          const cellH = 85;

          doc.setDrawColor(203, 213, 225);
          doc.setLineWidth(0.35);
          doc.rect(cellX, cellY, cellW, cellH);

          try {
            const processedDataUrl = await processImageForCell(
              image.url,
              image.rotation,
              image.fit,
              800,
              600
            );

            doc.addImage(
              processedDataUrl,
              "JPEG",
              cellX + 0.2,
              cellY + 0.2,
              cellW - 0.4,
              cellH - 0.4
            );
          } catch (err) {
            console.error("Error rendering image on video page PDF cell", err);
          }
        }

        if (citiLogoPng) {
          doc.addImage(citiLogoPng, "PNG", 15, 202, 22, 13.2);
        }
        doc.setTextColor(100, 116, 139);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(`${pageIdx}`, 265, 210, { align: "right" });
      }
    }
    return doc;
  }

  // ==========================================
  // --- FORMAT A: PHOTO REPORT (SANTANDER) ---
  // ==========================================
  const marginX = 10;
  const contentWidth = pageWidth - marginX * 2; // 195.9mm

  // Pre-render logos to PNG
  const comexaLogoPng = await svgToPngDataUrl(COMEXA_SVG_MARKUP, 240, 240);
  const santanderLogoPng = await svgToPngDataUrl(SANTANDER_SVG_MARKUP, 200, 200);

  // Split images into pages (up to 4 images per page)
  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(images.length / pageSize));

  for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
    if (pageIdx > 0) {
      doc.addPage();
    }

    if (onProgress) {
      onProgress(Math.round(((pageIdx + 1) / totalPages) * 100));
    }

    const currentImages = images.slice(
      pageIdx * pageSize,
      (pageIdx + 1) * pageSize
    );

    // Get page config or default
    const pageConfig = pageConfigs.find((c) => c.pageIndex === pageIdx) || {
      pageIndex: pageIdx,
      subHeader: `${metadata.tipoTrabajo} ${metadata.fechaInventario}`,
      showSubHeader: true,
    };

    // --- 1. HEADER (Black Bar) ---
    const headerY = 10;
    const headerHeight = 16;
    doc.setFillColor(0, 0, 0);
    doc.rect(marginX, headerY, contentWidth, headerHeight, "F");

    // Left Side: COMEXA Logo & Subtexts
    if (comexaLogoPng) {
      doc.addImage(comexaLogoPng, "PNG", marginX + 3, headerY + 1.5, 13, 13);
    }
    doc.setTextColor(255, 255, 255); // White for primary labels in dark bar
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5);
    doc.text("INTEGRADORES Y DESARROLLADORES", marginX + 18, headerY + 4.5);
    doc.text("EN SISTEMAS ELECTRÓNICOS DE SEGURIDAD", marginX + 18, headerY + 6.5);
    doc.setTextColor(0, 158, 224); // Cyan for the third line
    doc.setFont("helvetica", "normal");
    doc.setFontSize(4.5);
    doc.text("Alarmas, CCTV, Incendio, Control de Acceso", marginX + 18, headerY + 8.5);

    // Center Text: REPORTE FOTOGRÁFICO
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("REPORTE FOTOGRÁFICO", marginX + 80, headerY + 10.5, {
      align: "center",
    });

    // Right Side: Santander logo
    if (santanderLogoPng) {
      doc.addImage(
        santanderLogoPng,
        "PNG",
        marginX + contentWidth - 30,
        headerY + 3,
        9,
        9
      );
    }
    doc.setTextColor(236, 0, 0); // Authentic Red for Santander
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Santander", marginX + contentWidth - 20, headerY + 9.5);

    // --- 2. METADATA SECTION ---
    const metaY = headerY + headerHeight + 5;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);

    // Left Column
    doc.text(`Sucursal: ${metadata.sucursal.toUpperCase()}`, marginX, metaY);
    doc.text(`C.C.: ${metadata.cc}`, marginX, metaY + 4);

    // Right Column
    doc.text(
      `Fecha de inventario: ${metadata.fechaInventario}`,
      marginX + contentWidth,
      metaY,
      { align: "right" }
    );
    doc.text(
      metadata.tipoTrabajo.toUpperCase(),
      marginX + contentWidth,
      metaY + 4,
      { align: "right" }
    );

    // Black divider line below metadata
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);
    doc.line(marginX, metaY + 6.5, marginX + contentWidth, metaY + 6.5);

    // --- 3. PAGE SUBHEADER (if active) ---
    let gridStartY = metaY + 9;
    if (pageConfig.showSubHeader && pageConfig.subHeader) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(pageConfig.subHeader.toUpperCase(), marginX + contentWidth / 2, metaY + 11.5, {
        align: "center",
      });
      gridStartY = metaY + 14;
    }

    // --- 4. IMAGE GRID (2x2) ---
    const gridHeight = 202;
    const cellWidth = contentWidth / 2; // 195.9 / 2 = 97.95mm
    const cellHeight = gridHeight / 2; // 202 / 2 = 101mm

    // Draw grid border & dividing lines
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    // Outer border
    doc.rect(marginX, gridStartY, contentWidth, gridHeight);
    // Horizontal divider
    doc.line(
      marginX,
      gridStartY + cellHeight,
      marginX + contentWidth,
      gridStartY + cellHeight
    );
    // Vertical divider
    doc.line(
      marginX + cellWidth,
      gridStartY,
      marginX + cellWidth,
      gridStartY + gridHeight
    );

    // Draw Watermark inside grid background
    if (comexaLogoPng) {
      doc.saveGraphicsState();
      const watermarkSize = 40;
      doc.setGState(new (doc as any).GState({ opacity: 0.04 }));
      doc.addImage(
        comexaLogoPng,
        "PNG",
        marginX + contentWidth / 2 - watermarkSize / 2,
        gridStartY + gridHeight / 2 - watermarkSize / 2,
        watermarkSize,
        watermarkSize
      );
      doc.restoreGraphicsState();
    }

    // Process and draw the up to 4 images
    for (let imgIdx = 0; imgIdx < pageSize; imgIdx++) {
      const image = currentImages[imgIdx];
      if (!image) continue;

      // Determine cell coordinates
      const row = Math.floor(imgIdx / 2);
      const col = imgIdx % 2;
      const cellX = marginX + col * cellWidth;
      const cellY = gridStartY + row * cellHeight;

      const targetPixelW = 800;
      const targetPixelH = Math.round(800 * (cellHeight / cellWidth));

      try {
        const processedDataUrl = await processImageForCell(
          image.url,
          image.rotation,
          image.fit,
          targetPixelW,
          targetPixelH
        );

        doc.addImage(
          processedDataUrl,
          "JPEG",
          cellX + 0.2,
          cellY + 0.2,
          cellWidth - 0.4,
          cellHeight - 0.4
        );
      } catch (err) {
        console.error("Error drawing image onto PDF cell", err);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text("Error al cargar imagen", cellX + 5, cellY + cellHeight / 2);
      }
    }

    // --- 5. FOOTER BLOCK ---
    const footerY = 265;
    doc.setDrawColor(242, 169, 0); // COMEXA Gold
    doc.setLineWidth(1);
    doc.line(marginX, footerY, marginX + contentWidth, footerY);

    doc.setTextColor(0, 91, 150); // Muted corporate blue
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.text(footer.direccion.toUpperCase(), marginX + contentWidth / 2, footerY + 3.5, {
      align: "center",
    });

    doc.setFontSize(6);
    doc.text(
      `TEL. ${footer.telefono.toUpperCase()}   |   ${footer.comexaInfo.toUpperCase()}`,
      marginX + contentWidth / 2,
      footerY + 6.5,
      { align: "center" }
    );

    doc.setFont("helvetica", "bold");
    doc.text(footer.permiso.toUpperCase(), marginX, footerY + 11);

    doc.text(footer.expediente.toUpperCase(), marginX + contentWidth, footerY + 11, {
      align: "right",
    });
  }

  return doc;
};
