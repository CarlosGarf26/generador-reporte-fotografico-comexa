import React, { useState, useEffect, useRef } from "react";
import { ReportMetadata, ReportFooter, ReportImage, PageConfig } from "./types";
import { ConfigPanel } from "./components/ConfigPanel";
import { ImageItem } from "./components/ImageItem";
import { PagePreviewSheet } from "./components/PagePreviewSheet";
import { generateReportPDF } from "./utils/pdfGenerator";
import {
  Camera,
  Upload,
  Printer,
  Download,
  Trash2,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  Plus,
  RotateCw,
  Maximize2,
  Minimize2,
  HelpCircle,
  FileCheck,
  Sparkles,
  Info
} from "lucide-react";

// Pre-defined demo photos matching COMEXA's domain (CCTV, Alarms, Access Control, Fire, Electrical Maintenance)
const DEMO_PHOTOS = [
  {
    url: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    name: "CCTV_Camara_Exterior_Mantenimiento.jpg",
    size: 245000,
  },
  {
    url: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=600&q=80",
    name: "Gabinete_Control_Limpieza_Contactos.jpg",
    size: 312000,
  },
  {
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    name: "Rack_Telecomunicaciones_Ordenamiento.jpg",
    size: 428000,
  },
  {
    url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
    name: "Teclado_Control_Acceso_Prueba_Tono.jpg",
    size: 189000,
  },
  {
    url: "https://images.unsplash.com/photo-1606206591513-0c53a314201c?auto=format&fit=crop&w=600&q=80",
    name: "Detector_Humo_Incendio_Inspeccion.jpg",
    size: 295000,
  },
  {
    url: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?auto=format&fit=crop&w=600&q=80",
    name: "Banco_Baterias_UPS_Verificacion_Voltaje.jpg",
    size: 340000,
  },
  {
    url: "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=600&q=80",
    name: "Tarjeta_Principal_CCTV_Diagnostico.jpg",
    size: 215000,
  },
  {
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    name: "Herramientas_Medicion_Campos_Electricos.jpg",
    size: 388000,
  },
];

