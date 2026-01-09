let editIndex = null;
let selectedPriority = "";
let activeFilter = "all";

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
  // Reset form and set default priority
  form.reset();
  selectedPriority = "Medium";
  priorityInput.value = selectedPriority;
  setActivePriorityButton(selectedPriority);

  // Reset modal title and button
  document.getElementById('modal-title').textContent = "Create New Task";
  document.getElementById('modal-subtitle').textContent = "Fill in the details below to add a new item to your list.";
  document.getElementById('submit-btn').innerHTML = '<i class="fa-solid fa-check"></i>Create Task';

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
    selectedPriority = task.priority || "Medium";
    priorityInput.value = selectedPriority;
    setActivePriorityButton(selectedPriority);

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

// Open modal when Add Task button is clicked
document.querySelector('.taskbtn').addEventListener('click', openCreateModal);
document.querySelector('.newbtn').addEventListener('click', openCreateModal);

// Close modal when X button is clicked
closeModalBtn.addEventListener('click', closeModal);

// Close modal when Cancel button is clicked
cancelBtn.addEventListener('click', closeModal);

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    closeModal();
  }
});
modal.addEventListener("click", (e) => {

  if (e.target === modal) {
    closeModal();
  }
});

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
  let tasks = getAllTasks();

  // Get form values
  const taskData = {
    title: document.getElementById('task-input').value,
    description: document.getElementById('textarea').value,
    dueDate: document.getElementById('date-input').value,
    time: document.getElementById('time-input').value,
    project: document.getElementById('projects-select').value,
    priority: selectedPriority,
    completed: editIndex !== null ? tasks[editIndex].completed : false,
    status: editIndex !== null ? tasks[editIndex].status : "pending"
  };

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

  renderAll();
  pendingTaskCount();
  closeModal();
});

// Update editTask function to use the modal
window.editTask = function (index) {
  openEditModal(index);
};

// Get current date
const d = new Date();
document.getElementById("date").innerText = d.toDateString();

// Sidebar toggle
const menuIcon = document.getElementById("sidebar");
const aside = document.querySelector(".aside");
const closeIcon = document.querySelector(".close-icon");

menuIcon.addEventListener("click", () => {
  aside.classList.add("open");
});

closeIcon.addEventListener("click", () => {
  aside.classList.remove("open");
});

// search page
const homeSearch = document.getElementById("search");

homeSearch.addEventListener("focus", () => {
  window.location.href = "/html/search.html";
});

// Project color selection
const projectColors = {
  work: { color: "#00663e", bg: "#d1fae5" },
  personal: { color: "#7700cd", bg: "#f3e8ff" },
  shopping: { color: "#ea580c", bg: "#ffedd5" },
  wishlist: { color: "#ec4899", bg: "#fce7f3" }
};

// Today date string
function todayStr() {
  return new Date().toISOString().split("T")[0];
}

// Tomorrow date string
function tomorrowStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

// Get all tasks from localStorage
function getAllTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

// Separate tasks based on date and filter
function classifyTasks() {
  const today = todayStr();
  const tomorrow = tomorrowStr();

  const todayTasks = [];
  const tomorrowTasks = [];
  const upcomingTasks = [];

  const allTasks = getAllTasks();

  allTasks.forEach((task, index) => {
    const category = task.project ? task.project.toLowerCase() : 'work';

    // Apply filter only to today's tasks
    if (task.dueDate === today) {
      if (activeFilter === "all" || task.status === activeFilter) {
        todayTasks.push({ ...task, category, storageIndex: index });
      }
    } else if (task.dueDate === tomorrow) {
      tomorrowTasks.push({ ...task, category, storageIndex: index });
    } else if (task.dueDate > tomorrow) {
      upcomingTasks.push({ ...task, category, storageIndex: index });
    }
  });

  // Sort today tasks by time
  todayTasks.sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  return { todayTasks, tomorrowTasks, upcomingTasks };
}

// update pending task count
function pendingTaskCount() {
  const today = todayStr();
  const tasks = getAllTasks();

  const todayCount = tasks.filter(task => task.dueDate === today && (task.status === "pending" || task.status === "inprogress")).length;

  const count = document.getElementById("taskCount");
  if (count) {
    count.innerText = todayCount;
  }
}

// Update progress bar
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

// Set progress bar width
function setProgress(percentage) {
  const bar = document.querySelector(".Progress div");
  const text = document.querySelector(".pb p");

  bar.style.width = percentage + "%";
  text.innerText = percentage + "%";
}

// Toggle completion and status
function toggleComplete(index, isChecked) {
  let tasks = getAllTasks();
  tasks[index].completed = isChecked;
  tasks[index].status = isChecked ? "completed" : "pending";
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Re-render if we're in a filtered view
  if (activeFilter !== "all") {
    renderAll();
    pendingTaskCount();
  } else {
    updateProgress();
    // Update the status display without full re-render
    updateTaskStatusDisplay(index, tasks[index].status);
  }
}

