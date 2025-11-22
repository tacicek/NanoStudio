import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string, mimeType: string) => void;
  onClear: () => void;
  selectedImage: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, onClear, selectedImage }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onImageSelected(reader.result, file.type);
      }
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  if (selectedImage) {
    return (
      <div className="relative w-full h-64 md:h-96 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-lg group">
        <img 
          src={selectedImage} 
          alt="Original Upload" 
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={onClear}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
            title="Remove Image"
          >
            <X size={24} />
          </button>
        </div>
        <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
          Original
        </div>
      </div>
    );
  }

  return (
    <label
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`
        relative flex flex-col items-center justify-center w-full h-64 md:h-96 
        border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-500/10' 
          : 'border-slate-600 hover:border-indigo-400 hover:bg-slate-800'
        }
      `}
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
        <div className={`p-4 rounded-full mb-4 ${isDragging ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
          <Upload size={32} />
        </div>
        <p className="mb-2 text-lg font-medium text-slate-200">
          <span className="font-bold text-indigo-400">Click to upload</span> or drag and drop
        </p>
        <p className="text-sm text-slate-400">
          SVG, PNG, JPG or WEBP (MAX. 5MB)
        </p>
        <p className="text-xs text-slate-500 mt-4">
          Upload an image to edit, or skip to generate from scratch.
        </p>
      </div>
      <input type="file" className="hidden" onChange={onInputChange} accept="image/*" />
    </label>
  );
};
