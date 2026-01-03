# Image Resizer Project Guidelines

## 프로젝트 개요
React + Express 기반의 이미지 리사이저 애플리케이션

## 개발 원칙
- 커밋하면서 진행
- init commit 수준의 양으로 시작
- 상태 관리: `checked` (배열), `selected` (단일 선택)
- 나중에 일괄/개별 선택 모드 전환 가능하도록 상태 설계

## 프로젝트 구조
- `/client`: React 애플리케이션
- `/server`: Express 백엔드

## 상태 관리 설계 (미리 고려)
```javascript
{
  files: [],           // 업로드된 모든 파일
  checked: [],         // 선택된 파일들의 배열 (일괄 처리용)
  selected: null,      // 현재 선택된 단일 파일 (상세 보기용)
  resizeSettings: {
    width: null,
    height: null,
    maintainAspectRatio: false
  }
}
```
