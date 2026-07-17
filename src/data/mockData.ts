// 가상 대학 정보 서비스 모의 데이터베이스

export interface StudentProfile {
  name: string;
  studentId: string;
  major: string;
  grade: number;
  semester: number;
  advisor: string;
  status: string; // 재학, 휴학 등
  email: string;
  phone: string;
}

export interface AcademicRecord {
  type: 'leave' | 'return' | 'dropout';
  requestDate: string;
  status: '대기' | '승인' | '반려';
  details: string;
}

export interface TimetableItem {
  subject: string;
  professor: string;
  room: string;
  day: '월' | '화' | '수' | '목' | '금';
  period: number[]; // 교시 예: [1, 2] -> 1, 2교시
  color?: string; // Tailwind bg-color class
}

export interface Syllabus {
  code: string;
  subject: string;
  professor: string;
  credits: number;
  classroom: string;
  schedule: string;
  description: string;
  weeklyPlan: string[];
}

export interface CourseRegistration {
  code: string;
  subject: string;
  professor: string;
  credits: number;
  schedule: string;
  classroom: string;
  evaluated: boolean; // 수업평가 실시 여부
}

export interface AttendanceItem {
  subject: string;
  totalHours: number;
  attended: number;
  late: number;
  absent: number;
  excused: number; // 공결
  rate: number; // 출석률 (%)
}

export interface OfficialLeave {
  id: string;
  subject: string;
  date: string;
  reason: string;
  status: '대기' | '승인' | '반려';
  submitDate: string;
}

export interface SemesterGrade {
  semesterName: string; // 예: "2025학년도 1학기"
  courses: {
    code: string;
    subject: string;
    type: '전공필수' | '전공선택' | '교양필수' | '교양선택';
    credits: number;
    grade: string; // A+, A0, B+, etc.
    score: number; // 4.5 만점 기준 평점
  }[];
  gpa: number;
  acquiredCredits: number;
}

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

export interface ExternalLink {
  name: string;
  url: string;
  description: string;
  category: '증명발급' | '연결서비스' | '학사행정';
}

// ==========================================
// MOCK DATA IMPLEMENTATION
// ==========================================

export const studentProfile: StudentProfile = {
  name: '홍길동',
  studentId: '202410420',
  major: '컴퓨터공학과',
  grade: 3,
  semester: 1,
  advisor: '김교수',
  status: '재학',
  email: 'gildong.hong@univ.ac.kr',
  phone: '010-1234-5678',
};

export const academicRecords: AcademicRecord[] = [
  {
    type: 'leave',
    requestDate: '2024-02-10',
    status: '승인',
    details: '군 휴학 (의무복무)',
  },
  {
    type: 'return',
    requestDate: '2026-02-05',
    status: '승인',
    details: '일반 복학',
  },
];

