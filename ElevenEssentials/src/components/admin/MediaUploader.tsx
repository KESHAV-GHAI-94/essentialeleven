"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, File, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MediaUploaderProps {
  onUploadComplete: (urls: string[]) => void;
  maxFiles?: number;
  initialUrls?: string[];
}

export function MediaUploader({ onUploadComplete, maxFiles = 5, initialUrls = [] }: MediaUploaderProps) {
  const [files, setFiles] = useState<any[]>(
    initialUrls.map((url, idx) => ({
      name: `img-${idx}-${Date.now()}`, // Truly unique ID
      preview: url,
      status: 'complete',
      url: url,
      type: 'image/jpeg'
    }))
  );
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB
        alert(`File ${file.name} is too large. Max size is 10MB.`);
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file),
      status: 'pending'
    }))].slice(0, maxFiles));
  }, [maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'video/*': []
    },
    maxFiles
  });

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(f => (f.url || f.preview) !== id);
    setFiles(updatedFiles);
    // Notify parent of deletion
    const urls = updatedFiles
      .filter(f => f.status === 'complete')
      .map(f => f.url);
    onUploadComplete(urls);
  };

  const uploadFiles = async () => {
    setUploading(true);
    const urls: string[] = [];

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
       alert("Cloudinary configuration missing in .env");
       setUploading(false);
       return;
    }

    try {
      for (const file of files) {
        if (file.status === 'complete') {
          urls.push(file.url);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Cloudinary Error Detail:", errorData);
          throw new Error(errorData.error?.message || "Cloudinary upload failed");
        }

        const data = await response.json();
        urls.push(data.secure_url);
        
        setFiles(prev => prev.map(f => f.name === file.name ? { 
          ...f, 
          status: 'complete', 
          url: data.secure_url,
          preview: data.secure_url // Update preview to remote URL
        } : f));
      }
      onUploadComplete(urls);
    } catch (error: any) {
      console.error('Full Error Detail:', error);
      alert(`Upload failed: ${error.message}. Please verify that your 'eleven_essentials' preset is set to UNSIGNED in Cloudinary.`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div 
        {...getRootProps()} 
        className={cn(
          "border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer group",
          isDragActive ? "border-saffron bg-saffron/5" : "border-navy-100 hover:border-navy-200 bg-white shadow-sm"
        )}
      >
        <input {...getInputProps()} />
        <div className="w-16 h-16 bg-navy-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
          <Upload className="text-navy-400 group-hover:text-saffron transition-colors" />
        </div>
        <p className="text-lg font-bold text-navy-900">Upload Media to Cloudinary</p>
        <p className="text-sm text-navy-400 font-medium mt-1">Drag & drop or click to browse</p>
        <p className="text-[10px] text-navy-300 font-bold uppercase tracking-widest mt-4 italic">Enjoy 25GB free storage with fast CDN delivery</p>
      </div>

      {files.length > 0 && (
        <div className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {files.map((file) => (
              <div key={file.name} className="relative aspect-square rounded-2xl overflow-hidden group border border-navy-50 bg-navy-50/30">
                {file.preview && !file.error && (file.type?.startsWith('image/') || file.preview.match(/\.(jpg|jpeg|png|webp|gif|svg)$|blob:/i)) ? (
                  <Image 
                    src={file.preview} 
                    alt="preview" 
                    fill 
                    className="object-cover" 
                    unoptimized
                    onError={() => {
                      setFiles(prev => prev.map(f => f.name === file.name ? { ...f, error: true } : f));
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-navy-50/50">
                    <File className="text-navy-200" size={24} />
                    {file.error && <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center"><X className="text-red-500" size={24} /></div>}
                  </div>
                )}
                
                <div className="absolute inset-0 bg-navy-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button 
                     onClick={() => removeFile(file.url || file.preview)}
                     className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                   >
                     <X size={16} />
                   </button>
                </div>

                {file.status === 'complete' && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 shadow-lg">
                    <CheckCircle2 size={12} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-navy-50 pt-6">
            <p className="text-xs font-bold text-navy-400 uppercase tracking-widest">{files.length} files selected</p>
            <button 
              onClick={uploadFiles}
              disabled={uploading || files.every(f => f.status === 'complete')}
              className="bg-navy-900 text-white rounded-xl px-8 py-3.5 font-bold text-sm shadow-xl shadow-navy-100 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? 'Start Cloudinary Upload' : 'Confirm & Upload'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
