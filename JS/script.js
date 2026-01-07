//modal

let editIndex = null;
let selectedPriority = "";

// Modal elements
const modal = document.querySelector('.modal');
const closeModalBtn = document.querySelector('.close-modal');
const cancelBtn = document.querySelector('.cancelbtn');
const form = document.getElementById('task-form');
const priorityButtons = document.querySelectorAll('.priority button[data-priority]');
const priorityInput = document.getElementById('priority-input');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toast-msg');

// Open modal for creating new task
function openCreateModal() {
  editIndex = null;
  // Show modal
  modal.style.display = "flex";
}

// Open modal for editing task
function openEditModal(index) {
  editIndex = index;
  const tasks = getAllTasks();

  if (tasks[index]) {
    const task = tasks[index];

    // Fill form with task data
    document.getElementById('task-input').value = task.title;
    document.getElementById('textarea').value = task.description || '';
    document.getElementById('date-input').value = task.dueDate;
    document.getElementById('time-input').value = task.time || '';
    document.getElementById('projects-select').value = task.project;

    // Set priority
    selectedPriority = task.priority;
    priorityInput.value = selectedPriority;

    // Update modal title and button
    document.getElementById('modal-title').textContent = "Edit Task";
    document.getElementById('modal-subtitle').textContent = "Update the details below.";
    document.getElementById('submit-btn').innerHTML = '<i class="fa-solid fa-pen"></i>Update Task';

    // Show modal
    modal.style.display = "flex";
  }
}

// Close modal
function closeModal() {
  modal.style.display = "none";
  editIndex = null;
  form.reset();
}

// Set active priority button
function setActivePriorityButton(priority) {
  priorityButtons.forEach(btn => {
    if (btn.dataset.priority === priority) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Show toast notification
function showToast(message, type = "success") {
  toastMsg.textContent = message;

  // Set color based on type
  if (type === "success") {
    toast.style.backgroundColor = "#0074eb";
    toast.querySelector('i').className = "fa-solid fa-check-circle";
  } else if (type === "error") {
    toast.style.backgroundColor = "#ef4444";
    toast.querySelector('i').className = "fa-solid fa-exclamation-circle";
  }

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

//  EVENT LISTENERS 

// Open modal when Add Task button is clicked
document.querySelector('.taskbtn').addEventListener('click', openCreateModal);
document.querySelector('.newbtn').addEventListener('click', openCreateModal);

// Close modal when X button is clicked
closeModalBtn.addEventListener('click', closeModal);

// Close modal when Cancel button is clicked
cancelBtn.addEventListener('click', closeModal);



// Priority button selection
priorityButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    selectedPriority = btn.dataset.priority;
    setActivePriorityButton(selectedPriority);
    priorityInput.value = selectedPriority;
  });
});

// Form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get form values
  const taskData = {
    title: document.getElementById('task-input').value,
    description: document.getElementById('textarea').value,
    dueDate: document.getElementById('date-input').value,
    time: document.getElementById('time-input').value,
    project: document.getElementById('projects-select').value,
    priority: selectedPriority
  };

  let tasks = getAllTasks();

  if (editIndex !== null) {
    // Update existing task
    tasks[editIndex] = taskData;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    showToast('Task updated successfully!');
  } else {
    // Add new task
    tasks.push(taskData);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    showToast('Task created successfully!');
  }

  // Close modal 
  closeModal();

});

// Update editTask function to use the modal
window.editTask = function (index) {
  openEditModal(index);
};


// get current date
const d = new Date();
document.getElementById("date").innerText = d.toDateString();

// sidebar toggle
const menuIcon = document.getElementById("sidebar");
const aside = document.querySelector(".aside");
const closeIcon = document.querySelector(".close-icon");

menuIcon.addEventListener("click", () => {
  aside.style.display = "block";
});

closeIcon.addEventListener("click", () => {
  aside.style.display = "none";
});

// project color selection
const projectColors = {
  work: { color: "#00663e", bg: "#d1fae5" },
  personal: { color: "#7700cd", bg: "#f3e8ff" },
  shopping: { color: "#ea580c", bg: "#ffedd5" },
  wishlist: { color: "#ec4899", bg: "#fce7f3" }
};

// today date string
function todayStr() {
  return new Date().toISOString().split("T")[0];
}

// tomorrow date string
function tomorrowStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

// get all tasks from localStorage
function getAllTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

