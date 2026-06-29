import React, { useState, useEffect } from 'react';
import { Calendar, Timer } from 'lucide-react';

interface CountdownProps {
  targetDate: Date;
  onFinished: (isFinished: boolean) => void;
  isSimulatedFinished: boolean;
}

export const Countdown: React.FC<CountdownProps> = ({
  targetDate,
  onFinished,
  isSimulatedFinished,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (isSimulatedFinished) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        onFinished(true);
        return;
      }

      const difference = targetDate.getTime() - Date.now();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        onFinished(true);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds, isOver: false });
        onFinished(false);
      }
    };

    // Run once immediately
    calculateTimeLeft();

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onFinished, isSimulatedFinished]);

  const timeBlocks = [
    { label: 'Days', value: timeLeft.days, color: 'bg-[#BFA2FF]/20 text-[#7C5CC4]', labelColor: 'text-[#7C5CC4]/70' },
    { label: 'Hours', value: timeLeft.hours, color: 'bg-[#FFD6E7]/40 text-[#FF82B2]', labelColor: 'text-[#FF82B2]/70' },
    { label: 'Mins', value: timeLeft.minutes, color: 'bg-[#CDEBFF]/60 text-[#4DA6FF]', labelColor: 'text-[#4DA6FF]/70' },
    { label: 'Secs', value: timeLeft.seconds, color: 'bg-[#FFF9F2]/80 text-orange-400 animate-pulse', labelColor: 'text-orange-400/70' },
  ];

  return (
    <div id="countdown-card" className="w-full bg-white/60 backdrop-blur-xl border border-white/40 rounded-[32px] p-6 shadow-xl shadow-pink-100/50 relative overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FFD6E7] to-[#BFA2FF] rounded-full blur-2xl opacity-35 -mr-5 -mt-5"></div>
      
      <div className="flex items-center gap-2 mb-4 text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 font-display">
        <Calendar className="w-4 h-4 text-[#FF82B2]" />
        <span>📅 Exams end on <span className="text-[#FF82B2] font-black">11 July</span></span>
      </div>

      {timeLeft.isOver || isSimulatedFinished ? (
        <div className="flex flex-col items-center py-2 animate-bounce">
          <div className="flex items-center gap-2 text-xl font-bold text-[#FF82B2] font-display">
            <span>🎉 Exams Finished! 🎉</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Liberty, peace, and shopping time!</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 w-full max-w-sm mt-1">
          {timeBlocks.map((block, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl ${block.color} transition-all duration-300 transform hover:scale-105 shadow-sm border border-white/40`}
            >
              <span className="text-2xl md:text-3xl font-black font-display leading-tight tracking-tight">
                {String(block.value).padStart(2, '0')}
              </span>
              <span className={`text-[9px] md:text-[10px] uppercase font-bold mt-1 tracking-wider ${block.labelColor}`}>
                {block.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
