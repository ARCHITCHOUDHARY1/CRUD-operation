document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const contentForm = document.getElementById('contentForm');
    const titleInput = document.getElementById('title');
    const typeInput = document.getElementById('type');
    const bodyInput = document.getElementById('body');
    const contentIdInput = document.getElementById('contentId');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const contentList = document.getElementById('contentList');
    
    // State
    let contents = [];
    let isEditing = false;
    let currentEditId = null;
    
    // Initialize the app
    function init() {
        loadContents();
        renderContents();
        setupEventListeners();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        contentForm.addEventListener('submit', handleFormSubmit);
        cancelBtn.addEventListener('click', cancelEdit);
    }
    
    // Load contents from localStorage
    function loadContents() {
        const storedContents = localStorage.getItem('contents');
        if (storedContents) {
            contents = JSON.parse(storedContents);
        }
    }
    
    // Save contents to localStorage
    function saveContents() {
        localStorage.setItem('contents', JSON.stringify(contents));
    }
    
    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const title = titleInput.value.trim();
        const type = typeInput.value;
        const body = bodyInput.value.trim();
        
        if (!title || !type || !body) {
            alert('Please fill in all fields');
            return;
        }
        
        if (isEditing) {
            // Update existing content
            const index = contents.findIndex(content => content.id === currentEditId);
            if (index !== -1) {
                contents[index] = {
                    id: currentEditId,
                    title,
                    type,
                    body,
                    createdAt: contents[index].createdAt,
                    updatedAt: new Date().toISOString()
                };
            }
        } else {
            // Create new content
            const newContent = {
                id: Date.now().toString(),
                title,
                type,
                body,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            contents.unshift(newContent);
        }
        
        saveContents();
        renderContents();
        resetForm();
    }
    
    // Render all contents
    function renderContents() {
        contentList.innerHTML = '';
        
        if (contents.length === 0) {
            contentList.innerHTML = '<p>No content available. Add some content!</p>';
            return;
        }
        
        contents.forEach(content => {
            const li = document.createElement('li');
            li.className = 'content-item';
            
            li.innerHTML = `
                <div class="content-title">${content.title}</div>
                <div class="content-type">${content.type}</div>
                <div class="content-body">${content.body}</div>
                <div class="content-meta">
                    <small>Created: ${formatDate(content.createdAt)}</small>
                    ${content.updatedAt !== content.createdAt ? 
                      `<small>, Updated: ${formatDate(content.updatedAt)}</small>` : ''}
                </div>
                <div class="content-actions">
                    <button class="edit-btn" data-id="${content.id}">Edit</button>
                    <button class="delete-btn" data-id="${content.id}">Delete</button>
                </div>
            `;
            
            contentList.appendChild(li);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editContent(btn.dataset.id));
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteContent(btn.dataset.id));
        });
    }
    
    // Edit content
    function editContent(id) {
        const content = contents.find(content => content.id === id);
        if (content) {
            isEditing = true;
            currentEditId = id;
            
            contentIdInput.value = content.id;
            titleInput.value = content.title;
            typeInput.value = content.type;
            bodyInput.value = content.body;
            
            saveBtn.textContent = 'Update Content';
            cancelBtn.classList.remove('hidden');
        }
    }
    
    // Delete content
    function deleteContent(id) {
        if (confirm('Are you sure you want to delete this content?')) {
            contents = contents.filter(content => content.id !== id);
            saveContents();
            renderContents();
            
            if (isEditing && currentEditId === id) {
                cancelEdit();
            }
        }
    }
    
    // Cancel edit mode
    function cancelEdit() {
        isEditing = false;
        currentEditId = null;
        resetForm();
    }
    
    // Reset the form
    function resetForm() {
        contentForm.reset();
        contentIdInput.value = '';
        saveBtn.textContent = 'Save Content';
        cancelBtn.classList.add('hidden');
        isEditing = false;
        currentEditId = null;
    }
    
    // Format date for display
    function formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    // Initialize the app
    init();
});