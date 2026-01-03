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
      // 첫 파일 자동 선택
      selected: newFiles[0] || state.selected,
    })),

  // 파일 제거
  removeFile: (fileId) =>
    set((state) => {
      const newFiles = state.files.filter((f) => f.id !== fileId);
      return {
        files: newFiles,
        selected: state.selected?.id === fileId ? newFiles[0] || null : state.selected,
      };
    }),

  // 선택된 파일 설정 (단일)
  setSelected: (file) =>
    set(() => ({
      selected: file,
    })),

  // 체크된 파일들 설정 (배열 - 나중에 일괄 처리 모드용)
  setChecked: (fileIds) =>
    set(() => ({
      checked: fileIds,
    })),

  // 파일 체크 토글
  toggleChecked: (fileId) =>
    set((state) => ({
      checked: state.checked.includes(fileId)
        ? state.checked.filter((id) => id !== fileId)
        : [...state.checked, fileId],
    })),

  // 리사이즈 설정 업데이트
  setResizeSettings: (settings) =>
    set((state) => ({
      resizeSettings: {
        ...state.resizeSettings,
        ...settings,
      },
    })),

  // 파일의 실제 너비/높이 설정
  setFileSize: (fileId, width, height) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === fileId ? { ...f, width, height } : f
      ),
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
