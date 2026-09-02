import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Video } from '../types';
import { Users, DollarSign, PlusCircle, Trash, Shield, Upload, Play, Award, HelpCircle } from 'lucide-react';

interface AdminPanelProps {
  members: User[];
  onDeleteMember: (id: string) => void;
  onUpdateTariff: (id: string, tariff: 'LIGHT' | 'PRO') => void;
  onAddVideo: (video: Omit<Video, 'id'>) => void;
}

export default function AdminPanel({ members, onDeleteMember, onUpdateTariff, onAddVideo }: AdminPanelProps) {
  // Video upload form state
  const [vidTitle, setVidTitle] = useState('');
  const [vidCategory, setVidCategory] = useState<'cardio' | 'strength' | 'stretch' | 'warmup'>('cardio');
  const [vidDuration, setVidDuration] = useState('15:00');
  const [vidDifficulty, setVidDifficulty] = useState<'Ańsat' | 'Ortasha' | 'Qıyın'>('Ortasha');
  const [vidUrl, setVidUrl] = useState('');
  const [vidDesc, setVidDesc] = useState('');
  const [videoAddedSuccess, setVideoAddedSuccess] = useState(false);

  // Stats calculation
  const totalMembers = members.length;
  const proCount = members.filter(m => m.tariff === 'PRO').length;
  const lightCount = totalMembers - proCount;
  
  // Simulated revenue calculation (LIGHT = 150k QMS, PRO = 250k QMS)
  const totalRevenue = members.reduce((sum, m) => {
    return sum + (m.tariff === 'PRO' ? 250000 : 150000);
  }, 0);

  const averageBmi = totalMembers > 0 
    ? parseFloat((members.reduce((sum, m) => sum + m.bmi, 0) / totalMembers).toFixed(1))
    : 0;

  const handleUploadVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vidTitle || !vidUrl) return;

    // Convert standard youtube watch url to embed format if needed
    let embedUrl = vidUrl;
    if (vidUrl.includes('watch?v=')) {
      const vidId = vidUrl.split('v=')[1]?.split('&')[0];
      if (vidId) embedUrl = `https://www.youtube.com/embed/${vidId}`;
    }

    onAddVideo({
      title: vidTitle,
      category: vidCategory,
      duration: vidDuration,
      difficulty: vidDifficulty,
      videoUrl: embedUrl,
      thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=60', // random fallback
      description: vidDesc || "Admin panel arqalı qosılǵan arnawlı shınıǵıw sabaǵı."
    });

    setVidTitle('');
    setVidUrl('');
    setVidDesc('');
    setVideoAddedSuccess(true);
    setTimeout(() => setVideoAddedSuccess(false), 3000);
  };

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-500">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">👑 Iron Body Admin Basqarıw Paneli</h2>
            <p className="text-xs text-gray-400">Gym aǵzaların hám onlayn videolardı monitoring qılıw sisteması</p>
          </div>
        </div>
        <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
          COACH ALISHER MODE
        </span>
      </div>

      {/* Metrics Dashboard Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Members */}
        <div className="bg-gray-950/60 border border-gray-800/60 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Jámi aǵzalar</span>
            <div className="text-2xl font-black text-white">{totalMembers}</div>
            <div className="text-[9px] text-gray-400">
              LIGHT: {lightCount} | <span className="text-emerald-400 font-bold">PRO: {proCount}</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Revenue counter */}
        <div className="bg-gray-950/60 border border-gray-800/60 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Aylıq Túsini</span>
            <div className="text-2xl font-black text-emerald-400">{totalRevenue.toLocaleString()} QMS</div>
            <div className="text-[9px] text-gray-400">Simulyaciya qılınǵan tabıs</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Average BMI */}
        <div className="bg-gray-950/60 border border-gray-800/60 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Ortasha BMI</span>
            <div className="text-2xl font-black text-white">{averageBmi}</div>
            <div className="text-[9px] text-gray-400">Dene massası indeksi ortashası</div>
          </div>
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Active Class Groups */}
        <div className="bg-gray-950/60 border border-gray-800/60 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Kelisler Monitoringi</span>
            <div className="text-2xl font-black text-amber-500">
              {members.reduce((sum, m) => sum + m.checkInCount, 0)} ret
            </div>
            <div className="text-[9px] text-gray-400">Jámi QR-kod arqalı kelisler</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
            <PlusCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Members Table (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gym Aǵzaları Reestri</h3>
          
          <div className="bg-gray-950/40 border border-gray-800 rounded-2xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-900/60 text-gray-400 font-mono text-[10px] border-b border-gray-850">
                <tr>
                  <th className="p-4 font-bold">Karta ID & Atı</th>
                  <th className="p-4 font-bold">Jas / Salmaq</th>
                  <th className="p-4 font-bold">Status / Topar</th>
                  <th className="p-4 font-bold">Tarif</th>
                  <th className="p-4 font-bold text-right">Ameller</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-850">
                {members.map(member => (
                  <tr key={member.id} className="hover:bg-gray-900/20 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">{member.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono mt-0.5">IB-{member.id.toUpperCase()}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-300">{member.age} jasta</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{member.weight} kg | {member.height} sm</div>
                    </td>
                    <td className="p-4">
                      <div className="text-amber-500 font-semibold text-[11px]">{member.status}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5 max-w-[140px] truncate">{member.groupTime.split(' - ')[0]}</div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => onUpdateTariff(member.id, member.tariff === 'PRO' ? 'LIGHT' : 'PRO')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                          member.tariff === 'PRO' 
                            ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20'
                        }`}
                      >
                        {member.tariff}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onDeleteMember(member.id)}
                        className="p-1.5 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                        title="Aǵzanı Óshiriw"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Video Uploader Form Column (1 col) */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Youtubetan Video Sabaq Qosıw</h3>

          <form onSubmit={handleUploadVideo} className="bg-gray-950/60 border border-gray-800 rounded-2xl p-5 space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-semibold">Video Ataması</label>
              <input
                type="text"
                required
                placeholder="Mısalı: Press shınıǵıwı rawajlanıwı"
                value={vidTitle}
                onChange={(e) => setVidTitle(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-semibold">Kategoriya</label>
                <select
                  value={vidCategory}
                  onChange={(e) => setVidCategory(e.target.value as any)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500/50"
                >
                  <option value="cardio">Kardio</option>
                  <option value="strength">Kúsh shınıǵıwı</option>
                  <option value="stretch">Sozılıw (Stretch)</option>
                  <option value="warmup">Warmup</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-semibold">Uzaqlıǵı</label>
                <input
                  type="text"
                  required
                  placeholder="Mısalı: 15:45"
                  value={vidDuration}
                  onChange={(e) => setVidDuration(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] text-gray-400 font-semibold">Dene Qıyınlıǵı</label>
                <select
                  value={vidDifficulty}
                  onChange={(e) => setVidDifficulty(e.target.value as any)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500/50"
                >
                  <option value="Ańsat">Ańsat</option>
                  <option value="Ortasha">Ortasha</option>
                  <option value="Qıyın">Qıyın</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-semibold">Youtube Siltemesi (URL)</label>
              <input
                type="text"
                required
                placeholder="Mısalı: https://www.youtube.com/watch?v=..."
                value={vidUrl}
                onChange={(e) => setVidUrl(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-semibold">Túsindirme (Description)</label>
              <textarea
                placeholder="Shınıǵıw haqqında belsendi maglıwmat jazıń..."
                value={vidDesc}
                onChange={(e) => setVidDesc(e.target.value)}
                rows={3}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500/50 resize-none"
              />
            </div>

            {videoAddedSuccess && (
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-lg text-center animate-pulse">
                ✅ Video tabıslı bazaga qosıldı hám barlıq PRO aǵzalarda payda boldı!
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-extrabold py-3 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" /> Videonı Bazaga Júklew
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
