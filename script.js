// get current date

const d = new Date();
document.getElementById("date").innerText =
    d.toDateString();


// side bar 
const menuIcon = document.getElementById("sidebar");
const aside = document.querySelector(".aside");
const closeIcon = document.querySelector(".close-icon");


menuIcon.addEventListener("click", () => {
    aside.style.display = "block";

});

closeIcon.addEventListener("click", () => {
    aside.style.display = "none";

});
// color for icons
const projectColors = {
    work: {
        color: "#00663e",
        bg: "#d1fae5"
    },
    personal: {
        color: "#7700cd",
        bg: "#f3e8ff"
    },
    shopping: {
        color: "#ea580c",
        bg: "#ffedd5"
    },
    wishlist: {
        color: "#ec4899",
        bg: "#fce7f3"
    }
};

// task data
const tasks = {
    today: [
        {
            title: "Review Q3 Financial Reports",
            time: "2:00 PM",
            category: "work"
        },
        {
            title: "Call Dentist",
            time: "5:00 PM",
            category: "personal"
        },
        {
            title: "Email Marketing Team",
            time: "5:30 PM",
            category: "work"
        }
    ],

    tomorrow: [
        {
            title: "Buy Birthday Gift",
            category: "shopping",
            note: "Shopping List",
            icon: "fa-cart-shopping"
        },
        {
            title: "Submit Expense Report",
            category: "work",
            note: "Work",
            icon: "fa-file-lines"
        }
    ],

    week: [
        {
            title: "Car Service Appointment",
            category: "work",
            note: "Thursday, 9:00 AM",
            icon: "fa-car"
        },
        {
            title: "Book Flight to NYC",
            category: "wishlist",
            note: "Friday, All Day",
            icon: "fa-jet-fighter-up"
        }
    ]
};

// render today task
function renderToday() {
    const box = document.getElementById("todayTasks");
    box.innerHTML = "";

    tasks.today.forEach(task => {
        box.innerHTML += `
      <div class="list">
        <input type="checkbox">
        <div>
          <p>${task.title}</p>
          <div class="span">
            <span class="time">
              <i class="fa-solid fa-clock"></i>${task.time}
            </span>
            <span class="${task.category}">
              ${task.category.charAt(0).toUpperCase() + task.category.slice(1)}
            </span>
          </div>
        </div>
      </div>
    `;
    });
}

// rendering tomorrow 

function renderTomorrow() {
    const box = document.getElementById("tomorrowTasks");
    box.innerHTML = "";

    tasks.tomorrow.forEach(task => {
        const colors = projectColors[task.category];

        box.innerHTML += `
      <div class="upcontent">
        <div class="upicon"
          style="background:${colors.bg}; color:${colors.color}">
          <i class="fa-solid ${task.icon}"></i>
        </div>

        <div class="upnote">
          <h4>${task.title}</h4>
          <p>${task.note}</p>
        </div>
      </div>
    `;
    });
}

// rendering this week

function renderWeek() {
    const box = document.getElementById("weekTasks");
    box.innerHTML = "";

    tasks.week.forEach(task => {
        const colors = projectColors[task.category];

        box.innerHTML += `
      <div class="upcontent">
        <div class="upicon"
          style="background:${colors.bg}; color:${colors.color}">
          <i class="fa-solid ${task.icon}"></i>
        </div>

        <div class="upnote">
          <h4>${task.title}</h4>
          <p>${task.note}</p>
        </div>
      </div>
    `;
    });
}

renderToday();
renderTomorrow();
renderWeek();
