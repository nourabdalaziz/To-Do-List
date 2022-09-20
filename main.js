"use strict";
window.addEventListener("load", () => {
  const inputTask = document.getElementById("task-input");
  const assignee = document.getElementById("assignee-input");
  const btn = document.getElementById("addBtn");
  const tasksListElement = document.getElementById("tasksList");
  const footer = document.getElementById("pendingTasks");
  const search = document.getElementById("search");
  const storage = localStorage.getItem("tasks");
  let todolist_state = false;

  let tasksArr = storage ? JSON.parse(storage) : [];

  renderTasks(tasksArr);

  function create_UUID() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  }

  const cancelBtn = document.getElementById("cancelDeleting");
  const confDeleteBtn = document.getElementById("confirmDeleting");

  function deleteTask(id) {
    showConfirmBox();
    cancelBtn.addEventListener("click", closeConfirmBox);
    confDeleteBtn.addEventListener("click", fun);
    function fun() {
      confDeleteBtn.removeEventListener("click", fun);
      const index = tasksArr.findIndex((obj) => obj.id === id);
      tasksArr.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasksArr));
      changeJustHappened(tasksArr);
      closeConfirmBox();
    }
  }

  function showConfirmBox() {
    document.getElementById("overlay").hidden = false;
  }

  function closeConfirmBox() {
    document.getElementById("overlay").hidden = true;
  }

  function resetInputs() {
    inputTask.value = "";
    assignee.value = "";
    inputTask.focus();
  }

  function addTask() {
    tasksArr.push({
      task: inputTask.value,
      assignee: assignee.value,
      id: create_UUID(),
      isDone: false,
    });
    localStorage.setItem("tasks", JSON.stringify(tasksArr));
    resetInputs();
    changeJustHappened(tasksArr);
  }

  function toggleTask(id) {
    tasksArr = tasksArr.map((todo) =>
      todo.id === id
        ? {
            task: todo.task,
            assignee: todo.assignee,
            id: todo.id,
            isDone: !todo.isDone,
          }
        : todo
    );
    changeJustHappened(tasksArr);
  }

  function changeJustHappened(todos) {
    todolist_state = true;
    renderTasks(todos);
  }

  function renderTasks(todos, isSearch) {
    console.log(todolist_state);
    tasksListElement.innerHTML = "";
    let res = todos.map((element) => {
      const li = document.createElement("li");
      li.className = "tasksList-element";
      if (!element.isDone) {
        li.innerHTML = `
          <div class="task">${element.task} <br> ${element.assignee}</div>
          <div class="buttons" id="${element.id}" >
            <button class="delete" >Delete</button>
            <button class="done";>Done</button>
          </div>
        `;
      } else {
        li.innerHTML = `
          <div class="task"><s>${element.task} <br> ${element.assignee}</s></div>
          <div class="buttons" id="${element.id}" >
            <button class="delete" >Delete</button>
            <button class="done";>Done</button>
          </div>
        `;
      }
      return li;
    });

    tasksListElement.append(...res);

    let task_div = tasksListElement.getElementsByClassName("buttons");
    for (let el of task_div) {
      const task_btns = el.children;
      const deleteBtn = task_btns[0];
      deleteBtn.addEventListener("click", () => {
        deleteTask(el.id);
      });

      const doneBtn = task_btns[1];
      doneBtn.addEventListener("click", () => {
        toggleTask(el.id);
      });
    }
    if (isSearch) footer.innerHTML = `${res.length} search result found. `;
    else footer.innerHTML = `You have ${todos.length} pending tasks. `;
  }

  btn.addEventListener("click", addTask);

  search.addEventListener("keydown", (event) => {
    if (event.code !== "Enter") return;

    const searchFor = search.value.toString().toLowerCase();
    const res = tasksArr.filter(
      (obj) =>
        obj.task.toString().toLowerCase().includes(searchFor) ||
        obj.assignee.toString().toLowerCase().includes(searchFor)
    );
    renderTasks(res, true);
  });

  search.addEventListener("keyup", () => {
    const searchFor = search.value.toString().toLowerCase();
    if (!searchFor) {
      renderTasks(tasksArr);
    }
  });
});
