# 원광대학교 AI 웹정보서비스 — 개발 가이드 및 구현 명세

이 문서는 "원광대학교 AI 웹정보서비스" 프로젝트의 실제 개발 상황과 아키텍처 설계, 구현 순서, 그리고 각 컴포넌트별 주의 사항을 상세히 기술합니다.

---

## 0. 프로젝트 개요

본 프로젝트는 원광대학교 재학생(데모 학생: **컴퓨터공학과 3학년 홍길동**)이 자연어로 학사 행정 관련 질문을 했을 때, AI가 사용자의 의도를 분석하여 이에 알맞은 모의 학사 데이터를 활용한 **전용 카드 UI**로 자동 렌더링해주는 지능형 포털 시스템입니다.

동시에, 일반 포털처럼 왼쪽 사이드바 메뉴를 클릭해 **전용 정적 조회 페이지**로도 자유롭게 이동할 수 있는 하이브리드 인터페이스를 제공합니다.

---

## 1. 기술 스택 및 라이브러리

| 영역 | 기술 선택 | 상세 및 목적 |
|---|---|---|
| **프레임워크** | Next.js 16 (App Router / Turbopack) | 파일 기반 라우팅을 이용한 각 메뉴별 전용 페이지 구현, 서버 사이드 API 라우트를 통한 AI 백엔드 제공 |
| **언어** | TypeScript | 학사 데이터 스키마 정의 및 프론트/백엔드 간 안정적인 데이터 타입 공유 |
| **스타일링** | Vanilla CSS / Tailwind CSS | 글래스모피즘 테마 디자인 시스템 및 디바이스 반응형 레이아웃 구현 |
| **아이콘** | Lucide React | 일관된 톤앤매너의 현대적인 학사 행정 아이콘 제공 |
| **AI 엔진** | `@google/generative-ai` (Gemini API) | 자연어 의도 분석 및 Function Calling 도구 호출을 통한 데이터 매핑 |

---

## 2. 데이터 모델링 명세 (`src/data/mockData.ts`)

UI 및 API 구현의 기준이 되는 핵심 데이터 모델 타입입니다. 실제 구현 파일에서는 아래 인터페이스들과 이에 매핑된 모의 데이터셋이 선언되어 있습니다.

```typescript
// 1. 학생 인적사항 및 프로필
export interface StudentProfile {
  name: string;      // 이름 (홍길동)
  studentId: string; // 학번 (202410420)
  major: string;     // 학과 (컴퓨터공학과)
  grade: number;     // 학년 (3학년)
  semester: number;  // 학기 (1학기)
  advisor: string;   // 지도교수 (김교수)
  status: string;    // 학적상태 (재학)
  email: string;
  phone: string;
}

// 2. 개설 교과목 정보 (이전의 TimetableItem에서 변경됨)
export interface DepartmentSubject {
  grade: number;            // 학년 (1~4)
  classification: '전필' | '전선' | '기전' | '교필' | '교선'; // 구분
  code: string;             // 학수번호
  subject: string;          // 교과목명
  classGroup: string;       // 분반
  credits: number;          // 학점
  time: string;             // 시간 문자열 (예: "월 1,2 / 화 3")
  professor: string;        // 담당교수
  classroom: string;        // 강의실
}

// 3. 수강신청 정보
export interface CourseRegistration {
  code: string;
  subject: string;
  professor: string;
  credits: number;
  schedule: string;
  classroom: string;
  evaluated: boolean;       // 수업평가 실시 여부
}

// 4. 출결 현황 및 공결
export interface AttendanceItem {
  subject: string;
  totalHours: number;
  attended: number;
  late: number;
  absent: number;
  excused: number;          // 공결 인정 시간
  rate: number;             // 출석률 (%)
}

export interface OfficialLeave {
  id: string;
  subject: string;
  date: string;
  reason: string;
  status: '대기' | '승인' | '반려';
  submitDate: string;
}

// 5. 성적 이력
export interface SemesterGrade {
  semesterName: string;     // 예: "2025학년도 1학기"
  gpa: number;              // 평점 평균 (4.5 만점)
  acquiredCredits: number;  // 취득 학점
  courses: {
    code: string;
    subject: string;
    type: '전공필수' | '전공선택' | '교양필수' | '교양선택';
    credits: number;
    grade: string;          // A+, A0, B+, etc.
    score: number;
  }[];
}

// 6. 등록금 및 환불
export interface TuitionInvoice {
  semesterName: string;
  tuitionFee: number;
  entranceFee: number;
  scholarship: number;
  netAmount: number;
  bankName: string;
  accountNumber: string;
  status: '납부완료' | '미납';
  paymentDate?: string;
}

export interface RefundRecord {
  id: string;
  applyDate: string;
  semesterName: string;
  refundFee: number;
  reason: string;
  bankName: string;
  accountNumber: string;
  status: '신청' | '승인' | '지급완료';
}
```

