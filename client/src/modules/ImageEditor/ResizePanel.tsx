import React from 'react';
import { useDimension } from '../../hooks/useDimension';

interface ResizePanelProps {
    checkedCount: number;
    onWidthChange: (e: React.ChangeEvent<HTMLInputElement>, originalDimensions: any) => void;
    onHeightChange: (e: React.ChangeEvent<HTMLInputElement>, originalDimensions: any) => void;
    onMaintainRatioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    width: number | '';
    height: number | '';
    maintainRatio: boolean;
    originalDimensions: { width: number; height: number } | null;
}

export default function ResizePanel({
    checkedCount,
    onWidthChange,
    onHeightChange,
    onMaintainRatioChange,
    width,
    height,
    maintainRatio,
    originalDimensions,
}: ResizePanelProps) {
    return (
        <div className="w-64 bg-white border-r border-gray-200 p-6 overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">크기 조절</h2>

            <div className="mb-4 p-2 bg-amber-50 rounded border border-amber-200">
                <p className="text-xs font-medium text-amber-900">📋 일괄 모드</p>
                <p className="text-xs text-amber-700 mt-1">
                    선택된 {checkedCount}개 파일에 동일한 설정이 적용됩니다
                </p>
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
                        onChange={(e) => onWidthChange(e, originalDimensions)}
                        placeholder="입력하세요"
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700">높이 (px)</label>
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => onHeightChange(e, originalDimensions)}
                        placeholder="입력하세요"
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={maintainRatio}
                        onChange={onMaintainRatioChange}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">원본 비율 유지</span>
                </label>
            </div>
        </div>
    );
}
