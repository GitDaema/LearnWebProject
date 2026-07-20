'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import {
  StudentProfile, SemesterGrade, AttendanceItem, TuitionInvoice,
  studentProfile as defaultProfile, gradeHistory as defaultGrades,
  attendanceData as defaultAttendance, currentTuition as defaultTuition
} from '@/data/mockData';

// 학생 템플릿 데이터 정의
export interface StudentData {
  profile: StudentProfile;
  grades: SemesterGrade[];
  attendance: AttendanceItem[];
  tuition: TuitionInvoice;
}

// 1. 김수석 (짝수 아이디)
const suseokData: StudentData = {
  profile: {
    name: '김수석',
    studentId: '20240001',
    major: '컴퓨터공학과',
    grade: 4,
    semester: 1,
    advisor: '김민준',
    status: '재학',
    email: 'suseok.kim@univ.ac.kr',
    phone: '010-1234-5678',
  },
  grades: [
    {
      semesterName: '2025학년도 1학기',
      gpa: 4.50,
      acquiredCredits: 18,
      courses: [
        { code: 'CS201', subject: '자료구조', type: '전공필수', credits: 3, grade: 'A+', score: 4.5 },
        { code: 'CS203', subject: '컴퓨터구조', type: '전공필수', credits: 3, grade: 'A+', score: 4.5 },
        { code: 'CS205', subject: '이산수학', type: '전공선택', credits: 3, grade: 'A+', score: 4.5 },
        { code: 'MATH101', subject: '선형대수학', type: '교양필수', credits: 3, grade: 'A+', score: 4.5 },
        { code: 'ENG201', subject: '대학실용영어', type: '교양필수', credits: 3, grade: 'A+', score: 4.5 },
        { code: 'CS208', subject: '객체지향프로그래밍', type: '전공필수', credits: 3, grade: 'A+', score: 4.5 },
      ],
    },
    {
      semesterName: '2025학년도 2학기',
      gpa: 4.50,
      acquiredCredits: 18,
      courses: [
        { code: 'CS251', subject: '운영체제', type: '전공필수', credits: 3, grade: 'A+', score: 4.5 },
        { code: 'CS253', subject: '소프트웨어공학', type: '전공필수', credits: 3, grade: 'A+', score: 4.5 },
        { code: 'CS255', subject: '시스템프로그래밍', type: '전공선택', credits: 3, grade: 'A+', score: 4.5 },
        { code: 'CS258', subject: '프로그래밍언어론', type: '전공선택', credits: 3, grade: 'A+', score: 4.5 },
        { code: 'MATH202', subject: '확률및통계', type: '교양필수', credits: 3, grade: 'A+', score: 4.5 },
        { code: 'CS260', subject: '창의융합설계', type: '전공필수', credits: 3, grade: 'A+', score: 4.5 },
      ],
    },
  ],
  attendance: [
    { subject: '알고리즘', totalHours: 30, attended: 30, late: 0, absent: 0, excused: 0, rate: 100 },
    { subject: '웹프로그래밍', totalHours: 45, attended: 45, late: 0, absent: 0, excused: 0, rate: 100 },
    { subject: '인공지능개론', totalHours: 30, attended: 30, late: 0, absent: 0, excused: 0, rate: 100 },
    { subject: '컴퓨터네트워크', totalHours: 30, attended: 30, late: 0, absent: 0, excused: 0, rate: 100 },
    { subject: '데이터베이스', totalHours: 45, attended: 45, late: 0, absent: 0, excused: 0, rate: 100 },
  ],
  tuition: {
    semesterName: '2026학년도 1학기',
    tuitionFee: 4250000,
    entranceFee: 0,
    scholarship: 3000000, // 성적 장학금 300만원
    netAmount: 1250000,
    bankName: '국민은행',
    accountNumber: '942010-24-104200 (예금주: 원광대학교)',
    status: '납부완료',
    paymentDate: '2026-02-20',
  }
};

