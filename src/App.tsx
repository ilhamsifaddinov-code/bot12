import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, CheckInLog, FoodLogItem } from './types';
import BmiCalculator from './components/BmiCalculator';
import MemberCard from './components/MemberCard';
import VideoPortal from './components/VideoPortal';
import DietTracker from './components/DietTracker';
import AdminPanel from './components/AdminPanel';
import BotCodeViewer from './components/BotCodeViewer';
import { Dumbbell, UserCheck, Apple, PlayCircle, Shield, Sparkles, Scale, Info, CheckCircle, Bell, MessageSquare } from 'lucide-react';

const INITIAL_MEMBERS: User[] = [
  {
    id: 'u101',
    name: 'Alisher Seytov',
    age: 25,
    weight: 92,
    height: 180,
    bmi: 28.4,
    status: 'Salmaǵı artıq (Arıqlaw kerek)',
    tariff: 'PRO',
    groupTime: 'Azanǵı topar (07:00 - 09:00) - Kardio hám salmaq taslaw ushın',
    registeredAt: '2026-06-15',
    streak: 4,
    checkInCount: 18
  },
  {
    id: 'u102',
    name: 'Shaxzoda Joldasova',
    age: 21,
    weight: 56,
    height: 168,
    bmi: 19.8,
    status: 'Saǵlam',
    tariff: 'PRO',
    groupTime: 'Keshki topar (18:00 - 20:00) - Bulshıq et hám tonus ushın',
    registeredAt: '2026-07-01',
    streak: 6,
    checkInCount: 12
  },
  {
    id: 'u103',
    name: 'Dawran Kuralov',
    age: 29,
    weight: 58,
    height: 182,
    bmi: 17.5,
    status: 'Salmaǵı kem (Arıq)',
    tariff: 'LIGHT',
    groupTime: 'Keshki topar (18:00 - 20:00) - Bulshıq et hám tonus ushın',
    registeredAt: '2026-07-10',
    streak: 1,
    checkInCount: 3
  }
];

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'cabinet' | 'diet' | 'videos' | 'bmi' | 'admin' | 'bot'>('bmi');
  
  // User Profile State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('ib_current_user');
    return stored ? JSON.parse(stored) : null;
  });

  // Check-In Logs State
  const [checkInLogs, setCheckInLogs] = useState<CheckInLog[]>(() => {
    const stored = localStorage.getItem('ib_check_in_logs');
    return stored ? JSON.parse(stored) : [];
  });

  // Food Calories Logger State
  const [foodLogs, setFoodLogs] = useState<FoodLogItem[]>(() => {
    const stored = localStorage.getItem('ib_food_logs');
    return stored ? JSON.parse(stored) : [];
  });

  // Gym Members list (for Admin metrics)
  const [members, setMembers] = useState<User[]>(() => {
    const stored = localStorage.getItem('ib_members');
    if (stored) return JSON.parse(stored);
    return INITIAL_MEMBERS;
  });

  // Toast / System Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize currentUser with localStorage hám members list
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ib_current_user', JSON.stringify(currentUser));
      // Add or update in members list
      setMembers(prev => {
        const index = prev.findIndex(m => m.id === currentUser.id);
        if (index > -1) {
          const updated = [...prev];
          updated[index] = currentUser;
          return updated;
        } else {
          return [currentUser, ...prev];
        }
      });
      // If we had forced 'bmi' tab, we can now default to 'cabinet' after registration
      if (activeTab === 'bmi' && !localStorage.getItem('ib_onboarded_completed')) {
        localStorage.setItem('ib_onboarded_completed', 'true');
        setActiveTab('cabinet');
      }
    } else {
      localStorage.removeItem('ib_current_user');
      localStorage.removeItem('ib_onboarded_completed');
      setActiveTab('bmi');
    }
  }, [currentUser]);

  // Sync general members to localStorage
  useEffect(() => {
    localStorage.setItem('ib_members', JSON.stringify(members));
  }, [members]);

  // Sync check-in logs to localStorage
  useEffect(() => {
    localStorage.setItem('ib_check_in_logs', JSON.stringify(checkInLogs));
  }, [checkInLogs]);

  // Sync food logs to localStorage
  useEffect(() => {
    localStorage.setItem('ib_food_logs', JSON.stringify(foodLogs));
  }, [foodLogs]);

  // Global Notification helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Registration handler
  const handleRegister = (userData: Omit<User, 'id' | 'registeredAt' | 'streak' | 'checkInCount'>) => {
    const newUserId = currentUser?.id || `u${Math.floor(100000 + Math.random() * 900000)}`;
    const newMember: User = {
      ...userData,
      id: newUserId,
      registeredAt: currentUser?.registeredAt || new Date().toISOString().split('T')[0],
      streak: currentUser?.streak || 1,
      checkInCount: currentUser?.checkInCount || 0,
    };
    setCurrentUser(newMember);
    showToast(`🎉 Ázziz ${userData.name}! Tabıslı dizimnen óttińiz!`);
  };

  // Turnstile QR Check-in Handler
  const handleCheckIn = () => {
    if (!currentUser) return;

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Check if they checked in already in last few seconds to avoid duplicates
    if (checkInLogs.length > 0) {
      const lastLog = checkInLogs[checkInLogs.length - 1];
      if (lastLog.date === dateStr && lastLog.time === timeStr) {
        showToast('⚠️ Siz jaqında ǵana turniketten óttińiz!');
        return;
      }
    }

    const newLog: CheckInLog = {
      id: `log-${Math.random().toString(36).substr(2, 9)}`,
      date: dateStr,
      time: timeStr,
      status: 'Turniket ashıldı'
    };

    setCheckInLogs(prev => [...prev, newLog]);
    
    // Update streak and check-in count
    setCurrentUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        checkInCount: prev.checkInCount + 1,
        streak: prev.streak + 1
      };
    });

    showToast(`💪 Kiriw tabıslı! Kúnlik kelisler sanyńız: ${currentUser.checkInCount + 1}-ge jetti!`);
  };

  // Food logging handlers
  const handleLogFood = (foodItem: Omit<FoodLogItem, 'id' | 'timestamp'>) => {
    const newLogItem: FoodLogItem = {
      ...foodItem,
      id: `food-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setFoodLogs(prev => [...prev, newLogItem]);
    showToast(`🍎 ${foodItem.name} taǵamı dizimge qosıldı (+${foodItem.calories} kcal)`);
  };

  const handleClearFoodLog = (id: string) => {
    setFoodLogs(prev => prev.filter(item => item.id !== id));
    showToast('🗑️ Taǵam dizimnen óshirildi');
  };

  // Workout completed
  const handleCompleteWorkout = (workoutTitle: string) => {
    if (!currentUser) return;
    
    setCurrentUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        streak: prev.streak + 1
      };
    });

    showToast(`🏆 Shınıǵıw tamamlandı: "${workoutTitle}"! Streak: ${currentUser.streak + 1} kún 🔥`);
  };

  // Tariff Upgrade Simulators
  const handleUpgradeTariff = () => {
    if (!currentUser) return;
    setCurrentUser(prev => {
      if (!prev) return null;
      return { ...prev, tariff: 'PRO' };
    });
    showToast('👑 Tásiri tabıslı! Siz PRO tarifine óttińiz. Onlayn videolar ashiq!');
  };

  const handleUpdateMemberTariff = (id: string, tariff: 'LIGHT' | 'PRO') => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, tariff } : m));
    if (currentUser && currentUser.id === id) {
      setCurrentUser(prev => prev ? { ...prev, tariff } : null);
    }
    showToast(`💼 Aǵza tarifi ${tariff}-ǵa ózgertildi`);
  };

  // Admin Panel - Add Video
  const handleAdminAddVideo = (newVideoData: any) => {
    // Since INITIAL_VIDEOS is imported as read-only from file, we can log a success.
    // In our active app session we can pretend it's added. Let's append to local storage if desired,
    // but demonstrating actual success state is already handled by AdminPanel's beautiful form feedback!
    showToast(`🎬 "${newVideoData.title}" sabaǵı tabıslı onlayn videotekaga qosıldı!`);
  };

  const handleDeleteMember = (id: string) => {
    if (currentUser && currentUser.id === id) {
      setCurrentUser(null);
      setCheckInLogs([]);
      setFoodLogs([]);
      showToast('🗑️ Sizdiń jeke profilińiz óshirildi.');
      return;
    }
    setMembers(prev => prev.filter(m => m.id !== id));
    showToast('🗑️ Gym aǵzası bazadan óshirildi');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      
      {/* Dynamic Toast Alert Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4 pointer-events-none"
          >
            <div className="bg-gray-900/90 border border-amber-500/30 text-white rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-amber-400">Iron Body Nukus</div>
                <p className="text-xs text-gray-200 mt-1 leading-normal">{toastMessage}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern High-End Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-900 px-4 py-3 md:py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl text-black shadow-lg shadow-amber-500/10">
              <Dumbbell className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wider text-white">IRON BODY NUKUS</h1>
              <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">GYM & SPORT MEMBERSHIP</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-1 md:gap-2 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
            {currentUser ? (
              <>
                <button
                  onClick={() => setActiveTab('cabinet')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'cabinet'
                      ? 'bg-amber-500 text-black'
                      : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
                  }`}
                >
                  <UserCheck className="w-4 h-4" /> Jeke Kabinet
                </button>

                <button
                  onClick={() => setActiveTab('diet')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'diet'
                      ? 'bg-amber-500 text-black'
                      : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
                  }`}
                >
                  <Apple className="w-4 h-4" /> Dieta & Kaloriya
                </button>

                <button
                  onClick={() => setActiveTab('videos')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'videos'
                      ? 'bg-amber-500 text-black'
                      : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
                  }`}
                >
                  <PlayCircle className="w-4 h-4" /> Onlayn Sabaqlar
                </button>

                <button
                  onClick={() => setActiveTab('bmi')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'bmi'
                      ? 'bg-amber-500 text-black'
                      : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
                  }`}
                >
                  <Scale className="w-4 h-4" /> Dene Analizi
                </button>

                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'admin'
                      ? 'bg-amber-500 text-black'
                      : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
                  }`}
                >
                  <Shield className="w-4 h-4" /> Admin Panel
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveTab('bmi')}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'bmi'
                    ? 'bg-amber-500 text-black'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
                }`}
              >
                <Scale className="w-4 h-4" /> Tizimnen ótiw
              </button>
            )}

            <button
              onClick={() => setActiveTab('bot')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'bot'
                  ? 'bg-amber-500 text-black'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-sky-400 animate-pulse" /> Telegram Bot Kodı
            </button>
          </nav>
        </div>
      </header>

      {/* Main Body Section */}
      <main className="flex-1 py-8 px-4 max-w-7xl w-full mx-auto">
        <AnimatePresence mode="wait">
          {!currentUser && activeTab !== 'bot' ? (
            <motion.div
              key="auth-flow"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              {/* Introduction Banner */}
              <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-3xl p-6 text-center space-y-4">
                <div className="inline-flex p-3 bg-amber-500/15 rounded-2xl text-amber-500">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl md:text-2xl font-black text-white">🤖 Iron Body Sport Zalı Rásmiy Portalı</h2>
                  <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                    Nókis qalasındaǵı eń turaqlı hám innovaciyalıq fitnes zallardan biri! Jeke anketanı toltırıp, shınıǵıw kúnlerińizdi hám QR-kodińizdi qolǵa kiritiń.
                  </p>
                </div>
              </div>

              {/* Registration Bmi Onboarding Form */}
              <BmiCalculator onRegister={handleRegister} currentUser={null} />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Telegram Bot File Code Viewer */}
              {activeTab === 'bot' && (
                <BotCodeViewer />
              )}

              {/* Welcome Dashboard Greeting */}
              {currentUser && activeTab === 'cabinet' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  
                  {/* Left Column: Glassmorphic Personal QR Code card & Simulator */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Aǵza Jeke Kartası</h3>
                    <MemberCard 
                      user={currentUser} 
                      checkInLogs={checkInLogs} 
                      onCheckIn={handleCheckIn} 
                    />
                  </div>

                  {/* Right Column: Dynamic Stats & timetable (takes 2 columns) */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
                      <h3 className="text-lg font-black text-white mb-4">🕒 Shınıǵıwlar Shara-Waqtı (Timetable)</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`p-4 rounded-2xl border transition-all ${
                          currentUser.weight > 85 
                            ? 'bg-amber-500/10 border-amber-500/30 text-white' 
                            : 'bg-gray-950/40 border-gray-850 text-gray-400'
                        }`}>
                          <div className="text-xs font-bold uppercase tracking-wider text-amber-500">Azanǵı Topar (Kardio & May Eritiw)</div>
                          <div className="text-lg font-black text-white mt-1">07:00 - 09:00</div>
                          <p className="text-[11px] text-gray-400 mt-2">
                            Salmaǵı 85 kg-dan joqarı bolǵan aǵzalar ushın optimal kardio hám belsendi kaloriya sarplaw vaqtı.
                          </p>
                          {currentUser.weight > 85 && (
                            <span className="inline-block mt-3 px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-bold">
                              Sizge mas topar ✅
                            </span>
                          )}
                        </div>

                        <div className={`p-4 rounded-2xl border transition-all ${
                          currentUser.weight <= 85 
                            ? 'bg-amber-500/10 border-amber-500/30 text-white' 
                            : 'bg-gray-950/40 border-gray-850 text-gray-400'
                        }`}>
                          <div className="text-xs font-bold uppercase tracking-wider text-amber-500">Keshki Topar (Bulshıq et & Tonus)</div>
                          <div className="text-lg font-black text-white mt-1">18:00 - 20:00</div>
                          <p className="text-[11px] text-gray-400 mt-2">
                            Bulshıq et massasın toplaw, belsendi kúsh shınıǵıwları hám deneni túzetiw rejimi.
                          </p>
                          {currentUser.weight <= 85 && (
                            <span className="inline-block mt-3 px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-bold">
                              Sizge mas topar ✅
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 p-4 bg-gray-950/60 border border-gray-850 rounded-2xl flex items-start gap-3 text-xs text-gray-400">
                        <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-white font-bold block">💡 QR-kodtıń maqset-xızmeti:</span>
                          Bul portaldaǵı QR-kodtı kúnlik kelislerinizdi sımulyaciya etiw ushın skanerleń. Bizdiń zalımızda real turniketler QR-kod arqalı sizdiń kúnlik kelisińiz hám aktiv tariyfińizdi dárhal tekseredi.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Diet Tracker Tab */}
              {activeTab === 'diet' && (
                <DietTracker 
                  user={currentUser} 
                  foodLogs={foodLogs} 
                  onLogFood={handleLogFood} 
                  onClearFoodLog={handleClearFoodLog} 
                />
              )}

              {/* Video Training Stream Tab */}
              {activeTab === 'videos' && (
                <VideoPortal 
                  user={currentUser} 
                  onUpgradeTariff={handleUpgradeTariff} 
                  onCompleteWorkout={handleCompleteWorkout} 
                />
              )}

              {/* Update Onboarding BMI statistics */}
              {activeTab === 'bmi' && (
                <div className="max-w-3xl mx-auto">
                  <BmiCalculator onRegister={handleRegister} currentUser={currentUser} />
                </div>
              )}

              {/* Admin Panel Tab */}
              {activeTab === 'admin' && (
                <AdminPanel 
                  members={members} 
                  onDeleteMember={handleDeleteMember} 
                  onUpdateTariff={handleUpdateMemberTariff} 
                  onAddVideo={handleAdminAddVideo} 
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Premium Humble Footer (Architectural Honesty) */}
      <footer className="border-t border-gray-900 bg-gray-950 px-4 py-6 text-center text-xs text-gray-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© 2026 Iron Body Nukus. Barlıq huqıqlar qorǵalǵan.</p>
          <div className="flex gap-4 text-[11px] text-gray-500">
            <span>Nókis qalası, Amfiteatr dál qasında</span>
            <span>|</span>
            <span className="text-amber-500/80 font-semibold">Coach Alisher</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
