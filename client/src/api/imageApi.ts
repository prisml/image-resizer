import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
    width?: number;
    height?: number;
    maintainAspectRatio: boolean;
}

export interface ResizeResponse {
    success: boolean;
    file: {
        originalFilename: string;
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

    const response = await apiClient.post<UploadResponse>('/api/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

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

    const response = await apiClient.post<MultipleUploadResponse>('/api/upload/multiple', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

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
export const resizeMultipleImages = async (payloads: ResizePayload[]): Promise<ResizeResponse[]> => {
    const responses = await Promise.all(payloads.map((payload) => resizeImage(payload)));
    return responses;
};

/**
 * 이미지 다운로드
 */
export const downloadImage = (filename: string) => {
    const url = `${API_BASE_URL}/uploads/${filename}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
};

/**
 * 여러 이미지 다운로드 (개별)
 */
export const downloadMultipleImages = (filenames: string[]) => {
    filenames.forEach((filename) => {
        downloadImage(filename);
    });
};

export default apiClient;