// 2. 나불참 (홀수 아이디)
const bulchamData: StudentData = {
  profile: {
    name: '나불참',
    studentId: '20240002',
    major: '컴퓨터공학과',
    grade: 2,
    semester: 1,
    advisor: '최지훈',
    status: '재학',
    email: 'bulcham.na@univ.ac.kr',
    phone: '010-9876-5432',
  },
  grades: [
    {
      semesterName: '2025학년도 1학기',
      gpa: 1.85,
      acquiredCredits: 12, // 취득학점 저조 (F과목 제외)
      courses: [
        { code: 'CS201', subject: '자료구조', type: '전공필수', credits: 3, grade: 'D+', score: 1.5 },
        { code: 'CS203', subject: '컴퓨터구조', type: '전공필수', credits: 3, grade: 'C0', score: 2.0 },
        { code: 'CS205', subject: '이산수학', type: '전공선택', credits: 3, grade: 'F', score: 0 },
        { code: 'MATH101', subject: '선형대수학', type: '교양필수', credits: 3, grade: 'C+', score: 2.5 },
        { code: 'ENG201', subject: '대학실용영어', type: '교양필수', credits: 3, grade: 'F', score: 0 },
        { code: 'CS208', subject: '객체지향프로그래밍', type: '전공필수', credits: 3, grade: 'D0', score: 1.0 },
      ],
    },
    {
      semesterName: '2025학년도 2학기',
      gpa: 1.58,
      acquiredCredits: 9,
      courses: [
        { code: 'CS251', subject: '운영체제', type: '전공필수', credits: 3, grade: 'C0', score: 2.0 },
        { code: 'CS253', subject: '소프트웨어공학', type: '전공필수', credits: 3, grade: 'F', score: 0 },
        { code: 'CS255', subject: '시스템프로그래밍', type: '전공선택', credits: 3, grade: 'D+', score: 1.5 },
        { code: 'CS258', subject: '프로그래밍언어론', type: '전공선택', credits: 3, grade: 'D0', score: 1.0 },
        { code: 'MATH202', subject: '확률및통계', type: '교양필수', credits: 3, grade: 'C+', score: 2.5 },
        { code: 'CS260', subject: '창의융합설계', type: '전공필수', credits: 3, grade: 'F', score: 0 },
      ],
    },
  ],
  attendance: [
    { subject: '알고리즘', totalHours: 30, attended: 18, late: 4, absent: 8, excused: 0, rate: 60.0 },
    { subject: '웹프로그래밍', totalHours: 45, attended: 30, late: 5, absent: 10, excused: 0, rate: 66.7 },
    { subject: '인공지능개론', totalHours: 30, attended: 20, late: 3, absent: 7, excused: 0, rate: 66.7 },
    { subject: '컴퓨터네트워크', totalHours: 30, attended: 19, late: 4, absent: 7, excused: 0, rate: 63.3 },
    { subject: '데이터베이스', totalHours: 45, attended: 31, late: 6, absent: 8, excused: 0, rate: 68.9 },
  ],
  tuition: {
    semesterName: '2026학년도 1학기',
    tuitionFee: 4250000,
    entranceFee: 0,
    scholarship: 0, // 장학금 없음
    netAmount: 4250000,
    bankName: '국민은행',
    accountNumber: '942010-24-104200 (예금주: 원광대학교)',
    status: '납부완료',
    paymentDate: '2026-02-21',
  }
};

// 3. 이평범 (기타 기본)
const pyeongbeomData: StudentData = {
  profile: {
    name: '이평범',
    studentId: '20240003',
    major: '컴퓨터공학과',
    grade: 3,
    semester: 1,
    advisor: '김철수',
    status: '재학',
    email: 'pyeongbeom.lee@univ.ac.kr',
    phone: '010-5555-5555',
  },
  grades: [
    {
      semesterName: '2025학년도 1학기',
      gpa: 3.20,
      acquiredCredits: 18,
      courses: [
        { code: 'CS201', subject: '자료구조', type: '전공필수', credits: 3, grade: 'B0', score: 3.0 },
        { code: 'CS203', subject: '컴퓨터구조', type: '전공필수', credits: 3, grade: 'B+', score: 3.5 },
        { code: 'CS205', subject: '이산수학', type: '전공선택', credits: 3, grade: 'C+', score: 2.5 },
        { code: 'MATH101', subject: '선형대수학', type: '교양필수', credits: 3, grade: 'A0', score: 4.0 },
        { code: 'ENG201', subject: '대학실용영어', type: '교양필수', credits: 3, grade: 'B0', score: 3.0 },
        { code: 'CS208', subject: '객체지향프로그래밍', type: '전공필수', credits: 3, grade: 'B+', score: 3.5 },
      ],
    },
    {
      semesterName: '2025학년도 2학기',
      gpa: 3.45,
      acquiredCredits: 18,
      courses: [
        { code: 'CS251', subject: '운영체제', type: '전공필수', credits: 3, grade: 'B+', score: 3.5 },
        { code: 'CS253', subject: '소프트웨어공학', type: '전공필수', credits: 3, grade: 'A0', score: 4.0 },
        { code: 'CS255', subject: '시스템프로그래밍', type: '전공선택', credits: 3, grade: 'B0', score: 3.0 },
        { code: 'CS258', subject: '프로그래밍언어론', type: '전공선택', credits: 3, grade: 'B+', score: 3.5 },
        { code: 'MATH202', subject: '확률및통계', type: '교양필수', credits: 3, grade: 'A0', score: 4.0 },
        { code: 'CS260', subject: '창의융합설계', type: '전공필수', credits: 3, grade: 'C+', score: 2.5 },
      ],
    },
  ],
  attendance: [
    { subject: '알고리즘', totalHours: 30, attended: 27, late: 2, absent: 1, excused: 0, rate: 90.0 },
    { subject: '웹프로그래밍', totalHours: 45, attended: 43, late: 1, absent: 1, excused: 0, rate: 95.6 },
    { subject: '인공지능개론', totalHours: 30, attended: 28, late: 1, absent: 1, excused: 0, rate: 93.3 },
    { subject: '컴퓨터네트워크', totalHours: 30, attended: 27, late: 2, absent: 1, excused: 0, rate: 90.0 },
    { subject: '데이터베이스', totalHours: 45, attended: 41, late: 2, absent: 2, excused: 0, rate: 91.1 },
  ],
  tuition: {
    semesterName: '2026학년도 1학기',
    tuitionFee: 4250000,
    entranceFee: 0,
    scholarship: 1500000, // 국가장학금 150만원
    netAmount: 2750000,
    bankName: '국민은행',
    accountNumber: '942010-24-104200 (예금주: 원광대학교)',
    status: '납부완료',
    paymentDate: '2026-02-21',
  }
};

