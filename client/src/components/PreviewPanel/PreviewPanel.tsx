import React from 'react';
import { ImageFile } from '../../store/imageStore';

interface PreviewPanelProps {
    selectedForPreview: ImageFile | null;
    isLoading: boolean;
    loadingMessage: string;
    onConvertAndDownload: () => void;
    checkedCount: number;
    isDisabled: boolean;
}

export default function PreviewPanel({
    selectedForPreview,
    isLoading,
    loadingMessage,
    onConvertAndDownload,
    checkedCount,
    isDisabled,
}: PreviewPanelProps) {
    return (
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
                <p className="text-gray-500 text-sm">파일을 선택하면 미리보기가 표시됩니다.</p>
            )}

            <div className="flex-1" />

            {isLoading && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-700 text-sm font-medium">{loadingMessage}</p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-indigo-600 h-2 rounded-full animate-pulse"></div>
                    </div>
                </div>
            )}

            <button
                onClick={onConvertAndDownload}
                disabled={isLoading || isDisabled}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? '변환 중...' : `✨ ${checkedCount}개 파일 저장`}
            </button>
        </div>
    );
}
