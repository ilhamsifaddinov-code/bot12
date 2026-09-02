import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, CheckInLog } from '../types';
import { QrCode, RefreshCw, Calendar, Check, Zap, MapPin, Award, UserCheck, ShieldAlert } from 'lucide-react';

interface MemberCardProps {
  user: User;
  checkInLogs: CheckInLog[];
  onCheckIn: () => void;
}

export default function MemberCard({ user, checkInLogs, onCheckIn }: MemberCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  // Derive QR content format from bot Python logic
  const qrData = `IRONBODY-MEMBER\nID: ${user.id}\nName: ${user.name}\nTariff: ${user.tariff}\nStatus: ${user.status}\nGroup: ${user.groupTime}`;
  const encodedData = encodeURIComponent(qrData);
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodedData}`;

  const handleSimulateCheckIn = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanSuccess(false);

    // Simulate scanning time
    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      onCheckIn();

      // Clear success indicator after 3 seconds
      setTimeout(() => {
        setScanSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Interactive Flippable Card Container */}
      <div className="perspective-1000 w-full max-w-[420px] mx-auto h-[240px]">
        <motion.div
          className="relative w-full h-full duration-700 preserve-3d cursor-pointer"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Card Front */}
          <div 
            onClick={() => setIsFlipped(true)}
            className="absolute inset-0 w-full h-full rounded-3xl p-6 backface-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-amber-950/40 border border-amber-500/20 shadow-2xl flex flex-col justify-between overflow-hidden group"
          >
            {/* Holographic light reflection sweep */}
            <div className="absolute inset-0 w-[200%] h-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:animate-sweep pointer-events-none" />

            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm font-black text-amber-500 tracking-wider flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  IRON BODY NUKUS
                </div>
                <div className="text-[10px] text-gray-500 font-mono tracking-widest mt-0.5 uppercase">GYM & CLUB MEMBER</div>
              </div>
              
              {user.tariff === 'PRO' ? (
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  👑 PRO MEMBER
                </div>
              ) : (
                <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  ⚡ LIGHT MEMBER
                </div>
              )}
            </div>

            {/* Smart Chip and NFC logo */}
            <div className="flex items-center justify-between">
              <div className="w-10 h-8 rounded-lg bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 border border-yellow-200/50 shadow-inner relative flex items-center justify-center">
                <div className="absolute inset-2 border-r border-b border-black/10" />
                <div className="absolute inset-x-2.5 inset-y-1.5 border-l border-t border-black/10" />
              </div>
              <div className="text-gray-600 flex flex-col items-center">
                <span className="text-[8px] uppercase tracking-widest text-gray-500">NFC PAY</span>
                <span className="text-sm">📶</span>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-widest font-mono">Aǵza Atı</div>
                <div className="text-lg font-bold text-white tracking-tight mt-0.5">{user.name}</div>
                <div className="text-[10px] font-mono text-gray-500 mt-1">Sálem, shınıǵıwlarǵa tayyarsız ba?</div>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-400 uppercase tracking-widest font-mono">Karta ID</div>
                <div className="text-base font-black text-white font-mono tracking-wider">IB-{user.id.toUpperCase()}</div>
                <div className="text-[9px] text-gray-500 font-mono mt-1">Kartani aylandırıw 🔄</div>
              </div>
            </div>
          </div>

          {/* Card Back (QR Code) */}
          <div 
            onClick={() => setIsFlipped(false)}
            className="absolute inset-0 w-full h-full rounded-3xl p-6 backface-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-amber-950/30 border border-amber-500/20 shadow-2xl flex items-center justify-between gap-4 overflow-hidden [transform:rotateY(180deg)]"
          >
            <div className="flex-1 flex flex-col justify-between h-full py-1">
              <div>
                <div className="text-xs font-bold text-amber-500 uppercase tracking-wider">Jeke QR-Kodıńız</div>
                <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                  Turniketten yamasa trener Alisherden óterde bul QR-kodtı skanerleńiz.
                </p>
              </div>

              <div className="space-y-1.5 border-t border-gray-800/80 pt-2 font-mono">
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-500">DENE INDEXI:</span>
                  <span className="text-white font-semibold">{user.status}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-500">TOPAR:</span>
                  <span className="text-white font-semibold text-right max-w-[120px] truncate">{user.groupTime.split(' - ')[0]}</span>
                </div>
              </div>

              <div className="text-[9px] text-gray-500 font-mono">
                Kartani aylandırıw 🔄
              </div>
            </div>

            <div className="w-28 h-28 bg-white p-2 rounded-2xl shadow-lg border border-gray-200 flex items-center justify-center relative">
              <img 
                src={qrImageUrl} 
                alt="Member QR Code" 
                className="w-full h-full"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Simulator Actions */}
      <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-5 space-y-4 max-w-[420px] mx-auto">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-gray-400">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Kúnlik belsendilik:</span>
            <span className="text-white font-bold">{user.streak} kún 🔥</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Jámi kelisler:</span>
            <span className="text-white font-bold">{user.checkInCount} ret</span>
          </div>
        </div>

        {/* Dynamic Scan Button */}
        <button
          onClick={handleSimulateCheckIn}
          disabled={isScanning}
          className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            scanSuccess 
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
              : 'bg-gray-950 border border-gray-800 hover:border-gray-700 hover:bg-gray-900/60 text-white'
          }`}
        >
          {isScanning ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
              QR-kod skanerlenbekte...
            </span>
          ) : scanSuccess ? (
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Turniket Ashıldı! Tabıslı kirdińiz ✅
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-amber-500" />
              Zalǵa Kiristi Sımulyaciya Etilisi (Check-In)
            </span>
          )}
        </button>

        {/* Turnstile Unlock Overlay Effect */}
        <AnimatePresence>
          {isScanning && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="relative w-64 h-64 border border-amber-500/30 rounded-3xl overflow-hidden bg-gray-900/50 flex items-center justify-center">
                {/* Visual scanner line sweep */}
                <motion.div 
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_15px_#f59e0b]"
                  animate={{ top: ['5%', '95%', '5%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                />
                <QrCode className="w-32 h-32 text-amber-500/50" />
              </div>
              <h3 className="text-lg font-bold text-white mt-6">Iron Body Nukus turniketi skanerlenbekte...</h3>
              <p className="text-xs text-gray-400 mt-2 max-w-sm">Dene kartasındaki QR-kod reception terminali arqalı tekserilip atır.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Check-in History Logs */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
            <span>Sońǵı kelis jurnalları</span>
            <span className="text-amber-500 flex items-center gap-1 text-[9px]">
              <MapPin className="w-2.5 h-2.5" /> Nókis, Amfiteatr
            </span>
          </div>

          <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
            {checkInLogs.length === 0 ? (
              <div className="text-[10px] text-gray-500 py-2 text-center">
                Házirshe kirisler joq. QR-kodtı skanerlep, birinshi ret kirdi sımulyaciya etiń.
              </div>
            ) : (
              checkInLogs.slice().reverse().map((log) => (
                <div key={log.id} className="flex items-center justify-between bg-gray-950/40 border border-gray-800/40 rounded-lg p-2 text-[10px]">
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <UserCheck className="w-3 h-3 text-emerald-400" />
                    <span>Zalǵa kiriw mánzili</span>
                  </div>
                  <div className="text-gray-500 font-mono flex gap-2">
                    <span>{log.date}</span>
                    <span className="text-amber-500 font-bold">{log.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
