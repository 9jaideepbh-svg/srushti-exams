import React, { useState, useEffect, useRef } from 'react';
import {
  Crown,
  Coins,
  TrendingUp,
  History,
  Sparkles,
  Volume2,
  VolumeX,
  Trash2,
  Settings,
  HelpCircle,
  Footprints,
  Calendar,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Plus,
  X,
  CheckCircle,
  BookOpen,
  CalendarPlus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FloatingDecorations } from './components/FloatingDecorations';
import { Countdown } from './components/Countdown';
import { HistoryItem, ActionType } from './types';

// Custom hook for robust local storage persistence
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

interface ExamItem {
  id: string;
  subject: string;
  dateStr: string;
  dateTime: Date;
  emoji: string;
  gCalUrl: string;
}

const ROTATING_QUOTES = [
  "East or west, u deserve my heels 👠",
  "I am the goddess, u just obey me 👑",
  "Every time Jaideep annoys me, his wallet suffers. 😌✨",
  "Keep talking... keep paying. 💸",
  "A brother's pocket money is a sister's property. 💅",
  "Rule #1: Srushti is always right. Rule #2: See Rule #1.",
  "My mood peaks when Jaideep's wallet leaks! 📈"
];

const EXAM_SCHEDULE: ExamItem[] = [
  { 
    id: '1', 
    subject: 'Linear Algebra and Optimization', 
    dateStr: 'June 30, 2026 (Tuesday)', 
    dateTime: new Date('2026-06-30T12:30:00+05:30'), 
    emoji: '📐',
    gCalUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent('📚 Exam: Linear Algebra and Optimization') + '&dates=20260630T040000Z/20260630T070000Z&details=' + encodeURIComponent('Exam Time: 9:30 AM - 12:30 PM. Focus and rock it! 👑')
  },
  { 
    id: '2', 
    subject: 'Analysis and Design of Algorithms', 
    dateStr: 'July 02, 2026 (Thursday)', 
    dateTime: new Date('2026-07-02T12:30:00+05:30'), 
    emoji: '💻',
    gCalUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent('📚 Exam: Analysis and Design of Algorithms') + '&dates=20260702T040000Z/20260702T070000Z&details=' + encodeURIComponent('Exam Time: 9:30 AM - 12:30 PM. Focus and rock it! 👑')
  },
  { 
    id: '3', 
    subject: 'Software Engineering', 
    dateStr: 'July 04, 2026 (Saturday)', 
    dateTime: new Date('2026-07-04T12:30:00+05:30'), 
    emoji: '⚙️',
    gCalUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent('📚 Exam: Software Engineering') + '&dates=20260704T040000Z/20260704T070000Z&details=' + encodeURIComponent('Exam Time: 9:30 AM - 12:30 PM. Focus and rock it! 👑')
  },
  { 
    id: '4', 
    subject: 'Operating Systems', 
    dateStr: 'July 07, 2026 (Tuesday)', 
    dateTime: new Date('2026-07-07T12:30:00+05:30'), 
    emoji: '🖥️',
    gCalUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent('📚 Exam: Operating Systems') + '&dates=20260707T040000Z/20260707T070000Z&details=' + encodeURIComponent('Exam Time: 9:30 AM - 12:30 PM. Focus and rock it! 👑')
  },
  { 
    id: '5', 
    subject: 'Theoretical Foundations of Computation', 
    dateStr: 'July 09, 2026 (Thursday)', 
    dateTime: new Date('2026-07-09T12:30:00+05:30'), 
    emoji: '🧠',
    gCalUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent('📚 Exam: Theoretical Foundations of Computation') + '&dates=20260709T040000Z/20260709T070000Z&details=' + encodeURIComponent('Exam Time: 9:30 AM - 12:30 PM. Focus and rock it! 👑')
  },
  { 
    id: '6', 
    subject: 'Cryptography', 
    dateStr: 'July 11, 2026 (Saturday)', 
    dateTime: new Date('2026-07-11T12:30:00+05:30'), 
    emoji: '🔐',
    gCalUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent('📚 Exam: Cryptography') + '&dates=20260711T040000Z/20260711T070000Z&details=' + encodeURIComponent('Exam Time: 9:30 AM - 12:30 PM. Focus and rock it! 👑')
  }
];

const getWordCount = (count: number) => {
  const words = [
    "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", 
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", 
    "Seventeen", "Eighteen", "Nineteen", "Twenty"
  ];
  if (count >= 0 && count < words.length) {
    return words[count];
  }
  return count.toString();
};

