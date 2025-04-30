// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    const eventsList = document.getElementById('eventsList');
    const eventSearch = document.getElementById('eventSearch');
    const eventTypeFilter = document.getElementById('eventTypeFilter');
    const audienceFilter = document.getElementById('audienceFilter');

    // Load events when page loads
    loadEvents();

    // Setup search and filters
    if (eventSearch) {
        eventSearch.addEventListener('input', filterEvents);
    }
    if (eventTypeFilter) {
        eventTypeFilter.addEventListener('change', filterEvents);
    }
    if (audienceFilter) {
        audienceFilter.addEventListener('change', filterEvents);
    }
});

// Load events from MySQL database
async function loadEvents() {
    try {
        // Determine if we're running on localhost or direct file
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const baseUrl = isLocalhost ? '' : 'http://localhost';
        
        const response = await fetch(baseUrl + '/school-website/admin/events.php');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const events = await response.json();
        
        const eventsList = document.getElementById('eventsList');
        eventsList.innerHTML = '';
        
        if (!events || events.length === 0) {
            eventsList.innerHTML = '<div class="no-events">No events found. Please check back later.</div>';
            return;
        }

        // Sort events by date
        events.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

        events.forEach(event => {
            const eventElement = createEventElement(event);
            eventsList.appendChild(eventElement);
        });
    } catch (error) {
        console.error('Error loading events:', error);
        const eventsList = document.getElementById('eventsList');
        eventsList.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Unable to load events. Please make sure:</p>
                <ul>
                    <li>XAMPP is running (Apache and MySQL)</li>
                    <li>You're accessing through http://localhost/school-website/news.html</li>
                </ul>
            </div>`;
    }
}

// Create Event Element
function createEventElement(event) {
    const template = document.getElementById('eventTemplate');
    const eventElement = template.content.cloneNode(true);
    
    const eventCard = eventElement.querySelector('.event-card');
    eventCard.dataset.id = event.id;
    
    // Set up the card link
    const cardLink = eventElement.querySelector('.event-card-link');
    cardLink.href = `event-details.html?id=${event.id}`;
    cardLink.setAttribute('title', event.title);
    
    // Format date for the badge
    const eventDate = new Date(event.event_date);
    const day = eventDate.getDate();
    const month = eventDate.toLocaleString('default', { month: 'short' });
    
    eventElement.querySelector('.day').textContent = day;
    eventElement.querySelector('.month').textContent = month;
    
    // Add event image if available
    if (event.image_url) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'event-image loading';
        const image = document.createElement('img');
        
        // Handle image loading
        image.onload = () => {
            imageContainer.classList.remove('loading');
        };
        
        image.onerror = () => {
            imageContainer.classList.remove('loading');
            imageContainer.classList.add('error');
            image.src = 'images/event-placeholder.jpg';
        };
        
        image.src = event.image_url;
        image.alt = event.title;
        image.loading = "lazy";
        imageContainer.appendChild(image);
        eventCard.insertBefore(imageContainer, eventCard.firstChild);
    }
    
    // Add title
    const title = eventElement.querySelector('.event-title');
    title.textContent = event.title;
    
    // Add details
    const details = eventElement.querySelector('.event-details');
    details.innerHTML = `
        <p class="event-time"><i class="fas fa-clock"></i> <span>${formatTime(event.event_date)}</span></p>
        <p class="event-location"><i class="fas fa-map-marker-alt"></i> <span>${event.location}</span></p>
        <p class="event-type"><i class="fas fa-tag"></i> <span>${formatEventType(event.event_type)}</span></p>
        <p class="event-audience"><i class="fas fa-users"></i> <span>${formatAudience(event.audience)}</span></p>
    `;
    
    // Add description (truncate if too long)
    const description = eventElement.querySelector('.event-description');
    description.textContent = truncateText(event.description, 150);
    
    // Setup interested button
    const interestedBtn = eventElement.querySelector('.interested-btn');
    interestedBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent card link from triggering
        e.stopPropagation(); // Prevent event bubbling
        interestedBtn.classList.toggle('active');
        if (interestedBtn.classList.contains('active')) {
            interestedBtn.innerHTML = '<i class="fas fa-heart"></i> Interested';
        } else {
            interestedBtn.innerHTML = '<i class="far fa-heart"></i> I\'m Interested';
        }
    });
    
    // Setup share buttons
    const shareButtons = eventElement.querySelectorAll('.share-btn');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent card link from triggering
            e.stopPropagation(); // Prevent event bubbling
            const platform = btn.title.split(' ')[2].toLowerCase();
            shareEvent(event, platform);
        });
    });

    // Make the entire card clickable
    eventCard.addEventListener('click', (e) => {
        // Only navigate if the click wasn't on a button
        if (!e.target.closest('button')) {
            window.location.href = cardLink.href;
        }
    });
    
    return eventElement;
}

// Helper function to truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// Format Time
function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Format Event Type
function formatEventType(type) {
    return type.charAt(0).toUpperCase() + type.slice(1);
}

// Format Audience
function formatAudience(audience) {
    return audience
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Share Event
function shareEvent(event, platform) {
    const eventUrl = `${window.location.origin}${window.location.pathname}?id=${event.id}`;
    const text = `Check out this event: ${event.title}`;
    
    switch (platform) {
        case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`, '_blank');
            break;
        case 'twitter':
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(eventUrl)}`, '_blank');
            break;
        case 'linkedin':
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`, '_blank');
            break;
    }
}

// Filter Events
function filterEvents() {
    const searchTerm = eventSearch.value.toLowerCase();
    const typeFilter = eventTypeFilter.value.toLowerCase();
    const audienceFilter = audienceFilter.value.toLowerCase();
    
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        const title = card.querySelector('.event-title').textContent.toLowerCase();
        const description = card.querySelector('.event-description').textContent.toLowerCase();
        const type = card.querySelector('.event-type span').textContent.toLowerCase();
        const audience = card.querySelector('.event-audience span').textContent.toLowerCase();
        
        const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
        const matchesType = !typeFilter || type === typeFilter;
        const matchesAudience = !audienceFilter || audience.includes(audienceFilter);
        
        if (matchesSearch && matchesType && matchesAudience) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show no results message if all cards are hidden
    const visibleCards = document.querySelectorAll('.event-card[style=""]').length;
    const noResultsMessage = document.querySelector('.no-results');
    
    if (visibleCards === 0) {
        if (!noResultsMessage) {
            const message = document.createElement('div');
            message.className = 'no-results';
            message.innerHTML = '<p>No events match your filters. Try adjusting your search criteria.</p>';
            document.querySelector('.events-list').appendChild(message);
        }
    } else if (noResultsMessage) {
        noResultsMessage.remove();
    }
} 