<?php
require_once 'admin/config.php';

// Get all events
$sql = "SELECT * FROM events ORDER BY event_date DESC";
$result = $conn->query($sql);
$events = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>News & Events - STEM Bani Sweif</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/news.css">
    <link rel="stylesheet" href="css/events.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Space+Grotesk:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Header Section -->
    <header class="main-header">
        <nav class="navbar">
            <div class="logo">
                <img src="images/logo.png" alt="STEM Bani Sweif Logo" class="logo-img">
                <h1>STEM<br>BNS</h1>
            </div>
            <button class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul class="nav-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="about.html">About</a></li>
                <li><a href="academics.html">Academics</a></li>
                <li><a href="admissions.html">Admissions</a></li>
                <li><a href="capstone.html">Capstone</a></li>
                <li><a href="library.html">Library</a></li>
                <li><a href="news.php" class="active">News & Events</a></li>
                <li><a href="contact.html">Contact</a></li>
                <li><a href="feedback.html">Feedback</a></li>
                <li class="login-btn"><a href="admin/login.html"><i class="fas fa-user"></i> Login</a></li>
            </ul>
        </nav>
    </header>

    <!-- Hero Section -->
    <section class="news-hero">
        <div class="hero-content">
            <h1 class="hero-title">News & Events</h1>
            <p class="hero-subtitle">Stay Updated with STEM Bani Sweif</p>
        </div>
        <div class="hero-background">
            <div class="particles"></div>
        </div>
    </section>

    <!-- Events Section -->
    <section class="events-section">
        <div class="container">
            <div class="events-header">
                <h2 class="section-title">Events Calendar</h2>
                <div class="events-filters">
                    <div class="search-box">
                        <input type="text" id="eventSearch" placeholder="Search events...">
                        <i class="fas fa-search"></i>
                    </div>
                    <div class="filter-group">
                        <select id="eventTypeFilter">
                            <option value="">All Event Types</option>
                            <option value="academic">Academic</option>
                            <option value="social">Social</option>
                            <option value="sports">Sports</option>
                            <option value="cultural">Cultural</option>
                            <option value="other">Other</option>
                        </select>
                        <select id="audienceFilter">
                            <option value="">All Audiences</option>
                            <option value="all">All Students</option>
                            <option value="seniors">Senior Students</option>
                            <option value="juniors">Junior Students</option>
                            <option value="teachers">Teachers</option>
                            <option value="parents">Parents</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="events-grid">
                <div class="events-list">
                    <?php foreach ($events as $event): ?>
                        <div class="event-card">
                            <div class="event-date-badge">
                                <span class="day"><?php echo date('d', strtotime($event['event_date'])); ?></span>
                                <span class="month"><?php echo date('M', strtotime($event['event_date'])); ?></span>
                            </div>
                            <div class="event-content">
                                <h3 class="event-title"><?php echo htmlspecialchars($event['title']); ?></h3>
                                <div class="event-details">
                                    <p class="event-time">
                                        <i class="fas fa-clock"></i>
                                        <span><?php echo date('h:i A', strtotime($event['event_date'])); ?></span>
                                    </p>
                                    <p class="event-location">
                                        <i class="fas fa-map-marker-alt"></i>
                                        <span><?php echo htmlspecialchars($event['location']); ?></span>
                                    </p>
                                    <p class="event-type">
                                        <i class="fas fa-tag"></i>
                                        <span><?php echo ucfirst($event['event_type']); ?></span>
                                    </p>
                                    <p class="event-audience">
                                        <i class="fas fa-users"></i>
                                        <span><?php echo ucfirst($event['audience']); ?></span>
                                    </p>
                                </div>
                                <p class="event-description"><?php echo htmlspecialchars($event['description']); ?></p>
                                <div class="event-actions">
                                    <button class="interested-btn">
                                        <i class="far fa-heart"></i>
                                        I'm Interested
                                    </button>
                                    <div class="share-buttons">
                                        <button class="share-btn" title="Share on Facebook">
                                            <i class="fab fa-facebook"></i>
                                        </button>
                                        <button class="share-btn" title="Share on Twitter">
                                            <i class="fab fa-twitter"></i>
                                        </button>
                                        <button class="share-btn" title="Share on LinkedIn">
                                            <i class="fab fa-linkedin"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="main-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Contact Us</h3>
                    <p><i class="fas fa-map-marker-alt"></i> Bani Sweif, Egypt</p>
                    <p><i class="fas fa-phone"></i> +20 10 64803860</p>
                    <p><i class="fas fa-envelope"></i> <a href="mailto:bsweifsch@stembsweif.moe.edu.eg">bsweifsch@stembsweif.moe.edu.eg</a></p>
                </div>
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="academics.html">Academics</a></li>
                        <li><a href="admissions.html">Admissions</a></li>
                        <li><a href="news.php">News & Events</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Follow Us</h3>
                    <div class="social-links">
                        <a href="https://www.facebook.com/101524117903935" target="_blank"><i class="fab fa-facebook"></i></a>
                        <a href="https://wa.me/+201064803860" target="_blank"><i class="fab fa-whatsapp"></i></a>
                        <a href="mailto:bsweifsch@stembsweif.moe.edu.eg"><i class="fas fa-envelope"></i></a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 STEM Bani Sweif. All rights reserved.</p>
                <p class="credits">Developed by <a href="developers.html">Hamdy Abu El-Khair & Abd El-Rahman Khalaf</a></p>
            </div>
        </div>
    </footer>

    <script src="js/script.js"></script>
    <script>
        // Search and filter functionality
        document.getElementById('eventSearch').addEventListener('input', filterEvents);
        document.getElementById('eventTypeFilter').addEventListener('change', filterEvents);
        document.getElementById('audienceFilter').addEventListener('change', filterEvents);

        function filterEvents() {
            const searchTerm = document.getElementById('eventSearch').value.toLowerCase();
            const typeFilter = document.getElementById('eventTypeFilter').value;
            const audienceFilter = document.getElementById('audienceFilter').value;
            
            const eventCards = document.querySelectorAll('.event-card');
            
            eventCards.forEach(card => {
                const title = card.querySelector('.event-title').textContent.toLowerCase();
                const type = card.querySelector('.event-type span').textContent.toLowerCase();
                const audience = card.querySelector('.event-audience span').textContent.toLowerCase();
                
                const matchesSearch = title.includes(searchTerm);
                const matchesType = !typeFilter || type === typeFilter.toLowerCase();
                const matchesAudience = !audienceFilter || audience === audienceFilter.toLowerCase();
                
                card.style.display = matchesSearch && matchesType && matchesAudience ? 'flex' : 'none';
            });
        }

        // Interested button functionality
        document.querySelectorAll('.interested-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('active');
                if (this.classList.contains('active')) {
                    this.innerHTML = '<i class="fas fa-heart"></i> Interested';
                } else {
                    this.innerHTML = '<i class="far fa-heart"></i> I\'m Interested';
                }
            });
        });

        // Share buttons functionality
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const platform = this.title.split(' ')[2].toLowerCase();
                const eventCard = this.closest('.event-card');
                const title = eventCard.querySelector('.event-title').textContent;
                const date = eventCard.querySelector('.event-time span').textContent;
                const location = eventCard.querySelector('.event-location span').textContent;
                
                const text = `${title} - ${date} at ${location}`;
                const url = window.location.href;
                
                let shareUrl;
                switch (platform) {
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
                        break;
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                        break;
                    case 'linkedin':
                        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                        break;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            });
        });
    </script>
</body>
</html> 