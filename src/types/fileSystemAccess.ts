// File System Access API types
export interface CustomFileSystemFileHandle {
  readonly kind: 'file';
  readonly name: string;
  getFile(): Promise<File>;
  createWritable(): Promise<CustomFileSystemWritableFileStream>;
}

export interface CustomFileSystemWritableFileStream extends WritableStream {
  write(data: string | BufferSource | Blob): Promise<void>;
  close(): Promise<void>;
}

export interface FilePickerAcceptType {
  description?: string;
  accept: Record<string, string[]>;
}

export interface FilePickerOptions {
  types?: FilePickerAcceptType[];
  excludeAcceptAllOption?: boolean;
  multiple?: boolean;
}

export interface SaveFilePickerOptions extends Omit<FilePickerOptions, 'multiple'> {
  suggestedName?: string;
}

declare global {
  interface Window {
    showOpenFilePicker?: (options?: FilePickerOptions) => Promise<CustomFileSystemFileHandle[]>;
    showSaveFilePicker?: (options?: SaveFilePickerOptions) => Promise<CustomFileSystemFileHandle>;
  }
}