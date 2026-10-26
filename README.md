# CERTICOS BOOKS

## 1. 프로젝트 개요

CDRI 프론트엔드 사전과제로, 카카오 책 검색 API를 사용했습니다.

### 구현 기능

- 도서 검색
  - 전체 검색
  - 제목·저자명·출판사 상세 검색
  - 최근 검색 기록 8개
  - 무한 스크롤
  - 상세보기
  - 구매하기
- 내가 찜한 책
  - 찜한 시점의 책 정보 저장
  - 브라우저 재시작 후 유지

### 기술 스택

- React 19
- TypeScript 6
- TanStack Query 5
- React Router 8
- Zustand 5
- Tailwind CSS 4
- React Compiler 1
- Vite 8
- Vitest 5, Testing Library
- oxlint, Prettier

## 2. 실행 방법 및 환경 설정

### 환경 설정

- Node.js `^22.22.2 || ^24.15.0 || >=26.0.0`
- 메일로 받은 `.env` 파일을 프로젝트 루트에 둡니다.

### 실행 방법

```bash
npm ci
npm run dev
```

http://localhost:5173 에서 확인할 수 있습니다.

테스트는 `npm test`로 실행합니다.

## 3. 폴더 구조 및 주요 코드 설명

### 폴더 구조

[bulletproof-react](https://github.com/alan2207/bulletproof-react) 구조를 따릅니다.

- 의존 방향은 `app` → `features` → 공용 폴더, 한 방향입니다.
- `book-search`와 `wishlist`는 서로 import하지 않고, `app`의 페이지에서 조합합니다.
- 이 규칙은 oxlint `no-restricted-imports`로 강제합니다.

```text
src/
├─ app/                                라우터, 페이지
├─ features/
│  ├─ book-search/                     도서 검색 기능
│  │  ├─ api/                          API 요청
│  │  │  ├─ fetch-books.ts             ①
│  │  │  ├─ to-book.ts                 ②
│  │  │  └─ book-queries.ts            ③
│  │  ├─ stores/                       상태 스토어
│  │  ├─ hooks/                        ViewModel 훅
│  │  │  ├─ use-search-navigation.ts   ④
│  │  │  └─ use-search-results.ts      ⑤
│  │  ├─ utils/                        유틸 함수
│  │  │  └─ search-mode.ts             ⑥
│  │  └─ components/                   컴포넌트
│  └─ wishlist/                        찜 기능
│     ├─ stores/                       상태 스토어
│     │  └─ wishlist-store.ts          ⑦
│     ├─ hooks/                        ViewModel 훅
│     └─ components/                   컴포넌트
├─ components/
│  ├─ ui/                              공용 UI 컴포넌트
│  ├─ books/                           공용 책 목록 컴포넌트
│  └─ layouts/                         레이아웃 컴포넌트
├─ hooks/                              공용 훅
├─ lib/                                라이브러리 설정
├─ config/                             전역 설정
├─ types/                              공용 타입
├─ utils/                              공용 유틸 함수
├─ testing/                            테스트 도구
└─ index.css                           디자인 토큰
```

### 주요 코드 설명

**① `fetch-books.ts`**\
`fetchBooks`가 `/api/books`로 요청하고, 받은 책마다 `toBook`을 적용해 `BookSearchPage`로 돌려줍니다.

**② `to-book.ts`**\
`toBook`이 카카오 응답 한 건을 `Book`으로 바꿉니다. id는 ISBN13을 우선하고, 할인가는 `0 < sale_price < price`일 때만 남깁니다.

**③ `book-queries.ts`**\
`bookQueries.search`가 `SearchMode`별 쿼리 키와 요청 함수를 만들고, `idle`이면 `skipToken`으로 요청하지 않습니다. 다음 페이지는 `getNextSearchPage`가 `is_end`와 `pageable_count`로 정합니다.

**④ `use-search-navigation.ts`**\
`search`가 검색 기록을 저장하고 `setSearchParams`로 URL을 바꿉니다.

**⑤ `use-search-results.ts`**\
`useSearchResults`가 `useInfiniteQuery` 결과를 `status`가 `idle`·`loading`·`error`·`empty`·`success`인 값 하나로 바꾸고, `search-results`는 `status`로 분기해 그립니다.

**⑥ `search-mode.ts`**\
`parseSearchMode`가 URL의 `q`·`target`을 `SearchMode`로 바꿉니다. `SearchMode`는 `idle`·`all`·`detail` 중 하나입니다.

**⑦ `wishlist-store.ts`**\
`toggleWishedBook`이 책 정보를 통째로 목록 맨 앞에 넣거나 뺍니다. `persist`가 localStorage에 저장하고, 복원할 때는 `merge`에서 `isBook`을 통과한 항목만 남깁니다.

## 4. 라이브러리 선택 이유

기술 스택은 과제 규모에 맞게 의존성을 최소로 두는 것을 기준으로 채택했습니다. 빌드한 JS는 gzip 기준 129.7 kB입니다.

| 영역            | 라이브러리                | 선택 이유                                                                                                                         |
| --------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| UI              | React 19                  | 필수 스택이며, 19 버전은 별도 런타임 없이 React Compiler를 적용합니다.                                                            |
| 언어            | TypeScript 6              | 필수 스택이며, 카카오 응답과 앱 데이터를 다른 타입으로 나눠 응답 형식이 바뀌면 영향을 받는 코드를 컴파일 단계에서 잡아냅니다.     |
| 서버 상태       | TanStack Query 5          | 필수 스택이며, 검색 모드마다 결과를 캐시해 같은 검색을 즉시 보여주고, 페이지 이어 받기와 이전 요청 취소를 쿼리 하나로 관리합니다. |
| 라우팅          | React Router 8            | 가장 널리 쓰이는 라우터라 읽는 사람에게 익숙하고, data mode의 `ScrollRestoration`으로 뒤로 가기 시 이전 스크롤 위치를 복원합니다. |
| 클라이언트 상태 | Zustand 5                 | 저장할 상태가 검색 기록과 찜 두 가지라 가벼운 스토어가 규모에 맞고, `persist`가 저장 형식의 버전 관리와 복원 시 검사를 맡습니다.  |
| 스타일          | Tailwind CSS 4            | 런타임 비용이 없고, `@theme`에 Figma 토큰을 적으면 같은 이름의 클래스로 씁니다.                                                   |
| 성능            | React Compiler 1          | React 팀이 권장하는 방식이며, 컴파일 단계에서 메모이제이션을 빠짐없이 적용해 다시 그리는 범위를 줄입니다.                         |
| 빌드            | Vite 8                    | React 공식 문서가 권하는 빌드 도구이고, 개발·미리보기 서버 프록시로 별도 서버 없이 API 키를 번들 밖에 둡니다.                     |
| 테스트          | Vitest 5, Testing Library | Vite 설정을 그대로 공유해 앱과 같은 조건으로 테스트하고, 사용자가 보는 역할과 이름으로 화면을 검증합니다.                         |
| 코드 품질       | oxlint, Prettier          | Rust 기반의 빠른 린터로 import 경계와 React Compiler 규칙을 검사하고, Prettier로 Tailwind 클래스 순서를 일관되게 맞춥니다.        |

## 5. 강조하고 싶은 기능

### 1. 검색 상태는 URL 하나로 관리

전체 검색과 상세 검색이 동시에 진행되지 않고 새로고침, 뒤로 가기, 탭 이동 뒤에도 보던 검색이 유지되도록, 검색 상태의 원본을 URL 하나로 정했습니다.

- 두 검색이 함께 존재할 수 없도록 URL의 `q`·`target`을 `SearchMode` 판별 유니온으로 읽게 했습니다.
- 두 입력 폼이 따로 상태를 맞추지 않도록 검색할 때마다 바뀌는 `location.key`를 기준으로 URL 값에 맞추게 해, 한쪽을 검색하면 다른 쪽이 초기화되게 했습니다.
- 찜 탭에 다녀와도 보던 결과와 위치로 돌아오도록 마지막 검색 주소와 스크롤 위치를 기억하게 했습니다.

### 2. 유지보수를 위한 관심사 분리

한 곳을 고칠 때 다른 곳이 함께 바뀌지 않도록, 상태, 로직, 데이터, 기능의 경계를 정해 책임을 나눴습니다.

- **상태:** 성격이 다른 상태가 섞이지 않도록 검색 결과는 React Query, 검색 조건은 URL, 검색 기록과 찜은 Zustand, 화면에만 필요한 상태는 `useState`에 두기로 정했습니다.
- **로직:** 비즈니스 규칙과 화면 로직을 따로 고치고 테스트할 수 있도록 MVVM으로 나눠, 규칙은 Model인 `api/`·`stores/`·`utils/`에, 화면 상태와 동작은 ViewModel 훅에 두고, 기능 컴포넌트는 마크업과 이벤트 연결만 맡겼습니다.
- **데이터 경계:** 카카오 응답 형식이 앱 전체로 퍼지지 않도록 `api/` 안에서 `toBook`으로 `Book`을 만들고, 그 밖의 코드는 `Book`만 쓰게 했습니다.
- **기능 경계:** 검색과 찜이 서로 의존하지 않도록 공용 책 행은 찜 버튼을 렌더 함수로 받게 하고, 두 기능은 페이지에서만 조합했습니다.

### 3. 재사용 가능한 UI 컴포넌트 설계

화면이 늘어나도 컴포넌트를 고치지 않고 조합만으로 쓸 수 있도록, 네 가지 기준을 세워 설계했습니다.

- **도메인 의존:** 공용 UI가 특정 기능에 묶이지 않도록 컴포넌트를 도메인 의존도에 따라 `components/ui`, `components/books`, `features/*/components` 세 단계로 나누고, 각 단계는 의존도가 더 높은 단계를 import하지 않게 했습니다.
- **바뀌는 부분:** 쓰는 곳마다 다른 데이터와 동작은 props로 주입하기로 정해, `BookList`를 검색 결과와 내가 찜한 책에서 함께 쓰고 찜 버튼은 렌더 함수로 받게 했습니다.
- **스타일 변형:** 같은 모양이 여러 곳에 흩어지지 않도록 버튼 변형을 `buttonStyles()` 한 곳에 모으고, 상세보기 펼침과 목록 선택처럼 상태에 따라 바뀌는 모양은 `data-*`·`aria-*` 속성으로 바꾸게 했습니다.
- **접근성:** 어디서 쓰든 같은 수준의 접근성을 갖도록 키보드 조작과 ARIA를 W3C APG 패턴대로 컴포넌트 안에 넣었습니다.

### 4. 읽기 쉬운 코드를 위한 컨벤션

누가 읽어도 같은 방식으로 이해할 수 있도록 이름, 파일, 스타일 규칙을 정하고, oxlint로 컨벤션을 벗어날 수 없게 강제했습니다.

- **이름:** `book`, `wishlist`, `searchTarget`처럼 한 개념에는 한 단어만 쓰도록 용어를 정하고, 주석 대신 함수와 변수 이름으로 의도를 드러냈습니다.
- **파일:** 파일 이름은 대표 export 이름과 같은 kebab-case로 맞추고, 배럴 파일 없이 import 경로만 보고 위치를 알 수 있게 했습니다.
- **스타일:** Tailwind 임의값 없이 Figma 토큰 클래스만 쓰고, 상세보기 펼침과 목록 선택처럼 상태에 따라 바뀌는 모양은 `data-*`·`aria-*` 속성으로 바꾸며, 포맷과 클래스 순서는 Prettier로 맞췄습니다.
- **oxlint로 강제한 규칙:**
  - 공용 폴더가 기능을 import하거나 기능끼리 서로 import하면 실패
  - 폴더 밖은 `../` 대신 `@/` 경로만 허용하고, default export는 설정 파일에서만 허용
  - `any`와 non-null 단언 금지
  - Hooks 규칙과 React Compiler 규칙 위반 시 실패

### 5. 성능 측정으로 확인한 최적화

검색 결과가 쌓이고 펼치기와 찜을 반복해도 느려지지 않도록, 다시 그리는 범위와 요청 수, 받는 데이터 양을 줄이는 것을 기준으로 최적화하고, 렌더 횟수는 React DevTools 훅으로, 로딩 성능은 Lighthouse로 측정해 확인했습니다.

- **렌더링:** React Compiler로 메모이제이션을 자동 적용해 상세보기를 펼칠 때 다시 그리는 컴포넌트를 222개에서 25개로 줄이고, 찜은 책마다 따로 구독하게 해 하트를 눌러도 그 버튼만 다시 그리게 했습니다.
- **네트워크:** 같은 요청을 반복하지 않도록 검색 결과를 검색 모드별로 10분간 캐시하고, 검색이 바뀌면 진행 중인 이전 요청을 취소하며, 검색 전이나 마지막 페이지 이후에는 요청하지 않게 했습니다.
- **로딩:** 폰트는 한글을 범위별 조각으로 나눠 화면에 쓰인 글자의 조각만 받게 해 검색 화면에서 124개 중 10개만 받고, 다음 페이지는 목록 끝에 도달하기 전에 미리 요청하게 했습니다.
- **화면 안정:** 표지 크기를 미리 지정하고 스켈레톤을 실제로 올 행 수만큼 그려 레이아웃 이동을 막았습니다.
- **Lighthouse 결과:** 데스크톱 성능 100, 모바일 성능 88\~91, CLS 0\~0.001입니다.
