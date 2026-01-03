import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';

export default function EditPage() {
    const navigate = useNavigate();
    const { files, selected, setSelected, setResizeSettings, resizeSettings } = useImageStore();
    const [width, setWidth] = useState<number | ''>('');
    const [height, setHeight] = useState<number | ''>('');
    const [maintainRatio, setMaintainRatio] = useState(false);
    const [originalDimensions, setOriginalDimensions] = useState<{
        width: number;
        height: number;
    } | null>(null);

    useEffect(() => {
        if (files.length === 0) {
            navigate('/');
        }
    }, [files, navigate]);

    useEffect(() => {
        // 새로운 파일을 선택했을 때 입력값 초기화
        if (selected) {
            setWidth('');
            setHeight('');
            setMaintainRatio(false);

            // 이미지의 실제 크기를 가져오기
            const img = new Image();
            img.onload = () => {
                setOriginalDimensions({
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                });
            };
            img.src = selected.preview;
        }
    }, [selected]);

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

    const handleApplyResize = () => {
        if (selected && (width !== '' || height !== '')) {
            setResizeSettings({
                width: width === '' ? null : Number(width),
                height: height === '' ? null : Number(height),
                maintainAspectRatio: maintainRatio,
            });
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
                        {selected ? (
                            <div>
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-1">선택된 파일</p>
                                    <p className="text-sm text-gray-600 truncate">{selected.name}</p>
                                </div>

                                {originalDimensions && (
                                    <div className="mb-4 p-2 bg-blue-50 rounded border border-blue-200">
                                        <p className="text-xs text-blue-800">
                                            원본 크기: {originalDimensions.width} × {originalDimensions.height} px
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">너비 (px)</label>
                                        <input
                                            type="number"
                                            value={width}
                                            onChange={handleWidthChange}
                                            placeholder="입력하세요"
                                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">높이 (px)</label>
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
                                            className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <span className="ml-2 text-sm font-medium text-gray-700">원본 비율 유지</span>
                                    </label>
                                    <button
                                        onClick={handleApplyResize}
                                        disabled={width === '' && height === ''}
                                        className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        설정 적용
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">파일을 선택하면 여기에 옵션이 표시됩니다.</p>
                        )}
                    </div>

                    {/* 중앙: 파일 탐색기 */}
                    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">파일 목록 ({files.length})</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {files.map((fileObj) => (
                                <div
                                    key={fileObj.id}
                                    onClick={() => setSelected(fileObj)}
                                    className={`rounded-lg overflow-hidden shadow transition cursor-pointer ${
                                        selected?.id === fileObj.id
                                            ? 'ring-2 ring-indigo-600 shadow-lg'
                                            : 'hover:shadow-md'
                                    }`}
                                >
                                    <div className="bg-gray-200 h-32 overflow-hidden">
                                        <img
                                            src={fileObj.preview}
                                            alt={fileObj.name}
                                            className="w-full h-full object-cover"
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
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 우측: 미리보기 및 정보 */}
                    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto flex flex-col">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">미리보기</h2>
                        {selected ? (
                            <>
                                <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden h-48">
                                    <img
                                        src={selected.preview}
                                        alt={selected.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="space-y-2 text-sm mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">파일명</span>
                                        <span className="font-medium text-gray-900">{selected.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">크기</span>
                                        <span className="font-medium text-gray-900">
                                            {(selected.size / 1024).toFixed(2)} KB
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">형식</span>
                                        <span className="font-medium text-gray-900">{selected.type}</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500 text-sm">파일을 선택하면 미리보기가 표시됩니다.</p>
                        )}
                        <div className="flex-1" />
                        <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                            ✨ 변환하여 저장하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
