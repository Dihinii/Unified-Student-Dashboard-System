// App State
let currentUser = null;
let currentStudentId = null;
let tasks = [];
let nextId = 1;

// Views Management
function showView(viewId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
    if(viewId === 'urgency-view') renderUrgencyDashboard();
}

// Fetch Tasks Logic
function fetchUserTasks() {
    fetch('/api/tasks/student/' + currentStudentId)
    .then(res => res.json())
    .then(data => {
        tasks = data;
        renderHomeTasks();
    })
    .catch(err => console.error("Could not load tasks", err));
}

// Login Logic
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const loginObj = {
        userName: document.getElementById('login-username').value,
        password: document.getElementById('login-password').value
    };

    fetch('/api/students/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginObj)
    })
    .then(res => {
        if (!res.ok) throw new Error("Invalid username or password");
        return res.json();
    })
    .then(data => {
        alert("Login successful! Welcome back, " + data.userName);
        currentUser = data.userName;
        currentStudentId = data.studentId;
        
        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('user-greeting').classList.remove('hidden');
        document.getElementById('username-display').innerText = currentUser;
        
        document.getElementById('login-form').reset();
        showView('home-view');
        fetchUserTasks(); // Load tasks from DB
    })
    .catch(err => {
        alert("Login failed! " + err.message);
    });
});

// Signup Logic
document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const studentObj = {
        userName: document.getElementById('signup-username').value,
        email: document.getElementById('signup-email').value,
        password: document.getElementById('signup-password').value
    };

    fetch('/api/students/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentObj)
    })
    .then(res => res.json())
    .then(data => {
        alert("Signup successful! Welcome " + data.userName);
        currentUser = data.userName;
        currentStudentId = data.studentId;
        
        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('user-greeting').classList.remove('hidden');
        document.getElementById('username-display').innerText = currentUser;
        
        document.getElementById('signup-form').reset();
        showView('home-view');
        fetchUserTasks(); // Load tasks from DB
    })
    .catch(err => {
        alert("Signup failed! Error: " + err);
    });
});

// Add Task Button Click
document.getElementById('add-task-btn').addEventListener('click', () => {
    if (!currentUser) {
        alert("Please login or signup before adding a task");
        return;
    }
    document.getElementById('task-form').reset();
    document.getElementById('task-id').value = '';
    document.getElementById('form-title').innerText = "Add New Task";
    document.querySelectorAll('.dynamic-field').forEach(el => el.classList.add('hidden'));
    showView('add-task-view');
});

// Urgency Dashboard Button
document.getElementById('urgency-btn').addEventListener('click', () => showView('urgency-view'));

// Dynamic Form Fields based on Task Type
document.getElementById('task-type').addEventListener('change', (e) => {
    document.querySelectorAll('.dynamic-field').forEach(el => el.classList.add('hidden'));
    if(e.target.value === 'Assignment') document.getElementById('assignment-fields').classList.remove('hidden');
    if(e.target.value === 'Clubs') document.getElementById('clubs-fields').classList.remove('hidden');
    if(e.target.value === 'Personal') document.getElementById('personal-fields').classList.remove('hidden');
});

// Form Submit (Save / Update)
document.getElementById('task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    let timeValue = document.getElementById('task-time').value;
    if (timeValue && timeValue.length === 5) {
        timeValue += ":00"; // Append seconds for Java LocalTime parsing
    }

    const taskObj = {
        taskId: document.getElementById('task-id').value || null,
        taskName: document.getElementById('task-name').value,
        date: document.getElementById('task-date').value,
        time: timeValue,
        taskType: document.getElementById('task-type').value,
        student: { studentId: currentStudentId },
        
        // Dynamic data mapped to match Java Subclasses
        subjectName: document.getElementById('subject-name').value,
        clubName: document.getElementById('club-name').value,
        responsibilityType: document.getElementById('responsibility-type').value,
        description: document.getElementById('description').value,
        isRecurring: document.getElementById('is-recurring').checked
    };

    fetch('/api/tasks/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskObj)
    })
    .then(res => res.json())
    .then(savedTask => {
        if (document.getElementById('task-id').value) {
            // Update existing in local array
            const index = tasks.findIndex(t => t.taskId == savedTask.taskId);
            tasks[index] = savedTask;
        } else {
            // Add new
            tasks.push(savedTask);
        }
        
        renderHomeTasks();
        showView('home-view');
    })
    .catch(err => {
        alert("Failed to save task: " + err);
    });
});

