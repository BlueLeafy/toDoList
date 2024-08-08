from flask import Flask, render_template, jsonify, request, redirect, flash, session, g
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime, date

import sqlite3

from helpers import apology, login_required

app = Flask(__name__)

# Configure session to use filesystem (instead of cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure SQLite database
DATABASE = "todo.db"

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE, check_same_thread=False)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

@app.template_filter('format_date')
def format_date_filter(value, format_str="%A %d %b, %Y %H:%M"):
    try:
        if value is not None and value != "":
            # Check if the datetime string includes time information
            if len(value) == 10:
                dt_obj = datetime.strptime(value, "%Y-%m-%d")
                return dt_obj.strftime("%A %d %b, %Y")
            else:
                dt_obj = datetime.strptime(value, "%Y-%m-%d %H:%M")
                return dt_obj.strftime(format_str)
        else:
            return None
    except ValueError:
        return None
                    
def username_exists(username):
    with get_db() as conn:
        result = conn.execute("SELECT id FROM users WHERE username = ?", (username,))
        return result.fetchone() is not None
    
def get_users_folders(user_id):
    with get_db() as conn:
        query = "SELECT user_id, folder_id, folder_name FROM folders WHERE user_id = ?"
        cursor = conn.execute(query, (user_id,))
        rows = cursor.fetchall()
        columns = [column[0] for column in cursor.description]
        folders = [dict(zip(columns, row)) for row in rows]

    return folders

def get_users_lists(user_id, list_name=None):
    with get_db() as conn:
        if list_name:
            query = "SELECT list_id, user_id, folder_id, list_name FROM lists WHERE user_id = ? AND list_name = ?"
            cursor = conn.execute(query, (user_id, list_name))
        else:
            query = "SELECT list_id, user_id, folder_id, list_name FROM lists WHERE user_id = ?"
            cursor = conn.execute(query, (user_id,))

        rows = cursor.fetchall()
        columns = [column[0] for column in cursor.description]
        lists = [dict(zip(columns, row)) for row in rows]

        if list_name and not lists:
            # If the list name doesn't exists for the user, return None
            return None

    return lists

def get_user_tasks(user_id, completed=False, list_id=None):
    with get_db() as conn:
        # Fetch tasks for the specified list_id or all tasks if list_id is None
        if list_id is not None:
            query = "SELECT task_id, user_id, task_description, due_datetime, completed FROM tasks WHERE user_id = ? AND completed = ? AND list_id = ?"
            cursor = conn.execute(query, (user_id, int(completed), list_id))
        else:
            query = "SELECT task_id, user_id, task_description, due_datetime, completed FROM tasks WHERE user_id = ? AND completed = ?"
            cursor = conn.execute(query, (user_id, int(completed)))

        rows = cursor.fetchall()
        columns = [column[0] for column in cursor.description]
        tasks = [dict(zip(columns, row)) for row in rows]

    return tasks

@app.route("/fetch_tasks")
def fetch_tasks():
    # Get the list ID and include_today parameter from the query parameters
    list_id = request.args.get("list_id")

    # Fetch tasks based on the list ID and include_today parameter
    if list_id is not None:
            tasks = get_user_tasks(session["user_id"], list_id=list_id)
    else:
        # If no list ID is provided, fetch all tasks
        tasks = get_user_tasks(session["user_id"])

    # Return the tasks as a JSON response
    return jsonify(tasks)

@app.route("/")
@login_required
def index():
    # Get the selected list ID from query parameters
    selected_list_id = request.args.get("list_id")

    # Predefined list IDs
    predefined_list_ids = [1, 2]

    # Fetch user-specific lists and folders
    tasks = get_user_tasks(session["user_id"])
    lists = get_users_lists(session["user_id"])
    folders = get_users_folders(session["user_id"])
    userName = username_exists(session["user_id"])

    # Check if the selected list ID is not provided or is not one if the predefined list IDs
    if not selected_list_id or int(selected_list_id) not in predefined_list_ids:
        # Set the selected_list_id to the ID f the "Today" list
        selected_list_id = "1" # List ID "Today" is 1

    # Render the template with the tasks, lists, folders, and selected list ID
    return render_template("index.html", tasks=tasks, lists=lists, folders=folders, selected_list_id=selected_list_id, userName=userName, predefined_list_ids=predefined_list_ids)

@app.route("/login", methods=["GET", "POST"])
def login():
    session.clear()
    username_error = None
    password_error = None
    login_error = None

    if request.method == "POST":
        if not request.form.get("username"):
            username_error = "Please provide a username"
        elif not request.form.get("password"):
            password_error = "Please provide a password"
        else:
            with get_db() as conn:
                cursor = conn.execute("SELECT * FROM users WHERE username = ?", (request.form.get("username"), ))
                row = cursor.fetchone()

            if not row or not check_password_hash(row[2], request.form.get("password")):
                login_error = "Invalid username and/or passwrod."
            else:
                session["user_id"] = row[0]
                return redirect("/")

    return render_template("authentication/login.html", username_error=username_error, password_error=password_error, login_error=login_error)

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

@app.route("/register", methods=["GET", "POST"])
def register():
    username_error = None
    password_error = None
    password_confirmation_error = None
    registration_error = None

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")

        if not username:
            username_error = "Must provide username"
        elif username_exists(username):
            username_error = "Username already exists"

        if not password:
            password_error = "Must provide password"

        if not confirmation:
            password_confirmation_error = "Must provide password confirmation"

        if password != confirmation:
            registration_error = "Passwords do not match"
        elif username_error is None and password_error is None and password_confirmation_error is None:
            hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
            with get_db() as conn:
                conn.execute("INSERT INTO users (username, hash) VALUES (?, ?)", (username, hashed_password))
            return render_template("login.html")

    return render_template("authentication/register.html", username_error=username_error, password_error=password_error, password_confirmation_error=password_confirmation_error, registration_error=registration_error)

