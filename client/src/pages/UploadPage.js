import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';

export default function UploadPage() {
    const navigate = useNavigate();
    const { addFiles } = useImageStore();
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleChange = (e) => {
        handleFiles(e.target.files);
    };

    const handleFiles = (files) => {
        const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));

        if (imageFiles.length > 0) {
            const filesWithPreview = imageFiles.map((file) => ({
                id: Math.random(),
                file,
                name: file.name,
                size: file.size,
                type: file.type,
                preview: URL.createObjectURL(file),
                width: null,
                height: null,
            }));

            addFiles(filesWithPreview);
            navigate('/edit');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">이미지 리사이저</h1>
                    <p className="text-gray-600">이미지를 드래그해서 업로드하세요</p>
                </div>

                <div
                    className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition ${
                        dragActive
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-300 bg-white hover:border-indigo-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        id="file-input"
                        multiple
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                    />
                    <label htmlFor="file-input" className="cursor-pointer">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400 mb-4"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-4-12l-8-8m0 0L20 4m4 4v16m-8-8l-4 4m0 0l4 4m-4-4h20"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <p className="text-gray-600 font-medium">이미지를 여기에 드래그하거나</p>
                        <p className="text-indigo-600 font-medium mt-1">클릭하여 선택하세요</p>
                    </label>
                </div>

                <p className="text-center text-gray-500 text-sm mt-6">
                    JPG, PNG 등 모든 이미지 형식 지원
                </p>
            </div>
        </div>
    );
}
