document.addEventListener("DOMContentLoaded", function () {
    // forms submit handlers
    // Folder form
    function handleFoldersSubmit() {
        var folderSubmitBtn = document.getElementById("folderSubmitBtn");

        folderSubmitBtn.addEventListener("click", function (event) {
            var newFolderForm = document.getElementById("newFolderForm");
            event.preventDefault();

            // Submit the form with AJAX
            fetch("/new_folder", {
                method: "POST",
                body: new FormData(newFolderForm)
            })
                .then(response => {
                    if (response.ok) {
                        // Close the folder modal if the submission was susccessful
                        var newFolderModal = document.getElementById("newFolderModal");
                        $(newFolderModal).modal('hide');
                    } else {
                        // Handle any errors or display message
                        console.error("Error:", response.statusText);
                    }
                })
                .catch(error => {
                    error("Error:", error);
                });
        });
    }

    // Modal not closing r submitting when hitting enter
    // Get the modal element
    var modalList = document.getElementById("newListModal");

    // Listen for the shown.bs.modal event, which is fired when the modal is show
    modalList.addEventListener("shown.bs.modal", function () {
        // Get the modal body element
        var modalbody = modalList.querySelector(".modal-body");

        // listen for keypress event on the modal body
        modalbody.addEventListener("keypress", function (event) {
            // Check if the Enter key is pressed
            if (event.key === "Enter") {
                // Prevent the default behavior (cl;osing or submitting the modal)
                event.preventDefault()
            }
        });
    });

    // List form
    function handleListsSubmit() {
        var listSubmitBtn = document.getElementById("listSubmitBtn");

        listSubmitBtn.addEventListener("click", function () {
            var newListForm = document.getElementById("newListForm");

            newListForm.submit();
            var newListModal = document.getElementById("newListModal");
            $(newListModal).modal('hide');
        });
    }

    // Flatpickr calendar integration
    function integrateWithFlatpickr() {
        var calendarInput = document.getElementById("newTaskDate");
        var calendarToggle = document.getElementById("calendarToggle");

        // Create the time picker toggle
        var timePickerToggle = document.createElement("div");
        timePickerToggle.id = "timePickerToggle";
        timePickerToggle.textContent = "Set the time";

        var dropdown = document.createElement("div");
        dropdown.id = "timeDropdown";
        dropdown.classList.add("dropdown-content");

        // Define option data
        var optionsData = [
            { time: "00:00", label: "00:00" },
            { time: "00:30", label: "00:30" },
            { time: "01:00", label: "01:00" },
            { time: "01:30", label: "01:30" },
            { time: "02:00", label: "02:00" },
            { time: "02:30", label: "02:30" },
            { time: "03:00", label: "03:00" },
            { time: "03:30", label: "03:30" },
            { time: "04:00", label: "04:00" },
            { time: "04:30", label: "04:30" },
            { time: "05:00", label: "05:00" },
            { time: "05:30", label: "05:30" },
            { time: "06:00", label: "06:00" },
            { time: "06:30", label: "06:30" },
            { time: "07:00", label: "07:00" },
            { time: "07:30", label: "07:30" },
            { time: "08:00", label: "08:00" },
            { time: "08:30", label: "08:30" },
            { time: "09:00", label: "09:00" },
            { time: "09:30", label: "09:30" },
            { time: "10:00", label: "10:00" },
            { time: "10:30", label: "10:30" },
            { time: "11:00", label: "11:00" },
            { time: "11:30", label: "11:30" },
            { time: "12:00", label: "12:00" },
            { time: "12:30", label: "12:30" },
            { time: "13:00", label: "13:00" },
            { time: "13:30", label: "13:30" },
            { time: "14:00", label: "14:00" },
            { time: "14:30", label: "14:30" },
            { time: "15:00", label: "15:00" },
            { time: "15:30", label: "15:30" },
            { time: "16:00", label: "16:00" },
            { time: "16:30", label: "16:30" },
            { time: "17:00", label: "17:00" },
            { time: "17:30", label: "17:30" },
            { time: "18:00", label: "18:00" },
            { time: "18:30", label: "18:30" },
            { time: "19:00", label: "19:00" },
            { time: "19:30", label: "19:30" },
            { time: "20:00", label: "20:00" },
            { time: "20:30", label: "20:30" },
            { time: "21:00", label: "21:00" },
            { time: "21:30", label: "21:30" },
            { time: "22:00", label: "22:00" },
            { time: "22:30", label: "22:30" },
            { time: "23:00", label: "23:00" },
            { time: "23:30", label: "23:30" }
            // Add more options as needed
        ];

        // Function to handle time selection from dropdown
        function handleTimeSelection(event) {
            event.preventDefault();
            var selectedTime = event.target.dataset.time;

            // Update the time display in UI
            var timeDisplay = document.getElementById("timePickerToggle");
            timeDisplay.textContent = selectedTime;

            // Store selected tome in hidden input field
            var hiddenTimeInput = document.getElementById("newTaskTime");
            hiddenTimeInput.value = selectedTime;
        }

        // Flatpickr calendar integration
        var calendar = flatpickr(calendarInput, {
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "l j M, Y",
            onClose: function () {
                calendarToggle.classList.remove("active");
                // Remove timePickerToggle when calendar is closed
                var existingTimePickerToggle = document.getElementById("timePickerToggle");
                if (existingTimePickerToggle) {
                    existingTimePickerToggle.remove();
                }

                // Hide dropdown when calendar is closed
                dropdown.classList.remove("active");
            },
            onOpen: function () {
                calendarToggle.classList.add("active");
                // Append timePickerToggle when calendar is opened
                var calendarDropdown = document.querySelector(".flatpickr-calendar");
                if (!document.getElementById("timePickerToggle")) {
                    calendarDropdown.appendChild(timePickerToggle);
                }

                // Clear existing options to avoid dupilcates
                dropdown.innerHTML = "";

                // Create dropdown options
                optionsData.forEach(function (data) {
                    var option = createOption(data.time, data.label);
                    dropdown.appendChild(option);
                });

                // Append dropdown to appropriate element
                if (!document.getElementById("timeDropdown")) {
                    calendarDropdown.appendChild(dropdown);
                }

                // Add event listener to the time optons
                var timeOptions = document.querySelectorAll(".time-option");
                timeOptions.forEach(function (option) {
                    option.addEventListener("click", handleTimeSelection);
                });

            }
        });

        // Create dropdown options
        function createOption(time, label) {
            var option = document.createElement("a");
            option.href = "#";
            option.classList.add("time-option");
            option.setAttribute("data-time", time);
            option.textContent = label;

            return option;
        }

        // Calendar toggle
        calendarToggle.addEventListener("click", function () {
            calendarToggle.classList.toggle("active");
            calendar.toggle();
        });

        // Handle time selection
        timePickerToggle.addEventListener("click", function () {
            dropdown.classList.toggle("active");
        });
    }


    // new task form module
    function newTaskForm() {
        var newTaskForm = document.getElementById("newTaskForm");

        // Function to submit the new task form async
        function handleFormSubmissions() {
            var formData = new FormData(newTaskForm);

            // Include the list ID in the form data
            var selectedListId = document.getElementById("selectedListId").value;
            formData.append("list_id", selectedListId);

            // Include the date and the time in the form data
            var newTaskDate = document.getElementById("newTaskDate").value;
            // Include the selected time from dropdown in the form data
            var newTaskTime = document.getElementById("newTaskTime").value;
            var datetime = newTaskDate + " " + newTaskTime;
            formData.append("due_datetime", datetime);

            // Set the value of the input field to include both date and time
            var dateInputField = document.getElementById("newTaskDate");
            dateInputField.value = datetime;

            // Submit form with AJAX
            fetch("/new_task", {
                method: "POST",
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        // Reset input field value to empty string
                        document.getElementById("newTaskForm").reset();

                        // Handle success
                        return response.json(); // Parse response JSON
                    } else {
                        // Handle errors
                        throw new Error("Error submitting task");
                    }
                })
                .then(data => {
                    if (data) {
                        // Update the UI to display the new task
                        appendTask(data);
                    }
                })
                .catch(error => {
                    // Handle errors
                    console.error("Error:", error);
                });
        }

        // Listen for the form submit event
        newTaskForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent the default form submission

            // Submit the form asynchronously
            handleFormSubmissions();
            newTaskForm.style.boxShadow = "none";
        });

        // Also, consider handling the 'keypress' event on the input field instead of 'click'
        var inputField = document.getElementById("newTask");
        inputField.addEventListener("keypress", function (event) {
            // Check for Enter key by its string representation
            if (event.key === "Enter") {
                event.preventDefault(); // Prevent default behavior (form submission)
                handleFormSubmissions(); // Submit the form asynchronously
                newTaskForm.style.boxShadow = "none";
            }
        });

    }

    // Nav tag tasks lists accordion
    function handleAccordionNav() {
        // Get all the accordion toggle buttons
        var accordionToggle = document.querySelectorAll(".accordion-toggle");

        // Loop throught each accordion toggle
        accordionToggle.forEach(function (toggle) {
            // Add click event listener to each toggle

            toggle.addEventListener("click", function () {
                this.classList.toggle("active");

                var folderIcon = this.querySelector("i");

                if (this.classList.contains("active")) {
                    folderIcon.classList.remove("fa-folder-closed");
                    folderIcon.classList.add("fa-folder-open");
                } else {
                    folderIcon.classList.remove("fa-folder-open");
                    folderIcon.classList.add("fa-folder-closed");
                }
            });

        });
    }


    // Add onclick event to each list link to retrieve the ID
    var listLinks = document.querySelectorAll('.navTask-link');
    listLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            // Prevent the default action (page refresh)
            event.preventDefault();

            var listName = this.innerText.trim();
            var listId = link.getAttribute('data-listid');

            // Update the list title
            document.getElementById("listTitle").innerHTML = '<h3>' + listName + '</h3>';

            // Update the value of the hidden input field selectedListId
            document.getElementById("selectedListId").value = listId;

            // Fetch tasks for the selected list ID using AJAX
            fetch('/fetch_tasks?list_id=' + listId)
                .then(response => response.json())
                .then(data => {
                    updateTasks(data);
                })
                .catch(error => console.error("Error fetching tasks", error));
        });

        // Automatically load tasks for the "Today" list when the loop reaches it
        if (link.getAttribute('data-listid') === '1') {
            link.click(); // Simulate a click on Today list link
        }
    });



    // Function to update tasks on the page
    function updateTasks(tasks) {
        // Clear the existing tasks before appending the new ones
        var taskList = document.getElementById("taskList");
        taskList.innerHTML = "";

        // Loop through the tasks and construct HTML for each task
        tasks.forEach(function (task) {
            appendTask(task);
        });

        // After updating tasks, call manageTaskItems function to handle transactions
        manageTaskItems();
    }

    // Function to append a single task to the taskList
    function appendTask(task) {
        // Create a div element for the task
        var taskItem = document.createElement('div');
        taskItem.classList.add('taskItem', 'd-flex', 'align-items-center', 'list-group-item');
        taskItem.setAttribute('data-taskid', task.task_id)
        taskItem.setAttribute('data-listid', task.list_id)

        // Construct HTML for the task
        var html = `
            <div>
                <!-- COMPLETED TASK checkbox -->
                <form action="/completed_task/${task.task_id}" method="post" class="completedTask d-flex">
                    <label class="check-container">
                        <input type="checkbox" name="task_completed" class="form-check" id="checkBox">
                        <span class="checkmark"></span>
                    </label>
                </form>

                <!-- audio for notification sound -->
                <audio id="bellNotification" src="/static/media/front-desk-bells-daniel_simon.mp3"></audio>
            </div>
            <div class="w-75 pl-2" id="taskDescription${task.task_id}">
                <!-- Editable task description -->
                <p class="mb-0 task-description" data-taskid="${task.task_id}" contenteditable="true"
                    id="editableDescription">${task.task_description}</p>
            </div>
            <div class="w-25">
            ${task.due_datetime ? `<p class="m-0 due-datetime">${formatDueDatetime(task.due_datetime)}</p>` : ''}
            </div>
            <!-- DELETE FORM in db  -->
            <div class="w-10 delete-wrapper">
                <form action="/delete_task/${task.task_id}" method="post">
                    <button type="button" class="btn deleteBtn">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </form>
            </div>
            `;

        // Set the HTMLcontent of the taskItem
        taskItem.innerHTML = html;


        // Append the taskItem to the taskList
        document.getElementById("taskList").appendChild(taskItem);

        // Call datetimeHanlder function
        if (task.due_datetime) {
            const dueText = taskItem.querySelector(".due-datetime");
            const { color } = datetimeHandler(task.due_datetime);
            dueText.style.color = color;
        }
    }

    // Module for managing task items
    function manageTaskItems() {
        var taskItems = document.querySelectorAll(".taskItem");

        var taskItemClicked = false;

        // Function to handle hover effect
        function handleHover(taskItem) {
            let editableDescription = taskItem.querySelector(".task-description");

            taskItem.addEventListener("mouseenter", function () {
                if (!editableDescription.contains(document.activeElement)) {
                    this.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                    this.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                }
            });
            taskItem.addEventListener("mouseleave", function () {
                if (!editableDescription.contains(document.activeElement)) {
                    this.style.backgroundColor = "#1a1a1a";
                }
            });

        }

        taskItems.forEach(function (taskItem) {

            // Function to update description text in database
            function updateTaskDescription(taskId, editedDescription) {
                fetch(`/edit_task/${taskId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ edited_description: editedDescription })
                })
                    .then(response => {
                        if (response.ok) {
                            console.log("Task description updates successfully");
                        } else {
                            console.error("Error updating task descritpion", response.statusText);
                        }
                    })
                    .catch(error => {
                        console.error("Error updating task description:", error);
                    });
            }

            // Function to update description text in task details tab
            function updateTaskDetailsTitle(editedDescription) {
                try {
                    // Find task details title element
                    var taskDetailTitle = document.querySelector(".task-detail-title");

                    // Update the task details title
                    if (taskDetailTitle) {
                        taskDetailTitle.innerText = editedDescription;
                    }
                } catch (error) {
                    console.error("Error updating task details title:", error);
                }
            }

            let editableDescription = taskItem.querySelector(".task-description");

            // prevent wrap by pressing Enter
            editableDescription.addEventListener("keypress", function (e) {
                if (e.which === 13) {
                    e.preventDefault();
                }
            });

            // Edit description and send it to the server
            editableDescription.addEventListener("input", function () {
                // Save the current selection
                var selection = window.getSelection();
                var range = selection.getRangeAt(0);
                let textContent = editableDescription.innerText;

                // Update task description
                let taskId = editableDescription.dataset.taskid;

                // Update task description
                updateTaskDescription(taskId, textContent.trim());

                // Update task details description
                updateTaskDetailsTitle(textContent);

                // Set cursor to the end of the text content
                var range = document.createRange();
                range.selectNodeContents(editableDescription);
                range.collapse(false); // Collapse range to end
                selection.removeAllRanges();
                selection.addRange(range);
            });

            // Function to mark task as completed
            function completeTask(taskId, isChecked) {
                // Create a new FormData object
                let formData = new FormData();

                // Append the task ID and completition status (as a boolean) to the FormData object
                formData.append('task_id', taskId);
                formData.append('task_completed', isChecked ? '1' : '0'); // Convert boolean to string

                fetch(`/completed_task/${taskId}`, {
                    method: 'POST',
                    body: formData
                })
                    .then(response => {
                        if (response.ok) {
                            // Task completed successfully
                            console.log(`Task ${taskId} is ${isChecked ? 'completed' : 'not completed'}`);
                        } else {
                            console.error("Error completing task:", response.statusText);
                        }
                    })
                    .catch(error => {
                        console.error("Error completing task:", error);
                    });
            }

            // Function to delete a task
            function deleteTask(taskItem, taskId) {

                // Use fetch API to submit the form data async
                fetch(`/delete_task/${taskId}`, {
                    method: "POST"
                })
                    .then(response => {
                        if (response.ok) {
                            // Task deleted successfully, update UI as needed
                            taskItem.classList.add("fade-out");

                            // Remove from the DOM when animation ends
                            taskItem.addEventListener("animationend", function () {
                                taskItem.remove();
                            });
                        } else {
                            console.error("Error deleting task:", response.statusText);
                        }
                    })
                    .catch(error => {
                        console.error("Error deleting task:", error);
                    });
            }

            // Add click event listener to the task list container for event delegation
            document.getElementById("taskList").addEventListener("click", function (event) {

                // Check if the clicked element has a class of ".completeTask #checkBox"
                if (event.target.type === "checkbox" && event.target.closest(".taskItem")) {
                    // Get the taskItem containing the chackbox
                    let taskItem = event.target.closest(".taskItem");

                    // Get the task ID from the dataset attribute
                    let taskId = taskItem.dataset.taskid;

                    // Get the checked state of the checkbox
                    let isChecked = event.target.checked;

                    // Call the completeTask function with taskId and isChecked parameters
                    completeTask(taskId, isChecked);

                    if (isChecked) {
                        // Play completion notification sound
                        document.getElementById("bellNotification").play();

                        // Add fade out effect
                        taskItem.classList.add("fade-out");

                        // Remove from the DOM
                        taskItem.addEventListener("animationend", function () {
                            taskItem.remove();
                        });
                    }
                }

                // Check if the clicked element or its parent has a class of "deleteBtn"
                if (event.target.classList.contains("deleteBtn") || event.target.closest(".deleteBtn")) {
                    // get the task item containing the delete button
                    let taskItem = event.target.closest(".taskItem");

                    // Get the taskID from the dataset
                    let taskId = taskItem.dataset.taskid;

                    // Execute dleteTask function
                    deleteTask(taskItem, taskId);
                }


            });

            // Event listener for retrieve the taskDetails
            taskItem.querySelector(".task-description").addEventListener("click", function () {
                handleTaskItemClick(taskItem);
                // Set taskItemClicked to true
                taskItemClicked = true;
                // Hide noTaskView if a task item is clicked
                hideNoTaskView();
            });

        });

        // Call the handleHover function to set up hover effect
        taskItems.forEach(handleHover);

        // Function to handle taskItem click
        function handleTaskItemClick(taskItem) {
            var taskId = taskItem.dataset.taskid;
            displayTaskDetails(taskId);
        }

        // Function to hide noTaskView if a task item is clicked
        function hideNoTaskView() {
            var noTaskView = document.getElementById("noTaskView");
            if (noTaskView && !taskItemClicked) {
                noTaskView.style.display = "none";
            }
        }
    }



    // Module handle duedatime format text in taskItem
    // Format due datetime output text
    function formatDueDatetime(dueDatetime) {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        if (!dueDatetime) {
            // return an empty string if dueDatetime is falsy
            return '';
        }

        // Parts 0 - Year, Parts 1 - Month, Parts 2 - Day (date and name), Parts 3 - hour, Parts 4 - minute
        const parts = dueDatetime.split(/[- :]/);

        let date;

        if (parts.length >= 3) {
            date = new Date(parts[0], parts[1] - 1, parts[2]);
        } else {
            date = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4]);
        }

        if (isNaN(date.getTime())) {
            // Return an empty string if date is invalid
            return '';
        }

        const dayName = days[date.getDay()];
        const monthName = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        let hours = parseInt(parts[3], 10);
        let minutes = parts[4];

        let formattedDate = `${dayName}, ${monthName} ${day}`;

        // Check if the year is the current year
        const currentYear = new Date().getFullYear();
        if (year !== currentYear) {
            formattedDate += `, ${year} `;
        }

        // Check if hours and minutes are undefined
        if (typeof hours !== 'undefined' && typeof minutes !== 'undefined') {
            // Convert minutes to decimal format
            minutes = ('0' + parseInt(minutes, 10)).slice(-2);
            formattedDate += `, ${hours}:${minutes}`;
        }

        return formattedDate;
    }

    function datetimeHandler(dueDatetime) {
        const currentDate = new Date();
        const dueDate = new Date(dueDatetime);

        // Calculations
        // Milliseconds
        const differInMs = dueDate - currentDate;

        // Convert milliseconds to days
        const differInDays = Math.ceil(differInMs / (1000 * 60 * 60 * 24));

        // Calculate differ in months between the due date and current date
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const dueYear = dueDate.getFullYear();
        const dueMonth = dueDate.getMonth();
        const differInMonths = (dueYear - currentYear) * 12 + (dueMonth - currentMonth);

        let color;

        if (differInDays < 0) {
            color = "rgb(220, 53, 69)";
        } else if (differInDays === 0) {
            color = "rgb(0, 123, 255)";
        } else {
            color = "rgb(0, 123, 255)";
        }

        let message = "";

        if (differInMonths < 0) {
            message = `${Math.abs(differInMonths)} months Ago,`;
        } else if (differInMonths) {
            message = `${differInMonths} months Later, `;
        } else {
            if (differInDays < -1) {
                message = `${Math.abs(differInDays)} days Ago, `;
            } else if (differInDays === -1) {
                message = "Yesterday ";
            } else if (differInDays === 0) {
                message = "Today ";
            } else if (differInDays === 1) {
                message = "Tomorrow ";
            } else {
                message = `${differInDays} days Later, `;
            }
        }

        return { color, message };
    }

    // Module for fetching and displaying task details
    function displayTaskDetails(taskId) {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    // Handle successful response
                    var taskDetailTab = document.getElementById('taskDetailTab');
                    var response = JSON.parse(xhr.responseText);

                    // Populate task details in taskDetailTab
                    var html = '';

                    if (response.due_datetime) {
                        // Use datetimeHanlder to get color and message
                        var { color, message } = datetimeHandler(response.due_datetime);

                        html += `
                        <div class="d-flex justify-content-between">
                            <p class="due-datetime" style="margin-bottom= 16px; color: ${color}">${message} ${formatDueDatetime(response.due_datetime)} </p>
                            <i class="fa-solid fa-flag"></i>
                        </div>
                    `;
                    } else {
                        html += `
                        <div class="d-flex justify-content-between">
                            <p class="due-datetime">No date set</p>
                            <i class="fa-solid fa-flag"></i>
                        </div>
                    `; // Show empty string if due_datetime doesn't exist
                    }

                    if (response.detail_text) {
                        html += `
                        <p class="task-detail-title">${response.task_description}</p>
                        <p contenteditable="true" class="editedDetailText editable-detail-text" data-taskid="${taskId}">${response.detail_text}</p>
                        `;
                    } else {
                        html += `
                        <p class="task-detail-title">${response.task_description}</p>
                        <p contenteditable="true" class="editedDetailText editable-detail-text" data-taskid="${taskId}">Extra Notes</p>
                        `;
                    }

                    taskDetailTab.innerHTML = html;

                    // Event listener to send edited detail text to server
                    var editedDetailText = taskDetailTab.querySelector(".editedDetailText");

                    editedDetailText.addEventListener("input", function () {
                        var taskId = this.dataset.taskid;
                        var editedText = this.innerText.trim();
                        updateDetailText(taskId, editedText);
                    });
                } else {
                    // Handle error response
                    console.error("Error fetching task details");
                }
            }
        };

        xhr.open("GET", "/task_details/" + taskId);
        xhr.send();
    }

    // Function to update detail text in database
    function updateDetailText(taskId, editedText) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/edit_detail_text/" + taskId, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({ editedDetailText: editedText }));
    }


    // Call modules
    newTaskForm();
    handleFoldersSubmit();
    handleListsSubmit();
    integrateWithFlatpickr();
    handleAccordionNav();
});