@app.route("/new_folder", methods=["POST"])
def new_folder():
    if request.method == "POST":
        folderName = request.form.get("folderName")

        if folderName:
            with get_db() as conn:
                conn.execute("INSERT INTO folders (user_id, folder_name) VALUES (?, ?)", (session["user_id"], folderName))

            return redirect("/")
        else:
            flash("Folder name required")
            return redirect("/")
        
    return redirect("/")


@app.route("/new_list", methods=["POST"])
def new_list():
    # in which are grouped the tasks in sublists
    if request.method == "POST":
        nameList = request.form.get("nameList")
        folderId = request.form.get("folderId")

        if nameList:
            with get_db() as conn:
                conn.execute("INSERT INTO lists (user_id, list_name, folder_id) VALUES (?, ?, ?)", (session["user_id"], nameList, folderId))

            return redirect("/")
        else:
            flash("List name must not be empty")
            return redirect("/")

    return redirect("/")

@app.route("/new_task", methods=["POST"])
def new_task():
    new_task_description = request.form.get("new_task")
    # Get the list id from the form or request parameters
    list_id = request.form.get("list_id")
        
    # Check if new_task is not empty
    if new_task_description:
        new_task_date = request.form.get("new_task_date")
        new_task_time = request.form.get("new_task_time")

        # Combine date and time into a single datetime string
        due_datetime_str = f"{new_task_date} {new_task_time}"

        try:
            # Set datetime to midnight if not user input
            with get_db() as conn:
                cursor = conn.cursor()
                cursor.execute("INSERT INTO tasks (user_id, list_id, task_description, due_datetime) VALUES (?, ?, ?, ?)", (session["user_id"], list_id, new_task_description, due_datetime_str))

                # Fetch the last row ID
                new_task_id = cursor.lastrowid

                # Fetch the completition column
                cursor.execute("SELECT completed FROM tasks WHERE task_id = ?", (new_task_id,))
                completed_task = cursor.fetchone()[0]

                conn.commit()

                # Construct JSON response with task details
                task_details = {
                    "task_id": new_task_id,
                    "task_description": new_task_description,
                    "list_id": list_id,
                    "due_datetime": due_datetime_str,
                    "completed": completed_task
                }

                return jsonify(task_details)
        except ValueError:
            # Handle invalid date or time format
            print("Invalid date or time format", "error")
            return redirect("/")
    else:
        # Handle empty task description
        print("Task description cannot be empty", "error")
        return redirect("/")
    
def update_task_completion_status(task_id, completed_status):
    with get_db() as db:
        db.execute('UPDATE tasks SET completed = ? WHERE task_id = ?', (completed_status, task_id))
        db.commit()

@app.route("/edit_task/<int:task_id>", methods=["POST"])
def edit_task(task_id):
    app.logger.info("Edit task route accessed")

    try:
        edited_description = request.json.get("edited_description")
        app.logger.info(f"Received edited description: {edited_description}")

        with get_db() as conn:
            conn.execute("UPDATE tasks SET task_description = ? WHERE task_id = ?", (edited_description, task_id))
            conn.commit()

        app.logger.info("Task description updated successfully")
        return jsonify(success=True)
    except Exception as e:
        app.logger.error(f"Error updating task description: {e}")
        return jsonify(success=False, error=str(e))

@app.route("/completed_task/<int:task_id>", methods=["POST"])
def completed_task(task_id):
    if request.method == 'POST':
        completed_status = 1 if 'task_completed' in request.form else 0
        update_task_completion_status(task_id, completed_status)
        
    # Redirect
    return redirect("/")

@app.route("/delete_task/<int:task_id>", methods=["POST"])
def delete_task(task_id):
    if request.method == 'POST':
        with get_db() as conn:
            # Delete the task
            conn.execute("DELETE FROM tasks WHERE task_id = ?", (task_id,))
            conn.commit()

    # Redirect
    return redirect("/")


# Task details tab
@app.route('/task_details/<int:task_id>')
def task_details(task_id):
    with get_db() as conn:
        query = "SELECT task_description, due_datetime FROM tasks WHERE task_id = ?"
        cursor = conn.execute(query, (task_id,))
        row = cursor.fetchone()
        if row:
            task_description, due_datetime = row
            detail_query = "SELECT detail_text FROM task_details WHERE task_id = ?"
            detail_cursor = conn.execute(detail_query, (task_id,))
            detail_row = detail_cursor.fetchone()
            detail_text = detail_row[0] if detail_row else None
            return jsonify(task_description=task_description, due_datetime=due_datetime, detail_text=detail_text)
        else:
            return jsonify(error="task not found"), 404

# Editing task details
@app.route("/edit_detail_text/<int:task_id>", methods=["POST"])
def edit_detail_text(task_id):
    if request.method == 'POST':
        editedDetailText = request.json.get("editedDetailText")

        with get_db() as conn:
            # Check if a record fir the task_id already exists
            existing_record = conn.execute("SELECT * FROM task_details WHERE task_id = ?", (task_id,)).fetchone()

            if existing_record:
                # Update the sxisting record
                conn.execute("UPDATE task_details SET detail_text = ? WHERE task_id = ?", (editedDetailText, task_id))
            else:
                # Insert new record
                conn.execute("INSERT INTO task_details (task_id, detail_text) VALUES (?, ?)", (task_id, editedDetailText))

            conn.commit()

        # Return a JSON response indicating success
        return jsonify(success=True)

    # Return a JSON response indicating failure
    return jsonify(success=False)

if __name__ == "__main__":
    app.run(debug=True)
