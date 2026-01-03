import { useState } from 'react';
import { resizeImage, downloadImage } from '../api/imageApi';
import { ImageFile } from '../store/imageStore';

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

            for (let i = 0; i < checkedFiles.length; i++) {
                const file = checkedFiles[i];
                setLoadingMessage(
                    `[${i + 1}/${checkedFiles.length}] ${file.name} 처리 중...`
                );

                const response = await resizeImage({
                    filename: file.filename || file.name,
                    width: width === '' ? undefined : Number(width),
                    height: height === '' ? undefined : Number(height),
                    maintainAspectRatio: maintainRatio,
                });

                if (response.success) {
                    setLoadingMessage(
                        `[${i + 1}/${checkedFiles.length}] ${file.name} 다운로드 중...`
                    );
                    // 원본 파일명에 'resized_' prefix 추가
                    const downloadFilename = `resized_${response.file.originalName}${response.file.originalExt}`;
                    downloadImage(response.file.resizedFilename, downloadFilename);
                }
            }

            setTimeout(() => {
                alert(`${checkedFiles.length}개 파일 리사이징이 완료되었습니다!`);
                setIsLoading(false);
                setLoadingMessage('');
            }, 1000);
        } catch (error: any) {
            console.error('리사이징 에러:', error);
            alert(`에러 발생: ${error.response?.data?.error || error.message}`);
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    return { isLoading, loadingMessage, handleConvertAndDownload };
};
