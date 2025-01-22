// Get DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompleted');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTaskCount();
}

// Create a new task
function addTask(text) {
    if (text.trim() === '') return;
    
    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };
    
    tasks.push(task);
    renderTask(task);
    saveTasks();
    taskInput.value = '';
}

// Render a single task
function renderTask(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;
    
    li.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''}>
        <span>${task.text}</span>
        <button class="delete-btn">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    taskList.appendChild(li);
}

// Update task count
function updateTaskCount() {
    const remainingTasks = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${remainingTasks} task${remainingTasks !== 1 ? 's' : ''} remaining`;
}

// Render all tasks
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(renderTask);
    updateTaskCount();
}

// Event Listeners
addTaskBtn.addEventListener('click', () => addTask(taskInput.value));

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask(taskInput.value);
    }
});

taskList.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    
    const taskId = Number(li.dataset.id);
    
    // Handle checkbox click
    if (e.target.type === 'checkbox') {
        const task = tasks.find(t => t.id === taskId);
        task.completed = e.target.checked;
        li.classList.toggle('completed');
        saveTasks();
    }
    
    // Handle delete button click
    if (e.target.closest('.delete-btn')) {
        tasks = tasks.filter(task => task.id !== taskId);
        li.remove();
        saveTasks();
    }
});

clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
    saveTasks();
});

// Initial render
renderTasks();