// Update task status display in the UI
function updateTaskStatusDisplay(index, status) {
  // Find the task element in the DOM and update its status display
  const taskElements = document.querySelectorAll('.list');
  taskElements.forEach(taskEl => {
    const checkbox = taskEl.querySelector('input[type="checkbox"]');
    if (checkbox && checkbox.getAttribute('onchange').includes(`toggleComplete(${index},`)) {
      const statusBox = taskEl.querySelector('.update-status');
      if (statusBox) {
        statusBox.textContent = status;
        statusBox.className = 'update-status';
        statusBox.classList.add(status.toLowerCase());
      }
    }
  });
}

// Update status from dropdown
function updateStatus(index, status, element) {
  let tasks = getAllTasks();

  tasks[index].status = status;
  tasks[index].completed = status === "completed";

  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Find the update-status div and update it
  const statusBox = element.closest(".change").querySelector(".update-status");
  statusBox.innerText = status;
  statusBox.className = "update-status";
  statusBox.classList.add(status.toLowerCase());

  // Find and update the checkbox state
  const checkbox = element.closest(".list").querySelector('input[type="checkbox"]');
  if (checkbox) {
    checkbox.checked = status === "completed";
  }

  // Close dropdown
  const dropdown = element.closest(".update").querySelector(".dropdown");
  dropdown.style.display = "none";

  // Update progress
  updateProgress();
  pendingTaskCount();
}

// Close dropdowns when clicking elsewhere
document.addEventListener("click", function (e) {
  if (!e.target.closest(".update")) {
    document.querySelectorAll(".dropdown").forEach(d => {
      d.style.display = "none";
    });
  }
});

// side bar 
document.querySelectorAll(".nav a[data-filter]").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    // active style reset
    document.querySelectorAll(".nav a").forEach(a => {
      a.style.background = "";
      a.style.color = "";
    });

    // active style set
    link.style.background = "#e7f2fd";
    link.style.color = "#1081ec";

    // set filter
    activeFilter = link.dataset.filter;
    renderAll();
    aside.classList.remove("open");
  });
});

// Render today tasks
function renderToday() {
  const box = document.getElementById("todayTasks");
  box.innerHTML = "";

  const { todayTasks } = classifyTasks();

  if (todayTasks.length === 0) {
    box.innerHTML = `
      <div class="list" style="justify-content: center; color: #96a3b9;">
        No tasks found
      </div>
    `;
    return;
  }

  todayTasks.forEach(task => {
    const c = projectColors[task.category] || projectColors.work;

    box.innerHTML += `
      <div class="list">
        <div class="listcontent">
          <input type="checkbox" ${task.completed ? "checked" : ""} 
                 onchange="toggleComplete(${task.storageIndex}, this.checked)">
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
          <div class="update-status ${task.status}">${task.status}</div>
          <div class="edit" onclick="editTask(${task.storageIndex})">
            <i class="fa-solid fa-pen-to-square"></i>
          </div>

          <div class="update" onclick="toggleDropdown(this)">
            <i class="fa-solid fa-caret-down"></i>
            <ul class="dropdown">
              <li onclick="updateStatus(${task.storageIndex}, 'completed', this)">
                <i class="fa-solid fa-check"></i> Completed
              </li>
              <li onclick="updateStatus(${task.storageIndex}, 'inprogress', this)">
                <i class="fa-solid fa-spinner"></i> Inprogress
              </li>
              <li onclick="updateStatus(${task.storageIndex}, 'pending', this)">
                <i class="fa-solid fa-clock"></i> Pending
              </li>
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
  pendingTaskCount();
}

// Toggle dropdown
function toggleDropdown(el) {
  const dropdown = el.querySelector(".dropdown");

  // close other dropdowns
  document.querySelectorAll(".dropdown").forEach(d => {
    if (d !== dropdown) d.style.display = "none";
  });

  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// Render tomorrow tasks
function renderTomorrow() {
  const box = document.getElementById("tomorrowTasks");
  box.innerHTML = "";

  const { tomorrowTasks } = classifyTasks();

  tomorrowTasks.forEach(task => {
    const c = projectColors[task.category] || projectColors.work;

    box.innerHTML += `
      <div class="tmrw">
       <div class="upcontent">
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

// Render upcoming / total tasks
function renderUpcoming() {
  const box = document.getElementById("weekTasks");
  box.innerHTML = "";

  const { upcomingTasks } = classifyTasks();

  upcomingTasks.forEach(task => {
    const c = projectColors[task.category] || projectColors.work;

    box.innerHTML += `
      <div class="upcome">
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

// Delete task
function deleteTask(index) {
  let tasks = getAllTasks();
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderAll();
  showToast('Task deleted successfully!', 'success');
  pendingTaskCount()
}

// Render all sections
function renderAll() {
  renderToday();
  renderTomorrow();
  renderUpcoming();
}

// Initialize
renderAll();
pendingTaskCount();