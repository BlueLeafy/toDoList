# ToDo List Application

## Description
A web-based ToDo List application built with Flask, allowing users to create, manage, and categorize tasks efficiently. Users can log in, create folders and lists, and manage tasks with due dates.

## Features
- User authentication (login and registration)
- Create and manage folders for task lists
- Create and manage tasks with due dates
- Mark tasks as completed
- View tasks categorized by lists and folders

## Requirements
- Python 3.x
- Flask
- Flask-Session
- Werkzeug
- SQLite

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/yourrepository.git
   cd yourrepository

2. ** Set up a virtual enviroment **:
   python -m venv venv
   source /venv/bin/activate # On Windoes use `venv\Scripts\activate`

3. ** Install dependencies **:
   pip install -r requirements.txt

## Running the Application
flask run

## Directory structure
yourrepository/
│
├── templates/           # Contains HTML templates
│   ├── index.html
│   ├── authentication/
│   │   ├── login.html
│   │   └── register.html
│
├── static/              # Contains static files (CSS, JS)
│
├── todo.db              # SQLite database file
├── app.py               # Main application file
├── requirements.txt     # Python dependencies
└── README.md            # This README file

## Contributing

Contributions are welcome! If you find a bug or have a feature request, feel free to open an issue or submit a pull request.

## Licence

### Instructions to Customize
- Replace `yourusername` and `yourrepository` with your actual GitHub username and repository name.
- Adjust any sections as necessary based on your project specifics (e.g., if there are additional features or specific instructions).

### Next Steps
- Create a `requirements.txt` file that lists all dependencies for the project, which should include `Flask`, `Flask-Session`, and any other libraries you're using.
- If you have a license, ensure the LICENSE file is included in the repository.

Feel free to ask if you need further adjustments or any additional information!