---

## 3. 사이드바 및 라우팅 구조 (`src/components/Sidebar.tsx`)

포털의 전체 네비게이션을 담당하는 사이드바의 메뉴 그룹 구조 및 각각의 라우팅 명세입니다.

### 아코디언 메뉴 구성
* **MYPAGE**
  * 개인정보관리 (`/profile`)
    * *서브메뉴:* 비밀번호변경 (외부링크: `https://wis.univ.ac.kr/change-pw`)
* **정보서비스**
  * 학적관리 (`/academic`): 휴복학신청 (`?type=leave`), 자퇴신청 (`?type=dropout`)
  * 시간표관리 (`/timetable`): 학과별시간표 (`/timetable`), 교수시간표조회 (`?type=professor`)
  * 수업관리 (`/syllabus`): 강의계획서조회 (`/syllabus`), 수강신청관리 (외부링크: `https://sugang.univ.ac.kr`), 수강신청조회 (`/syllabus`), 수업평가실시 (`/syllabus`)
  * 전자출결관리 (`/attendance`): 출결조회, 공결신청, 공결조회
  * 성적관리 (`/grades`): 성적단표내역조회, 이수과목확인리스트, 전체성적조회
  * 등록관리 (`/tuition`): 등록고지서 (`?tab=invoice`), `[환불] 신청 및 내역` (`?tab=refund`)
* **증명발급** (외부링크)
  * 인터넷발급 (`https://cert.univ.ac.kr`)
  * 우편발급 (`https://post-cert.univ.ac.kr`)
* **연결 서비스** (외부링크)
  * 웹메일 (`https://mail.univ.ac.kr`), 종합웹정보시스템 (`https://wis.univ.ac.kr`), 원광대학교 LLM 서비스 (`https://ai.univ.ac.kr`), 봉황BBS (`https://bbs.univ.ac.kr`)

---

## 4. UI 카드 컴포넌트 구현 특이사항 (`src/components/cards/*`)

각 학사 행정 의도(Intent)별 전용 카드 설계 명세입니다.

### 4-1. 시간표 정보 카드 (`TimetableCard.tsx`)
* **최근 개발 사양:** 이전 개발 버전의 "그리드형 주간 시간표(Figma 스타일 absolute 배율)"와 달리, 현재 버전은 **"학과 개설 교과목 상세 검색 및 필터링 대시보드"**로 구현되어 있습니다.
* **학년 필터:** 전체 / 1학년 / 2학년 / 3학년 / 4학년 필터 버튼 제공.
* **이수구분 필터:** 전체 / 전필 / 전선 / 기전 / 교필 / 교선 필터 버튼 제공.
* **실시간 검색:** 교과목명, 담당교수, 학수번호 키워드 실시간 매칭.
* **반응형 대응:** 데스크톱 규격에 최적화된 테이블 뷰와 모바일 기기 터치 피로도를 줄여주는 카드 목록 뷰를 분기 렌더링합니다.

