document.getElementById('reminderForm').addEventListener('submit', async (event) => {
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

    const remindersList = document.getElementById('remindersList');
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