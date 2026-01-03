import { useState, useCallback } from 'react';

interface Dimensions {
    width: number | '';
    height: number | '';
    maintainRatio: boolean;
}

export const useDimension = (initialMaintainRatio: boolean = true) => {
    const [width, setWidth] = useState<number | ''>('');
    const [height, setHeight] = useState<number | ''>('');
    const [maintainRatio, setMaintainRatio] = useState(initialMaintainRatio);

    const getAspectRatio = useCallback(
        (originalDimensions: { width: number; height: number } | null): number | null => {
            if (!originalDimensions) return null;
            return originalDimensions.width / originalDimensions.height;
        },
        []
    );

    const handleWidthChange = useCallback(
        (
            e: React.ChangeEvent<HTMLInputElement>,
            originalDimensions: { width: number; height: number } | null
        ) => {
            const newWidth = e.target.value === '' ? '' : Number(e.target.value);
            setWidth(newWidth);

            if (maintainRatio && newWidth !== '' && originalDimensions) {
                const aspectRatio = getAspectRatio(originalDimensions);
                if (aspectRatio) {
                    const newHeight = Math.round(newWidth / aspectRatio);
                    setHeight(newHeight);
                }
            }
        },
        [maintainRatio, getAspectRatio]
    );

    const handleHeightChange = useCallback(
        (
            e: React.ChangeEvent<HTMLInputElement>,
            originalDimensions: { width: number; height: number } | null
        ) => {
            const newHeight = e.target.value === '' ? '' : Number(e.target.value);
            setHeight(newHeight);

            if (maintainRatio && newHeight !== '' && originalDimensions) {
                const aspectRatio = getAspectRatio(originalDimensions);
                if (aspectRatio) {
                    const newWidth = Math.round(newHeight * aspectRatio);
                    setWidth(newWidth);
                }
            }
        },
        [maintainRatio, getAspectRatio]
    );

    const handleMaintainRatioChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setMaintainRatio(e.target.checked);
    }, []);

    return {
        width,
        height,
        maintainRatio,
        handleWidthChange,
        handleHeightChange,
        handleMaintainRatioChange,
    };
};
