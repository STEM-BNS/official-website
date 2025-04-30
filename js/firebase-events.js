// Initialize Firestore
const db = firebase.firestore();
const storage = firebase.storage();

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

// Load events from Firestore
async function loadEvents() {
    try {
        const eventsRef = db.collection('events');
        const snapshot = await eventsRef
            .where('status', '==', 'published')
            .orderBy('date', 'desc')
            .get();
        
        const eventsList = document.getElementById('eventsList');
        eventsList.innerHTML = '';
        
        if (snapshot.empty) {
            eventsList.innerHTML = '<div class="no-events">No events found. Please check back later.</div>';
            return;
        }

        snapshot.forEach(doc => {
            const event = {
                id: doc.id,
                ...doc.data()
            };
            const eventElement = createEventElement(event);
            eventsList.appendChild(eventElement);
        });
    } catch (error) {
        console.error('Error loading events:', error);
        const eventsList = document.getElementById('eventsList');
        eventsList.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Unable to load events. Please try again later.</p>
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
    const eventDate = event.date ? event.date.toDate() : new Date();
    const day = eventDate.getDate();
    const month = eventDate.toLocaleString('default', { month: 'short' });
    
    eventElement.querySelector('.day').textContent = day;
    eventElement.querySelector('.month').textContent = month;
    
    // Add event image if available
    if (event.imageUrl) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'event-image';
        const image = document.createElement('img');
        image.src = event.imageUrl;
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
        <p class="event-time"><i class="fas fa-clock"></i> <span>${eventDate.toLocaleTimeString()}</span></p>
        <p class="event-location"><i class="fas fa-map-marker-alt"></i> <span>${event.location || 'TBA'}</span></p>
        <p class="event-type"><i class="fas fa-tag"></i> <span>${event.category || 'General'}</span></p>
        <p class="event-audience"><i class="fas fa-users"></i> <span>${event.audience || 'All'}</span></p>
    `;
    
    // Add description
    const description = eventElement.querySelector('.event-description');
    description.textContent = event.summary || truncateText(event.content, 150);
    
    // Setup interested button
    const interestedBtn = eventElement.querySelector('.interested-btn');
    interestedBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            const eventRef = db.collection('events').doc(event.id);
            await eventRef.update({
                interestedCount: firebase.firestore.FieldValue.increment(1)
            });
            
            interestedBtn.classList.add('active');
            interestedBtn.disabled = true;
            interestedBtn.innerHTML = '<i class="fas fa-heart"></i> Interested';
        } catch (error) {
            console.error('Error updating interested count:', error);
        }
    });
    
    // Setup share buttons
    const shareButtons = eventElement.querySelectorAll('.share-btn');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const platform = btn.title.split(' ')[2].toLowerCase();
            shareEvent(event, platform);
        });
    });

    return eventElement;
}

// Helper Functions
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

function shareEvent(event, platform) {
    const eventUrl = `${window.location.origin}/event-details.html?id=${event.id}`;
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