import asyncio
import logging
from aiogram import Bot, Dispatcher
from aiogram.fsm.storage.memory import MemoryStorage

from config import BOT_TOKEN
from database import init_db
from handlers.user_handlers import user_router
from handlers.admin_handlers import admin_router

async def main():
    logging.basicConfig(level=logging.INFO)
    
    
    init_db()
    
    
    bot = Bot(token=BOT_TOKEN)
    dp = Dispatcher(storage=MemoryStorage())
    
    dp.include_router(admin_router)
    dp.include_router(user_router)
    
    print("🤖 ===========================================")
    print("🤖 @ChampionGymNukusBot iske túsirildi!")
    print("🤖 Polling baslandı...")
    print("🤖 ===========================================")
    
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        print("\n🤖 Bot toqtatıldı!")
