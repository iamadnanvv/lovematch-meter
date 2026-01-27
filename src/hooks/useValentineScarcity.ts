import { useState, useEffect, useMemo } from 'react';

const VALENTINE_END_DATE = new Date('2025-02-15T23:59:59');

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function useValentineScarcity() {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });

  const isExpired = useMemo(() => {
    return new Date() > VALENTINE_END_DATE;
  }, [timeRemaining]);

  const isUrgent = useMemo(() => {
    // Less than 3 days remaining
    return timeRemaining.days < 3 && !isExpired;
  }, [timeRemaining, isExpired]);

  const isCritical = useMemo(() => {
    // Less than 24 hours remaining
    return timeRemaining.days === 0 && timeRemaining.hours < 24 && !isExpired;
  }, [timeRemaining, isExpired]);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const difference = VALENTINE_END_DATE.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          total: 0,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({
        days,
        hours,
        minutes,
        seconds,
        total: difference,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatCountdown = () => {
    if (isExpired) return 'Expired';
    
    const { days, hours, minutes, seconds } = timeRemaining;
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    timeRemaining,
    isExpired,
    isUrgent,
    isCritical,
    formatCountdown,
    endDate: VALENTINE_END_DATE,
  };
}
