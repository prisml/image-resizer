import { create } from 'zustand';

export const useImageStore = create((set) => ({
  files: [],
  checked: [],
  selected: null,
  resizeSettings: {
    width: null,
    height: null,
    maintainAspectRatio: false,
  },

  // 파일 추가
  addFiles: (newFiles) =>
    set((state) => ({
      files: [...state.files, ...newFiles],
    })),

  // 선택된 파일 설정
  setSelected: (file) =>
    set(() => ({
      selected: file,
    })),

  // 리사이즈 설정 업데이트
  setResizeSettings: (settings) =>
    set((state) => ({
      resizeSettings: {
        ...state.resizeSettings,
        ...settings,
      },
    })),

  // 상태 초기화
  reset: () =>
    set(() => ({
      files: [],
      checked: [],
      selected: null,
      resizeSettings: {
        width: null,
        height: null,
        maintainAspectRatio: false,
      },
    })),
}));
