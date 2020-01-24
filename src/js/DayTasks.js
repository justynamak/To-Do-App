class DayTasks {
  constructor() {
    this.tasks = [];
    this.active = false;
    this.date = null;
  }
  setActive(val) {
    this.active = val;
    return this;
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
  findTask(letters) {
    const reg = new RegExp(`${letters}`);
    const tasks = this.tasks.filter(day => {
      if (reg.test(day.task)) {
        return true;
      } else return false;
    });

    return tasks;
  }
}
export default DayTasks;