export interface User {
  id: string;
  name: string;
  studentType: 'A' | 'B' | 'C'; // A: 김수석, B: 나불참, C: 이평범
  studentId: string;
}

interface AuthContextType {
  currentUser: User | null;
  studentData: StudentData;
  isLoading: boolean;
  login: (id: string, pw: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  signup: (id: string, pw: string, name: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. 초기 세션 로드 및 사용자 정보 복원
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userMetadata = session.user.user_metadata;
          const email = session.user.email || '';
          const id = email.split('@')[0];
          setCurrentUser({
            id: id,
            name: userMetadata?.name || '',
            studentType: userMetadata?.studentType || 'C',
            studentId: userMetadata?.studentId || '20240003',
          });
        }
      } catch (e) {
        console.error('Failed to initialize session:', e);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // 2. 세션 변화 감지 리스너 등록
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userMetadata = session.user.user_metadata;
          const email = session.user.email || '';
          const id = email.split('@')[0];
          setCurrentUser({
            id: id,
            name: userMetadata?.name || '',
            studentType: userMetadata?.studentType || 'C',
            studentId: userMetadata?.studentId || '20240003',
          });
        } else {
          setCurrentUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (id: string, pw: string) => {
    const trimmedId = id.trim().toLowerCase();
    const email = `${trimmedId}@gitdaema.univ`;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pw,
    });

    if (error) {
      let errorMsg = error.message;
      if (error.message.includes('Invalid login credentials')) {
        errorMsg = '아이디 또는 비밀번호가 일치하지 않습니다.';
      }
      return { success: false, error: errorMsg };
    }

    if (data?.user) {
      const userMetadata = data.user.user_metadata;
      setCurrentUser({
        id: trimmedId,
        name: userMetadata?.name || '',
        studentType: userMetadata?.studentType || 'C',
        studentId: userMetadata?.studentId || '20240003',
      });
    }

    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    router.push('/');
  };

  const signup = async (id: string, pw: string, name: string) => {
    const trimmedId = id.trim().toLowerCase();
    const email = `${trimmedId}@gitdaema.univ`;

    // 아이디 유효성 검사 (영문+숫자 혼용, 6~12자)
    const idRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/;
    if (!idRegex.test(trimmedId)) {
      return { success: false, error: '아이디는 영문과 숫자를 조합하여 6~12자여야 합니다.' };
    }

    // 비밀번호 유효성 검사 (영문+숫자+특수문자 혼용, 8자 이상)
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!pwRegex.test(pw)) {
      return { success: false, error: '비밀번호는 영문, 숫자, 특수문자를 혼용하여 8자 이상이어야 합니다.' };
    }

    if (!name.trim()) {
      return { success: false, error: '이름을 입력해주세요.' };
    }

    // 첫 번째 숫자 홀짝 분석하여 학생 타입 판별
    const digitMatch = trimmedId.match(/\d/);
    let studentType: 'A' | 'B' | 'C' = 'C';
    let studentId = '20240003';

    if (digitMatch) {
      const firstDigit = parseInt(digitMatch[0], 10);
      if (firstDigit % 2 === 0) {
        studentType = 'A'; // 짝수: 김수석
        studentId = '20240001';
      } else {
        studentType = 'B'; // 홀수: 나불참
        studentId = '20240002';
      }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: pw,
      options: {
        data: {
          name: name.trim(),
          studentType,
          studentId,
        },
      },
    });

    if (error) {
      let errorMsg = error.message;
      if (error.message.includes('User already registered')) {
        errorMsg = '이미 존재하는 아이디입니다.';
      }
      return { success: false, error: errorMsg };
    }

    if (data?.user) {
      setCurrentUser({
        id: trimmedId,
        name: name.trim(),
        studentType,
        studentId,
      });
    }

    return { success: true };
  };

  // 현재 로그인된 사용자에 대응되는 학생 상세 정보 반환
  const getStudentData = (): StudentData => {
    if (!currentUser) {
      return {
        profile: defaultProfile,
        grades: defaultGrades,
        attendance: defaultAttendance,
        tuition: defaultTuition
      };
    }

    switch (currentUser.studentType) {
      case 'A':
        return suseokData;
      case 'B':
        return bulchamData;
      case 'C':
      default:
        return pyeongbeomData;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, studentData: getStudentData(), isLoading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
