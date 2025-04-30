// Admin credentials (in a real application, this would be handled server-side)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'STEM2024@bns'
};

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const currentPath = window.location.pathname;
    
    if (!isLoggedIn && !currentPath.includes('login.html')) {
        window.location.href = 'login.html';
        return false;
    } else if (isLoggedIn && currentPath.includes('login.html')) {
        window.location.href = 'dashboard.html';
        return false;
    }
    return true;
}

// Handle logout
function handleLogout() {
    sessionStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
}

// Initialize dashboard
function initDashboard() {
    // Menu Navigation
    const menuItems = document.querySelectorAll('.admin-menu li');
    const sections = {
        dashboard: document.querySelector('.dashboard-header').parentElement,
        events: document.getElementById('eventsSection'),
        feedback: document.querySelector('.controls').parentElement,
        settings: document.querySelector('.settings-section') || document.createElement('div')
    };

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.currentTarget.querySelector('a').getAttribute('href').substring(1);
            
            // Update active menu item
            menuItems.forEach(mi => mi.classList.remove('active'));
            item.classList.add('active');
            
            // Show/hide sections
            Object.entries(sections).forEach(([key, section]) => {
                if (section) {
                    section.style.display = key === target ? 'block' : 'none';
                }
            });
        });
    });

    const feedbackList = document.getElementById('feedbackList');
    const categoryFilter = document.getElementById('categoryFilter');
    const subjectFilter = document.getElementById('subjectFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const exportBtn = document.getElementById('exportBtn');
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    const template = document.getElementById('feedbackTemplate');

    // Initialize Firestore
    const db = firebase.firestore();
    const feedbackCollection = db.collection('admin_feedback');
    
    // Create initial document if collection is empty
    feedbackCollection.get().then(snapshot => {
        if (snapshot.empty) {
            // Add a sample feedback
            feedbackCollection.add({
                name: 'System',
                category: 'suggestion',
                subject: 'general',
                message: 'Welcome to the admin dashboard! This is a sample feedback.',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                console.log('Sample feedback added');
            }).catch(error => {
                console.error('Error adding sample feedback:', error);
            });
        }
    });

    let currentQuery = feedbackCollection.orderBy('timestamp', 'desc');
    let unsubscribe = null;

    // Setup real-time updates
    function setupRealtimeUpdates() {
        if (unsubscribe) {
            unsubscribe();
        }

        unsubscribe = currentQuery.onSnapshot(snapshot => {
            feedbackList.innerHTML = '';
            
            if (snapshot.empty) {
                feedbackList.innerHTML = '<div class="no-feedback">No feedback found</div>';
                return;
            }

            snapshot.forEach(doc => {
                const feedback = doc.data();
                const feedbackEl = template.content.cloneNode(true);
                
                // Format the timestamp
                const timestamp = feedback.timestamp ? new Date(feedback.timestamp.toDate()) : new Date();
                const formattedDate = timestamp.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                // Set feedback data
                feedbackEl.querySelector('.name').textContent = feedback.name || 'Anonymous';
                feedbackEl.querySelector('.category').textContent = feedback.category || 'N/A';
                feedbackEl.querySelector('.subject').textContent = feedback.subject || 'N/A';
                feedbackEl.querySelector('.timestamp').textContent = formattedDate;
                feedbackEl.querySelector('.message').textContent = feedback.message || '';

                // Setup delete button
                const deleteBtn = feedbackEl.querySelector('.delete-feedback');
                deleteBtn.addEventListener('click', () => {
                    showConfirmDialog(() => deleteFeedback(doc.id));
                });

                feedbackList.appendChild(feedbackEl);
            });
        }, error => {
            console.error('Error getting feedback:', error);
            feedbackList.innerHTML = '<div class="error-message">Error loading feedback. Please refresh the page.</div>';
        });
    }

    // Filter feedback
    function updateFilters() {
        const category = categoryFilter.value;
        const subject = subjectFilter.value;

        let query = feedbackCollection.orderBy('timestamp', 'desc');

        if (category) {
            query = query.where('category', '==', category);
        }
        if (subject) {
            query = query.where('subject', '==', subject);
        }

        currentQuery = query;
        setupRealtimeUpdates();
    }

    // Delete specific feedback
    function deleteFeedback(id) {
        feedbackCollection.doc(id).delete()
            .then(() => {
                console.log('Feedback deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting feedback:', error);
                alert('Error deleting feedback. Please try again.');
            });
    }

    // Delete all feedback
    function deleteAllFeedback() {
        showConfirmDialog(() => {
            feedbackCollection.get()
                .then(snapshot => {
                const batch = db.batch();
                snapshot.forEach(doc => {
                    batch.delete(doc.ref);
                });
                return batch.commit();
                })
                .then(() => {
                    console.log('All feedback deleted successfully');
                })
                .catch(error => {
                console.error('Error deleting all feedback:', error);
                alert('Error deleting feedback. Please try again.');
            });
        });
    }

    // Export to Excel
    function exportToExcel() {
        feedbackCollection.get()
            .then(snapshot => {
                const feedbacks = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    feedbacks.push({
                        name: data.name || 'Anonymous',
                        category: data.category || 'N/A',
                        subject: data.subject || 'N/A',
                        message: data.message || '',
                        timestamp: data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString() : 'N/A'
                    });
                });

        if (feedbacks.length === 0) {
            alert('No feedback to export');
            return;
        }
        
        const csvContent = [
            ['Name', 'Category', 'Subject', 'Message', 'Timestamp'],
            ...feedbacks.map(f => [
                f.name,
                f.category,
                f.subject,
                f.message,
                f.timestamp
            ])
        ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `feedback_export_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
            })
            .catch(error => {
                console.error('Error exporting feedback:', error);
                alert('Error exporting feedback. Please try again.');
            });
    }

    // Event listeners
    categoryFilter.addEventListener('change', updateFilters);
    subjectFilter.addEventListener('change', updateFilters);
    clearFiltersBtn.addEventListener('click', () => {
        categoryFilter.value = '';
        subjectFilter.value = '';
        updateFilters();
    });
    exportBtn.addEventListener('click', exportToExcel);
    deleteAllBtn.addEventListener('click', deleteAllFeedback);

    // Initial setup
    setupRealtimeUpdates();
}

// Show/hide confirmation dialog
function showConfirmDialog(onConfirm) {
    const confirmDialog = document.getElementById('confirmDialog');
    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');

    confirmDialog.classList.add('active');
    
    const handleConfirm = () => {
        onConfirm();
        hideConfirmDialog();
    };

    const handleCancel = () => {
        hideConfirmDialog();
    };

    confirmYes.addEventListener('click', handleConfirm, { once: true });
    confirmNo.addEventListener('click', handleCancel, { once: true });
}

function hideConfirmDialog() {
    const confirmDialog = document.getElementById('confirmDialog');
    confirmDialog.classList.remove('active');
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('login.html')) {
        const loginForm = document.getElementById('loginForm');
        const errorMessage = document.getElementById('error-message');
        const togglePassword = document.querySelector('.toggle-password');
        const passwordInput = document.getElementById('password');

        // Toggle password visibility
        if (togglePassword) {
            togglePassword.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            });
        }

        // Handle login form submission
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;

                if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                    // Successful login
                    sessionStorage.setItem('adminLoggedIn', 'true');
                    window.location.href = 'dashboard.html';
                } else {
                    // Failed login
                    errorMessage.textContent = 'Invalid username or password';
                    errorMessage.style.display = 'block';
                    loginForm.reset();
                }
            });
        }
    } else if (currentPath.includes('dashboard.html')) {
        // Check authentication
        if (!checkAuth()) return;

        // Setup logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }

        // Initialize dashboard
        initDashboard();
    }
}); 