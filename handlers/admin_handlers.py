import sqlite3
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
        "👑 <b>Admin Panelge xosh keldińiz!</b>\n\n"
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
            await message.bot.send_message(chat_id=user[0], text=f"📢 <b>ADMINISTRACIYADAN HABAR:</b>\n\n{msg_text}", parse_mode="HTML")
            success_count += 1
        except Exception:
            fail_count += 1
            
    await message.answer(
        f"📢 Habar tarqatıldı!\n\n"
        f"✅ Áwmetli jollanǵanlar: {success_count}\n"
        f"❌ Jetpegenler (botti bloklaǵanlar): {fail_count}",
        reply_markup=get_admin_keyboard()
    )

@admin_router.message(F.text == "🔙 Tiykarǵı Menyu")
async def exit_admin(message: Message):
    await message.answer("Tiykarǵı menyuǵa qayttıńız.", reply_markup=get_main_keyboard(is_registered=True))
