import React from "react";
import { ReportMetadata, ReportFooter } from "../types";
import { Settings2, Building, Hash, Calendar, ShieldCheck, MapPin, Phone, FileSignature, HelpCircle } from "lucide-react";

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
  const handleMetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChangeMetadata({
      ...metadata,
      [name]: value,
    });
  };

  const handleFooterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChangeFooter({
      ...footer,
      [name]: value,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-5 space-y-6">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <Settings2 className="w-5 h-5 text-indigo-600" />
        <h2 className="font-semibold text-gray-800 text-base">Configuración del Reporte</h2>
      </div>

      {/* Header Fields */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Datos de Cabecera</h3>
        
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
      </div>
    </div>
  );
};
