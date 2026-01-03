import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';

export default function EditPage() {
  const navigate = useNavigate();
  const { files } = useImageStore();

  useEffect(() => {
    if (files.length === 0) {
      navigate('/');
    }
  }, [files, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col h-screen">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">이미지 편집</h1>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              ← 돌아가기
            </button>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 좌측: 조절 패널 */}
          <div className="w-64 bg-white border-r border-gray-200 p-6 overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">크기 조절</h2>
            <p className="text-gray-500 text-sm">파일을 선택하면 여기에 옵션이 표시됩니다.</p>
          </div>

          {/* 중앙: 파일 탐색기 */}
          <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">파일 목록</h2>
            <div className="grid grid-cols-3 gap-4">
              {files.map((fileObj) => (
                <div
                  key={fileObj.id}
                  className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition cursor-pointer"
                >
                  <img
                    src={fileObj.preview}
                    alt={fileObj.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileObj.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(fileObj.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 우측: 미리보기 및 정보 */}
          <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">미리보기</h2>
            <p className="text-gray-500 text-sm">파일을 선택하면 미리보기가 표시됩니다.</p>
            <div className="flex-1" />
            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
              변환하여 저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
