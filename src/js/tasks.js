class Tasks {
    constructor() {
        this.tasks = [];
    }
    addTask(obj) {
        this.tasks.push(obj);
        return this.tasks.indexOf(obj);
    }

    removeTask(id) {
        this.tasks.splice(id, 1);
    }
}
export {
    Tasks
};