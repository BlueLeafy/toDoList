import sqlite3

# Connect to database
db = sqlite3.connect("todo.db")

# Create cursor
cursor = db.cursor()

# Create table users
# cursor.execute("CREATE TABLE users(id INTEGER PRIMARY KEY, username TEXT NOT NULL, hash TEXT NOT NULL);")

# Create table tasks
# cursor.execute("CREATE TABLE tasks (task_id INTEGER PRIMARY KEY, user_id INTEGER, task_description TEXT NOT NULL, due_date TEXT, completed INTEGER DEFAULT 0, FOREIGN KEY (user_id) REFERENCES users(id));")

# Commit changes and close
db.commit()
db.close()