export const timetableData: TimetableItem[] = [
  { subject: '알고리즘', professor: '김교수', room: '공학관 402호', day: '월', period: [1, 2], color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { subject: '웹프로그래밍', professor: '박교수', room: 'IT관 203호', day: '화', period: [3, 4, 5], color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { subject: '인공지능개론', professor: '이교수', room: '공학관 501호', day: '수', period: [1, 2], color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { subject: '컴퓨터네트워크', professor: '최교수', room: '공학관 301호', day: '목', period: [6, 7], color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { subject: '데이터베이스', professor: '정교수', room: 'IT관 305호', day: '금', period: [2, 3, 4], color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
];

export const syllabusData: Syllabus[] = [
  {
    code: 'CS301',
    subject: '알고리즘',
    professor: '김교수',
    credits: 3,
    classroom: '공학관 402호',
    schedule: '월 1,2교시',
    description: '컴퓨터 알고리즘의 기초 설계 기법과 분석법을 학습합니다. 정렬, 검색, 동적 계획법, 그래프 알고리즘 등을 다룹니다.',
    weeklyPlan: [
      '1주차: 알고리즘 개요 및 수행 시간 분석 (Asymptotic Notation)',
      '2주차: 분할 정복 알고리즘 (Divide and Conquer)',
      '3주차: 퀵 정렬, 합병 정렬 분석',
      '4주차: 힙 정렬과 우선순위 큐',
      '5주차: 해싱 및 이진 탐색 트리',
      '6주차: 동적 계획법 (Dynamic Programming) 개요',
      '7주차: 동적 계획법 응용 (LCS, Knapsack)',
      '8주차: 중간고사',
      '9주차: 탐욕 알고리즘 (Greedy Algorithm)',
      '10주차: 그래프 기본 탐색 (BFS, DFS)',
      '11주차: 최소 신장 트리 (Kruskal, Prim)',
      '12주차: 최단 경로 알고리즘 (Dijkstra, Bellman-Ford)',
      '13주차: NP-완전 문제 개요',
      '14주차: 근사 알고리즘 맛보기',
      '15주차: 학기말 프로젝트 발표 및 기말고사',
    ],
  },
  {
    code: 'CS302',
    subject: '웹프로그래밍',
    professor: '박교수',
    credits: 3,
    classroom: 'IT관 203호',
    schedule: '화 3,4,5교시',
    description: 'HTML5, CSS3, JavaScript를 포함한 웹 표준 기술 및 최신 React 프레임워크와 Node.js 기반 백엔드 아키텍처를 학습합니다.',
    weeklyPlan: [
      '1주차: 인터넷의 역사 및 웹 구조의 이해',
      '2주차: HTML5 시맨틱 마크업 설계',
      '3주차: CSS3 플렉스박스 및 그리드 레이아웃',
      '4주차: Modern Javascript (ES6+) 핵심 문법',
      '5주차: DOM API 활용 동적 웹 구성',
      '6주차: 비동기 통신 (Fetch API, Promises, Async/Await)',
      '7주차: React.js 기초 컴포넌트 설계 및 상태 관리',
      '8주차: 중간고사 대체 프로젝트 제출',
      '9주차: React Hooks & 라우팅 (React Router)',
      '10주차: Tailwind CSS를 이용한 현대적 UI 스타일링',
      '11주차: Node.js 및 Express API 서버 개발',
      '12주차: RESTful API 명세 및 DB 연동 (MongoDB)',
      '13주차: 사용자 인증 (Session, JWT)',
      '14주차: 웹 성능 최적화 및 보안 이슈 대응',
      '15주차: 풀스택 웹 어플리케이션 완성 및 배포',
    ],
  },
];

export const courseRegistrations: CourseRegistration[] = [
  { code: 'CS301', subject: '알고리즘', professor: '김교수', credits: 3, schedule: '월 1,2', classroom: '공학관 402호', evaluated: true },
  { code: 'CS302', subject: '웹프로그래밍', professor: '박교수', credits: 3, schedule: '화 3,4,5', classroom: 'IT관 203호', evaluated: false },
  { code: 'CS305', subject: '인공지능개론', professor: '이교수', credits: 3, schedule: '수 1,2', classroom: '공학관 501호', evaluated: true },
  { code: 'CS308', subject: '컴퓨터네트워크', professor: '최교수', credits: 3, schedule: '목 6,7', classroom: '공학관 301호', evaluated: false },
  { code: 'CS310', subject: '데이터베이스', professor: '정교수', credits: 3, schedule: '금 2,3,4', classroom: 'IT관 305호', evaluated: false },
];

export const attendanceData: AttendanceItem[] = [
  { subject: '알고리즘', totalHours: 30, attended: 28, late: 1, absent: 1, excused: 0, rate: 93.3 },
  { subject: '웹프로그래밍', totalHours: 45, attended: 45, late: 0, absent: 0, excused: 0, rate: 100 },
  { subject: '인공지능개론', totalHours: 30, attended: 26, late: 1, absent: 1, excused: 2, rate: 96.7 },
  { subject: '컴퓨터네트워크', totalHours: 30, attended: 28, late: 0, absent: 2, excused: 0, rate: 93.3 },
  { subject: '데이터베이스', totalHours: 45, attended: 40, late: 3, absent: 2, excused: 0, rate: 88.9 },
];

export const officialLeaves: OfficialLeave[] = [
  {
    id: 'OL-2026-001',
    subject: '인공지능개론',
    date: '2026-05-13',
    reason: '예비군 훈련 참가',
    status: '승인',
    submitDate: '2026-05-10',
  },
  {
    id: 'OL-2026-002',
    subject: '데이터베이스',
    date: '2026-07-02',
    reason: '코로나19 확진 진단',
    status: '대기',
    submitDate: '2026-07-01',
  },
];

export const gradeHistory: SemesterGrade[] = [
  {
    semesterName: '2025학년도 1학기',
    gpa: 4.15,
    acquiredCredits: 18,
    courses: [
      { code: 'CS201', subject: '자료구조', type: '전공필수', credits: 3, grade: 'A+', score: 4.5 },
      { code: 'CS203', subject: '컴퓨터구조', type: '전공필수', credits: 3, grade: 'A0', score: 4.0 },
      { code: 'CS205', subject: '이산수학', type: '전공선택', credits: 3, grade: 'B+', score: 3.5 },
      { code: 'MATH101', subject: '선형대수학', type: '교양필수', credits: 3, grade: 'A+', score: 4.5 },
      { code: 'ENG201', subject: '대학실용영어', type: '교양필수', credits: 3, grade: 'A0', score: 4.0 },
      { code: 'CS208', subject: '객체지향프로그래밍', type: '전공필수', credits: 3, grade: 'A+', score: 4.5 },
    ],
  },
  {
    semesterName: '2025학년도 2학기',
    gpa: 4.28,
    acquiredCredits: 18,
    courses: [
      { code: 'CS251', subject: '운영체제', type: '전공필수', credits: 3, grade: 'A+', score: 4.5 },
      { code: 'CS253', subject: '소프트웨어공학', type: '전공필수', credits: 3, grade: 'A+', score: 4.5 },
      { code: 'CS255', subject: '시스템프로그래밍', type: '전공선택', credits: 3, grade: 'A0', score: 4.0 },
      { code: 'CS258', subject: '프로그래밍언어론', type: '전공선택', credits: 3, grade: 'B+', score: 3.5 },
      { code: 'MATH202', subject: '확률및통계', type: '교양필수', credits: 3, grade: 'A+', score: 4.5 },
      { code: 'CS260', subject: '창의융합설계', type: '전공필수', credits: 3, grade: 'A+', score: 4.5 },
    ],
  },
];

export const currentTuition: TuitionInvoice = {
  semesterName: '2026학년도 1학기',
  tuitionFee: 4250000,
  entranceFee: 0,
  scholarship: 1500000,
  netAmount: 2750000,
  bankName: '국민은행',
  accountNumber: '942010-24-104200 (예금주: 봉황대학교)',
  status: '납부완료',
  paymentDate: '2026-02-21',
};

export const refundRecords: RefundRecord[] = [
  {
    id: 'RF-2024-001',
    applyDate: '2024-02-12',
    semesterName: '2024학년도 1학기',
    refundFee: 4250000,
    reason: '군휴학으로 인한 등록금 전액 환불/대체',
    bankName: '신한은행',
    accountNumber: '110-333-567890',
    status: '지급완료',
  },
];

export const externalLinks: ExternalLink[] = [
  { name: '인터넷 증명발급', url: 'https://cert.univ.ac.kr', description: '재학증명서, 성적증명서 등 온라인 즉시 발급', category: '증명발급' },
  { name: '우편 증명발급 신청', url: 'https://post-cert.univ.ac.kr', description: '인터넷 발급 불가 서류 및 영문 원본 우편 발송 신청', category: '증명발급' },
  { name: '웹메일 서비스', url: 'https://mail.univ.ac.kr', description: '학교 공식 이메일 계정 (@univ.ac.kr)', category: '연결서비스' },
  { name: '종합웹정보시스템', url: 'https://wis.univ.ac.kr', description: '상세 학사 행정 및 수강 이력 관리 시스템', category: '연결서비스' },
  { name: '봉황대학교 LLM 서비스', url: 'https://ai.univ.ac.kr', description: '교내 구성원 전용 학사 지원 AI 어시스턴트', category: '연결서비스' },
  { name: '봉황BBS (커뮤니티)', url: 'https://bbs.univ.ac.kr', description: '자유게시판, 장터, 스터디 모집 등 교내 공식 커뮤니티', category: '연결서비스' },
  { name: '수강신청관리 시스템', url: 'https://sugang.univ.ac.kr', description: '수강신청 희망과목 담기 및 본 수강신청 진행', category: '학사행정' },
  { name: '비밀번호 변경', url: 'https://wis.univ.ac.kr/change-pw', description: '종합정보시스템 비밀번호 변경 관리', category: '학사행정' },
];
