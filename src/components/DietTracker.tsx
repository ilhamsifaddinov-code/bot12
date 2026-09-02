import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, FoodLogItem } from '../types';
import { DIET_PLANS, COMMON_FOODS } from '../data';
import { Plus, Search, Calendar, Apple, Flame, ChevronRight, Trash2, Award, Zap } from 'lucide-react';

interface DietTrackerProps {
  user: User;
  foodLogs: FoodLogItem[];
  onLogFood: (foodItem: Omit<FoodLogItem, 'id' | 'timestamp'>) => void;
  onClearFoodLog: (id: string) => void;
}

export default function DietTracker({ user, foodLogs, onLogFood, onClearFoodLog }: DietTrackerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [customName, setCustomName] = useState('');
  const [customCal, setCustomCal] = useState<number | ''>('');
  const [customProt, setCustomProt] = useState<number | ''>('');
  const [customCarbs, setCustomCarbs] = useState<number | ''>('');
  const [customFats, setCustomFats] = useState<number | ''>('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Dynamic target calculations based on user status (from Python bot recommendations)
  const getDailyTargets = () => {
    switch (user.status) {
      case 'Salmaǵı kem (Arıq)':
        return { calories: 2800, protein: 140, carbs: 320, fats: 85 };
      case 'Salmaǵı artıq (Arıqlaw kerek)':
        return { calories: 1700, protein: 130, carbs: 160, fats: 45 };
      case 'Saǵlam':
      default:
        return { calories: 2200, protein: 120, carbs: 240, fats: 65 };
    }
  };

  const targets = getDailyTargets();

  // Logged totals
  const totals = foodLogs.reduce(
    (acc, item) => {
      acc.calories += item.calories;
      acc.protein += item.protein;
      acc.carbs += item.carbs;
      acc.fats += item.fats;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const filteredCommonFoods = COMMON_FOODS.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogCommonFood = (food: typeof COMMON_FOODS[0]) => {
    onLogFood({
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats,
    });
  };

  const handleLogCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customCal) return;

    onLogFood({
      name: customName,
      calories: Number(customCal),
      protein: Number(customProt || 0),
      carbs: Number(customCarbs || 0),
      fats: Number(customFats || 0),
    });

    // Reset Form
    setCustomName('');
    setCustomCal('');
    setCustomProt('');
    setCustomCarbs('');
    setCustomFats('');
    setShowCustomForm(false);
  };

  // Percentages
  const calPercent = Math.min(100, Math.round((totals.calories / targets.calories) * 100));
  const protPercent = Math.min(100, Math.round((totals.protein / targets.protein) * 100));
  const carbsPercent = Math.min(100, Math.round((totals.carbs / targets.carbs) * 100));
  const fatsPercent = Math.min(100, Math.round((totals.fats / targets.fats) * 100));

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400">
          <Apple className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">🍎 Dieta Sınayıqları & Kaloriya Baqlawı</h2>
          <p className="text-xs text-gray-400">Statusıńızǵa say taǵamlar hám kúnlik energetikalıq balans jurnali</p>
        </div>
      </div>

      {/* Targets and Circular Progress Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calorie Ring Bar */}
        <div className="lg:col-span-1 bg-gray-950/60 border border-gray-800/60 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kúnlik Kaloriya Balansı</span>
          
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Circle Progress */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#1f2937" strokeWidth="8" fill="transparent" />
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                stroke="#f43f5e" 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * calPercent) / 100}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black text-white">{totals.calories}</span>
              <span className="text-[10px] text-gray-400">Target: {targets.calories} kcal</span>
            </div>
          </div>

          <div className="text-xs font-bold text-rose-400">
            {calPercent}% toltırıldı
          </div>
        </div>

        {/* Macros Ring bars */}
        <div className="lg:col-span-2 bg-gray-950/60 border border-gray-800/60 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dene ushın kerekli makroelementler</span>

          <div className="space-y-4">
            {/* Protein */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-300 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Belok (Protein)
                </span>
                <span className="text-gray-400 font-mono">
                  {totals.protein}g / <span className="text-white font-bold">{targets.protein}g</span>
                </span>
              </div>
              <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${protPercent}%` }} />
              </div>
            </div>

            {/* Carbs */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-300 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Uglevodlar (Carbs)
                </span>
                <span className="text-gray-400 font-mono">
                  {totals.carbs}g / <span className="text-white font-bold">{targets.carbs}g</span>
                </span>
              </div>
              <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${carbsPercent}%` }} />
              </div>
            </div>

            {/* Fats */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-300 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  Maylar (Fats)
                </span>
                <span className="text-gray-400 font-mono">
                  {totals.fats}g / <span className="text-white font-bold">{targets.fats}g</span>
                </span>
              </div>
              <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                <div className="h-full bg-sky-400 rounded-full transition-all duration-500" style={{ width: `${fatsPercent}%` }} />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-900 flex items-center gap-2 text-[10px] text-gray-500 leading-normal">
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            Eger shınıǵıwlardan soń turaqlı belok qabıllasańız, bulshıq etlerin rawajlandırıw álbette teziwaydı.
          </div>
        </div>
      </div>

      {/* Personalized Meal Plan suggestions */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
          💡 {user.status} ushın belsendili dietası
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DIET_PLANS[user.status]?.map((meal, index) => (
            <div key={index} className="bg-gray-950/40 border border-gray-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider">{meal.time}</span>
                <h4 className="text-xs font-bold text-white mt-1">{meal.name}</h4>
              </div>
              <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono pt-2 border-t border-gray-900">
                <span>{meal.calories} kcal</span>
                <span>B: {meal.protein}g</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Food selection column */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Taǵamdı dizimge qosıw</h3>
            <button
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
            >
              {showCustomForm ? '🔍 Tezkor Taǵamlar' : '✏️ Jeke taǵam qosıw'}
            </button>
          </div>

          {!showCustomForm ? (
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Taǵamdı izlew..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-950/80 border border-gray-800 rounded-xl py-2 px-4 pl-10 text-xs text-white focus:outline-none focus:border-rose-500/50 transition-colors"
                />
                <Search className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-gray-500" />
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {filteredCommonFoods.map((food, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center bg-gray-950/40 border border-gray-850 rounded-xl p-3 text-xs hover:border-rose-500/20 transition-all"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{food.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                        {food.calories} kcal | B: {food.protein}g, U: {food.carbs}g, M: {food.fats}g
                      </div>
                    </div>
                    <button
                      onClick={() => handleLogCommonFood(food)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-black transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogCustomFood} className="bg-gray-950/60 border border-gray-800 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-white">Jeke Taǵam Sifatların Jazıń</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-[9px] text-gray-400">Ataması</label>
                  <input
                    type="text"
                    required
                    placeholder="Mısalı: Mırsh hám salat"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-rose-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-gray-400">Kaloriya (kcal)</label>
                  <input
                    type="number"
                    required
                    placeholder="250"
                    value={customCal}
                    onChange={(e) => setCustomCal(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-rose-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-gray-400">Belok (Protein g)</label>
                  <input
                    type="number"
                    placeholder="15"
                    value={customProt}
                    onChange={(e) => setCustomProt(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-rose-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-gray-400">Uglevod (Carbs g)</label>
                  <input
                    type="number"
                    placeholder="30"
                    value={customCarbs}
                    onChange={(e) => setCustomCarbs(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-rose-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-gray-400">May (Fats g)</label>
                  <input
                    type="number"
                    placeholder="5"
                    value={customFats}
                    onChange={(e) => setCustomFats(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-rose-500/50"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-2 bg-rose-500 hover:bg-rose-600 text-black font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Taǵamdı Qosıw
              </button>
            </form>
          )}
        </div>

        {/* Daily logs logs list column */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Búgin qabıllanǵan taǵamlar</h3>

          <div className="bg-gray-950/40 border border-gray-800 rounded-2xl p-4 min-h-[160px] max-h-[270px] overflow-y-auto space-y-2 pr-1">
            {foodLogs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-10 text-center text-[10px] text-gray-500">
                🌱 Házirshe hámme nárse taza. Búgin jegen taǵamlarıńızdı qosıp, energiya esaplawdı baslań.
              </div>
            ) : (
              foodLogs.map((log) => (
                <div key={log.id} className="flex justify-between items-center bg-gray-900/40 border border-gray-850 rounded-xl p-2 px-3 text-xs">
                  <div>
                    <div className="text-xs font-bold text-white">{log.name}</div>
                    <div className="text-[10px] text-gray-500 font-mono flex gap-2 mt-0.5">
                      <span>{log.calories} kcal</span>
                      <span>B: {log.protein}g</span>
                      <span>U: {log.carbs}g</span>
                      <span>M: {log.fats}g</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onClearFoodLog(log.id)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
