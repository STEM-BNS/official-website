// Initialize Firebase components
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// DOM Elements
const postForm = document.getElementById('postForm');
const postImage = document.getElementById('postImage');
const imagePreview = document.getElementById('imagePreview');
const saveDraftBtn = document.getElementById('saveDraftBtn');
const previewBtn = document.getElementById('previewBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Check authentication state
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = 'login.html';
    }
});

// Handle image upload preview
postImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            postImage.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            imagePreview.classList.add('active');
        };
        reader.readAsDataURL(file);
    }
});

// Handle form submission
postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.submitter;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing...';

    try {
        const formData = new FormData(postForm);
        const postData = {
            title: formData.get('title'),
            category: formData.get('category'),
            date: new Date(formData.get('date')).toISOString(),
            summary: formData.get('summary'),
            content: formData.get('content'),
            tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
            status: 'published',
            author: auth.currentUser.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Upload image if provided
        const imageFile = postImage.files[0];
        if (imageFile) {
            const imageRef = storage.ref(`posts/${Date.now()}_${imageFile.name}`);
            await imageRef.put(imageFile);
            postData.imageUrl = await imageRef.getDownloadURL();
        }

        // Save to Firestore
        const docRef = await db.collection('posts').add(postData);
        
        // Show success message
        alert('Post published successfully!');
        
        // Reset form
        postForm.reset();
        imagePreview.innerHTML = '';
        imagePreview.classList.remove('active');
        
        // Redirect to dashboard or post list
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        console.error('Error publishing post:', error);
        alert('Error publishing post. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Publish Post';
    }
});

// Handle save draft
saveDraftBtn.addEventListener('click', async () => {
    saveDraftBtn.disabled = true;
    saveDraftBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    try {
        const formData = new FormData(postForm);
        const draftData = {
            title: formData.get('title'),
            category: formData.get('category'),
            date: formData.get('date') ? new Date(formData.get('date')).toISOString() : null,
            summary: formData.get('summary'),
            content: formData.get('content'),
            tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
            status: 'draft',
            author: auth.currentUser.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Upload image if provided
        const imageFile = postImage.files[0];
        if (imageFile) {
            const imageRef = storage.ref(`posts/drafts/${Date.now()}_${imageFile.name}`);
            await imageRef.put(imageFile);
            draftData.imageUrl = await imageRef.getDownloadURL();
        }

        // Save to Firestore
        await db.collection('posts').add(draftData);
        
        alert('Draft saved successfully!');
    } catch (error) {
        console.error('Error saving draft:', error);
        alert('Error saving draft. Please try again.');
    } finally {
        saveDraftBtn.disabled = false;
        saveDraftBtn.innerHTML = '<i class="fas fa-save"></i> Save Draft';
    }
});

// Handle preview
previewBtn.addEventListener('click', () => {
    const formData = new FormData(postForm);
    const previewData = {
        title: formData.get('title'),
        category: formData.get('category'),
        date: formData.get('date') ? new Date(formData.get('date')).toLocaleString() : '',
        summary: formData.get('summary'),
        content: formData.get('content'),
        tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    // Create preview window
    const previewWindow = window.open('', 'Preview', 'width=800,height=600');
    previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Preview - ${previewData.title}</title>
            <link rel="stylesheet" href="../css/style.css">
            <link rel="stylesheet" href="../css/posts.css">
            <style>
                body { padding: 2rem; max-width: 800px; margin: 0 auto; }
            </style>
        </head>
        <body>
            <div class="post-card">
                ${postImage.files[0] ? 
                    `<img src="${URL.createObjectURL(postImage.files[0])}" class="post-card-image" alt="${previewData.title}">` 
                    : ''}
                <div class="post-card-content">
                    <span class="post-card-category">${previewData.category}</span>
                    <h1 class="post-card-title">${previewData.title}</h1>
                    <div class="post-card-meta">
                        <span><i class="far fa-calendar"></i> ${previewData.date}</span>
                        <span><i class="far fa-user"></i> ${auth.currentUser.email}</span>
                    </div>
                    <p class="post-card-summary">${previewData.summary}</p>
                    <div class="post-content">${previewData.content}</div>
                    <div class="post-card-tags">
                        ${previewData.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Handle logout
logoutBtn.addEventListener('click', async () => {
    try {
        await auth.signOut();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error signing out:', error);
        alert('Error signing out. Please try again.');
    }
}); 