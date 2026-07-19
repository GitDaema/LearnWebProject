import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, FunctionDeclaration } from '@google/generative-ai';
import * as mockDb from '@/data/mockData';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

// API Key 획득 (서버 환경변수)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

// 무료 AI Studio 키는 모델별로 "사용량이 아니라 접근권한 자체"가 다르게 부여된다.
// 아래는 이 키로 직접 확인한 결과 (Google AI Studio 사용량 표 + 실제 generateContent 호출 검증, 2026-07-18):
//   - gemini-2.5-flash      → 정상 (일 20회). 품질이 가장 검증된 주력 모델.
//   - gemini-3.1-flash-lite → 정상, 게다가 일 500회로 여유가 훨씬 큼. 실제 호출로 응답 확인 완료.
//   - gemini-3.5-flash      → 할당량 자체는 있으나(일 20회) 호출 시 일시적 503(과부하)이 발생함.
//                             영구 차단은 아니므로 마지막 후보로 남겨둠(실패해도 다음 단계로 넘어갈 뿐).
//   - gemini-2.0-flash / gemini-2.0-flash-lite → 429, limit: 0 (이 키에는 애초에 할당량이 없음, 영구)
//   - gemini-2.5-flash-lite → 404 "no longer available to new users" (영구 차단)
// 마지막 두 그룹은 재시도해도 항상 실패해 지연만 늘리므로 후보에서 제외했다.
// 유료 결제를 등록하면 할당량이 바뀔 수 있으니, 그 경우 이 배열을 다시 확인하면 된다.
const GEMINI_MODEL_CANDIDATES = [
  'gemini-2.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash',
];

// 동일한 질문에 대해 매번 모델을 새로 호출하지 않도록 응답을 재사용해 요청 한도 소모 자체를 줄인다.
// 모의 데이터는 서버가 떠 있는 동안 절대 바뀌지 않으므로(정적 mock), 같은 질문의 답도 항상 동일하다.
// → 프로세스가 살아있는 동안은 사실상 무기한 재사용해도 안전하다 (24시간으로 설정).
const RESPONSE_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const responseCache = new Map<string, { expires: number; payload: any }>();

// 앞뒤 공백/중복 공백 차이로 캐시가 빗나가지 않도록 질문을 정규화한다.
function normalizeCacheKey(message: string): string {
  return message.trim().replace(/\s+/g, ' ');
}

function getCached(key: string) {
  const hit = responseCache.get(key);
  if (!hit) return null;
  if (hit.expires < Date.now()) {
    responseCache.delete(key);
    return null;
  }
  return hit.payload;
}

function setCached(key: string, payload: any) {
  responseCache.set(key, { expires: Date.now() + RESPONSE_CACHE_TTL_MS, payload });
}

// 1. Function Calling 도구 정의
const getStudentProfileTool: FunctionDeclaration = {
  name: 'get_student_profile',
  description: '학생 홍길동의 기본 인적 사항과 지도교수 정보를 가져옵니다. "내 정보 보여줘", "프로필 조회", "지도교수 누구야?" 등의 질문에 매핑됩니다.',
};

const getGradesTool: FunctionDeclaration = {
  name: 'get_grades',
  description: '홍길동의 성적 단표 내역, 이수과목 확인, 전체 성적 조회 등을 가져옵니다. "내 성적 보여줘", "이번 학기 성적 어때?", "평점 평균 알려줘" 등에 매핑됩니다.',
  parameters: {
    type: 'OBJECT' as any,
    properties: {
      semester: {
        type: 'STRING' as any,
        description: '특정 학기 (예: "2025학년도 1학기", "2025-2", "2025년 2학기" 등). 생략하면 전체 학기 성적이 반환됩니다.',
      },
    },
  },
};

const getTimetableTool: FunctionDeclaration = {
  name: 'get_timetable',
  description: '컴퓨터공학과의 학과별 개설 교과목 및 학과 시간표 정보를 조회합니다. "학과별 시간표 보여줘", "학과 개설 과목 알려줘", "개설 교과목 목록 확인" 등에 매핑됩니다.',
  parameters: {
    type: 'OBJECT' as any,
    properties: {
      grade: {
        type: 'INTEGER' as any,
        description: '특정 학년 (1, 2, 3, 4). 생략하면 전체 학년의 과목이 조회됩니다.',
      },
      classification: {
        type: 'STRING' as any,
        description: '특정 이수 구분 (예: "전필", "전선", "기전", "교필", "교선"). 생략하면 전체 구분이 조회됩니다.',
      },
    },
  },
};

