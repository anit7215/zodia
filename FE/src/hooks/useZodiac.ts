import { useEffect, useCallback } from 'react';
import { useFortuneStore } from '../stores/fortuneStore';
import { getZodiacSign } from '../utils/zodiac';

export const useZodiac = () => {
  const { mySign, setMySign } = useFortuneStore();

  const handleUpdate = useCallback((dateString: string) => {
    if (!dateString) return;
    const date = new Date(dateString);
    const sign = getZodiacSign(date.getMonth() + 1, date.getDate());
    setMySign(sign);
  }, [setMySign]);

  useEffect(() => {
    const saved = localStorage.getItem('myBirthDate');
    if (saved) {
      handleUpdate(saved);
    }
  }, [handleUpdate]);

  const saveBirthDate = (dateString: string) => {
    localStorage.setItem('myBirthDate', dateString);
    handleUpdate(dateString);
  };

  return { mySign, saveBirthDate };
};
