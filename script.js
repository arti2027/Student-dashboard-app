// Check current page and execute relevant functions
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'index.html' || currentPage === '') {
        initLogin();
    } else if (currentPage === 'signup.html') {
        initSignup();
    } else if (currentPage === 'dashboard.html') {
        initDashboard();
    } else if (currentPage === 'calculator.html') {
        initCalculator();
    } else if (currentPage === 'cgpa.html') {
        initCgpa();
    } else if (currentPage === 'planner.html') {
        initPlanner();
    }
});

// Login functions
function initLogin() {
    const loginForm = document.getElementById('login-form');
    const message = document.getElementById('message');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            localStorage.setItem('currentUser', username);
            window.location.href = 'dashboard.html';
        } else {
            showMessage('Invalid username or password', 'error');
        }
    });

    function showMessage(text, type) {
        message.textContent = text;
        message.className = type;
        setTimeout(() => {
            message.textContent = '';
            message.className = '';
        }, 3000);
    }
}

// Signup functions
function initSignup() {
    const signupForm = document.getElementById('signup-form');
    const message = document.getElementById('message');

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (!username || !password || !confirmPassword) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(u => u.username === username);

        if (existingUser) {
            showMessage('Username already exists', 'error');
        } else {
            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));
            showMessage('Account created successfully! Redirecting to login...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    });

    function showMessage(text, type) {
        message.textContent = text;
        message.className = type;
        setTimeout(() => {
            message.textContent = '';
            message.className = '';
        }, 3000);
    }
}

// Dashboard functions
function initDashboard() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Show user profile and welcome message
    showUserProfile(currentUser);
    showRandomQuote();

    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
}

function showUserProfile(username) {
    const userGreeting = document.getElementById('user-greeting');
    const userName = document.getElementById('user-name');
    
    // Get current time to determine greeting
    const now = new Date();
    const hour = now.getHours();
    let greeting = 'Welcome back';
    
    if (hour < 12) {
        greeting = 'Good morning';
    } else if (hour < 17) {
        greeting = 'Good afternoon';
    } else {
        greeting = 'Good evening';
    }
    
    userGreeting.textContent = `${greeting}, ${username}! 👋`;
    userName.textContent = username;
}

function showRandomQuote() {
    const quotes = [
        '"Keep learning, keep growing! 🌟"',
        '"Every expert was once a beginner! 🚀"',
        '"Your only limit is your mind! 💪"',
        '"Dream big, work hard! ✨"',
        '"Success is a journey, not a destination! 🎯"',
        '"Believe in yourself! 🌈"',
        '"Knowledge is power! 📚"',
        '"Stay curious, stay awesome! 🧠"',
        '"You\'re capable of amazing things! ⭐"',
        '"Progress over perfection! 🎨"',
        '"One step at a time! 👣"',
        '"Your future self will thank you! 🙏"',
        '"Embrace the challenge! 🏔️"',
        '"Learning never stops! 🔄"',
        '"You\'re doing great! 🌟"'
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('daily-quote').textContent = randomQuote;
}

// Calculator functions
function initCalculator() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // History drawer functionality
    const historyToggle = document.getElementById('history-toggle');
    const historyDrawer = document.getElementById('history-drawer');
    const closeDrawer = document.getElementById('close-drawer');
    
    historyToggle.addEventListener('click', () => {
        historyDrawer.classList.toggle('open');
    });
    
    closeDrawer.addEventListener('click', () => {
        historyDrawer.classList.remove('open');
    });
    
    // Close drawer when clicking outside
    document.addEventListener('click', (e) => {
        if (!historyDrawer.contains(e.target) && !historyToggle.contains(e.target)) {
            historyDrawer.classList.remove('open');
        }
    });
    
    loadCalculatorHistory();
}

function appendToDisplay(value) {
    const display = document.getElementById('display');
    display.value += value;
}

function clearDisplay() {
    document.getElementById('display').value = '';
}

function deleteLast() {
    const display = document.getElementById('display');
    display.value = display.value.slice(0, -1);
}

function calculate() {
    const display = document.getElementById('display');
    try {
        const result = eval(display.value);
        if (result !== undefined && !isNaN(result)) {
            display.value = result;
            saveHistory('calculator', result.toString());
        } else {
            display.value = 'Error';
        }
    } catch (error) {
        display.value = 'Error';
    }
}