const getAttendanceTool: FunctionDeclaration = {
  name: 'get_attendance',
  description: '홍길동의 출결 조회, 공결 신청 내역 및 조회를 수행합니다. "출결 현황 어때?", "공결 신청 조회해줘", "지각이나 결석 있나?" 등에 매핑됩니다.',
};

const getTuitionAndRefundTool: FunctionDeclaration = {
  name: 'get_tuition_and_refund',
  description: '등록금 고지서 세부 내역 및 환불 신청 내역을 조회합니다. "등록금 고지서 보여줘", "환불 신청 내역 확인해줘", "등록금 냈어?" 등에 매핑됩니다.',
};

const getSyllabusTool: FunctionDeclaration = {
  name: 'get_syllabus',
  description: '강의계획서 내용을 조회합니다. "알고리즘 강의계획서 보여줘", "웹프로그래밍 주차별 계획 조회" 등에 매핑됩니다.',
  parameters: {
    type: 'OBJECT' as any,
    properties: {
      subject: {
        type: 'STRING' as any,
        description: '조회할 과목명 (예: "알고리즘", "웹프로그래밍").',
      },
    },
    required: ['subject'],
  },
};

const requestAcademicChangeTool: FunctionDeclaration = {
  name: 'request_academic_change',
  description: '휴학, 복학, 자퇴 신청 페이지나 상태를 조회합니다. "휴학 신청하고 싶어", "복학 신청 어떻게 해?", "자퇴 신청" 등에 매핑됩니다.',
  parameters: {
    type: 'OBJECT' as any,
    properties: {
      type: {
        type: 'STRING' as any,
        description: '신청 유형 ("leave" (휴학), "return" (복학), "dropout" (자퇴))',
      },
    },
    required: ['type'],
  },
};

const getCourseRegistrationTool: FunctionDeclaration = {
  name: 'get_course_registration',
  description: '홍길동의 수강신청 완료 내역, 신청 학점, 이번 학기 수강신청 성공 여부 등을 조회합니다. "나 수강신청 몇 학점 했어?", "수강신청 성공했나?", "앞으로 몇 학점 더 신청 가능해?" 등의 질문에 매핑됩니다.',
};

const getProfessorTimetableTool: FunctionDeclaration = {
  name: 'get_professor_timetable',
  description: '교수 시간표 및 강의 교실을 조회합니다. "김민준 교수님 시간표 알려줘", "이서준 교수님 언제 수업 있어?", "정하윤 교수님 강의실 어디야?" 등의 질문에 매핑됩니다.',
  parameters: {
    type: 'OBJECT' as any,
    properties: {
      professor_name: {
        type: 'STRING' as any,
        description: '조회할 교수님의 이름 (예: "김민준", "이서준", "정하윤" 등)',
      },
    },
    required: ['professor_name'],
  },
};

const getExternalLinkTool: FunctionDeclaration = {
  name: 'get_external_link',
  description: '웹메일, 수강신청관리, 봉황BBS, LLM 서비스, 인터넷발급, 우편발급 등 외부 연동 서비스나 외부 링크로 연결하는 정보를 조회합니다. "웹메일 바로가기", "수강신청 하려면 어디로 가?", "인터넷 증명발급 링크", "비밀번호 변경" 등에 매핑됩니다.',
  parameters: {
    type: 'OBJECT' as any,
    properties: {
      service_name: {
        type: 'STRING' as any,
        description: '서비스 이름 (예: "웹메일", "웹정보", "LLM", "봉황BBS", "인터넷발급", "우편발급", "수강신청", "비밀번호변경")',
      },
    },
    required: ['service_name'],
  },
};


// 학과 개설 교과목 정보를 바탕으로, 실제 데이터에 근거한 결정적인 답변 문장을 생성한다.
function describeTimetable(
  message: string,
  grade: number | undefined,
  classification: string | undefined,
  items: mockDb.DepartmentSubject[]
): string {
  const count = items.length;
  let spec = '컴퓨터공학과 개설 교과목';
  if (grade && classification) spec = `컴퓨터공학과 ${grade}학년 ${classification} 개설 교과목`;
  else if (grade) spec = `컴퓨터공학과 ${grade}학년 개설 교과목`;
  else if (classification) spec = `컴퓨터공학과 ${classification} 개설 교과목`;

  if (count === 0) {
    return `조회된 ${spec}이 없습니다.`;
  }

  const listStr = items.slice(0, 3).map(t => `[${t.subject}](${t.professor} 교수, ${t.time})`).join(', ');
  const suffix = count > 3 ? ` 외 ${count - 3}건` : '';
  return `조회하신 ${spec}은 총 ${count}건 개설되어 있습니다. 주요 과목으로는 ${listStr}${suffix} 등이 있습니다.`;
}

