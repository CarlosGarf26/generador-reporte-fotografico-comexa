export type ReportType = "fotografico" | "extraccion_video";

export interface ReportMetadata {
  sucursal: string;
  cc: string;
  fechaInventario: string;
  tipoTrabajo: string;
  // Specific properties for Extracción de Video
  reportType?: ReportType;
  incidenteTask?: string;
  tecnicoAtiende?: string;
  coverImageUrl?: string;
}

export interface ReportFooter {
  direccion: string;
  telefono: string;
  comexaInfo: string;
  permiso: string;
  expediente: string;
}

export interface ReportImage {
  id: string;
  url: string; // Base64 or object URL of the uploaded image
  name: string;
  size: number;
  rotation: 0 | 90 | 180 | 270;
  fit: "contain" | "cover";
  caption?: string; // Optional subtitle
  isBlank?: boolean; // True if this represents a blank placeholder space
}

export interface DateBlock {
  id: string;
  fecha: string;
  titulo?: string;
  images: ReportImage[];
}

export interface PageConfig {
  pageIndex: number;
  subHeader: string;
  showSubHeader: boolean;
  blockId?: string;
  fecha?: string;
}

export interface PageInfo {
  pageIndex: number;
  isCover: boolean;
  blockId?: string;
  blockIndex?: number;
  pageInBlock?: number;
  fecha: string;
  subHeaderDefault: string;
  images: ReportImage[];
}
