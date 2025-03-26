document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateTime();
    setInterval(updateTime, 1000);
    enableDragAndDrop();
});

function updateTime() {
    const timeElement = document.getElementById('time');
    const now = new Date();
    timeElement.innerText = now.toLocaleString();
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const category = document.getElementById('category').value;
    const taskText = taskInput.value.trim();

    if (!taskText) return;

    const task = {
        text: taskText,
        category,
        completed: false
    };

    saveTask(task);
    taskInput.value = '';
    renderTasks();
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    renderTasks();
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    const completedList = document.getElementById('completedList');

    taskList.innerHTML = '';
    completedList.innerHTML = '';

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

    tasks.forEach((task, index) => {
        const li = createTaskElement(task, index);
        taskList.appendChild(li);
    });

    completedTasks.forEach((task, index) => {
        const li = createTaskElement(task, index, true);
        completedList.appendChild(li);
    });
}

function createTaskElement(task, index, isCompleted = false) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${task.text} [${task.category}]</span>
        <div>
            ${!isCompleted ? `
                <button class="complete-btn" onclick="completeTask(${index})">✔️</button>
                <button class="edit-btn" onclick="editTask(${index})">✏️</button>
                <button class="delete-btn" onclick="deleteTask(${index})">❌</button>
            ` : ''}
        </div>
    `;
    return li;
}

function completeTask(index) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

    const task = tasks.splice(index, 1)[0];
    task.completed = true;
    completedTasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    renderTasks();
}

function enableDragAndDrop() {
    new Sortable(taskList, { animation: 150 });
    new Sortable(completedList, { animation: 150 });
}
