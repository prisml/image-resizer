import Pica from 'pica';

const pica = new Pica();

export interface ResizeOptions {
    width?: number;
    height?: number;
    maintainAspectRatio: boolean;
}

export interface ResizedImage {
    blob: Blob;
    width: number;
    height: number;
    originalName: string;
    resizedName: string;
}

/**
 * 이미지 파일의 원본 크기를 가져옵니다.
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
            URL.revokeObjectURL(img.src);
        };
        img.onerror = () => {
            reject(new Error('이미지를 로드할 수 없습니다.'));
            URL.revokeObjectURL(img.src);
        };
        img.src = URL.createObjectURL(file);
    });
};

/**
 * 새로운 크기를 계산합니다.
 */
export const calculateNewDimensions = (
    originalWidth: number,
    originalHeight: number,
    targetWidth?: number,
    targetHeight?: number,
    maintainAspectRatio: boolean = true
): { width: number; height: number } => {
    // 둘 다 없으면 원본 크기
    if (!targetWidth && !targetHeight) {
        return { width: originalWidth, height: originalHeight };
    }

    if (maintainAspectRatio) {
        const aspectRatio = originalWidth / originalHeight;

        if (targetWidth && targetHeight) {
            // 둘 다 지정된 경우, 더 작은 비율로 맞춤
            const widthRatio = targetWidth / originalWidth;
            const heightRatio = targetHeight / originalHeight;
            const ratio = Math.min(widthRatio, heightRatio);
            return {
                width: Math.round(originalWidth * ratio),
                height: Math.round(originalHeight * ratio),
            };
        } else if (targetWidth) {
            return {
                width: targetWidth,
                height: Math.round(targetWidth / aspectRatio),
            };
        } else if (targetHeight) {
            return {
                width: Math.round(targetHeight * aspectRatio),
                height: targetHeight,
            };
        }
    }

    // 비율 유지 안 함
    return {
        width: targetWidth || originalWidth,
        height: targetHeight || originalHeight,
    };
};

/**
 * Pica를 사용하여 이미지를 리사이즈합니다.
 */
export const resizeImage = async (
    file: File,
    options: ResizeOptions
): Promise<ResizedImage> => {
    const { width: targetWidth, height: targetHeight, maintainAspectRatio } = options;

    // 원본 이미지 로드
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('이미지를 로드할 수 없습니다.'));
        img.src = URL.createObjectURL(file);
    });

    // 새 크기 계산
    const newDimensions = calculateNewDimensions(
        img.width,
        img.height,
        targetWidth,
        targetHeight,
        maintainAspectRatio
    );

    // 원본보다 크게 확대하지 않음
    const finalWidth = Math.min(newDimensions.width, img.width);
    const finalHeight = Math.min(newDimensions.height, img.height);

    // 원본 캔버스
    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = img.width;
    srcCanvas.height = img.height;
    const srcCtx = srcCanvas.getContext('2d');
    if (!srcCtx) throw new Error('Canvas context를 생성할 수 없습니다.');
    srcCtx.drawImage(img, 0, 0);

    // 대상 캔버스
    const destCanvas = document.createElement('canvas');
    destCanvas.width = finalWidth;
    destCanvas.height = finalHeight;

    // Pica로 고품질 리사이즈
    await pica.resize(srcCanvas, destCanvas, {
        quality: 3, // 최고 품질
    });

    // Blob으로 변환
    const blob = await pica.toBlob(destCanvas, file.type || 'image/jpeg', 0.9);

    // URL 정리
    URL.revokeObjectURL(img.src);

    // 파일명 생성
    const ext = file.name.substring(file.name.lastIndexOf('.'));
    const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
    const resizedName = `resized_${baseName}${ext}`;

    return {
        blob,
        width: finalWidth,
        height: finalHeight,
        originalName: file.name,
        resizedName,
    };
};

/**
 * 여러 이미지를 일괄 리사이즈합니다.
 */
export const resizeMultipleImages = async (
    files: File[],
    options: ResizeOptions,
    onProgress?: (current: number, total: number) => void
): Promise<ResizedImage[]> => {
    const results: ResizedImage[] = [];

    for (let i = 0; i < files.length; i++) {
        const result = await resizeImage(files[i], options);
        results.push(result);
        onProgress?.(i + 1, files.length);
    }

    return results;
};
