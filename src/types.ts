export interface ReportMetadata {
  sucursal: string;
  cc: string;
  fechaInventario: string;
  tipoTrabajo: string;
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

export interface PageConfig {
  pageIndex: number;
  subHeader: string;
  showSubHeader: boolean;
}
