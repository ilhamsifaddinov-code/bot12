from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

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