// 2. Rule-based Fallback 로직 (API 키 미설정 시)
function handleFallbackIntent(message: string, studentData?: any) {
  const msg = message.toLowerCase();
  
  const activeProfile = studentData?.profile || mockDb.studentProfile;
  const activeGrades = studentData?.grades || mockDb.gradeHistory;
  const activeAttendance = studentData?.attendance || mockDb.attendanceData;
  const activeTuition = studentData?.tuition || mockDb.currentTuition;
  
  if (msg.includes('성적') || msg.includes('학점') || msg.includes('gpa') || msg.includes('점수')) {
    let semester = undefined;
    if (msg.includes('1학기')) semester = '2025학년도 1학기';
    if (msg.includes('2학기')) semester = '2025학년도 2학기';
    
    return {
      intent: 'get_grades',
      args: { semester },
      text: semester 
        ? `${activeProfile.name} 학생의 ${semester} 성적 조회 결과입니다.`
        : `${activeProfile.name} 학생의 전체 성적 단표 내역 및 GPA 정보입니다.`,
      data: semester 
        ? activeGrades.find((g: any) => g.semesterName === semester) 
        : activeGrades
    };
  }

  if (msg.includes('시간표') || msg.includes('수업') || msg.includes('요일') || msg.includes('강의실') || msg.includes('교시') || msg.includes('개설') || msg.includes('과목')) {
    // 교수 시간표 질문인 경우 폴백 처리
    const hasProfName = mockDb.professorDirectory.some(p => msg.includes(p.name));
    const hasProfWord = msg.includes('교수') || msg.includes('교수님');
    if (hasProfName || hasProfWord) {
      const matchedProf = mockDb.professorDirectory.find(p => msg.includes(p.name)) || mockDb.professorDirectory[0];
      return {
        intent: 'get_professor_timetable',
        args: { professor_name: matchedProf.name },
        text: `${matchedProf.name} 교수님의 담당 시간표 및 강의실 조회 결과입니다.`,
        data: {
          directory: mockDb.professorDirectory,
          schedule: mockDb.timetableData,
          selectedProfessor: matchedProf
        }
      };
    }

    const gradeParam = msg.includes('1학년') ? 1 : msg.includes('2학년') ? 2 : msg.includes('3학년') ? 3 : msg.includes('4학년') ? 4 : undefined;
    const classParam = msg.includes('전필') ? '전필' : msg.includes('전선') ? '전선' : msg.includes('기전') ? '기전' : msg.includes('교필') ? '교필' : msg.includes('교선') ? '교선' : undefined;

    const timetable = mockDb.timetableData.filter(t => {
      const matchGrade = !gradeParam || t.grade === gradeParam;
      const matchClass = !classParam || t.classification === classParam;
      return matchGrade && matchClass;
    });

    return {
      intent: 'get_timetable',
      args: { grade: gradeParam, classification: classParam },
      text: describeTimetable(message, gradeParam, classParam, timetable),
      data: timetable
    };
  }

  if (msg.includes('출결') || msg.includes('출석') || msg.includes('결석') || msg.includes('지각') || msg.includes('공결')) {
    return {
      intent: 'get_attendance',
      args: {},
      text: '전자출결 관리 시스템의 출결 현황 및 공결 신청 내역입니다.',
      data: {
        attendance: activeAttendance,
        officialLeaves: mockDb.officialLeaves
      }
    };
  }

  if (msg.includes('등록') || msg.includes('등록금') || msg.includes('고지서') || msg.includes('환불') || msg.includes('납부')) {
    return {
      intent: 'get_tuition_and_refund',
      args: {},
      text: '등록금 납부 고지서 및 환불 신청 상세 내역입니다.',
      data: {
        invoice: activeTuition,
        refunds: mockDb.refundRecords
      }
    };
  }

  if (msg.includes('계획서') || msg.includes('실라버스') || msg.includes('과목 정보')) {
    let subject = '알고리즘';
    if (msg.includes('웹프로그래밍') || msg.includes('웹')) subject = '웹프로그래밍';
    
    const syllabus = mockDb.syllabusData.find(s => s.subject.includes(subject)) || mockDb.syllabusData[0];
    return {
      intent: 'get_syllabus',
      args: { subject: syllabus.subject },
      text: `신청하신 [${syllabus.subject}] 과목의 강의계획서 세부 정보입니다.`,
      data: syllabus
    };
  }

  if (msg.includes('휴학') || msg.includes('복학') || msg.includes('자퇴')) {
    let type: 'leave' | 'return' | 'dropout' = 'leave';
    if (msg.includes('복학')) type = 'return';
    if (msg.includes('자퇴')) type = 'dropout';

    return {
      intent: 'request_academic_change',
      args: { type },
      text: `${type === 'leave' ? '휴학' : type === 'return' ? '복학' : '자퇴'} 신청 및 이력 상태 정보입니다.`,
      data: {
        type,
        records: mockDb.academicRecords.filter(r => r.type === type),
        profile: activeProfile
      }
    };
  }

  if (msg.includes('수강신청') && (msg.includes('학점') || msg.includes('내역') || msg.includes('성공') || msg.includes('결과') || msg.includes('과목'))) {
    return {
      intent: 'get_course_registration',
      args: {},
      text: '이번 학기 수강신청 신청 내역 및 신청 가능 학점 현황입니다.',
      data: {
        registrations: mockDb.courseRegistrations,
        creditLimit: mockDb.enrollmentCreditLimit
      }
    };
  }

  if (msg.includes('메일') || msg.includes('웹메일') || msg.includes('bbs') || msg.includes('커뮤니티') || msg.includes('증명') || msg.includes('발급') || msg.includes('수강신청') || msg.includes('비밀번호')) {
    let service_name = '웹메일';
    if (msg.includes('수강신청')) service_name = '수강신청';
    else if (msg.includes('증명') || msg.includes('인터넷')) service_name = '인터넷발급';
    else if (msg.includes('우편')) service_name = '우편발급';
    else if (msg.includes('비밀번호') || msg.includes('변경')) service_name = '비밀번호변경';
    else if (msg.includes('bbs') || msg.includes('게시판') || msg.includes('봉황')) service_name = '봉황BBS';
    else if (msg.includes('llm') || msg.includes('ai')) service_name = 'LLM';

    const link = mockDb.externalLinks.find(l => l.name.includes(service_name) || l.category === service_name) || mockDb.externalLinks[0];
    return {
      intent: 'get_external_link',
      args: { service_name },
      text: `요청하신 [${service_name}] 바로가기 링크 및 연동 안내 정보입니다.`,
      data: link
    };
  }

  if (msg.includes('프로필') || msg.includes('인적사항') || msg.includes('학생') || msg.includes('지도교수') || msg.includes('교수')) {
    return {
      intent: 'get_student_profile',
      args: {},
      text: `학생 ${activeProfile.name} 님의 개인정보 및 지도교수 프로필 조회 결과입니다.`,
      data: activeProfile
    };
  }

  // 매칭되지 않는 일반 대화
  return {
    intent: null,
    args: null,
    text: `안녕하세요, 원광대학교 학사 정보 AI 안내원입니다. 성적 조회, 시간표 보기, 등록금 납부/환불 확인, 휴·복학 신청, 출결 확인, 강의계획서 조회 및 교내 서비스 바로가기 링크를 제공하고 있습니다. 궁금한 점을 편하게 질문해 주세요! \n(예시: "이번 학기 성적 어때?", "내일 시간표 보여줘", "휴학하고 싶어", "웹메일 링크 알려줘")`,
    data: null
  };
}

