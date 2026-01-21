# Image Resizer

🖼️ 브라우저에서 동작하는 이미지 리사이저입니다. 서버 없이 클라이언트에서 모든 처리가 이루어집니다.

**👉 [바로 사용하기](https://prisml.github.io/image-resizer)**

## ✨ 주요 기능

- 🖼️ 드래그 앤 드롭으로 이미지 업로드
- 📦 여러 이미지 한 번에 처리
- 🎨 고품질 이미지 리사이즈 (Pica 라이브러리)
- ↔️ 원본 비율 유지 옵션
- 💾 ZIP으로 일괄 다운로드 (JSZip)
- 🔒 개인정보 보호 (이미지가 서버로 전송되지 않음)
- 📱 오프라인에서도 동작

## 🛠️ 기술 스택

- **React 18** + TypeScript
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Zustand** - 상태 관리
- **Pica** - 고품질 이미지 리사이즈
- **JSZip** - ZIP 파일 생성

## 🚀 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## 📁 프로젝트 구조

```
image-resizer/
├── src/
│   ├── components/    # 공용 UI 컴포넌트
│   ├── hooks/         # 커스텀 훅
│   ├── modules/       # 기능별 모듈
│   ├── pages/         # 페이지 컴포넌트
│   ├── store/         # Zustand 스토어
│   └── utils/         # 유틸리티 함수
├── public/
└── index.html
```

## 📄 라이선스

MIT
