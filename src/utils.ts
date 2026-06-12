/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, TaskGroup } from './types';

// Helper to determine alert status and level based on Vietnam compliance guidelines
// Colors required:
// - Xanh: > 30 ngày
// - Vàng: 15-30 ngày
// - Cam: 7-14 ngày
// - Đỏ: 3-6 ngày
// - Nhấp nháy đỏ: Hôm nay (0 ngày)
// - Đỏ đậm: Quá hạn (< 0 ngày)
export interface AlertDetails {
  level: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED' | 'BLINKING' | 'OVERDUE';
  daysLeft: number;
  colorClass: string;
  badgeClass: string;
  label: string;
}

export function calculateAlertDetails(dueDateStr: string, completed: boolean): AlertDetails {
  if (completed) {
    return {
      level: 'GREEN',
      daysLeft: 999,
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50',
      label: 'Đã hoàn thành'
    };
  }

  // Get current date representation base
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(dueDateStr);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return {
      level: 'OVERDUE',
      daysLeft,
      colorClass: 'text-red-900 bg-red-100/50 dark:text-red-300 dark:bg-red-950/60 font-bold',
      badgeClass: 'bg-red-900 text-white font-semibold shadow-sm animate-pulse border-red-800',
      label: `Quá hạn ${Math.abs(daysLeft)} ngày`
    };
  } else if (daysLeft === 0) {
    return {
      level: 'BLINKING',
      daysLeft,
      colorClass: 'text-red-600 dark:text-red-400 font-extrabold animate-pulse',
      badgeClass: 'bg-rose-600 text-white font-bold border-rose-500 animate-bounce shadow-md',
      label: 'HÔM NAY!'
    };
  } else if (daysLeft <= 3) {
    return {
      level: 'RED',
      daysLeft,
      colorClass: 'text-red-600 dark:text-red-400 font-bold',
      badgeClass: 'bg-red-500 text-white border-red-400',
      label: `Còn ${daysLeft} ngày (Nguy cấp)`
    };
  } else if (daysLeft <= 7) {
    return {
      level: 'ORANGE',
      daysLeft,
      colorClass: 'text-orange-500 dark:text-orange-400 font-medium',
      badgeClass: 'bg-orange-100 text-orange-850 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200 dark:border-orange-800/40',
      label: `Còn ${daysLeft} ngày (Khẩn cấp)`
    };
  } else if (daysLeft <= 15) {
    return {
      level: 'YELLOW',
      daysLeft,
      colorClass: 'text-amber-500 dark:text-amber-400',
      badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-250 dark:border-amber-800/40',
      label: `Còn ${daysLeft} ngày (Cận hạn)`
    };
  } else {
    return {
      level: 'GREEN',
      daysLeft,
      colorClass: 'text-sky-600 dark:text-sky-450',
      badgeClass: 'bg-sky-100 text-sky-850 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800/40',
      label: `Còn ${daysLeft} ngày (An toàn)`
    };
  }
}

// Generate beautiful alarm sounds using standard browser AudioContext!
// We pack three custom modes: 'beep' (short warn), 'urgent' (double-toned warning code), and 'success' (completion signal)
export function playAlertSound(type: 'beep' | 'urgent' | 'success' | 'startup') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    
    if (type === 'beep') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'urgent') {
      // Intermittent dual beeps
      const playTone = (time: number, freq: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.06, time);
        gain.gain.linearRampToValueAtTime(0.01, time + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + duration);
      };
      
      playTone(ctx.currentTime, 587.33, 0.15); // D5
      playTone(ctx.currentTime + 0.2, 587.33, 0.15); // D5
      playTone(ctx.currentTime + 0.4, 698.46, 0.3); // F5
    } else if (type === 'success') {
      const playTone = (time: number, freq: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.07, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration - 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + duration);
      };
      
      playTone(ctx.currentTime, 523.25, 0.1);  // C5
      playTone(ctx.currentTime + 0.1, 659.25, 0.1); // E5
      playTone(ctx.currentTime + 0.2, 783.99, 0.25); // G5
    } else if (type === 'startup') {
      // Warm classical retro chime
      const t = ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4-E4-G4-C5-E5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + i * 0.08);
        gain.gain.setValueAtTime(0.05, t + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + i * 0.08);
        osc.stop(t + i * 0.08 + 0.8);
      });
    }
  } catch (error) {
    console.warn('AudioContext fallback sound bypass:', error);
  }
}

// Preach standard format for days mapping
export function formatDateLabel(utcString: string): string {
  try {
    const d = new Date(utcString);
    if (isNaN(d.getTime())) return utcString;
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  } catch (e) {
    return utcString;
  }
}