export async function POST(req: NextRequest) {
  try {
    const { message, studentData } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const activeProfile = studentData?.profile || mockDb.studentProfile;
    const activeGrades = studentData?.grades || mockDb.gradeHistory;
    const activeAttendance = studentData?.attendance || mockDb.attendanceData;
    const activeTuition = studentData?.tuition || mockDb.currentTuition;

    // 3. API Key가 설정되지 않은 경우 Fallback 모드로 즉각 응답 (로컬 데모 가능성)
    if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('your_api_key_here')) {
      const fallbackResult = handleFallbackIntent(message, studentData);
      return NextResponse.json({
        ...fallbackResult,
        isFallback: true,
        warning: '시스템에 GEMINI_API_KEY가 설정되지 않아, 규칙 기반 Fallback 모드로 대답합니다.'
      });
    }

    // 3-1. 동일 질문 캐시 확인 — 캐시가 있으면 모델 호출 없이 즉시 반환하여 요청 한도를 아낀다.
    const cacheKey = normalizeCacheKey(message);
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    // 4. API Key가 있을 때 Gemini API 호출
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    // 실제 학사 데이터베이스(모의 데이터)를 프롬프트에 함께 제공하여,
    // 모델이 의도만 분류하는 것이 아니라 "text" 답변 자체도 실제 데이터에 근거해
    // 정확하게 작성하도록 함. (API 호출을 1회로 유지하기 위해 별도의 2차 호출 대신
    // 이 방식을 사용 — 무료 티어 분당 요청 한도가 매우 낮기 때문)
    const studentDatabase = {
      studentProfile: activeProfile,
      academicRecords: mockDb.academicRecords,
      timetableData: mockDb.timetableData,
      syllabusData: mockDb.syllabusData,
      attendanceData: activeAttendance,
      officialLeaves: mockDb.officialLeaves,
      gradeHistory: activeGrades,
      currentTuition: activeTuition,
      refundRecords: mockDb.refundRecords,
      externalLinks: mockDb.externalLinks,
      professorDirectory: mockDb.professorDirectory,
      courseRegistrations: mockDb.courseRegistrations,
      enrollmentCreditLimit: mockDb.enrollmentCreditLimit,
      graduationRequirement: mockDb.graduationRequirement,
    };

    const systemPrompt = `당신은 원광대학교의 공식 학사정보 AI 어시스턴트입니다.
학생의 이름은 ${activeProfile.name}, 학과는 ${activeProfile.major}, 지도교수는 ${activeProfile.advisor}입니다.

아래는 ${activeProfile.name} 학생의 실제 학사 데이터베이스(JSON)입니다. "text" 답변을 작성할 때 반드시 이 데이터만 근거로 사용하고, 데이터에 없는 내용은 추측하지 마십시오.

학사 데이터베이스:
${JSON.stringify(studentDatabase)}

사용자의 질문을 분석하여 반드시 아래의 JSON 형식으로만 답변을 출력하십시오. 다른 인사말이나 설명 텍스트는 절대 포함하지 마십시오. 오직 유효한 JSON 문자열 하나만 반환해야 합니다. Markdown 코드 블록(\`\`\`json)은 포함해도 좋으나, 내부는 완벽한 JSON 구조여야 합니다.

응답 JSON 포맷 스키마:
{
  "intent": "get_student_profile" | "get_grades" | "get_timetable" | "get_attendance" | "get_tuition_and_refund" | "get_syllabus" | "request_academic_change" | "get_external_link" | "get_course_registration" | "get_professor_timetable" | null,
  "args": {
    "semester": "2025학년도 1학기" 등 (get_grades인 경우에만 설정, 없으면 생략),
    "grade": 1 등 (get_timetable인 경우에만 설정, 없으면 생략),
    "classification": "전필" 등 (get_timetable인 경우에만 설정, 없으면 생략),
    "subject": "알고리즘" 등 (get_syllabus인 경우에만 설정, 없으면 생략),
    "type": "leave" | "return" | "dropout" (request_academic_change인 경우에만 설정, 없으면 생략),
    "service_name": "웹메일" 등 (get_external_link인 경우에만 설정, 없으면 생략),
    "professor_name": "김민준" 등 (get_professor_timetable인 경우에만 설정, 없으면 생략)
  },
  "text": "사용자 질문에 대한 답변 (한국어, 아래 규칙 준수)"
}

의도(intent) 매핑 규칙:
- "get_student_profile": 내 정보, 프로필, 지도교수 조회
- "get_grades": 성적 단표, 평점, 학점 조회 (args.semester 선택 설정)
- "get_timetable": 컴퓨터공학과 개설 교과목 및 학과 시간표 조회 (args.grade 및 args.classification 선택 설정)
- "get_attendance": 출결, 지각, 결석, 공결 조회
- "get_tuition_and_refund": 등록금 고지서, 환불 신청 내역 조회
- "get_syllabus": 강의계획서 검색 (args.subject에 과목명 필수 설정)
- "request_academic_change": 휴학, 복학, 자퇴 신청 (args.type에 "leave", "return", "dropout" 중 필수 설정)
- "get_external_link": 웹메일, 수강신청, 증명발급, 봉황BBS 등 외부 링크 및 비밀번호 변경 (args.service_name에 해당 명칭 필수 설정)
- "get_course_registration": 이번 학기 수강신청 성공 내역, 신청 학점, 잔여 가능 학점 조회
- "get_professor_timetable": 특정 교수 시간표, 개설 강의 시간 및 요일, 강의실 조회 (args.professor_name에 교수 이름 필수 설정)

"text" 작성 규칙 (매우 중요):
- 반드시 위 학사 데이터베이스에 있는 사실만 사용하고, 데이터에 없는 내용은 추측하지 마십시오.
- 출결 데이터(attendanceData)의 'rate'는 출석률(%)을 의미합니다. 결석률이 아닙니다. 결석률은 (결석(absent) / 총시간(totalHours)) * 100 으로 따로 계산하여 답변해야 합니다. 출석률(rate)을 결석률로 잘못 대답하지 않도록 극도로 주의하십시오.
- 질문이 "~맞아?", "~있나요?", "~인가요?", "~아니죠?"처럼 참/거짓(예/아니오) 판정을 요구하는 질문일 때만, 반드시 "예," 또는 "아니오,"로 문장을 시작한 뒤 근거(과목명, 요일, 교시, 교수, 강의실, 금액, 상태 등 구체적 사실)를 간단히 덧붙이십시오. "확인해 보세요" 같은 회피성 답변은 금지합니다.
- 반대로 "몇", "누구", "어디", "언제", "무엇/뭐", "왜", "어떻게", "얼마"처럼 의문사가 포함되어 구체적인 정보(수량/이름/장소/시간/이유/방법 등)를 묻는 질문에는 "~요?"로 끝나더라도 예/아니오를 절대 붙이지 말고 바로 사실로만 답하십시오. 질문에 여러 개의 소질문이 섞여 있다면 그중 참/거짓 판정형인 부분에만 이 규칙을 적용하고, 의문사 질문 부분에는 적용하지 마십시오.
- 한국어의 예/아니오는 객관적 사실이 아니라 "질문자가 말한 내용이 맞는지"를 기준으로 답해야 합니다. "~없지?", "~아니죠?", "~안 했나요?"처럼 부정으로 묻는 질문에는 영어와 반대 극성이 됩니다 — 실제로 없는 게 맞다면 "예, 없습니다"로, 실제로는 있다면 "아니오, 있습니다"로 시작하십시오.
- 답변은 2~3문장 이내로 간결하게 작성하십시오.

사용자 질문: ${message}`;

    // 후보 모델을 순서대로 시도한다. 모델마다 무료 티어 한도가 별도로 집계되므로,
    // 하나가 429(한도 초과)여도 다음 모델은 대개 아직 여유가 있다.
    let result: any = null;
    let lastError: any = null;

    for (const modelName of GEMINI_MODEL_CANDIDATES) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName }, { apiVersion: 'v1' });
        const chat = model.startChat();
        result = await chat.sendMessage(systemPrompt);
        console.log(`Gemini 모델 "${modelName}"으로 응답 생성 성공`);
        break;
      } catch (apiError: any) {
        lastError = apiError;
        console.warn(`Gemini 모델 "${modelName}" 호출 실패, 다음 후보로 재시도:`, apiError?.message || apiError);
      }
    }

    if (!result) {
      // 모든 후보 모델이 실패한 경우에만 규칙 기반 Fallback으로 대체한다.
      console.error('모든 Gemini 모델 후보가 실패하여 규칙 기반 Fallback으로 전환:', lastError);
      const fallbackResult = handleFallbackIntent(message, studentData);
      const isQuotaError = lastError?.status === 429 || /quota|429/i.test(lastError?.message ?? '');
      const fallbackPayload = {
        ...fallbackResult,
        isFallback: true,
        warning: isQuotaError
          ? `시도한 모델(${GEMINI_MODEL_CANDIDATES.join(', ')}) 모두 요청 한도를 초과하여, 규칙 기반 Fallback 모드로 대답합니다. 잠시 후 다시 시도해 주세요.`
          : 'Gemini API 호출 중 오류가 발생하여, 규칙 기반 Fallback 모드로 대답합니다.'
      };
      return NextResponse.json(fallbackPayload);
    }

    const responseText = result.response.text().trim();

    // JSON 문자열 파싱 (Markdown 코드블록 제거)
    let jsonStr = responseText;
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/```$/, '').trim();
    }
    
    let parsed: { intent: string | null; args?: Record<string, any>; text: string };
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      console.warn("JSON parsing failed, raw text:", responseText);
      parsed = {
        intent: null,
        args: {},
        text: responseText
      };
    }

    const intent = parsed.intent;
    const args = parsed.args || {};
    let text = parsed.text || responseText;
    let data: any = null;

    if (intent) {
      switch (intent) {
        case 'get_student_profile':
          data = activeProfile;
          text = text || `${activeProfile.name} 님의 학생 프로필 정보입니다.`;
          break;
        case 'get_grades':
          {
            const sem = args.semester;
            if (sem) {
              data = activeGrades.find((g: any) => g.semesterName.includes(sem)) || activeGrades;
              text = text || `${activeProfile.name} 님의 ${sem} 성적 단표 내역입니다.`;
            } else {
              data = activeGrades;
              text = text || `${activeProfile.name} 님의 전체 성적 확인 리스트 및 이수 성적 요약입니다.`;
            }
          }
          break;
        case 'get_timetable':
          {
            const gradeParam = args.grade ? parseInt(args.grade, 10) : undefined;
            const classParam = args.classification;
            
            data = mockDb.timetableData.filter(t => {
              const matchGrade = !gradeParam || t.grade === gradeParam;
              const matchClass = !classParam || t.classification === classParam;
              return matchGrade && matchClass;
            });

            text = text || describeTimetable(message, gradeParam, classParam, data);
          }
          break;
        case 'get_attendance':
          data = {
            attendance: activeAttendance,
            officialLeaves: mockDb.officialLeaves
          };
          text = text || '전자출결 출결 정보 및 공결 신청 이력입니다.';
          break;
        case 'get_tuition_and_refund':
          data = {
            invoice: activeTuition,
            refunds: mockDb.refundRecords
          };
          text = text || '등록금 고지서 내역 및 등록금 환불 신청/내역 정보입니다.';
          break;
        case 'get_syllabus':
          {
            const subject = args.subject || '';
            const syllabus = mockDb.syllabusData.find(s => s.subject.includes(subject)) || mockDb.syllabusData[0];
            data = syllabus;
            text = text || `[${syllabus.subject}] 과목의 강의계획서 정보입니다.`;
          }
          break;
        case 'request_academic_change':
          {
            const type = args.type || 'leave';
            data = {
              type,
              records: mockDb.academicRecords.filter(r => r.type === type),
              profile: activeProfile
            };
            text = text || `요청하신 ${type === 'leave' ? '휴학' : type === 'return' ? '복학' : '자퇴'} 신청 안내 및 현황 정보입니다.`;
          }
          break;
        case 'get_external_link':
          {
            const name = args.service_name || '';
            // 매칭되는 링크 탐색
            const link = mockDb.externalLinks.find(l => l.name.includes(name) || l.category.includes(name)) || mockDb.externalLinks[0];
            data = link;
            text = text || `요청하신 [${link.name}] 서비스 연결 정보입니다. 아래 버튼을 클릭하여 이동하세요.`;
          }
          break;
        case 'get_course_registration':
          data = {
            registrations: mockDb.courseRegistrations,
            creditLimit: mockDb.enrollmentCreditLimit
          };
          text = text || '이번 학기 수강신청 내역 및 신청 가능 학점 정보입니다.';
          break;
        case 'get_professor_timetable':
          {
            const profName = args.professor_name || '';
            const matchedProf = mockDb.professorDirectory.find(p => p.name.includes(profName)) || mockDb.professorDirectory[0];
            data = {
              directory: mockDb.professorDirectory,
              schedule: mockDb.timetableData,
              selectedProfessor: matchedProf
            };
            text = text || `${matchedProf.name} 교수님의 담당 시간표 및 강의실 정보입니다.`;
          }
          break;
      }
    }

    const responsePayload = {
      intent,
      args,
      text,
      data,
      isFallback: false
    };
    setCached(cacheKey, responsePayload);

    return NextResponse.json(responsePayload);

  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({
      error: 'Internal Server Error',
      details: error.message,
      intent: null,
      text: '죄송합니다. AI 서비스 처리 중 예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
    }, { status: 500 });
  }
}
