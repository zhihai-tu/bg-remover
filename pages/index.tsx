'use client';

import { useState, useCallback } from 'react';

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('请上传图片文件');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('图片大小不能超过 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setResultImage(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleRemoveBg = useCallback(async () => {
    if (!originalImage) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: originalImage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '处理失败');
      }

      setResultImage(data.image);
    } catch (err: any) {
      setError(err.message || '处理失败，请重试');
    } finally {
      setLoading(false);
    }
  }, [originalImage]);

  const handleDownload = useCallback(() => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = 'removed-bg.png';
    link.click();
  }, [resultImage]);

  const handleClear = useCallback(() => {
    setOriginalImage(null);
    setResultImage(null);
    setError(null);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI 背景移除
          </h1>
          <p className="text-gray-300 text-lg">
            上传图片，一键去除背景
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8">
          {/* Upload Area */}
          {!originalImage && (
            <label className="block">
              <div className="border-2 border-dashed border-white/30 rounded-xl p-12 text-center cursor-pointer hover:border-white/50 hover:bg-white/5 transition-all">
                <svg className="w-16 h-16 mx-auto text-white/60 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-white text-lg mb-2">点击或拖拽上传图片</p>
                <p className="text-white/50 text-sm">支持 JPG、PNG，最大 10MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          )}

          {/* Preview Area */}
          {originalImage && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Original */}
                <div className="space-y-2">
                  <p className="text-white/80 text-sm font-medium">原图</p>
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={originalImage}
                      alt="Original"
                      className="w-full h-64 object-contain"
                    />
                  </div>
                </div>

                {/* Result */}
                <div className="space-y-2">
                  <p className="text-white/80 text-sm font-medium">结果</p>
                  <div className="bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjBmMGYwIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmMGYwZjAiLz48cmVjdCB4PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZTBlMGUwIi8+PHJlY3QgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2UwZTBlMCIvPjwvc3ZnPg==')] rounded-lg overflow-hidden">
                    {resultImage ? (
                      <img
                        src={resultImage}
                        alt="Result"
                        className="w-full h-64 object-contain"
                      />
                    ) : (
                      <div className="w-full h-64 flex items-center justify-center bg-gray-800/50">
                        {loading ? (
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin mb-3"></div>
                            <p className="text-white/60">处理中...</p>
                          </div>
                        ) : (
                          <p className="text-white/40">等待处理</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 justify-center">
                {!resultImage && !loading && (
                  <button
                    onClick={handleRemoveBg}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    去除背景
                  </button>
                )}

                {resultImage && (
                  <button
                    onClick={handleDownload}
                    className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    下载结果
                  </button>
                )}

                <button
                  onClick={handleClear}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
                >
                  重新上传
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-white/40 text-sm mt-8">
          Powered by Remove.bg API
        </p>
      </div>
    </main>
  );
}
