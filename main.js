"use strict";
window.addEventListener("load", () => {
  const inputTask = document.getElementById("task-input");
  const assignee = document.getElementById("assignee-input");
  const btn = document.getElementById("addBtn");
  const tasksListElement = document.getElementById("toDoApp-tasksList");
  const footer = document.getElementById("pendingTasks");
  const search = document.getElementById("search");

  let tasksArr = localStorage.getItem("tasks")
    ? JSON.parse(localStorage.getItem("tasks"))
    : [];

  function deleteTask(index) {
    let confirmDelete = confirm(
      "Are you sure that you want to delete this task?"
    );
    if (confirmDelete) {
      tasksArr.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasksArr));
    }
    renderTasks();
  }

  function addTask() {
    tasksArr.push({ task: inputTask.value, assignee: assignee.value });
    localStorage.setItem("tasks", JSON.stringify(tasksArr));
    inputTask.value = "";
    assignee.value = "";

    inputTask.focus();
    renderTasks();
  }

  function renderTasks() {
    tasksListElement.innerHTML = "";
    tasksArr.forEach((element, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div>${element.task}</div>
        <div>${element.assignee}</div>
        <button class="delete";>delete</button>
      `;

      tasksListElement.append(li);

      const deleteBtn = document.getElementsByClassName("delete")[index];
      deleteBtn.addEventListener("click", deleteTask);
    });
    footer.innerHTML = `You have ${tasksArr.length} pending tasks. `;
  }
  renderTasks();


  btn.addEventListener("click", addTask);


  search.addEventListener("keydown", (event) => {
    if (event.code == "Enter") {
      let searchFor = search.value.toString().toLowerCase();
      let res = tasksArr.filter(
        (obj) =>
          obj.task.toString().toLowerCase().includes(searchFor) ||
          obj.assignee.toString().toLowerCase().includes(searchFor)
      );

      tasksListElement.innerHTML = "";
      res.forEach((element, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
        <div>${element.task}</div>
        <div>${element.assignee}</div>
        <button class="delete";>delete</button>
      `;

        tasksListElement.append(li);

        const deleteBtn = document.getElementsByClassName("delete")[index];
        deleteBtn.addEventListener("click", deleteTask);
      });
      footer.innerHTML = `${res.length} search result found. `;
    }
  });

  search.addEventListener("keyup", (event) => {
    let searchFor = search.value.toString().toLowerCase();
    if (!searchFor) {
      renderTasks();
    }
  });
});