// CGPA functions
function initCgpa() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    const addCourseBtn = document.getElementById('add-course');
    const calculateSgpaBtn = document.getElementById('calculate-sgpa');
    const addSemesterBtn = document.getElementById('add-semester');
    const calculateCgpaBtn = document.getElementById('calculate-cgpa');

    addCourseBtn.addEventListener('click', addCourse);
    calculateSgpaBtn.addEventListener('click', calculateSGPA);
    addSemesterBtn.addEventListener('click', addSemester);
    calculateCgpaBtn.addEventListener('click', calculateCGPA);

    // History drawer functionality
    const historyToggle = document.getElementById('cgpa-history-toggle');
    const historyDrawer = document.getElementById('cgpa-history-drawer');
    const closeDrawer = document.getElementById('cgpa-close-drawer');
    
    historyToggle.addEventListener('click', () => {
        historyDrawer.classList.toggle('open');
    });
    
    closeDrawer.addEventListener('click', () => {
        historyDrawer.classList.remove('open');
    });
    
    // Close drawer when clicking outside
    document.addEventListener('click', (e) => {
        if (!historyDrawer.contains(e.target) && !historyToggle.contains(e.target)) {
            historyDrawer.classList.remove('open');
        }
    });

    loadCgpaHistory();
}

function addCourse() {
    const coursesContainer = document.getElementById('courses-container');
    const courseDiv = document.createElement('div');
    courseDiv.className = 'course';
    courseDiv.innerHTML = `
        <select class="grade">
            <option value="">Grade</option>
            <option value="10">O (10)</option>
            <option value="9">A+ (9)</option>
            <option value="8">A (8)</option>
            <option value="7">B+ (7)</option>
            <option value="6">B (6)</option>
            <option value="5">C (5)</option>
            <option value="4">D (4)</option>
            <option value="0">F (0)</option>
        </select>
        <input type="number" class="credit" placeholder="Credit" min="1" max="10">
        <button class="remove-course" onclick="removeCourse(this)">×</button>
    `;
    coursesContainer.appendChild(courseDiv);
}

function removeCourse(button) {
    button.parentElement.remove();
}

function calculateSGPA() {
    const courses = document.querySelectorAll('.course');
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
        const grade = parseFloat(course.querySelector('.grade').value);
        const credit = parseFloat(course.querySelector('.credit').value);

        if (!isNaN(grade) && !isNaN(credit) && credit > 0) {
            totalPoints += grade * credit;
            totalCredits += credit;
        }
    });

    if (totalCredits === 0) {
        document.getElementById('sgpa-result').textContent = 'Please add valid courses';
        return;
    }

    const sgpa = totalPoints / totalCredits;
    document.getElementById('sgpa-result').textContent = `SGPA: ${sgpa.toFixed(2)}`;
    saveHistory('sgpa', sgpa.toFixed(2));
}

function addSemester() {
    const semestersContainer = document.getElementById('semesters-container');
    const semesterDiv = document.createElement('div');
    semesterDiv.className = 'semester-input';
    semesterDiv.innerHTML = `
        <input type="number" class="sgpa-input" placeholder="SGPA" min="0" max="10" step="0.01">
        <button class="remove-semester" onclick="removeSemester(this)">×</button>
    `;
    semestersContainer.appendChild(semesterDiv);
}

function removeSemester(button) {
    button.parentElement.remove();
}

function calculateCGPA() {
    const semesters = document.querySelectorAll('.sgpa-input');
    let totalSgpa = 0;
    let count = 0;

    semesters.forEach(semester => {
        const sgpa = parseFloat(semester.value);
        if (!isNaN(sgpa) && sgpa >= 0 && sgpa <= 10) {
            totalSgpa += sgpa;
            count++;
        }
    });

    if (count === 0) {
        document.getElementById('cgpa-result').textContent = 'Please add valid SGPA values';
        return;
    }

    const cgpa = totalSgpa / count;
    document.getElementById('cgpa-result').textContent = `CGPA: ${cgpa.toFixed(2)}`;

    const messageDiv = document.getElementById('performance-message');
    if (cgpa < 5) {
        messageDiv.textContent = '⚠️ You need serious improvement! Stay focused 💪';
        messageDiv.style.background = '#ffeaa7';
        messageDiv.style.color = '#d63031';
    } else if (cgpa < 6) {
        messageDiv.textContent = '😐 You can do better. Keep pushing 📈';
        messageDiv.style.background = '#fdcb6e';
        messageDiv.style.color = '#e17055';
    } else if (cgpa > 9) {
        messageDiv.textContent = '🔥 Excellent performance! Keep it up 🚀';
        messageDiv.style.background = '#55efc4';
        messageDiv.style.color = '#00b894';
    } else {
        messageDiv.textContent = '';
    }

    saveHistory('cgpa', cgpa.toFixed(2));
}

function saveHistory(type, result) {
    const currentUser = localStorage.getItem('currentUser');
    const historyKey = `history_${currentUser}`;
    let history = JSON.parse(localStorage.getItem(historyKey)) || [];
    const now = new Date();
    history.push({
        type,
        result,
        date: now.toLocaleString()
    });
    localStorage.setItem(historyKey, JSON.stringify(history));
    if (type === 'calculator') {
        loadCalculatorHistory();
    } else {
        loadCgpaHistory();
    }
}

