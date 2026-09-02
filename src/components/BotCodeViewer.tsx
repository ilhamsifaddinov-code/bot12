import { useState } from 'react';
import { motion } from 'motion/react';
import { Code, Copy, Check, Terminal, FileCode, Cpu } from 'lucide-react';

interface BotFile {
  name: string;
  path: string;
  content: string;
  description: string;
}

export default function BotCodeViewer() {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const botFiles: BotFile[] = [
    {
      name: 'main.py',
      path: 'main.py',
      description: 'Bottyń bas qozǵaltıwshı (entrypoint) faylı. Bazanı hám routerlardı iske túsiredi.',
      content: `import asyncio
import logging
from aiogram import Bot, Dispatcher
from aiogram.fsm.storage.memory import MemoryStorage

from config import BOT_TOKEN
from database import init_db
from handlers.user_handlers import user_router
from handlers.admin_handlers import admin_router

async def main():
    # Log jollaytuǵın jollarınıń baslanıwı
    logging.basicConfig(level=logging.INFO)
    
    # SQLite maǵlıwmatlar bazasın jaratıp alıw hám baslaw
    init_db()
    
    # Bot hám Dispatcher obyektlerin jaratıp alıw
    bot = Bot(token=BOT_TOKEN)
    dp = Dispatcher(storage=MemoryStorage())
    
    # Routerlardı dizimge alıw (Admin routeri birinshi bolıwı tiyis)
    dp.include_router(admin_router)
    dp.include_router(user_router)
    
    print("🤖 ===========================================")
    print("🤖 @ChampionGymNukusBot iske túsirildi!")
    print("🤖 Polling baslandı...")
    print("🤖 ===========================================")
    
    # Bot pollingin baslaw
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        print("\\n🤖 Bot toqtatıldı!")
`
    },
    {
      name: 'config.py',
      path: 'config.py',
      description: 'Bot tokeni hám Admin telegram ID parametorların saqlawshı sazlamalar faylı.',
      content: `BOT_TOKEN = "8782874533:AAEkey18GPzKJSnqJeXIANs7GBcKHXYtmrQ"
ADMIN_ID = 5888097104 # Ózińizdiń Telegram ID-ińizdi jazıń
`
    },
    {
      name: 'database.py',
      path: 'database.py',
      description: 'SQLite3 maglıwmatlar bazası menen islesiw ushın barlıq SQL soorawlar.',
      content: `import sqlite3

def init_db():
    conn = sqlite3.connect("gym_bot.db")
    cursor = conn.cursor()
    
    # Paydalanıwshılar kestesi (Extended with fitness parameters & creative fields)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        telegram_id INTEGER PRIMARY KEY,
        username TEXT,
        fullname TEXT,
        phone TEXT,
        gender TEXT,
        age INTEGER,
        height REAL,
        weight REAL,
        activity_level TEXT,
        bmi REAL,
        bmi_status TEXT,
        ideal_weight TEXT,
        target_calories INTEGER,
        water_intake REAL,
        badge TEXT,
        group_time TEXT,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Video sabaqlar kestesi
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        category TEXT,
        video_url TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Kúnlik awqatlanıw logı (Food Log)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS food_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        telegram_id INTEGER,
        food_name TEXT,
        calories INTEGER,
        logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    conn.commit()
    conn.close()

def add_user(telegram_id, username, fullname, phone, gender, age, height, weight, activity_level, bmi, bmi_status, ideal_weight, target_calories, water_intake, badge, group_time):
    conn = sqlite3.connect("gym_bot.db")
    cursor = conn.cursor()
    cursor.execute("""
        INSERT OR REPLACE INTO users (
            telegram_id, username, fullname, phone, gender, age, height, weight, 
            activity_level, bmi, bmi_status, ideal_weight, target_calories, water_intake, badge, group_time
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (telegram_id, username, fullname, phone, gender, age, height, weight, activity_level, bmi, bmi_status, ideal_weight, target_calories, water_intake, badge, group_time))
    conn.commit()
    conn.close()

def get_user(telegram_id):
    conn = sqlite3.connect("gym_bot.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE telegram_id = ?", (telegram_id,))
    user = cursor.fetchone()
    conn.close()
    return user

def add_food_log(telegram_id, food_name, calories):
    conn = sqlite3.connect("gym_bot.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO food_log (telegram_id, food_name, calories) VALUES (?, ?, ?)", (telegram_id, food_name, calories))
    conn.commit()
    conn.close()

def get_food_logs_today(telegram_id):
    conn = sqlite3.connect("gym_bot.db")
    cursor = conn.cursor()
    cursor.execute("SELECT food_name, calories, logged_at FROM food_log WHERE telegram_id = ?", (telegram_id,))
    logs = cursor.fetchall()
    conn.close()
    return logs

def clear_food_logs(telegram_id):
    conn = sqlite3.connect("gym_bot.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM food_log WHERE telegram_id = ?", (telegram_id,))
    conn.commit()
    conn.close()

def add_video(title, category, video_url, description):
    conn = sqlite3.connect("gym_bot.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO videos (title, category, video_url, description) VALUES (?, ?, ?, ?)", (title, category, video_url, description))
    conn.commit()
    conn.close()

def get_videos_by_category(category=None):
    conn = sqlite3.connect("gym_bot.db")
    cursor = conn.cursor()
    if category:
        cursor.execute("SELECT title, video_url, description FROM videos WHERE category = ? ORDER BY id DESC", (category,))
    else:
        cursor.execute("SELECT title, category, video_url, description FROM videos ORDER BY id DESC")
    videos = cursor.fetchall()
    conn.close()
    return videos
`
    },
    {
      name: 'user_handlers.py',
      path: 'handlers/user_handlers.py',
      description: 'Bot paydalanıwshılarınıń barlıq shınıǵıw dizimi, BMI esaplaw hám QR-kod soraǵı.',
      content: `import urllib.parse
import sqlite3
from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from aiogram.filters import CommandStart
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

import database as db
from keyboards.reply import get_main_keyboard, get_gender_keyboard, get_activity_keyboard
from keyboards.inline import (
    get_diet_plan_keyboard, get_diet_action_keyboard, 
    get_video_categories_keyboard, get_simulator_keyboard
)

user_router = Router()

class RegistrationState(StatesGroup):
    fullname = State()
    phone = State()
    gender = State()
    age = State()
    height = State()
    weight = State()
    activity_level = State()

class CalorieState(StatesGroup):
    food_name = State()
    calories = State()

@user_router.message(CommandStart())
async def cmd_start(message: Message, state: FSMContext):
    await state.clear()
    user = db.get_user(message.from_user.id)
    if user:
        await message.answer(
            f"👋 <b>Xosh keldińiz, {user[2]}!</b>\\n\\n"
            f"🏆 <b>Dene Statusıńız:</b> {user[10]}\\n"
            f"⭐ <b>Klub Gúretshisi:</b> {user[14]}\\n\\n"
            f"Deneńizdi jetilistiriw, kaloriya baqlaw hám onlayn sabaqlardan paydalanyp shınıǵıwlar baslaw ushın tómendegi menyudan kerekti bólimdi saylań. 💪",
            reply_markup=get_main_keyboard(is_registered=True),
            parse_mode="HTML"
        )
    else:
        await message.answer(
            "👋 <b>Sálem! Champion Gym fitness klubına xosh keldińiz!</b>\\n\\n"
            "Dene analizi (BMI), kúnlik suw hám kaloriya normasın tabıw hám "
            "sizge arnalǵan jeke QR-kodtı (Klub kartası) alıw ushın dáslep registraciyadan ótińiz.",
            reply_markup=get_main_keyboard(is_registered=False),
            parse_mode="HTML"
        )

@user_router.message(F.text == "📝 Dizimnen ótiw")
async def start_registration(message: Message, state: FSMContext):
    await message.answer("✍️ <b>Tólıq atı-jónińizdi kiritiń (F.I.O):</b>", parse_mode="HTML")
    await state.set_state(RegistrationState.fullname)

@user_router.message(RegistrationState.fullname)
async def process_fullname(message: Message, state: FSMContext):
    await state.update_data(fullname=message.text)
    await message.answer("📞 <b>Telefon nomerińizdi kiritiń (mısalı: +998901234567):</b>", parse_mode="HTML")
    await state.set_state(RegistrationState.phone)

@user_router.message(RegistrationState.phone)
async def process_phone(message: Message, state: FSMContext):
    await state.update_data(phone=message.text)
    await message.answer("⚧ <b>Jınısıńızdı saylań:</b>", reply_markup=get_gender_keyboard(), parse_mode="HTML")
    await state.set_state(RegistrationState.gender)

@user_router.message(RegistrationState.gender)
async def process_gender(message: Message, state: FSMContext):
    clean_gender = "Erler" if "Erler" in message.text else "Hayallar" if "Hayallar" in message.text else message.text
    if clean_gender not in ["Erler", "Hayallar"]:
        await message.answer("⚠️ Iltimas, tómendegi knopkalardan birin saylań!")
        return
    await state.update_data(gender=clean_gender)
    await message.answer("🎂 <b>Jasıńızdı kiritiń (mısalı: 22):</b>", parse_mode="HTML")
    await state.set_state(RegistrationState.age)

@user_router.message(RegistrationState.age)
async def process_age(message: Message, state: FSMContext):
    try:
        age = int(message.text)
        if age <= 0 or age > 120:
            raise ValueError()
        await state.update_data(age=age)
        await message.answer("📐 <b>Boyıńızdı kiritiń (santimetrde, mısalı: 175):</b>", parse_mode="HTML")
        await state.set_state(RegistrationState.height)
    except ValueError:
        await message.answer("⚠️ Iltimas, durıs jas muǵdarın kiritiń (mısalı: 25):")

@user_router.message(RegistrationState.height)
async def process_height(message: Message, state: FSMContext):
    try:
        height = float(message.text)
        if height <= 50 or height > 250:
            raise ValueError()
        await state.update_data(height=height)
        await message.answer("⚖️ <b>Dene salmaǵıńızdı kiritiń (kg-da, mısalı: 70):</b>", parse_mode="HTML")
        await state.set_state(RegistrationState.weight)
    except ValueError:
        await message.answer("⚠️ Iltimas, boydı santimetrde san menen kiritiń (mısalı: 175):")

@user_router.message(RegistrationState.weight)
async def process_weight(message: Message, state: FSMContext):
    try:
        weight = float(message.text)
        if weight <= 20 or weight > 300:
            raise ValueError()
        await state.update_data(weight=weight)
        await message.answer(
            "⚡ <b>Kúnlik háreketshillik dárejeńizdi saylań:</b>\\n\\n"
            "🛋 <b>Pás</b>: Ofis jumısı, kóp otıramız\\n"
            "🏃 <b>Orta</b>: Háptede 2-3 ret jeńil shınıǵıw\\n"
            "⚡ <b>Júdá joqarı</b>: Kúnlik awır jumıs yamasa professional sport",
            reply_markup=get_activity_keyboard(),
            parse_mode="HTML"
        )
        await state.set_state(RegistrationState.activity_level)
    except ValueError:
        await message.answer("⚠️ Iltimas, salmaqtı kg-da kiritiń (mısalı: 72.5):")

@user_router.message(RegistrationState.activity_level)
async def process_activity(message: Message, state: FSMContext):
    text = message.text
    activity_factor = 1.2
    activity_label = "Kam háreket"
    
    if "Orta" in text:
        activity_factor = 1.55
        activity_label = "Orta"
    elif "Júdá" in text:
        activity_factor = 1.9
        activity_label = "Joqarı"
        
    data = await state.get_data()
    fullname = data['fullname']
    phone = data['phone']
    gender = data['gender']
    age = data['age']
    height = data['height']
    weight = data['weight']
    
    # BMI esaplaw (BMI = weight / (height_m^2))
    height_m = height / 100.0
    bmi = round(weight / (height_m ** 2), 1)
    
    # BMI Status hám Emojiler
    if bmi < 18.5:
        status = "Azıpsız (Salmaq jıynaw kerek) 🟡"
    elif 18.5 <= bmi < 25:
        status = "Sálamat dene (Norma) 🟢"
    elif 25 <= bmi < 30:
        status = "Artıqsha salmaq (Azıw usınıs etiledi) 🟠"
    else:
        status = "Semizlik basqıshı 🔴"
        
    # Ideal Weight range
    min_ideal = round(18.5 * (height_m ** 2), 1)
    max_ideal = round(24.9 * (height_m ** 2), 1)
    ideal_weight_str = f"{min_ideal} - {max_ideal} kg"
    
    # BMR & TDEE (Mifflin-St Jeor)
    if gender == "Erler":
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
        
    tdee = int(bmr * activity_factor)
    
    # Creative Badge Selection
    if age < 18:
        badge = "Jaslar Chempionı 🌟"
    elif age >= 18 and weight > 85 and gender == "Erler":
        badge = "Iron Warrior 🦾"
    elif gender == "Hayallar" and weight <= 60:
        badge = "Graceful Athlete 💃"
    else:
        badge = "Champion Gúretshisi 🏆"
        
    # Suggeted Group Time
    if gender == "Erler" or activity_label == "Joqarı":
        group_time = "Keshki topar (18:00 - 21:00)"
    else:
        group_time = "Túslik topar (14:00 - 17:00)"
        
    water_intake = round(weight * 0.035, 1)
    
    # Bazaga jazıw
    db.add_user(
        telegram_id=message.from_user.id,
        username=message.from_user.username,
        fullname=fullname,
        phone=phone,
        gender=gender,
        age=age,
        height=height,
        weight=weight,
        activity_level=activity_label,
        bmi=bmi,
        bmi_status=status,
        ideal_weight=ideal_weight_str,
        target_calories=tdee,
        water_intake=water_intake,
        badge=badge,
        group_time=group_time
    )
    
    await state.clear()
    
    await message.answer(
        f"🎉 <b>ÁJAIP! Registraciya tabıslı tamamlandı!</b>\\n\\n"
        f"📊 <b>Siziń Dene Analizińiz (BMI):</b>\\n"
        f"• Boy / Salmaq: <b>{height} sm / {weight} kg</b>\\n"
        f"• Dene Indeksi: <b>{bmi}</b>\\n"
        f"• Statusıńız: <b>{status}</b>\\n"
        f"• Ideal Salmaǵıńız: <b>{ideal_weight_str}</b>\\n\\n"
        f"⚡ <b>Siziń Normativlerıńiz:</b>\\n"
        f"• Kúnlik Suw: <b>{water_intake} Litr</b> 💧\\n"
        f"• Kúnlik Kaloriya (TDEE): <b>{tdee} kcal</b> 🔥\\n"
        f"• Sizge arnalǵan Status: <b>{badge}</b>\\n"
        f"• Shınıǵıw toparı: <b>{group_time}</b>\\n\\n"
        f"Tiykarǵı menyu arqalı jeke QR-kodtı jollap sporttı baslań!",
        reply_markup=get_main_keyboard(is_registered=True),
        parse_mode="HTML"
    )

@user_router.message(F.text == "👤 Jeke Kabinet")
async def show_cabinet(message: Message):
    user = db.get_user(message.from_user.id)
    if not user:
        await message.answer("⚠️ Bot múmkinshiliklerinen paydalanıw ushın dáslep dizimnen ótińiz!", reply_markup=get_main_keyboard(is_registered=False))
        return
        
    user_id = user[0]
    name = user[2]
    age = user[5]
    height = user[6]
    weight = user[7]
    bmi_status = user[10]
    target_calories = user[12]
    badge = user[14]
    group_time = user[15]

    # Generate actual QR-Code
    qr_data = f"IRONBODY-MEMBER\\nID: {user_id}\\nName: {name}\\nBadge: {badge}\\nGroup: {group_time}\\nCalories: {target_calories}"
    encoded_data = urllib.parse.quote(qr_data)
    qr_image_url = f"https://api.qrserver.com/v1/create-qr-code/?size=300x300&data={encoded_data}"

    caption_text = (
        f"🪪 <b>CHAMPION GYM | KLUB KARTASÍ</b>\\n\\n"
        f"👤 <b>Atı-Jóni:</b> {name}\\n"
        f"🆔 <b>Klub ID:</b> <code>CG-{user_id}</code>\\n"
        f"⭐ <b>Dene Statusı:</b> {badge}\\n"
        f"🎂 <b>Jası:</b> {age}-da | ⚧ {user[4]}\\n"
        f"📐 <b>Boyıńız:</b> {height} sm | ⚖️ <b>Salmaǵıńız:</b> {weight} kg\\n"
        f"🩺 <b>Dene Indeksi (BMI):</b> {bmi_status}\\n"
        f"🕒 <b>Sizdiń Toparıńız:</b> {group_time}\\n"
        f"🔥 <b>Norma Kaloriya:</b> {target_calories} kcal\\n\\n"
        f"💡 <i>Zalǵa kirgende reception dıń QR skanerine usı suwretti kórsetiń!</i>"
    )

    try:
        await message.answer_photo(photo=qr_image_url, caption=caption_text, parse_mode="HTML")
    except Exception:
        await message.answer(f"⚠️ QR suwretin júklep bolmadı, biraq siziń maǵlıwmatlarıńız:\\n\\n{caption_text}", parse_mode="HTML")

@user_router.message(F.text == "📊 Dene Analizi (BMI)")
async def show_bmi_analysis(message: Message):
    user = db.get_user(message.from_user.id)
    if not user:
        await message.answer("⚠️ Dáslep dizimnen ótińiz!")
        return
        
    await message.answer(
        f"📊 <b>Dene Analizi hám Keńesler:</b>\\n\\n"
        f"• Dene Indeksi (BMI): <b>{user[9]}</b>\\n"
        f"• Siziń jaǵdayıńız: <b>{user[10]}</b>\\n"
        f"• Siziń boyıńız ushın ideal salmaq: <b>{user[11]}</b>\\n\\n"
        f"💡 <b>Trener Alisherden Keńes:</b>\\n"
        f"🏃 <i>Aktivlik: {user[8]}\\n"
        f"💦 Kúnlik suw normasın qatań baqlań: <b>{user[13]} Litr</b> suw ishiń.\\n"
        f"💪 Formanı jaqsılaw ushın kúnlik <b>{user[12]} kcal</b>-dan aspań yamasa asırmáń (maqsetke qaray).</i>",
        parse_mode="HTML"
    )

@user_router.message(F.text == "🍎 Dieta & Kaloriya")
async def show_diet_section(message: Message):
    user = db.get_user(message.from_user.id)
    if not user:
        await message.answer("⚠️ Dáslep dizimnen ótińiz!")
        return
        
    await message.answer(
        "🥗 <b>Dieta & Kaloriya Baqlaw:</b>\\n\\n"
        "Ózińizdiń maqsetińizge sáykes keletuǵın kúnlik dieta rejesin saylań yamasa kúnlik jegen awqatlarıńızdıń kaloriya logın júrgiziń:",
        reply_markup=get_diet_plan_keyboard(),
        parse_mode="HTML"
    )

@user_router.callback_query(F.data.startswith("diet_"))
async def handle_diet_selection(callback: CallbackQuery):
    plan_type = callback.data.split("_")[1]
    user_id = callback.from_user.id
    user = db.get_user(user_id)
    
    if not user:
        await callback.answer("Paydalanıwshı tabılmadı!", show_alert=True)
        return
        
    height = user[6]
    weight = user[7]
    age = user[5]
    gender = user[4]
    
    # BMR
    if gender == "Erler":
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
        
    tdee = int(bmr * 1.55)
    
    if plan_type == "gain":
        target = tdee + 500
        response = (
            f"💪 <b>Salmaq Qosıw (Bulshıq et) Dieta Rejesi:</b>\\n"
            f"🎯 Siziń kúnlik hám jeke kaloriya maqsetińiz: <b>{target} kcal</b>\\n\\n"
            f"⏱ <b>08:00 (Azanǵı awqat):</b> 3 pisken máyek, sút penen suli botaǵı (ovsyanka), 1 banan.\\n"
            f"⏱ <b>11:00 (Lanch):</b> Bir uıs ǵoza yamasa badam, alma hám yogurt.\\n"
            f"⏱ <b>14:00 (Túslik awqat):</b> Gúrish, tauıq góshi (file), salat.\\n"
            f"⏱ <b>17:00 (Tresten keyingi awqat):</b> Sútli kokteyl, tvorog.\\n"
            f"⏱ <b>20:00 (Keshki awqat):</b> Balıq yamasa gósh, qara gúrish (grechka), palız eginleri."
        )
    elif plan_type == "lose":
        target = tdee - 500
        response = (
            f"📉 <b>Salmaq Taslaw (Arıqlaw) Dieta Rejesi:</b>\\n"
            f"🎯 Siziń kúnlik hám jeke kaloriya maqsetińiz: <b>{target} kcal</b>\\n\\n"
            f"⏱ <b>08:00 (Azanǵı awqat):</b> 2 qaslanǵan máyek (sarısız), jasıl shay.\\n"
            f"⏱ <b>11:00 (Lanch):</b> 1 alma yamasa greypfrut.\\n"
            f"⏱ <b>14:00 (Túslik awqat):</b> Qaslanǵan tauıq góshi, qara gúrish, jasıl salat.\\n"
            f"⏱ <b>17:00 (Tresten keyingi awqat):</b> Kefir yamasa mayı az tvorog.\\n"
            f"⏱ <b>20:00 (Keshki awqat):</b> Qaslanǵan balıq, kóp jasıllı salat."
        )
    else:
        target = tdee
        response = (
            f"🥗 <b>Durıs Awqatlanıw (Balans) Rejesi:</b>\\n"
            f"🎯 Siziń kúnlik kaloriya maqsetińiz: <b>{target} kcal</b>\\n\\n"
            f"⏱ <b>08:00:</b> Máyekli quymoq (omlet), jasıl shay, suli nanı.\\n"
            f"⏱ <b>11:00:</b> Birer jemis yamasa naturalnıı yogurt.\\n"
            f"⏱ <b>14:00:</b> Góshli sorpa, jasıl palız eginleri salatı.\\n"
            f"⏱ <b>17:00:</b> Tvorog yamasa bir uıs badam.\\n"
            f"⏱ <b>20:00:</b> Gósh yamasa qaslanǵan tauıq, jańa pısken salat."
        )
        
    conn = sqlite3.connect("gym_bot.db")
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET target_calories = ? WHERE telegram_id = ?", (target, user_id))
    conn.commit()
    conn.close()
    
    await callback.message.answer(response, parse_mode="HTML", reply_markup=get_diet_action_keyboard())
    await callback.answer()

@user_router.callback_query(F.data == "add_food")
async def add_food_calorie(callback: CallbackQuery, state: FSMContext):
    await callback.message.answer("✍️ <b>Jegen awqatıńızdıń atın kiritiń:</b>\\n\\n(mısalı: Tauıq pılao)", parse_mode="HTML")
    await state.set_state(CalorieState.food_name)
    await callback.answer()

@user_router.message(CalorieState.food_name)
async def process_food_name(message: Message, state: FSMContext):
    await state.update_data(food_name=message.text)
    await message.answer("🔥 <b>Bul awqattıń kaloriya muǵdarın kiritiń (kcal):</b>", parse_mode="HTML")
    await state.set_state(CalorieState.calories)

@user_router.message(CalorieState.calories)
async def process_calories(message: Message, state: FSMContext):
    try:
        calories = int(message.text)
        if calories <= 0:
            raise ValueError()
        data = await state.get_data()
        food_name = data['food_name']
        
        db.add_food_log(message.from_user.id, food_name, calories)
        
        user = db.get_user(message.from_user.id)
        target = user[12] if user else 2000
        
        logs = db.get_food_logs_today(message.from_user.id)
        total_calories = sum(log[1] for log in logs)
        
        percent = min(100, int((total_calories / target) * 100)) if target > 0 else 0
        filled = int(percent / 10)
        bar = "█" * filled + "░" * (10 - filled)
        
        await state.clear()
        await message.answer(
            f"✅ Awqat qosıldı: <b>{food_name}</b> (+{calories} kcal)\\n\\n"
            f"📊 <b>Kúnlik Kaloriya progressıńız:</b>\\n"
            f"<code>[{bar}]</code> {percent}%\\n"
            f"• Jigenińiz: <b>{total_calories} kcal</b>\\n"
            f"• Maqset: <b>{target} kcal</b>",
            parse_mode="HTML"
        )
    except ValueError:
        await message.answer("⚠️ Iltimas, tek durıs kaloriya sanın kiritiń (mısalı: 350):")

@user_router.callback_query(F.data == "view_food_logs")
async def view_food_logs(callback: CallbackQuery):
    logs = db.get_food_logs_today(callback.from_user.id)
    user = db.get_user(callback.from_user.id)
    target = user[12] if user else 2000
    
    if not logs:
        await callback.message.answer("📝 Kúnlik awqatlanıw logıńız házi rásmiylestirilmegen. Birer nárse jegen bolsańız qosıńız!")
        await callback.answer()
        return
        
    response = "📋 <b>Búgingi jegen awqatlarıńızdıń dizimi:</b>\\n\\n"
    total = 0
    for idx, log in enumerate(logs, 1):
        response += f"{idx}. <b>{log[0]}</b> - {log[1]} kcal\\n"
        total += log[1]
        
    percent = min(100, int((total / target) * 100)) if target > 0 else 0
    filled = int(percent / 10)
    bar = "█" * filled + "░" * (10 - filled)
    
    response += (
        f"\\n📊 <b>Ulıwma Kaloriya:</b>\\n"
        f"<code>[{bar}]</code> {percent}%\\n"
        f"• Toplam jegenıńiz: <b>{total} / {target} kcal</b>"
    )
    
    await callback.message.answer(response, parse_mode="HTML")
    await callback.answer()

@user_router.callback_query(F.data == "clear_food")
async def clear_food(callback: CallbackQuery):
    db.clear_food_logs(callback.from_user.id)
    await callback.message.answer("🗑 Kúnlik awqatlanıw logıńız tabıslı tazalandı!")
    await callback.answer()

@user_router.message(F.text == "🎬 Onlayn Sabaqlar")
async def show_online_videos(message: Message):
    await message.answer(
        "🎬 <b>Onlayn Shınıǵıw Sabaqları:</b>\\n\\n"
        "Qaysı bulshıq et toparın shınıqtıratuǵın onlayn videolardı kórgińiz keledi?\\n"
        "<i>Tómendegi kategoriyalardan birin saylań:</i>",
        reply_markup=get_video_categories_keyboard(),
        parse_mode="HTML"
    )

@user_router.callback_query(F.data.startswith("cat_"))
async def filter_videos_by_category(callback: CallbackQuery):
    category = callback.data.split("_")[1]
    
    if category == "All":
        videos = db.get_videos_by_category()
    else:
        videos = db.get_videos_by_category(category)
        
    if not videos:
        if category == "Chest":
            videos = [("💪 Kókrek kónigiwleri (Push-ups, Bench Press)", "https://youtube.com/watch?v=dQw4w9WgXcQ", "Kókrek bulshıq etlerin úy sharayatında rawajlandırıw.")]
        elif category == "Back":
            videos = [("🪵 Arqa kónigiwi (Pull-ups)", "https://youtube.com/watch?v=dQw4w9WgXcQ", "Arqa hám iyin bulshıq etleri ushın kónigiwler kompleksi.")]
        elif category == "Legs":
            videos = [("🦵 Ayaq kónigiwi (Squats)", "https://youtube.com/watch?v=dQw4w9WgXcQ", "San, botqa hám ayaqtı shınıqtırıw ushın eń kerekli kónigiw.")]
        elif category == "Cardio":
            videos = [("🏃 Kardio (Fat Burn)", "https://youtube.com/watch?v=dQw4w9WgXcQ", "Tez hám intensiv tasiyle arqalı salmaq taslaw.")]
        else:
            videos = [
                ("💪 Kókrek kónigiwi", "https://youtube.com/watch?v=dQw4w9WgXcQ", "Kókrek bulshıq etlerin rawajlandırıw."),
                ("🏃 Kardio (Fat Burn)", "https://youtube.com/watch?v=dQw4w9WgXcQ", "Tez hám intensiv tasiyle arqalı salmaq taslaw.")
            ]
            
    response = f"🎬 <b>Sabaqlar ({category if category != 'All' else 'Barlıq'}):</b>\\n\\n"
    for v in videos:
        title = v[0]
        url = v[1]
        desc = v[2]
        response += (
            f"📌 <b>{title}</b>\\n"
            f"🔗 <b>Sılteme:</b> {url}\\n"
            f"ℹ️ {desc}\\n\\n"
        )
        
    await callback.message.answer(response, parse_mode="HTML")
    await callback.answer()

@user_router.message(F.text == "🏋️ Shınıǵıw Baslaw")
async def start_interactive_workout(message: Message):
    user = db.get_user(message.from_user.id)
    if not user:
        await message.answer("⚠️ Dáslep dizimnen ótińiz!")
        return
        
    await message.answer(
        "🏋️ <b>CHAMPION GYM INTERAKTIV SIMULYATORÍ:</b>\\n\\n"
        "Zalımızdaǵı barlıq zonalar iske qosılǵan. "
        "Qaysı zonada shınıǵıwdı baslamaqshısız? <i>Trener Alisher sizge kúnlik tapsırmanı jollaydı:</i>",
        reply_markup=get_simulator_keyboard(),
        parse_mode="HTML"
    )

@user_router.callback_query(F.data.startswith("sim_"))
async def process_sim_zone(callback: CallbackQuery):
    zone = callback.data.split("_")[1]
    
    if zone == "free":
        response = (
            "🏋️ <b>Erkin salmaqlar zonası (Free Weights):</b>\\n\\n"
            "🔔 <b>Trener Alisher tapsırması:</b>\\n"
            "• 4 jıyın x 12 márte Gantel qolların búgiw (Biceps curls)\\n"
            "• 3 jıyın x 15 márte Gantel iyinge press (Dumbbell shoulder press)\\n\\n"
            "🔥 <b>Motivaciya:</b> Salmaqtı turaqlı saqlań, hár bir tákirarlawdı sezip isleń! Deneńizdiń jetilisiwin qadaǵalań! 💪"
        )
    elif zone == "mach":
        response = (
            "🧗 <b>Trenajyorlar zonası (Machines):</b>\\n\\n"
            "🔔 <b>Trener Alisher tapsırması:</b>\\n"
            "• 4 jıyın x 10 márte Bloktı tómengi tartıw (Lat pulldown)\\n"
            "• 3 jıyın x 12 márte Trenajyorda ayaq sozıw (Leg extension)\\n\\n"
            "🔥 <b>Motivaciya:</b> Trenajyorlar búlshıq etti sáykes hám ádep múnislewge járdem beredi. Tezlikti azaytıń hám texnikaǵa dıqqat etiń!"
        )
    elif zone == "cardio":
        response = (
            "🏃 <b>Kardio Zona (Cardio Zone):</b>\\n\\n"
            "🔔 <b>Trener Alisher tapsırması:</b>\\n"
            "• Begovaya dorojkada 10 minut tez júriw (slope 4%)\\n"
            "• Ellipste 15 minut intensiv shınıǵıw\\n\\n"
            "🔥 <b>Motivaciya:</b> Júrek qan-tamır sistemasın jaqsılap, búgingi kúnlik artıqsha kaloriyańızdı joq qılınız! 💦"
        )
    else:
        response = (
            "🧘 <b>Sozılıw hám Yoga zonası (Stretching):</b>\\n\\n"
            "🔔 <b>Trener Alisher tapsırması:</b>\\n"
            "• 5 minut kóbik rolik arqalı arqa bulshıq etlerin uqalaw (Foam rolling)\\n"
            "• Bútin denege arnalǵan 10 minutlıq sozılıw kónigiwler\\n\\n"
            "🔥 <b>Motivaciya:</b> Sozılıw - travmalardıń aldın aladı hám bulshıq etlerdiń tezirek tikleniwine járdem beredi! Re-lax ✨"
        )
        
    await callback.message.answer(response, parse_mode="HTML")
    await callback.answer()

@user_router.message(F.text == "📞 Biz benen baylanıs")
async def show_contact(message: Message):
    await message.answer(
        "📞 <b>Champion Gym Fitness Klubı:</b>\\n\\n"
        "📍 <b>Mánzil:</b> Nókis qalası, T.Qayıpbergenov kóshesi, 45-jay (Amfiteatr dál qasında)\\n"
        "📞 <b>Telefon:</b> +998 (99) 450-40-50\\n"
        "⏳ <b>Is waqtı:</b> 07:00 dan 22:00 ge shekem (Ekshembi dem alıs)\\n\\n"
        "🤖 Eger botta bidayatlıq tapsańız, yamasa usınısıńız bolsa, @GymAdmin akkountına jazsańız boladı.",
        parse_mode="HTML"
    )
`
    },
    {
      name: 'admin_handlers.py',
      path: 'handlers/admin_handlers.py',
      description: 'Coach Alisher ushın bazaga onlayn shınıǵıw videoların qosıw hám monitoring paneli.',
      content: `import sqlite3
from aiogram import Router, F
from aiogram.types import Message
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

from config import ADMIN_ID
from keyboards.reply import get_admin_keyboard, get_main_keyboard

admin_router = Router()

class VideoUploadState(StatesGroup):
    title = State()
    category = State()
    video_url = State()
    description = State()

class BroadcastState(StatesGroup):
    message_text = State()

def is_admin(user_id):
    return user_id == ADMIN_ID

@admin_router.message(Command("admin"))
async def cmd_admin(message: Message):
    if not is_admin(message.from_user.id):
        await message.answer("⚠️ Keshiresiz, bul buyrıq tek administratorlar ushın!")
        return
        
    await message.answer(
        "👑 <b>Admin Panelge xosh keldińiz!</b>\\n\\n"
        "Tómendegi adminlik funktsiyalarınan paydalana alasız:",
        reply_markup=get_admin_keyboard(),
        parse_mode="HTML"
    )

@admin_router.message(F.text == "📊 Paydalanıwshılar Sanı")
async def show_user_count(message: Message):
    if not is_admin(message.from_user.id):
        return
        
    conn = sqlite3.connect("gym_bot.db")
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM users")
    count = cursor.fetchone()[0]
    conn.close()
    
    await message.answer(f"👥 Bottaǵı ulıwma dizimnen ótken paydalanıwshılar sanı: <b>{count} adam</b>", parse_mode="HTML")

@admin_router.message(F.text == "➕ Video Sabaq Qosıw")
async def start_add_video(message: Message, state: FSMContext):
    if not is_admin(message.from_user.id):
        return
        
    await message.answer("🎬 Sabaqtıń atamasın kiritiń (Mısalı: Arqa bulshıq etlerin shınıqtırıw):")
    await state.set_state(VideoUploadState.title)

@admin_router.message(VideoUploadState.title)
async def process_video_title(message: Message, state: FSMContext):
    await state.update_data(title=message.text)
    await message.answer("📂 Kategoriyanı kiritiń (Kerekli: Chest, Back, Legs, Cardio):")
    await state.set_state(VideoUploadState.category)

@admin_router.message(VideoUploadState.category)
async def process_video_category(message: Message, state: FSMContext):
    cat_text = message.text
    if "kókrek" in cat_text.lower() or "chest" in cat_text.lower():
        cat_text = "Chest"
    elif "arqa" in cat_text.lower() or "back" in cat_text.lower():
        cat_text = "Back"
    elif "ayaq" in cat_text.lower() or "legs" in cat_text.lower():
        cat_text = "Legs"
    elif "kardio" in cat_text.lower() or "cardio" in cat_text.lower():
        cat_text = "Cardio"
        
    await state.update_data(category=cat_text)
    await message.answer("🔗 Video sıltemesin (URL) kiritiń (Mısalı: YouTube silteme):")
    await state.set_state(VideoUploadState.video_url)

@admin_router.message(VideoUploadState.video_url)
async def process_video_url(message: Message, state: FSMContext):
    await state.update_data(video_url=message.text)
    await message.answer("📝 Sabaq haqqında qısqasha maǵlıwmat (opisanie):")
    await state.set_state(VideoUploadState.description)

@admin_router.message(VideoUploadState.description)
async def process_video_desc(message: Message, state: FSMContext):
    data = await state.get_data()
    title = data['title']
    category = data['category']
    video_url = data['video_url']
    description = message.text
    
    conn = sqlite3.connect("gym_bot.db")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO videos (title, category, video_url, description) VALUES (?, ?, ?, ?)",
        (title, category, video_url, description)
    )
    conn.commit()
    conn.close()
    
    await state.clear()
    await message.answer("✅ Jańa onlayn video sabaq áwmetli qosıldı!", reply_markup=get_admin_keyboard())

@admin_router.message(F.text == "📢 Reklama Jiberiw")
async def start_broadcast(message: Message, state: FSMContext):
    if not is_admin(message.from_user.id):
        return
        
    await message.answer("📢 Tarqatılatuǵın habar mánisin kiritiń:")
    await state.set_state(BroadcastState.message_text)

@admin_router.message(BroadcastState.message_text)
async def process_broadcast(message: Message, state: FSMContext):
    msg_text = message.text
    await state.clear()
    
    conn = sqlite3.connect("gym_bot.db")
    cursor = conn.cursor()
    cursor.execute("SELECT telegram_id FROM users")
    users = cursor.fetchall()
    conn.close()
    
    success_count = 0
    fail_count = 0
    
    for user in users:
        try:
            await message.bot.send_message(chat_id=user[0], text=f"📢 <b>ADMINISTRACIYADAN HABAR:</b>\\n\\n{msg_text}", parse_mode="HTML")
            success_count += 1
        except Exception:
            fail_count += 1
            
    await message.answer(
        f"📢 Habar tarqatıldı!\\n\\n"
        f"✅ Áwmetli jollanǵanlar: {success_count}\\n"
        f"❌ Jetpegenler (botti bloklaǵanlar): {fail_count}",
        reply_markup=get_admin_keyboard()
    )

@admin_router.message(F.text == "🔙 Tiykarǵı Menyu")
async def exit_admin(message: Message):
    await message.answer("Tiykarǵı menyuǵa qayttıńız.", reply_markup=get_main_keyboard(is_registered=True))
`
    },
    {
      name: 'reply.py',
      path: 'keyboards/reply.py',
      description: 'Bottyń tiykarǵı hám adminlik menyu klaviaturaların generaciya etiwshi modul.',
      content: `from aiogram.types import ReplyKeyboardMarkup, KeyboardButton

def get_main_keyboard(is_registered=False):
    if not is_registered:
        keyboard = [
            [KeyboardButton(text="📝 Dizimnen ótiw")],
            [KeyboardButton(text="📞 Biz benen baylanıs")]
        ]
    else:
        keyboard = [
            [KeyboardButton(text="👤 Jeke Kabinet"), KeyboardButton(text="📊 Dene Analizi (BMI)")],
            [KeyboardButton(text="🍎 Dieta & Kaloriya"), KeyboardButton(text="🎬 Onlayn Sabaqlar")],
            [KeyboardButton(text="🏋️ Shınıǵıw Baslaw"), KeyboardButton(text="📞 Biz benen baylanıs")]
        ]
    return ReplyKeyboardMarkup(keyboard=keyboard, resize_keyboard=True)

def get_gender_keyboard():
    keyboard = [
        [KeyboardButton(text="Erler 🤵"), KeyboardButton(text="Hayallar 🙋‍♀️")]
    ]
    return ReplyKeyboardMarkup(keyboard=keyboard, resize_keyboard=True)

def get_activity_keyboard():
    keyboard = [
        [KeyboardButton(text="🛋 Pás (Kam háreket)")],
        [KeyboardButton(text="🏃 Orta (Shınıǵıwlar bar)")],
        [KeyboardButton(text="⚡ Júdá joqarı (Sportshı)")]
    ]
    return ReplyKeyboardMarkup(keyboard=keyboard, resize_keyboard=True)

def get_admin_keyboard():
    keyboard = [
        [KeyboardButton(text="📊 Paydalanıwshılar Sanı"), KeyboardButton(text="➕ Video Sabaq Qosıw")],
        [KeyboardButton(text="📢 Reklama Jiberiw"), KeyboardButton(text="🔙 Tiykarǵı Menyu")]
    ]
    return ReplyKeyboardMarkup(keyboard=keyboard, resize_keyboard=True)
`
    },
    {
      name: 'inline.py',
      path: 'keyboards/inline.py',
      description: 'LIGHT hám PRO tariflerin saylaw ushın inline knopkalar.',
      content: `from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

def get_diet_plan_keyboard():
    keyboard = [
        [
            InlineKeyboardButton(text="💪 Salmaq Qosıw (Bulshıq et)", callback_data="diet_gain"),
            InlineKeyboardButton(text="📉 Salmaq Taslaw (Arıqlaw)", callback_data="diet_lose")
        ],
        [
            InlineKeyboardButton(text="🥗 Durıs Awqatlanıw (Balans)", callback_data="diet_balance")
        ]
    ]
    return InlineKeyboardMarkup(inline_keyboard=keyboard)

def get_diet_action_keyboard():
    keyboard = [
        [
            InlineKeyboardButton(text="➕ Awqat qosıw (Kaloriya)", callback_data="add_food"),
            InlineKeyboardButton(text="📋 Kúnlik logtı kóriw", callback_data="view_food_logs")
        ],
        [
            InlineKeyboardButton(text="🗑 Logtı tazalaw", callback_data="clear_food")
        ]
    ]
    return InlineKeyboardMarkup(inline_keyboard=keyboard)

def get_video_categories_keyboard():
    keyboard = [
        [
            InlineKeyboardButton(text="💪 Kókrek (Chest)", callback_data="cat_Chest"),
            InlineKeyboardButton(text="🪵 Arqa (Back)", callback_data="cat_Back")
        ],
        [
            InlineKeyboardButton(text="🦵 Ayaq (Legs)", callback_data="cat_Legs"),
            InlineKeyboardButton(text="🏃 Kardio (Cardio)", callback_data="cat_Cardio")
        ],
        [
            InlineKeyboardButton(text="⭐ Barlıq videolar", callback_data="cat_All")
        ]
    ]
    return InlineKeyboardMarkup(inline_keyboard=keyboard)

def get_simulator_keyboard():
    keyboard = [
        [
            InlineKeyboardButton(text="🏋️ Erkin salmaqlar", callback_data="sim_free"),
            InlineKeyboardButton(text="🧗 Trenajyorlar", callback_data="sim_mach")
        ],
        [
            InlineKeyboardButton(text="🏃 Kardio Zona", callback_data="sim_cardio"),
            InlineKeyboardButton(text="🧘 Sozılıw Zonasını", callback_data="sim_stretch")
        ]
    ]
    return InlineKeyboardMarkup(inline_keyboard=keyboard)
`
    }
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(botFiles[activeFileIndex].content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeFile = botFiles[activeFileIndex];

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-500 animate-pulse">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">🤖 Telegram Bot Python Faylları (Kerekli barlıq kodlar)</h2>
            <p className="text-xs text-gray-400">Telegram botıńızdı Python arqalı kompyuterińizde iske túsiriw ushın barlıq fayllar jıynaǵı</p>
          </div>
        </div>
      </div>

      {/* Guide steps */}
      <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
          <Terminal className="w-4 h-4" /> BOTTI KOMPYUTERDE ISKE TÚSIRIW QADAM-BADA-QADAM
        </h3>
        <ol className="text-xs text-gray-300 space-y-2 list-decimal pl-4 leading-relaxed">
          <li>Kompyuterińizde jańa papka ashp, onıń ishinde tómendegi fayllardı dál óz atı menen jaratıń.</li>
          <li>Kerekli programmalardı ornatıń (Terminalda): <code className="bg-black/60 text-amber-500 px-2 py-0.5 rounded font-mono">pip install aiogram</code></li>
          <li><span className="text-white font-semibold">config.py</span> faylındaǵı <code className="text-amber-500 font-mono">BOT_TOKEN</code> di ózińizdiń @BotFather bergen tokenińizge ózgertiń.</li>
          <li>Iske túsiriw ushın terminalda: <code className="bg-black/60 text-amber-500 px-2 py-0.5 rounded font-mono">python main.py</code> buyrıǵın jollasńız jetkilikli!</li>
        </ol>
      </div>

      {/* Code panel structure */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left selector: Files list */}
        <div className="lg:col-span-1 space-y-2.5">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Fayllar Dizimi</span>
          <div className="space-y-1.5">
            {botFiles.map((file, idx) => (
              <button
                key={file.name}
                onClick={() => {
                  setActiveFileIndex(idx);
                  setCopied(false);
                }}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                  activeFileIndex === idx
                    ? 'bg-amber-500/10 border-amber-500/40 text-white font-bold'
                    : 'bg-gray-950/40 border-gray-850 text-gray-400 hover:text-white hover:border-gray-800'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <FileCode className={`w-4 h-4 shrink-0 ${activeFileIndex === idx ? 'text-amber-500' : 'text-gray-500'}`} />
                  {file.name}
                </span>
                <span className="text-[9px] text-gray-600 font-mono">py</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right view: Actual code viewer */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between bg-gray-950/60 p-3 rounded-t-2xl border-t border-x border-gray-850">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-gray-400 font-mono ml-2">/{activeFile.path}</span>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-850 text-[11px] text-gray-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Kóshirildi!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-500" />
                  Kodtı kóshiriw
                </>
              )}
            </button>
          </div>

          <div className="relative">
            {/* Description block */}
            <div className="p-3.5 bg-gray-950/40 border-x border-gray-850 text-[11px] text-gray-400 leading-relaxed italic border-b">
              ℹ️ <span className="font-bold text-gray-300">Sıpati:</span> {activeFile.description}
            </div>

            {/* Code Body */}
            <pre className="bg-black/90 p-5 rounded-b-2xl text-xs font-mono text-emerald-400 overflow-x-auto max-h-[440px] leading-relaxed border-x border-b border-gray-850 select-text">
              <code>{activeFile.content}</code>
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
}
