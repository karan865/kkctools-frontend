import { describe, it, expect } from 'vitest';
import {
  calculateSpeechTime,
  calculateWordsNeeded,
  generateSpeechTable,
  calculatePaceWpm,
  formatDuration,
  timerReducer,
  initialTimerState,
} from './reading-time-engine';

describe('reading-time-engine', () => {
  describe('Worked examples from Spec 07 §3.4', () => {
    it('50 words across all paces', () => {
      expect(calculateSpeechTime(50, { wpm: 238 }).formatted).toBe('0:13');
      expect(calculateSpeechTime(50, { wpm: 260 }).formatted).toBe('0:12');
      expect(calculateSpeechTime(50, { wpm: 183 }).formatted).toBe('0:16');
      expect(calculateSpeechTime(50, { wpm: 110 }).formatted).toBe('0:27');
      expect(calculateSpeechTime(50, { wpm: 130 }).formatted).toBe('0:23');
      expect(calculateSpeechTime(50, { wpm: 150 }).formatted).toBe('0:20');
    });

    it('100 words across all paces', () => {
      expect(calculateSpeechTime(100, { wpm: 238 }).formatted).toBe('0:25');
      expect(calculateSpeechTime(100, { wpm: 260 }).formatted).toBe('0:23');
      expect(calculateSpeechTime(100, { wpm: 183 }).formatted).toBe('0:33');
      expect(calculateSpeechTime(100, { wpm: 110 }).formatted).toBe('0:55');
      expect(calculateSpeechTime(100, { wpm: 130 }).formatted).toBe('0:46');
      expect(calculateSpeechTime(100, { wpm: 150 }).formatted).toBe('0:40');
    });

    it('300 words across all paces', () => {
      expect(calculateSpeechTime(300, { wpm: 238 }).formatted).toBe('1:16');
      expect(calculateSpeechTime(300, { wpm: 260 }).formatted).toBe('1:09');
      expect(calculateSpeechTime(300, { wpm: 183 }).formatted).toBe('1:38');
      expect(calculateSpeechTime(300, { wpm: 110 }).formatted).toBe('2:44');
      expect(calculateSpeechTime(300, { wpm: 130 }).formatted).toBe('2:18');
      expect(calculateSpeechTime(300, { wpm: 150 }).formatted).toBe('2:00');
    });

    it('500 words across all paces', () => {
      expect(calculateSpeechTime(500, { wpm: 238 }).formatted).toBe('2:06');
      expect(calculateSpeechTime(500, { wpm: 260 }).formatted).toBe('1:55');
      expect(calculateSpeechTime(500, { wpm: 183 }).formatted).toBe('2:44');
      expect(calculateSpeechTime(500, { wpm: 110 }).formatted).toBe('4:33');
      expect(calculateSpeechTime(500, { wpm: 130 }).formatted).toBe('3:51');
      expect(calculateSpeechTime(500, { wpm: 150 }).formatted).toBe('3:20');
    });

    it('1,000 words across all paces', () => {
      expect(calculateSpeechTime(1000, { wpm: 238 }).formatted).toBe('4:12');
      expect(calculateSpeechTime(1000, { wpm: 260 }).formatted).toBe('3:51');
      expect(calculateSpeechTime(1000, { wpm: 183 }).formatted).toBe('5:28');
      expect(calculateSpeechTime(1000, { wpm: 110 }).formatted).toBe('9:05');
      expect(calculateSpeechTime(1000, { wpm: 130 }).formatted).toBe('7:42');
      expect(calculateSpeechTime(1000, { wpm: 150 }).formatted).toBe('6:40');
    });

    it('2,000 words across all paces', () => {
      expect(calculateSpeechTime(2000, { wpm: 238 }).formatted).toBe('8:24');
      expect(calculateSpeechTime(2000, { wpm: 260 }).formatted).toBe('7:42');
      expect(calculateSpeechTime(2000, { wpm: 183 }).formatted).toBe('10:56');
      expect(calculateSpeechTime(2000, { wpm: 110 }).formatted).toBe('18:11');
      expect(calculateSpeechTime(2000, { wpm: 130 }).formatted).toBe('15:23');
      expect(calculateSpeechTime(2000, { wpm: 150 }).formatted).toBe('13:20');
    });

    it('5,000 words across all paces (with 21:01 fixture correction)', () => {
      expect(calculateSpeechTime(5000, { wpm: 238 }).formatted).toBe('21:01');
      expect(calculateSpeechTime(5000, { wpm: 260 }).formatted).toBe('19:14');
      expect(calculateSpeechTime(5000, { wpm: 183 }).formatted).toBe('27:19');
      expect(calculateSpeechTime(5000, { wpm: 110 }).formatted).toBe('45:27');
      expect(calculateSpeechTime(5000, { wpm: 130 }).formatted).toBe('38:28');
      expect(calculateSpeechTime(5000, { wpm: 150 }).formatted).toBe('33:20');
    });

    it('1,000 words at 238 wpm, ±15% range: 3:34–4:50', () => {
      const res = calculateSpeechTime(1000, { wpm: 238 });
      expect(res.rangeLowFormatted).toBe('3:34');
      expect(res.rangeHighFormatted).toBe('4:50');
    });

    it('1,400 words at 140 wpm = 10:00; 700 words at 140 wpm + 10% buffer = 5:30', () => {
      const tenMin = calculateSpeechTime(1400, { wpm: 140 });
      expect(tenMin.formatted).toBe('10:00');

      const buffered = calculateSpeechTime(700, { wpm: 140, pauseBufferPercent: 10 });
      expect(buffered.formatted).toBe('5:30');
    });

    it('650 words at 130 wpm + 10 slides × 5 s = 5:50', () => {
      const slidesRes = calculateSpeechTime(650, { wpm: 130, slidesCount: 10, secPerSlide: 5 });
      expect(slidesRes.formatted).toBe('5:50');
    });
  });

  describe('Speech table words needed (Spec 07 §3.4)', () => {
    it('verifies exact reference values for 1, 4, 5, 7, 10, 60 minutes', () => {
      const table = generateSpeechTable();
      const r1 = table.find((r) => r.minutes === 1)!;
      expect(r1.slow).toBe(110);
      expect(r1.presentation).toBe(130);
      expect(r1.conversational).toBe(150);
      expect(r1.aloud).toBe(183);

      const r4 = table.find((r) => r.minutes === 4)!;
      expect(r4.slow).toBe(440);
      expect(r4.presentation).toBe(520);
      expect(r4.conversational).toBe(600);
      expect(r4.aloud).toBe(732);

      const r5 = table.find((r) => r.minutes === 5)!;
      expect(r5.slow).toBe(550);
      expect(r5.presentation).toBe(650);
      expect(r5.conversational).toBe(750);
      expect(r5.aloud).toBe(915);

      const r7 = table.find((r) => r.minutes === 7)!;
      expect(r7.slow).toBe(770);
      expect(r7.presentation).toBe(910);
      expect(r7.conversational).toBe(1050);
      expect(r7.aloud).toBe(1281);

      const r60 = table.find((r) => r.minutes === 60)!;
      expect(r60.slow).toBe(6600);
      expect(r60.presentation).toBe(7800);
      expect(r60.conversational).toBe(9000);
      expect(r60.aloud).toBe(10980);
    });
  });

  describe('Personal pace measurement', () => {
    it('calculates wpm accurately from sample words and elapsed time', () => {
      // 100 words in 30 seconds (30,000 ms) = 200 wpm
      const wpm = calculatePaceWpm(100, 30000);
      expect(wpm).toBe(200);
    });

    it('guards against test durations under 5 seconds', () => {
      const tooFast = calculatePaceWpm(100, 4000);
      expect(tooFast).toBeNull();
    });
  });

  describe('Pure timer reducer with injectable clock', () => {
    it('handles start, tick, pause, reset cycle cleanly', () => {
      let state = timerReducer(initialTimerState, { type: 'START' });
      expect(state.status).toBe('running');

      state = timerReducer(state, { type: 'TICK', deltaMs: 1000 });
      expect(state.elapsedMs).toBe(1000);

      state = timerReducer(state, { type: 'PAUSE' });
      expect(state.status).toBe('paused');

      state = timerReducer(state, { type: 'TICK', deltaMs: 1000 });
      expect(state.elapsedMs).toBe(1000); // Does not tick while paused

      state = timerReducer(state, { type: 'START' });
      state = timerReducer(state, { type: 'TICK', deltaMs: 299000 });
      expect(state.status).toBe('finished');
      expect(state.elapsedMs).toBe(300000);

      state = timerReducer(state, { type: 'RESET' });
      expect(state.status).toBe('idle');
      expect(state.elapsedMs).toBe(0);
    });
  });
});
