import { jsPDF } from "jspdf";
import { ReportMetadata, ReportFooter, ReportImage, PageConfig, DateBlock, PageInfo } from "../types";
import { CSIS_COVER_BANNER_SVG_MARKUP } from "../components/CsisCoverBanner";
import { COMEXA_LOGO_SRC } from "../assets/comexaLogoBase64";

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
<svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
  <rect width="180" height="120" rx="4" fill="#FFFFFF" />
  <rect x="42" y="10" width="96" height="72" fill="#000000" />
  <g stroke="#FFFFFF" stroke-width="2.2">
    <line x1="42" y1="15" x2="138" y2="15" />
    <line x1="42" y1="20" x2="138" y2="20" />
    <line x1="42" y1="25" x2="138" y2="25" />
    <line x1="42" y1="30" x2="138" y2="30" />
    <line x1="42" y1="35" x2="138" y2="35" />
    <line x1="42" y1="40" x2="138" y2="40" />
    <line x1="42" y1="45" x2="138" y2="45" />
    <line x1="42" y1="50" x2="138" y2="50" />
    <line x1="42" y1="55" x2="138" y2="55" />
    <line x1="42" y1="60" x2="138" y2="60" />
    <line x1="42" y1="65" x2="138" y2="65" />
    <line x1="42" y1="70" x2="138" y2="70" />
    <line x1="42" y1="75" x2="138" y2="75" />
  </g>
  <path
    d="M 48 82 C 48 74, 53 62, 60 52 C 63 48, 67 44, 70 38 C 66 35, 60 30, 53 26 C 48 24, 45 22, 45 20 C 45 18, 48 19, 52 22 C 55 24, 58 24, 58 21 C 58 19, 54 14, 53 12 C 53 10, 56 11, 59 14 C 62 17, 65 17, 65 14 C 65 12, 63 9, 63 7 C 63 5, 67 7, 70 10 C 73 14, 76 14, 77 12 C 78 10, 78 7, 79 6 C 80 5, 82 8, 83 12 C 84 17, 83 22, 82 28 C 83 31, 85 33, 88 33 C 89 29, 89 19, 89 15 C 90 13, 92 16, 93 19 C 94 23, 97 23, 98 20 C 99 17, 102 12, 103 10 C 104 9, 106 12, 107 16 C 108 20, 111 20, 113 18 C 115 16, 119 13, 120 12 C 121 11, 122 14, 121 18 C 119 22, 122 24, 125 22 C 128 21, 133 19, 135 19 C 137 19, 135 23, 131 26 C 125 30, 119 34, 113 36 C 109 37, 105 38, 102 40 C 104 41, 111 43, 118 45 C 124 46, 130 48, 131 51 C 132 54, 131 58, 127 59 C 122 60, 117 59, 113 59 C 112 62, 112 67, 113 71 C 113 73, 111 73, 110 71 C 108 68, 107 64, 107 61 C 107 61, 110 70, 115 82 Z"
    fill="#FFE600"
  />
  <text
    x="90"
    y="107"
    text-anchor="middle"
    fill="#009EE0"
    font-size="23"
    font-weight="900"
    font-style="italic"
    font-family="sans-serif"
    letter-spacing="0.8"
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

export const buildPagesFromBlocks = (
  dateBlocks: DateBlock[],
  metadata: ReportMetadata
): PageInfo[] => {
  const isVideo = metadata.reportType === "extraccion_video";
  const pages: PageInfo[] = [];

  if (isVideo) {
    pages.push({
      pageIndex: 0,
      isCover: true,
      fecha: metadata.fechaInventario,
      subHeaderDefault: "Evidencia de extracciones de vídeo en Nvr´s",
      images: [],
    });
  }

  dateBlocks.forEach((block, blockIdx) => {
    const blockPages = Math.max(1, Math.ceil(block.images.length / 4));
    for (let p = 0; p < blockPages; p++) {
      const pageIndex = pages.length;
      const pageImages = block.images.slice(p * 4, (p + 1) * 4);

      let defaultSubHeader = "";
      if (isVideo) {
        defaultSubHeader = `${block.fecha}`;
      } else {
        defaultSubHeader = `${metadata.tipoTrabajo || "MANTENIMIENTO"} ${block.fecha}`;
      }

      pages.push({
        pageIndex,
        isCover: false,
        blockId: block.id,
        blockIndex: blockIdx,
        pageInBlock: p,
        fecha: block.fecha,
        subHeaderDefault: defaultSubHeader,
        images: pageImages,
      });
    }
  });

  if (pages.length === 0) {
    pages.push({
      pageIndex: 0,
      isCover: false,
      fecha: metadata.fechaInventario,
      subHeaderDefault: `${metadata.tipoTrabajo || "MANTENIMIENTO"} ${metadata.fechaInventario}`,
      images: [],
    });
  }

  return pages;
};

