let editIndex = null;

const form = document.querySelector(".form");

window.addEventListener('DOMContentLoaded', function () {
    // Check if we're in edit mode
    const storedEditIndex = localStorage.getItem("editIndex");
    if (storedEditIndex !== null) {
        editIndex = parseInt(storedEditIndex);
        openTaskModal("edit", editIndex);
        // Clear the edit index from localStorage
        localStorage.removeItem("editIndex");
    }
});
//  OPEN MODAL (CREATE / EDIT)


function editTask(index) {
    openTaskModal("edit", index);
}

function openTaskModal(mode = "create", index = null) {
    const modal = document.querySelector(".modal");
    const formTitle = document.querySelector(".newtask h1");
    const submitBtn = document.querySelector(".createbtn");

    modal.style.display = "flex";

    if (mode === "create") {
        formTitle.textContent = "Create New Task";
        submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Create Task`;
        form.reset();
        editIndex = null;
    }

    if (mode === "edit") {
        formTitle.textContent = "Edit Task";
        submitBtn.innerHTML = `<i class="fa-solid fa-pen"></i> Update Task`;
        editIndex = index;
        fillFormData(index);
    }
}

// FILL FORM DATA (EDIT)


function fillFormData(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    if (!tasks[index]) return;

    document.getElementById("task").value = tasks[index].title;
    document.getElementById("textarea").value = tasks[index].description;
    document.getElementById("date").value = tasks[index].dueDate;
    document.getElementById("time").value = tasks[index].time;
    document.getElementById("projects").value = tasks[index].project;

    selectedPriority = tasks[index].priority;

    document.querySelectorAll(".priority button").forEach(btn => {
        btn.classList.toggle("active", btn.textContent.trim() === selectedPriority);
    });
}


// PRIORITY BUTTONS


const priorityButtons = document.querySelectorAll(".priority button");

priorityButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        priorityButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedPriority = btn.textContent.trim();
    });
});


//  FORM SUBMIT


form.addEventListener("submit", function (e) {
    e.preventDefault();

    const taskData = {
        title: document.getElementById("task").value,
        description: document.getElementById("textarea").value,
        dueDate: document.getElementById("date").value,
        time: document.getElementById("time").value,
        project: document.getElementById("projects").value,
        priority: selectedPriority
    };

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if (editIndex !== null) {
        tasks[editIndex] = taskData;
        showToast("Task updated successfully");
    } else {
        tasks.push(taskData);
        showToast("Task created successfully");
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));

    setTimeout(() => {
        window.location.href = "home.html";
    }, 2000);
});


//  TOAST MESSAGE


const toast = document.getElementById("toast");
const toastMsg = document.getElementById("toast-msg");

function showToast(message) {
    toastMsg.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 1500);
}


// SIDEBAR TOGGLE


const menuIcon = document.getElementById("sidebar");
const aside = document.querySelector(".aside");
const closeIcon = document.getElementById("close");

menuIcon?.addEventListener("click", () => {
    aside.style.display = "block";
});

closeIcon?.addEventListener("click", () => {
    aside.style.display = "none";
});
