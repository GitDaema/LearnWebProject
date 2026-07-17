'use client';

import React, { useState } from 'react';
import { CreditCard, Download, DollarSign, ArrowRightLeft, Landmark, FileText, CheckCircle, RefreshCcw } from 'lucide-react';
import { TuitionInvoice, RefundRecord } from '@/data/mockData';

interface TuitionCardProps {
  data: {
    invoice: TuitionInvoice;
    refunds: RefundRecord[];
  };
}

export default function TuitionCard({ data }: TuitionCardProps) {
  const { invoice, refunds } = data;
  const [activeTab, setActiveTab] = useState<'invoice' | 'refund'>('invoice');

  // 금액 포맷팅 함수
  const formatWon = (value: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' })
      .format(value)
      .replace('₩', '') + '원';
  };

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-amber-500/30">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />

      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-400" />
            등록 및 환불 관리
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm">등록금 고지 조회, 납부 영수증 및 환불 신청 내역 정보입니다.</p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850">
          <button
            onClick={() => setActiveTab('invoice')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'invoice'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-550/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            등록고지 및 수납
          </button>
          <button
            onClick={() => setActiveTab('refund')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'refund'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-550/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            환불 신청/내역
          </button>
        </div>
      </div>

      {activeTab === 'invoice' ? (
        /* Invoice Details View */
        <div className="space-y-6">
          <div className="bg-slate-800/20 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
            {/* Paid Stamp */}
            {invoice.status === '납부완료' && (
              <div className="absolute top-4 right-4 sm:top-6 sm:right-8 border-4 border-emerald-500/60 text-emerald-400/90 font-extrabold uppercase tracking-widest text-sm sm:text-base px-3.5 py-1.5 rounded-xl rotate-12 scale-90 select-none shadow-md shadow-emerald-500/5 bg-slate-950/40">
                수납완료
              </div>
            )}

            <div className="text-xs text-slate-500 font-bold tracking-wide uppercase mb-3">
              {invoice.semesterName} 등록금 고지내역
            </div>

            <div className="space-y-2.5 max-w-md">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">수업료(입학금 포함)</span>
                <span className="text-white font-medium">{formatWon(invoice.tuitionFee + invoice.entranceFee)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">감면 장학금(-)</span>
                <span className="text-rose-400 font-medium">-{formatWon(invoice.scholarship)}</span>
              </div>
              <div className="border-t border-slate-800/80 my-2 pt-2.5 flex justify-between items-center">
                <span className="font-semibold text-slate-200">실납입액</span>
                <span className="text-lg font-extrabold text-amber-400">{formatWon(invoice.netAmount)}</span>
              </div>
            </div>
          </div>

          {/* Virtual Account / Payment Details */}
          <div className="bg-slate-950/40 border border-slate-850 p-4.5 rounded-xl space-y-3.5">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">납부 안내 정보</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <div className="text-slate-500">납부 가상계좌</div>
                <div className="text-white font-semibold flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-amber-500/70" />
                  {invoice.bankName} {invoice.accountNumber.split(' (')[0]}
                </div>
                <div className="text-[10px] text-slate-500">{invoice.accountNumber.split(' (')[1] ? `(${invoice.accountNumber.split(' (')[1]}` : ''}</div>
              </div>
              <div className="space-y-1.5">
                <div className="text-slate-500">납부 일자</div>
                <div className="text-white font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500/80" />
                  {invoice.paymentDate || '미납'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700/50 flex items-center gap-1.5 transition-all">
              <Download className="w-3.5 h-3.5" />
              고지서 출력
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700/50 flex items-center gap-1.5 transition-all">
              <FileText className="w-3.5 h-3.5" />
              교육비 납입 증명서
            </button>
          </div>
        </div>
      ) : (
        /* Refund Tab View */
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
              <RefreshCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">등록금 환불 및 대체 신청</h4>
              <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                휴학(자퇴) 신청으로 인한 등록금 반환이 필요한 경우, 아래 환불 계좌가 올바른지 확인 후 환불을 신청할 수 있습니다.
              </p>
            </div>
            <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-extrabold px-4 py-2 rounded-lg hover:from-amber-400 active:scale-95 transition-all">
              신청서 작성하기
            </button>
          </div>

          {/* Refund Records list */}
          {refunds && refunds.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">과거 반환/환불 처리 내역</h4>
              {refunds.map((ref) => (
                <div 
                  key={ref.id} 
                  className="bg-slate-800/30 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs sm:text-sm"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-white flex items-center gap-2">
                      {ref.semesterName}
                      <span className="text-[10px] font-normal text-slate-500 font-mono">신청코드: {ref.id}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{ref.reason}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                      <Landmark className="w-3.5 h-3.5 text-slate-500" />
                      <span>{ref.bankName} {ref.accountNumber}</span>
                    </div>
                  </div>

                  <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
                    <div className="font-bold text-amber-400">{formatWon(ref.refundFee)}</div>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] sm:mt-1 font-semibold">
                      {ref.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
