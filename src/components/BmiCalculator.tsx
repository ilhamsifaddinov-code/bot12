import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, BodyStatusType, TariffType } from '../types';
import { Scale, Ruler, Calendar, ArrowRight, Sparkles, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface BmiCalculatorProps {
  onRegister: (userData: Omit<User, 'id' | 'registeredAt' | 'streak' | 'checkInCount'>) => void;
  currentUser: User | null;
}

export default function BmiCalculator({ onRegister, currentUser }: BmiCalculatorProps) {
  const [name, setName] = useState(currentUser?.name || '');
  const [age, setAge] = useState<number | ''>(currentUser?.age || '');
  const [weight, setWeight] = useState<number | ''>(currentUser?.weight || '');
  const [height, setHeight] = useState<number | ''>(currentUser?.height || '');
  const [tariff, setTariff] = useState<TariffType>('LIGHT');
  
  const [calculatedBmi, setCalculatedBmi] = useState<number | null>(currentUser?.bmi || null);
  const [calculatedStatus, setCalculatedStatus] = useState<BodyStatusType | null>(currentUser?.status || null);
  const [calculatedGroup, setCalculatedGroup] = useState<string | null>(currentUser?.groupTime || null);

  const [showResult, setShowResult] = useState(!!currentUser);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !weight || !height) return;

    const hMetr = Number(height) / 100;
    const bmiVal = Number(weight) / (hMetr * hMetr);
    const roundedBmi = parseFloat(bmiVal.toFixed(1));

    let status: BodyStatusType = 'Saǵlam';
    if (roundedBmi < 18.5) {
      status = 'Salmaǵı kem (Arıq)';
    } else if (roundedBmi > 24.9) {
      status = 'Salmaǵı artıq (Arıqlaw kerek)';
    }

    // Determine group time based on weight (from Python bot logic)
    const group = Number(weight) > 85 
      ? 'Azanǵı topar (07:00 - 09:00) - Kardio hám salmaq taslaw ushın'
      : 'Keshki topar (18:00 - 20:00) - Bulshıq et hám tonus ushın';

    setCalculatedBmi(roundedBmi);
    setCalculatedStatus(status);
    setCalculatedGroup(group);
    setShowResult(true);
  };

  const handleConfirmRegistration = () => {
    if (!name || !age || !weight || !height || !calculatedBmi || !calculatedStatus || !calculatedGroup) return;

    onRegister({
      name,
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      bmi: calculatedBmi,
      status: calculatedStatus,
      tariff,
      groupTime: calculatedGroup,
    });
  };

  const getStatusColor = (status: BodyStatusType) => {
    switch (status) {
      case 'Saǵlam': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Salmaǵı kem (Arıq)': return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'Salmaǵı artıq (Arıqlaw kerek)': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    }
  };

  return (
    <div id="bmi-calc-section" className="bg-gray-900/60 border border-gray-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-500">
          <Scale className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Dene Massası Indeksi & Onboarding</h2>
          <p className="text-xs text-gray-400">Anketanı toltırıp, jeke shınıǵıw toparıńızdı hám statusıńızdı bilip alıń</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.form 
            key="calc-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            onSubmit={handleCalculate}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300">Atı-familiyańız</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Mısalı: Alisher Nókis"
                    className="w-full bg-gray-950/80 border border-gray-800 rounded-2xl py-3 px-4 pl-11 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                  <span className="absolute left-4 top-3.5 text-gray-500">👤</span>
                </div>
              </div>

              {/* Age */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300">Jasıńız</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="10"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Mısalı: 22"
                    className="w-full bg-gray-950/80 border border-gray-800 rounded-2xl py-3 px-4 pl-11 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                  <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                </div>
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300">Salmaǵıńız (kg)</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="30"
                    max="250"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Mısalı: 75"
                    className="w-full bg-gray-950/80 border border-gray-800 rounded-2xl py-3 px-4 pl-11 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                  <Scale className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                </div>
              </div>

              {/* Height */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300">Boyıńız (sm)</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="100"
                    max="250"
                    value={height}
                    onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Mısalı: 175"
                    className="w-full bg-gray-950/80 border border-gray-800 rounded-2xl py-3 px-4 pl-11 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                  <Ruler className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Tariff Choice */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-gray-300">Tarifti tańlań</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTariff('LIGHT')}
                  className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                    tariff === 'LIGHT'
                      ? 'bg-amber-500/10 border-amber-500/50 text-white'
                      : 'bg-gray-950/40 border-gray-800 hover:border-gray-700 text-gray-400'
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-500">LIGHT</span>
                    <div className="w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center">
                      {tariff === 'LIGHT' && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-lg font-bold text-white">150,000 QMS / ay</div>
                    <div className="text-xs text-gray-400 mt-1">Zalǵa sheksiz kiris hám kásiplik trener masláháti</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTariff('PRO')}
                  className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                    tariff === 'PRO'
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                      : 'bg-gray-950/40 border-gray-800 hover:border-gray-700 text-gray-400'
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">👑 PRO</span>
                    <div className="w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center">
                      {tariff === 'PRO' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-lg font-bold text-white">250,000 QMS / ay</div>
                    <div className="text-xs text-gray-400 mt-1">LIGHT múmkinshilikleri + Üyde shınıǵıw ushın video-sabaqlar</div>
                  </div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              Dene Massası Indeksin Esaplaw <ArrowRight className="w-4 h-4" />
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="calc-result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            {/* BMI Display Card */}
            <div className="bg-gray-950/60 border border-gray-800/80 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Sizdiń BMI kórsetkishińiz</span>
                <div className="flex items-baseline justify-center md:justify-start gap-2">
                  <span className="text-5xl font-black text-white">{calculatedBmi}</span>
                  <span className="text-sm font-medium text-gray-500">kg/m²</span>
                </div>
                {calculatedStatus && (
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(calculatedStatus)}`}>
                    {calculatedStatus}
                  </div>
                )}
              </div>

              {/* Speedometer Gauge Visualizer */}
              <div className="relative w-44 h-24 flex items-end justify-center overflow-hidden">
                <svg className="w-full h-full transform translate-y-2" viewBox="0 0 100 50">
                  {/* Gauge Arc Background */}
                  <path d="M 10,50 A 40,40 0 0,1 90,50" fill="none" stroke="#1f2937" strokeWidth="8" strokeLinecap="round" />
                  
                  {/* Underweight Zone (Blue) */}
                  <path d="M 10,50 A 40,40 0 0,1 35,18" fill="none" stroke="#0284c7" strokeWidth="8" strokeOpacity="0.4" />
                  {/* Healthy Zone (Green) */}
                  <path d="M 35,18 A 40,40 0 0,1 65,18" fill="none" stroke="#10b981" strokeWidth="8" strokeOpacity="0.4" />
                  {/* Overweight Zone (Red) */}
                  <path d="M 65,18 A 40,40 0 0,1 90,50" fill="none" stroke="#f43f5e" strokeWidth="8" strokeOpacity="0.4" />
                  
                  {/* Needle Indicator */}
                  {(() => {
                    const bmi = calculatedBmi || 22;
                    // Map BMI from 15 to 35 onto angle range 180 to 0 degrees
                    const minBmi = 15;
                    const maxBmi = 35;
                    const percentage = Math.max(0, Math.min(1, (bmi - minBmi) / (maxBmi - minBmi)));
                    const angle = 180 - percentage * 180;
                    const radian = (angle * Math.PI) / 180;
                    const length = 35;
                    const needleX = 50 + length * Math.cos(radian);
                    const needleY = 50 - length * Math.sin(radian);

                    return (
                      <>
                        <line x1="50" y1="50" x2={needleX} y2={needleY} stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="50" cy="50" r="4" fill="#f59e0b" />
                      </>
                    );
                  })()}
                </svg>
                <div className="absolute bottom-0 text-[10px] text-gray-500 w-full flex justify-between px-2">
                  <span>15 (Arıq)</span>
                  <span>22 (Saǵlam)</span>
                  <span>35 (Artıqsha)</span>
                </div>
              </div>
            </div>

            {/* Assessment and Advice */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-950/40 border border-gray-800 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-amber-500">
                  <Info className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Dene túsindirmesi</span>
                </div>
                <p className="text-xs leading-relaxed text-gray-300">
                  {calculatedStatus === 'Saǵlam' && (
                    "Sizdiń dene massasıńız tamonlayın normada! Formanı turaqlı saqlaw hám júrek-qan tamır sistemasın jaqsılaw ushın sport penen belsendi shuǵıllanıp turıw kerek."
                  )}
                  {calculatedStatus === 'Salmaǵı kem (Arıq)' && (
                    "Dene salmaǵıńız kóbirek bolıwı kerek. Bizdiń belsendi shınıǵıwlar hám kásiplik bulshıq et jıynaw (gainer) dietası sizge salmaqtı tabıslı arttırıwǵa járdem beredi!"
                  )}
                  {calculatedStatus === 'Salmaǵı artıq (Arıqlaw kerek)' && (
                    "Artıqsha salmaq sawlıqqa hám buwınlarǵa zıyan keltiriwi múmkin. Kardio shınıǵıwlar hám maysız kók önimlerden ibarat dietamız arqalı maylardan tez qutılıp, jeńillikti sezinisińiz múmkin."
                  )}
                </p>
              </div>

              <div className="p-4 bg-gray-950/40 border border-gray-800 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-amber-500">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Topar waqtı hám Rekomendaciya</span>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">{calculatedGroup?.split(' - ')[0]}</div>
                  <div className="text-[11px] text-gray-400">{calculatedGroup?.split(' - ')[1]}</div>
                </div>
                <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-400">
                  <span>Saylanǵan Tarif:</span>
                  <span className={`font-semibold ${tariff === 'PRO' ? 'text-emerald-400' : 'text-amber-500'}`}>{tariff} Tarif</span>
                </div>
              </div>
            </div>

            {/* Confirm Registration Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setShowResult(false)}
                className="flex-1 bg-gray-950 border border-gray-800 hover:border-gray-700 text-gray-300 font-bold py-3 rounded-2xl transition-all text-xs cursor-pointer text-center"
              >
                Anketanı Ózgertiw
              </button>
              <button
                onClick={handleConfirmRegistration}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold py-3 rounded-2xl transition-all shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 text-xs cursor-pointer text-center"
              >
                {currentUser ? 'Maǵlıwmatlardı Jańalaw' : 'Dizimnen Ótiwdi Tásıyıqlaw'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
