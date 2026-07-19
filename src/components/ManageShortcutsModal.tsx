'use client';

import React from 'react';
import { X, ChevronUp, ChevronDown, Trash2, Plus } from 'lucide-react';
import { ALL_SHORTCUTS, ShortcutItem } from '@/data/shortcuts';

interface ManageShortcutsModalProps {
  shortcutIds: string[];
  onShortcutIdsChange: (ids: string[]) => void;
  onClose: () => void;
}

export default function ManageShortcutsModal({
  shortcutIds,
  onShortcutIdsChange,
  onClose,
}: ManageShortcutsModalProps) {
  const myItems = shortcutIds
    .map((id) => ALL_SHORTCUTS.find((s) => s.id === id))
    .filter((s): s is ShortcutItem => Boolean(s));

  const availableItems = ALL_SHORTCUTS.filter((s) => !shortcutIds.includes(s.id));

  const addShortcut = (id: string) => onShortcutIdsChange([...shortcutIds, id]);
  const removeShortcut = (id: string) => onShortcutIdsChange(shortcutIds.filter((x) => x !== id));
  const moveShortcut = (index: number, dir: -1 | 1) => {
    const next = [...shortcutIds];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onShortcutIdsChange(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" />

      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/60 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <h2 className="text-base font-bold text-slate-800">나의 바로가기 관리</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8 scrollbar-thin scrollbar-thumb-slate-200">
          {/* 나의 바로가기 */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
              나의 바로가기 ({myItems.length})
            </h3>

            {myItems.length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-400">
                아직 추가된 바로가기가 없습니다.
              </div>
            ) : (
              <ul className="space-y-2">
                {myItems.map((item, index) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 bg-slate-50/70 border border-slate-200/50 rounded-xl px-3 py-2.5"
                  >
                    <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800 truncate">{item.title}</p>
                      <p className="text-[11px] text-slate-400 truncate">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => moveShortcut(index, -1)}
                        disabled={index === 0}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveShortcut(index, 1)}
                        disabled={index === myItems.length - 1}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeShortcut(item.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 현재 이용 가능한 서비스 기능들 */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
              현재 이용 가능한 서비스 기능들
            </h3>

            {availableItems.length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-400">
                추가할 수 있는 서비스가 모두 나의 바로가기에 등록되어 있습니다.
              </div>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => addShortcut(item.id)}
                      className="w-full text-left flex items-center gap-3 bg-white border border-slate-200/50 rounded-xl px-3 py-2.5 hover:border-indigo-500/30 hover:bg-indigo-50/30 transition-all cursor-pointer group"
                    >
                      <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                        {item.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800 truncate">{item.title}</p>
                        <p className="text-[11px] text-slate-400 truncate">{item.description}</p>
                      </div>
                      <Plus className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 flex-shrink-0 transition-colors" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 푸터 */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all active:scale-97 hover:brightness-105 shadow-md hover:shadow-indigo-500/20 cursor-pointer"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
}
