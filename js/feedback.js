document.addEventListener('DOMContentLoaded', function() {
    const feedbackForm = document.getElementById('feedbackForm');
    const alertContainer = document.createElement('div');
    alertContainer.className = 'alert-container';
    document.querySelector('.feedback-section .container').insertBefore(alertContainer, feedbackForm);

    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        alertContainer.innerHTML = '';
        alertContainer.appendChild(alert);
        
        // Remove alert after 5 seconds
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    feedbackForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value.trim();
        const category = document.getElementById('category').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();

        // Validate form
        if (!category) {
            showAlert('Please select a category', 'error');
            return;
        }

        if (!message) {
            showAlert('Please enter your feedback message', 'error');
            return;
        }

        // Disable submit button
        const submitBtn = feedbackForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

        try {
            // Add feedback to Firestore
            const feedbackCollection = db.collection('admin_feedback');
            await feedbackCollection.add({
                name: name || 'Anonymous',
                category: category,
                subject: subject || 'N/A',
                message: message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Show success message
            showAlert('Thank you for your feedback!', 'success');
            
            // Reset form
            feedbackForm.reset();
        } catch (error) {
            console.error('Error submitting feedback:', error);
            let errorMessage = 'Error submitting feedback. ';
            
            if (error.code === 'permission-denied') {
                errorMessage += 'Access denied. Please check your connection.';
            } else if (error.code === 'unavailable') {
                errorMessage += 'Service is currently unavailable. Please try again later.';
            } else {
                errorMessage += 'Please try again.';
            }
            
            showAlert(errorMessage, 'error');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Feedback';
        }
    });

    // Form validation
    const inputs = feedbackForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.add('valid');
                this.classList.remove('error');
            } else {
                this.classList.remove('valid');
                if (this.required) {
                    this.classList.add('error');
                }
            }
        });
    });
}); 