export const generateHtml = (obj) => {

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

export const updateDataId = (arr) => {

    const items = [...document.querySelectorAll(".single-task:not(#clone)")];

    arr.forEach((el, index) => {
        console.log(el, index);
        items[index].dataset.id = el.id;
    });
};

export const checkedTask = (task) => {
    const currentCheck = task.id;
    const currentItem = document.querySelector(`li[data-id="${currentCheck}"]`);
    const currentBtn = currentItem.querySelector(".check-btn");
    const currentSpan = currentItem.querySelector(".task-field");
    currentBtn.classList.add("btn-success");
}

export const showTasksCount = function (obj) {
    for (let key in obj) {
        const day = key;
        const count = obj[key].tasks.length;
        const navBadge = document.querySelector(`.nav-item[data-day="${day}"] .badge`);

        let done = 0;
        obj[key].tasks.forEach(task => {
            if (task.done) done++;
        });
        navBadge.innerHTML = `${done}/${count}`;
        if (count === done && count !== 0) navBadge.style.backgroundColor = "#28a745";
        else navBadge.style.backgroundColor = "";
    }
};

export const showDate = function (navItems) {
    const items = document.querySelectorAll(".date");
    const obj = new Date();
    const days = ["poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota", "niedziela"];
    const monthNames = ['styczeń', 'luty', 'marca', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'];
    let currentDay = obj.getDay() - 1;
    let date = obj.getDate();
    let month = obj.getMonth() - 1;
    let count = currentDay;


    items.forEach((item, i) => {
        if (i < currentDay) {
            item.innerHTML = `${date - count} ${monthNames[month]} ${days[i]}`;
            count--;
            console.log(days[i]);
        } else if (i === currentDay) {
            item.innerHTML = `${date} ${monthNames[month]} ${days[i]}`;
            console.log(days[i]);
        } else {
            count++;
            item.innerHTML = `${date + count} ${monthNames[month]} ${days[i]}`;
        }
    });
    return navItems[currentDay].dataset.day;
}