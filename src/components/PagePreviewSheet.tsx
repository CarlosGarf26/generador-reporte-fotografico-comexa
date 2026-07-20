import React from "react";
import { ReportMetadata, ReportFooter, ReportImage, PageConfig } from "../types";
import { ComexaLogo, SantanderLogo, CitiLogo, ComexaWatermark } from "./Logos";
import { RotateCw, Trash2, Maximize2, Minimize2, Upload, Video } from "lucide-react";

interface PagePreviewSheetProps {
  pageIndex: number;
  totalPages: number;
  metadata: ReportMetadata;
  footer: ReportFooter;
  images: ReportImage[]; // Up to 4 images for photographic, up to 3 for video extraction
  pageConfig: PageConfig;
  onUpdatePageConfig: (pageIndex: number, config: Partial<PageConfig>) => void;
  onCellImageRotate: (imageId: string) => void;
  onCellImageToggleFit: (imageId: string) => void;
  onCellImageDelete: (imageId: string) => void;
  onCellUploadClick: (pageIdx: number, slotIdx: number) => void;
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
}) => {
  const isVideoReport = metadata.reportType === "extraccion_video";

  // --- RENDERING FORMAT B: VIDEO EXTRACTION (CITI / CSIS) ---
  if (isVideoReport) {
    const isCoverPage = pageIndex === 0;

    if (isCoverPage) {
      // --- COVER PAGE ---
      return (
        <div
          className="bg-white border border-gray-300 shadow-lg mx-auto print-page flex flex-col justify-between overflow-hidden relative"
          style={{
            width: "215.9mm",
            height: "279.4mm",
            padding: "12mm 15mm 15mm 15mm",
            boxSizing: "border-box",
          }}
          id={`report-page-${pageIndex}`}
        >
          {/* Cover Header Banner: High-Tech Regional Command Center simulation */}
          <div className="bg-[#0a0f1d] rounded-2xl w-full h-[110mm] relative overflow-hidden flex flex-col justify-between p-6 select-none border border-slate-800">
            {/* Grid background overlay */}
            <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
            
            {/* Ambient glows */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            
            {/* High-tech tech rings / decorative elements */}
            <div className="absolute left-[8%] top-[15%] w-32 h-32 border border-slate-700/30 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-24 h-24 border border-dashed border-slate-600/25 rounded-full" />
            </div>

            {/* Top tiny bar */}
            <div className="flex justify-between items-center z-10 w-full">
              <span className="text-[7px] font-mono tracking-widest text-slate-500 uppercase">
                COMEXA SECURITY OPERATIONS
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[7px] font-mono font-bold text-slate-400">
                  SYSTEM CONNECTED
                </span>
              </div>
            </div>

            {/* Center Area: Globe & CSIS Badge */}
            <div className="flex-1 flex items-center justify-center gap-8 z-10 relative">
              {/* Globe Visual Container */}
              <div className="relative">
                {/* Glowing cyan orbit rings */}
                <div className="absolute -inset-4 border border-cyan-500/20 rounded-full animate-spin [animation-duration:15s]" />
                <div className="absolute -inset-2 border border-dashed border-sky-400/30 rounded-full animate-spin [animation-duration:10s]" />
                
                {/* Real-looking 3D Globe circle */}
                <div className="w-32 h-32 bg-gradient-to-tr from-sky-950 via-sky-800 to-indigo-950 rounded-full flex items-center justify-center relative shadow-[0_0_35px_rgba(14,165,233,0.35)] border border-sky-400/40 overflow-hidden">
                  {/* Subtle map shape simulated via SVG */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-35 fill-sky-300">
                    <path d="M15,40 Q25,30 35,45 T60,35 T85,55 T95,45 L100,100 L0,100 Z" />
                    <path d="M10,25 Q30,15 45,30 T75,20 T90,35 L100,50 L100,0 L0,0 Z" opacity="0.6" />
                  </svg>
                  
                  {/* Glowing core overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(10,15,29,0.8)_100%)]" />
                  
                  {/* Red Ring around CSIS wrapping globe */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[110%] h-[26px] border-y-[4.5px] border-red-600 rounded-full rotate-[-16deg] flex items-center justify-center bg-red-600/10 backdrop-blur-[1px] shadow-[0_0_12px_rgba(220,38,38,0.5)]">
                      <span className="text-white font-black text-[12px] tracking-widest uppercase italic filter drop-shadow-md select-none mt-[-2px]">
                        CSIS
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating tech metrics/icons shown in PDF screenshot */}
              <div className="flex flex-col gap-3 text-white">
                {/* Tech icon bar group */}
                <div className="flex items-center gap-3 opacity-80 scale-105">
                  {/* Users icon */}
                  <svg className="w-5 h-5 text-sky-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                  {/* Phone / Mobile settings icon */}
                  <svg className="w-5 h-5 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
                  </svg>
                  {/* Bar graph */}
                  <svg className="w-5 h-5 text-sky-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 19.23h3V10.3h-3v8.93zM10.5 19.23h3V6.02h-3v13.21zM16 19.23h3v-5.46h-3v5.46z" />
                  </svg>
                  {/* Signal Wifi wave */}
                  <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21l-12-12c4.42-4.42 10.58-5.58 15-4 1.42-.42 3.58-.42 5 0l4 4-12 12z" />
                  </svg>
                </div>
                {/* Arrow upward chart */}
                <div className="flex items-center gap-1.5 text-[8.5px] font-mono text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span>Command Center Metrics</span>
                  <svg className="w-3.5 h-3.5 text-emerald-400 ml-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-9 9-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Bottom edge tech status bar */}
            <div className="flex justify-between items-center text-[7px] font-mono text-slate-500 border-t border-slate-800/60 pt-2.5 z-10">
              <span>LATENCY: 12ms</span>
              <span>CSIS LIVE LINK</span>
              <span>SECURE ACCESS ONLY</span>
            </div>
          </div>

          {/* Blue metadata block */}
          <div className="bg-gradient-to-br from-[#003B70] to-[#009EE0] rounded-2xl p-8 flex-1 my-6 flex flex-col justify-center text-white shadow-md relative overflow-hidden">
            {/* Soft decorative background circles */}
            <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-white/5 rounded-full pointer-events-none" />
            <div className="absolute -top-10 -left-10 w-36 h-36 bg-white/5 rounded-full pointer-events-none" />

            <h2 className="text-3xl font-extrabold tracking-wide uppercase font-sans mb-1 select-none">
              Regional Command Center
            </h2>
            <p className="text-sky-200 text-sm font-semibold tracking-wider select-none mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
              <Video className="w-4 h-4 text-sky-300" />
              Evidencia de extracciones de vídeo Dvr´s y Nvr´s)
            </p>

            {/* Fields List */}
            <div className="space-y-4 text-sm mt-2 select-text font-sans">
              <div className="flex items-center gap-3">
                <span className="text-sky-200 font-bold w-44 shrink-0 text-right uppercase tracking-wider text-xs">
                  Sucursal:
                </span>
                <span className="font-extrabold text-base bg-white/10 px-3 py-1 rounded-md border border-white/10 flex-1 uppercase">
                  {metadata.sucursal || "885 PLAZA SAN MARCOS"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sky-200 font-bold w-44 shrink-0 text-right uppercase tracking-wider text-xs">
                  Incidente / Task:
                </span>
                <span className="font-extrabold text-base bg-white/10 px-3 py-1 rounded-md border border-white/10 flex-1 uppercase font-mono">
                  {metadata.incidenteTask || "SCTASK0000873273"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sky-200 font-bold w-44 shrink-0 text-right uppercase tracking-wider text-xs">
                  Tecnico que atiende:
                </span>
                <span className="font-extrabold text-base bg-white/10 px-3 py-1 rounded-md border border-white/10 flex-1 uppercase">
                  {metadata.tecnicoAtiende || "ALFONSO HERNANDEZ ESPARZA"}
                </span>
              </div>
            </div>
          </div>

          {/* Cover Page Footer */}
          <div className="flex justify-between items-center border-t border-slate-100 pt-4 select-none">
            {/* Citi Logo on left */}
            <CitiLogo className="h-10" />
            <span className="text-[8px] font-mono font-bold text-slate-400">
              PORTADA DE REPORTE — CONFIDENCIAL
            </span>
          </div>
        </div>
      );
    } else {
      // --- EVIDENCE PAGES (pageIndex > 0) ---
      // For Page 1 of evidence, images slice from indices 0,1,2. Page 2: 3,4,5 etc.
      const imageSlots = [0, 1, 2];

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

          {/* 2. 3-Image Layout Area (2 on Top Row, 1 Centered on Bottom Row) */}
          <div className="flex-1 my-6 flex flex-col justify-between z-10">
            {/* Row 1 (2 Columns for slot 1 & 2) */}
            <div className="grid grid-cols-2 gap-4 h-[94mm]">
              {[0, 1].map((slotIdx) => {
                const img = images[slotIdx];
                const hasImage = !!img;

                return (
                  <div
                    key={slotIdx}
                    className="relative border border-slate-300 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center group/cell h-full shadow-2xs"
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
                        <span className="text-[8px] text-gray-400">Celda {slotIdx + 1} de la Pág. {pageIndex + 1}</span>
                      </button>
                    )}
                    <span className="no-print absolute top-2 left-2 text-[8px] font-mono bg-gray-900/60 text-white font-bold px-1 rounded select-none">
                      Celda {slotIdx + 1}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Row 2 (1 Column, centered, for slot 3) */}
            <div className="flex justify-center h-[94mm] mt-4">
              <div className="w-[100mm] relative border border-slate-300 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center group/cell h-full shadow-2xs">
                {images[2] ? (
                  <>
                    <img
                      src={images[2].url}
                      alt={images[2].name}
                      referrerPolicy="no-referrer"
                      style={{ transform: `rotate(${images[2].rotation}deg)` }}
                      className={`w-full h-full transition-transform ${
                        images[2].fit === "contain" ? "object-contain p-1" : "object-cover"
                      }`}
                    />
                    {/* Cell controls */}
                    <div className="no-print absolute inset-0 bg-black/40 opacity-0 group-hover/cell:opacity-100 flex flex-col items-center justify-center gap-2 transition-all duration-150 z-20">
                      <span className="text-[10px] font-bold text-white bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-xs max-w-[150px] truncate mb-1">
                        {images[2].name}
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => onCellImageRotate(images[2].id)}
                          className="p-1.5 bg-white text-gray-800 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors shadow-sm"
                          title="Rotar 90°"
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onCellImageToggleFit(images[2].id)}
                          className="p-1.5 bg-white text-gray-800 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors shadow-sm"
                          title={images[2].fit === "contain" ? "Llenar espacio" : "Ajustar"}
                        >
                          {images[2].fit === "contain" ? (
                            <Maximize2 className="w-4 h-4" />
                          ) : (
                            <Minimize2 className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => onCellImageDelete(images[2].id)}
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
                    onClick={() => onCellUploadClick(pageIndex, 2)}
                    className="no-print absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50/30 transition-all cursor-pointer w-full h-full"
                  >
                    <Upload className="w-6 h-6 stroke-1.5" />
                    <span className="text-[10px] font-bold">Clic para insertar foto</span>
                    <span className="text-[8px] text-gray-400">Celda 3 de la Pág. {pageIndex + 1}</span>
                  </button>
                )}
                <span className="no-print absolute top-2 left-2 text-[8px] font-mono bg-gray-900/60 text-white font-bold px-1 rounded select-none">
                  Celda 3 (Centrada)
                </span>
              </div>
            </div>
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
              className={`relative flex items-center justify-center border border-black overflow-hidden bg-white/10 group/cell z-10`}
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
                  <span className="text-[8px] text-gray-400">Slot {slotIdx + 1} de la Pág. {pageIndex + 1}</span>
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
