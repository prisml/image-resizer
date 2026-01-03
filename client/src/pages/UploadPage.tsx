import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageStore, ImageFile } from '../store/imageStore';
import { uploadMultipleImages } from '../api/imageApi';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export default function UploadPage() {
    const navigate = useNavigate();
    const { addFiles, files } = useImageStore();
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const validateFile = (file: File): { valid: boolean; error?: string } => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return {
                valid: false,
                error: `지원하지 않는 형식입니다: ${file.type}. JPG, PNG, WebP, GIF만 지원합니다.`,
            };
        }

        if (file.size > MAX_FILE_SIZE) {
            return {
                valid: false,
                error: `파일 크기가 너무 큽니다: ${(file.size / 1024 / 1024).toFixed(
                    2
                )}MB. 50MB 이하의 파일만 업로드할 수 있습니다.`,
            };
        }

        return { valid: true };
    };

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(!isUploading);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = async (fileList: FileList) => {
        setError(null);
        const filesToUpload: File[] = [];
        let hasError = false;

        // 클라이언트 검증
        Array.from(fileList).forEach((file) => {
            const validation = validateFile(file);

            if (!validation.valid) {
                setError(validation.error || '파일 검증에 실패했습니다.');
                hasError = true;
                return;
            }

            filesToUpload.push(file);
        });

        if (filesToUpload.length === 0) {
            return;
        }

        // 서버로 파일 업로드
        setIsUploading(true);
        try {
            const response = await uploadMultipleImages(filesToUpload);

            const newFiles: ImageFile[] = response.files.map((uploadedFile) => ({
                id: Math.random(),
                file: filesToUpload[response.files.indexOf(uploadedFile)],
                name: uploadedFile.originalName,
                size: uploadedFile.size,
                type: uploadedFile.mimetype,
                preview: URL.createObjectURL(filesToUpload[response.files.indexOf(uploadedFile)]),
                width: null,
                height: null,
                filename: uploadedFile.filename,
            }));

            addFiles(newFiles);

            if (!hasError && files.length === 0) {
                navigate('/edit');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || '파일 업로드에 실패했습니다.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleStartEdit = () => {
        if (files.length > 0 && !isUploading) {
            navigate('/edit');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">이미지 리사이저</h1>
                    <p className="text-gray-600">
                        이미지를 드래그해서 업로드하거나 클릭해서 선택하세요
                    </p>
                </div>

                {/* 드래그 앤 드롭 영역 */}
                <div
                    className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition mb-6 ${
                        isUploading
                            ? 'border-gray-300 bg-gray-50 opacity-50 cursor-not-allowed'
                            : dragActive
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
                        accept={ALLOWED_TYPES.join(',')}
                        onChange={handleChange}
                        disabled={isUploading}
                        className="hidden"
                    />
                    <label
                        htmlFor="file-input"
                        className={`cursor-pointer ${isUploading ? 'pointer-events-none' : ''}`}
                    >
                        {isUploading ? (
                            <div className="flex flex-col items-center">
                                <div className="animate-spin mb-4">
                                    <svg
                                        className="h-16 w-16 text-indigo-600"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                </div>
                                <p className="text-indigo-600 font-semibold text-lg">
                                    파일 업로드 중...
                                </p>
                            </div>
                        ) : (
                            <>
                                <svg
                                    className="mx-auto h-16 w-16 text-gray-400 mb-4"
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
                                <p className="text-gray-600 font-semibold text-lg">
                                    이미지를 여기에 드래그하거나
                                </p>
                                <p className="text-indigo-600 font-semibold text-lg mt-1">
                                    클릭하여 선택하세요
                                </p>
                            </>
                        )}
                    </label>
                </div>

                {/* 에러 메시지 */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">⚠️ {error}</p>
                    </div>
                )}

                {/* 지원 형식 안내 */}
                <div className="mb-6 text-center text-sm text-gray-500">
                    <p>지원 형식: JPG, PNG, WebP, GIF</p>
                    <p>최대 파일 크기: 50MB</p>
                </div>

                {/* 업로드된 파일 목록 */}
                {files.length > 0 && (
                    <div className="bg-white rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            업로드된 파일 ({files.length})
                        </h2>
                        <div className="grid grid-cols-4 gap-4 mb-4">
                            {files.map((fileObj) => (
                                <div
                                    key={fileObj.id}
                                    className="relative group rounded-lg overflow-hidden bg-gray-100 aspect-square"
                                >
                                    <img
                                        src={fileObj.preview}
                                        alt={fileObj.name}
                                        className="w-full h-full object-contain"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition text-white text-center">
                                            <p className="text-xs font-semibold">{fileObj.name}</p>
                                            <p className="text-xs">
                                                {(fileObj.size / 1024).toFixed(2)} KB
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleStartEdit}
                            disabled={isUploading}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            📝 편집 시작하기
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
