const taskInput = document.querySelector("#taskInput");
const addTaskBtn = document.querySelector("#addBtn");
const toDoListDiv = document.querySelector("#toDoList");
const doneTasksListDiv = document.querySelector("#doneTasksList");

const toDoDivClass = "todo-tasks-wrapper flex p-2 text-black rounded-sm transform hover:scale-x-110";
const doneTasksDivClass = "done-tasks-wrapper flex p-2 rounded-sm transform";
const taskNameClass = "flex-grow";
const taskBtnClass = "space-x-5 hide";

let toDos = [];
let doneTasks = [];

const toDoListKey = "toDos";
const doneTasksListKey = "doneTasks";

const isStorageSupported = () => (typeof (Storage) !== "undefined");

taskInput.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        addTaskBtn.click();
    }
});

addTaskBtn.addEventListener("click", () => {
    if (taskInput.value === "") {
        alert("Task cannot be empty");
        return;
    }

    const taskVal = taskInput.value;
    addToDo(taskVal);
    taskInput.value = "";
});


const addToDo = (taskVal) => {
    toDos.unshift(taskVal);
    addTaskToDoListUI(taskVal);
    updateListStorage(toDoListKey);
}

const addDoneTask = (taskVal) => {
    doneTasks.unshift(taskVal);
    addTaskDoneListUI(taskVal);
    updateListStorage(doneTasksListKey);
}

const populateListsFromStorage = () => {
    const savedToDos = JSON.parse(localStorage.getItem(toDoListKey));
    const savedDoneTasks = JSON.parse(localStorage.getItem(doneTasksListKey));

    if (savedToDos !== null) {
        toDos = [...savedToDos];
        savedToDos.reverse().forEach(task => {
            addTaskToDoListUI(task);
        });
    }

    if (savedDoneTasks !== null) {
        doneTasks = [...savedDoneTasks];
        savedDoneTasks.reverse().forEach((task) => {
            addTaskDoneListUI(task);
        });
    }
}

const updateListStorage = (key) => {
    if (isStorageSupported) {
        let arr = JSON.parse(localStorage.getItem(key)) || [];
        if (key === toDoListKey) arr = toDos;
        if (key === doneTasksListKey) arr = doneTasks;
        localStorage.setItem(key, JSON.stringify(arr));
    }
}

const addTaskToDoListUI = (taskVal) => {
    const taskDiv = document.createElement("div");
    const taskName = document.createElement("span");
    const taskBtns = document.createElement("div");

    taskName.innerHTML = taskVal;
    taskName.className = taskNameClass;
    taskBtns.className = taskBtnClass;

    const doneBtn = document.createElement("button");
    doneBtn.innerHTML = "Done";
    doneBtn.className = "text-green-400 hover:text-green-300";

    doneBtn.addEventListener("click", () => finishToDoTask(toDoListDiv, taskDiv));

    const delBtn = document.createElement("button");
    delBtn.innerHTML = "Del";
    delBtn.className = "text-red-400 hover:text-red-300";

    delBtn.addEventListener("click", () => deleteTodoTask(toDoListDiv, taskDiv));

    taskBtns.append(doneBtn);
    taskBtns.append(delBtn);

    taskDiv.className = toDoDivClass;

    taskDiv.append(taskName);
    taskDiv.append(taskBtns);
    taskDiv.append(document.createElement("br"));

    toDoListDiv.insertBefore(taskDiv, toDoListDiv.childNodes[0]);
}

const addTaskDoneListUI = (taskVal) => {
    const taskDiv = document.createElement("div");
    const taskName = document.createElement("span");
    const taskBtns = document.createElement("div");

    taskName.innerHTML = taskVal;
    taskName.className = taskNameClass;
    taskBtns.className = taskBtnClass;

    const delBtn = document.createElement("button");
    delBtn.innerHTML = "Del";
    delBtn.className = "text-red-400 hover:text-red-300";

    delBtn.addEventListener("click", () => deleteDoneTask(doneTasksListDiv, taskDiv));

    taskBtns.append(delBtn);

    taskDiv.style.textDecoration = "line-through";
    taskDiv.className = doneTasksDivClass;

    taskDiv.append(taskName);
    taskDiv.append(taskBtns);
    taskDiv.append(document.createElement("br"));

    doneTasksListDiv.insertBefore(taskDiv, doneTasksListDiv.childNodes[0]);
}

const finishToDoTask = (taskListDiv, taskDiv) => {
    const index = Array.prototype.indexOf.call(taskListDiv.children, taskDiv);
    const toFinishVal = toDos[index];

    toDos.splice(index, 1);
    updateListStorage(toDoListKey);
    addDoneTask(toFinishVal);

    // console.log(doneTasks);
    taskListDiv.removeChild(taskDiv);
}

const deleteTodoTask = (taskListDiv, taskDiv) => {
    const index = Array.prototype.indexOf.call(taskListDiv.children, taskDiv);
    toDos.splice(index, 1);
    updateListStorage(toDoListKey);
    // console.log(toDos);  

    taskListDiv.removeChild(taskDiv);
}

const deleteDoneTask = (taskListDiv, taskDiv) => {
    const index = Array.prototype.indexOf.call(taskListDiv.children, taskDiv);
    doneTasks.splice(index, 1);
    updateListStorage(doneTasksListKey);

    taskListDiv.removeChild(taskDiv);
}

populateListsFromStorage();
