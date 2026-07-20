import React from "react";
import { ReportImage } from "../types";
import { RotateCw, Trash2, Maximize2, Minimize2, ArrowLeft, ArrowRight, EyeOff, LayoutGrid } from "lucide-react";

interface ImageItemProps {
  image: ReportImage;
  index: number;
  total: number;
  onRotate: (id: string) => void;
  onToggleFit: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (index: number, direction: "left" | "right") => void;
}

export const ImageItem: React.FC<ImageItemProps> = ({
  image,
  index,
  total,
  onRotate,
  onToggleFit,
  onDelete,
  onMove,
}) => {
  // Format file size nicely
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  if (image.isBlank) {
    return (
      <div className="bg-dashed border-2 border-gray-200 rounded-xl p-4 flex flex-col justify-between items-center text-center h-48 bg-gray-50/50 hover:bg-gray-100/50 transition-all relative group">
        <div className="my-auto flex flex-col items-center gap-2">
          <div className="p-2.5 bg-gray-200/50 text-gray-500 rounded-lg">
            <EyeOff className="w-5 h-5 text-gray-400" />
          </div>
          <span className="text-xs font-semibold text-gray-500">Espacio en Blanco (Spacer)</span>
          <span className="text-[10px] text-gray-400 max-w-[150px]">
            Úsalo para empujar las siguientes imágenes a una nueva hoja
          </span>
        </div>

        {/* Footer controls */}
        <div className="flex items-center gap-1.5 w-full mt-2 justify-between">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(index, "left")}
            className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-white rounded border border-transparent hover:border-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Mover atrás"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(image.id)}
            className="px-2 py-1 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:border-red-200 text-[10px] font-semibold rounded-md flex items-center gap-1 transition-all"
            title="Eliminar espacio"
          >
            <Trash2 className="w-3 h-3" /> Eliminar
          </button>

          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(index, "right")}
            className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-white rounded border border-transparent hover:border-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Mover adelante"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Position Badge */}
        <span className="absolute top-2 left-2 text-[10px] font-mono bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-md font-bold">
          #{index + 1}
        </span>
      </div>
    );
  }

  // Calculate grid and page details
  const pageNum = Math.floor(index / 4) + 1;
  const slotNum = (index % 4) + 1;

  return (
    <div className="bg-white border border-gray-150 rounded-xl p-3 flex flex-col justify-between h-56 shadow-2xs hover:shadow-xs hover:border-gray-300 transition-all relative group">
      {/* Top Details & Image */}
      <div className="flex gap-3">
        {/* Thumbnail Box */}
        <div className="w-20 h-24 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative flex-shrink-0">
          <img
            src={image.url}
            alt={image.name}
            referrerPolicy="no-referrer"
            style={{ transform: `rotate(${image.rotation}deg)` }}
            className={`w-full h-full object-cover transition-transform duration-200 ${
              image.fit === "contain" ? "object-contain" : "object-cover"
            }`}
          />
          
          {/* Fit type badge */}
          <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] font-bold px-1 rounded">
            {image.fit === "contain" ? "Ajuste" : "Llenar"}
          </span>
        </div>

        {/* Metadata information */}
        <div className="flex flex-col justify-between overflow-hidden min-w-0 py-0.5">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-700 truncate" title={image.name}>
              {image.name}
            </p>
            <p className="text-[10px] text-gray-400 font-mono">
              {formatSize(image.size)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-[9px] text-indigo-600 font-semibold bg-indigo-50 px-1.5 py-0.5 rounded-md inline-block">
              Pág. {pageNum} — Pos. {slotNum}
            </p>
            <p className="text-[9px] text-gray-500 flex items-center gap-0.5">
              <RotateCw className="w-2.5 h-2.5" /> Rotación: {image.rotation}°
            </p>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="space-y-2 mt-2">
        <div className="grid grid-cols-2 gap-1.5">
          {/* Rotate Button */}
          <button
            type="button"
            onClick={() => onRotate(image.id)}
            className="flex items-center justify-center gap-1 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-lg text-[10px] font-semibold transition-all"
            title="Rotar 90 grados"
          >
            <RotateCw className="w-3 h-3 text-gray-500" /> Rotar 90°
          </button>

          {/* Toggle Fit Button */}
          <button
            type="button"
            onClick={() => onToggleFit(image.id)}
            className="flex items-center justify-center gap-1 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-lg text-[10px] font-semibold transition-all"
            title={image.fit === "contain" ? "Cambiar a modo Llenar (Cover)" : "Cambiar a modo Ajustar (Contain)"}
          >
            {image.fit === "contain" ? (
              <>
                <Maximize2 className="w-3 h-3 text-gray-500" /> Llenar
              </>
            ) : (
              <>
                <Minimize2 className="w-3 h-3 text-gray-500" /> Ajustar
              </>
            )}
          </button>
        </div>

        {/* Action controls (Move, Delete) */}
        <div className="flex items-center gap-1.5 border-t border-gray-100 pt-2 justify-between">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(index, "left")}
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 disabled:opacity-30 disabled:pointer-events-none transition-all animate-none"
            title="Mover un slot atrás"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(image.id)}
            className="flex-1 py-1 px-2 text-center text-[10px] font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-100 rounded-lg transition-all flex items-center justify-center gap-1"
          >
            <Trash2 className="w-3 h-3" /> Eliminar
          </button>

          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(index, "right")}
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 disabled:opacity-30 disabled:pointer-events-none transition-all animate-none"
            title="Mover un slot adelante"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Badge position indicator */}
      <span className="absolute top-2 right-2 text-[10px] font-mono bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-md font-bold">
        #{index + 1}
      </span>
    </div>
  );
};
