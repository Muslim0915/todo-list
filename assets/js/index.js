const theme_toggle = document.querySelector('.theme-toggle__button i');
const tasksContainer = document.querySelector('.tasks__container');
const form = document.querySelector('.form');
const taskInput = document.querySelector('.task-input')
const resetBtn = document.querySelector('.reset-button');
const modal = document.querySelector('.modal');
const searchInput = document.querySelector('.search-input input');
const hours = new Date().getHours().toString().padStart(2, '0');
const minutes = new Date().getMinutes().toString().padStart(2, '0');
const inputResetBtn = document.querySelector('.form-control .fa-times');

inputResetBtn.addEventListener('click', () => {
    taskInput.value = '';
})

theme_toggle.addEventListener('click', () => {
    const isDarkMode = document.body.classList.toggle('dark-theme');
    if (isDarkMode){
        theme_toggle.classList.remove('fa-sun')
        theme_toggle.classList.add('fa-moon')
        localStorage.setItem('isDarkMode', 'true');
    }
     else {
        theme_toggle.classList.add('fa-sun')
        theme_toggle.classList.remove('fa-moon')
        localStorage.removeItem('isDarkMode')
    }
});
function checkDarkMode() {
    if (localStorage.getItem('isDarkMode') === 'true'){
        document.body.classList.add('dark-theme');
        theme_toggle.classList.remove('fa-sun')
        theme_toggle.classList.add('fa-moon');
    }
    else {
        theme_toggle.classList.add('fa-sun')
        theme_toggle.classList.remove('fa-moon')
    }
}

let tasks = [];

function renderTasks(taskList) {
    tasksContainer.innerHTML = '';
    if (taskList && taskList.length > 0) {
        taskList.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            taskElement.dataset.id = task.id;
            taskElement.dataset.completed = task.completed;
            taskElement.innerHTML = `
            <div class="input task__field">
                <p class="task__text" contenteditable="false">${task.title}</p>
                <div class="task__icons">
                    <i class="task__time">
                      ${hours}:${minutes}
                    </i>
                    
                    <i class="fa fa-edit"></i>
                    
                    <button class="check">
                    <i class="fa fa-check"></i>
                    </button>
                    </button>
                    <i class="fa fa-times"></i>
                </div>
            </div>
        `;
            tasksContainer.appendChild(taskElement);
        });
    }


}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    removeErrors();
    if (taskInput.value.trim() === '') {
        showError(taskInput, 'This field is not be empty');
        taskInput.closest('.input').classList.add('input_errored')
    } else {
        const newTask = {
            id: Date.now(),
            title: taskInput.value,
            completed: false,
        }
        tasks.push(newTask);
        renderTasks(tasks);
        taskInput.value = '';
        saveTasks();
    }

})


function showError(field, message) {
    const errorElement = document.createElement('small');
    errorElement.classList.add('error');
    errorElement.innerHTML = message;
    field.closest('.input').appendChild(errorElement);
}

function removeErrors() {
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(element => {
        element.remove();
    });
    if (taskInput.classList.contains('input_errored')) {
        taskInput.classList.remove('input_errored');
    }
}

tasksContainer.addEventListener('click', (event) => {

    const target = event.target;
    let task = target.closest('.task');
    let taskId = +task.dataset.id;
    const taskText = task.querySelector('.task__text');
    if (target.classList.contains('fa-times')) {
        tasks = tasks.filter(task => task.id !== taskId);
        renderTasks(tasks); // Update the tasks displayed on the screen
        saveTasks();
    }

    if (target.classList.contains('fa-edit')) {

        taskText.setAttribute('contenteditable', 'true');

        taskText.focus();
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(taskText);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);

        taskText.addEventListener('blur', () => {
            taskText.setAttribute('contenteditable', 'false');
        });
    }

    if (target.classList.contains('fa-check')) {
        taskText.classList.toggle('task__completed');
    }


});

function modalOpen() {
    modal.classList.add('modal_opened');
}

function modalClose() {
    modal.classList.remove('modal_opened');
}

resetBtn.addEventListener('click', () => {
    if (tasks.length > 0) {
        modalOpen();
    }
    let modalConfirm = document.querySelector('.modal__confirm');
    let modalCancel = document.querySelector('.modal__cancel');
    modalConfirm.addEventListener('click', () => {
        tasks = [];
        renderTasks();
        modalClose();
        saveTasks();
    });
    modalCancel.addEventListener('click', () => {
        modalClose();
    })
})

searchInput.addEventListener('input', (event) => {
    const searchText = event.target.value.toLowerCase();
    const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(searchText));
    renderTasks(filteredTasks); // Update the tasks displayed on the screen
});

window.onload = () => {
    loadTasks();
    renderTasks(tasks);
    checkDarkMode();
};


function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}





function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks(tasks);
    }
}
