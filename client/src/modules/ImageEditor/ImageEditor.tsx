import React, { useEffect } from 'react';
import { useImageStore } from '../../store/imageStore';
import { useDimension } from '../../hooks/useDimension';
import { usePreview } from '../../hooks/usePreview';
import { useImageResize } from '../../hooks/useImageResize';
import ResizePanel from './ResizePanel';
import FileGrid from './FileGrid';
import PreviewPanel from './PreviewPanel';

export default function ImageEditor() {
    const { files, checked, toggleChecked } = useImageStore();
    const { width, height, maintainRatio, handleWidthChange, handleHeightChange, handleMaintainRatioChange } =
        useDimension(true);
    const { selectedForPreview, originalDimensions } = usePreview(files, checked);
    const { isLoading, loadingMessage, handleConvertAndDownload } = useImageResize();

    const checkedFiles = files.filter((f) => checked.includes(f.id));

    const handleConvert = () => {
        handleConvertAndDownload(checkedFiles, width, height, maintainRatio);
    };

    const isButtonDisabled = checked.length === 0 || (width === '' && height === '');

    return (
        <div className="flex-1 flex overflow-hidden">
            <ResizePanel
                checkedCount={checked.length}
                onWidthChange={handleWidthChange}
                onHeightChange={handleHeightChange}
                onMaintainRatioChange={handleMaintainRatioChange}
                width={width}
                height={height}
                maintainRatio={maintainRatio}
                originalDimensions={originalDimensions}
            />

            <FileGrid files={files} checked={checked} onToggleChecked={toggleChecked} />

            <PreviewPanel
                selectedForPreview={selectedForPreview}
                isLoading={isLoading}
                loadingMessage={loadingMessage}
                onConvertAndDownload={handleConvert}
                checkedCount={checked.length}
                isDisabled={isButtonDisabled}
            />
        </div>
    );
}
