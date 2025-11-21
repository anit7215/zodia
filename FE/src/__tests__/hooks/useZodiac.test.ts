import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useZodiac } from '../../hooks/useZodiac';
import { useFortuneStore } from '../../stores/fortuneStore';

describe('useZodiac', () => {
  beforeEach(() => {
    localStorage.clear();

    useFortuneStore.setState({ mySign: null });
  });

  describe('초기 로드', () => {
    it('저장된 생일이 없으면 mySign은 null이어야 한다', () => {
      const { result } = renderHook(() => useZodiac());

      expect(result.current.mySign).toBeNull();
    });

    it('localStorage에 저장된 생일이 있으면 자동으로 로드해야 한다', () => {
      localStorage.setItem('myBirthDate', '2000-04-15');

      const { result } = renderHook(() => useZodiac());

      expect(result.current.mySign).toBe('양자리');
    });

    it('localStorage에 저장된 생일로부터 올바른 별자리를 계산해야 한다', () => {
      const testCases = [
        { date: '1999-03-21', expected: '양자리' },
        { date: '1988-05-15', expected: '황소자리' },
        { date: '1977-07-01', expected: '게자리' },
        { date: '2000-12-25', expected: '염소자리' },
      ];

      testCases.forEach(({ date, expected }) => {
        localStorage.clear();
        useFortuneStore.setState({ mySign: null });
        localStorage.setItem('myBirthDate', date);

        const { result } = renderHook(() => useZodiac());

        expect(result.current.mySign).toBe(expected);
      });
    });
  });

  describe('saveBirthDate', () => {
    it('생일을 저장하고 별자리를 업데이트해야 한다', () => {
      const { result } = renderHook(() => useZodiac());

      act(() => {
        result.current.saveBirthDate('1995-07-30');
      });

      expect(localStorage.getItem('myBirthDate')).toBe('1995-07-30');
      expect(result.current.mySign).toBe('사자자리');
    });

    it('다양한 날짜에 대해 올바른 별자리를 계산해야 한다', () => {
      const testCases = [
        { date: '2000-01-15', expected: '염소자리' },
        { date: '2000-02-10', expected: '물병자리' },
        { date: '2000-03-05', expected: '물고기자리' },
        { date: '2000-04-01', expected: '양자리' },
        { date: '2000-05-01', expected: '황소자리' },
        { date: '2000-06-01', expected: '쌍둥이자리' },
        { date: '2000-07-01', expected: '게자리' },
        { date: '2000-08-01', expected: '사자자리' },
        { date: '2000-09-01', expected: '처녀자리' },
        { date: '2000-10-01', expected: '천칭자리' },
        { date: '2000-11-01', expected: '전갈자리' },
        { date: '2000-12-01', expected: '사수자리' },
      ];

      const { result } = renderHook(() => useZodiac());

      testCases.forEach(({ date, expected }) => {
        act(() => {
          result.current.saveBirthDate(date);
        });

        expect(result.current.mySign).toBe(expected);
      });
    });

    it('경계 날짜를 올바르게 처리해야 한다', () => {
      const boundaryTests = [
        { date: '2000-03-20', expected: '물고기자리' },
        { date: '2000-03-21', expected: '양자리' },
        { date: '2000-04-19', expected: '양자리' },
        { date: '2000-04-20', expected: '황소자리' },
        { date: '2000-12-21', expected: '사수자리' },
        { date: '2000-12-22', expected: '염소자리' },
        { date: '2000-01-19', expected: '염소자리' },
        { date: '2000-01-20', expected: '물병자리' },
      ];

      const { result } = renderHook(() => useZodiac());

      boundaryTests.forEach(({ date, expected }) => {
        act(() => {
          result.current.saveBirthDate(date);
        });

        expect(result.current.mySign).toBe(expected);
        expect(localStorage.getItem('myBirthDate')).toBe(date);
      });
    });

    it('생일을 여러 번 변경할 수 있어야 한다', () => {
      const { result } = renderHook(() => useZodiac());

      act(() => {
        result.current.saveBirthDate('1995-05-10');
      });
      expect(result.current.mySign).toBe('황소자리');

      act(() => {
        result.current.saveBirthDate('1995-08-15');
      });
      expect(result.current.mySign).toBe('사자자리');
      expect(localStorage.getItem('myBirthDate')).toBe('1995-08-15');
    });
  });

  describe('잘못된 입력 처리', () => {
    it('빈 문자열이 전달되면 아무 작업도 하지 않아야 한다', () => {
      const { result } = renderHook(() => useZodiac());

      const initialSign = result.current.mySign;

      act(() => {
        result.current.saveBirthDate('');
      });

      expect(result.current.mySign).toBe(initialSign);
    });
  });

  describe('store 통합', () => {
    it('setMySign이 store를 업데이트해야 한다', () => {
      const { result } = renderHook(() => useZodiac());

      act(() => {
        result.current.saveBirthDate('1995-06-15');
      });

      const storeState = useFortuneStore.getState();
      expect(storeState.mySign).toBe('쌍둥이자리');
    });

    it('store의 mySign 변경이 훅에 반영되어야 한다', () => {
      const { result } = renderHook(() => useZodiac());

      act(() => {
        useFortuneStore.setState({ mySign: '물병자리' });
      });

      expect(result.current.mySign).toBe('물병자리');
    });
  });
});
