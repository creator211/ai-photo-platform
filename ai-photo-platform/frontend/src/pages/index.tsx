import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface Celebrity {
  id: number;
  name: string;
  category: string;
  thumbnail_path: string;
  description: string | null;
  popularity: number;
}

export default function HomePage() {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [selectedCelebrity, setSelectedCelebrity] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchCelebrities();
  }, []);
  
  const fetchCelebrities = async () => {
    try {
      const response = await axios.get(`${API_BASE}/celebrities`);
      setCelebrities(response.data);
    } catch (error) {
      console.error('Failed to fetch celebrities:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpload = async (file: File, celebrityId: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('celebrity_id', celebrityId.toString());
    formData.append('effect_type', 'street_candid');
    
    // TODO: 需要先登录获取 token
    // const token = localStorage.getItem('token');
    
    try {
      const response = await axios.post(`${API_BASE}/photos/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'Authorization': `Bearer ${token}`
        },
      });
      console.log('Upload success:', response.data);
      // 跳转到结果页面或显示处理中状态
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              与明星合影
            </span>
            <br />
            <span className="text-gray-900">就是这么简单</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            AI 街拍风格，让你的照片看起来像是在街头被专业摄影师捕捉。
            选择你喜欢的明星，瞬间生成自然抓拍感的合影。
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            <span className="px-4 py-2 bg-white rounded-full shadow-sm text-gray-600">
              ✓ 完全免费
            </span>
            <span className="px-4 py-2 bg-white rounded-full shadow-sm text-gray-600">
              ✓ 高清质感
            </span>
            <span className="px-4 py-2 bg-white rounded-full shadow-sm text-gray-600">
              ✓ 自然抓拍
            </span>
            <span className="px-4 py-2 bg-white rounded-full shadow-sm text-gray-600">
              ✓ 隐私保护
            </span>
          </motion.div>
        </div>
      </section>
      
      {/* 上传区域 */}
      <section className="py-12 px-4">
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <PhotoUploader
            celebrities={celebrities}
            selectedCelebrity={selectedCelebrity}
            onCelebritySelect={setSelectedCelebrity}
            onUpload={handleUpload}
          />
        )}
      </section>
      
      {/* 作品展示 */}
      <section id="gallery" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">作品展示</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="aspect-[3/4] bg-gray-200 rounded-xl overflow-hidden cursor-pointer photo-card"
              >
                <img
                  src={`/gallery/sample-${i}.jpg`}
                  alt={`作品 ${i}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 功能特点 */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">为什么选择我们</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <Camera className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">自然抓拍感</h3>
              <p className="text-gray-600">
                AI 智能模拟街拍场景，自然的光影、动态的构图，让合影看起来就像专业摄影师在街头抓拍的一样。
              </p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">高清质感</h3>
              <p className="text-gray-600">
                采用先进的 AI 增强技术，每张照片都经过超分辨率处理，确保输出高清画质。
              </p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">快速生成</h3>
              <p className="text-gray-600">
                优化的 AI 流水线，最快 30 秒即可生成你的专属街拍合影。
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Camera({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function Zap({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}
