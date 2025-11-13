// Get form and input elements
const form = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const subjectInput = document.getElementById('subject');
const messageInput = document.getElementById('message');
const successMessage = document.getElementById('success-message');

// Error message elements
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const subjectError = document.getElementById('subject-error');
const messageError = document.getElementById('message-error');

// Validation functions
function validateName(name) {
    if (name.trim() === '') {
        return 'Name is required';
    }
    if (name.trim().length < 2) {
        return 'Name must be at least 2 characters';
    }
    return '';
}

function validateEmail(email) {
    if (email.trim() === '') {
        return 'Email is required';
    }
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        return 'Please enter a valid email address';
    }
    return '';
}

function validateSubject(subject) {
    if (subject.trim() === '') {
        return 'Subject is required';
    }
    if (subject.trim().length < 3) {
        return 'Subject must be at least 3 characters';
    }
    return '';
}

function validateMessage(message) {
    if (message.trim() === '') {
        return 'Message is required';
    }
    if (message.trim().length < 10) {
        return 'Message must be at least 10 characters';
    }
    return '';
}

// Display error function
function showError(input, errorElement, message) {
    errorElement.textContent = message;
    input.classList.add('error');
}

// Clear error function
function clearError(input, errorElement) {
    errorElement.textContent = '';
    input.classList.remove('error');
}

// Real-time validation
nameInput.addEventListener('blur', function() {
    const error = validateName(this.value);
    if (error) {
        showError(this, nameError, error);
    } else {
        clearError(this, nameError);
    }
});

nameInput.addEventListener('input', function() {
    if (this.classList.contains('error')) {
        const error = validateName(this.value);
        if (!error) {
            clearError(this, nameError);
        }
    }
});

emailInput.addEventListener('blur', function() {
    const error = validateEmail(this.value);
    if (error) {
        showError(this, emailError, error);
    } else {
        clearError(this, emailError);
    }
});

emailInput.addEventListener('input', function() {
    if (this.classList.contains('error')) {
        const error = validateEmail(this.value);
        if (!error) {
            clearError(this, emailError);
        }
    }
});

subjectInput.addEventListener('blur', function() {
    const error = validateSubject(this.value);
    if (error) {
        showError(this, subjectError, error);
    } else {
        clearError(this, subjectError);
    }
});

subjectInput.addEventListener('input', function() {
    if (this.classList.contains('error')) {
        const error = validateSubject(this.value);
        if (!error) {
            clearError(this, subjectError);
        }
    }
});

messageInput.addEventListener('blur', function() {
    const error = validateMessage(this.value);
    if (error) {
        showError(this, messageError, error);
    } else {
        clearError(this, messageError);
    }
});

messageInput.addEventListener('input', function() {
    if (this.classList.contains('error')) {
        const error = validateMessage(this.value);
        if (!error) {
            clearError(this, messageError);
        }
    }
});

// Form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Hide success message if visible
    successMessage.classList.remove('show');
    
    // Get all values
    const name = nameInput.value;
    const email = emailInput.value;
    const subject = subjectInput.value;
    const message = messageInput.value;
    
    // Validate all fields
    const nameErrorMsg = validateName(name);
    const emailErrorMsg = validateEmail(email);
    const subjectErrorMsg = validateSubject(subject);
    const messageErrorMsg = validateMessage(message);
    
    // Clear all previous errors
    clearError(nameInput, nameError);
    clearError(emailInput, emailError);
    clearError(subjectInput, subjectError);
    clearError(messageInput, messageError);
    
    // Show errors if any
    let hasError = false;
    
    if (nameErrorMsg) {
        showError(nameInput, nameError, nameErrorMsg);
        hasError = true;
    }
    
    if (emailErrorMsg) {
        showError(emailInput, emailError, emailErrorMsg);
        hasError = true;
    }
    
    if (subjectErrorMsg) {
        showError(subjectInput, subjectError, subjectErrorMsg);
        hasError = true;
    }
    
    if (messageErrorMsg) {
        showError(messageInput, messageError, messageErrorMsg);
        hasError = true;
    }
    
    // If no errors, submit the form
    if (!hasError) {
        // Show success message
        successMessage.classList.add('show');
        
        // Log form data (in real scenario, you would send this to a server)
        console.log('Form Data:', {
            name: name,
            email: email,
            subject: subject,
            message: message
        });
        
        // Reset form after 2 seconds
        setTimeout(function() {
            form.reset();
            successMessage.classList.remove('show');
        }, 3000);
    }
});

// Prevent form submission on Enter key in input fields (except textarea)
const inputs = [nameInput, emailInput, subjectInput];
inputs.forEach(input => {
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });
});
