// TODAY DATE
function todayStr() {
  return new Date().toISOString().split("T")[0];
}
// ELEMENTS

const searchInput = document.getElementById("searchInput");
const box = document.getElementById("todayTasks");

// SIDEBAR TOGGLE
const menuIcon = document.getElementById("sidebar");
const aside = document.querySelector(".aside");
const closeIcon = document.querySelector(".close-icon");


menuIcon.addEventListener("click", () => {
  aside.classList.add("open");
});

closeIcon.addEventListener("click", () => {
  aside.classList.remove("open");
});

// PROJECT COLORS
const projectColors = {
  work: { bg: "#d1fae5", color: "#00663e" },
  personal: { bg: "#f3e8ff", color: "#7700cd" },
  shopping: { bg: "#ffe3af", color: "#f97316" },
  wishlist: { bg: "#fbe0ee", color: "#ec4899" }
};

// GET TASKS FROM LOCAL STORAGE

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

// RENDER SEARCH RESULT

function renderSearch(text) {
  const today = todayStr();
  const tasks = getTasks().filter(task => task.dueDate === today);
  box.innerHTML = "";

  // empty input
  if (!text) {
    box.innerHTML = `
      <div class="list" style="justify-content:center;color:#96a3b9;">
        Type something to search
      </div>`;
    return;
  }

  const q = text.toLowerCase();

  // keep original index
  const results = tasks
    .map((task, index) => ({ ...task, storageIndex: index }))
    .filter(task =>
      task.title.toLowerCase().includes(q) ||
      (task.project || "").toLowerCase().includes(q)
    );

  // no result
  if (results.length === 0) {
    box.innerHTML = `
      <div class="list" style="justify-content:center;color:#96a3b9;">
        No matching tasks
      </div>`;
    return;
  }

  // render result
  results.forEach(task => {
    const key = (task.project || "work").toLowerCase();
    const color = projectColors[key] || projectColors.work;

    box.innerHTML += `
      <div class="list">
        <div class="listcontent">
          <input type="checkbox" ${task.completed ? "checked" : ""} disabled>

          <div>
            <p>${task.title}</p>

            <div class="span">
              ${task.time
        ? `<span class="time">
                      <i class="fa-solid fa-clock"></i>${task.time}
                    </span>`
        : ""
      }

              <span class="${key}"
                style="background:${color.bg};color:${color.color}">
                ${task.project || "Work"}
              </span>
            </div>
          </div>
        </div>

        <div class="change">
          <div class="edit" onclick="editTask(${task.storageIndex})">
            <i class="fa-solid fa-pen-to-square"></i>
          </div>

          <div class="update" onclick="toggleDropdown(this)">
            <i class="fa-solid fa-caret-down"></i>
            <ul class="dropdown">
              <li onclick="updateStatus(${task.storageIndex}, 'completed')">
                <i class="fa-solid fa-check"></i> Completed
              </li>
              <li onclick="updateStatus(${task.storageIndex}, 'inprogress')">
                <i class="fa-solid fa-spinner"></i> Inprogress
              </li>
              <li onclick="updateStatus(${task.storageIndex}, 'pending')">
                <i class="fa-solid fa-clock"></i> Pending
              </li>
            </ul>
          </div>

          <div class="delete" onclick="deleteTask(${task.storageIndex})">
            <i class="fa-solid fa-trash"></i>
          </div>
        </div>
      </div>`;
  });
}



// DROPDOWN TOGGLE
function toggleDropdown(el) {
  const dropdown = el.querySelector(".dropdown");

  document.querySelectorAll(".dropdown").forEach(d => {
    if (d !== dropdown) d.style.display = "none";
  });

  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}




// LIVE SEARCH

searchInput.addEventListener("input", e => {
  renderSearch(e.target.value.trim());
});


// AUTO FOCUS
searchInput.focus();