function loadCalculatorHistory() {
    const currentUser = localStorage.getItem('currentUser');
    const historyKey = `history_${currentUser}`;
    const history = JSON.parse(localStorage.getItem(historyKey)) || [];
    const calculatorHistory = history.filter(item => item.type === 'calculator');
    const historyList = document.getElementById('calculator-history-list');

    if (calculatorHistory.length === 0) {
        historyList.innerHTML = '<p>No calculator history yet</p>';
        return;
    }

    historyList.innerHTML = calculatorHistory.reverse().map(item => `
        <div class="history-item">
            <strong>${item.result}</strong> <br>
            <small>${item.date}</small>
        </div>
    `).join('');
}

function loadCgpaHistory() {
    const currentUser = localStorage.getItem('currentUser');
    const historyKey = `history_${currentUser}`;
    const history = JSON.parse(localStorage.getItem(historyKey)) || [];
    const cgpaHistory = history.filter(item => item.type === 'sgpa' || item.type === 'cgpa');
    const historyList = document.getElementById('cgpa-history-list');

    if (cgpaHistory.length === 0) {
        historyList.innerHTML = '<p>No CGPA history yet</p>';
        return;
    }

    historyList.innerHTML = cgpaHistory.reverse().map(item => `
        <div class="history-item">
            <strong>${item.type.toUpperCase()}</strong>: ${item.result} <br>
            <small>${item.date}</small>
        </div>
    `).join('');
}

// Planner functions
function initPlanner() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    const addTaskBtn = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const celebrationOverlay = document.getElementById('celebration-overlay');

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    celebrationOverlay.addEventListener('click', () => {
        celebrationOverlay.classList.remove('show');
    });

    loadTasks();
}

function addTask() {
    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value.trim();

    if (!taskText) {
        alert('Please enter a task!');
        return;
    }

    const currentUser = localStorage.getItem('currentUser');
    const tasksKey = `tasks_${currentUser}`;
    let tasks = JSON.parse(localStorage.getItem(tasksKey)) || [];

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    localStorage.setItem(tasksKey, JSON.stringify(tasks));

    taskInput.value = '';
    loadTasks();
}

function toggleTask(taskId) {
    const currentUser = localStorage.getItem('currentUser');
    const tasksKey = `tasks_${currentUser}`;
    let tasks = JSON.parse(localStorage.getItem(tasksKey)) || [];

    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        const wasCompleted = tasks[taskIndex].completed;
        tasks[taskIndex].completed = !tasks[taskIndex].completed;

        if (!wasCompleted && tasks[taskIndex].completed) {
            // Task was just completed - show celebration
            showCelebration();
        }

        localStorage.setItem(tasksKey, JSON.stringify(tasks));
        loadTasks();
    }
}

function deleteTask(taskId) {
    const currentUser = localStorage.getItem('currentUser');
    const tasksKey = `tasks_${currentUser}`;
    let tasks = JSON.parse(localStorage.getItem(tasksKey)) || [];

    // Add removing animation
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskElement) {
        taskElement.classList.add('removing');
        setTimeout(() => {
            tasks = tasks.filter(task => task.id !== taskId);
            localStorage.setItem(tasksKey, JSON.stringify(tasks));
            loadTasks();
        }, 300);
    }
}

function loadTasks() {
    const currentUser = localStorage.getItem('currentUser');
    const tasksKey = `tasks_${currentUser}`;
    const tasks = JSON.parse(localStorage.getItem(tasksKey)) || [];

    const tasksList = document.getElementById('tasks-list');
    const emptyState = document.getElementById('empty-state');

    if (tasks.length === 0) {
        tasksList.innerHTML = '';
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        tasksList.innerHTML = tasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <input type="checkbox" class="task-checkbox" 
                       ${task.completed ? 'checked' : ''} 
                       onchange="toggleTask(${task.id})">
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="task-delete" onclick="deleteTask(${task.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateProgress(tasks);
}

function updateProgress(tasks) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    document.getElementById('total-tasks').textContent = totalTasks;
    document.getElementById('completed-tasks').textContent = completedTasks;
    document.getElementById('completion-rate').textContent = `${completionRate}%`;
    document.getElementById('progress-fill').style.width = `${completionRate}%`;
}

function showCelebration() {
    const celebrationOverlay = document.getElementById('celebration-overlay');
    celebrationOverlay.classList.add('show');

    // Auto-hide after 3 seconds
    setTimeout(() => {
        celebrationOverlay.classList.remove('show');
    }, 3000);
}