document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('taskList');
    const taskInput = document.getElementById('taskInput');
    const descriptionInput = document.getElementById('descriptionInput');
    const priorityInput = document.getElementById('priorityInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const deleteAllButton = document.getElementById('deleteAllButton');
    const totalTasks = document.getElementById('totalTasks');
    const completedTasks = document.getElementById('completedTasks');
    const profileButton = document.getElementById('profileButton');
    const userDashboardModal = new bootstrap.Modal(document.getElementById('userDashboardModal'));
    let taskCount = 0;
    let completedTaskCount = 0;

    const updateTaskCounts = () => {
        totalTasks.innerText = taskCount;
        completedTasks.innerText = completedTaskCount;
    };

    const addTask = (taskText, taskDescription, priority) => {
        if (taskText.trim() === '') return;

        const taskItem = document.createElement('li');
        taskItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        taskItem.draggable = true;

        const taskContent = document.createElement('div');
        taskContent.innerHTML = `<strong>${taskText}</strong><br><small>${taskDescription}</small>`;

        const taskPriority = document.createElement('span');
        taskPriority.classList.add('ml-2');

        // Assign priority text and styles based on selected option
        switch (priority) {
            case 'low':
                taskPriority.innerHTML = `<span class="priority-text-low">${priority.charAt(0).toUpperCase() + priority.slice(1)}</span>`;
                break;
            case 'medium':
                taskPriority.innerHTML = `<span class="priority-text-medium">${priority.charAt(0).toUpperCase() + priority.slice(1)}</span>`;
                break;
            case 'high':
                taskPriority.innerHTML = `<span class="priority-text-high">${priority.charAt(0).toUpperCase() + priority.slice(1)}</span>`;
                break;
            default:
                taskPriority.textContent = priority.charAt(0).toUpperCase() + priority.slice(1);
                break;
        }

        const taskActions = document.createElement('div');
        const doneButton = document.createElement('button');
        doneButton.classList.add('btn', 'btn-success', 'btn-sm', 'mr-2');
        doneButton.innerHTML = '<i class="fas fa-check"></i>';
        doneButton.addEventListener('click', () => {
            taskItem.classList.toggle('completed');
            if (taskItem.classList.contains('completed')) {
                completedTaskCount++;
            } else {
                completedTaskCount--;
            }
            updateTaskCounts();
        });

        const editButton = document.createElement('button');
        editButton.classList.add('btn', 'btn-warning', 'btn-sm', 'mr-2');
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.addEventListener('click', () => {
            const newTaskText = prompt('Edit Task:', taskText);
            const newDescriptionText = prompt('Edit Description:', taskDescription);
            if (newTaskText !== null) {
                taskContent.innerHTML = `<strong>${newTaskText}</strong><br><small>${newDescriptionText}</small>`;
            }
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.addEventListener('click', () => {
            taskList.removeChild(taskItem);
            taskCount--;
            if (taskItem.classList.contains('completed')) {
                completedTaskCount--;
            }
            updateTaskCounts();
        });

        taskActions.appendChild(doneButton);
        taskActions.appendChild(editButton);
        taskActions.appendChild(deleteButton);
        taskItem.appendChild(taskContent);
        taskItem.appendChild(taskPriority);
        taskItem.appendChild(taskActions);

        taskList.appendChild(taskItem);
        taskInput.value = '';
        descriptionInput.value = '';
        taskCount++;
        updateTaskCounts();

        taskItem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', taskItem.outerHTML);
            taskItem.classList.add('dragging');
        });

        taskItem.addEventListener('dragend', () => {
            taskItem.classList.remove('dragging');
        });

        taskList.addEventListener('dragover', (e) => {
            e.preventDefault();
            const dragging = document.querySelector('.dragging');
            const afterElement = getDragAfterElement(taskList, e.clientY);
            if (afterElement == null) {
                taskList.appendChild(dragging);
            } else {
                taskList.insertBefore(dragging, afterElement);
            }
        });

        const getDragAfterElement = (container, y) => {
            const draggableElements = [...container.querySelectorAll('.list-group-item:not(.dragging)')];
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        };
    };

    addTaskButton.addEventListener('click', () => {
        addTask(taskInput.value, descriptionInput.value, priorityInput.value);
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(taskInput.value, descriptionInput.value, priorityInput.value);
        }
    });

    deleteAllButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all tasks?')) {
            taskList.innerHTML = '';
            taskCount = 0;
            completedTaskCount = 0;
            updateTaskCounts();
        }
    });

    profileButton.addEventListener('click', () => {
        userDashboardModal.show();
    });

    const darkModeButton = document.getElementById('darkModeButton');
    darkModeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    const updateDateTime = () => {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
        dateTime.innerText = now.toLocaleDateString('en-US', options);
    };

    updateDateTime();
    setInterval(updateDateTime, 1000);
});


/*// user dashboard functions code
// Get the elements
const usernameElement = document.getElementById('username');
const emailElement = document.getElementById('email');
const totalTasksElement = document.getElementById('total-tasks');
const completedTasksElement = document.getElementById('completed-tasks');
const themeSelectElement = document.getElementById('theme-select');
const changePasswordButton = document.getElementById('change-password-button');
const changePasswordFormContainer = document.getElementById('change-password-form-container');
const logoutButton = document.getElementById('logout-button');

// Sync the user data
fetch('/api/user-data')
 .then(response => response.json())
 .then(data => {
    usernameElement.textContent = data.username;
    emailElement.textContent = data.email;
    totalTasksElement.textContent = data.totalTasks;
    completedTasksElement.textContent = data.completedTasks;
  });

// Switch theme
themeSelectElement.addEventListener('change', () => {
  const theme = themeSelectElement.value;
  document.body.classList.toggle('dark-theme', theme === 'dark');
  document.body.classList.toggle('light-theme', theme === 'light');
});

// Change password
changePasswordButton.addEventListener('click', () => {
  changePasswordFormContainer.style.display = 'block';
});

const changePasswordForm = document.getElementById('change-password-form');
changePasswordForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  // Validate the form values
  if (newPassword!== confirmPassword) {
    alert('New password and confirm password do not match');
    return;
  }

  // Make an API call to change the password
  fetch('/api/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      currentPassword,
      newPassword
    })
  })
 .then(response => response.json())
 .then(data => {
    if (data.success) {
      alert('Password changed successfully');
      // Reset the form values
      document.getElementById('current-password').value = '';
      document.getElementById('new-password').value = '';
      document.getElementById('confirm-password').value = '';
    } else {
      alert('Failed to change password');
    }
  })
.catch(error => {
    console.error(error);
    alert('Failed to change password');
  });
});

// Log out
logoutButton.addEventListener('click', () => {
  fetch('/api/logout', {
    method: 'POST'
  })
.then(response => response.json())
.then(data => {
    if (data.success) {
      // Redirect to the main page
      window.location.href = '/';
    } else {
      alert('Failed to log out');
    }
  })
.catch(error => {
    console.error(error);
    alert('Failed to log out');
  });
});*/