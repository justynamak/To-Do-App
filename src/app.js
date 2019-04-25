import NewTask from "./js/new-task";
// import DayTasks from "./js/DayTasks";
import week from "./js/week";

import {
    generateHtml,
    updateDataId,
    removeElementHtml,
    checkedTask,
    showTasksCount,
    showDate
} from "./js/tasks-list";

(function () {
    const toDoList = document.querySelector("#to-do-list");
    const btnRemoveAll = document.querySelector(".btn-clear-all");
    const navItems = [...document.querySelectorAll(".nav-item")];

    const updateData = function () {
        localStorage.setItem("week", JSON.stringify(week));
    };

    const findActiveDay = function () {
        for (let key in week) {
            if (week[key].active) {
                return key;
            }
        }
    };
    const selectDay = function (day) {
        const index = navItems.findIndex(item => item.classList.contains("active"));
        navItems[index].classList.remove("active");
        document.querySelector(`.nav-item[data-day=${day}]`).classList.add("active");
    };

    const chooseDay = function (e) {
        const day = e.currentTarget.dataset.day;
        const items = [...document.querySelectorAll(".single-task:not(#clone)")];
        selectDay(day);
        const dayActive = findActiveDay();
        week[dayActive].active = false;
        week[day].active = true;

        if (!week[day].tasks.length) {
            btnRemoveAll.style.display = "none";
        }

        items.forEach(item => {
            toDoList.removeChild(item);
        });
        week[day].tasks.forEach(task => {
            generateHtml(task);
            if (task.done) {
                checkedTask(task);
            }
        });

        updateData();

    }

    const showContent = function () {
        if (localStorage.getItem("week")) {
            const localSt = localStorage.getItem("week");
            const data = JSON.parse(localSt);

            // const getDay = function () {
            //     for (let key in data) {
            //         if (data[key].active) {
            //             return key;
            //         }
            //     }
            // };
            // const day = getDay();
            const currentDay = showDate(navItems);
            selectDay(currentDay);
            week[currentDay].active = true;


            for (let key in data) {
                data[key].tasks.forEach(day => {
                    const elem = new NewTask();
                    elem.setTask(day.task);
                    elem.setDone(day.done);
                    elem.setId(day.id);
                    week[key].addTask(elem);
                });
            }
            data[currentDay].tasks.forEach(task => {
                generateHtml(task);

                if (task.done) {
                    checkedTask(task);
                }
            });
            showTasksCount(week);
        } else {
            const index = navItems.findIndex(item => item.classList.contains("active"));
            const activeDay = navItems[index].dataset.day;
            week[activeDay].active = true;
        }

        updateData();
    };

    const addNewTask = function (e) {
        e.preventDefault();
        const day = findActiveDay();

        if (week[day].tasks.length >= 10) {
            alert("Maksymalna ilość zadań to 10. Jeśli chcesz dodać nowe zadanie musisz coś usunąć");
            return;
        }

        function getValue() {
            const input = document.querySelector(".input-add");
            let inputValue = input.value;

            if (inputValue === "") return;
            input.value = "";
            return inputValue;
        }
        const value = getValue();
        let task;

        if (value) {
            task = new NewTask();
            task.setTask(value);
            task.setId(week[day].addTask(task));
            generateHtml(task);
            updateData();
            showTasksCount(week);
            $('#toast-added').toast('show');
        }
    };

    const removeTask = function (e) {
        e.preventDefault();
        if (e.target.classList.contains("delete-btn") || e.target.parentElement.classList.contains("delete-btn")) {
            const element = e.target.closest("li");
            const day = findActiveDay();
            week[day].removeTask(element.dataset.id);

            element.parentElement.removeChild(element);

            $('#toast-removed').toast('show');

            week[day].tasks.forEach((task, i) => {
                task.setId(i);
            });

            updateDataId(week[day].tasks);
            updateData();
            showTasksCount(week);

            if (!week[day].tasks.length) {
                btnRemoveAll.style.display = "none";
            }

        }
    };

    const checkTask = function (e) {
        e.preventDefault();
        if (e.target.classList.contains("check-btn") || e.target.parentElement.classList.contains("check-btn")) {
            const element = e.target.closest("li");
            const day = findActiveDay();
            week[day].tasks[element.dataset.id].setDone(true);
            if (e.target.classList.contains("check-btn")) e.target.classList.add("btn-success");
            else e.target.parentElement.classList.add("btn-success");
            updateData();
            showTasksCount(week);
        }
    };

    const updateTask = function (e) {
        e.preventDefault();
        if (e.target.classList.contains("task-field")) {
            const currentTaskId = e.target.closest("li").dataset.id;
            const currentValue = e.target.value;
            const day = findActiveDay();
            week[day].tasks[currentTaskId].setTask(currentValue);
            updateData();
        }
    }

    const removeAllTasks = function (e) {
        e.preventDefault();
        const day = findActiveDay();
        week[day].removeAllTasks();
        updateData();

        const elems = document.querySelectorAll('.single-task:not(#clone)');
        elems.forEach(elem => {
            toDoList.removeChild(elem);
        });
        if (!(week[day].tasks.length)) {
            btnRemoveAll.style.display = "none";
        }
        showTasksCount(week);
        $('#toast-removed-all').toast('show');
    };

    document.addEventListener("DOMContentLoaded", showContent);
    document.querySelector("#btn-add").addEventListener("click", addNewTask);
    toDoList.addEventListener("click", removeTask);
    toDoList.addEventListener("click", checkTask);
    toDoList.addEventListener("input", updateTask);
    btnRemoveAll.addEventListener("click", removeAllTasks);
    navItems.forEach(item => {
        item.addEventListener("click", chooseDay);
    });

})();