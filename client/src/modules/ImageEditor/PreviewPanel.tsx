import React from 'react';
import { ImageFile } from '@/store/imageStore';
import { Button, InfoBox, InfoItem } from '@/components';

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
                        <InfoItem label="파일명" value={selectedForPreview.name} />
                        <InfoItem
                            label="크기"
                            value={`${(selectedForPreview.size / 1024).toFixed(2)} KB`}
                        />
                        <InfoItem label="형식" value={selectedForPreview.type} />
                    </div>
                </>
            ) : (
                <p className="text-gray-500 text-sm">파일을 선택하면 미리보기가 표시됩니다.</p>
            )}

            <div className="flex-1" />

            {isLoading && (
                <InfoBox type="info" className="mb-4">
                    <div>
                        <p className="font-medium mb-2">{loadingMessage}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-indigo-600 h-2 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </InfoBox>
            )}

            <Button
                variant="primary"
                size="lg"
                onClick={onConvertAndDownload}
                disabled={isLoading || isDisabled}
                className="w-full"
            >
                {isLoading ? '변환 중...' : `✨ ${checkedCount}개 파일 저장`}
            </Button>
        </div>
    );
}
