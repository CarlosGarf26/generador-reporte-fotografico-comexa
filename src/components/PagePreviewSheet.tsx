import React, { useRef } from "react";
import { ReportMetadata, ReportFooter, ReportImage, PageConfig } from "../types";
import { ComexaLogo, SantanderLogo, CitiLogo, ComexaWatermark } from "./Logos";
import { RotateCw, Trash2, Maximize2, Minimize2, Upload, Video, Image as ImageIcon } from "lucide-react";
import { CsisCoverBanner } from "./CsisCoverBanner";

interface PagePreviewSheetProps {
  pageIndex: number;
  totalPages: number;
  metadata: ReportMetadata;
  footer: ReportFooter;
  images: ReportImage[]; // Up to 4 images
  pageConfig: PageConfig;
  onUpdatePageConfig: (pageIndex: number, config: Partial<PageConfig>) => void;
  onCellImageRotate: (imageId: string) => void;
  onCellImageToggleFit: (imageId: string) => void;
  onCellImageDelete: (imageId: string) => void;
  onCellUploadClick: (pageIdx: number, slotIdx: number) => void;
  onCellImagePaste?: (file: File, pageIndex: number, slotIdx: number) => void;
  onUpdateCoverImage?: (url: string) => void;
}

export const PagePreviewSheet: React.FC<PagePreviewSheetProps> = ({
  pageIndex,
  totalPages,
  metadata,
  footer,
  images,
  pageConfig,
  onUpdatePageConfig,
  onCellImageRotate,
  onCellImageToggleFit,
  onCellImageDelete,
  onCellUploadClick,
  onCellImagePaste,
  onUpdateCoverImage,
}) => {
  const isVideoReport = metadata.reportType === "extraccion_video";

  const handlePaste = (e: React.ClipboardEvent, slotIdx: number) => {
    if (!onCellImagePaste) return;
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          e.stopPropagation();
          onCellImagePaste(file, pageIndex, slotIdx);
          break;
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, slotIdx: number, hasImage: boolean) => {
    if ((e.key === "Enter" || e.key === " ") && !hasImage) {
      e.preventDefault();
      onCellUploadClick(pageIndex, slotIdx);
    }
  };

  // --- RENDERING FORMAT B: VIDEO EXTRACTION (CITI / CSIS) ---
  if (isVideoReport) {
    const isCoverPage = pageIndex === 0;
    const imageSlots = [0, 1, 2, 3];

    if (isCoverPage) {
      // --- COVER PAGE WITH 4 IMAGES ---
      return (
        <div
          className="bg-white border border-gray-300 shadow-lg mx-auto print-page flex flex-col justify-between overflow-hidden relative"
          style={{
            width: "215.9mm",
            height: "279.4mm",
            padding: "8mm 12mm 10mm 12mm",
            boxSizing: "border-box",
          }}
          id={`report-page-${pageIndex}`}
        >
          {/* Subtle Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
            <ComexaWatermark className="w-56 h-56 opacity-[0.02]" />
          </div>

          {/* 1. Compact Cover Header Banner: CSIS Regional Command Center Artwork */}
          <div className="rounded-xl w-full h-[40mm] relative overflow-hidden group select-none border border-slate-200 shadow-2xs shrink-0 z-10">
            <CsisCoverBanner customUrl={metadata.coverImageUrl} />
            
            {/* Overlay button to replace cover image if user wants */}
            <div className="no-print absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all z-30">
              <label className="flex items-center gap-1 px-2.5 py-1 bg-slate-900/80 hover:bg-slate-900 text-white text-[10px] font-semibold rounded-md cursor-pointer backdrop-blur-xs shadow-md">
                <ImageIcon className="w-3 h-3 text-sky-400" />
                <span>{metadata.coverImageUrl ? "Cambiar Imagen" : "Subir Banner"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && onUpdateCoverImage) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        onUpdateCoverImage(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* 2. Compact Cyan to Navy Blue Metadata Bar */}
          <div className="bg-gradient-to-r from-[#00A3E0] via-[#0072CE] to-[#003B70] rounded-lg p-2.5 my-1.5 shrink-0 text-white shadow-2xs z-10 font-sans">
            <div className="flex items-center justify-between border-b border-white/20 pb-1 mb-1.5">
              <h2 className="text-xs font-bold tracking-tight text-white uppercase select-none">
                Regional Command Center
              </h2>
              <span className="text-[10px] text-sky-100 font-medium select-none">
                Evidencia de extracciones de vídeo Dvr´s y Nvr´s
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] font-medium select-text">
              <div>
                <span className="block text-[9px] text-sky-200 uppercase font-bold">Sucursal:</span>
                <span className="font-bold text-white uppercase truncate block">
                  {metadata.sucursal || "4101 VALLE DE ARAGON"}
                </span>
              </div>

              <div>
                <span className="block text-[9px] text-sky-200 uppercase font-bold">Incidente / Task:</span>
                <span className="font-bold text-white uppercase truncate block">
                  {metadata.incidenteTask || "SCTASK0000883852"}
                </span>
              </div>

              <div>
                <span className="block text-[9px] text-sky-200 uppercase font-bold">Técnico que atiende:</span>
                <span className="font-bold text-white uppercase truncate block">
                  {metadata.tecnicoAtiende || "ERICK GABRIEL PEREZ ESPINOZA"}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Section Sub-Header */}
          <div className="w-full text-center border-b border-gray-150 pb-1 z-10 shrink-0">
            {pageConfig.showSubHeader ? (
              <input
                type="text"
                value={pageConfig.subHeader || "Evidencia de equipos Nvr´s"}
                onChange={(e) =>
                  onUpdatePageConfig(pageIndex, { subHeader: e.target.value })
                }
                placeholder="EVIDENCIA DE EQUIPOS (Haga clic para editar)"
                className="w-full text-center text-sm font-black text-[#004B87] tracking-wide uppercase bg-transparent hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-sky-500 focus:outline-none py-0.5 px-2 rounded transition-all font-sans"
              />
            ) : (
              <div className="h-4" />
            )}
          </div>

          {/* 4. 4-Image Grid Area (2x2 Grid) */}
          <div className="flex-1 my-1.5 grid grid-cols-2 grid-rows-2 gap-3 z-10 overflow-hidden"
               style={{ maxHeight: "155mm" }}
          >
            {imageSlots.map((slotIdx) => {
              const img = images[slotIdx];
              const hasImage = !!img;

              return (
                <div
                  key={slotIdx}
                  tabIndex={0}
                  onPaste={(e) => handlePaste(e, slotIdx)}
                  onKeyDown={(e) => handleKeyDown(e, slotIdx, hasImage)}
                  className="relative border border-slate-300 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center group/cell h-full shadow-2xs focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                >
                  {hasImage ? (
                    <>
                      <img
                        src={img.url}
                        alt={img.name}
                        referrerPolicy="no-referrer"
                        style={{ transform: `rotate(${img.rotation}deg)` }}
                        className={`w-full h-full transition-transform ${
                          img.fit === "contain" ? "object-contain p-1" : "object-cover"
                        }`}
                      />
                      {/* Cell controls */}
                      <div className="no-print absolute inset-0 bg-black/40 opacity-0 group-hover/cell:opacity-100 flex flex-col items-center justify-center gap-2 transition-all duration-150 z-20">
                        <span className="text-[10px] font-bold text-white bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-xs max-w-[150px] truncate mb-1">
                          {img.name}
                        </span>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => onCellImageRotate(img.id)}
                            className="p-1.5 bg-white text-gray-800 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors shadow-sm"
                            title="Rotar 90°"
                          >
                            <RotateCw className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onCellImageToggleFit(img.id)}
                            className="p-1.5 bg-white text-gray-800 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors shadow-sm"
                            title={img.fit === "contain" ? "Llenar espacio" : "Ajustar"}
                          >
                            {img.fit === "contain" ? (
                              <Maximize2 className="w-4 h-4" />
                            ) : (
                              <Minimize2 className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => onCellImageDelete(img.id)}
                            className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                            title="Quitar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onCellUploadClick(pageIndex, slotIdx)}
                      className="no-print absolute inset-0 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-sky-600 hover:bg-sky-50/30 transition-all cursor-pointer w-full h-full"
                    >
                      <Upload className="w-5 h-5 stroke-1.5" />
                      <span className="text-[10px] font-bold">Clic para insertar foto</span>
                      <span className="text-[8px] text-gray-400">Celda {slotIdx + 1} de la Pág. {pageIndex + 1} • Ctrl+V para pegar</span>
                    </button>
                  )}
                  <span className="no-print absolute top-1.5 left-1.5 text-[8px] font-mono bg-gray-900/60 text-white font-bold px-1 rounded select-none">
                    Celda {slotIdx + 1}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 5. Cover Page Footer */}
          <div className="flex justify-between items-center border-t border-slate-100 pt-2 select-none shrink-0 z-10">
            <CitiLogo className="h-8" />
            <span className="text-xs font-black text-sky-800 font-sans uppercase">
              PÁGINA {pageIndex + 1} DE {totalPages}
            </span>
          </div>
        </div>
      );
    } else {
      // --- EVIDENCE PAGES (pageIndex > 0) ---
      const imageSlots = [0, 1, 2, 3];

      return (
        <div
          className="bg-white border border-gray-300 shadow-lg mx-auto print-page flex flex-col justify-between overflow-hidden relative"
          style={{
            width: "215.9mm",
            height: "279.4mm",
            padding: "10mm 12mm 12mm 12mm",
            boxSizing: "border-box",
          }}
          id={`report-page-${pageIndex}`}
        >
          {/* Subtle Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
            <ComexaWatermark className="w-56 h-56 opacity-[0.02]" />
          </div>

          {/* 1. Header (Static editable text aligned center) */}
          <div className="w-full text-center border-b border-gray-150 pb-2.5 z-10 shrink-0">
            {pageConfig.showSubHeader ? (
              <input
                type="text"
                value={pageConfig.subHeader || "Evidencia de equipos Nvr´s"}
                onChange={(e) =>
                  onUpdatePageConfig(pageIndex, { subHeader: e.target.value })
                }
                placeholder="EVIDENCIA DE EQUIPOS (Haga clic para editar)"
                className="w-full text-center text-lg font-black text-[#004B87] tracking-wide uppercase bg-transparent hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-sky-500 focus:outline-none py-1 px-2 rounded transition-all select-all font-sans"
              />
            ) : (
              <div className="h-6" />
            )}
          </div>

          {/* 2. 4-Image Layout Area (2x2 Grid) */}
          <div className="flex-1 my-6 grid grid-cols-2 grid-rows-2 gap-4 z-10 overflow-hidden"
               style={{ maxHeight: "205mm" }}
          >
            {imageSlots.map((slotIdx) => {
              const img = images[slotIdx];
              const hasImage = !!img;

              return (
                <div
                  key={slotIdx}
                  tabIndex={0}
                  onPaste={(e) => handlePaste(e, slotIdx)}
                  onKeyDown={(e) => handleKeyDown(e, slotIdx, hasImage)}
                  className="relative border border-slate-300 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center group/cell h-full shadow-2xs focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                >
                  {hasImage ? (
                    <>
                      <img
                        src={img.url}
                        alt={img.name}
                        referrerPolicy="no-referrer"
                        style={{ transform: `rotate(${img.rotation}deg)` }}
                        className={`w-full h-full transition-transform ${
                          img.fit === "contain" ? "object-contain p-1" : "object-cover"
                        }`}
                      />
                      {/* Cell controls */}
                      <div className="no-print absolute inset-0 bg-black/40 opacity-0 group-hover/cell:opacity-100 flex flex-col items-center justify-center gap-2 transition-all duration-150 z-20">
                        <span className="text-[10px] font-bold text-white bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-xs max-w-[150px] truncate mb-1">
                          {img.name}
                        </span>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => onCellImageRotate(img.id)}
                            className="p-1.5 bg-white text-gray-800 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors shadow-sm"
                            title="Rotar 90°"
                          >
                            <RotateCw className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onCellImageToggleFit(img.id)}
                            className="p-1.5 bg-white text-gray-800 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors shadow-sm"
                            title={img.fit === "contain" ? "Llenar espacio" : "Ajustar"}
                          >
                            {img.fit === "contain" ? (
                              <Maximize2 className="w-4 h-4" />
                            ) : (
                              <Minimize2 className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => onCellImageDelete(img.id)}
                            className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                            title="Quitar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onCellUploadClick(pageIndex, slotIdx)}
                      className="no-print absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50/30 transition-all cursor-pointer w-full h-full"
                    >
                      <Upload className="w-6 h-6 stroke-1.5" />
                      <span className="text-[10px] font-bold">Clic para insertar foto</span>
                      <span className="text-[8px] text-gray-400">Celda {slotIdx + 1} de la Pág. {pageIndex + 1} • Ctrl+V para pegar</span>
                    </button>
                  )}
                  <span className="no-print absolute top-2 left-2 text-[8px] font-mono bg-gray-900/60 text-white font-bold px-1 rounded select-none">
                    Celda {slotIdx + 1}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 3. Footer (Logo and Page number) */}
          <div className="flex justify-between items-center border-t border-slate-100 pt-3 select-none shrink-0 z-10">
            {/* Citi Logo on left */}
            <CitiLogo className="h-9" />
            <span className="text-xs font-black text-sky-800 font-sans uppercase">
              PÁGINA {pageIndex + 1} DE {totalPages}
            </span>
          </div>
        </div>
      );
    }
  }

  // --- RENDERING FORMAT A: STANDARD PHOTO REPORT (COMEXA / SANTANDER) ---
  const cells = [0, 1, 2, 3]; // 2x2 grid slots

  return (
    <div className="bg-white border border-gray-300 shadow-lg mx-auto print-page flex flex-col justify-between overflow-hidden relative"
         style={{
           width: "215.9mm",
           height: "279.4mm",
           padding: "10mm",
           boxSizing: "border-box",
         }}
         id={`report-page-${pageIndex}`}
    >
      {/* 1. HEADER (Black Bar) */}
      <div className="bg-black text-white p-3 flex justify-between items-center h-[54px] rounded-xs select-none">
        {/* Left Side: COMEXA logo */}
        <ComexaLogo className="h-9 sm:h-10" darkTheme={true} />
        
        {/* Center Title */}
        <div className="text-center flex-1 mx-2">
          <h1 className="text-base font-bold tracking-widest font-sans uppercase">
            REPORTE FOTOGRÁFICO
          </h1>
        </div>

        {/* Right Side: Santander logo */}
        <SantanderLogo className="h-7 sm:h-8" />
      </div>

      {/* 2. METADATA FIELD GRID */}
      <div className="mt-4 grid grid-cols-2 gap-y-1 text-xs border-b border-black pb-1.5 select-none font-sans font-bold">
        {/* Left Column */}
        <div className="space-y-0.5 text-gray-900">
          <p>Sucursal: <span className="font-semibold">{metadata.sucursal.toUpperCase()}</span></p>
          <p>C.C.: <span className="font-semibold">{metadata.cc}</span></p>
        </div>
        
        {/* Right Column */}
        <div className="space-y-0.5 text-right text-gray-900">
          <p>Fecha de inventario: <span className="font-semibold">{metadata.fechaInventario}</span></p>
          <p className="text-red-600 font-extrabold uppercase">{metadata.tipoTrabajo}</p>
        </div>
      </div>

      {/* 3. DYNAMIC PAGE SUB-HEADER */}
      <div className="mt-2.5 mb-1.5 flex flex-col items-center">
        {pageConfig.showSubHeader ? (
          <input
            type="text"
            value={pageConfig.subHeader}
            onChange={(e) =>
              onUpdatePageConfig(pageIndex, { subHeader: e.target.value })
            }
            placeholder="SUB-ENCABEZADO DE SECCIÓN (Haga clic para editar)"
            className="w-full text-center text-xs font-bold text-gray-900 tracking-wide uppercase border-b border-transparent hover:border-gray-300 hover:bg-gray-50 focus:bg-white focus:border-indigo-500 focus:outline-none py-0.5 rounded transition-all select-all text-xs"
          />
        ) : (
          <div className="h-4" /> /* Empty spacer to preserve layout spacing */
        )}
      </div>

      {/* 4. MAIN IMAGE GRID (2x2) */}
      <div className="relative border border-black flex-1 grid grid-cols-2 grid-rows-2 overflow-hidden bg-white"
           style={{ maxHeight: "202mm" }}
      >
        {/* Subtle Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <ComexaWatermark className="w-56 h-56 opacity-[0.035]" />
        </div>

        {cells.map((slotIdx) => {
          const image = images[slotIdx];
          const hasImage = !!image;

          return (
            <div
              key={slotIdx}
              tabIndex={0}
              onPaste={(e) => handlePaste(e, slotIdx)}
              onKeyDown={(e) => handleKeyDown(e, slotIdx, hasImage)}
              className={`relative flex items-center justify-center border border-black overflow-hidden bg-white/10 group/cell z-10 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all`}
            >
              {hasImage ? (
                <>
                  {/* Real Image Render */}
                  <img
                    src={image.url}
                    alt={image.name}
                    referrerPolicy="no-referrer"
                    style={{ transform: `rotate(${image.rotation}deg)` }}
                    className={`w-full h-full transition-transform ${
                      image.fit === "contain" ? "object-contain p-1" : "object-cover"
                    }`}
                  />

                  {/* Overlaid Cell Quick controls on Hover (Hidden in Print) */}
                  <div className="no-print absolute inset-0 bg-black/40 opacity-0 group-hover/cell:opacity-100 flex flex-col items-center justify-center gap-2 transition-all duration-150 z-20">
                    <span className="text-[10px] font-bold text-white bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-xs max-w-[150px] truncate mb-1">
                      {image.name}
                    </span>
                    
                    <div className="flex gap-1.5">
                      {/* Rotate */}
                      <button
                        type="button"
                        onClick={() => onCellImageRotate(image.id)}
                        className="p-1.5 bg-white text-gray-800 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors shadow-sm"
                        title="Rotar 90°"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>

                      {/* Resize */}
                      <button
                        type="button"
                        onClick={() => onCellImageToggleFit(image.id)}
                        className="p-1.5 bg-white text-gray-800 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors shadow-sm"
                        title={image.fit === "contain" ? "Llenar espacio (Cover)" : "Ajustar imagen (Contain)"}
                      >
                        {image.fit === "contain" ? (
                          <Maximize2 className="w-4 h-4" />
                        ) : (
                          <Minimize2 className="w-4 h-4" />
                        )}
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => onCellImageDelete(image.id)}
                        className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                        title="Quitar imagen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Empty Upload Slot Control */
                <button
                  type="button"
                  onClick={() => onCellUploadClick(pageIndex, slotIdx)}
                  className="no-print absolute inset-0 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-indigo-600 hover:bg-gray-50/50 transition-colors cursor-pointer w-full h-full"
                >
                  <Upload className="w-6 h-6 stroke-1.5" />
                  <span className="text-[10px] font-semibold">Clic para insertar foto</span>
                  <span className="text-[8px] text-gray-400">Slot {slotIdx + 1} de la Pág. {pageIndex + 1} • Ctrl+V para pegar</span>
                </button>
              )}

              {/* Slot Index Label (Top-Left, Hidden in Print) */}
              <span className="no-print absolute top-1.5 left-1.5 text-[8px] font-mono bg-gray-900/60 text-white font-bold px-1 rounded select-none">
                Celda {slotIdx + 1}
              </span>
            </div>
          );
        })}
      </div>

      {/* 5. FOOTER BLOCK */}
      <div className="mt-4 flex flex-col justify-end select-none">
        {/* Amber separator line */}
        <div className="w-full h-[1.5px] bg-[#F2A900] mb-2" />

        {/* Corporate Address & Details */}
        <div className="text-center text-[7.5px] text-sky-800 font-extrabold tracking-wide uppercase leading-tight font-sans">
          <p>{footer.direccion}</p>
          <p className="mt-0.5">
            TEL. {footer.telefono}   |   {footer.comexaInfo}
          </p>
        </div>

        {/* Dynamic metadata bottom fields */}
        <div className="mt-2.5 flex justify-between text-[7px] text-sky-800 font-bold uppercase tracking-wider font-sans">
          <span>{footer.permiso}</span>
          <span className="text-[9px] font-extrabold text-indigo-700 no-print">
            PÁGINA {pageIndex + 1} DE {totalPages}
          </span>
          <span>{footer.expediente}</span>
        </div>
      </div>
    </div>
  );
};
