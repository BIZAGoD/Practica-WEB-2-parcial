document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');

    function showTasks() {
        taskList.innerHTML = '';

        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        tasks.forEach(function(task, index) {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            if (task.completed) {
                li.classList.add('list-group-item-success');
            } else if (isTaskExpired(task.end)) {
                li.classList.add('list-group-item-danger');
            } else {
                li.classList.add('list-group-item');
            }
            li.innerHTML = `
                <div>
                    <strong>Nombre:</strong> ${task.name}<br>
                    <strong>Inicio:</strong> ${task.start}<br>
                    <strong>Fin:</strong> ${task.end}<br>
                    <strong>Asignado a:</strong> ${task.assigned}
                </div>
                <div>
                    <button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Eliminar</button>
                    ${!task.completed && !isTaskExpired(task.end) ? `<button class="btn btn-success btn-sm complete-btn" data-index="${index}">Marcar como Realizada</button>` : ''}
                    ${task.completed ? `<button class="btn btn-warning btn-sm uncomplete-btn" data-index="${index}">Desmarcar</button>` : ''}
                </div>
            `;
            taskList.appendChild(li);
        });

        addDeleteListeners();
        addCompleteListeners();
        addUncompleteListeners();
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('taskName').value;
        const start = document.getElementById('taskStart').value;
        const end = document.getElementById('taskEnd').value;
        const assigned = document.getElementById('assignedTo').value;

        if (new Date(start) > new Date(end)) {
            alert('La fecha de fin no puede ser menor a la fecha de inicio.');
            return;
        }

        const task = {
            name: name,
            start: start,
            end: end,
            assigned: assigned,
            completed: false
        };

        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);

        localStorage.setItem('tasks', JSON.stringify(tasks));

        form.reset();
        showTasks();
    });

    function addDeleteListeners() {
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(function(button) {
            button.addEventListener('click', function(event) {
                const index = event.target.getAttribute('data-index');
                if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
                    deleteTask(index);
                }
            });
        });
    }

    function deleteTask(index) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        showTasks();
    }

    function addCompleteListeners() {
        const completeButtons = document.querySelectorAll('.complete-btn');
        completeButtons.forEach(function(button) {
            button.addEventListener('click', function(event) {
                const index = event.target.getAttribute('data-index');
                const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                if (!isTaskExpired(tasks[index].end)) {
                    toggleComplete(index);
                } else {
                    alert('No puedes marcar como realizada una tarea cuya fecha de finalización ha expirado.');
                }
            });
        });
    }

    function toggleComplete(index) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = tasks[index];
        if (task) {
            task.completed = true;
            tasks[index] = task;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            showTasks();
        }
    }

    function addUncompleteListeners() {
        const uncompleteButtons = document.querySelectorAll('.uncomplete-btn');
        uncompleteButtons.forEach(function(button) {
            button.addEventListener('click', function(event) {
                const index = event.target.getAttribute('data-index');
                toggleUncomplete(index);
            });
        });
    }

    function toggleUncomplete(index) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = tasks[index];
        if (task) {
            task.completed = false;
            tasks[index] = task;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            showTasks();
        }
    }

    function isTaskExpired(endDate) {
        const now = new Date();
        const end = new Date(endDate);
        return end < now;
    }

    showTasks();
});

