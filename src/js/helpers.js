export const findActiveDay = function(week) {
  for (let key in week) {
    if (week[key].active) {
      return key;
    }
  }
};
export const selectDay = function(day, navItems) {
  const index = navItems.findIndex(item =>
    item.classList.contains("active-day")
  );
  navItems[index].classList.remove("active-day");
  document
    .querySelector(`.nav-item[data-day=${day}]`)
    .classList.add("active-day");
};
export const checkIfYouCanAddATask = function(selectDay, currentDay, navItems) {
  const indexSelectDay = navItems.findIndex(
    elem => elem.dataset.day === selectDay
  );
  const indexCurrentDay = navItems.findIndex(
    elem => elem.dataset.day === currentDay
  );

  return indexCurrentDay <= indexSelectDay ? true : false;
};
export const generateHtml = obj => {
  const ul = document.querySelector("#to-do-list");
  const clone = document.querySelector("#clone");
  const li = clone.cloneNode(true);

  li.removeAttribute("id");
  li.style.display = "block";
  ul.appendChild(li);
  document.querySelector(".btn-clear-all").style.display = "block";
  li.querySelector(".delete-task-btn").classList.add("delete-btn");
  li.querySelector(".task-panel:first-child button").classList.add("check-btn");
  li.querySelector(".task-panel .form-control").classList.add("task-field");

  li.querySelector(".form-control").value = obj.task;
  li.dataset.id = obj.id;
};

export const updateDataId = arr => {
  const items = [...document.querySelectorAll(".single-task:not(#clone)")];

  arr.forEach((el, index) => {
    items[index].dataset.id = el.id;
  });
};

export const checkedTask = task => {
  const currentCheck = task.id;
  const currentItem = document.querySelector(`li[data-id="${currentCheck}"]`);
  const currentBtn = currentItem.querySelector(".check-btn");
  const currentSpan = currentItem.querySelector(".task-field");
  currentBtn.classList.add("btn-success");
};

export const showTasksCount = function(obj) {
  for (let key in obj) {
    const day = key;
    const count = obj[key].tasks.length;
    const navBadge = document.querySelector(
      `.nav-item[data-day="${day}"] .badge`
    );

    let done = 0;
    obj[key].tasks.forEach(task => {
      if (task.done) done++;
    });
    navBadge.innerHTML = `${done}/${count}`;
    if (count === done && count !== 0) {
      navBadge.style.backgroundColor = "#20c997";
    } else if (count > 0 && count > done) {
      navBadge.style.backgroundColor = "#FFC107";
    } else {
      navBadge.style.backgroundColor = "";
    }
  }
};

export const showDate = function(navItems, week) {
  const items = document.querySelectorAll(".date");
  const today = new Date();
  const days = [
    "poniedziałek",
    "wtorek",
    "środa",
    "czwartek",
    "piątek",
    "sobota",
    "niedziela"
  ];
  const monthNames = [
    "styczeń",
    "luty",
    "marzec",
    "kwiecień",
    "maj",
    "czerwiec",
    "lipiec",
    "sierpień",
    "wrzesień",
    "październik",
    "listopad",
    "grudzień"
  ];
  let currentDay = today.getDay() - 1 >= 0 ? today.getDay() - 1 : 6;
  let date = today.getDate();
  let count = currentDay;

  const getDaysInMonth = function(month, year) {
    return new Date(year, month, 0).getDate();
  };
  const checkDayIsLast = function(otherDay) {
    const monthLength = getDaysInMonth(
      otherDay.getMonth() + 1,
      otherDay.getFullYear()
    );
    if (otherDay.getDate() === monthLength) {
      return true;
    }
  };
  items.forEach((item, i) => {
    const otherDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    // const monthOtherDay = (otherDay.getDate() > date) ? today.getMonth() - 1 : today.getMonth();
    // otherDay.setMonth(monthOtherDay);
    //console.log(monthOtherDay);
    if (i < currentDay) {
      if (checkDayIsLast(otherDay)) {
        otherDay.setDate(1);
        otherDay.setMonth(today.getMonth());
      } else {
        otherDay.setDate(date - count);
      }

      item.innerHTML = `${otherDay.getDate()} ${
        monthNames[otherDay.getMonth()]
      } ${days[i]}`;
      count--;
    } else if (i === currentDay) {
      item.innerHTML = `${today.getDate()} ${monthNames[today.getMonth()]} ${
        days[i]
      }`;
    } else {
      count++;
      if (checkDayIsLast(otherDay)) {
        otherDay.setDate(1);
        otherDay.setMonth(today.getMonth());
      } else {
        otherDay.setDate(today.getDate() + count);
      }
      item.innerHTML = `${otherDay.getDate()} ${
        monthNames[otherDay.getMonth()]
      } ${days[i]}`;
    }
  });
  return navItems[currentDay].dataset.day;
};
export const addDateToWeekObj = function(week, navItems) {
  let i = 0;
  for (let key in week) {
    week[key].date = navItems[i].innerText;
    i++;
  }
};
export const clearAllTasks = function(week, navItems) {
  let i = 0;

  for (let key in week) {
    let val1 = week[key].date;
    let val2 = navItems[i].innerText;
    if (val1 === null) return;
    else if (val1.substring(0) !== val2.substring(0)) {
      week[key].tasks = [];
    }
    i++;
  }
};
