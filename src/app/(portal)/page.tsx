'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Bot, Send, Sparkles, AlertCircle, RefreshCw, RotateCcw,
  User, GraduationCap, Calendar, CheckSquare, Award,
  CreditCard, FileText, Link as LinkIcon, Keyboard, Plus
} from 'lucide-react';

// UI Cards Import
import ProfileCard from '@/components/cards/ProfileCard';
import GradeCard from '@/components/cards/GradeCard';
import TimetableCard from '@/components/cards/TimetableCard';
import AttendanceCard from '@/components/cards/AttendanceCard';
import AcademicCard from '@/components/cards/AcademicCard';
import TuitionCard from '@/components/cards/TuitionCard';
import SyllabusCard from '@/components/cards/SyllabusCard';
import LinkCard from '@/components/cards/LinkCard';

import { studentProfile } from '@/data/mockData';

// 대화 아이템 타입 정의
interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  intent?: string | null;
  data?: any;
  isFallback?: boolean;
}

const SHORTCUT_CARDS = [
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
  }
];

const RECOMMENDED_PROMPTS = [
  { text: '내 성적 보여줘', icon: <Award className="w-3.5 h-3.5" /> },
  { text: '이번 학기 시간표 확인해줘', icon: <Calendar className="w-3.5 h-3.5" /> },
  { text: '지각이나 결석 현황이 어때?', icon: <CheckSquare className="w-3.5 h-3.5" /> },
  { text: '등록금 고지서 조회해줘', icon: <CreditCard className="w-3.5 h-3.5" /> },
];

