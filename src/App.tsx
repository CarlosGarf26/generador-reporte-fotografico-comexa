import React, { useState, useEffect, useRef } from "react";
import { ReportMetadata, ReportFooter, ReportImage, PageConfig, DateBlock } from "./types";
import { ConfigPanel } from "./components/ConfigPanel";
import { ImageItem } from "./components/ImageItem";
import { PagePreviewSheet } from "./components/PagePreviewSheet";
import { generateReportPDF, buildPagesFromBlocks } from "./utils/pdfGenerator";
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
  FileCheck,
  Sparkles,
  Layers,
  Info,
  Calendar,
  CalendarDays,
  FolderPlus,
  ArrowUpDown
} from "lucide-react";

// Pre-defined demo photos matching COMEXA's domain (CCTV, Alarms, Access Control, Fire, Electrical Maintenance)
const extractImageFiles = (e: React.DragEvent): File[] => {
  const files: File[] = [];
  if (e.dataTransfer && e.dataTransfer.files) {
    for (let i = 0; i < e.dataTransfer.files.length; i++) {
      const file = e.dataTransfer.files[i];
      if (file.type.startsWith("image/") || /\.(jpe?g|png|webp|bmp|gif|tiff?)$/i.test(file.name)) {
        files.push(file);
      }
    }
  }
  return files;
};

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
    sucursal: "4101 VALLE DE ARAGON",
    cc: "0091",
    fechaInventario: "11/06/2026",
    tipoTrabajo: "MANTENIMIENTO",
    incidenteTask: "SCTASK0000883852 / REQ0000894862",
    tecnicoAtiende: "ERICK GABRIEL PEREZ ESPINOZA",
  });

  const [footer, setFooter] = useState<ReportFooter>({
    direccion: "AV. ZARAGOZA 73, COL. SANTA CATARINA, ALC. COYOACÁN, C.P 04010, CIUDAD DE MÉXICO",
    telefono: "+52 55 56857830 / 56002853",
    comexaInfo: "01 800 2COMEXA (2266392)",
    permiso: "PERMISO SSP DF: 0918-15",
    expediente: "EXP. NO: 3998-15",
  });

  // State organized by Date Blocks (Secciones por Fecha)
  const [dateBlocks, setDateBlocks] = useState<DateBlock[]>([
    {
      id: "block-1",
      fecha: "11/06/2026",
      titulo: "",
      images: [],
    },
  ]);
  const [activeBlockId, setActiveBlockId] = useState<string>("block-1");

  const [pageConfigs, setPageConfigs] = useState<PageConfig[]>([]);
  const [viewMode, setViewMode] = useState<"edit" | "print">("edit");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // Drag & drop UI states
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false);
  const [isDraggingEmpty, setIsDraggingEmpty] = useState(false);
  const [dragOverBlockId, setDragOverBlockId] = useState<string | null>(null);

  // Hidden file inputs refs
  const blockFileInputRef = useRef<HTMLInputElement>(null);
  const targetBlockUploadRef = useRef<string | null>(null);
  const cellFileInputRef = useRef<HTMLInputElement>(null);
  const targetCellRef = useRef<{ pageIndex: number; slotIdx: number } | null>(null);

  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Active block reference
  const activeBlock = dateBlocks.find((b) => b.id === activeBlockId) || dateBlocks[0] || {
    id: "block-1",
    fecha: metadata.fechaInventario,
    titulo: "",
    images: [],
  };

  // Build unified pages structure
  const pages = buildPagesFromBlocks(dateBlocks, metadata);
  const totalPages = pages.length;
  const isVideo = metadata.reportType === "extraccion_video";

  const totalImagesCount = dateBlocks.reduce(
    (acc, b) => acc + b.images.filter((img) => !img.isBlank && img.url).length,
    0
  );



  // Global drag-and-drop listener to prevent browser from navigating away on dropped files outside dropzones
  useEffect(() => {
    const handleGlobalDragOver = (e: DragEvent) => {
      e.preventDefault();
    };
    const handleGlobalDrop = (e: DragEvent) => {
      e.preventDefault();
    };
    window.addEventListener("dragover", handleGlobalDragOver);
    window.addEventListener("drop", handleGlobalDrop);
    return () => {
      window.removeEventListener("dragover", handleGlobalDragOver);
      window.removeEventListener("drop", handleGlobalDrop);
    };
  }, []);

  // --- CLIPBOARD GLOBAL PASTE SUPPORT ---
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) {
            const dateStr = new Date().toLocaleTimeString().replace(/:/g, "-");
            const newFile = new File([file], `Captura_${dateStr}.png`, {
              type: file.type,
            });
            imageFiles.push(newFile);
          }
        }
      }

      if (imageFiles.length > 0) {
        e.preventDefault();
        processAndAddFilesToBlock(imageFiles, activeBlock.id);
        showToast(
          `Se pegó ${imageFiles.length === 1 ? "1 imagen" : `${imageFiles.length} imágenes`} en el bloque de ${activeBlock.fecha}`
        );
      }
    };

    window.addEventListener("paste", handleGlobalPaste);
    return () => {
      window.removeEventListener("paste", handleGlobalPaste);
    };
  }, [activeBlock.id, activeBlock.fecha]);

  // --- FILE PROCESSING HELPERS ---
  const processAndAddFilesToBlock = (filesList: File[], targetBlockId: string) => {
    const filePromises = filesList.map(
      (file) =>
        new Promise<ReportImage>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
              url: reader.result as string,
              name: file.name,
              size: file.size,
              rotation: 0,
              fit: "contain",
            });
          };
          reader.readAsDataURL(file);
        })
    );

    Promise.all(filePromises).then((newImgs) => {
      setDateBlocks((prev) =>
        prev.map((block) => {
          if (block.id !== targetBlockId) return block;
          return {
            ...block,
            images: [...block.images.filter((img) => !img.isBlank), ...newImgs],
          };
        })
      );
      showToast(
        `Se agregaron ${newImgs.length} foto${newImgs.length !== 1 ? "s" : ""} al bloque`
      );
    });
  };

  const handleBlockUploadClick = (blockId: string) => {
    targetBlockUploadRef.current = blockId;
    setActiveBlockId(blockId);
    blockFileInputRef.current?.click();
  };

  const handleBlockFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const targetBlockId = targetBlockUploadRef.current || activeBlock.id;
    if (!files || files.length === 0 || !targetBlockId) return;
    processAndAddFilesToBlock(Array.from(files), targetBlockId);
    e.target.value = "";
    targetBlockUploadRef.current = null;
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

    handleInsertImageAtCell(files[0], target.pageIndex, target.slotIdx);
    e.target.value = "";
    targetCellRef.current = null;
  };

  const handleInsertImageAtCell = (file: File, pageIndex: number, slotIdx: number) => {
    handleInsertFilesAtCell([file], pageIndex, slotIdx);
  };

  const handleInsertFilesAtCell = (files: File[], pageIndex: number, slotIdx: number) => {
    if (!files || files.length === 0) return;
    const targetPage = pages[pageIndex];
    if (!targetPage || !targetPage.blockId) return;

    const blockId = targetPage.blockId;
    const startIdxInBlock = (targetPage.pageInBlock || 0) * 4 + slotIdx;

    const filePromises = files.map(
      (file) =>
        new Promise<ReportImage>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
              url: reader.result as string,
              name: file.name,
              size: file.size,
              rotation: 0,
              fit: "contain",
            });
          };
          reader.readAsDataURL(file);
        })
    );

    Promise.all(filePromises).then((newImgs) => {
      setDateBlocks((prev) =>
        prev.map((block) => {
          if (block.id !== blockId) return block;
          const updated = [...block.images];
          newImgs.forEach((newImg, offset) => {
            const targetPos = startIdxInBlock + offset;
            while (updated.length < targetPos) {
              updated.push({
                id: `spacer-${Math.random().toString(36).substring(2, 9)}`,
                url: "",
                name: "Espacio en blanco",
                size: 0,
                rotation: 0,
                fit: "contain",
                isBlank: true,
              });
            }
            if (targetPos < updated.length) {
              updated[targetPos] = newImg;
            } else {
              updated.push(newImg);
            }
          });
          return { ...block, images: updated };
        })
      );
      showToast(
        files.length === 1
          ? `Foto agregada en Celda ${slotIdx + 1} (Pág. ${pageIndex + 1})`
          : `${files.length} fotos colocadas a partir de Celda ${slotIdx + 1}`
      );
    });
  };

  const handleDropFilesOnPage = (files: File[], pageIndex: number) => {
    if (!files || files.length === 0) return;
    const targetPage = pages[pageIndex];
    if (!targetPage || !targetPage.blockId) return;
    processAndAddFilesToBlock(files, targetPage.blockId);
  };

  // --- DATE BLOCKS MANAGEMENT ---
  const handleAddDateBlock = () => {
    const newId = `block-${Date.now()}`;
    const newBlock: DateBlock = {
      id: newId,
      fecha: metadata.fechaInventario || new Date().toLocaleDateString("es-MX"),
      titulo: "",
      images: [],
    };
    setDateBlocks((prev) => [...prev, newBlock]);
    setActiveBlockId(newId);
    showToast("Nuevo bloque de fecha agregado");
  };

  const handleDeleteDateBlock = (blockId: string) => {
    if (dateBlocks.length <= 1) {
      showToast("Debe existir al menos un bloque de fecha", "info");
      return;
    }
    if (confirm("¿Está seguro de que desea eliminar este bloque de fecha y sus imágenes?")) {
      setDateBlocks((prev) => prev.filter((b) => b.id !== blockId));
      if (activeBlockId === blockId) {
        const remaining = dateBlocks.filter((b) => b.id !== blockId);
        setActiveBlockId(remaining[0].id);
      }
      showToast("Bloque de fecha eliminado");
    }
  };

  const handleUpdateDateBlock = (blockId: string, fields: Partial<DateBlock>) => {
    setDateBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, ...fields } : b))
    );
  };

  // Loading maintenance sample presets (2 blocks with different dates)
  const handleLoadDemo = () => {
    const block1Images: ReportImage[] = DEMO_PHOTOS.slice(0, 4).map((photo, i) => ({
      id: `demo-1-${i}-${Math.random().toString(36).substring(2, 5)}`,
      url: photo.url,
      name: photo.name,
      size: photo.size,
      rotation: 0 as const,
      fit: "contain" as const,
    }));

    const block2Images: ReportImage[] = DEMO_PHOTOS.slice(4, 8).map((photo, i) => ({
      id: `demo-2-${i}-${Math.random().toString(36).substring(2, 5)}`,
      url: photo.url,
      name: photo.name,
      size: photo.size,
      rotation: 0 as const,
      fit: "contain" as const,
    }));

    setDateBlocks([
      {
        id: "block-demo-1",
        fecha: metadata.fechaInventario || "11/06/2026",
        titulo: "",
        images: block1Images,
      },
      {
        id: "block-demo-2",
        fecha: "12/06/2026",
        titulo: "",
        images: block2Images,
      },
    ]);
    setActiveBlockId("block-demo-1");
    setViewMode("edit");
    showToast("Ejemplo cargado con 2 bloques de fechas organizadas");
  };

  // Clear all images
  const handleClearAll = () => {
    if (confirm("¿Está seguro de que desea limpiar todas las imágenes?")) {
      setDateBlocks([
        {
          id: "block-1",
          fecha: metadata.fechaInventario || "11/06/2026",
          titulo: "",
          images: [],
        },
      ]);
      setActiveBlockId("block-1");
      setPageConfigs([]);
      showToast("Se limpiaron todas las imágenes");
    }
  };

  // --- IMAGE CONTROLS ---
  const handleRotateImage = (id: string) => {
    setDateBlocks((prev) =>
      prev.map((b) => ({
        ...b,
        images: b.images.map((img) => {
          if (img.id === id) {
            const nextRotation = ((img.rotation + 90) % 360) as 0 | 90 | 180 | 270;
            return { ...img, rotation: nextRotation };
          }
          return img;
        }),
      }))
    );
  };

  const handleToggleFit = (id: string) => {
    setDateBlocks((prev) =>
      prev.map((b) => ({
        ...b,
        images: b.images.map((img) => {
          if (img.id === id) {
            return { ...img, fit: img.fit === "contain" ? "cover" : "contain" };
          }
          return img;
        }),
      }))
    );
  };

  const handleDeleteImage = (id: string) => {
    setDateBlocks((prev) =>
      prev.map((b) => ({
        ...b,
        images: b.images.filter((img) => img.id !== id && !img.isBlank),
      }))
    );
    showToast("Imagen eliminada");
  };

  const handleMoveImageInBlock = (blockId: string, index: number, direction: "left" | "right") => {
    setDateBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b;
        const targetIdx = direction === "left" ? index - 1 : index + 1;
        if (targetIdx < 0 || targetIdx >= b.images.length) return b;

        const updated = [...b.images];
        const temp = updated[index];
        updated[index] = updated[targetIdx];
        updated[targetIdx] = temp;
        return { ...b, images: updated };
      })
    );
  };

  const handleMoveImageToBlock = (imageId: string, targetBlockId: string) => {
    let movedImage: ReportImage | null = null;

    setDateBlocks((prev) => {
      // 1. Remove from source
      const cleaned = prev.map((b) => {
        const found = b.images.find((img) => img.id === imageId);
        if (found) {
          movedImage = found;
          return { ...b, images: b.images.filter((img) => img.id !== imageId) };
        }
        return b;
      });

      if (!movedImage) return prev;

      // 2. Add to target
      return cleaned.map((b) => {
        if (b.id === targetBlockId) {
          return { ...b, images: [...b.images, movedImage!] };
        }
        return b;
      });
    });

    showToast("Imagen movida al nuevo bloque de fecha");
  };

  // Batch actions
  const handleRotateAll = () => {
    setDateBlocks((prev) =>
      prev.map((b) => ({
        ...b,
        images: b.images.map((img) => {
          if (img.isBlank) return img;
          const nextRotation = ((img.rotation + 90) % 360) as 0 | 90 | 180 | 270;
          return { ...img, rotation: nextRotation };
        }),
      }))
    );
    showToast("Todas las imágenes fueron rotadas 90°");
  };

  const handleToggleFitAll = (mode: "contain" | "cover") => {
    setDateBlocks((prev) =>
      prev.map((b) => ({
        ...b,
        images: b.images.map((img) => (img.isBlank ? img : { ...img, fit: mode })),
      }))
    );
    showToast(`Todas las imágenes en modo ${mode === "contain" ? "Ajustar" : "Llenar"}`);
  };

  const handleInsertSpacer = (blockId: string) => {
    const spacer: ReportImage = {
      id: `spacer-${Math.random().toString(36).substring(2, 9)}`,
      url: "",
      name: "Espacio en blanco",
      size: 0,
      rotation: 0,
      fit: "contain",
      isBlank: true,
    };
    setDateBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, images: [...b.images, spacer] } : b))
    );
    showToast("Espacio en blanco añadido al bloque");
  };

  const handleCompactImages = () => {
    setDateBlocks((prev) =>
      prev.map((b) => ({
        ...b,
        images: b.images.filter((img) => !img.isBlank && !!img.url),
      }))
    );
    showToast("Imágenes recorridas y espacios vacíos eliminados");
  };

  const handleUpdateCoverImage = (url: string) => {
    setMetadata((prev) => ({ ...prev, coverImageUrl: url }));
    showToast("Imagen de portada actualizada con éxito");
  };

  // --- PAGE CONFIG ACTIONS ---
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
    window.print();
  };

  const triggerPDFDownload = async () => {
    if (totalImagesCount === 0) {
      alert("Por favor cargue al menos una imagen antes de exportar.");
      return;
    }

    setIsGeneratingPdf(true);
    setPdfProgress(10);

    try {
      const doc = await generateReportPDF(
        metadata,
        footer,
        dateBlocks,
        pageConfigs,
        (progress) => {
          setPdfProgress(Math.min(95, 10 + Math.round(progress * 0.85)));
        }
      );

      setPdfProgress(100);
      const cleanName = isVideo
        ? `extraccion_video_${metadata.sucursal.toLowerCase()}_${(metadata.incidenteTask || "sctask").toLowerCase()}.pdf`.replace(/\s+/g, "_")
        : `${metadata.tipoTrabajo.toLowerCase()}_${metadata.sucursal.toLowerCase()}_${metadata.cc}.pdf`.replace(/\s+/g, "_");
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
            {totalImagesCount === 0 && (
              <button
                type="button"
                onClick={handleLoadDemo}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 hover:border-amber-500/30 text-xs font-semibold rounded-lg transition-all shadow-xs cursor-pointer"
                title="Carga fotos de demostración con bloques de fecha para probar el sistema"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Cargar Ejemplo (Multi-Fecha)
              </button>
            )}

            {totalImagesCount > 0 && (
              <>
                <div className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-xs font-mono font-bold text-slate-300">
                  {totalImagesCount} Foto{totalImagesCount !== 1 ? "s" : ""} | {dateBlocks.length} Fecha{dateBlocks.length !== 1 ? "s" : ""} | {totalPages} Pág{totalPages !== 1 ? "s" : ""}
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

          {/* B. Date Blocks & Evidence Uploader */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-indigo-600" /> Bloques por Fecha ({dateBlocks.length})
              </h2>
              <button
                type="button"
                onClick={handleAddDateBlock}
                className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100 transition-all cursor-pointer"
                title="Agregar otra fecha o jornada de trabajo"
              >
                <Plus className="w-3.5 h-3.5" /> Nueva Fecha
              </button>
            </div>

            {/* Date Block Selector Tabs */}
            <div className="flex flex-wrap gap-1.5">
              {dateBlocks.map((b, idx) => {
                const isActive = b.id === activeBlock.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setActiveBlockId(b.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      isActive
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                    }`}
                  >
                    <Calendar className="w-3 h-3 shrink-0" />
                    <span>{b.fecha || `Fecha ${idx + 1}`}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isActive ? "bg-indigo-700 text-indigo-100" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {b.images.filter((img) => !img.isBlank).length}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Block Quick Settings Card */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  Editando Bloque Activo
                </span>
                {dateBlocks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteDateBlock(activeBlock.id)}
                    className="text-rose-500 hover:text-rose-700 text-xs font-semibold flex items-center gap-0.5 cursor-pointer"
                    title="Eliminar este bloque de fecha"
                  >
                    <Trash2 className="w-3 h-3" /> Eliminar
                  </button>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Fecha del Bloque (Aparecerá en el encabezado)
                </label>
                <input
                  type="text"
                  value={activeBlock.fecha}
                  onChange={(e) =>
                    handleUpdateDateBlock(activeBlock.id, { fecha: e.target.value })
                  }
                  placeholder="DD/MM/AAAA"
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Drag & Drop uploader area for this active block */}
              <div
                onClick={() => handleBlockUploadClick(activeBlock.id)}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDraggingSidebar(true);
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDraggingSidebar(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                  setIsDraggingSidebar(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDraggingSidebar(false);
                  const files = extractImageFiles(e);
                  if (files.length > 0) {
                    processAndAddFilesToBlock(files, activeBlock.id);
                  }
                }}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all group flex flex-col items-center gap-1.5 ${
                  isDraggingSidebar
                    ? "border-indigo-600 bg-indigo-50/90 scale-[1.02] shadow-sm ring-2 ring-indigo-400"
                    : "border-indigo-200 hover:border-indigo-500 bg-white hover:bg-indigo-50/20"
                }`}
              >
                <div className={`p-2 rounded-lg transition-all ${
                  isDraggingSidebar
                    ? "bg-indigo-600 text-white animate-bounce"
                    : "bg-indigo-50 text-indigo-600 group-hover:scale-105"
                }`}>
                  <Camera className="w-5 h-5 stroke-2" />
                </div>
                <p className="text-xs font-bold text-gray-700">
                  {isDraggingSidebar ? "¡Soltar fotos aquí!" : `Subir fotos para ${activeBlock.fecha}`}
                </p>
                <p className="text-[10px] text-gray-400">
                  Arrastre y suelte fotos aquí o haga clic para examinar
                </p>
              </div>

              <div className="flex justify-between items-center text-[10px] text-gray-500 pt-1">
                <span>{activeBlock.images.filter((img) => !img.isBlank).length} fotos en esta fecha</span>
                <button
                  type="button"
                  onClick={() => handleInsertSpacer(activeBlock.id)}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                >
                  + Añadir Espacio Vacío
                </button>
              </div>
            </div>

            {/* Batch layout quick adjusters */}
            {totalImagesCount > 0 && (
              <div className="space-y-2.5 pt-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Acciones por Lote</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleRotateAll}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-gray-200 hover:border-gray-300 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-gray-500" /> Rotar Todas 90°
                  </button>

                  <button
                    type="button"
                    onClick={handleCompactImages}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 hover:border-indigo-300 rounded-lg text-xs font-semibold transition-all cursor-pointer font-sans"
                    title="Elimina espacios vacíos y recorre las imágenes"
                  >
                    <Layers className="w-3.5 h-3.5 text-indigo-600" /> Recorrer Fotos
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleFitAll("contain")}
                    className="flex items-center justify-center gap-1 px-2 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-gray-200 hover:border-gray-300 rounded-lg text-[10px] font-semibold transition-all cursor-pointer"
                  >
                    <Minimize2 className="w-3 h-3 text-gray-500" /> Ajustar Todas
                  </button>

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
              <h4 className="text-xs font-bold font-display">Organización por Fechas</h4>
              <p className="text-[10px] leading-relaxed font-medium">
                Cada bloque de fecha inicia automáticamente en una página nueva del reporte. Puede tener diferentes jornadas de trabajo dentro del mismo documento PDF.
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
                <SlidersHorizontal className="w-3.5 h-3.5" /> Edición por Fechas ({dateBlocks.length} fechas)
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
              <button
                type="button"
                disabled={totalImagesCount === 0}
                onClick={triggerBrowserPrint}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-gray-200 transition-all cursor-pointer"
                title="Abre la ventana de impresión del navegador. Excelente calidad vectorial."
              >
                <Printer className="w-4 h-4" /> Imprimir Reporte
              </button>

              <button
                type="button"
                disabled={totalImagesCount === 0 || isGeneratingPdf}
                onClick={triggerPDFDownload}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                title="Generar y descargar el PDF completo del reporte con todos los bloques de fechas"
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
            {totalImagesCount === 0 ? (
              /* Empty Placeholder display state with Drag & Drop support */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingEmpty(true);
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setIsDraggingEmpty(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                  setIsDraggingEmpty(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingEmpty(false);
                  const files = extractImageFiles(e);
                  if (files.length > 0) {
                    processAndAddFilesToBlock(files, activeBlock.id);
                  }
                }}
                className={`no-print bg-white rounded-xl shadow-xs border p-12 text-center h-full flex flex-col items-center justify-center gap-4 transition-all ${
                  isDraggingEmpty
                    ? "border-2 border-dashed border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-200 scale-[1.01]"
                    : "border-gray-100"
                }`}
              >
                <div className={`p-4 rounded-full transition-all ${
                  isDraggingEmpty ? "bg-indigo-600 text-white animate-bounce" : "bg-indigo-50 text-indigo-600 animate-pulse"
                }`}>
                  {isDraggingEmpty ? <Upload className="w-10 h-10 stroke-2" /> : <Camera className="w-10 h-10 stroke-1.5" />}
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h3 className="font-bold text-gray-800 text-base">
                    {isDraggingEmpty ? "¡Suelte las fotos aquí para iniciar el reporte!" : "Cargue o arrastre sus fotos para empezar"}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed font-medium">
                    Arrastre sus fotos directamente sobre la pantalla o elija una fecha para organizarlas en cuadrículas 2x2.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLoadDemo}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 mt-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Cargar Ejemplo (2 Fechas)
                </button>
              </div>
            ) : viewMode === "edit" ? (
              /* QUICK EDITING MODE: GROUPED BY DATE BLOCKS */
              <div className="no-print space-y-6">
                {dateBlocks.map((block, blockIndex) => {
                  const availableBlocksForDropdown = dateBlocks.map((b) => ({
                    id: b.id,
                    fecha: b.fecha,
                    titulo: b.titulo,
                  }));

                  return (
                    <div
                      key={block.id}
                      className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden"
                    >
                      {/* Block Section Header */}
                      <div className="bg-slate-50 border-b border-gray-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Fecha #{blockIndex + 1}:
                              </span>
                              <input
                                type="text"
                                value={block.fecha}
                                onChange={(e) =>
                                  handleUpdateDateBlock(block.id, { fecha: e.target.value })
                                }
                                placeholder="DD/MM/AAAA"
                                className="font-bold text-sm text-gray-900 bg-white border border-gray-300 rounded px-2 py-0.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Badges & Block Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <span className="text-xs font-mono font-semibold bg-gray-200 text-gray-700 px-2.5 py-1 rounded-md">
                            {block.images.length} fotos • {Math.max(1, Math.ceil(block.images.length / 4))} pág(s)
                          </span>

                          <button
                            type="button"
                            onClick={() => handleBlockUploadClick(block.id)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 transition-all cursor-pointer"
                            title="Subir más fotos a esta fecha"
                          >
                            <Upload className="w-3.5 h-3.5" /> Subir Fotos
                          </button>

                          {dateBlocks.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteDateBlock(block.id)}
                              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                              title="Eliminar este bloque"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Images Grid for this Date Block */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOverBlockId(block.id);
                        }}
                        onDragEnter={(e) => {
                          e.preventDefault();
                          setDragOverBlockId(block.id);
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                          setDragOverBlockId(null);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragOverBlockId(null);
                          const files = extractImageFiles(e);
                          if (files.length > 0) {
                            processAndAddFilesToBlock(files, block.id);
                          }
                        }}
                        className={`p-4 transition-all ${
                          dragOverBlockId === block.id ? "bg-indigo-50/50 ring-2 ring-indigo-400 rounded-b-xl" : ""
                        }`}
                      >
                        {block.images.length === 0 ? (
                          <div
                            onClick={() => handleBlockUploadClick(block.id)}
                            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${
                              dragOverBlockId === block.id
                                ? "border-indigo-600 bg-indigo-100/50 text-indigo-700"
                                : "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/10 text-gray-400 hover:text-indigo-600"
                            }`}
                          >
                            <Plus className="w-8 h-8 stroke-1.5" />
                            <span className="text-xs font-semibold">
                              {dragOverBlockId === block.id
                                ? "¡Soltar fotos para añadir a esta fecha!"
                                : "No hay fotos en esta fecha. Arrastre aquí o haga clic para agregar imágenes."}
                            </span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {block.images.map((image, imgIdx) => (
                              <ImageItem
                                key={image.id}
                                image={image}
                                index={imgIdx}
                                total={block.images.length}
                                onRotate={handleRotateImage}
                                onToggleFit={handleToggleFit}
                                onDelete={handleDeleteImage}
                                onMove={(idx, dir) => handleMoveImageInBlock(block.id, idx, dir)}
                                currentBlockId={block.id}
                                availableBlocks={availableBlocksForDropdown}
                                onMoveToBlock={handleMoveImageToBlock}
                              />
                            ))}

                            {/* Quick Add Blank Space in this block */}
                            <button
                              type="button"
                              onClick={() => handleInsertSpacer(block.id)}
                              className="border-2 border-dashed border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/10 rounded-xl p-4 flex flex-col justify-center items-center gap-2 text-gray-400 hover:text-indigo-600 transition-all h-56 cursor-pointer"
                            >
                              <Plus className="w-6 h-6 stroke-1.5" />
                              <span className="text-xs font-semibold">Añadir Espacio Vacío</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Bottom Add New Date Block Button */}
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={handleAddDateBlock}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Agregar Nueva Fecha / Bloque
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
                      Cada bloque de fecha inicia en una hoja nueva. Cada hoja muestra hasta 4 imágenes en cuadrícula 2x2. Los subencabezados y fechas se reflejan automáticamente en cada hoja.
                    </p>
                  </div>
                </div>

                {pages.map((page) => {
                  const currentConfig = pageConfigs.find((c) => c.pageIndex === page.pageIndex) || {
                    pageIndex: page.pageIndex,
                    subHeader: page.subHeaderDefault,
                    showSubHeader: !page.isCover,
                  };

                  return (
                    <div key={page.pageIndex} className="space-y-2.5 w-full flex flex-col items-center">
                      
                      {/* Interactive Sheet Metadata and Config controls (Hovering above the paper preview) */}
                      <div className="w-full max-w-[215.9mm] bg-white border border-gray-150 rounded-lg p-3 flex justify-between items-center shadow-2xs">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-700">
                            Hoja #{page.pageIndex + 1} de {totalPages}
                          </span>
                          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-100">
                            {page.isCover ? "Portada CSIS" : `Fecha: ${page.fecha}`}
                          </span>
                        </div>

                        {!page.isCover && (
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={currentConfig.showSubHeader}
                                onChange={() => handleTogglePageSubheader(page.pageIndex)}
                                className="w-3.5 h-3.5 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="text-xs font-medium text-gray-600">Mostrar subencabezado</span>
                            </label>
                          </div>
                        )}
                      </div>

                      {/* The physical Letter Sheet layout */}
                      <PagePreviewSheet
                        pageIndex={page.pageIndex}
                        totalPages={totalPages}
                        metadata={metadata}
                        footer={footer}
                        images={page.images}
                        pageConfig={currentConfig}
                        onUpdatePageConfig={handleUpdatePageConfig}
                        onCellImageRotate={handleRotateImage}
                        onCellImageToggleFit={handleToggleFit}
                        onCellImageDelete={handleDeleteImage}
                        onCellUploadClick={handleCellUploadClick}
                        onCellImagePaste={handleInsertImageAtCell}
                        onCellImageDrop={handleInsertFilesAtCell}
                        onPageDrop={handleDropFilesOnPage}
                        onUpdateCoverImage={handleUpdateCoverImage}
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
      <div className="hidden print:block bg-white w-full h-full">
        {pages.map((page) => {
          const currentConfig = pageConfigs.find((c) => c.pageIndex === page.pageIndex) || {
            pageIndex: page.pageIndex,
            subHeader: page.subHeaderDefault,
            showSubHeader: !page.isCover,
          };

          return (
            <PagePreviewSheet
              key={`print-sheet-${page.pageIndex}`}
              pageIndex={page.pageIndex}
              totalPages={totalPages}
              metadata={metadata}
              footer={footer}
              images={page.images}
              pageConfig={currentConfig}
              onUpdatePageConfig={handleUpdatePageConfig}
              onCellImageRotate={handleRotateImage}
              onCellImageToggleFit={handleToggleFit}
              onCellImageDelete={handleDeleteImage}
              onCellUploadClick={handleCellUploadClick}
              onCellImagePaste={handleInsertImageAtCell}
              onCellImageDrop={handleInsertFilesAtCell}
              onPageDrop={handleDropFilesOnPage}
            />
          );
        })}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Hidden File inputs */}
      <input
        type="file"
        ref={blockFileInputRef}
        onChange={handleBlockFileInputChange}
        multiple
        accept="image/*"
        className="hidden"
      />
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
