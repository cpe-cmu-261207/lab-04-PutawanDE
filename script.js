const taskInput = document.querySelector("#taskInput");
const addTaskBtn = document.querySelector("#addBtn");
const toDoList = document.querySelector("#toDoList");
const doneTasksList = document.querySelector("#doneTasksList");

const toDos = [];
const doneTasks = [];

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
    const retrievedToDos = JSON.parse(localStorage.getItem(toDoListKey));
    const retrievedDoneTasks = JSON.parse(localStorage.getItem(doneTasksListKey));

    if (retrievedToDos !== null) {
        retrievedToDos.reverse().forEach(task => {
            toDos.unshift(task);
            addTaskToDoListUI(task);
        });
    }

    if (retrievedDoneTasks !== null) {
        retrievedDoneTasks.reverse().forEach((task) => {
            doneTasks.unshift(task);
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
    const taskSpan = document.createElement("span");
    taskSpan.innerHTML = taskVal;

    const doneBtn = document.createElement("button");
    doneBtn.innerHTML = "done";

    doneBtn.addEventListener("click", () => finishToDoItem(toDoList, taskSpan));

    const delBtn = document.createElement("button");
    delBtn.innerHTML = "delete";

    delBtn.addEventListener("click", () => deleteTodoItem(toDoList, taskSpan));

    taskSpan.append(doneBtn);
    taskSpan.append(delBtn);
    taskSpan.append(document.createElement("br"));

    toDoList.insertBefore(taskSpan, toDoList.childNodes[0]);
}

const addTaskDoneListUI = (taskVal) => {
    const taskSpan = document.createElement("span");
    taskSpan.innerHTML = taskVal;
    taskSpan.style.textDecoration = "line-through";

    taskSpan.append(document.createElement("br"));
    doneTasksList.insertBefore(taskSpan, doneTasksList.childNodes[0]);
}

const finishToDoItem = (taskList, taskSpan) => {
    const index = Array.prototype.indexOf.call(taskList.children, taskSpan);
    const toFinishVal = toDos[index];

    toDos.splice(index, 1);
    updateListStorage(toDoListKey);
    addDoneTask(toFinishVal);

    // console.log(doneTasks);
    taskList.removeChild(taskSpan);
}

const deleteTodoItem = (taskList, taskSpan) => {
    const index = Array.prototype.indexOf.call(taskList.children, taskSpan);
    toDos.splice(index, 1);
    updateListStorage(toDoListKey);
    // console.log(toDos);  

    taskList.removeChild(taskSpan);
}

populateListsFromStorage();
