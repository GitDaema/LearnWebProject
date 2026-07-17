'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Bot, Send, Sparkles, AlertCircle, RefreshCw,
  User, GraduationCap, Calendar, CheckSquare, Award,
  CreditCard, FileText, Link as LinkIcon, Keyboard
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

const RECOMMENDED_PROMPTS = [
  { text: '내 성적 보여줘', icon: <Award className="w-3.5 h-3.5" /> },
  { text: '이번 학기 시간표 확인해줘', icon: <Calendar className="w-3.5 h-3.5" /> },
  { text: '지각이나 결석 현황이 어때?', icon: <CheckSquare className="w-3.5 h-3.5" /> },
  { text: '휴학 신청 양식 작성하고 싶어', icon: <GraduationCap className="w-3.5 h-3.5" /> },
  { text: '등록금 납부고지서 및 환불 내역 조회', icon: <CreditCard className="w-3.5 h-3.5" /> },
  { text: '알고리즘 강의계획서 보여줘', icon: <FileText className="w-3.5 h-3.5" /> },
  { text: '학교 웹메일 링크 알려줘', icon: <LinkIcon className="w-3.5 h-3.5" /> },
];

export default function HomeChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiKeyWarning, setApiKeyWarning] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // 첫 진입 시, 환영 메시지 추가 및 API Key 체크
  useEffect(() => {
    const hasKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!hasKey || hasKey === 'your_api_key_here') {
      setApiKeyWarning(true);
    }

    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: `안녕하세요, ${studentProfile.name} 학생! 봉황대학교 학사 정보 AI 지원 서비스입니다.\n성적 조회, 수강 시간표, 출결 현황, 등록금 수납 및 환불 신청 등 궁금하신 학사 정보를 자연어로 물어보시면 즉시 전용 UI 카드로 안내해 드리겠습니다.`,
        intent: 'get_student_profile',
        data: studentProfile
      }
    ]);
  }, []);

  // 메시지 추가 시 스크롤 하단 이동
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

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

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col gap-6 justify-between">

      {/* Chat Logs Timeline */}
      <div className="flex-grow space-y-6">

        {apiKeyWarning && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4.5 flex gap-3.5">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-amber-400">안내: GEMINI_API_KEY 설정 요망</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                현재 `.env.local` 파일에 Gemini API 키가 입력되어 있지 않습니다.
                시스템은 **로컬 룰베이스 Fallback 모드**로 자동 전환되었습니다.
                핵심 질의어(&quot;성적&quot;, &quot;시간표&quot;, &quot;휴학&quot;, &quot;출결&quot;, &quot;등록금&quot; 등)를 포함하여 자연어로 질문하시면 키 입력 없이도 모든 기능과 아름다운 카드 컴포넌트를 테스트해 볼 수 있습니다.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col gap-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Message Bubble wrapper */}
            <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

              {/* Sender Avatar */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow ${
                msg.sender === 'user' ? 'bg-slate-800 text-indigo-400 border border-slate-700/50' : 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble Content */}
              <div>
                <div className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm whitespace-pre-wrap leading-relaxed border ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600/15 text-indigo-100 border-indigo-500/20 rounded-tr-none'
                    : 'bg-slate-900/60 backdrop-blur-md text-slate-100 border-slate-800/80 rounded-tl-none'
                }`}>
                  {msg.text}
                  {msg.isFallback && (
                    <span className="block mt-2 text-[10px] text-amber-400 font-bold bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                      ⚡ 규칙 기반 로컬 분석 결과 노출
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Render Custom UI Cards for AI outputs */}
            {msg.sender === 'ai' && msg.intent && (
              <div className="w-full pl-0 sm:pl-11 mt-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {renderCardComponent(msg.intent, msg.data)}
              </div>
            )}
          </div>
        ))}

        {/* Chat Loading Skeleton */}
        {loading && (
          <div className="flex gap-3 items-start max-w-[80%]">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="space-y-2">
              <div className="bg-slate-900/40 border border-slate-800/50 px-4 py-3 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                AI가 학생 정보를 조회하고 적절한 카드를 렌더링하는 중입니다...
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* AI Prompt Input Bar (Bottom Sticky) */}
      <div className="sticky bottom-0 z-20 bg-slate-950/10 backdrop-blur-sm pt-4 pb-2">
        <div className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-2xl p-3.5 shadow-2xl relative">

          {/* Recommended chips */}
          {messages.length <= 1 && !loading && (
            <div className="mb-3.5">
              <div className="text-[10px] text-slate-500 font-bold mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                추천 질문으로 시작해보세요:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {RECOMMENDED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.text}
                    onClick={() => handleSendMessage(prompt.text)}
                    className="bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-850 hover:border-indigo-500/20 px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-97 cursor-pointer"
                  >
                    {prompt.icon}
                    {prompt.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Real Input Form */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
            className="flex items-center gap-2.5"
          >
            <div className="flex-1 bg-slate-950 rounded-xl px-3.5 py-2.5 border border-slate-850 focus-within:border-indigo-500/50 transition-all flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="여기에 학사 정보 질문을 입력하세요... (예: 내 시간표 보여줘)"
                className="bg-transparent flex-1 outline-none border-none text-slate-200 text-xs sm:text-sm placeholder-slate-600 focus:ring-0"
                disabled={loading}
              />
              <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-600 border border-slate-800/80 px-1.5 py-0.5 rounded font-mono select-none">
                <Keyboard className="w-3 h-3" />
                <span>Enter</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 disabled:from-slate-800 disabled:to-slate-800 text-white disabled:text-slate-500 flex items-center justify-center flex-shrink-0 transition-all active:scale-95 shadow-lg shadow-indigo-900/10 cursor-pointer"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>
        </div>

        <div className="text-[10px] text-center text-slate-600 mt-2 flex items-center justify-center gap-1 select-none">
          <Bot className="w-3 h-3" />
          <span>University Web Information Service powered by Google Gemini. Built with Tailwind CSS.</span>
        </div>
      </div>

    </div>
  );
}
