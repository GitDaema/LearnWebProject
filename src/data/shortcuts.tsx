import type { ReactNode } from 'react';
import {
  CheckSquare, FileText, Award, Calendar, GraduationCap,
  User, BookOpen, Monitor, BarChart3, CreditCard, Globe,
} from 'lucide-react';

export interface ShortcutItem {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: ReactNode;
  bg: string;
}

export const ALL_SHORTCUTS: ShortcutItem[] = [
  // 기존 5개 — id/path/아이콘/색상 그대로 유지 (기존 사용자 화면 변화 없음)
  {
    id: 'attendance',
    title: '출결조회',
    description: '이번 학기 출석 현황',
    path: '/attendance',
    icon: <CheckSquare className="w-5 h-5 text-blue-500" />,
    bg: 'bg-blue-50'
  },
  {
    id: 'syllabus',
    title: '강의계획서조회',
    description: '강의 년도·학기별 계획서 조회',
    path: '/syllabus',
    icon: <FileText className="w-5 h-5 text-emerald-500" />,
    bg: 'bg-emerald-50'
  },
  {
    id: 'academic',
    title: '공결신청',
    description: '공식 사유 결석에 대한 출석 인정 신청',
    path: '/attendance',
    icon: <Award className="w-5 h-5 text-purple-500" />,
    bg: 'bg-purple-50'
  },
  {
    id: 'timetable',
    title: '학과별시간표',
    description: '학과별 강의 학년·학점·교수 확인',
    path: '/timetable',
    icon: <Calendar className="w-5 h-5 text-orange-500" />,
    bg: 'bg-orange-50'
  },
  {
    id: 'grades',
    title: '성적단표내역조회',
    description: '이번 학기 성적 내역',
    path: '/grades',
    icon: <GraduationCap className="w-5 h-5 text-indigo-500" />,
    bg: 'bg-indigo-50'
  },

  // 신규 — Sidebar.tsx의 MENU_GROUPS 내부 라우트(path 기반)에서 파생
  // (외부 href 항목은 제외: 앱 내에서 의도적으로 비활성화되어 있음)
  {
    id: 'profile',
    title: '개인정보관리',
    description: '내 인적사항 및 지도교수 정보 확인',
    path: '/profile',
    icon: <User className="w-5 h-5 text-sky-500" />,
    bg: 'bg-sky-50'
  },
  {
    id: 'academic-leave',
    title: '휴복학신청',
    description: '휴학·복학 신청 및 처리 현황',
    path: '/academic?type=leave',
    icon: <FileText className="w-5 h-5 text-rose-500" />,
    bg: 'bg-rose-50'
  },
  {
    id: 'academic-dropout',
    title: '자퇴신청',
    description: '자퇴 신청 및 처리 현황',
    path: '/academic?type=dropout',
    icon: <FileText className="w-5 h-5 text-amber-600" />,
    bg: 'bg-amber-50'
  },
  {
    id: 'timetable-professor',
    title: '교수시간표조회',
    description: '교수님별 강의 시간표 확인',
    path: '/timetable?type=professor',
    icon: <Calendar className="w-5 h-5 text-teal-500" />,
    bg: 'bg-teal-50'
  },
  {
    id: 'syllabus-enrollment',
    title: '수강신청조회',
    description: '금학기 수강신청 내역 확인',
    path: '/syllabus?view=enrollment',
    icon: <BookOpen className="w-5 h-5 text-cyan-500" />,
    bg: 'bg-cyan-50'
  },
  {
    id: 'syllabus-evaluation',
    title: '수업평가실시',
    description: '강의 만족도 및 수업평가 참여',
    path: '/syllabus?view=evaluation',
    icon: <BookOpen className="w-5 h-5 text-blue-500" />,
    bg: 'bg-blue-50'
  },
  {
    id: 'attendance-inquiry',
    title: '공결조회',
    description: '신청한 공결 처리 현황 조회',
    path: '/attendance',
    icon: <Monitor className="w-5 h-5 text-emerald-500" />,
    bg: 'bg-emerald-50'
  },
  {
    id: 'grades-completed',
    title: '이수과목확인리스트',
    description: '졸업 요건 충족 현황 자가진단',
    path: '/grades?view=completed',
    icon: <BarChart3 className="w-5 h-5 text-purple-500" />,
    bg: 'bg-purple-50'
  },
  {
    id: 'grades-all',
    title: '전체성적조회',
    description: '입학 이후 전체 학기 성적 조회',
    path: '/grades?view=all',
    icon: <BarChart3 className="w-5 h-5 text-orange-500" />,
    bg: 'bg-orange-50'
  },
  {
    id: 'tuition-invoice',
    title: '등록고지서',
    description: '이번 학기 등록금 고지서 확인',
    path: '/tuition?tab=invoice',
    icon: <CreditCard className="w-5 h-5 text-indigo-500" />,
    bg: 'bg-indigo-50'
  },
  {
    id: 'tuition-refund',
    title: '환불신청 및 내역',
    description: '등록금 환불 신청 및 처리 내역',
    path: '/tuition?tab=refund',
    icon: <CreditCard className="w-5 h-5 text-sky-500" />,
    bg: 'bg-sky-50'
  },
  {
    id: 'links',
    title: '외부연동서비스',
    description: '웹메일·수강신청 등 연동 서비스 모음',
    path: '/links',
    icon: <Globe className="w-5 h-5 text-rose-500" />,
    bg: 'bg-rose-50'
  },
];

export const DEFAULT_SHORTCUT_IDS: string[] = ['attendance', 'timetable', 'syllabus', 'grades'];

export const SHORTCUTS_STORAGE_KEY = 'wku-portal-shortcut-ids-v2';
