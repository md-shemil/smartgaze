document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();

    const app = document.getElementById('app');
    const mainContent = document.getElementById('mainContent');
    const mobileMenuButton = document.getElementById('mobileMenuButton');

    let isLoggedIn = false;
    let currentPage = 'home';

    // Navigation
    app.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && e.target.dataset.page) {
            e.preventDefault();
            navigateTo(e.target.dataset.page);
        }
    });

    function navigateTo(page) {
        currentPage = page;
        updateContent();
    }

    function updateContent() {
        switch (currentPage) {
            case 'home':
                renderHomePage();
                break;
            case 'reminders':
                renderRemindersPage();
                break;
            case 'account':
                renderAccountPage();
                break;
            case 'link1':
                renderLinkPage('Link 1');
                break;
            case 'link2':
                renderLinkPage('Link 2');
                break;
        }
    }

    // Mobile menu
    mobileMenuButton.addEventListener('click', function() {
        app.classList.toggle('mobile-menu-open');
    });

    // Page rendering functions
    function renderHomePage() {
        mainContent.innerHTML = `
            <div class="container">
                <h1>Welcome to SmartGaze</h1>
                <div class="content-box">
                    ${isLoggedIn 
                        ? '<p>You are logged in. This is where your main content will go.</p>'
                        : '<p>Please log in to access the full features of SmartGaze.</p>'
                    }
                </div>
            </div>
        `;
    }

    function renderRemindersPage() {
        mainContent.innerHTML = `
            <div class="container">
                <h1>Reminders</h1>
                <div class="content-box">
                    <h2>Set a Reminder</h2>
                    <form id="reminderForm">
                        <input type="text" id="reminderInput" placeholder="Enter a reminder" required>
                        <button type="submit">Add</button>
                    </form>

                    <h2>Your Reminders</h2>
                    <ul id="remindersList"></ul>
                </div>
            </div>
        `;

        const reminderForm = document.getElementById('reminderForm');
        const remindersList = document.getElementById('remindersList');

        reminderForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const reminder = document.getElementById('reminderInput').value;

            // Send POST request to the server to save the reminder
            await fetch('https://smartgaze.onrender.com/api/reminders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reminder })
            });

            // Clear input field
            document.getElementById('reminderInput').value = '';

            // Refresh the list of reminders
            fetchReminders();
        });

        async function fetchReminders() {
            const response = await fetch('https://smartgaze.onrender.com/api/reminders');
            const reminders = await response.json();

            remindersList.innerHTML = '';

            reminders.forEach(reminder => {
                const li = document.createElement('li');
                li.textContent = reminder.reminder;

                // Create delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-button';
                deleteButton.onclick = () => deleteReminder(reminder._id);

                li.appendChild(deleteButton);
                remindersList.appendChild(li);
            });
        }

        // Function to delete a reminder
        async function deleteReminder(id) {
            await fetch(`https://smartgaze.onrender.com/api/reminders/${id}`, {
                method: 'DELETE'
            });

            // Refresh the list of reminders
            fetchReminders();
        }

        // Fetch reminders when the page loads
        fetchReminders();
    }

    function renderAccountPage() {
        mainContent.innerHTML = `
            <div class="container">
                <h1>Account</h1>
                <div class="content-box">
                    ${isLoggedIn ? renderLoggedInContent() : renderLoginSignupContent()}
                </div>
            </div>
        `;

        if (!isLoggedIn) {
            const tabButtons = document.querySelectorAll('.tab-button');
            const tabContents = document.querySelectorAll('.tab-content');
            
            const loginForm = document.getElementById('loginForm');
            const signupForm = document.getElementById('signupForm');

            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const tab = button.dataset.tab;
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabContents.forEach(content => content.classList.remove('active'));
                    button.classList.add('active');
                    document.getElementById(`${tab}Tab`).classList.add('active');
                });
            });

            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;

                if (email === 'admin' && password === '1234') {
                    isLoggedIn = true;
                    renderAccountPage();
                } else {
                    alert('Invalid credentials');
                }
            });

            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('signupName').value;
                const email = document.getElementById('signupEmail').value;
                const password = document.getElementById('signupPassword').value;

                // Here you would typically send this data to your server
                console.log('Sign up:', { name, email, password });
                alert('Sign up successful! Please log in.');
                
                // Switch to login tab
                tabButtons[0].click();
            });
        } else {
            const logoutButton = document.getElementById('logoutButton');
            logoutButton.addEventListener('click', () => {
                isLoggedIn = false;
                renderAccountPage();
            });
        }
    }

    function renderLoggedInContent() {
        return `
            <h2>Welcome, User!</h2>
            <p>You are currently logged in.</p>
            <button id="logoutButton" class="logout-button">Logout</button>
        `;
    }

    function renderLoginSignupContent() {
        return `
            <div class="tab-container">
                <div class="tab-buttons">
                    <button class="tab-button active" data-tab="login">Login</button>
                    <button class="tab-button" data-tab="signup">Sign Up</button>
                </div>
                <div id="loginTab" class="tab-content active">
                    <form id="loginForm" class="form-container">
                        <div  class="form-group">
                            <label for="loginEmail">Email</label>
                            <input type="email" id="loginEmail" required>
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Password</label>
                            <input type="password" id="loginPassword" required>
                        </div>
                        <button type="submit">Log in</button>
                    </form>
                </div>
                <div id="signupTab" class="tab-content">
                    <form id="signupForm" class="form-container">
                        <div class="form-group">
                            <label for="signupName">Name</label>
                            <input type="text" id="signupName" required>
                        </div>
                        <div class="form-group">
                            <label for="signupEmail">Email</label>
                            <input type="email" id="signupEmail" required>
                        </div>
                        <div class="form-group">
                            <label for="signupPassword">Password</label>
                            <input type="password" id="signupPassword" required>
                        </div>
                        <button type="submit">Sign up</button>
                    </form>
                </div>
            </div>
        `;
    }

    function renderLinkPage(linkName) {
        mainContent.innerHTML = `
            <div class="container">
                <h1>${linkName}</h1>
                <div class="content-box">
                    <p>This is the content for ${linkName}.</p>
                </div>
            </div>
        `;
    }

    // Initial page load
    navigateTo('home');
});