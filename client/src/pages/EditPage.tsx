import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '@/store/imageStore';
import { ImageEditor } from '@/modules';

export default function EditPage() {
    const navigate = useNavigate();
    const { files, checked, setChecked } = useImageStore();

    useEffect(() => {
        if (files.length === 0) {
            navigate('/');
        }
        if (files.length > 0 && checked.length === 0) {
            setChecked(files.map((f) => f.id));
        }
    }, [files, navigate, checked.length, setChecked]);

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
                <ImageEditor />
            </div>
        </div>
    );
}
