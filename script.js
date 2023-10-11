var taskObj = {
    key: "projects",
  
    addProject: function () {
      if (document.getElementById("add-project").value == "") {
        swal("Please enter User name");
        return false;
      }
  
      var option = "";
      if (localStorage.getItem(this.key) == null) {
        localStorage.setItem(this.key, "[]");
      }
  
      var data = JSON.parse(localStorage.getItem(this.key));
  
      var project = {
        id: data.length,
        name: document.getElementById("add-project").value,
        tasks: [],
      };
  
      data.push(project);
      localStorage.setItem(this.key, JSON.stringify(data));
  
      this.loadAllProjects();
  
      this.showAllTasks();
    },
  
    getAllProjects: function () {
      if (localStorage.getItem(this.key) == null) {
        localStorage.setItem(this.key, "[]");
      }
      return JSON.parse(localStorage.getItem(this.key));
    },
  
    getProject: function (id) {
      var projects = this.getAllProjects();
      for (var a = 0; a < projects.length; a++) {
        if (projects[a].id == id) {
          return projects[a];
        }
      }
      return null;
    },
  
    loadAllProjects: function () {
      var projects = taskObj.getAllProjects();
      projects = projects.reverse();
      var html = "<option value=''>Select User</option>";
      for (var a = 0; a < projects.length; a++) {
        html +=
          "<option value='" +
          projects[a].id +
          "'>" +
          projects[a].name +
          "</option>";
      }
      document.getElementById("add-task-project").innerHTML = html;
      document.getElementById(
        "form-task-hour-calculator-all-projects"
      ).innerHTML = html;
    },
  
    addTask: function (form) {
      var project = form.project.value;
      var task = form.task.value;
  
      var projects = this.getAllProjects();
      for (var a = 0; a < projects.length; a++) {
        if (projects[a].id == project) {
          var taskObj = {
            id: projects[a].tasks.length,
            name: task,
            status: "Progress",
            isStarted: false,
            logs: [],
            started: this.getCurrentTimeInTaskStartEndFormat(),
            ended: "",
          };
          projects[a].tasks.push(taskObj);
          break;
        }
      }
  
      localStorage.setItem(this.key, JSON.stringify(projects));
  
      jQuery("#addTaskModal").modal("hide");
      jQuery(".modal-backdrop").remove();
  
      this.showAllTasks();
  
      return false;
    },
  
    showAllTasks: function () {
      var html = "";
  
      var projects = this.getAllProjects();
      for (var a = 0; a < projects.length; a++) {
        projects[a].tasks = projects[a].tasks.reverse();
  
        for (var b = 0; b < projects[a].tasks.length; b++) {
          html += "<tr>";
          html += "<td>" + projects[a].tasks[b].name + "</td>";
          html += "<td>" + projects[a].name + "</td>";
          if (projects[a].tasks[b].isStarted) {
            html += "<td><label class='started'>Started</label></td>";
          } else {
            if (projects[a].tasks[b].status == "Completed") {
              html +=
                "<td><label class='completed'>" +
                projects[a].tasks[b].status +
                "</label></td>";
            } else {
              html += "<td>" + projects[a].tasks[b].status + "</td>";
            }
          }
  
          var duration = 0;
          for (var c = 0; c < projects[a].tasks[b].logs.length; c++) {
            var log = projects[a].tasks[b].logs[c];
            if (log.endTime > 0) {
              duration += log.endTime - log.startTime;
            }
          }
  
          duration = Math.abs((duration / 1000).toFixed(0));
          var hours = Math.floor(duration / 3600) % 24;
          hours = hours < 10 ? "0" + hours : hours;
          var minutes = Math.floor(duration / 60) % 60;
          minutes = minutes < 10 ? "0" + minutes : minutes;
          var seconds = duration % 60;
          seconds = seconds < 10 ? "0" + seconds : seconds;
  
          if (projects[a].tasks[b].isStarted) {
            var dataStartedObj = {
              duration: duration,
              project: projects[a].id,
              task: projects[a].tasks[b].id,
            };
            html +=
              "<td data-started='" +
              JSON.stringify(dataStartedObj) +
              "'>" +
              hours +
              ":" +
              minutes +
              ":" +
              seconds +
              "</td>";
          } else {
            html += "<td>" + hours + ":" + minutes + ":" + seconds + "</td>";
          }
  
          if (projects[a].tasks[b].status == "Completed") {
            html +=
              "<td>" +
              projects[a].tasks[b].started +
              "<br><span style='margin-left: 30px;'>to</span><br>" +
              projects[a].tasks[b].ended +
              "</td>";
          } else {
            html += "<td>" + projects[a].tasks[b].started + "</td>";
          }
  
          html += "<td>";
          html +=
            "<form method='POST' id='form-change-task-status-" +
            projects[a].id +
            projects[a].tasks[b].id +
            "'>";
          html +=
            "<input type='hidden' name='project' value='" + projects[a].id + "'>";
          html +=
            "<input type='hidden' name='task' value='" +
            projects[a].tasks[b].id +
            "'>";
          html +=
            "<select class='form-control' name='status' onchange='taskObj.changeTaskStatus(this);' data-form-id='form-change-task-status-" +
            projects[a].id +
            projects[a].tasks[b].id +
            "'>";
          html += "<option value=''>Change status</option>";
          if (projects[a].tasks[b].isStarted) {
            html += "<option value='stop'>Stop</option>";
          } else {
            html += "<option value='start'>Start</option>";
          }
          if (projects[a].tasks[b].status == "Progress") {
            html += "<option value='complete'>Mark as Completed</option>";
          } else {
            html += "<option value='progress'>Make in Progress Again</option>";
          }
          html += "<option value='delete'>Delete</option>";
          html += "</select>";
          html += "</form>";
          html += "</td>";
          html += "</tr>";
        }
      }
      document.getElementById("all-tasks").innerHTML = html;
    },
  
    getCurrentTimeInTaskStartEndFormat() {
      let current_datetime = new Date();
      var date = current_datetime.getDate();
      date = date < 10 ? "0" + date : date;
      var month = current_datetime.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      var hours = current_datetime.getHours();
      hours = hours < 10 ? "0" + hours : hours;
      var minutes = current_datetime.getMinutes();
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var seconds = current_datetime.getSeconds();
      seconds = seconds < 10 ? "0" + seconds : seconds;
      let formatted_date =
        current_datetime.getFullYear() +
        "-" +
        month +
        "-" +
        date +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;
      return formatted_date;
    },
  
    changeTaskStatus: function (self) {
      if (self.value == "") {
        return;
      }
  
      var formId = self.getAttribute("data-form-id");
      var form = document.getElementById(formId);
      var projects = this.getAllProjects();
      for (var a = 0; a < projects.length; a++) {
        if (projects[a].id == form.project.value) {
          for (var b = 0; b < projects[a].tasks.length; b++) {
            if (projects[a].tasks[b].id == form.task.value) {
              if (self.value == "delete") {
                swal({
                  title: "Are you sure?",
                  text: "Deleting the task will delete its hours too.",
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                }).then((willDelete) => {
                  if (willDelete) {
                    projects[a].tasks.splice(b, 1);
  
                    localStorage.setItem(this.key, JSON.stringify(projects));
  
                    this.showAllTasks();
                  } else {
                    self.value = "";
                  }
                });
              } else if (self.value == "complete") {
                projects[a].tasks[b].status = "Completed";
  
                projects[a].tasks[b].isStarted = false;
  
                projects[a].tasks[b].ended =
                  this.getCurrentTimeInTaskStartEndFormat();
                for (var c = 0; c < projects[a].tasks[b].logs.length; c++) {
                  if (projects[a].tasks[b].logs[c].endTime == 0) {
                    projects[a].tasks[b].logs[c].endTime = new Date().getTime();
                    break;
                  }
                }
              } else if (self.value == "progress") {
                projects[a].tasks[b].status = "Progress";
  
                projects[a].tasks[b].isStarted = false;
              } else if (self.value == "start") {
                swal({
                  title: "Are you sure?",
                  text: "This will start the timer.",
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                }).then((doStart) => {
                  if (doStart) {
                    projects[a].tasks[b].isStarted = true;
  
                    var logObj = {
                      id: projects[a].tasks[b].logs.length,
                      startTime: new Date().getTime(),
                      endTime: 0,
                    };
                    projects[a].tasks[b].logs.push(logObj);
  
                    localStorage.setItem(this.key, JSON.stringify(projects));
  
                    this.showAllTasks();
                  } else {
                    self.value = "";
                  }
                });
              } else if (self.value == "stop") {
                swal({
                  title: "Are you sure?",
                  text: "This will stop the timer.",
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                }).then((doStop) => {
                  if (doStop) {
                    projects[a].tasks[b].isStarted = false;
  
                    for (var c = 0; c < projects[a].tasks[b].logs.length; c++) {
                      if (projects[a].tasks[b].logs[c].endTime == 0) {
                        projects[a].tasks[b].logs[c].endTime =
                          new Date().getTime();
                        break;
                      }
                    }
  
                    localStorage.setItem(this.key, JSON.stringify(projects));
  
                    this.showAllTasks();
                  } else {
                    self.value = "";
                  }
                });
              }
              break;
            }
          }
          break;
        }
      }
  
      if (
        self.value == "delete" ||
        self.value == "start" ||
        self.value == "stop"
      ) {
        //
      } else {
        localStorage.setItem(this.key, JSON.stringify(projects));
        this.showAllTasks();
      }
    },
  
    deleteProject: function (self) {
      if (self.project.value == "") {
        swal("Please select a User to delete");
        return false;
      }
  
      swal({
        title: "Are you sure?",
        text: "Deleting the User will delete its tasks too.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          var projects = this.getAllProjects();
          for (var a = 0; a < projects.length; a++) {
            if (projects[a].id == self.project.value) {
              projects.splice(a, 1);
              localStorage.setItem(this.key, JSON.stringify(projects));
  
              this.loadAllProjects();
              this.showAllTasks();
  
              break;
            }
          }
        } else {
          self.project.value = "";
        }
      });
      return false;
    },
  };
  
  window.addEventListener("load", function () {
    taskObj.loadAllProjects();
    taskObj.showAllTasks();
  
    setInterval(function () {
      var dataStarted = document.querySelectorAll("td[data-started]");
      for (var i = 0; i < dataStarted.length; i++) {
        var dataStartedObj = dataStarted[i].getAttribute("data-started");
        var dataStartedObj = JSON.parse(dataStartedObj);
        dataStartedObj.duration++;
  
        var hours = Math.floor(dataStartedObj.duration / 3600) % 24;
        hours = hours < 10 ? "0" + hours : hours;
        var minutes = Math.floor(dataStartedObj.duration / 60) % 60;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        var seconds = dataStartedObj.duration % 60;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        dataStarted[i].innerHTML = hours + ":" + minutes + ":" + seconds;
  
        var projects = taskObj.getAllProjects();
        for (var a = 0; a < projects.length; a++) {
          if (projects[a].id == dataStartedObj.project) {
            for (var b = 0; b < projects[a].tasks.length; b++) {
              if (projects[a].tasks[b].id == dataStartedObj.task) {
                for (var c = 0; c < projects[a].tasks[b].logs.length; c++) {
                  if (c == projects[a].tasks[b].logs.length - 1) {
                    projects[a].tasks[b].logs[c].endTime = new Date().getTime();
  
                    window.localStorage.setItem(
                      taskObj.key,
                      JSON.stringify(projects)
                    );
  
                    dataStarted[i].setAttribute(
                      "data-started",
                      JSON.stringify(dataStartedObj)
                    );
  
                    break;
                  }
                }
                break;
              }
            }
            break;
          }
        }
      }
    }, 1000);
  });
  

  