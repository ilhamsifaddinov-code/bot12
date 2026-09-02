import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Video } from '../types';
import { INITIAL_VIDEOS } from '../data';
import { Play, Search, Filter, Lock, Flame, CheckCircle, Clock, Volume2, Maximize, AlertCircle, Sparkles } from 'lucide-react';

interface VideoPortalProps {
  user: User;
  onUpgradeTariff: () => void;
  onCompleteWorkout: (workoutTitle: string) => void;
}

export default function VideoPortal({ user, onUpgradeTariff, onCompleteWorkout }: VideoPortalProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'cardio' | 'strength' | 'stretch' | 'warmup'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom Timer State
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentSet, setCurrentSet] = useState(1);
  const [totalSets, setTotalSets] = useState(3);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);

  // Filtered videos list
  const filteredVideos = INITIAL_VIDEOS.filter(vid => {
    const matchesTab = activeTab === 'all' || vid.category === activeTab;
    const matchesSearch = vid.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          vid.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Workout Timer logic
  useEffect(() => {
    let interval: any;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timerActive && timeLeft === 0) {
      if (currentSet < totalSets) {
        // Prepare next set
        setCurrentSet(prev => prev + 1);
        setTimeLeft(30); // reset set timer to 30s
        // Flash or brief sound could go here
      } else {
        // Complete workout
        setTimerActive(false);
        setWorkoutCompleted(true);
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, currentSet, totalSets]);

  const handleStartWorkoutTimer = () => {
    setTimeLeft(30);
    setCurrentSet(1);
    setWorkoutCompleted(false);
    setTimerActive(true);
  };

  const handleFinishWorkout = () => {
    if (selectedVideo) {
      onCompleteWorkout(selectedVideo.title);
      setWorkoutCompleted(false);
      setSelectedVideo(null);
    }
  };

  const getDifficultyColor = (diff: Video['difficulty']) => {
    switch (diff) {
      case 'Ańsat': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Ortasha': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Qıyın': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    }
  };

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            🎬 Onlayn Shınıǵıwlar (PRO Portal)
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
              Virtual Zal
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">Sizge móljellengen kásiplik shınıǵıwlar videotekası</p>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Shınıǵıwlardı izlew..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 bg-gray-950/80 border border-gray-800 rounded-xl py-2 px-4 pl-10 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-colors"
          />
          <Search className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-gray-500" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none border-b border-gray-800/80 mb-6">
        {[
          { id: 'all', label: 'Barlıǵı' },
          { id: 'cardio', label: 'Kardio & May Eritiw' },
          { id: 'strength', label: 'Kúsh & Bulshıq Et' },
          { id: 'stretch', label: 'Sozılıw (Stretch)' },
          { id: 'warmup', label: 'Denedi Qızdırıw' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-amber-500 text-black font-semibold shadow-md shadow-amber-500/10'
                : 'bg-gray-950/40 border border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Stream Grid */}
      <div className="relative min-h-[300px]">
        {filteredVideos.length === 0 ? (
          <div className="text-center py-12 text-xs text-gray-500">
            Soraǵıńız boyınsha shınıǵıwlar tabılmadı. Basqa sóz jazıp kóriń.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVideos.map(vid => (
              <div 
                key={vid.id}
                className="bg-gray-950/60 border border-gray-800/80 rounded-2xl overflow-hidden group hover:border-amber-500/30 transition-all flex flex-col justify-between"
              >
                {/* Thumbnail Section */}
                <div className="relative aspect-video overflow-hidden bg-gray-900 flex items-center justify-center">
                  <img 
                    src={vid.thumbnailUrl} 
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <button 
                      onClick={() => user.tariff === 'PRO' ? setSelectedVideo(vid) : null}
                      className="p-3.5 rounded-full bg-amber-500 text-black shadow-lg shadow-amber-500/20 opacity-90 hover:opacity-100 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <Play className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-[10px] text-gray-300 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" /> {vid.duration}
                  </span>
                </div>

                {/* Info Section */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-amber-500 uppercase font-bold tracking-widest">{vid.category}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getDifficultyColor(vid.difficulty)}`}>
                        {vid.difficulty}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">{vid.title}</h3>
                    <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{vid.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upsell Paywall for LIGHT users */}
        {user.tariff !== 'PRO' && (
          <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-center p-6 border border-gray-800">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 mb-4 animate-bounce">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-white">👑 Onlayn Videolar Tek PRO Tariftińiz ushın</h3>
            <p className="text-xs text-gray-400 max-w-sm mt-2 leading-relaxed">
              Siz turaqlı LIGHT tariftesiz. Üy sharayatında rawajlanıw, kóbirek shınıǵıwlar hám táreplemeli onlayn videolardı ashıw ushın PRO tarifine ótiń!
            </p>
            <div className="mt-5 space-y-3 w-full max-w-xs">
              <button
                onClick={onUpgradeTariff}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-black font-extrabold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                PRO-ǵa Jańalaw (Upgrade) <Sparkles className="w-4 h-4 fill-current" />
              </button>
              <div className="text-[10px] text-gray-500 font-mono">
                Ayırpı: +100,000 QMS | Sheksiz video qosımshalar
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Video Player Dialog Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-gray-950 border border-gray-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-3"
            >
              {/* Left Column: Iframe Video player */}
              <div className="lg:col-span-2 relative aspect-video lg:aspect-auto lg:h-[420px] bg-black">
                <iframe
                  src={selectedVideo.videoUrl}
                  title={selectedVideo.title}
                  className="w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Right Column: Workout Timer & Companion */}
              <div className="p-5 flex flex-col justify-between bg-gray-900/40 border-t lg:border-t-0 lg:border-l border-gray-800/80 h-[380px] lg:h-[420px]">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">{selectedVideo.category}</span>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{selectedVideo.title}</h4>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedVideo(null);
                        setTimerActive(false);
                      }}
                      className="text-gray-500 hover:text-white transition-colors text-xs"
                    >
                      ❌ Jabıw
                    </button>
                  </div>

                  {/* Interactive Timer Widget */}
                  <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 text-center space-y-3">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex justify-between">
                      <span>Shınıǵıw jıynaqları</span>
                      <span className="text-amber-500">{currentSet} / {totalSets} SET</span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-3xl font-black text-white font-mono tracking-wider">
                        00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                      </div>
                      <p className="text-[10px] text-gray-400">Arıqlaw hám bulshıq et ushın interval</p>
                    </div>

                    {/* Progress slider bar for interval */}
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-1000"
                        style={{ width: `${(timeLeft / 30) * 100}%` }}
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setTimerActive(!timerActive)}
                        className={`flex-1 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer ${
                          timerActive 
                            ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400' 
                            : 'bg-amber-500 text-black'
                        }`}
                      >
                        {timerActive ? 'Toxatıp turıw' : 'Taymerdi Baslaw'}
                      </button>
                      <button
                        onClick={handleStartWorkoutTimer}
                        className="px-2.5 bg-gray-900 border border-gray-800 text-gray-400 text-[10px] rounded-lg cursor-pointer hover:text-white"
                      >
                        🔄 Rset
                      </button>
                    </div>
                  </div>

                  {/* Smart companion prompt */}
                  <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-2 text-[10px] text-gray-400 leading-normal">
                    <Flame className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white font-semibold block">Trener Keńesi:</span>
                      Dizdi tuwrı ustań, dem alıstı qadaǵalań hám press ti belsendi uslap turıń!
                    </div>
                  </div>
                </div>

                {/* Final Complete button */}
                <div className="space-y-2">
                  {workoutCompleted && (
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-lg text-center flex items-center justify-center gap-1.5 animate-pulse">
                      <CheckCircle className="w-3.5 h-3.5" /> Barlıq jıynaqlar (set) tamamlandı!
                    </div>
                  )}
                  <button
                    onClick={handleFinishWorkout}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    Shınıǵıwdı Tamamlap XP Alıw 💪
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
