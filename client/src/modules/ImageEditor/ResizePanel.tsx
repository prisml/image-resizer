import React from 'react';
import { useDimension } from '@/hooks/useDimension';
import { Input, InfoBox } from '@/components';

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

            <InfoBox type="warning" title="📋 일괄 모드" className="mb-4">
                선택된 {checkedCount}개 파일에 동일한 설정이 적용됩니다
            </InfoBox>

            {originalDimensions && (
                <InfoBox type="info" className="mb-4">
                    원본 크기: {originalDimensions.width} × {originalDimensions.height} px
                </InfoBox>
            )}

            <div className="space-y-4">
                <Input
                    type="number"
                    label="너비 (px)"
                    value={width}
                    onChange={(e) => onWidthChange(e, originalDimensions)}
                    placeholder="입력하세요"
                />
                <Input
                    type="number"
                    label="높이 (px)"
                    value={height}
                    onChange={(e) => onHeightChange(e, originalDimensions)}
                    placeholder="입력하세요"
                />
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
