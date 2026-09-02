import sqlite3

def init_db():
    conn = sqlite3.connect("gym_bot.db")
    cursor = conn.cursor()
    
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

if __name__ == "__main__":
    init_db()
    print("Maglıwmatlar bazası áwmetli iske túsirildi!")
