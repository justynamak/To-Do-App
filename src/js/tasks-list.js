const generateHtml = (obj) => {

    const ul = document.querySelector("ul");
    const clone = document.querySelector("#clone");
    const li = clone.cloneNode(true);

    li.removeAttribute("id");
    li.style.display = "block";
    ul.appendChild(li);
    li.querySelector(".input-group-btn:last-child").classList.add("delete-btn");
    li.querySelector(".input-group-btn:first-child").classList.add("check-btn");
    li.querySelector(".input-group .form-control").classList.add("task-field");

    li.querySelector(".form-control").value = obj.task;
    li.dataset.id = obj.id;
}

const updateDataId = (arr) => {

    const items = [...document.querySelectorAll("li:not(#clone)")];

    arr.forEach((el, index) => {
        items[index].dataset.id = el.id;
    });
}

const removeElementHtml = (idCurrent, arr) => {

    const ul = document.querySelector("ul");
    const li = document.querySelector(`li[data-id="${idCurrent}"]`);
    ul.removeChild(li);
}

export {
    generateHtml,
    updateDataId,
    removeElementHtml
};