// Dark mode toggle
document.getElementById('darkModeButton').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Login form submission
document.getElementById('loginSubmit').addEventListener('click', () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    // Dummy login method
    if (email && password) {
        window.location.href = 'main.html';
    } else {
        alert('Invalid email or password');
    }
});

// Create now button click
document.getElementById('createNowButton').addEventListener('click', () => {
    document.getElementById('loginModal').modal('show');
});