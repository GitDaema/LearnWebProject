'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Bot, KeyRound, User, Lock, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LoginScreen() {
  const { login, signup } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setId('');
    setPw('');
    setName('');
    setError('');
    setSuccess('');
  };

  // 실시간 유효성 검증 정규식 규칙
  const isIdEmpty = id.trim() === '';
  const isPwEmpty = pw.trim() === '';
  const isNameEmpty = !isLoginTab && name.trim() === '';

  const idRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/;
  const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  // 로그인 탭일 때는 단순 빈 값 여부만 체크, 회원가입 탭일 때는 정규식 엄격 체크
  const isIdValid = isLoginTab ? !isIdEmpty : idRegex.test(id.trim().toLowerCase());
  const isPwValid = isLoginTab ? !isPwEmpty : pwRegex.test(pw);
  const isNameValid = !isNameEmpty;

  // 에러 메시지 실시간 산출 (회원가입 탭에서만 동작하며 라벨 우측 가독성을 위해 10px 크기에 최적화)
  const idErrorMsg = !isLoginTab && !isIdEmpty && !isIdValid
    ? '영문+숫자 조합 6~12자 필수'
    : '';

  const pwErrorMsg = !isLoginTab && !isPwEmpty && !isPwValid
    ? '영문+숫자+특문 조합 8자 이상 필수'
    : '';

  // 전체 폼 유효성 체크
  const isFormValid = isLoginTab
    ? (!isIdEmpty && isIdValid && !isPwEmpty && isPwValid)
    : (!isIdEmpty && isIdValid && !isPwEmpty && isPwValid && isNameValid);

  // 인풋 상태별 테두리 스타일 지정 함수
  const getIdInputClass = () => {
    if (isIdEmpty) return 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500';
    if (!isIdValid) return 'border-red-500 focus:border-red-500 focus:ring-red-500/20';
    return 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20 bg-emerald-50/5';
  };

  const getPwInputClass = () => {
    if (isPwEmpty) return 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500';
    if (!isPwValid) return 'border-red-500 focus:border-red-500 focus:ring-red-500/20';
    return 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20 bg-emerald-50/5';
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setError('');
    const result = login(id, pw);
    if (!result.success) {
      setError(result.error || '로그인에 실패했습니다.');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setError('');
    setSuccess('');

    const result = signup(id, pw, name);
    if (result.success) {
      setSuccess('회원가입이 완료되었습니다! 자동으로 로그인합니다.');
    } else {
      setError(result.error || '회원가입에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-md w-full space-y-8 bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-slate-200/80 shadow-xl transition-all">
        {/* LOGO */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-white flex items-center justify-center border border-slate-200/60 p-1 shadow-md shadow-indigo-100/40 animate-bounce-subtle">
            <img src="/wku-logo.png" alt="WKU Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-900">
            원광대학교 통합학사포털
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 font-medium">
            AI Prompt Bar 기반의 지능형 대학 웹정보 서비스
          </p>
        </div>

        {/* TAB SWITCH */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50">
          <button
            onClick={() => { setIsLoginTab(true); resetForm(); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isLoginTab 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => { setIsLoginTab(false); resetForm(); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              !isLoginTab 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            학생 회원가입
          </button>
        </div>

        {/* ERROR / SUCCESS ALERTS */}
        {error && (
          <div className="flex items-start gap-2 bg-red-50 text-red-600 border border-red-200 p-3.5 rounded-2xl text-xs font-bold animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-start gap-2 bg-emerald-50 text-emerald-600 border border-emerald-200 p-3.5 rounded-2xl text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* FORM */}
        <form className="mt-6 space-y-4" onSubmit={isLoginTab ? handleLoginSubmit : handleSignupSubmit}>
          {!isLoginTab && (
            <div className="space-y-1">
              <label htmlFor="name" className="text-[11px] font-bold text-slate-650">이름</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="실명을 입력하세요"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white/50 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="id" className="text-[11px] font-bold text-slate-650 flex justify-between items-center">
              <span>아이디</span>
              {!isLoginTab && (
                idErrorMsg ? (
                  <span className="text-red-500 font-extrabold text-[10px] flex items-center gap-0.5 animate-pulse">
                    <AlertCircle className="w-3 h-3" />
                    {idErrorMsg}
                  </span>
                ) : (
                  <span className="text-indigo-500 font-semibold text-[10px]">(영문+숫자 6~12자)</span>
                )
              )}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                id="id"
                type="text"
                required
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="아이디를 입력하세요"
                className={`w-full pl-10 pr-4 py-3 rounded-2xl border bg-white/50 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all ${getIdInputClass()}`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-[11px] font-bold text-slate-650 flex justify-between items-center">
              <span>비밀번호</span>
              {!isLoginTab && (
                pwErrorMsg ? (
                  <span className="text-red-500 font-extrabold text-[10px] flex items-center gap-0.5 animate-pulse">
                    <AlertCircle className="w-3 h-3" />
                    {pwErrorMsg}
                  </span>
                ) : (
                  <span className="text-indigo-500 font-semibold text-[10px]">(영문+숫자+특수문자 8자 이상)</span>
                )
              )}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="password"
                type="password"
                required
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className={`w-full pl-10 pr-4 py-3 rounded-2xl border bg-white/50 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all ${getPwInputClass()}`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-6 active:scale-[0.98] ${
              isFormValid
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100 hover:shadow-lg cursor-pointer'
                : 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            {isLoginTab ? '로그인하기' : '학생 등록 및 가입 완료'}
          </button>
        </form>

        {/* TEST GUIDE ALERT */}
        <div className="bg-[#f8fafc] border border-slate-200 p-4.5 rounded-2xl space-y-2 shadow-inner">
          <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            AI 챗봇 테스트를 위한 학사 템플릿 안내
          </h4>
          <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
            회원가입 시 입력하는 아이디의 **첫 번째 숫자**에 따라 AI가 조회할 학사 정보 템플릿이 자동으로 결정됩니다.
          </p>
          <ul className="text-[10px] space-y-1 text-slate-600 font-semibold pl-1.5">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span>아이디의 첫 숫자가 <strong className="text-blue-600">짝수</strong> (예: std2) ➡️ <strong className="text-slate-800">김수석 (수석 학생, 평점 4.5)</strong></span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              <span>아이디의 첫 숫자가 <strong className="text-red-600">홀수</strong> (예: std1) ➡️ <strong className="text-slate-800">나불참 (F학점 경고, 평점 1.8)</strong></span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              <span>기타 / 숫자가 없는 경우 ➡️ <strong className="text-slate-800">이평범 (보통 학생, 평점 3.2)</strong></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
