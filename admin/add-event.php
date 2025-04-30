<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Event - STEM Bani Sweif School</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/admin.css">
    <link rel="stylesheet" href="../css/events.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <header class="admin-header">
        <nav class="navbar">
            <div class="logo">
                <img src="../images/logo.png" alt="STEM Bani Sweif Logo" class="logo-img">
                <h1>Add New Event</h1>
            </div>
            <div class="admin-nav">
                <a href="dashboard.php" class="back-btn">
                    <i class="fas fa-arrow-left"></i>
                    Back to Dashboard
                </a>
            </div>
        </nav>
    </header>

    <main class="admin-main">
        <div class="content-area">
            <div class="event-form-container">
                <form id="eventForm" class="event-form" action="events.php" method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="action" value="create">
                    
                    <div class="form-section">
                        <h2>Event Details</h2>
                        <div class="form-group">
                            <label for="eventTitle">Event Title</label>
                            <input type="text" id="eventTitle" name="title" required>
                        </div>
                        <div class="form-group">
                            <label for="eventDate">Event Date</label>
                            <input type="datetime-local" id="eventDate" name="date" required>
                        </div>
                        <div class="form-group">
                            <label for="eventLocation">Location</label>
                            <input type="text" id="eventLocation" name="location" required>
                        </div>
                        <div class="form-group">
                            <label for="eventDescription">Description</label>
                            <textarea id="eventDescription" name="description" required></textarea>
                        </div>
                    </div>

                    <div class="form-section">
                        <h2>Event Image</h2>
                        <div class="form-group">
                            <label for="eventImage">Upload Image</label>
                            <input type="file" id="eventImage" name="image" accept="image/*">
                            <div id="imagePreview" class="image-preview"></div>
                        </div>
                    </div>

                    <div class="form-section">
                        <h2>Additional Information</h2>
                        <div class="form-group">
                            <label for="eventType">Event Type</label>
                            <select id="eventType" name="type" required>
                                <option value="">Select Event Type</option>
                                <option value="academic">Academic</option>
                                <option value="social">Social</option>
                                <option value="sports">Sports</option>
                                <option value="cultural">Cultural</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="eventAudience">Target Audience</label>
                            <select id="eventAudience" name="audience" required>
                                <option value="">Select Audience</option>
                                <option value="all">All Students</option>
                                <option value="seniors">Senior Students</option>
                                <option value="juniors">Junior Students</option>
                                <option value="teachers">Teachers</option>
                                <option value="parents">Parents</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="save-btn">
                            <i class="fas fa-save"></i>
                            Save Event
                        </button>
                        <a href="dashboard.php" class="cancel-btn">
                            <i class="fas fa-times"></i>
                            Cancel
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </main>

    <script>
        // Image preview
        document.getElementById('eventImage').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('imagePreview').innerHTML = 
                        `<img src="${e.target.result}" alt="Event Image Preview">`;
                }
                reader.readAsDataURL(file);
            }
        });
    </script>
</body>
</html> 