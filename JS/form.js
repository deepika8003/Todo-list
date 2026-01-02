
// SIDEBAR TOGGLE

const menuIcon = document.getElementById("sidebar");
const aside = document.querySelector(".aside");
const closeIcon = document.getElementById("close");

menuIcon.addEventListener("click", () => {
    aside.style.display = "block";
});

closeIcon.addEventListener("click", () => {
    aside.style.display = "none";
});



let selectedPriority = "";

const priorityButtons = document.querySelectorAll(".priority button");

priorityButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();

        // remove active from all
        priorityButtons.forEach(b => b.classList.remove("active"));

        // add active to clicked
        btn.classList.add("active");

        selectedPriority = btn.textContent.trim();
    });
});

const form = document.querySelector(".form");


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
    tasks.push(taskData);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    console.log("Saved Task:", taskData);
    alert("Task saved successfully!");

    form.reset();
    selectedPriority = "";
    priorityButtons.forEach(b => b.classList.remove("active"));

});
