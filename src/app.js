import "@fortawesome/fontawesome-free/css/all.min.css";
import "./css/style.css";
import "@fortawesome/fontawesome-free/js/all";

import NewTask from "./js/new-task";
import week from "./js/week";

import {
  findActiveDay,
  selectDay,
  generateHtml,
  updateDataId,
  checkedTask,
  showTasksCount,
  showDate,
  addDateToWeekObj,
  clearAllTasks,
  checkIfYouCanAddATask
} from "./js/helpers";

(function() {
  const toDoList = document.querySelector("#to-do-list");
  const btnRemoveAll = document.querySelector(".btn-clear-all");
  const navItems = [...document.querySelectorAll(".nav-item")];
  const menuPanelItems = [...document.querySelectorAll(".menu-panel-item")];
  const inputFieldAdd = document.querySelector("#inputAdd");
  const searchForm = document.querySelector("#searchForm");
  const searchResults = document.querySelector(".search-results");
  const navButton = document.querySelector("#navButton");
  const nav = document.querySelector("#main-nav");
  const mainSetupPanel = document.querySelector(".main-setup-panel");
  const closeButton = document.querySelector("#closeButton");
  const noTaskInfo = document.querySelector("#noTaskInfo");

  const showInfoNoTask = function() {
    noTaskInfo.classList.add("active");
  };
  const hideInfoNoTask = function() {
    noTaskInfo.classList.remove("active");
  };
  const updateData = function() {
    localStorage.setItem("week", JSON.stringify(week));
  };
  const selectCurrentDay = function() {
    const curentDay = showDate(navItems, week);
    navItems
      .find(element => element.dataset.day === curentDay)
      .querySelector(".date").style.color = "#ff5555";
  };
  const chooseDay = function(e) {
    const day = e.currentTarget.dataset.day;
    const items = [...document.querySelectorAll(".single-task:not(#clone)")];
    selectDay(day, navItems);
    const dayActive = findActiveDay(week);
    week[dayActive].active = false;
    week[day].active = true;

    if (!week[day].tasks.length) {
      btnRemoveAll.style.display = "none";
      showInfoNoTask();
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
  };

  const showContent = function() {
    const currentDay = showDate(navItems, week);
    selectDay(currentDay, navItems);
    week[currentDay].active = true;

    const localSt = localStorage.getItem("week");
    const data = JSON.parse(localSt);
    clearAllTasks(data, navItems);
    addDateToWeekObj(week, navItems);

    if (localStorage.getItem("week")) {
      for (let key in data) {
        data[key].tasks.forEach(day => {
          const elem = new NewTask();
          elem.setTask(day.task);
          elem.setDone(day.done);
          elem.setId(day.id);
          week[key].addTask(elem);
        });
      }
      if (!data[currentDay].tasks.length) {
        showInfoNoTask();
      } else {
        data[currentDay].tasks.forEach(task => {
          generateHtml(task);
          hideInfoNoTask();

          if (task.done) {
            checkedTask(task);
          }
        });
      }
    }
    showTasksCount(week);
    updateData();
  };

  const addNewTask = function(e) {
    e.preventDefault();
    const day = findActiveDay(week);

    if (week[day].tasks.length >= 10) {
      alert(
        "Maksymalna ilość zadań to 10. Jeśli chcesz dodać nowe zadanie musisz coś usunąć"
      );
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

    if (
      value &&
      checkIfYouCanAddATask(day, showDate(navItems, week), navItems)
    ) {
      task = new NewTask();
      task.setTask(value);
      task.setId(week[day].addTask(task));
      generateHtml(task);
      updateData();
      showTasksCount(week);
      $("#toast-added").toast("show");
      if (noTaskInfo.classList.contains("active")) hideInfoNoTask();
    } else {
      $("#toast-block-task").toast("show");
    }
  };

  const removeTask = function(e) {
    e.preventDefault();
    if (
      e.target.classList.contains("delete-btn") ||
      e.target.parentElement.classList.contains("delete-btn")
    ) {
      const element = e.target.closest("li");
      const day = findActiveDay(week);
      week[day].removeTask(element.dataset.id);

      element.parentElement.removeChild(element);

      $("#toast-removed").toast("show");

      week[day].tasks.forEach((task, i) => {
        task.setId(i);
      });

      updateDataId(week[day].tasks);
      updateData();
      showTasksCount(week);

      if (!week[day].tasks.length) {
        btnRemoveAll.style.display = "none";
        showInfoNoTask();
      }
    }
  };

  const checkTask = function(e) {
    e.preventDefault();
    if (
      e.target.classList.contains("check-btn") ||
      e.target.parentElement.classList.contains("check-btn")
    ) {
      const element = e.target.closest("li");
      const input = e.target
        .closest(".task-panel")
        .querySelector(".task-field");
      const day = findActiveDay(week);
      week[day].tasks[element.dataset.id].setDone(true);
      if (e.target.classList.contains("check-btn"))
        e.target.classList.add("btn-success-custom");
      else e.target.parentElement.classList.add("btn-success-custom");

      input.classList.add("line-through");
      updateData();
      showTasksCount(week);
    }
  };

  const updateTask = function(e) {
    e.preventDefault();
    if (e.target.classList.contains("task-field")) {
      const currentTaskId = e.target.closest("li").dataset.id;
      const currentValue = e.target.value;
      const day = findActiveDay(week);
      week[day].tasks[currentTaskId].setTask(currentValue);
      updateData();
    }
  };

  const removeAllTasks = function(e) {
    e.preventDefault();
    const day = findActiveDay(week);
    week[day].removeAllTasks();
    updateData();

    const elems = document.querySelectorAll(".single-task:not(#clone)");
    elems.forEach(elem => {
      toDoList.removeChild(elem);
    });
    if (!week[day].tasks.length) {
      btnRemoveAll.style.display = "none";
      showInfoNoTask();
    }
    showTasksCount(week);
    $("#toast-removed-all").toast("show");
  };
  const clearAllElementsActiveClass = function(elements, className) {
    const elems = document.querySelectorAll(elements);
    elems.forEach(elem => elem.classList.remove(className));
  };
  const changeVisibilityCloseButton = function() {
    if (
      mainSetupPanel.classList.contains("active-mobile-panel") ||
      nav.classList.contains("active-mobile-nav")
    ) {
      closeButton.classList.add("active");
    } else {
      closeButton.classList.remove("active");
    }
  };
  const changePanelActive = function(e) {
    const name = e.currentTarget.getAttribute("name");
    mainSetupPanel.classList.add("active-mobile-panel");
    clearAllElementsActiveClass(".menu-panel-item", "menu-panel-item-active");
    const element = document.querySelector(`[name = ${name}]`);
    element.classList.add("menu-panel-item-active");
    changeVisibilityElement(name);
  };
  const changeVisibilityElement = function(id) {
    const element = document.querySelector(`#${id}`);

    clearAllElementsActiveClass(".main-setup-panel-content", "active");
    element.classList.add("active");
    changeVisibilityCloseButton();
  };
  const removeItems = function(list) {
    list.innerHTML = "";
  };
  const createListItems = function(results, date) {
    results.forEach(item => {
      const li = document.createElement("li");
      document.querySelector(".search-results-list").appendChild(li);
      if (item.done) li.innerHTML = `<a href="#" class="done">${item.task}</a>`;
      else li.innerHTML = `<a href="#" class="not-done">${item.task}</a>`;
      li.classList.add("search-results-item");
    });
  };
  const createListResults = function() {
    const ul = document.createElement("ul");
    searchResults.appendChild(ul);
    ul.classList.add("search-results-list");
  };
  const showSearchResults = function(results, date) {
    searchResults.classList.add("active");
    const items = searchResults.querySelector("li");
    const ul = searchResults.querySelector("ul");
    if (items) removeItems(ul);
    if (!ul) createListResults();
    createListItems(results, date);
  };

  const handleInputSearchChange = function(e) {
    let value = this.value;
    if (value) {
      let searchResults = [];
      for (let key in week) {
        let tasks = week[key].findTask(value);
        if (tasks.length > 0) {
          tasks.forEach(task => searchResults.push(task));
        }
        showSearchResults(searchResults);
      }
    } else {
      searchResults.classList.remove("active");
    }
  };

  const handleCloseMenuPanel = function() {
    mainSetupPanel.classList.remove("active-mobile-panel");
    if (nav.classList.contains("active-mobile-nav")) {
      nav.classList.remove("active-mobile-nav");
    }
    if (nav.classList.contains("active-mobile-nav")) {
      nav.classList.remove("active-mobile-nav");
    }
    changeVisibilityCloseButton();
  };
  const toggleVisibilityMobileNav = function() {
    const navActive = nav.classList.contains("active-mobile-nav");
    if (
      mainSetupPanel.classList.contains("active-mobile-panel") &&
      !navActive
    ) {
      nav.classList.add("active-mobile-nav");
      handleCloseMenuPanel();
    } else {
      nav.classList.add("active-mobile-nav");
    }
    changeVisibilityCloseButton();
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
  menuPanelItems.forEach(item =>
    item.addEventListener("click", changePanelActive)
  );
  inputFieldAdd.addEventListener("keyup", handleInputSearchChange);
  navButton.addEventListener("click", toggleVisibilityMobileNav);
  closeButton.addEventListener("click", handleCloseMenuPanel);
  searchForm.addEventListener("submit", e => e.preventDefault());

  selectCurrentDay();
})();
