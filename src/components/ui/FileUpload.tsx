"use client";

import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from "react";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";

interface FileUploadProps {
  /** Accepted file types (MIME), e.g. "image/*" or "image/png,.pdf" */
  accept?: string;
  /** Max file size in MB */
  maxSizeMB?: number;
  /** Callback when a valid file is selected */
  onFile: (file: File) => void;
  /** Whether to show image preview for image files */
  preview?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Label text */
  label?: string;
}

/**
 * Drag-and-drop file upload zone with image preview.
 *
 * @example
 * <FileUpload accept="image/*" maxSizeMB={5} onFile={(f) => console.log(f)} preview />
 */
export default function FileUpload({
  accept,
  maxSizeMB = 10,
  onFile,
  preview = true,
  className = "",
  label = "Drop file here or click to browse",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(
    (f: File): boolean => {
      if (f.size > maxSizeMB * 1024 * 1024) {
        setError(`File exceeds ${maxSizeMB} MB limit`);
        return false;
      }
      setError(null);
      return true;
    },
    [maxSizeMB]
  );

  const handleFile = useCallback(
    (f: File) => {
      if (!validate(f)) return;
      setFile(f);

      // Generate preview for images
      if (preview && f.type.startsWith("image/")) {
        const url = URL.createObjectURL(f);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }

      onFile(f);
    },
    [validate, preview, onFile]
  );

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const clear = () => {
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={className}>
      {/* Drop zone */}
      {!file ? (
        <div
          role="button"
          tabIndex={0}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
          className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 cursor-pointer transition-all ${
            dragging
              ? "border-primary/60 bg-primary/5"
              : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
          }`}
        >
          <div className={`rounded-xl border p-3 transition ${dragging ? "border-primary/30 bg-primary/10" : "border-white/10 bg-white/5"}`}>
            <Upload className={`h-6 w-6 transition ${dragging ? "text-primary" : "text-zinc-500"}`} />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-zinc-400">{label}</p>
            <p className="mt-1 text-[11px] text-zinc-600">
              Max {maxSizeMB} MB{accept ? ` · ${accept}` : ""}
            </p>
          </div>
        </div>
      ) : (
        /* File preview */
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-4">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="h-16 w-16 rounded-xl border border-white/10 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-white/10 bg-white/5">
              {file.type.startsWith("image/") ? (
                <ImageIcon className="h-6 w-6 text-zinc-500" />
              ) : (
                <FileText className="h-6 w-6 text-zinc-500" />
              )}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-white truncate">{file.name}</p>
            <p className="mt-0.5 text-xs text-zinc-500">{formatSize(file.size)}</p>
          </div>
          <button
            onClick={clear}
            className="shrink-0 rounded-lg p-1.5 text-zinc-400 hover:bg-white/5 hover:text-rose-400 transition cursor-pointer"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {/* Error */}
      {error && (
        <p className="mt-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-base font-semibold text-rose-400">
          {error}
        </p>
      )}
    </div>
  );
}