// separate tasks based on date
function classifyTasks() {
  const today = todayStr();
  const tomorrow = tomorrowStr();

  const todayTasks = [];
  const tomorrowTasks = [];
  const upcomingTasks = [];

  const allTasks = getAllTasks();

  allTasks.forEach((task, index) => {
    const category = task.project.toLowerCase();

    if (task.dueDate === today) {
      todayTasks.push({ ...task, category, storageIndex: index });
    }
    else if (task.dueDate === tomorrow) {
      tomorrowTasks.push({ ...task, category, storageIndex: index });
    }
    else if (task.dueDate > tomorrow) {
      upcomingTasks.push({ ...task, category, storageIndex: index });
    }
  });

  // sort today tasks by time
  todayTasks.sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  return { todayTasks, tomorrowTasks, upcomingTasks };
}

// update progress bar
function updateProgress() {
  const todaybox = document.getElementById("todayTasks");
  const checkbox = todaybox.querySelectorAll("input[type='checkbox']");
  const total = checkbox.length;

  if (total === 0) {
    setProgress(0);
    return;
  }

  let completed = 0;
  checkbox.forEach(cb => {
    if (cb.checked) completed++;
  });

  const percentage = Math.round((completed / total) * 100);
  setProgress(percentage);
}

// set progress bar width
function setProgress(percentage) {
  const bar = document.querySelector(".Progress div");
  const text = document.querySelector(".pb p");

  bar.style.width = percentage + "%";
  text.innerText = percentage + "%";
}

// checkbox change event
document.getElementById("todayTasks").addEventListener("change", function (e) {
  if (e.target.type === "checkbox") {
    updateProgress();
  }
});

// update dropdown toggle
document.addEventListener("click", function (e) {
  const update = e.target.closest(".update");

  // close all dropdowns
  document.querySelectorAll(".dropdown").forEach(d => {
    d.style.display = "none";
  });

  if (update) {
    const dropdown = update.querySelector(".dropdown");
    dropdown.style.display = "block";
    e.stopPropagation();
  }
});

// render today tasks
function renderToday() {
  const box = document.getElementById("todayTasks");
  box.innerHTML = "";

  const { todayTasks } = classifyTasks();

  todayTasks.forEach(task => {
    const c = projectColors[task.category];
    box.innerHTML += `
      <div class="list">
        <div class="listcontent">
          <input type="checkbox">
          <div>
            <p>${task.title}</p>
            <div class="span">
              <span class="time">
                <i class="fa-solid fa-clock"></i>${task.time || ""}
              </span>
              <span class="${task.category}" style="background:${c.bg};color:${c.color}">
                ${task.project}
              </span>
            </div>
          </div>
        </div>

        <div class="change">
          <div class="edit" onclick="editTask(${task.storageIndex})">
            <i class="fa-solid fa-pen-to-square"></i>
          </div>

          <div class="update">
            <i class="fa-solid fa-caret-down"></i>
            <ul class="dropdown">
              <li>Completed</li>
              <li>Inprogress</li>
              <li>Pending</li>
            </ul>
          </div>

          <div class="delete" onclick="deleteTask(${task.storageIndex})">
            <i class="fa-solid fa-trash"></i>
          </div>
        </div>
      </div>
    `;
  });

  updateProgress();
}

// render tomorrow tasks
function renderTomorrow() {
  const box = document.getElementById("tomorrowTasks");
  box.innerHTML = "";

  const { tomorrowTasks } = classifyTasks();

  tomorrowTasks.forEach(task => {
    const c = projectColors[task.category];

    box.innerHTML += `
      <div class ="tmrw">
       <div class = "upcontent">
        <div class="upicon" style="background:${c.bg};color:${c.color}">
          <i class="fa-solid fa-calendar"></i>
        </div>
        <div class="upnote">
          <h4>${task.title}</h4>
          <p>${task.project}</p>
        </div>
       </div>
              
        <div class="delete" onclick="deleteTask(${task.storageIndex})">
            <i class="fa-solid fa-trash"></i>
          </div>
      </div>
    `;
  });
}

// render upcoming / total tasks
function renderUpcoming() {
  const box = document.getElementById("weekTasks");
  box.innerHTML = "";

  const { upcomingTasks } = classifyTasks();

  upcomingTasks.forEach(task => {
    const c = projectColors[task.category];

    box.innerHTML += `
      <div class = "upcome">
      <div class="upcontent">
        <div class="upicon" style="background:${c.bg};color:${c.color}">
          <i class="fa-solid fa-calendar-days"></i>
        </div>
        <div class="upnote">
          <h4>${task.title}</h4>
          <p>${task.dueDate} • ${task.project}</p>
        </div>
      </div>
       <div class="delete" onclick="deleteTask(${task.storageIndex})">
            <i class="fa-solid fa-trash"></i>
          </div>
      </div>
    `;
  });
}

// delete task
function deleteTask(index) {
  let tasks = getAllTasks();
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderAll();
}

// render all sections
function renderAll() {
  renderToday();
  renderTomorrow();
  renderUpcoming();
}

// Initialize
renderAll();