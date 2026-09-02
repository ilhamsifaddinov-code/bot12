import urllib.parse
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
            f"👋 <b>Xosh keldińiz, {user[2]}!</b>\n\n"
            f"🏆 <b>Dene Statusıńız:</b> {user[10]}\n"
            f"⭐ <b>Klub Gúretshisi:</b> {user[14]}\n\n"
            f"Deneńizdi jetilistiriw, kaloriya baqlaw hám onlayn sabaqlardan paydalanyp shınıǵıwlar baslaw ushın tómendegi menyudan kerekti bólimdi saylań. 💪",
            reply_markup=get_main_keyboard(is_registered=True),
            parse_mode="HTML"
        )
    else:
        await message.answer(
            "👋 <b>Sálem! Champion Gym fitness klubına xosh keldińiz!</b>\n\n"
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
            "⚡ <b>Kúnlik háreketshillik dárejeńizdi saylań:</b>\n\n"
            "🛋 <b>Pás</b>: Ofis jumısı, kóp otıramız\n"
            "🏃 <b>Orta</b>: Háptede 2-3 ret jeńil shınıǵıw\n"
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
    
    height_m = height / 100.0
    bmi = round(weight / (height_m ** 2), 1)
    
    if bmi < 18.5:
        status = "Azıpsız (Salmaq jıynaw kerek) 🟡"
    elif 18.5 <= bmi < 25:
        status = "Sálamat dene (Norma) 🟢"
    elif 25 <= bmi < 30:
        status = "Artıqsha salmaq (Azıw usınıs etiledi) 🟠"
    else:
        status = "Semizlik basqıshı 🔴"
    
    min_ideal = round(18.5 * (height_m ** 2), 1)
    max_ideal = round(24.9 * (height_m ** 2), 1)
    ideal_weight_str = f"{min_ideal} - {max_ideal} kg"

    if gender == "Erler":
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
        
    tdee = int(bmr * activity_factor)
    
    if age < 18:
        badge = "Jaslar Chempionı 🌟"
    elif age >= 18 and weight > 85 and gender == "Erler":
        badge = "Iron Warrior 🦾"
    elif gender == "Hayallar" and weight <= 60:
        badge = "Graceful Athlete 💃"
    else:
        badge = "Champion Gúretshisi 🏆"
      
    if gender == "Erler" or activity_label == "Joqarı":
        group_time = "Keshki topar (18:00 - 21:00)"
    else:
        group_time = "Túslik topar (14:00 - 17:00)"
        
    water_intake = round(weight * 0.035, 1)
    

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
        f"🎉 <b>ÁJAIP! Registraciya tabıslı tamamlandı!</b>\n\n"
        f"📊 <b>Siziń Dene Analizińiz (BMI):</b>\n"
        f"• Boy / Salmaq: <b>{height} sm / {weight} kg</b>\n"
        f"• Dene Indeksi: <b>{bmi}</b>\n"
        f"• Statusıńız: <b>{status}</b>\n"
        f"• Ideal Salmaǵıńız: <b>{ideal_weight_str}</b>\n\n"
        f"⚡ <b>Siziń Normativlerıńiz:</b>\n"
        f"• Kúnlik Suw: <b>{water_intake} Litr</b> 💧\n"
        f"• Kúnlik Kaloriya (TDEE): <b>{tdee} kcal</b> 🔥\n"
        f"• Sizge arnalǵan Status: <b>{badge}</b>\n"
        f"• Shınıǵıw toparı: <b>{group_time}</b>\n\n"
        f"Tiykarǵı menyu arqalı jeke QR-kodtı júkleń hám sporttı baslań!",
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

    qr_data = f"IRONBODY-MEMBER\nID: {user_id}\nName: {name}\nBadge: {badge}\nGroup: {group_time}\nCalories: {target_calories}"
    encoded_data = urllib.parse.quote(qr_data)
    qr_image_url = f"https://api.qrserver.com/v1/create-qr-code/?size=300x300&data={encoded_data}"

    caption_text = (
        f"🪪 <b>CHAMPION GYM | KLUB KARTASÍ</b>\n\n"
        f"👤 <b>Atı-Jóni:</b> {name}\n"
        f"🆔 <b>Klub ID:</b> <code>CG-{user_id}</code>\n"
        f"⭐ <b>Dene Statusı:</b> {badge}\n"
        f"🎂 <b>Jası:</b> {age}-da | ⚧ {user[4]}\n"
        f"📐 <b>Boyıńız:</b> {height} sm | ⚖️ <b>Salmaǵıńız:</b> {weight} kg\n"
        f"🩺 <b>Dene Indeksi (BMI):</b> {bmi_status}\n"
        f"🕒 <b>Sizdiń Toparıńız:</b> {group_time}\n"
        f"🔥 <b>Norma Kaloriya:</b> {target_calories} kcal\n\n"
        f"💡 <i>Zalǵa kirgende reception dıń QR skanerine usı suwretti kórsetiń!</i>"
    )

    try:
        await message.answer_photo(photo=qr_image_url, caption=caption_text, parse_mode="HTML")
    except Exception:
        await message.answer(f"⚠️ QR suwretin júklep bolmadı, biraq siziń maǵlıwmatlarıńız:\n\n{caption_text}", parse_mode="HTML")

@user_router.message(F.text == "📊 Dene Analizi (BMI)")
async def show_bmi_analysis(message: Message):
    user = db.get_user(message.from_user.id)
    if not user:
        await message.answer("⚠️ Dáslep dizimnen ótińiz!")
        return
        
    await message.answer(
        f"📊 <b>Dene Analizi hám Keńesler:</b>\n\n"
        f"• Dene Indeksi (BMI): <b>{user[9]}</b>\n"
        f"• Siziń jaǵdayıńız: <b>{user[10]}</b>\n"
        f"• Siziń boyıńız ushın ideal salmaq: <b>{user[11]}</b>\n\n"
        f"💡 <b>Trener Alisherden Keńes:</b>\n"
        f"🏃 <i>Aktivlik: {user[8]}\n"
        f"💦 Kúnlik suw normasın qatań baqlań: <b>{user[13]} Litr</b> suw ishiń.\n"
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
        "🥗 <b>Dieta & Kaloriya Baqlaw:</b>\n\n"
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
    
    
    if gender == "Erler":
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
        
    tdee = int(bmr * 1.55)
    
    if plan_type == "gain":
        target = tdee + 500
        response = (
            f"💪 <b>Salmaq Qosıw (Bulshıq et) Dieta Rejesi:</b>\n"
            f"🎯 Siziń kúnlik hám jeke kaloriya maqsetińiz: <b>{target} kcal</b>\n\n"
            f"⏱ <b>08:00 (Azanǵı awqat):</b> 3 pisken máyek, sút penen suli botaǵı (ovsyanka), 1 banan.\n"
            f"⏱ <b>11:00 (Lanch):</b> Bir uıs ǵoza yamasa badam, alma hám yogurt.\n"
            f"⏱ <b>14:00 (Túslik awqat):</b> Gúrish, tauıq góshi (file), salat.\n"
            f"⏱ <b>17:00 (Tresten keyingi awqat):</b> Sútli kokteyl, tvorog.\n"
            f"⏱ <b>20:00 (Keshki awqat):</b> Balıq yamasa gósh, qara gúrish (grechka), palız eginleri."
        )
    elif plan_type == "lose":
        target = tdee - 500
        response = (
            f"📉 <b>Salmaq Taslaw (Arıqlaw) Dieta Rejesi:</b>\n"
            f"🎯 Siziń kúnlik hám jeke kaloriya maqsetińiz: <b>{target} kcal</b>\n\n"
            f"⏱ <b>08:00 (Azanǵı awqat):</b> 2 qaslanǵan máyek (sarısız), jasıl shay.\n"
            f"⏱ <b>11:00 (Lanch):</b> 1 alma yamasa greypfrut.\n"
            f"⏱ <b>14:00 (Túslik awqat):</b> Qaslanǵan tauıq góshi, qara gúrish, jasıl salat.\n"
            f"⏱ <b>17:00 (Tresten keyingi awqat):</b> Kefir yamasa mayı az tvorog.\n"
            f"⏱ <b>20:00 (Keshki awqat):</b> Qaslanǵan balıq, kóp jasıllı salat."
        )
    else:
        target = tdee
        response = (
            f"🥗 <b>Durıs Awqatlanıw (Balans) Rejesi:</b>\n"
            f"🎯 Siziń kúnlik kaloriya maqsetińiz: <b>{target} kcal</b>\n\n"
            f"⏱ <b>08:00:</b> Máyekli quymoq (omlet), jasıl shay, suli nanı.\n"
            f"⏱ <b>11:00:</b> Birer jemis yamasa naturalnıı yogurt.\n"
            f"⏱ <b>14:00:</b> Góshli sorpa, jasıl palız eginleri salatı.\n"
            f"⏱ <b>17:00:</b> Tvorog yamasa bir uıs badam.\n"
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
    await callback.message.answer("✍️ <b>Jegen awqatıńızdıń atın kiritiń:</b>\n\n(mısalı: Tauıq pılao)", parse_mode="HTML")
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
            f"✅ Awqat qosıldı: <b>{food_name}</b> (+{calories} kcal)\n\n"
            f"📊 <b>Kúnlik Kaloriya progressıńız:</b>\n"
            f"<code>[{bar}]</code> {percent}%\n"
            f"• Jigenińiz: <b>{total_calories} kcal</b>\n"
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
        
    response = "📋 <b>Búgingi jegen awqatlarıńızdıń dizimi:</b>\n\n"
    total = 0
    for idx, log in enumerate(logs, 1):
        response += f"{idx}. <b>{log[0]}</b> - {log[1]} kcal\n"
        total += log[1]
        
    percent = min(100, int((total / target) * 100)) if target > 0 else 0
    filled = int(percent / 10)
    bar = "█" * filled + "░" * (10 - filled)
    
    response += (
        f"\n📊 <b>Ulıwma Kaloriya:</b>\n"
        f"<code>[{bar}]</code> {percent}%\n"
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
        "🎬 <b>Onlayn Shınıǵıw Sabaqları:</b>\n\n"
        "Qaysı bulshıq et toparın shınıqtıratuǵın onlayn videolardı kórgińiz keledi?\n"
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
            
    response = f"🎬 <b>Sabaqlar ({category if category != 'All' else 'Barlıq'}):</b>\n\n"
    for v in videos:
        title = v[0]
        url = v[1]
        desc = v[2]
        response += (
            f"📌 <b>{title}</b>\n"
            f"🔗 <b>Sılteme:</b> {url}\n"
            f"ℹ️ {desc}\n\n"
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
        "🏋️ <b>CHAMPION GYM INTERAKTIV SIMULYATORÍ:</b>\n\n"
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
            "🏋️ <b>Erkin salmaqlar zonası (Free Weights):</b>\n\n"
            "🔔 <b>Trener Alisher tapsırması:</b>\n"
            "• 4 jıyın x 12 márte Gantel qolların búgiw (Biceps curls)\n"
            "• 3 jıyın x 15 márte Gantel iyinge press (Dumbbell shoulder press)\n\n"
            "🔥 <b>Motivaciya:</b> Salmaqtı turaqlı saqlań, hár bir tákirarlawdı sezip isleń! Deneńizdiń jetilisiwin qadaǵalań! 💪"
        )
    elif zone == "mach":
        response = (
            "🧗 <b>Trenajyorlar zonası (Machines):</b>\n\n"
            "🔔 <b>Trener Alisher tapsırması:</b>\n"
            "• 4 jıyın x 10 márte Bloktı tómengi tartıw (Lat pulldown)\n"
            "• 3 jıyın x 12 márte Trenajyorda ayaq sozıw (Leg extension)\n\n"
            "🔥 <b>Motivaciya:</b> Trenajyorlar búlshıq etti sáykes hám ádep múnislewge járdem beredi. Tezlikti azaytıń hám texnikaǵa dıqqat etiń!"
        )
    elif zone == "cardio":
        response = (
            "🏃 <b>Kardio Zona (Cardio Zone):</b>\n\n"
            "🔔 <b>Trener Alisher tapsırması:</b>\n"
            "• Begovaya dorojkada 10 minut tez júriw (slope 4%)\n"
            "• Ellipste 15 minut intensiv shınıǵıw\n\n"
            "🔥 <b>Motivaciya:</b> Júrek qan-tamır sistemasın jaqsılap, búgingi kúnlik artıqsha kaloriyańızdı joq qılınız! 💦"
        )
    else:
        response = (
            "🧘 <b>Sozılıw hám Yoga zonası (Stretching):</b>\n\n"
            "🔔 <b>Trener Alisher tapsırması:</b>\n"
            "• 5 minut kóbik rolik arqalı arqa bulshıq etlerin uqalaw (Foam rolling)\n"
            "• Bútin denege arnalǵan 10 minutlıq sozılıw kónigiwler\n\n"
            "🔥 <b>Motivaciya:</b> Sozılıw - travmalardıń aldın aladı hám bulshıq etlerdiń tezirek tikleniwine járdem beredi! Re-lax ✨"
        )
        
    await callback.message.answer(response, parse_mode="HTML")
    await callback.answer()

@user_router.message(F.text == "📞 Biz benen baylanıs")
async def show_contact(message: Message):
    await message.answer(
        "📞 <b>Champion Gym Fitness Klubı:</b>\n\n"
        "📍 <b>Mánzil:</b> Nókis qalası, T.Qayıpbergenov kóshesi, 45-jay (Amfiteatr dál qasında)\n"
        "📞 <b>Telefon:</b> +998 (99) 450-40-50\n"
        "⏳ <b>Is waqtı:</b> 07:00 dan 22:00 ge shekem (Ekshembi dem alıs)\n\n"
        "🤖 Eger botta bidayatlıq tapsańız, yamasa usınısıńız bolsa, @GymAdmin akkountına jazsańız boladı.",
        parse_mode="HTML"
    )
