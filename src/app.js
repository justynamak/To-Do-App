import {
    NewTask
} from "./js/new-task";

import {
    generateHtml,
    updateDataId,
    removeElementHtml
} from "./js/tasks-list";

import {
    Tasks
} from "./js/tasks";

document.addEventListener("DOMContentLoaded", function () {

    const arr = new Tasks();
    const arrTasks = arr.tasks;
    const btn = document.querySelector("form");

    btn.addEventListener("submit", function (e) {
        e.preventDefault();

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
            task.setId(arr.addTask(task));
            generateHtml(task);
        }

        const btnsRemove = document.querySelectorAll(".delete-btn");
        const btnsCheck = document.querySelectorAll(".check-btn");
        const taskFields = document.querySelectorAll(".task-field");

        const removeElement = function () {
            const currentTaskId = this.closest("li").dataset.id;
            arr.removeTask(currentTaskId);
            removeElementHtml(currentTaskId);
            arrTasks.forEach(function (elem, index) {
                elem.setId(index);
            });
            updateDataId(arrTasks);
        };

        btnsRemove.forEach(button => {
            if (!(button.hasAttribute("data-click"))) {
                button.addEventListener("click", removeElement);
                button.setAttribute("data-click", "true");
            }
        });

        const checkElement = function () {
            this.firstElementChild.classList.add("btn-success");
            const currentTaskId = this.closest("li").dataset.id;
            arrTasks[currentTaskId].setDone(true);
        }

        btnsCheck.forEach(button => {
            button.addEventListener("click", checkElement);
        });

        const editTask = function () {
            const currentTaskId = this.closest("li").dataset.id;
            const currentValue = this.value;
            arrTasks[currentTaskId].setTask(currentValue);
            console.log(arrTasks);
        }

        taskFields.forEach(field => {
            if (!(field.hasAttribute("data-click"))) {
                field.addEventListener("input", editTask);
                field.setAttribute("data-click", "true");
            }
        });
    });
});