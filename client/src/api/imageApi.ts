import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

export interface UploadResponse {
    success: boolean;
    file: {
        originalName: string;
        filename: string;
        size: number;
        mimetype: string;
        path: string;
    };
}

export interface MultipleUploadResponse {
    success: boolean;
    files: UploadResponse['file'][];
    count: number;
}

export interface ResizePayload {
    filename: string;
    originalName: string;
    width?: number;
    height?: number;
    maintainAspectRatio: boolean;
}

export interface ResizeResponse {
    success: boolean;
    file: {
        originalFilename: string;
        originalName: string;
        originalExt: string;
        resizedFilename: string;
        path: string;
    };
}

/**
 * 단일 이미지 업로드
 */
export const uploadImage = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<UploadResponse>('/api/upload', formData);

    return response.data;
};

/**
 * 여러 이미지 업로드
 */
export const uploadMultipleImages = async (files: File[]): Promise<MultipleUploadResponse> => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('files', file);
    });

    const response = await apiClient.post<MultipleUploadResponse>('/api/upload/multiple', formData);

    return response.data;
};

/**
 * 이미지 리사이징
 */
export const resizeImage = async (payload: ResizePayload): Promise<ResizeResponse> => {
    const response = await apiClient.post<ResizeResponse>('/api/resize', payload);
    return response.data;
};

/**
 * 여러 이미지 일괄 리사이징
 */
export const resizeMultipleImages = async (
    payloads: ResizePayload[]
): Promise<ResizeResponse[]> => {
    const responses = await Promise.all(payloads.map((payload) => resizeImage(payload)));
    return responses;
};

/**
 * 이미지 다운로드
 */
/**
 * 이미지 다운로드
 */
export const downloadImage = (filename: string, downloadName?: string) => {
    const url = downloadName
        ? `${API_BASE_URL}/api/download/${filename}?downloadName=${encodeURIComponent(
              downloadName
          )}`
        : `${API_BASE_URL}/api/download/${filename}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadName || filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * 여러 이미지 다운로드 (개별)
 */
export const downloadMultipleImages = (filenames: string[]) => {
    filenames.forEach((filename, index) => {
        // 각 다운로드 사이에 약간의 지연 추가
        setTimeout(() => {
            downloadImage(filename);
        }, index * 500);
    });
};

/**
 * 여러 이미지를 zip으로 압축해서 다운로드
 */
export const downloadMultipleImagesAsZip = async (
    files: Array<{ filename: string; downloadName: string }>
) => {
    try {
        const response = await apiClient.post(
            '/api/download-zip',
            { files },
            {
                responseType: 'blob',
            }
        );

        // blob을 다운로드
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'resized-images.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Zip 다운로드 중 오류:', error);
        throw error;
    }
};
export default apiClient;
