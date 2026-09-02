from aiogram.types import ReplyKeyboardMarkup, KeyboardButton

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