export default function HomeChat() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiKeyWarning, setApiKeyWarning] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // 첫 진입 시, 환영 메시지 추가 및 API Key 체크
  useEffect(() => {
    const hasKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!hasKey || hasKey === 'your_api_key_here') {
      setApiKeyWarning(true);
    }

    setMessages([]);
  }, []);

  const handleResetChat = () => {
    setHasStartedChat(false);
    setMessages([]);
  };

  useEffect(() => {
    const handleResetEvent = () => {
      handleResetChat();
    };
    window.addEventListener('reset-chat', handleResetEvent);
    return () => {
      window.removeEventListener('reset-chat', handleResetEvent);
    };
  }, []);

  // 메시지 추가 시 스크롤 하단 이동
  useEffect(() => {
    if (hasStartedChat) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, hasStartedChat]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    if (!hasStartedChat) {
      setHasStartedChat(true);
    }

    const userMessageId = `msg-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      const data = await response.json();

      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.text,
        intent: data.intent,
        data: data.data,
        isFallback: data.isFallback
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: '죄송합니다. 네트워크 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        intent: null
      }]);
    } finally {
      setLoading(false);
    }
  };

  const renderCardComponent = (intent: string | null | undefined, data: any) => {
    if (!intent || !data) return null;

    switch (intent) {
      case 'get_student_profile':
        return <ProfileCard data={data} />;
      case 'get_grades':
        return <GradeCard data={data} />;
      case 'get_timetable':
        return <TimetableCard data={data} />;
      case 'get_attendance':
        return <AttendanceCard data={data} />;
      case 'request_academic_change':
        return <AcademicCard data={data} />;
      case 'get_tuition_and_refund':
        return <TuitionCard data={data} />;
      case 'get_syllabus':
        return <SyllabusCard data={data} />;
      case 'get_external_link':
        return <LinkCard data={data} />;
      default:
        return null;
    }
  };

  // 1. 대화 시작 전 초기 대시보드 뷰 (Figma 이미지 완벽 대응)
  if (!hasStartedChat) {
    return (
      <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col justify-center px-2 py-4 sm:py-8">
        
        {apiKeyWarning && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3.5 mb-6 text-slate-700 shadow-sm">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-amber-800">안내: GEMINI_API_KEY 미설정 데모 모드</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                현재 API 키가 입력되어 있지 않아 **로컬 규칙 기반 분석 모드**로 구동 중입니다.
                아래 바로가기 카드나 &quot;성적&quot;, &quot;시간표&quot;, &quot;출결&quot; 등의 검색어로 테스트 가능합니다.
              </p>
            </div>
          </div>
        )}

        {/* 1. 메인 환영 타이틀 */}
        <div className="flex flex-col items-start mb-8 select-none">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            안녕하세요, {studentProfile.name}님 —
          </h1>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight leading-tight mt-1.5">
            오늘도 좋은 하루 되세요.
          </h1>
        </div>

        {/* 2. Figma 스타일의 둥근 질문 검색창 */}
        <div className="mb-12">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
            className="flex items-center bg-white rounded-full p-2 border border-slate-200/50 shadow-xl shadow-indigo-100/30 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all"
          >
            <div className="flex-1 px-4 py-2 flex items-center gap-3">
              {/* 왼쪽 스파클 AI 배지 */}
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="이번 학기 성적을 확인하고 싶어"
                className="bg-transparent flex-1 outline-none border-none text-slate-800 text-sm sm:text-base placeholder-slate-400 font-medium"
              />
            </div>
            {/* 전송 버튼 */}
            <button
              type="submit"
              disabled={!input.trim() && !input}
              onClick={() => { if(!input.trim()) handleSendMessage('이번 학기 성적을 확인하고 싶어'); }}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 transition-all active:scale-95 shadow-md hover:shadow-indigo-500/20 hover:brightness-105 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* 3. 나의 바로가기 섹션 */}
        <div>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-base font-bold text-slate-800">나의 바로가기</h2>
            <button className="bg-[#f1f3f9] hover:bg-[#e2e8f0] text-blue-600 font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1 border border-slate-200/40 transition-all active:scale-97 select-none">
              <Plus className="w-3.5 h-3.5" />
              추가/관리
            </button>
          </div>

          {/* 5개 바로가기 카드 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {SHORTCUT_CARDS.map((card) => (
              <button
                key={card.id}
                onClick={() => router.push(card.path)}
                className="text-left bg-white p-5 rounded-2xl shadow-sm border border-slate-200/30 hover:border-indigo-500/20 shadow-slate-100 hover:shadow-md hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between h-[135px]"
              >
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-850 text-sm sm:text-[15px] group-hover:text-indigo-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {card.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // 2. 대화가 진행 중일 때의 채팅 스레드 뷰
  return (
    <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col gap-5 justify-between min-h-0">
      
      {/* Chat Thread Header / Reset Toolbar */}
      <div className="flex justify-between items-center bg-white border border-slate-200/60 p-3 px-4.5 rounded-2xl shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          <span className="text-xs font-bold text-slate-850">AI 비서와 대화 중</span>
        </div>
        <button
          onClick={handleResetChat}
          className="text-[11px] font-bold text-slate-550 hover:text-indigo-650 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-150 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          대시보드로 복귀 (대화 초기화)
        </button>
      </div>

      {/* Chat Logs Timeline */}
      <div className="flex-grow space-y-6 overflow-y-auto pb-4 pr-1 scrollbar-thin scrollbar-thumb-slate-200">
        
        {apiKeyWarning && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-slate-700">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-650 leading-relaxed">
              로컬 임시 구동 중입니다. 성적, 시간표, 출결 등의 키워드로 질문을 지속해 주세요.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col gap-2.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Message Bubble wrapper */}
            <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

              {/* Sender Avatar */}
              <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-slate-100 text-slate-600 border border-slate-200' 
                  : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble Content */}
              <div>
                <div className={`px-4.5 py-3 rounded-2xl text-xs sm:text-[13.5px] whitespace-pre-wrap leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none border-none'
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/50 shadow-slate-100/60'
                }`}>
                  {msg.text}
                  {msg.isFallback && (
                    <span className="block mt-2 text-[9px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      ⚡ 규칙 기반 로컬 분석 결과 노출
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Render Custom UI Cards for AI outputs */}
            {msg.sender === 'ai' && msg.intent && (
              <div className="w-full pl-0 sm:pl-11.5 mt-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {renderCardComponent(msg.intent, msg.data)}
              </div>
            )}
          </div>
        ))}

        {/* Chat Loading Skeleton */}
        {loading && (
          <div className="flex gap-3 items-start max-w-[80%]">
            <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="space-y-2">
              <div className="bg-white border border-slate-200/60 shadow-sm px-4.5 py-3 rounded-2xl rounded-tl-none text-xs text-slate-500 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
                AI가 학사 정보를 조회하고 전용 화면을 생성하고 있습니다...
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* AI Prompt Input Bar (Bottom Sticky) */}
      <div className="sticky bottom-0 z-20 bg-transparent pt-3 pb-1.5">
        
        {/* Recommended chips on top of input */}
        {!loading && (
          <div className="flex flex-wrap gap-1.5 mb-3 px-1">
            {RECOMMENDED_PROMPTS.map((prompt) => (
              <button
                key={prompt.text}
                onClick={() => handleSendMessage(prompt.text)}
                className="bg-white hover:bg-slate-50 text-slate-600 hover:text-indigo-600 border border-slate-200 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-97 cursor-pointer shadow-sm shadow-slate-100"
              >
                {prompt.icon}
                {prompt.text}
              </button>
            ))}
          </div>
        )}

        <div className="bg-white border border-slate-200/60 rounded-3xl p-2.5 shadow-xl shadow-slate-100 relative">
          {/* Real Input Form */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
            className="flex items-center gap-2"
          >
            <div className="flex-1 bg-slate-50 rounded-2xl px-4 py-2.5 border border-slate-200/40 focus-within:border-indigo-400 focus-within:bg-white transition-all flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="여기에 추가 학사 질문을 입력하세요..."
                className="bg-transparent flex-1 outline-none border-none text-slate-800 text-xs sm:text-sm placeholder-slate-400 font-medium"
                disabled={loading}
              />
              <div className="hidden sm:flex items-center gap-1 text-[9px] text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded font-mono select-none bg-white">
                <Keyboard className="w-3 h-3" />
                <span>Enter</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white disabled:from-slate-100 disabled:to-slate-100 disabled:text-slate-400 flex items-center justify-center flex-shrink-0 transition-all active:scale-95 shadow-md hover:shadow-indigo-500/10 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="text-[9.5px] text-center text-slate-400 mt-2.5 flex items-center justify-center gap-1 select-none">
          <Bot className="w-3 h-3 text-slate-400" />
          <span>원광대학교 웹정보서비스 AI 챗봇. Powered by Gemini API & Tailwind CSS.</span>
        </div>
      </div>

    </div>
  );
}
