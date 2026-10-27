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

        {/* Toggle Logo Santander (Solo para formato fotográfico) */}
        {currentType === "fotografico" && (
          <div className="pt-1">
            <div className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl border border-slate-200/80 transition-all">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    metadata.showSantanderLogo !== false
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : "bg-gray-100 text-gray-400 border border-gray-200"
                  }`}
                >
                  <span className="text-[11px] font-black font-serif">S</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gray-800 leading-tight">
                      Logo Santander
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                        metadata.showSantanderLogo !== false
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {metadata.showSantanderLogo !== false ? "Visible" : "Oculto"}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 block truncate">
                    {metadata.showSantanderLogo !== false
                      ? "Se muestra en encabezado junto a COMEXA"
                      : "Encabezado limpio con solo logo COMEXA"}
                  </span>
                </div>
              </div>

              {/* Switch button */}
              <button
                type="button"
                role="switch"
                aria-checked={metadata.showSantanderLogo !== false}
                onClick={() =>
                  onChangeMetadata({
                    ...metadata,
                    showSantanderLogo: metadata.showSantanderLogo === false,
                  })
                }
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                  metadata.showSantanderLogo !== false ? "bg-red-600" : "bg-gray-300"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    metadata.showSantanderLogo !== false ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        )}

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
