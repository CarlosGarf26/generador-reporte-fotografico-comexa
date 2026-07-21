import React from "react";
import { ReportMetadata, ReportFooter, ReportType } from "../types";
import {
  Settings2,
  Building,
  Hash,
  Calendar,
  ShieldCheck,
  User,
  FileCode,
  LayoutGrid,
  Video
} from "lucide-react";

interface ConfigPanelProps {
  metadata: ReportMetadata;
  onChangeMetadata: (metadata: ReportMetadata) => void;
  footer: ReportFooter;
  onChangeFooter: (footer: ReportFooter) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  metadata,
  onChangeMetadata,
  footer,
  onChangeFooter,
}) => {
  const handleMetaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChangeMetadata({
      ...metadata,
      [name]: value,
    });
  };

  const handleTypeSelect = (type: ReportType) => {
    onChangeMetadata({
      ...metadata,
      reportType: type,
      // Provide defaults if missing
      sucursal: metadata.sucursal === "VILLAHERMOSA" ? "4101 VALLE DE ARAGON" : metadata.sucursal,
      incidenteTask: metadata.incidenteTask || "SCTASK0000883852 / REQ0000894862",
      tecnicoAtiende: metadata.tecnicoAtiende || "ERICK GABRIEL PEREZ ESPINOZA",
    });
  };

  const currentType = metadata.reportType || "fotografico";

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-5 space-y-5">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <Settings2 className="w-5 h-5 text-indigo-600" />
        <h2 className="font-semibold text-gray-800 text-base">Configuración del Reporte</h2>
      </div>

      {/* 1. Format selector (Segmented picker) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
          Formato de Reporte
        </label>
        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
          <button
            type="button"
            onClick={() => handleTypeSelect("fotografico")}
            className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              currentType === "fotografico"
                ? "bg-white text-indigo-600 shadow-sm border border-slate-100"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Foto Mantenimiento</span>
          </button>
          <button
            type="button"
            onClick={() => handleTypeSelect("extraccion_video")}
            className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              currentType === "extraccion_video"
                ? "bg-white text-indigo-600 shadow-sm border border-slate-100"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Extracción de Video</span>
          </button>
        </div>
      </div>

      {/* 2. Header Fields */}
      <div className="space-y-3.5 pt-1">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Datos de Cabecera
        </h3>

        {/* Sucursal & CC */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
              <Building className="w-3.5 h-3.5" /> Sucursal
            </label>
            <input
              type="text"
              name="sucursal"
              value={metadata.sucursal}
              onChange={handleMetaChange}
              placeholder="e.g. VILLAHERMOSA"
              className="w-full text-xs font-medium px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white uppercase transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5" /> Centro Costo (C.C.)
            </label>
            <input
              type="text"
              name="cc"
              value={metadata.cc}
              onChange={handleMetaChange}
              placeholder="e.g. 0091"
              className="w-full text-xs font-medium px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Fecha & Tipo Trabajo */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Fecha Reporte
            </label>
            <input
              type="text"
              name="fechaInventario"
              value={metadata.fechaInventario}
              onChange={handleMetaChange}
              placeholder="e.g. 11/06/2026"
              className="w-full text-xs font-medium px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Tipo Servicio
            </label>
            <input
              type="text"
              name="tipoTrabajo"
              value={metadata.tipoTrabajo}
              onChange={handleMetaChange}
              placeholder="e.g. MANTENIMIENTO"
              className="w-full text-xs font-medium px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white uppercase transition-all"
            />
          </div>
        </div>

        {/* Video Extraction Specific Fields */}
        {currentType === "extraccion_video" && (
          <div className="space-y-3.5 pt-3 border-t border-dashed border-gray-150 animate-fade-in">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Datos de Extracción
            </h4>

            {/* Incidente/Task */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5" /> Incidente / Task
              </label>
              <input
                type="text"
                name="incidenteTask"
                value={metadata.incidenteTask || ""}
                onChange={handleMetaChange}
                placeholder="e.g. SCTASK0000873273"
                className="w-full text-xs font-medium px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white uppercase transition-all"
              />
            </div>

            {/* Técnico que atiende */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Técnico que Atiende
              </label>
              <input
                type="text"
                name="tecnicoAtiende"
                value={metadata.tecnicoAtiende || ""}
                onChange={handleMetaChange}
                placeholder="e.g. ALFONSO HERNANDEZ ESPARZA"
                className="w-full text-xs font-medium px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white uppercase transition-all"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