### 4-2. 학적 카드 (`AcademicCard.tsx`)
* **휴학/복학/자퇴 탭:** 신청 폼 양식을 컴포넌트 내 `useState` 상태로 제어하며, 과거 학적 변경 신청 이력을 테이블로 렌더링합니다.

### 4-3. 등록금 카드 (`TuitionCard.tsx`)
* **고지서/환불 탭:** 등록금 실 납부액 계산 정보(`tuitionFee - scholarship`)와 가상 계좌 안내, 그리고 기 승인된 환불 상태 정보를 탭 분리 제공합니다.

---

## 5. AI 백엔드 API 명세 (`src/app/api/chat/route.ts`)

자연어 질문을 분석하여 의도(Intent)와 데이터를 매핑하고 챗봇 응답 메시지를 가공하는 서버 사이드 컨트롤러입니다.

### 5-1. Gemini Function Calling 도구 매핑
자연어 질문 분석을 최적화하기 위해 다음 8개의 Function Declaration 도구를 제공합니다:
1. `get_student_profile`: 학생 기본 인적 사항 및 지도교수 프로필 정보 조회
2. `get_grades`: 성적 단표 내역, 이수과목 확인, 평점 평균 조회 (`semester` 파라미터 선택적 포함)
3. `get_timetable`: 개설 교과목 목록 조회 (`grade`, `classification` 파라미터 선택적 포함)
4. `get_attendance`: 출결 현황 및 공결 신청 내역 조회
5. `get_tuition_and_refund`: 등록금 고지서 세부 내역 및 환불 신청 정보 조회
6. `get_syllabus`: 특정 과목의 강의계획서 주차별 계획 조회 (`subject` 파라미터 필수 요구)
7. `request_academic_change`: 휴학, 복학, 자퇴 신청 페이지 유도 및 상태 조회 (`type` 파라미터 필수 요구)
8. `get_external_link`: 외부 연동 서비스 링크 제공 (`service_name` 파라미터 필수 요구)

### 5-2. API 다중 보호막 구조
1. **서버 응답 캐시:** 동일한 정적 질문에 대한 과도한 API 호출 및 분당 할당량 소모를 방지하기 위해 24시간 동안 응답 결과를 서버 로컬 맵(`responseCache`)에 보관합니다.
2. **다중 모델 폴백 체인 (Fallback Chain):** API Studio 무료 키의 사용량 및 접근 권한 차이를 극복하기 위해 `gemini-2.5-flash` → `gemini-3.1-flash-lite` → `gemini-3.5-flash` 순으로 호출 실패 시 자동 대체 로직이 구현되어 있습니다.
3. **규칙 기반 로컬 분석 (Fallback Intent Handler):** API 키가 제공되지 않거나 모든 모델이 만료/실패한 경우, 자연어에서 정규식 및 키워드 검출을 활용한 로컬 규칙 기반 분류(`handleFallbackIntent`)를 통해 `isFallback: true` 플래그와 함께 즉각 답변을 반환하여 서비스 중단을 예방합니다.

### 5-3. 팩트 기반 컨텍스트 제공
자연어 질문에 대한 텍스트 설명의 무결성을 유지하기 위해, API 호출 시 시스템 프롬프트 상에 **전체 모의 학사 데이터베이스를 JSON 객체로 동봉**합니다. 모델은 이 내부 데이터만을 근거로 정확하게 사실만을 기술한 설명 문장을 창작하도록 통제받습니다.

---

## 6. 개발 및 빌드 검증

* **타입 검사:** `npx tsc --noEmit`을 통해 데이터 모델 타입 불일치 에러 검사.
* **정적 빌드 최적화:** `useSearchParams()`를 호출하는 클라이언트 컴포넌트(`/academic` 등)는 Next.js 정적 페이지 생성(SSG) 시 에러가 나는 것을 방지하기 위해 부모 레이아웃에서 반드시 `<Suspense>` 바운더리를 씌우도록 구현해야 합니다.
* **배포 빌드 검사:** `npm run build`를 통해 Turbopack 환경과 Next.js 배포 파일 생성이 정상적으로 통과되는지 확인합니다.
