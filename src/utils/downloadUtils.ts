import JSZip from 'jszip';
import { ResizedImage } from './imageUtils';

/**
 * 단일 Blob을 파일로 다운로드합니다.
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * 여러 이미지를 ZIP 파일로 압축하여 다운로드합니다.
 * ZIP 내부에는 원본 파일명으로 저장됩니다.
 */
export const downloadAsZip = async (
    images: ResizedImage[],
    zipFilename: string = 'resized-images.zip',
): Promise<void> => {
    const zip = new JSZip();

    // 파일명 중복 처리를 위한 카운터
    const nameCount: Record<string, number> = {};

    for (const image of images) {
        let filename = image.originalName; // 원본 파일명 사용

        // 중복 파일명 처리
        if (nameCount[filename]) {
            const ext = filename.substring(filename.lastIndexOf('.'));
            const baseName = filename.substring(0, filename.lastIndexOf('.'));
            filename = `${baseName}_${nameCount[filename]}${ext}`;
            nameCount[image.originalName]++;
        } else {
            nameCount[filename] = 1;
        }

        zip.file(filename, image.blob);
    }

    // ZIP 생성 및 다운로드
    const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 },
    });

    downloadBlob(zipBlob, zipFilename);
};

/**
 * 여러 이미지를 개별 파일로 다운로드합니다.
 */
export const downloadMultipleFiles = (images: ResizedImage[], delayMs: number = 500): void => {
    images.forEach((image, index) => {
        setTimeout(() => {
            downloadBlob(image.blob, image.resizedName);
        }, index * delayMs);
    });
};