export default function App() {
  // --- Persistent States ---
  const [totalComp, setTotalComp] = useLocalStorage<number>('brother_tax_total', 0);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('brother_tax_history', []);
  const [isSimulatedFinished, setIsSimulatedFinished] = useLocalStorage<boolean>('brother_tax_sim_finished', false);
  const [heelWearCount, setHeelWearCount] = useLocalStorage<number>('brother_tax_heel_wear_count', 0);

  // --- Volatile States ---
  const [isExamFinished, setIsExamFinished] = useState<boolean>(false);

  const [srushtiQuote, setSrushtiQuote] = useState<string>(
    "Every time Jaideep annoys me, his wallet suffers. 😌✨"
  );
  
  const [subtitleIndex, setSubtitleIndex] = useState<number>(0);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setSubtitleIndex(prev => (prev + 1) % ROTATING_QUOTES.length);
    }, 7000);
    return () => clearInterval(quoteInterval);
  }, []);
  
  const [srushtiMood, setSrushtiMood] = useState<'smug' | 'satisfied' | 'annoyed' | 'empress'>('smug');
  const [titleClicks, setTitleClicks] = useState<number>(0);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Custom alerts and popups
  const [showHeelsPopup, setShowHeelsPopup] = useState<boolean>(false);
  const [heelMessage, setHeelMessage] = useState<string>("");
  const [showEasterEggPopup, setShowEasterEggPopup] = useState<boolean>(false);

  const heelComp = history
    .filter(item => item.type === 'heels_fine')
    .reduce((sum, item) => sum + item.amount, 0);
  
  // Floating numbers state
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
  
  // Custom manual fine state
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [customReason, setCustomReason] = useState<string>("");
  const [customAmount, setCustomAmount] = useState<string>("200");

  const totalDisplayRef = useRef<HTMLDivElement>(null);

  // --- Target Date (11 July 2026) ---
  const EXAMS_END_DATE = new Date('2026-07-11T12:30:00+05:30');

  // Handle auto-confetti loop when exam ends
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isExamFinished || isSimulatedFinished) {
      // Periodic explosions of pastel joy
      const playFinalConfetti = () => {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#BFA2FF', '#FFD6E7', '#CDEBFF', '#FFF9F2', '#FFD15C']
        });
      };
      
      playFinalConfetti();
      interval = setInterval(playFinalConfetti, 4500);
    }
    return () => clearInterval(interval);
  }, [isExamFinished, isSimulatedFinished]);

  // --- Sound Generation (Web Audio API) ---
  const playSound = (type: 'bubble' | 'coins' | 'stomp' | 'fanfare') => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (type === 'bubble') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1300, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      } else if (type === 'coins') {
        // Double chime
        const playCoinChime = (timeOffset: number, pitch: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(pitch, ctx.currentTime + timeOffset);
          gain.gain.setValueAtTime(0.08, ctx.currentTime + timeOffset);
          gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + timeOffset + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + timeOffset);
          osc.stop(ctx.currentTime + timeOffset + 0.19);
        };
        playCoinChime(0, 780);
        playCoinChime(0.08, 980);
      } else if (type === 'stomp') {
        // Heel stomping sound with pitch dive
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.26);
      } else if (type === 'fanfare') {
        // Victory chime chord
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);
          gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.06);
          gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.06);
          osc.stop(ctx.currentTime + 0.45);
        });
      }
    } catch (e) {
      console.warn("Audio Context blocked by browser permission.", e);
    }
  };

  // --- Sibling Dialog Lists ---
  const prickedQuotes = [
    "That's another ₹300, brother 😂",
    "Keep talking... keep paying 😌",
    "Oops... your wallet is crying.",
    "Do I hear pocket change? 💅",
    "Is that a protest? That's another tax!",
    "One does not simply annoy the Empress for free. 👑"
  ];

  const worseQuotes = [
    "Serious damage detected. 😭",
    "+₹500 added. Wallet damage: CRITICAL!",
    "Jaideep unlocked Premium Trouble. ⭐",
    "Prepare your net banking portal, brother. 💸",
    "My peace of mind is very expensive!",
    "Now you've done it. Jaideep is entering debt. 📉"
  ];

  const heelQuotes = [
    "Permission granted. 😂",
    "Jaideep has officially been promoted to Footrest.",
    "Brother detected beneath royal heels.",
    "Mission: Crush Successful."
  ];

  // Get Brother Jaideep's Stress Status text & style
  const getJaideepStatus = () => {
    if (totalComp === 0) {
      return {
        text: "Perfect fine (for now...)",
        emoji: "👦",
        color: "bg-[#CDEBFF] text-[#1E5D8C]",
        desc: "Thinks he's getting away with it."
      };
    } else if (totalComp <= 1500) {
      return {
        text: "Wallet is sweating...",
        emoji: "😰",
        color: "bg-yellow-100 text-yellow-800",
        desc: "Losing lunch money day by day."
      };
    } else if (totalComp <= 3500) {
      return {
        text: "Savings are crying!",
        emoji: "😭",
        color: "bg-orange-100 text-orange-800",
        desc: "His savings accounts are weeping."
      };
    } else if (totalComp <= 6000) {
      return {
        text: "Eating instant noodles",
        emoji: "🍜",
        color: "bg-red-100 text-red-800 animate-pulse",
        desc: "Budget is destroyed this month."
      };
    } else {
      return {
        text: "Declared Bankrupt!",
        emoji: "💸",
        color: "bg-[#FFD6E7] text-[#C12E70] animate-bounce",
        desc: "Srushti owns his future salary."
      };
    }
  };

  const jaideepStatus = getJaideepStatus();

  // --- Actions Handler ---
  const triggerFloatingText = (text: string) => {
    const id = Date.now() + Math.random();
    const x = Math.random() * 80 - 40; // centered offset
    const y = -60 - Math.random() * 20;
    setFloatingTexts(prev => [...prev, { id, text, x, y }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(item => item.id !== id));
    }, 1300);
  };

  const handlePrickMood = () => {
    if (isExamFinished || isSimulatedFinished) return;
    
    const amount = 300;
    setTotalComp(prev => prev + amount);
    
    // Choose random quote
    const randomQuote = prickedQuotes[Math.floor(Math.random() * prickedQuotes.length)];
    setSrushtiQuote(randomQuote);
    setSrushtiMood('annoyed');

    // Add History
    const newItem: HistoryItem = {
      id: `prick-${Date.now()}-${Math.random()}`,
      type: 'prick',
      emoji: '😤',
      text: 'He pricked my mood',
      amount,
      timestamp: Date.now()
    };
    setHistory(prev => [newItem, ...prev]);

    // UI effects
    playSound('bubble');
    triggerFloatingText(`+₹${amount}`);

    // Pulse total money counter
    if (totalDisplayRef.current) {
      totalDisplayRef.current.classList.add('scale-110', 'text-yellow-500');
      setTimeout(() => {
        totalDisplayRef.current?.classList.remove('scale-110', 'text-yellow-500');
      }, 300);
    }
  };

  const handleWorseMood = () => {
    if (isExamFinished || isSimulatedFinished) return;

    const amount = 500;
    setTotalComp(prev => prev + amount);

    // Choose quote
    const randomQuote = worseQuotes[Math.floor(Math.random() * worseQuotes.length)];
    setSrushtiQuote(randomQuote);
    setSrushtiMood('satisfied');

    // Add History
    const newItem: HistoryItem = {
      id: `worse-${Date.now()}-${Math.random()}`,
      type: 'worse',
      emoji: '😭',
      text: 'My mood became worse because of him',
      amount,
      timestamp: Date.now()
    };
    setHistory(prev => [newItem, ...prev]);

    // UI effects
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    playSound('coins');
    triggerFloatingText(`+₹${amount}`);
    
    // Trigger burst confetti
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#FFD6E7', '#BFA2FF']
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#FFD6E7', '#BFA2FF']
    });

    if (totalDisplayRef.current) {
      totalDisplayRef.current.classList.add('scale-125', 'text-[#FF5E9F]');
      setTimeout(() => {
        totalDisplayRef.current?.classList.remove('scale-125', 'text-[#FF5E9F]');
      }, 400);
    }
  };

  const handleUnderHeels = () => {
    if (isExamFinished || isSimulatedFinished) return;

    // Pick random message
    const msg = heelQuotes[Math.floor(Math.random() * heelQuotes.length)];
    setHeelMessage(msg);
    setSrushtiQuote(msg);
    setSrushtiMood('empress');
    setHeelWearCount(prev => prev + 1);
    setShowHeelsPopup(true);

    playSound('stomp');
    
    // Tiny little explosion
    confetti({
      particleCount: 25,
      spread: 30,
      colors: ['#FF0000', '#FF3366', '#FFD6E7']
    });
  };

  const handleCustomFine = (e: React.FormEvent) => {
    e.preventDefault();
    if (isExamFinished || isSimulatedFinished) return;

    const amount = parseInt(customAmount, 10);
    if (isNaN(amount) || amount <= 0) return;

    const reason = customReason.trim() || "Unspecified sibling offense";
    setTotalComp(prev => prev + amount);

    const newItem: HistoryItem = {
      id: `custom-${Date.now()}-${Math.random()}`,
      type: 'custom',
      emoji: '📝',
      text: reason,
      amount,
      timestamp: Date.now()
    };
    setHistory(prev => [newItem, ...prev]);

    setSrushtiQuote(`Taxed! For: "${reason}" (+₹${amount}) 💅`);
    setSrushtiMood('satisfied');
    
    playSound('coins');
    triggerFloatingText(`+₹${amount}`);

    // Reset inputs
    setCustomReason("");
    setShowSettings(false);
  };

  const handleClearHistory = () => {
    const confirmReset = window.confirm("👑 Are you sure Srushti wants to pardon Jaideep and reset his wallet balance? (This will clear history!)");
    if (confirmReset) {
      setTotalComp(0);
      setHeelWearCount(0);
      
      const newItem: HistoryItem = {
        id: `reset-${Date.now()}-${Math.random()}`,
        type: 'reset',
        emoji: '🔄',
        text: 'Royal Pardon Granted (Wallet Reset)',
        amount: 0,
        timestamp: Date.now()
      };
      setHistory([newItem]);
      
      setSrushtiQuote("Fine... your offenses are wiped. But don't do it again! 😤");
      setSrushtiMood('smug');
      playSound('fanfare');
    }
  };

  const handleRemoveFine = (id: string, amount: number) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    if (amount > 0) {
      setTotalComp(prev => Math.max(0, prev - amount));
      triggerFloatingText(`-₹${amount}`);
    }
    playSound('bubble');
    setSrushtiQuote("Fine pardoned by Royal decree! Jaideep's wallet breathes a sigh of relief. 😌💸");
  };

  // --- Title 7 Clicks Easter Egg ---
  const handleTitleClick = () => {
    const nextCount = titleClicks + 1;
    setTitleClicks(nextCount);
    
    if (nextCount === 7) {
      setTitleClicks(0);
      setShowEasterEggPopup(true);
      playSound('fanfare');
      confetti({
        particleCount: 150,
        spread: 100,
        colors: ['#BFA2FF', '#FFD6E7', '#CDEBFF', '#FFD15C']
      });
    } else {
      // Small feedback
      triggerFloatingText(`👑 ${7 - nextCount} steps to truth!`);
    }
  };

  // Format date helper (Includes Day, Date, and Time)
  const formatTime = (epochMs: number) => {
    const d = new Date(epochMs);
    const day = d.toLocaleDateString([], { weekday: 'long' }); // e.g. Monday
    const date = d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }); // e.g. Jun 29, 2026
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }); // e.g. 11:15:30 PM
    return `${day}, ${date} at ${time}`;
  };

  return (
    <div
      className={`min-h-screen text-gray-800 font-sans relative pb-16 overflow-x-hidden ${isShaking ? 'animate-shake' : ''}`}
      style={{ background: 'linear-gradient(135deg, #FFF9F2 0%, #FFD6E7 50%, #CDEBFF 100%)' }}
    >
      {/* Background cute particles */}
      <FloatingDecorations />

      {/* --- Sound & Controls top bar --- */}
      <div className="max-w-4xl mx-auto px-6 pt-6 flex justify-between items-center relative z-10">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-3 bg-white/80 hover:bg-white rounded-full shadow-md hover:shadow-lg transition-all border border-white/40 text-gray-600 flex items-center justify-center cursor-pointer"
          title={soundEnabled ? "Mute Sounds" : "Enable Sounds"}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5 text-[#FF82B2]" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-3 bg-white/80 hover:bg-white rounded-full shadow-md hover:shadow-lg border border-white/40 text-gray-600 flex items-center justify-center cursor-pointer"
          title="Royal Controls Panel"
        >
          <Settings className="w-5 h-5 text-[#7C5CC4]" />
        </button>
      </div>

      {/* --- Collapsible Royal controls / Settings panel --- */}
      {showSettings && (
        <div className="max-w-xl mx-auto px-6 mt-3 relative z-20">
          <div className="bg-white/90 backdrop-blur-lg rounded-[32px] p-6 shadow-xl border border-[#BFA2FF]/30">
            <h3 className="text-sm font-black text-[#7C5CC4] mb-3 flex items-center gap-1.5 font-display">
              <Settings className="w-4 h-4" />
              <span>Royal Sibling Console</span>
            </h3>
            
            {/* Custom fine form */}
            <form onSubmit={handleCustomFine} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  Custom Annoyance Reason
                </label>
                <input
                  type="text"
                  placeholder="e.g., He stole my favorite chocolates! 🍫"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  disabled={isExamFinished || isSimulatedFinished}
                  className="w-full text-sm px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#BFA2FF]/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Fine Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    disabled={isExamFinished || isSimulatedFinished}
                    className="w-full text-sm px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#BFA2FF]/50"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={isExamFinished || isSimulatedFinished}
                    className="w-full py-2.5 bg-gradient-to-r from-[#BFA2FF] to-[#FFD6E7] hover:brightness-95 disabled:opacity-50 text-white rounded-2xl text-xs font-black shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Issue Fine</span>
                  </button>
                </div>
              </div>
            </form>

            <div className="border-t border-gray-100 mt-5 pt-4 flex justify-between items-center">
              <span className="text-xs text-gray-400 font-medium">Clear slate reset:</span>
              <button
                type="button"
                onClick={handleClearHistory}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1 border border-red-100 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Wallet</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Header Section --- */}
      <header className="max-w-4xl mx-auto text-center px-6 pt-8 pb-4 relative z-10">
        {/* Title with secret Easter Egg trigger */}
        <h1
          onClick={handleTitleClick}
          className="text-3xl md:text-5xl font-extrabold tracking-tight font-display text-[#7C5CC4] cursor-pointer hover:scale-[1.01] active:scale-95 transition-all select-none leading-tight py-1 flex items-center justify-center gap-2 flex-wrap"
          title="Click 7 times for absolute truth!"
        >
          <span className="text-4xl md:text-5xl animate-float inline-block">👑</span>
          <span>Srushti's Mood Compensation Tracker</span>
        </h1>
        
        <p className="text-base md:text-lg text-slate-600 mt-2 font-medium italic max-w-xl mx-auto h-8 transition-all duration-500 ease-in-out">
          "{ROTATING_QUOTES[subtitleIndex]}"
        </p>
      </header>

      {/* --- Main Dashboard --- */}
      <main className="max-w-4xl mx-auto px-6 mt-4 relative z-10 space-y-8">
        
        {/* --- Status Row: Countdown, Money & Heels (Sleek layout side-by-side on desktop) --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch w-full">
          <div className="md:col-span-6 flex flex-col justify-stretch">
            <Countdown
              targetDate={EXAMS_END_DATE}
              onFinished={setIsExamFinished}
              isSimulatedFinished={isSimulatedFinished}
            />
          </div>

          {/* Card 1: Compensation Due (made small) */}
          <div className="md:col-span-3 bg-white border-4 border-[#BFA2FF]/30 rounded-[32px] p-4 shadow-xl flex flex-col justify-center items-center relative overflow-hidden text-center min-h-[190px]">
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#BFA2FF] rounded-full opacity-10"></div>
            
            {/* Sparkles */}
            <Sparkles className="absolute top-3 right-3 w-4 h-4 text-yellow-300 animate-pulse pointer-events-none" />
            <Sparkles className="absolute bottom-3 left-3 w-3 h-3 text-[#BFA2FF] animate-sparkle pointer-events-none" />

            <span className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1 justify-center">
              <span>💰 Comp Due</span>
            </span>

            {/* Money display */}
            <div className="relative my-1">
              <div
                ref={totalDisplayRef}
                className="text-3xl md:text-4xl font-black font-display text-[#7C5CC4] transition-all duration-300 transform select-none drop-shadow-sm"
              >
                ₹{totalComp.toLocaleString()}
              </div>

              {/* Floating text renderer */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {floatingTexts.map(f => (
                  <div
                    key={f.id}
                    className="absolute text-xl font-black text-emerald-500 drop-shadow-md animate-float-up-fade"
                    style={{ left: `${f.x}px`, top: `${f.y}px` }}
                  >
                    {f.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Royalty Heels */}
          <div className="md:col-span-3 bg-gradient-to-br from-slate-900 to-slate-950 border-4 border-pink-500/30 rounded-[32px] p-4 shadow-xl flex flex-col justify-center items-center relative overflow-hidden text-center min-h-[190px] text-white">
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-pink-500 rounded-full opacity-20"></div>
            
            {/* Sparkles */}
            <Sparkles className="absolute top-3 right-3 w-4 h-4 text-pink-400 animate-pulse pointer-events-none" />
            <Sparkles className="absolute bottom-3 left-3 w-3 h-3 text-purple-400 animate-sparkle pointer-events-none" />

            <span className="text-xs font-bold text-slate-300 mb-1 flex items-center gap-1 justify-center">
              <span>👠 Heels Destruction</span>
            </span>

            {/* Counter display using word count helper */}
            <div className="my-1">
              <div className="text-2xl md:text-3xl font-black font-display text-pink-400 select-none drop-shadow-sm leading-none">
                {getWordCount(heelWearCount)}
              </div>
              <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                ({heelWearCount} {heelWearCount === 1 ? 'time' : 'times'})
              </span>
            </div>

            {/* Manual Decrement in case of accident/mistake */}
            <div className="mt-2 z-10 flex justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (heelWearCount > 0) {
                    setHeelWearCount(prev => prev - 1);
                    playSound('bubble');
                  }
                }}
                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-black rounded-xl transition-all cursor-pointer border border-white/10 flex items-center gap-1 shadow-sm"
                title="Reduce heels destruction count"
              >
                <span>-</span> <span className="text-sm">👠</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- Srushti's Royal Exam Schedule & Reminder Card --- */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[32px] p-6 shadow-xl shadow-pink-100/30">
          <div className="flex items-center justify-between mb-4 border-b border-pink-100/40 pb-3">
            <h3 className="text-sm font-black text-[#7C5CC4] uppercase tracking-wider flex items-center gap-2 font-display">
              <BookOpen className="w-4 h-4 text-[#FF82B2]" />
              <span>📚 Queen's Exam Agenda & Reminders</span>
            </h3>
            <span className="text-[10px] font-black text-[#7C5CC4] uppercase tracking-widest bg-[#BFA2FF]/10 px-3 py-1 rounded-full border border-[#BFA2FF]/20 animate-pulse">
              {EXAM_SCHEDULE.filter(e => e.dateTime < new Date()).length} / {EXAM_SCHEDULE.length} Exams Cleared
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EXAM_SCHEDULE.map((exam) => {
              const isPast = exam.dateTime < new Date();
              return (
                <div 
                  key={exam.id}
                  className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                    isPast 
                      ? 'bg-emerald-50/40 border-emerald-100 text-emerald-800 opacity-70' 
                      : 'bg-white/90 border-slate-100 shadow-sm hover:border-[#BFA2FF]/50 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-2xl select-none flex-shrink-0">{exam.emoji}</span>
                    <div className="min-w-0">
                      <p className={`text-xs font-black leading-tight truncate ${isPast ? 'text-emerald-700/80 line-through' : 'text-slate-800'}`} title={exam.subject}>
                        {exam.subject}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                        {exam.dateStr}
                      </p>
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    {isPast ? (
                      <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[9px] font-black uppercase tracking-wider bg-indigo-50 text-[#7C5CC4] px-2.5 py-1.5 rounded-full">
                          Upcoming ⏳
                        </span>
                        <a
                          href={exam.gCalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] font-black text-slate-500 hover:text-white flex items-center gap-1 transition-all bg-slate-100 hover:bg-[#7C5CC4] border border-slate-200/60 hover:border-transparent px-2 py-1 rounded-lg cursor-pointer"
                          title="Add to Google Calendar"
                        >
                          <CalendarPlus className="w-3 h-3 text-[#FF82B2] group-hover:text-white" />
                          <span>Add to GCal</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- Dynamic Sibling Reactive Speech Bubble --- */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white/60 flex gap-4 items-center max-w-2xl mx-auto">
          <div className="relative flex-shrink-0">
            {/* Srushti's Mood Sticker */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FFD6E7] to-[#BFA2FF] border border-white flex items-center justify-center text-3xl shadow-sm">
              {srushtiMood === 'smug' && "👑"}
              {srushtiMood === 'satisfied' && "💅"}
              {srushtiMood === 'annoyed' && "😤"}
              {srushtiMood === 'empress' && "👠"}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white rounded-full px-1.5 py-0.5 text-[8px] font-black shadow border border-white">
              {srushtiMood === 'empress' ? "LVL 99" : "QUEEN"}
            </div>
          </div>
          
          <div className="flex-1 text-left relative bg-pink-50/40 border border-pink-100/30 rounded-2xl p-3 px-4">
            <span className="text-[10px] font-black text-[#FF82B2] block uppercase tracking-wider mb-0.5">👑 Srushti's Mood Report:</span>
            <p className="text-xs md:text-sm text-slate-700 italic font-bold">
              "{srushtiQuote}"
            </p>
          </div>
        </div>

        {/* --- Core Interaction Actions (Lockable by Exam End) --- */}
        {(isExamFinished || isSimulatedFinished) ? (
          /* Final lock screen substitution */
          <div className="bg-gradient-to-r from-[#BFA2FF]/90 to-[#FFD6E7]/90 backdrop-blur-xl rounded-[40px] p-8 shadow-2xl border-4 border-white text-center text-white relative overflow-hidden animate-pulse-subtle max-w-2xl mx-auto">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-300 via-pink-400 to-indigo-400"></div>
            <div className="text-5xl mb-3 animate-bounce">🎉</div>
            <h2 className="text-2xl font-black font-display mb-1 text-white drop-shadow-sm">Exams Finished!</h2>
            <p className="text-sm text-white/95 font-medium max-w-sm mx-auto mb-6">
              All locks are placed. Royal accounts have been audited and closed!
            </p>

            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 max-w-sm mx-auto border border-white/30 shadow-inner">
              <span className="text-xs uppercase font-bold tracking-widest text-yellow-200">Final Audited Compensation</span>
              <div className="text-4xl font-black font-display my-2">₹{totalComp.toLocaleString()}</div>
              <p className="text-xs font-black text-white mt-1">
                Jaideep now owes Srushti <span className="underline decoration-yellow-300 decoration-4 font-bold">₹{totalComp.toLocaleString()}</span>.
              </p>
            </div>

            <p className="text-xs text-white/80 italic mt-5 font-medium">
              Payment is requested immediately in boba tea, dresses, or direct net banking transfer. 😌👑
            </p>
          </div>
        ) : (
          /* Active Interactive Buttons matching Sleek Theme perfectly */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Button 1 */}
            <div
              onClick={handlePrickMood}
              className="bg-white border-2 border-[#BFA2FF] p-6 rounded-[40px] text-center shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between items-center h-full min-h-[220px]"
            >
              <span className="text-5xl block mb-3 group-hover:scale-110 transition-transform">😤</span>
              <div>
                <h3 className="text-lg font-bold text-[#7C5CC4] mb-1 font-display">Pricked My Mood</h3>
                <p className="text-2xl font-black text-slate-800 font-display">+₹300</p>
              </div>
              <div className="mt-4 w-full text-[10px] uppercase tracking-widest font-bold bg-[#BFA2FF]/10 py-2 rounded-full text-[#7C5CC4]">
                Claim Now
              </div>
            </div>

            {/* Button 2 */}
            <div
              onClick={handleWorseMood}
              className="bg-[#FFD6E7] border-2 border-white p-6 rounded-[40px] text-center shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer relative flex flex-col justify-between items-center h-full min-h-[220px] group"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF5E9F] text-white text-[9px] px-3.5 py-1 rounded-full font-black uppercase tracking-widest shadow-sm">
                Serious Damage
              </div>
              <span className="text-5xl block mb-3 group-hover:scale-110 transition-transform">😭</span>
              <div>
                <h3 className="text-lg font-bold text-[#FF82B2] mb-1 font-display">Mood Worse</h3>
                <p className="text-2xl font-black text-slate-800 font-display">+₹500</p>
              </div>
              <div className="mt-4 w-full text-[10px] uppercase tracking-widest font-bold bg-white/50 py-2 rounded-full text-[#FF82B2]">
                Premium Trouble
              </div>
            </div>

            {/* Button 3 */}
            <div
              onClick={handleUnderHeels}
              className="bg-slate-900 border-2 border-slate-700 p-6 rounded-[40px] text-center shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between items-center h-full min-h-[220px]"
            >
              <span className="text-5xl block mb-3 group-hover:scale-110 transition-transform">👠</span>
              <div>
                <h3 className="text-lg font-bold text-white mb-1 font-display">Royal Treatment</h3>
                <p className="text-xs text-slate-400 font-medium italic">Under my heels.</p>
              </div>
              <div className="mt-4 w-full text-[10px] uppercase tracking-widest font-bold bg-white/10 py-2 rounded-full text-white">
                Crush Mode
              </div>
            </div>

          </div>
        )}        {/* --- Recent Violations Section (Sleek Horizontal scrolling cards) --- */}
        <div className="w-full mt-8 bg-white/40 backdrop-blur-sm rounded-[32px] p-6 border border-white/50 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-display">
              <span>📜 Recent Violations</span>
            </h4>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/60 px-3 py-1 rounded-full border border-white/20">
              Total Actions: {history.length}
            </span>
          </div>

          <div className="flex flex-row gap-4 overflow-x-auto pb-3 pt-1 scrollbar-thin">
            {history.filter(item => item.type !== 'heels' && item.type !== 'heels_wear').length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-xs italic w-full">
                No sibling penalties logged yet. Peace in the kingdom! 🕊️
              </div>
            ) : (
              history.filter(item => item.type !== 'heels' && item.type !== 'heels_wear').map((item) => (
                <div
                  key={item.id}
                  className={`flex-shrink-0 p-4 rounded-2xl border flex items-center gap-3 shadow-sm min-w-[280px] text-left transition-all hover:scale-102 relative group ${
                    item.type === 'heels_fine'
                      ? 'bg-slate-800 text-white border-slate-700'
                      : item.type === 'worse'
                      ? 'bg-pink-100/70 border-[#FFD6E7]'
                      : 'bg-white/80 border-white'
                  }`}
                >
                  {item.type !== 'reset' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFine(item.id, item.amount);
                      }}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/5 hover:bg-black/10 text-slate-400 hover:text-red-500 transition-all cursor-pointer"
                      title="Pardon Fine"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  <span className="text-3xl select-none animate-float-slow">{item.emoji}</span>
                  <div>
                    <p className={`text-xs font-black leading-tight ${item.type === 'heels_fine' ? 'text-white' : 'text-slate-800'}`}>
                      {item.amount > 0 ? `+₹${item.amount}` : "Heel Demotion"}
                    </p>
                    <p className={`text-[10px] mt-0.5 font-bold ${item.type === 'heels_fine' ? 'text-slate-400' : 'text-slate-500'}`} title={item.text}>
                      {item.text.length > 20 ? item.text.substring(0, 20) + "..." : item.text}
                    </p>
                    <p className={`text-[9px] mt-0.5 ${item.type === 'heels_fine' ? 'text-slate-500' : 'text-slate-400'}`}>
                      {formatTime(item.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- Total Summary Card --- */}
        <div className="bg-white/60 backdrop-blur-md rounded-[32px] p-6 shadow-md border border-white/50 text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#7C5CC4] bg-[#BFA2FF]/10 px-3 py-1 rounded-full inline-block mb-2">Audit Equivalent Overview</span>
          <div className="text-sm font-bold text-slate-600 mb-3">
            Compensation due is roughly convertible to:
          </div>
          
          {/* Sibling equivalent cards - pure cute playability */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-white rounded-2xl p-3 text-center shadow-sm hover:scale-105 transition-all">
              <span className="block text-2xl animate-float">🧋</span>
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mt-1">Boba Cups</span>
              <span className="block text-sm font-black text-slate-700 mt-0.5">~{Math.max(1, Math.floor(totalComp / 180))}</span>
            </div>
            <div className="bg-white border border-white rounded-2xl p-3 text-center shadow-sm hover:scale-105 transition-all">
              <span className="block text-2xl animate-float-slow">👗</span>
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mt-1">Cute Outfits</span>
              <span className="block text-sm font-black text-slate-700 mt-0.5">~{Math.max(0, Math.floor(totalComp / 1200))}</span>
            </div>
            <div className="bg-white border border-white rounded-2xl p-3 text-center shadow-sm hover:scale-105 transition-all">
              <span className="block text-2xl animate-float-reverse">💄</span>
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mt-1">Lip Tints</span>
              <span className="block text-sm font-black text-slate-700 mt-0.5">~{Math.max(0, Math.floor(totalComp / 450))}</span>
            </div>
          </div>
        </div>

      </main>

      {/* --- Footer --- */}
      <footer className="w-full text-center mt-12 pt-6 border-t border-[#BFA2FF]/20 relative z-10 max-w-4xl mx-auto px-6">
        <p className="text-xs font-bold text-slate-500 mb-1 flex items-center justify-center gap-1">
          Made with <span className="text-red-400 animate-pulse">❤️</span> Brother Tax System v1.0
        </p>
        <p className="text-[9px] text-slate-400 uppercase tracking-widest italic">
          "No brothers were harmed during development. Only their wallets."
        </p>
      </footer>

      {/* --- POPUP 1: Royal Heel Treatment Immersive Full-Screen Popup --- */}
      {showHeelsPopup && (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 z-50 flex flex-col items-center justify-center p-6 text-white overflow-y-auto animate-fade-in">
          {/* Confetti-like floating heels and crowns */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-[10%] left-[20%] text-6xl animate-float-slow">👠</div>
            <div className="absolute top-[60%] left-[15%] text-5xl animate-float-reverse">👑</div>
            <div className="absolute top-[30%] right-[20%] text-7xl animate-float">👠</div>
            <div className="absolute bottom-[20%] right-[15%] text-6xl animate-float-slow">🙇‍♂️</div>
          </div>

          <div className="relative max-w-lg w-full bg-white/10 backdrop-blur-xl rounded-[40px] p-8 text-center shadow-2xl border border-white/20 overflow-hidden transform scale-100 transition-transform flex flex-col items-center">
            
            {/* Sparkly corner lights */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-pink-500 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-30"></div>

            <div className="w-24 h-24 bg-white/20 text-white rounded-full flex items-center justify-center text-6xl mx-auto mb-6 shadow-lg border border-white/30 animate-bounce">
              👠
            </div>

            <span className="text-[11px] uppercase tracking-[0.3em] font-black text-pink-400 bg-pink-500/20 px-4 py-1.5 rounded-full border border-pink-500/30 mb-4 inline-block">
              ROYAL DECREE ISSUED
            </span>

            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-indigo-200 font-display leading-tight mb-4">
              CRUSH MODE ACTIVATED
            </h3>
            
            <div className="text-xl md:text-2xl text-white font-bold leading-relaxed my-6 px-6 py-5 bg-black/30 rounded-3xl border border-white/10 font-sans italic relative w-full text-center">
              <span className="absolute -top-3 left-4 text-xs font-black bg-pink-500 text-white px-2 py-0.5 rounded-md uppercase tracking-wider">
                Srushti Decrees:
              </span>
              "{heelMessage}"
            </div>

            <div className="flex justify-center gap-3 text-3xl mb-8">
              <span>👑</span><span>👠</span><span>🙇‍♂️</span><span>👠</span><span>👑</span>
            </div>

            <button
              onClick={() => {
                setShowHeelsPopup(false);
                playSound('coins');
              }}
              className="w-full max-w-sm py-4 bg-gradient-to-r from-pink-500 via-[#FF82B2] to-[#7C5CC4] hover:brightness-110 active:scale-95 text-white font-black rounded-2xl text-sm shadow-xl hover:shadow-pink-500/20 transition-all uppercase tracking-widest cursor-pointer animate-pulse-subtle"
            >
              Obey & Accept Humiliation 🙇‍♂️
            </button>
          </div>
        </div>
      )}

      {/* --- POPUP 2: Easter Egg "Srushti is Always Right" --- */}
      {showEasterEggPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#FFF9F2] to-[#FFD6E7] rounded-[32px] p-6 max-w-sm w-full text-center shadow-2xl border-4 border-yellow-300 relative overflow-hidden">
            
            {/* Sparkly bits */}
            <Sparkles className="absolute top-4 left-4 w-6 h-6 text-yellow-400 animate-pulse" />
            <Sparkles className="absolute bottom-4 right-4 w-5 h-5 text-[#7C5CC4] animate-sparkle" />

            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-4 animate-bounce border-2 border-yellow-300 shadow">
              👑
            </div>

            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CC4] to-[#FF82B2] font-display">
              The Absolute Truth!
            </h2>
            
            <p className="text-base font-black text-gray-800 mt-4 px-2 py-1 bg-white/70 rounded-xl border border-pink-100 shadow-inner">
              "Srushti is always right."
            </p>

            <p className="text-xs font-semibold text-gray-500 mt-2">
              "Jaideep accepts defeat."
            </p>

            <div className="text-sm font-bold text-gray-600 my-4 font-display">
              Statement officially codified in the Sibling Constitution. 📜
            </div>

            <button
              onClick={() => {
                setShowEasterEggPopup(false);
                playSound('fanfare');
              }}
              className="w-full py-3 bg-gradient-to-r from-yellow-400 to-[#FF82B2] hover:brightness-95 text-white font-black rounded-2xl text-xs shadow-md transition-all uppercase tracking-wider cursor-pointer"
            >
              I Accept Defeat 🙇‍♂️👑
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
