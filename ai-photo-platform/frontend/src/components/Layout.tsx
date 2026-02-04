import React from 'react';
import Head from 'next/head';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'AI Street Photo' }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="AI生成与明星的街拍合影" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* 顶部导航 */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-gray-900">
                  📸 AI Street Photo
                </h1>
              </div>
              
              <nav className="flex items-center space-x-6">
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition">
                  功能
                </a>
                <a href="#gallery" className="text-gray-600 hover:text-gray-900 transition">
                  作品展示
                </a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition">
                  免费使用
                </a>
              </nav>
              
              <div className="flex items-center space-x-4">
                <button className="text-gray-600 hover:text-gray-900 transition">
                  登录
                </button>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
                  免费生成
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* 主要内容 */}
        <main className="pt-16">
          {children}
        </main>
        
        {/* 页脚 */}
        <footer className="bg-gray-900 text-white py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">AI Street Photo</h3>
                <p className="text-gray-400">
                  用AI技术，让你与明星合影，展现最自然的街拍风格。
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">产品</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition">功能介绍</a></li>
                  <li><a href="#" className="hover:text-white transition">明星模板</a></li>
                  <li><a href="#" className="hover:text-white transition">价格方案</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">公司</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition">关于我们</a></li>
                  <li><a href="#" className="hover:text-white transition">联系我们</a></li>
                  <li><a href="#" className="hover:text-white transition">隐私政策</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">联系我们</h4>
                <p className="text-gray-400">
                  商务合作: contact@aistreetphoto.com
                </p>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              © 2024 AI Street Photo. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