export default function App() {
  // --- STATE ---
  const [metadata, setMetadata] = useState<ReportMetadata>({
    sucursal: "VILLAHERMOSA",
    cc: "0091",
    fechaInventario: "11/06/2026",
    tipoTrabajo: "MANTENIMIENTO",
  });

  const [footer, setFooter] = useState<ReportFooter>({
    direccion: "AV. ZARAGOZA 73, COL. SANTA CATARINA, ALC. COYOACÁN, C.P 04010, CIUDAD DE MÉXICO",
    telefono: "+52 55 56857830 / 56002853",
    comexaInfo: "01 800 2COMEXA (2266392)",
    permiso: "PERMISO SSP DF: 0918-15",
    expediente: "EXP. NO: 3998-15",
  });

  const [images, setImages] = useState<ReportImage[]>([]);
  const [pageConfigs, setPageConfigs] = useState<PageConfig[]>([]);
  const [viewMode, setViewMode] = useState<"edit" | "print">("edit");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);

  // Hidden file inputs refs
  const bulkFileInputRef = useRef<HTMLInputElement>(null);
  const cellFileInputRef = useRef<HTMLInputElement>(null);
  const targetCellRef = useRef<{ pageIndex: number; slotIdx: number } | null>(null);

  // --- AUTOMATIC SUBHEADER GENERATION ---
  // Create / update page subheader configurations whenever images count or metadata changes
  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(images.length / pageSize));

  useEffect(() => {
    setPageConfigs((prev) => {
      const updated: PageConfig[] = [];
      for (let i = 0; i < totalPages; i++) {
        const existing = prev.find((c) => c.pageIndex === i);
        if (existing) {
          updated.push(existing);
        } else {
          updated.push({
            pageIndex: i,
            subHeader: `${metadata.tipoTrabajo} ${metadata.fechaInventario}`,
            showSubHeader: true,
          });
        }
      }
      return updated;
    });
  }, [totalPages, metadata.tipoTrabajo, metadata.fechaInventario]);

  // --- HANDLERS ---
  const handleBulkUploadClick = () => {
    bulkFileInputRef.current?.click();
  };

  const handleBulkFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    processAndAddFiles(Array.from(files));
    e.target.value = ""; // Reset
  };

  const processAndAddFiles = (filesList: File[]) => {
    filesList.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImg: ReportImage = {
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
          url: reader.result as string,
          name: file.name,
          size: file.size,
          rotation: 0,
          fit: "contain",
        };
        setImages((prev) => [...prev, newImg]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Uploading directly from an empty preview slot cell
  const handleCellUploadClick = (pageIndex: number, slotIdx: number) => {
    targetCellRef.current = { pageIndex, slotIdx };
    cellFileInputRef.current?.click();
  };

  const handleCellFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const target = targetCellRef.current;
    if (!files || files.length === 0 || !target) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const newImg: ReportImage = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        url: reader.result as string,
        name: file.name,
        size: file.size,
        rotation: 0,
        fit: "contain",
      };

      const targetIdx = target.pageIndex * 4 + target.slotIdx;
      setImages((prev) => {
        const updated = [...prev];
        if (targetIdx < updated.length) {
          // Replace
          updated[targetIdx] = newImg;
        } else {
          // Append with blank spacers filling up to index
          while (updated.length < targetIdx) {
            updated.push({
              id: Math.random().toString(36).substring(2, 9),
              url: "",
              name: "Espacio en blanco",
              size: 0,
              rotation: 0,
              fit: "contain",
              isBlank: true,
            });
          }
          updated.push(newImg);
        }
        return updated;
      });
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // Reset
    targetCellRef.current = null;
  };

  // Loading maintenance sample presets
  const handleLoadDemo = () => {
    const processedDemoImages = DEMO_PHOTOS.map((photo, i) => ({
      id: `demo-${i}-${Math.random().toString(36).substring(2, 5)}`,
      url: photo.url,
      name: photo.name,
      size: photo.size,
      rotation: 0 as const,
      fit: "contain" as const,
    }));
    setImages((prev) => [...prev, ...processedDemoImages]);
    setViewMode("edit");
  };

  // Clear all list
  const handleClearAll = () => {
    if (confirm("¿Está seguro de que desea eliminar todas las imágenes actuales?")) {
      setImages([]);
      setPageConfigs([]);
    }
  };

  // --- IMAGE ADJUSTMENT CONTROLS ---
  const handleRotateImage = (id: string) => {
    setImages((prev) =>
      prev.map((img) => {
        if (img.id === id) {
          const nextRotation = ((img.rotation + 90) % 360) as 0 | 90 | 180 | 270;
          return { ...img, rotation: nextRotation };
        }
        return img;
      })
    );
  };

  const handleToggleFit = (id: string) => {
    setImages((prev) =>
      prev.map((img) => {
        if (img.id === id) {
          return { ...img, fit: img.fit === "contain" ? "cover" : "contain" };
        }
        return img;
      })
    );
  };

  const handleDeleteImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleMoveImage = (index: number, direction: "left" | "right") => {
    const targetIdx = direction === "left" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    setImages((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIdx];
      updated[targetIdx] = temp;
      return updated;
    });
  };

  // --- BATCH ACTION CONTROLS ---
  const handleRotateAll = () => {
    setImages((prev) =>
      prev.map((img) => {
        if (img.isBlank) return img;
        const nextRotation = ((img.rotation + 90) % 360) as 0 | 90 | 180 | 270;
        return { ...img, rotation: nextRotation };
      })
    );
  };

  const handleToggleFitAll = (mode: "contain" | "cover") => {
    setImages((prev) =>
      prev.map((img) => (img.isBlank ? img : { ...img, fit: mode }))
    );
  };

  const handleInsertSpacer = () => {
    const spacer: ReportImage = {
      id: `spacer-${Math.random().toString(36).substring(2, 9)}`,
      url: "",
      name: "Espacio en blanco",
      size: 0,
      rotation: 0,
      fit: "contain",
      isBlank: true,
    };
    setImages((prev) => [...prev, spacer]);
  };

  // --- PAGE SPECIFIC CONFIG ACTIONS ---
  const handleUpdatePageConfig = (pageIndex: number, updatedFields: Partial<PageConfig>) => {
    setPageConfigs((prev) =>
      prev.map((config) => {
        if (config.pageIndex === pageIndex) {
          return { ...config, ...updatedFields };
        }
        return config;
      })
    );
  };

  const handleTogglePageSubheader = (pageIndex: number) => {
    setPageConfigs((prev) =>
      prev.map((config) => {
        if (config.pageIndex === pageIndex) {
          return { ...config, showSubHeader: !config.showSubHeader };
        }
        return config;
      })
    );
  };

  // --- EXPORT TRIGGERS ---
  const triggerBrowserPrint = () => {
    // Standard print dialog styled perfectly by CSS
    window.print();
  };

  const triggerPDFDownload = async () => {
    if (images.length === 0) {
      alert("Por favor cargue al menos una imagen antes de exportar.");
      return;
    }

    setIsGeneratingPdf(true);
    setPdfProgress(10);

    try {
      const doc = await generateReportPDF(
        metadata,
        footer,
        images,
        pageConfigs,
        (progress) => {
          setPdfProgress(Math.min(95, 10 + Math.round(progress * 0.85)));
        }
      );

      setPdfProgress(100);
      // Clean up sucursal name for file name
      const cleanName = `${metadata.tipoTrabajo.toLowerCase()}_${metadata.sucursal.toLowerCase()}_${metadata.cc}.pdf`.replace(/\s+/g, "_");
      doc.save(cleanName);
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al generar el PDF. Pruebe usando la opción 'Imprimir Reporte'.");
    } finally {
      setTimeout(() => {
        setIsGeneratingPdf(false);
        setPdfProgress(0);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900/5 flex flex-col font-sans text-gray-900">
      
      {/* 1. TOP NAVBAR (Hidden during browser printing) */}
      <header className="no-print bg-slate-900 text-white shadow-md border-b border-slate-800 shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-sm">
              <Camera className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg tracking-tight font-display">
                Generador de Reporte Fotográfico
              </h1>
              <p className="text-slate-400 text-xs font-medium">
                Plantilla oficial COMEXA — Santander
              </p>
            </div>
          </div>

          {/* Quick Stats & Presets */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            {images.length === 0 && (
              <button
                type="button"
                onClick={handleLoadDemo}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 hover:border-amber-500/30 text-xs font-semibold rounded-lg transition-all shadow-xs cursor-pointer"
                title="Carga fotos de demostración para probar el sistema"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Cargar Ejemplo
              </button>
            )}

            {images.length > 0 && (
              <>
                <div className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-xs font-mono font-bold text-slate-300">
                  {images.length} Foto{images.length !== 1 ? "s" : ""} | {totalPages} Página{totalPages !== 1 ? "s" : ""}
                </div>

                <button
                  type="button"
                  onClick={handleClearAll}
                  className="p-1.5 bg-slate-800 text-rose-400 hover:text-white hover:bg-rose-600 rounded-lg border border-slate-700 hover:border-transparent transition-all cursor-pointer"
                  title="Eliminar todas las imágenes"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. DYNAMIC WORKSPACE PANE */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* LEFT COLUMN - CONTROLS & EDITOR (Hidden during printing) */}
        <div className="no-print w-full lg:w-[400px] flex flex-col gap-6 shrink-0">
          
          {/* A. Document configuration card */}
          <ConfigPanel
            metadata={metadata}
            onChangeMetadata={setMetadata}
            footer={footer}
            onChangeFooter={setFooter}
          />

          {/* B. Batch uploader & Spacing controller */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-indigo-600" /> Cargar Fotos
              </h2>
            </div>

            {/* Drag & Drop uploader area */}
            <div
              onClick={handleBulkUploadClick}
              className="border-2 border-dashed border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/20 rounded-xl p-6 text-center cursor-pointer transition-all group flex flex-col items-center gap-2"
            >
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-105 transition-all">
                <Camera className="w-6 h-6 stroke-2" />
              </div>
              <p className="text-xs font-bold text-gray-700">Arrastre múltiples imágenes aquí</p>
              <p className="text-[10px] text-gray-400">O haga clic para examinar archivos</p>
              <input
                type="file"
                ref={bulkFileInputRef}
                onChange={handleBulkFileInputChange}
                multiple
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Batch layout quick adjusters */}
            {images.length > 0 && (
              <div className="space-y-2.5 pt-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Acciones por Lote</p>
                <div className="grid grid-cols-2 gap-2">
                  {/* Rotate all */}
                  <button
                    type="button"
                    onClick={handleRotateAll}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-gray-200 hover:border-gray-300 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-gray-500" /> Rotar Todas 90°
                  </button>

                  {/* Add blank spacer */}
                  <button
                    type="button"
                    onClick={handleInsertSpacer}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-gray-200 hover:border-gray-300 rounded-lg text-xs font-semibold transition-all cursor-pointer font-sans"
                    title="Inserta un cuadro vacío para estructurar las hojas"
                  >
                    <Plus className="w-3.5 h-3.5 text-gray-500" /> Añadir Espacio
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Fit All Contain */}
                  <button
                    type="button"
                    onClick={() => handleToggleFitAll("contain")}
                    className="flex items-center justify-center gap-1 px-2 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-gray-200 hover:border-gray-300 rounded-lg text-[10px] font-semibold transition-all cursor-pointer"
                  >
                    <Minimize2 className="w-3 h-3 text-gray-500" /> Ajustar Todas
                  </button>

                  {/* Fit All Cover */}
                  <button
                    type="button"
                    onClick={() => handleToggleFitAll("cover")}
                    className="flex items-center justify-center gap-1 px-2 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-gray-200 hover:border-gray-300 rounded-lg text-[10px] font-semibold transition-all cursor-pointer"
                  >
                    <Maximize2 className="w-3 h-3 text-gray-500" /> Llenar Todas
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick informative tips */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex gap-3 text-amber-800">
            <Info className="w-5 h-5 flex-shrink-0 stroke-[1.8]" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold font-display">Consejo Profesional</h4>
              <p className="text-[10px] leading-relaxed font-medium">
                Las fotos móviles suelen subirse de lado. Usa los botones de <strong>Rotar 90°</strong> en las fotos para alinearlas correctamente. Usa <strong>"Añadir Espacio"</strong> si quieres vaciar un espacio y mover fotos a la siguiente hoja.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - PREVIEWS & OUTPUT ACTIONS */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">
          
          {/* A. Top view bar (Edit mode vs Print Preview layout, Hidden in print) */}
          <div className="no-print bg-white rounded-xl shadow-2xs border border-gray-150 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            
            {/* View selectors */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode("edit")}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  viewMode === "edit"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Edición Rápida ({images.length})
              </button>
              
              <button
                type="button"
                onClick={() => setViewMode("print")}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  viewMode === "print"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Vista Previa Hojas ({totalPages})
              </button>
            </div>

            {/* Action buttons (Download & Print PDF) */}
            <div className="flex items-center gap-2">
              {/* Browser Print Vector Button */}
              <button
                type="button"
                disabled={images.length === 0}
                onClick={triggerBrowserPrint}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-gray-200 transition-all cursor-pointer"
                title="Abre la ventana de impresión del navegador. Excelente calidad vectorial."
              >
                <Printer className="w-4 h-4" /> Imprimir Reporte
              </button>

              {/* PDF direct download button */}
              <button
                type="button"
                disabled={images.length === 0 || isGeneratingPdf}
                onClick={triggerPDFDownload}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                title="Generar y descargar el PDF completo del reporte"
              >
                {isGeneratingPdf ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Generando ({pdfProgress}%)
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Guardar PDF
                  </>
                )}
              </button>
            </div>
          </div>

          {/* B. Preview Screens */}
          <div className="flex-1 min-h-[500px]">
            {images.length === 0 ? (
              /* Empty Placeholder display state */
              <div className="no-print bg-white rounded-xl shadow-xs border border-gray-100 p-12 text-center h-full flex flex-col items-center justify-center gap-4">
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full animate-pulse">
                  <Camera className="w-10 h-10 stroke-1.5" />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h3 className="font-bold text-gray-800 text-base">Cargue sus fotos para empezar</h3>
                  <p className="text-gray-500 text-xs leading-relaxed font-medium">
                    Arrastre sus fotos de mantenimiento aquí o haga clic en "Cargar Ejemplo" para rellenar de inmediato con fotos de prueba del sistema.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLoadDemo}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 mt-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Cargar Fotos de Ejemplo
                </button>
              </div>
            ) : viewMode === "edit" ? (
              /* QUICK EDITING MODE: GRID VIEW */
              <div className="no-print space-y-4">
                <div className="flex justify-between items-center bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/40">
                  <div className="flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-900">
                      Modo Reordenamiento y Ajuste de Fotos ({images.length} fotos cargadas)
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">
                    Cambie posiciones usando las flechas de cada tarjeta
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <ImageItem
                      key={image.id}
                      image={image}
                      index={index}
                      total={images.length}
                      onRotate={handleRotateImage}
                      onToggleFit={handleToggleFit}
                      onDelete={handleDeleteImage}
                      onMove={handleMoveImage}
                    />
                  ))}

                  {/* Quick Add Blank space tile in the grid */}
                  <button
                    type="button"
                    onClick={handleInsertSpacer}
                    className="border-2 border-dashed border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/10 rounded-xl p-4 flex flex-col justify-center items-center gap-2 text-gray-400 hover:text-indigo-600 transition-all h-56 cursor-pointer"
                  >
                    <Plus className="w-6 h-6 stroke-1.5" />
                    <span className="text-xs font-semibold">Añadir Espacio Vacío</span>
                  </button>
                </div>
              </div>
            ) : (
              /* REAL PRINT PREVIEW: VERTICAL STACK OF SHEETS */
              <div className="no-print space-y-8 flex flex-col items-center">
                
                {/* Information bar about page-configs */}
                <div className="w-full bg-slate-50 border border-gray-150 p-4 rounded-xl flex items-start gap-3">
                  <FileCheck className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800">Vista de Impresión Real (Hojas Carta)</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                      Cada hoja muestra hasta 4 imágenes (cuadrícula de 2x2). El subencabezado central (ej. <strong>"MANTENIMIENTO 11/06/2026"</strong>) puede editarse individualmente en cada página haciendo clic en él. Use los selectores de abajo para ocultar o mostrar el subencabezado por página.
                    </p>
                  </div>
                </div>

                {Array.from({ length: totalPages }).map((_, pageIdx) => {
                  const currentConfig = pageConfigs.find((c) => c.pageIndex === pageIdx) || {
                    pageIndex: pageIdx,
                    subHeader: `${metadata.tipoTrabajo} ${metadata.fechaInventario}`,
                    showSubHeader: true,
                  };

                  return (
                    <div key={pageIdx} className="space-y-2.5 w-full flex flex-col items-center">
                      
                      {/* Interactive Sheet Metadata and Config controls (Hovering above the paper preview) */}
                      <div className="w-full max-w-[215.9mm] bg-white border border-gray-150 rounded-lg p-3 flex justify-between items-center shadow-2xs">
                        <span className="text-xs font-bold text-gray-500">
                          Configuración Hoja #{pageIdx + 1} de {totalPages}
                        </span>

                        <div className="flex gap-4">
                          {/* Toggle subheader display */}
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={currentConfig.showSubHeader}
                              onChange={() => handleTogglePageSubheader(pageIdx)}
                              className="w-3.5 h-3.5 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-xs font-medium text-gray-600">Mostrar subencabezado</span>
                          </label>
                        </div>
                      </div>

                      {/* The physical Letter Sheet layout */}
                      <PagePreviewSheet
                        pageIndex={pageIdx}
                        totalPages={totalPages}
                        metadata={metadata}
                        footer={footer}
                        images={images.slice(pageIdx * pageSize, (pageIdx + 1) * pageSize)}
                        pageConfig={currentConfig}
                        onUpdatePageConfig={handleUpdatePageConfig}
                        onCellImageRotate={handleRotateImage}
                        onCellImageToggleFit={handleToggleFit}
                        onCellImageDelete={handleDeleteImage}
                        onCellUploadClick={handleCellUploadClick}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 3. SECRET PRINT-ONLY ELEMENT */}
      {/* This element is completely hidden during normal UI view, but when window.print() is triggered, 
          it takes over the entire browser viewport and formats the pages with vector fonts and margins */}
      <div className="hidden print:block bg-white w-full h-full">
        {Array.from({ length: totalPages }).map((_, pageIdx) => {
          const currentConfig = pageConfigs.find((c) => c.pageIndex === pageIdx) || {
            pageIndex: pageIdx,
            subHeader: `${metadata.tipoTrabajo} ${metadata.fechaInventario}`,
            showSubHeader: true,
          };

          return (
            <PagePreviewSheet
              key={`print-sheet-${pageIdx}`}
              pageIndex={pageIdx}
              totalPages={totalPages}
              metadata={metadata}
              footer={footer}
              images={images.slice(pageIdx * pageSize, (pageIdx + 1) * pageSize)}
              pageConfig={currentConfig}
              onUpdatePageConfig={handleUpdatePageConfig}
              onCellImageRotate={handleRotateImage}
              onCellImageToggleFit={handleToggleFit}
              onCellImageDelete={handleDeleteImage}
              onCellUploadClick={handleCellUploadClick}
            />
          );
        })}
      </div>

      {/* Hidden Cell upload element triggered programmatically */}
      <input
        type="file"
        ref={cellFileInputRef}
        onChange={handleCellFileInputChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