export const generateReportPDF = async (
  metadata: ReportMetadata,
  footer: ReportFooter,
  imagesOrBlocks: ReportImage[] | DateBlock[],
  pageConfigs: PageConfig[],
  onProgress?: (progress: number) => void
): Promise<jsPDF> => {
  const isVideo = metadata.reportType === "extraccion_video";

  let pages: PageInfo[] = [];
  if (
    Array.isArray(imagesOrBlocks) &&
    imagesOrBlocks.length > 0 &&
    "fecha" in imagesOrBlocks[0]
  ) {
    pages = buildPagesFromBlocks(imagesOrBlocks as DateBlock[], metadata);
  } else {
    const fallbackBlock: DateBlock = {
      id: "block-1",
      fecha: metadata.fechaInventario,
      titulo: "",
      images: (imagesOrBlocks as ReportImage[]) || [],
    };
    pages = buildPagesFromBlocks([fallbackBlock], metadata);
  }

  // Create jsPDF instance (Letter format, portrait, dimensions in mm)
  // Letter: 215.9 x 279.4 mm
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
    // --- FORMAT B: VIDEO EXTRACTION ---
    // ==========================================
    const csisBannerPng = await svgToPngDataUrl(CSIS_COVER_BANNER_SVG_MARKUP, 1200, 650);
    const totalPages = pages.length;

    for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
      const page = pages[pageIdx];
      if (pageIdx > 0) {
        doc.addPage();
      }

      if (onProgress) {
        onProgress(Math.round(((pageIdx + 1) / totalPages) * 100));
      }

      const pageConfig = pageConfigs.find((c) => c.pageIndex === pageIdx) || {
        pageIndex: pageIdx,
        subHeader: page.subHeaderDefault,
        showSubHeader: !page.isCover,
      };

      if (page.isCover) {
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
      } else {
        // --- EVIDENCE PAGE (pageIdx > 0) ---
        if (pageConfig.showSubHeader && pageConfig.subHeader) {
          doc.setTextColor(37, 99, 235); // #2563EB - bright blue
          doc.setFont("helvetica", "normal");
          doc.setFontSize(22);
          doc.text(pageConfig.subHeader, pageWidth / 2, 15, { align: "center" });
        }

        for (let imgIdx = 0; imgIdx < 4; imgIdx++) {
          const image = page.images[imgIdx];
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

  // Pre-render logos
  const comexaLogoPng = COMEXA_LOGO_SRC;
  const santanderLogoPng = await svgToPngDataUrl(SANTANDER_SVG_MARKUP, 200, 200);

  const totalPages = pages.length;

  for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
    const page = pages[pageIdx];
    if (pageIdx > 0) {
      doc.addPage();
    }

    if (onProgress) {
      onProgress(Math.round(((pageIdx + 1) / totalPages) * 100));
    }

    // Get page config or default
    const pageConfig = pageConfigs.find((c) => c.pageIndex === pageIdx) || {
      pageIndex: pageIdx,
      subHeader: page.subHeaderDefault,
      showSubHeader: true,
    };

    // --- 1. HEADER (Black Bar) ---
    const headerY = 10;
    const headerHeight = 15;
    doc.setFillColor(0, 0, 0);
    doc.rect(marginX, headerY, contentWidth, headerHeight, "F");

    // Left Side: COMEXA Logo (Directly from user's GitHub image)
    if (comexaLogoPng) {
      doc.addImage(comexaLogoPng, "JPEG", marginX + 2, headerY + 1.5, 17.8, 12);
    }

    // Center Text: REPORTE FOTOGRÁFICO (Strictly Centered horizontally on contentWidth)
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    doc.text("REPORTE FOTOGRÁFICO", marginX + contentWidth / 2, headerY + 9.5, {
      align: "center",
    });

    // Right Side: Santander logo (Safely within right margin)
    const santanderRightPadding = 4;
    const santanderTotalWidth = 26; // 6mm logo + 2mm gap + ~18mm text
    const santanderStartX = marginX + contentWidth - santanderTotalWidth - santanderRightPadding;

    if (santanderLogoPng) {
      doc.addImage(
        santanderLogoPng,
        "PNG",
        santanderStartX,
        headerY + 4,
        6.5,
        6.5
      );
    }
    doc.setTextColor(236, 0, 0); // Authentic Red for Santander
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Santander", santanderStartX + 8, headerY + 9.5);

    // --- 2. METADATA SECTION ---
    const metaY = headerY + headerHeight + 5;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);

    // Left Column
    doc.text(`Sucursal: ${metadata.sucursal.toUpperCase()}`, marginX, metaY);
    doc.text(`C.C.: ${metadata.cc}`, marginX, metaY + 4);

    // Right Column
    const pageDate = page.fecha || metadata.fechaInventario;
    doc.text(
      `Fecha de inventario: ${pageDate}`,
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
    for (let imgIdx = 0; imgIdx < 4; imgIdx++) {
      const image = page.images[imgIdx];
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
    const footerY = 267;
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
  }

  return doc;
};