// Render Home Lists (Only incomplete tasks)
function renderHomeTasks() {
    document.getElementById('assignment-list').innerHTML = '';
    document.getElementById('clubs-list').innerHTML = '';
    document.getElementById('personal-list').innerHTML = '';

    tasks.filter(t => !t.isCompleted).forEach(task => {
        // Date Logic
        const today = new Date();
        const dueDate = new Date(`${task.date}T${task.time}`);
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let dueText = '';
        let dueColor = 'text-slate-300';
        if (diffDays < 0) { dueText = 'Overdue'; dueColor = 'text-rose-500 font-medium'; }
        else if (diffDays === 0) { dueText = 'Today'; dueColor = 'text-amber-500 font-medium'; }
        else if (diffDays === 1) { dueText = 'Tomorrow'; dueColor = 'text-amber-400 font-medium'; }
        else { dueText = `${diffDays} days left`; }

        // Specific Fields
        let specificField = '';
        let icon = '';
        if (task.taskType === 'Assignment') {
            specificField = `Subject: <span class="text-slate-300">${task.subjectName || 'N/A'}</span>`;
            icon = '📚';
        } else if (task.taskType === 'Clubs') {
            specificField = `Role: <span class="text-slate-300">${task.responsibilityType || 'Member'}</span>`;
            icon = '🏆';
        } else {
            specificField = `Type: <span class="text-slate-300">${task.isRecurring ? 'Recurring' : 'Goal'}</span>`;
            icon = '⚡';
        }

        // Mock Urgency Score if backend profile is missing
        let score = task.urgencyProfile?.urgencyScore;
        if (score == null) {
            score = Math.max(1.0, 10.0 - (diffDays > 0 ? diffDays * 0.8 : 0) + (task.taskId % 3) * 0.5);
            if (score > 9.9) score = 9.9;
        }
        
        let ringColor = 'text-emerald-500';
        if (score >= 8) ringColor = 'text-rose-500';
        else if (score >= 5) ringColor = 'text-amber-500';

        const div = document.createElement('div');
        div.className = 'bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 hover:border-indigo-500/50 transition-all flex flex-col shadow-lg mb-3 relative group';
        div.innerHTML = `
            <div class="flex justify-between items-start mb-4 border-b border-slate-700/50 pb-2">
                <h4 class="font-bold text-slate-100 text-sm flex items-center gap-2 truncate">
                    ${icon} ${task.taskName}
                </h4>
            </div>
            
            <div class="flex justify-between items-end">
                <div class="flex flex-col gap-1.5 text-xs text-slate-400">
                    <span>Due Date: <span class="${dueColor}">${dueText}</span></span>
                    <span>${specificField}</span>
                </div>
                
                <!-- Urgency Ring -->
                <div class="relative w-12 h-12 flex items-center justify-center shrink-0" title="Urgency Score">
                    <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path class="text-slate-700" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path class="${ringColor} transition-all duration-1000 ease-out" stroke-dasharray="${score * 10}, 100" stroke-linecap="round" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div class="absolute inset-0 flex items-center justify-center flex-col">
                        <span class="text-xs font-bold text-white mt-0.5">${score.toFixed(1)}</span>
                        <span class="text-[7px] text-slate-400 leading-none -mt-0.5">/10</span>
                    </div>
                </div>
            </div>
            
            <!-- Hover Action Buttons -->
            <div class="absolute inset-0 bg-slate-900/90 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm pointer-events-none group-hover:pointer-events-auto">
                <button onclick="markComplete(${task.taskId})" class="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-colors" title="Complete">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                </button>
                <button onclick="editTask(${task.taskId})" class="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500 hover:text-white transition-colors" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                </button>
            </div>
        `;
        
        if (task.taskType === 'Assignment') document.getElementById('assignment-list').appendChild(div);
        if (task.taskType === 'Clubs') document.getElementById('clubs-list').appendChild(div);
        if (task.taskType === 'Personal') document.getElementById('personal-list').appendChild(div);
    });
}

