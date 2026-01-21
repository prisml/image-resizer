import { useState } from 'react';
import { ImageFile } from '@/store/imageStore';
import { resizeImage, ResizedImage } from '@/utils/imageUtils';
import { downloadAsZip, downloadBlob } from '@/utils/downloadUtils';

export const useImageResize = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    const handleConvertAndDownload = async (
        checkedFiles: ImageFile[],
        width: number | '',
        height: number | '',
        maintainRatio: boolean
    ) => {
        if (checkedFiles.length === 0) {
            alert('파일을 선택해주세요.');
            return;
        }

        if (width === '' && height === '') {
            alert('너비 또는 높이를 입력해주세요.');
            return;
        }

        try {
            setIsLoading(true);
            setLoadingMessage(`${checkedFiles.length}개 파일 리사이징 중...`);

            const resizedImages: ResizedImage[] = [];

            for (let i = 0; i < checkedFiles.length; i++) {
                const file = checkedFiles[i];
                setLoadingMessage(`[${i + 1}/${checkedFiles.length}] ${file.name} 처리 중...`);

                const resized = await resizeImage(file.file, {
                    width: width === '' ? undefined : Number(width),
                    height: height === '' ? undefined : Number(height),
                    maintainAspectRatio: maintainRatio,
                });

                resizedImages.push(resized);
            }

            // 다운로드
            if (resizedImages.length === 1) {
                // 단일 파일은 바로 다운로드
                setLoadingMessage('다운로드 중...');
                downloadBlob(resizedImages[0].blob, resizedImages[0].resizedName);
            } else if (resizedImages.length > 1) {
                // 여러 파일은 ZIP으로 압축해서 다운로드
                setLoadingMessage(`${resizedImages.length}개 파일을 ZIP으로 압축해 다운로드 중...`);
                await downloadAsZip(resizedImages);
            }

            setTimeout(() => {
                alert(`${checkedFiles.length}개 파일 리사이징이 완료되었습니다!`);
                setIsLoading(false);
                setLoadingMessage('');
            }, 500);
        } catch (error: any) {
            console.error('리사이징 에러:', error);
            alert(`에러 발생: ${error.message}`);
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    return { isLoading, loadingMessage, handleConvertAndDownload };
};
