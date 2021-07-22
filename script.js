const taskInput = document.querySelector("#taskInput");
const addTaskBtn = document.querySelector("#addBtn");
const toDoList = document.querySelector("#toDoList");
const doneTasksList = document.querySelector("#doneTasksList");

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
    taskName.className = "flex-grow task-name-wrapper";
    taskBtns.className = "space-x-5 hide";

    const doneBtn = document.createElement("button");
    doneBtn.innerHTML = "done";

    doneBtn.addEventListener("click", () => finishToDoItem(toDoList, taskDiv));

    const delBtn = document.createElement("button");
    delBtn.innerHTML = "delete";

    delBtn.addEventListener("click", () => deleteTodoItem(toDoList, taskDiv));

    taskBtns.append(doneBtn);
    taskBtns.append(delBtn);

    taskDiv.className = "border-b-2 border-gray-400 flex";

    taskDiv.append(taskName);
    taskDiv.append(taskBtns);
    taskDiv.append(document.createElement("br"));

    toDoList.insertBefore(taskDiv, toDoList.childNodes[0]);
}

const addTaskDoneListUI = (taskVal) => {
    const taskSpan = document.createElement("span");
    taskSpan.innerHTML = taskVal;
    taskSpan.style.textDecoration = "line-through";

    taskSpan.append(document.createElement("br"));
    doneTasksList.insertBefore(taskSpan, doneTasksList.childNodes[0]);
}

const finishToDoItem = (taskList, taskElem) => {
    const index = Array.prototype.indexOf.call(taskList.children, taskElem);
    const toFinishVal = toDos[index];

    toDos.splice(index, 1);
    updateListStorage(toDoListKey);
    addDoneTask(toFinishVal);

    // console.log(doneTasks);
    taskList.removeChild(taskElem);
}

const deleteTodoItem = (taskList, taskElem) => {
    const index = Array.prototype.indexOf.call(taskList.children, taskElem);
    toDos.splice(index, 1);
    updateListStorage(toDoListKey);
    // console.log(toDos);  

    taskList.removeChild(taskElem);
}

populateListsFromStorage();
