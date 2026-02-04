'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, Sparkles, Loader2, CheckCircle } from 'lucide-react';

interface PhotoUploaderProps {
  onUpload: (file: File, celebrityId: number) => Promise<void>;
  celebrities: Celebrity[];
  selectedCelebrity: number | null;
  onCelebritySelect: (id: number) => void;
}

interface Celebrity {
  id: number;
  name: string;
  category: string;
  thumbnail_path: string;
  popularity: number;
}

export default function PhotoUploader({
  onUpload,
  celebrities,
  selectedCelebrity,
  onCelebritySelect,
}: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // 创建预览
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setUploaded(true);
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });
  
  const handleUpload = async () => {
    if (!preview || !selectedCelebrity) return;
    
    setUploading(true);
    try {
      // 获取文件
      const response = await fetch(preview);
      const blob = await response.blob();
      const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
      
      await onUpload(file, selectedCelebrity);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        {/* 步骤指示器 */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${selectedCelebrity ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                selectedCelebrity ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                {selectedCelebrity ? <CheckCircle size={16} /> : '1'}
              </div>
              <span className="ml-2">选择明星</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-200" />
            <div className={`flex items-center ${uploaded ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                uploaded ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                {uploaded ? <CheckCircle size={16} /> : '2'}
              </div>
              <span className="ml-2">上传照片</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-200" />
            <div className={`flex items-center ${uploading ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                uploading ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                {uploading ? <Loader2 size={16} className="animate-spin" /> : '3'}
              </div>
              <span className="ml-2">生成合影</span>
            </div>
          </div>
        </div>
        
        {/* 明星选择 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">选择明星模板</h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
            {celebrities.map((celebrity) => (
              <motion.button
                key={celebrity.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCelebritySelect(celebrity.id)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                  selectedCelebrity === celebrity.id
                    ? 'border-primary-600 ring-2 ring-primary-200'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img
                  src={celebrity.thumbnail_path || '/default-avatar.png'}
                  alt={celebrity.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="text-white text-xs font-medium truncate">
                    {celebrity.name}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* 上传区域 */}
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-8"
            >
              <div className="relative aspect-[4/5] max-h-96 mx-auto rounded-xl overflow-hidden">
                <img
                  src={preview}
                  alt="预览"
                  className="w-full h-full object-contain bg-gray-100"
                />
                <button
                  onClick={() => {
                    setPreview(null);
                    setUploaded(false);
                  }}
                  className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition ${
                isDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                {isDragActive ? '拖放照片到这里' : '点击或拖放照片'}
              </p>
              <p className="text-sm text-gray-500">
                支持 PNG、JPG、WEBP，最大 10MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* 生成按钮 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUpload}
          disabled={!preview || !selectedCelebrity || uploading}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition ${
            !preview || !selectedCelebrity || uploading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {uploading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2" />
              AI 正在生成中...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Sparkles className="mr-2" />
              生成街拍合影
            </span>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}
