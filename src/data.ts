import { Video, Meal } from './types';

export const INITIAL_VIDEOS: Video[] = [
  {
    id: 'vid-1',
    title: 'Fat Burn Extreme - Üy sharayatında arıqlaw',
    category: 'cardio',
    duration: '15:20',
    difficulty: 'Ortasha',
    videoUrl: 'https://www.youtube.com/embed/50kH47ZOMUw',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=60',
    description: 'Arıtqsha salmaqtan qutılıw hám kardio belsendiligin arttırıw ushın júdá de paydalı intensiv shınıǵıwlar.'
  },
  {
    id: 'vid-2',
    title: 'Biceps & Triceps - Qol bulshıq etlerin rawajlandırıw',
    category: 'strength',
    duration: '20:15',
    difficulty: 'Qıyın',
    videoUrl: 'https://www.youtube.com/embed/kR7P6X40y_Y',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=60',
    description: 'Gantel járdeminde qoldıń barlıq bulshıq etlerin kóbeytiw hám kúshaytiriw dástúri.'
  },
  {
    id: 'vid-3',
    title: 'Yoga hám Shınıǵıwdan sońǵı deneni bosastırıw',
    category: 'stretch',
    duration: '12:45',
    difficulty: 'Ańsat',
    videoUrl: 'https://www.youtube.com/embed/GLy2rYHwUqY',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=60',
    description: 'Auyr shınıǵıwlardan soń bulshıq etlerdi sozuw, tınıshlanıw hám turaqlı tınıs alıw boyınsha sabaqlıq.'
  },
  {
    id: 'vid-4',
    title: 'Azanǵı denedi qızdırıw (Warmup Drill)',
    category: 'warmup',
    duration: '08:30',
    difficulty: 'Ańsat',
    videoUrl: 'https://www.youtube.com/embed/H0W80W80o3w',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&auto=format&fit=crop&q=60',
    description: 'Kúndi energiyalı baslaw hám shınıǵıwdan aldın jaraqat alıp qalmaw ushın deneni qızdırıw.'
  },
  {
    id: 'vid-5',
    title: 'Core Blast - Abs & Planks belsendi shınıǵıwı',
    category: 'strength',
    duration: '18:10',
    difficulty: 'Qıyın',
    videoUrl: 'https://www.youtube.com/embed/dJlFmxiL11s',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=60',
    description: 'Baspa (press) bulshıq etlerin shınıqtırıw, belsendi plankalar hám deneniń teń salmaqlılıǵın jaqsılaw.'
  },
  {
    id: 'vid-6',
    title: 'Full Body HIIT Workout - Jerde turaqlı júgiriw',
    category: 'cardio',
    duration: '25:00',
    difficulty: 'Qıyın',
    videoUrl: 'https://www.youtube.com/embed/Mvo23grN_y4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&auto=format&fit=crop&q=60',
    description: 'Búkil denedegi may qatlamların belsendi eritiw ushın arnawlı HIIT (Joqarı intensiv) sabaǵı.'
  }
];

export const DIET_PLANS: Record<'Saǵlam' | 'Salmaǵı kem (Arıq)' | 'Salmaǵı artıq (Arıqlaw kerek)', Meal[]> = {
  'Saǵlam': [
    { name: 'Súli botqası jemişler menen', calories: 350, protein: 12, carbs: 55, fats: 8, time: 'Túske shekem (Azan)' },
    { name: 'Tovuq filesi gúrish hám salat', calories: 550, protein: 45, carbs: 60, fats: 10, time: 'Túski awqat' },
    { name: 'Grechka balıq hám zeytun mayı', calories: 450, protein: 35, carbs: 45, fats: 12, time: 'Keshki awqat' },
    { name: 'Tvorog jemişler menen yamasa badam', calories: 250, protein: 20, carbs: 15, fats: 8, time: 'Poldnik (Snack)' }
  ],
  'Salmaǵı kem (Arıq)': [
    { name: 'Súli botqası + Banan + Jer fındıq mayı + 3 máyek', calories: 650, protein: 28, carbs: 80, fats: 22, time: 'Túske shekem (Azan)' },
    { name: 'Gúrish penen belsendi qovurılǵan gósh hám ovoshlar', calories: 800, protein: 50, carbs: 100, fats: 18, time: 'Túski awqat' },
    { name: 'Kartoshka pyuresi hám belsendi balıq yamasa gósh', calories: 700, protein: 45, carbs: 85, fats: 15, time: 'Keshki awqat' },
    { name: 'Geyner kokteyli yamasa kóbirek badam/fındıq', calories: 400, protein: 25, carbs: 50, fats: 12, time: 'Poldnik (Snack)' }
  ],
  'Salmaǵı artıq (Arıqlaw kerek)': [
    { name: 'Súli botqası (suvda) hám 3 máyek (sarısız)', calories: 280, protein: 18, carbs: 35, fats: 4, time: 'Túske shekem (Azan)' },
    { name: 'Suvda pisken tovuq filesi hám belsendi kók salat', calories: 380, protein: 40, carbs: 20, fats: 6, time: 'Túski awqat' },
    { name: 'Pisken balıq (yamasa duxovkada) hám brokkoli/búdir', calories: 320, protein: 35, carbs: 15, fats: 8, time: 'Keshki awqat' },
    { name: 'Kók alma yamasa 1 stakan maysız kefır', calories: 120, protein: 5, carbs: 15, fats: 1, time: 'Poldnik (Snack)' }
  ]
};

export const COMMON_FOODS = [
  { name: 'Tovuq filesi (100g)', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
  { name: 'Suvda pisken gúrish (100g)', calories: 130, protein: 2.7, carbs: 28, fats: 0.3 },
  { name: 'Grechka (100g)', calories: 120, protein: 4.2, carbs: 25, fats: 0.8 },
  { name: 'Súli botqası (100g)', calories: 389, protein: 16.9, carbs: 66, fats: 6.9 },
  { name: 'Máyek (1 dona)', calories: 70, protein: 6, carbs: 0.6, fats: 5 },
  { name: 'Banan (1 dona)', calories: 105, protein: 1.3, carbs: 27, fats: 0.3 },
  { name: 'Maysız tvorog (100g)', calories: 90, protein: 18, carbs: 3, fats: 0.2 },
  { name: 'Badam fındıq (30g)', calories: 175, protein: 6, carbs: 6, fats: 15 },
  { name: 'Alma (1 dona)', calories: 80, protein: 0.5, carbs: 20, fats: 0.2 },
  { name: 'Suvda pisken balıq (100g)', calories: 110, protein: 22, carbs: 0, fats: 2.5 }
];
