import React from "react";
import { ReportMetadata, ReportFooter, ReportImage, PageConfig } from "../types";
import { ComexaLogo, SantanderLogo, ComexaWatermark } from "./Logos";
import { RotateCw, Trash2, Maximize2, Minimize2, Upload, FileText } from "lucide-react";

interface PagePreviewSheetProps {
  pageIndex: number;
  totalPages: number;
  metadata: ReportMetadata;
  footer: ReportFooter;
  images: ReportImage[]; // Up to 4 images for this page
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
