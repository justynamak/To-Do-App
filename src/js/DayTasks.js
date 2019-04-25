class DayTasks {
    constructor() {
        this.tasks = [];
        this.active = false;

    }
    addTask(obj) {
        this.tasks.push(obj);
        return this.tasks.indexOf(obj);
    }

    removeTask(id) {
        this.tasks.splice(id, 1);
    }
    removeAllTasks() {
        this.tasks.splice(0, this.tasks.length);
    }
}
export default DayTasks;