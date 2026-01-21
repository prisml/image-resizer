import { useEffect, useState } from 'react';
import { ImageFile } from '@/store/imageStore';

export const usePreview = (files: ImageFile[], checked: number[]) => {
    const [selectedForPreview, setSelectedForPreview] = useState<ImageFile | null>(null);
    const [originalDimensions, setOriginalDimensions] = useState<{
        width: number;
        height: number;
    } | null>(null);

    useEffect(() => {
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

    return { selectedForPreview, originalDimensions };
};
