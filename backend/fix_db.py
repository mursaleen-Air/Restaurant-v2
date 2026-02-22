import os
import psycopg2
from app.core.config import settings

try:
    # URL format: postgresql+psycopg2://...
    # psycopg2 needs it without the +psycopg2 part, or just parsed
    db_url = settings.DATABASE_URL.replace("postgresql+psycopg2://", "postgresql://")
    
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cur = conn.cursor()
    
    cur.execute('ALTER TABLE "user" ADD COLUMN IF NOT EXISTS phone VARCHAR(50)')
    cur.execute('ALTER TABLE "user" ADD COLUMN IF NOT EXISTS is_guest INTEGER DEFAULT 0')
    print("Successfully added phone and is_guest columns to user table")
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
