class NewTask {
    constructor() {
        this.task = null;
        this.done = false;
        this.id = 0;
    }
    setTask(inputValue) {
        this.task = inputValue;
    }

    setDone(val) {
        this.done = val;
    }

    setId(id) {
        this.id = id;
    }

}
export default NewTask;