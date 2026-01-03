import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';
import { resizeImage, downloadImage, resizeMultipleImages } from '../api/imageApi';

export default function EditPage() {
    const navigate = useNavigate();
    const { files, checked, setChecked, toggleChecked } = useImageStore();
    const [width, setWidth] = useState<number | ''>('');
    const [height, setHeight] = useState<number | ''>('');
    const [maintainRatio, setMaintainRatio] = useState(true);
    const [selectedForPreview, setSelectedForPreview] = useState<any>(null);
    const [originalDimensions, setOriginalDimensions] = useState<{
        width: number;
        height: number;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    useEffect(() => {
        if (files.length === 0) {
            navigate('/');
        }
        // 모든 파일을 자동으로 선택 (체크)
        if (files.length > 0 && checked.length === 0) {
            setChecked(files.map((f) => f.id));
        }
    }, [files, navigate]);

    useEffect(() => {
        // 프리뷰용 파일 선택 (첫 번째 checked 파일)
        if (files.length > 0 && checked.length > 0) {
            const firstCheckedFile = files.find((f) => checked.includes(f.id));
            if (firstCheckedFile) {
                setSelectedForPreview(firstCheckedFile);

                // 이미지의 실제 크기 가져오기
                const img = new Image();
                img.onload = () => {
                    setOriginalDimensions({
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                    });
                };
                img.src = firstCheckedFile.preview;
            }
        }
    }, [files, checked]);

    const getAspectRatio = (): number | null => {
        if (!originalDimensions) return null;
        return originalDimensions.width / originalDimensions.height;
    };

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWidth = e.target.value === '' ? '' : Number(e.target.value);
        setWidth(newWidth);

        if (maintainRatio && newWidth !== '' && originalDimensions) {
            const aspectRatio = getAspectRatio();
            if (aspectRatio) {
                const newHeight = Math.round(newWidth / aspectRatio);
                setHeight(newHeight);
            }
        }
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHeight = e.target.value === '' ? '' : Number(e.target.value);
        setHeight(newHeight);

        if (maintainRatio && newHeight !== '' && originalDimensions) {
            const aspectRatio = getAspectRatio();
            if (aspectRatio) {
                const newWidth = Math.round(newHeight * aspectRatio);
                setWidth(newWidth);
            }
        }
    };

    const handleMaintainRatioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMaintainRatio(e.target.checked);
    };

    const handleConvertAndDownload = async () => {
        if (checked.length === 0) {
            alert('파일을 선택해주세요.');
            return;
        }

        if (width === '' && height === '') {
            alert('너비 또는 높이를 입력해주세요.');
            return;
        }

        try {
            setIsLoading(true);
            setLoadingMessage(`${checked.length}개 파일 리사이징 중...`);

            // 선택된 모든 파일에 대해 리사이징 수행
            const checkedFiles = files.filter((f) => checked.includes(f.id));

            for (let i = 0; i < checkedFiles.length; i++) {
                const file = checkedFiles[i];
                setLoadingMessage(`[${i + 1}/${checkedFiles.length}] ${file.name} 처리 중...`);

                const response = await resizeImage({
                    filename: file.filename || file.name,
                    width: width === '' ? undefined : Number(width),
                    height: height === '' ? undefined : Number(height),
                    maintainAspectRatio: maintainRatio,
                });

                if (response.success) {
                    setLoadingMessage(
                        `[${i + 1}/${checkedFiles.length}] ${file.name} 다운로드 중...`
                    );
                    // 파일명에 'resized_' prefix 추가
                    const downloadFilename = `resized_${response.file.resizedFilename}`;
                    downloadImage(response.file.resizedFilename, downloadFilename);
                }
            }

            setTimeout(() => {
                alert(`${checked.length}개 파일 리사이징이 완료되었습니다!`);
                setIsLoading(false);
                setLoadingMessage('');
            }, 1000);
        } catch (error: any) {
            console.error('리사이징 에러:', error);
            alert(`에러 발생: ${error.response?.data?.error || error.message}`);
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

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
                        <div className="mb-4 p-2 bg-amber-50 rounded border border-amber-200">
                            <p className="text-xs font-medium text-amber-900">📋 일괄 모드</p>
                            <p className="text-xs text-amber-700 mt-1">
                                선택된 {checked.length}개 파일에 동일한 설정이 적용됩니다
                            </p>
                        </div>

                        {selectedForPreview && originalDimensions && (
                            <div className="mb-4 p-2 bg-blue-50 rounded border border-blue-200">
                                <p className="text-xs text-blue-800">
                                    원본 크기: {originalDimensions.width} ×{' '}
                                    {originalDimensions.height} px
                                </p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    너비 (px)
                                </label>
                                <input
                                    type="number"
                                    value={width}
                                    onChange={handleWidthChange}
                                    placeholder="입력하세요"
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    높이 (px)
                                </label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={handleHeightChange}
                                    placeholder="입력하세요"
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={maintainRatio}
                                    onChange={handleMaintainRatioChange}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">원본 비율 유지</span>
                            </label>
                        </div>
                    </div>

                    {/* 중앙: 파일 그리드 */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            파일 목록 ({checked.length}/{files.length})
                        </h2>
                        <div className="grid grid-cols-3 gap-4">
                            {files.map((fileObj) => (
                                <div
                                    key={fileObj.id}
                                    onClick={() => toggleChecked(fileObj.id)}
                                    className={`relative group cursor-pointer rounded-lg overflow-hidden transition transform hover:scale-105 ${
                                        checked.includes(fileObj.id)
                                            ? 'ring-2 ring-indigo-600 shadow-lg'
                                            : 'hover:shadow-md'
                                    }`}
                                >
                                    <div className="bg-gray-200 aspect-square flex items-center justify-center overflow-hidden">
                                        <img
                                            src={fileObj.preview}
                                            alt={fileObj.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="bg-white p-3">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {fileObj.name}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {(fileObj.size / 1024).toFixed(2)} KB
                                        </p>
                                    </div>
                                    {checked.includes(fileObj.id) && (
                                        <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                                            ✓
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 우측: 미리보기 및 정보 */}
                    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto flex flex-col">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">미리보기</h2>
                        {selectedForPreview ? (
                            <>
                                <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                                    <img
                                        src={selectedForPreview.preview}
                                        alt={selectedForPreview.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="space-y-2 text-sm mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">파일명</span>
                                        <span className="font-medium text-gray-900">
                                            {selectedForPreview.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">크기</span>
                                        <span className="font-medium text-gray-900">
                                            {(selectedForPreview.size / 1024).toFixed(2)} KB
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">형식</span>
                                        <span className="font-medium text-gray-900">
                                            {selectedForPreview.type}
                                        </span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                파일을 선택하면 미리보기가 표시됩니다.
                            </p>
                        )}
                        <div className="flex-1" />

                        {/* 로딩 상태 표시 */}
                        {isLoading && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-blue-700 text-sm font-medium">
                                    {loadingMessage}
                                </p>
                                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-indigo-600 h-2 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleConvertAndDownload}
                            disabled={
                                isLoading || checked.length === 0 || (width === '' && height === '')
                            }
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? '변환 중...' : `✨ ${checked.length}개 파일 저장`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