// Edit Task
function editTask(id) {
    const task = tasks.find(t => t.taskId == id);
    document.getElementById('form-title').innerText = "Update Task";
    document.getElementById('task-id').value = task.taskId;
    document.getElementById('task-name').value = task.taskName;
    document.getElementById('task-date').value = task.date;
    document.getElementById('task-time').value = task.time.substring(0, 5); // HTML time input expects HH:mm
    
    // Trigger change event to show correct fields
    const typeSelect = document.getElementById('task-type');
    typeSelect.value = task.taskType;
    typeSelect.dispatchEvent(new Event('change'));

    document.getElementById('subject-name').value = task.subjectName || '';
    document.getElementById('club-name').value = task.clubName || '';
    document.getElementById('responsibility-type').value = task.responsibilityType || '';
    document.getElementById('description').value = task.description || '';
    document.getElementById('is-recurring').checked = task.isRecurring || false;

    showView('add-task-view');
}

// Render Urgency Dashboard
function renderUrgencyDashboard() {
    const urgencyList = document.getElementById('urgency-list');
    const completedList = document.getElementById('completed-list');
    urgencyList.innerHTML = ''; completedList.innerHTML = '';

    // Filter and Sort incomplete tasks by date/time
    let pendingTasks = tasks.filter(t => !t.isCompleted);
    pendingTasks.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

    const total = pendingTasks.length;
    
    pendingTasks.forEach((task, index) => {
        // Divide into 3 sections: Top (Red), Middle (Orange), Bottom (Yellow)
        let colorClass = 'border-l-4 border-yellow-500 bg-yellow-500/10 text-yellow-100';
        if (index < total / 3) colorClass = 'border-l-4 border-red-500 bg-red-500/10 text-red-100';
        else if (index < (total / 3) * 2) colorClass = 'border-l-4 border-orange-500 bg-orange-500/10 text-orange-100';

        let actionBtns = `<button onclick="markComplete(${task.taskId})" class="px-3 py-1.5 rounded-md bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg> Done</button>`;
        if (task.taskType === 'Personal') {
            actionBtns += `<button onclick="editTask(${task.taskId})" class="px-3 py-1.5 rounded-md bg-slate-700/50 text-slate-300 hover:bg-slate-600 hover:text-white text-xs font-medium transition-colors">Snooze</button>`;
        }

        urgencyList.innerHTML += `
            <div class="rounded-xl p-4 flex justify-between items-center group transition-colors shadow-lg mb-3 ${colorClass}">
                <div class="flex flex-col">
                    <span class="font-semibold group-hover:opacity-80 transition-opacity">${task.taskName} <span class="text-[10px] uppercase tracking-wider opacity-60 ml-2 border border-current rounded-full px-2 py-0.5">${task.taskType}</span></span>
                    <span class="text-xs opacity-75 mt-1">${task.date} &bull; ${task.time}</span>
                </div>
                <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">${actionBtns}</div>
            </div>`;
    });

    // Render Completed Tasks
    tasks.filter(t => t.isCompleted).forEach(task => {
        completedList.innerHTML += `
            <div class="rounded-xl p-4 flex justify-between items-center group transition-colors shadow-lg bg-emerald-500/5 border border-emerald-500/20 mb-3">
                <div class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-500 opacity-60" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                    <span class="font-medium text-slate-400 line-through decoration-emerald-500/50">${task.taskName}</span>
                </div>
                <button onclick="deleteTask(${task.taskId})" class="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                </button>
            </div>`;
    });
}

function markComplete(id) {
    fetch(`/api/tasks/${id}/complete`, { method: 'POST' })
    .then(res => {
        if (!res.ok) throw new Error("Could not mark complete on server.");
        const task = tasks.find(t => t.taskId == id);
        if (task) task.isCompleted = true;
        renderHomeTasks();
        renderUrgencyDashboard();
    })
    .catch(err => alert(err));
}

function deleteTask(id) {
    fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    .then(res => {
        if (!res.ok) throw new Error("Could not delete task on server.");
        tasks = tasks.filter(t => t.taskId != id);
        renderHomeTasks();
        renderUrgencyDashboard();
    })
    .catch(err => alert(err));
}
