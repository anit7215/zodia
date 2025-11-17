import { useEffect } from 'react';
import { useFortuneStore } from '../stores/fortuneStore';

const API_URL = 'http://localhost:5000/api/fortunes';

export const useFortunes = () => {
  const { fortunes, setFortunes, setIsLoading } = useFortuneStore();

  useEffect(() => {
    const fetchFortunes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.error) {
          console.error('API Error:', data.error);
          return;
        }

        setFortunes(data);
      } catch (err) {
        console.error('Fetch Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFortunes();
  }, [setFortunes, setIsLoading]);

  return { fortunes };
};
