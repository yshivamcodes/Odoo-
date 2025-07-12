// DOM Elements
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const closeModals = document.querySelectorAll('.close-modal');
const homeLink = document.getElementById('homeLink');
const browseLink = document.getElementById('browseLink');
const profileLink = document.getElementById('profileLink');
const swapsLink = document.getElementById('swapsLink');
const adminLink = document.getElementById('adminLink');
const getStartedBtn = document.getElementById('getStartedBtn');
const userCardsContainer = document.getElementById('userCards');
const skillSearch = document.getElementById('skillSearch');
const searchBtn = document.getElementById('searchBtn');
const userDetailModal = document.getElementById('userDetailModal');
const swapRequestModal = document.getElementById('swapRequestModal');
const swapRequestForm = document.getElementById('swapRequestForm');
const feedbackModal = document.getElementById('feedbackModal');
const feedbackForm = document.getElementById('feedbackForm');
const ratingStars = document.querySelectorAll('.rating-stars i');
const notificationContainer = document.getElementById('notificationContainer');

// State
let currentUser = null;
let users = [];
let swapRequests = [];
let adminUsers = [
    { id: 'admin1', email: 'admin@skillswap.com', password: 'admin123', name: 'Admin User', isAdmin: true }
];

// Initialize the app
function init() {
    // Load sample data
    loadSampleData();
    
    // Check if user is logged in from localStorage
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
        currentUser = JSON.parse(loggedInUser);
        updateUIForLoggedInUser();
    }
    
    // Event listeners
    setupEventListeners();
    
    // Show home section by default
    showSection('homeSection');
}

// Load sample data
function loadSampleData() {
    users = [
        {
            id: 'user1',
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            location: 'New York',
            profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
            isPublic: true,
            offeredSkills: ['Photography', 'Photoshop', 'Graphic Design'],
            wantedSkills: ['Web Development', 'Spanish', 'Guitar'],
            availability: ['weekends', 'evenings'],
            swaps: [],
            ratings: []
        },
        {
            id: 'user2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: 'password123',
            location: 'London',
            profilePic: 'https://randomuser.me/api/portraits/women/1.jpg',
            isPublic: true,
            offeredSkills: ['Excel', 'Data Analysis', 'French'],
            wantedSkills: ['Photoshop', 'Yoga', 'Public Speaking'],
            availability: ['weekdays', 'mornings'],
            swaps: [],
            ratings: []
        },
        {
            id: 'user3',
            name: 'Mike Johnson',
            email: 'mike@example.com',
            password: 'password123',
            location: 'Tokyo',
            profilePic: 'https://randomuser.me/api/portraits/men/2.jpg',
            isPublic: true,
            offeredSkills: ['Web Development', 'JavaScript', 'SEO'],
            wantedSkills: ['Photography', 'Cooking', 'German'],
            availability: ['evenings', 'weekends'],
            swaps: [],
            ratings: []
        },
        {
            id: 'user4',
            name: 'Sarah Williams',
            email: 'sarah@example.com',
            password: 'password123',
            location: 'Sydney',
            profilePic: 'https://randomuser.me/api/portraits/women/2.jpg',
            isPublic: true,
            offeredSkills: ['Yoga', 'Meditation', 'Nutrition'],
            wantedSkills: ['Excel', 'Graphic Design', 'Spanish'],
            availability: ['mornings', 'afternoons'],
            swaps: [],
            ratings: []
        }
    ];
    
    swapRequests = [
        {
            id: 'swap1',
            fromUserId: 'user1',
            toUserId: 'user2',
            requestedSkills: ['Photoshop'],
            offeredSkills: ['Photography'],
            message: 'I can take professional portraits for you in exchange for Photoshop lessons',
            status: 'pending',
            date: '2023-06-15'
        },
        {
            id: 'swap2',
            fromUserId: 'user3',
            toUserId: 'user1',
            requestedSkills: ['Photography'],
            offeredSkills: ['Web Development'],
            message: 'I can help you with your website in exchange for photography tips',
            status: 'accepted',
            date: '2023-06-10'
        }
    ];
}

// Set up event listeners
function setupEventListeners() {
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.id.replace('Link', 'Section');
            showSection(sectionId);
        });
    });
    
    // Auth buttons
    loginBtn.addEventListener('click', () => showModal(loginModal));
    registerBtn.addEventListener('click', () => showModal(registerModal));
    logoutBtn.addEventListener('click', logout);
    getStartedBtn.addEventListener('click', () => {
        if (currentUser) {
            showSection('profileSection');
        } else {
            showModal(registerModal);
        }
    });
    
    // Modal close buttons
    closeModals.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        });
    });
    
    // Click outside modal to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Login form
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        login(email, password);
    });
    
    // Register form
    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        if (password !== confirmPassword) {
            showNotification('error', 'Passwords do not match');
            return;
        }
        
        register(name, email, password);
    });
    
    // Search functionality
    searchBtn.addEventListener('click', searchSkills);
    skillSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchSkills();
        }
    });
    
    // Profile skills
    document.getElementById('addOfferedSkill').addEventListener('click', addOfferedSkill);
    document.getElementById('addWantedSkill').addEventListener('click', addWantedSkill);
    document.getElementById('saveProfileBtn').addEventListener('click', saveProfile);
    
    // Swap tabs
    document.querySelectorAll('.swap-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            showSwapTab(tabId);
        });
    });
    
    // Admin tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            showAdminTab(tabId);
        });
    });
    
    // Rating stars
    ratingStars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.getAttribute('data-rating'));
            setRating(rating);
        });
    });
    
    // Feedback form
    feedbackForm.addEventListener('submit', submitFeedback);
    
    // Swap request form
    swapRequestForm.addEventListener('submit', submitSwapRequest);
}

// Show a specific section
function showSection(sectionId) {
    if (!currentUser && (sectionId === 'profileSection' || sectionId === 'swapsSection' || sectionId === 'adminSection')) {
        showModal(loginModal);
        return;
    }
    
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    
    // Load section-specific content
    switch(sectionId) {
        case 'browseSection':
            displayUserCards(users.filter(user => user.isPublic && user.id !== (currentUser?.id || '')));
            break;
        case 'profileSection':
            loadProfileData();
            break;
        case 'swapsSection':
            loadSwapsData();
            break;
        case 'adminSection':
            if (currentUser?.isAdmin) {
                loadAdminData();
            } else {
                showSection('homeSection');
            }
            break;
    }
}

// Show a modal
function showModal(modal) {
    document.querySelectorAll('.modal').forEach(m => {
        m.classList.remove('active');
    });
    modal.classList.add('active');
}

// Login function
function login(email, password) {
    // Check admin users first
    const adminUser = adminUsers.find(user => user.email === email && user.password === password);
    if (adminUser) {
        currentUser = adminUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUIForLoggedInUser();
        showNotification('success', 'Logged in as admin successfully');
        loginModal.classList.remove('active');
        showSection('homeSection');
        return;
    }
    
    // Check regular users
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUIForLoggedInUser();
        showNotification('success', 'Logged in successfully');
        loginModal.classList.remove('active');
        showSection('homeSection');
    } else {
        showNotification('error', 'Invalid email or password');
    }
}

// Register function
function register(name, email, password) {
    // Check if email already exists
    if (users.some(user => user.email === email) || adminUsers.some(user => user.email === email)) {
        showNotification('error', 'Email already registered');
        return;
    }
    
    const newUser = {
        id: 'user' + (users.length + 1),
        name,
        email,
        password,
        location: '',
        profilePic: 'https://via.placeholder.com/150',
        isPublic: false,
        offeredSkills: [],
        wantedSkills: [],
        availability: [],
        swaps: [],
        ratings: []
    };
    
    users.push(newUser);
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUIForLoggedInUser();
    showNotification('success', 'Registration successful!');
    registerModal.classList.remove('active');
    showSection('profileSection');
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUIForLoggedInUser();
    showNotification('success', 'Logged out successfully');
    showSection('homeSection');
}

// Update UI when user logs in/out
function updateUIForLoggedInUser() {
    if (currentUser) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        
        // Show admin link if user is admin
        if (currentUser.isAdmin) {
            adminLink.style.display = 'block';
        } else {
            adminLink.style.display = 'none';
        }
    } else {
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        adminLink.style.display = 'none';
    }
}

// Display user cards in browse section
function displayUserCards(userList) {
    userCardsContainer.innerHTML = '';
    
    userList.forEach(user => {
        const card = document.createElement('div');
        card.className = 'user-card';
        card.innerHTML = `
            <div class="user-card-img">
                <img src="${user.profilePic}" alt="${user.name}" onerror="this.src='https://via.placeholder.com/150'">
            </div>
            <div class="user-card-content">
                <h3 class="user-card-name">${user.name}</h3>
                <p class="user-card-location">${user.location || 'Location not specified'}</p>
                <div class="user-card-skills">
                    <h4>Offers:</h4>
                    <ul>
                        ${user.offeredSkills.slice(0, 3).map(skill => `<li>${skill}</li>`).join('')}
                        ${user.offeredSkills.length > 3 ? '<li>...</li>' : ''}
                    </ul>
                </div>
                <div class="user-card-skills">
                    <h4>Wants:</h4>
                    <ul>
                        ${user.wantedSkills.slice(0, 3).map(skill => `<li>${skill}</li>`).join('')}
                        ${user.wantedSkills.length > 3 ? '<li>...</li>' : ''}
                    </ul>
                </div>
                <div class="user-card-actions">
                    <button class="btn btn-primary view-profile" data-userid="${user.id}">View Profile</button>
                </div>
            </div>
        `;
        userCardsContainer.appendChild(card);
    });
    
    // Add event listeners to view profile buttons
    document.querySelectorAll('.view-profile').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const userId = e.target.getAttribute('data-userid');
            showUserDetails(userId);
        });
    });
}

// Search skills
function searchSkills() {
    const searchTerm = skillSearch.value.toLowerCase();
    const locationFilter = document.getElementById('locationFilter').value;
    const availabilityFilter = document.getElementById('availabilityFilter').value;
    
    let filteredUsers = users.filter(user => 
        user.isPublic && 
        user.id !== (currentUser?.id || '') &&
        (user.offeredSkills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
        user.wantedSkills.some(skill => skill.toLowerCase().includes(searchTerm)))
    );
    
    if (locationFilter) {
        filteredUsers = filteredUsers.filter(user => user.location === locationFilter);
    }
    
    if (availabilityFilter) {
        filteredUsers = filteredUsers.filter(user => user.availability.includes(availabilityFilter));
    }
    
    displayUserCards(filteredUsers);
}

// Show user details in modal
function showUserDetails(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    document.getElementById('detailUserName').textContent = user.name;
    document.getElementById('detailUserLocation').textContent = user.location || 'Location not specified';
    document.getElementById('detailUserPhoto').src = user.profilePic;
    
    const offeredSkillsList = document.getElementById('detailOfferedSkills');
    offeredSkillsList.innerHTML = user.offeredSkills.map(skill => `<li>${skill}</li>`).join('');
    
    const wantedSkillsList = document.getElementById('detailWantedSkills');
    wantedSkillsList.innerHTML = user.wantedSkills.map(skill => `<li>${skill}</li>`).join('');
    
    const availability = document.getElementById('detailAvailability');
    availability.textContent = user.availability.length > 0 ? 
        user.availability.join(', ') : 'Not specified';
    
    // Set user ID on request button
    const requestBtn = document.getElementById('requestSwapBtn');
    requestBtn.setAttribute('data-userid', user.id);
    requestBtn.addEventListener('click', () => {
        prepareSwapRequest(user.id);
        userDetailModal.classList.remove('active');
        showModal(swapRequestModal);
    });
    
    showModal(userDetailModal);
}

// Prepare swap request form
function prepareSwapRequest(toUserId) {
    const user = users.find(u => u.id === toUserId);
    if (!user || !currentUser) return;
    
    document.getElementById('swapUserName').textContent = user.name;
    
    // Populate requested skills (from user's offered skills)
    const requestedSkillsContainer = document.getElementById('swapRequestSkills');
    requestedSkillsContainer.innerHTML = user.offeredSkills.map(skill => `
        <div class="skill-checkbox">
            <input type="checkbox" id="req-${skill}" name="requestedSkills" value="${skill}">
            <label for="req-${skill}">${skill}</label>
        </div>
    `).join('');
    
    // Populate offered skills (from current user's offered skills)
    const offeredSkillsContainer = document.getElementById('swapOfferSkills');
    offeredSkillsContainer.innerHTML = currentUser.offeredSkills.map(skill => `
        <div class="skill-checkbox">
            <input type="checkbox" id="off-${skill}" name="offeredSkills" value="${skill}">
            <label for="off-${skill}">${skill}</label>
        </div>
    `).join('');
}

// Submit swap request - ENHANCED VERSION WITH DEBUGGING
function submitSwapRequest(e) {
    e.preventDefault();
    
    console.log('Swap request submitted'); // Debug log
    
    // Check if user is logged in
    if (!currentUser) {
        console.error('No current user'); // Debug log
        showNotification('error', 'You must be logged in to request swaps');
        return;
    }

    const toUserId = document.getElementById('requestSwapBtn').getAttribute('data-userid');
    console.log('Target user ID:', toUserId); // Debug log
    
    // Check if trying to swap with yourself
    if (toUserId === currentUser.id) {
        console.error('Attempt to swap with self'); // Debug log
        showNotification('error', 'You cannot request a swap with yourself');
        return;
    }

    const message = document.getElementById('swapRequestMessage').value;
    console.log('Swap message:', message); // Debug log
    
    // Get selected requested skills
    const requestedSkills = [];
    document.querySelectorAll('input[name="requestedSkills"]:checked').forEach(checkbox => {
        requestedSkills.push(checkbox.value);
    });
    console.log('Requested skills:', requestedSkills); // Debug log
    
    // Get selected offered skills
    const offeredSkills = [];
    document.querySelectorAll('input[name="offeredSkills"]:checked').forEach(checkbox => {
        offeredSkills.push(checkbox.value);
    });
    console.log('Offered skills:', offeredSkills); // Debug log
    
    // Validate selections
    if (requestedSkills.length === 0) {
        console.error('No requested skills selected'); // Debug log
        showNotification('error', 'Please select at least one skill to request');
        return;
    }
    
    if (offeredSkills.length === 0) {
        console.error('No offered skills selected'); // Debug log
        showNotification('error', 'Please select at least one skill to offer');
        return;
    }

    // Check if target user exists
    const toUser = users.find(u => u.id === toUserId);
    if (!toUser) {
        console.error('Target user not found'); // Debug log
        showNotification('error', 'The user you\'re trying to swap with doesn\'t exist');
        return;
    }

    // Check if target user's profile is public
    if (!toUser.isPublic) {
        console.error('Target profile not public'); // Debug log
        showNotification('error', 'This user\'s profile is not public');
        return;
    }

    // Check if the requested skills are actually offered by the target user
    const invalidRequestedSkills = requestedSkills.filter(skill => !toUser.offeredSkills.includes(skill));
    if (invalidRequestedSkills.length > 0) {
        console.error('Invalid requested skills:', invalidRequestedSkills); // Debug log
        showNotification('error', `The following skills are not offered by ${toUser.name}: ${invalidRequestedSkills.join(', ')}`);
        return;
    }

    // Check if the offered skills are actually offered by the current user
    const invalidOfferedSkills = offeredSkills.filter(skill => !currentUser.offeredSkills.includes(skill));
    if (invalidOfferedSkills.length > 0) {
        console.error('Invalid offered skills:', invalidOfferedSkills); // Debug log
        showNotification('error', `You don't offer the following skills: ${invalidOfferedSkills.join(', ')}`);
        return;
    }

    // Proceed with creating the swap
    const newSwap = {
        id: 'swap' + (swapRequests.length + 1),
        fromUserId: currentUser.id,
        toUserId,
        requestedSkills,
        offeredSkills,
        message,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        rated: false
    };
    
    console.log('Creating new swap:', newSwap); // Debug log
    
    swapRequests.push(newSwap);
    
    // Add to both users' swap lists
    const fromUser = users.find(u => u.id === currentUser.id);
    const toUserObj = users.find(u => u.id === toUserId);
    
    if (fromUser) {
        if (!fromUser.swaps) fromUser.swaps = [];
        fromUser.swaps.push({ swapId: newSwap.id, role: 'from' });
        console.log('Added to fromUser swaps:', fromUser.swaps); // Debug log
    }
    
    if (toUserObj) {
        if (!toUserObj.swaps) toUserObj.swaps = [];
        toUserObj.swaps.push({ swapId: newSwap.id, role: 'to' });
        console.log('Added to toUser swaps:', toUserObj.swaps); // Debug log
    }
    
    showNotification('success', 'Swap request sent successfully');
    swapRequestModal.classList.remove('active');
    
    // Refresh swaps section if active
    if (document.getElementById('swapsSection').classList.contains('active')) {
        loadSwapsData();
    }
}

// Load profile data
function loadProfileData() {
    if (!currentUser) return;
    
    document.getElementById('profileName').value = currentUser.name;
    document.getElementById('profileLocation').value = currentUser.location || '';
    document.getElementById('profilePic').src = currentUser.profilePic;
    document.getElementById('profilePublic').checked = currentUser.isPublic;
    
    // Load offered skills
    const offeredSkillsContainer = document.getElementById('offeredSkills');
    offeredSkillsContainer.innerHTML = currentUser.offeredSkills.map(skill => `
        <span class="skill-item">${skill} <span class="remove-skill" data-skill="${skill}" data-type="offered">×</span></span>
    `).join('');
    
    // Load wanted skills
    const wantedSkillsContainer = document.getElementById('wantedSkills');
    wantedSkillsContainer.innerHTML = currentUser.wantedSkills.map(skill => `
        <span class="skill-item">${skill} <span class="remove-skill" data-skill="${skill}" data-type="wanted">×</span></span>
    `).join('');
    
    // Load availability
    document.querySelectorAll('input[name="availability"]').forEach(checkbox => {
        checkbox.checked = currentUser.availability.includes(checkbox.value);
    });
    
    // Add event listeners to remove skill buttons
    document.querySelectorAll('.remove-skill').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const skill = e.target.getAttribute('data-skill');
            const type = e.target.getAttribute('data-type');
            removeSkill(skill, type);
        });
    });
}

// Add offered skill
function addOfferedSkill() {
    const skillInput = document.getElementById('newOfferedSkill');
    const skill = skillInput.value.trim();
    
    if (skill && !currentUser.offeredSkills.includes(skill)) {
        currentUser.offeredSkills.push(skill);
        loadProfileData();
        skillInput.value = '';
    }
}

// Add wanted skill
function addWantedSkill() {
    const skillInput = document.getElementById('newWantedSkill');
    const skill = skillInput.value.trim();
    
    if (skill && !currentUser.wantedSkills.includes(skill)) {
        currentUser.wantedSkills.push(skill);
        loadProfileData();
        skillInput.value = '';
    }
}

// Remove skill
function removeSkill(skill, type) {
    if (type === 'offered') {
        currentUser.offeredSkills = currentUser.offeredSkills.filter(s => s !== skill);
    } else {
        currentUser.wantedSkills = currentUser.wantedSkills.filter(s => s !== skill);
    }
    loadProfileData();
}

// Save profile
function saveProfile() {
    if (!currentUser) return;
    
    currentUser.name = document.getElementById('profileName').value;
    currentUser.location = document.getElementById('profileLocation').value;
    currentUser.isPublic = document.getElementById('profilePublic').checked;
    
    // Get availability
    currentUser.availability = [];
    document.querySelectorAll('input[name="availability"]:checked').forEach(checkbox => {
        currentUser.availability.push(checkbox.value);
    });
    
    // Update in users array
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
    }
    
    // Update in localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showNotification('success', 'Profile saved successfully');
}

// Load swaps data
function loadSwapsData() {
    if (!currentUser) return;
    
    // Get swaps involving current user
    const userSwaps = currentUser.swaps.map(swap => {
        const swapData = swapRequests.find(s => s.id === swap.swapId);
        return swapData ? { ...swapData, role: swap.role } : null;
    }).filter(swap => swap !== null);
    
    console.log('User swaps:', userSwaps); // Debug log
    
    // Pending swaps (where current user is the recipient)
    const pendingSwaps = userSwaps.filter(swap => 
        swap.role === 'to' && swap.status === 'pending'
    );
    
    // Accepted swaps (where status is accepted)
    const acceptedSwaps = userSwaps.filter(swap => 
        swap.status === 'accepted'
    );
    
    // Completed swaps (where status is completed)
    const completedSwaps = userSwaps.filter(swap => 
        swap.status === 'completed'
    );
    
    // Display pending swaps
    const pendingContainer = document.getElementById('pendingSwaps');
    pendingContainer.innerHTML = pendingSwaps.length > 0 ? 
        pendingSwaps.map(swap => createSwapCard(swap)).join('') :
        '<p>No pending swap requests</p>';
    
    // Display accepted swaps
    const acceptedContainer = document.getElementById('acceptedSwaps');
    acceptedContainer.innerHTML = acceptedSwaps.length > 0 ? 
        acceptedSwaps.map(swap => createSwapCard(swap)).join('') :
        '<p>No accepted swaps</p>';
    
    // Display completed swaps
    const completedContainer = document.getElementById('completedSwaps');
    completedContainer.innerHTML = completedSwaps.length > 0 ? 
        completedSwaps.map(swap => createSwapCard(swap)).join('') :
        '<p>No completed swaps</p>';
    
    // Add event listeners to action buttons
    addSwapActionListeners();
}

// Create swap card HTML
function createSwapCard(swap) {
    const otherUserId = swap.role === 'from' ? swap.toUserId : swap.fromUserId;
    const otherUser = users.find(u => u.id === otherUserId);
    const isFromUser = swap.role === 'from';
    
    let statusClass = '';
    let statusText = '';
    
    switch(swap.status) {
        case 'pending':
            statusClass = 'status-pending';
            statusText = 'Pending';
            break;
        case 'accepted':
            statusClass = 'status-accepted';
            statusText = 'Accepted';
            break;
        case 'completed':
            statusClass = 'status-completed';
            statusText = 'Completed';
            break;
        case 'rejected':
            statusClass = 'status-rejected';
            statusText = 'Rejected';
            break;
    }
    
    return `
        <div class="swap-item" data-swapid="${swap.id}">
            <div class="swap-header">
                <div class="swap-user">
                    <img src="${otherUser?.profilePic || 'https://via.placeholder.com/150'}" alt="${otherUser?.name || 'User'}">
                    <div class="swap-user-info">
                        <h3>${otherUser?.name || 'User'}</h3>
                        <p>${isFromUser ? 'You requested a swap' : 'Requested a swap with you'}</p>
                    </div>
                </div>
                <span class="swap-status ${statusClass}">${statusText}</span>
            </div>
            <div class="swap-details">
                ${swap.message ? `<p>${swap.message}</p>` : ''}
                <div class="swap-skills">
                    <div>
                        <h4>${isFromUser ? 'You requested' : 'They requested'}:</h4>
                        <ul>
                            ${swap.requestedSkills.map(skill => `<li>${skill}</li>`).join('')}
                        </ul>
                    </div>
                    <div>
                        <h4>${isFromUser ? 'You offered' : 'They offered'}:</h4>
                        <ul>
                            ${swap.offeredSkills.map(skill => `<li>${skill}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            <div class="swap-actions">
                ${swap.status === 'pending' && !isFromUser ? `
                    <button class="btn btn-primary accept-swap" data-swapid="${swap.id}">Accept</button>
                    <button class="btn btn-danger reject-swap" data-swapid="${swap.id}">Reject</button>
                ` : ''}
                ${swap.status === 'pending' && isFromUser ? `
                    <button class="btn btn-danger cancel-swap" data-swapid="${swap.id}">Cancel</button>
                ` : ''}
                ${swap.status === 'accepted' ? `
                    <button class="btn btn-primary complete-swap" data-swapid="${swap.id}">Mark as Completed</button>
                ` : ''}
                ${swap.status === 'completed' && !swap.rated ? `
                    <button class="btn btn-primary rate-swap" data-swapid="${swap.id}" data-userid="${otherUserId}">Rate Swap</button>
                ` : ''}
            </div>
        </div>
    `;
}

// Add event listeners to swap action buttons
function addSwapActionListeners() {
    // Accept swap
    document.querySelectorAll('.accept-swap').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const swapId = e.target.getAttribute('data-swapid');
            updateSwapStatus(swapId, 'accepted');
        });
    });
    
    // Reject swap
    document.querySelectorAll('.reject-swap').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const swapId = e.target.getAttribute('data-swapid');
            updateSwapStatus(swapId, 'rejected');
        });
    });
    
    // Cancel swap
    document.querySelectorAll('.cancel-swap').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const swapId = e.target.getAttribute('data-swapid');
            cancelSwap(swapId);
        });
    });
    
    // Complete swap
    document.querySelectorAll('.complete-swap').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const swapId = e.target.getAttribute('data-swapid');
            updateSwapStatus(swapId, 'completed');
        });
    });
    
    // Rate swap
    document.querySelectorAll('.rate-swap').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const swapId = e.target.getAttribute('data-swapid');
            const userId = e.target.getAttribute('data-userid');
            prepareFeedback(swapId, userId);
        });
    });
}

// Update swap status
function updateSwapStatus(swapId, status) {
    const swapIndex = swapRequests.findIndex(s => s.id === swapId);
    if (swapIndex === -1) return;
    
    swapRequests[swapIndex].status = status;
    
    if (status === 'completed') {
        swapRequests[swapIndex].completedDate = new Date().toISOString().split('T')[0];
    }
    
    showNotification('success', `Swap ${status} successfully`);
    loadSwapsData();
}

// Cancel swap
function cancelSwap(swapId) {
    swapRequests = swapRequests.filter(s => s.id !== swapId);
    
    // Remove from users' swap lists
    users.forEach(user => {
        if (user.swaps) {
            user.swaps = user.swaps.filter(s => s.swapId !== swapId);
        }
    });
    
    showNotification('success', 'Swap request cancelled');
    loadSwapsData();
}

// Show swap tab
function showSwapTab(tabId) {
    document.querySelectorAll('.swap-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelector(`.swap-tab[data-tab="${tabId}"]`).classList.add('active');
    
    document.querySelectorAll('.swap-list').forEach(list => {
        list.classList.remove('active');
    });
    
    document.getElementById(`${tabId}Swaps`).classList.add('active');
}

// Load admin data
function loadAdminData() {
    if (!currentUser?.isAdmin) return;
    
    // Load users
    const userList = document.getElementById('adminUserList');
    userList.innerHTML = users.map(user => `
        <div class="admin-user-item">
            <div class="admin-user-info">
                <img src="${user.profilePic}" alt="${user.name}">
                <div>
                    <h4>${user.name}</h4>
                    <p>${user.email} | ${user.location || 'No location'}</p>
                </div>
            </div>
            <div class="admin-user-actions">
                <button class="btn btn-danger ban-user" data-userid="${user.id}">Ban</button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to ban buttons
    document.querySelectorAll('.ban-user').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const userId = e.target.getAttribute('data-userid');
            banUser(userId);
        });
    });
    
    // Load pending skills (for demo, we'll just show some)
    const pendingSkillsList = document.getElementById('pendingSkillsList');
    pendingSkillsList.innerHTML = `
        <div class="pending-skill-item">
            <div class="skill-info">
                <p>Skill: "Advanced Photoshop Techniques"</p>
                <p class="skill-user">Submitted by: John Doe</p>
            </div>
            <div class="admin-skill-actions">
                <button class="btn btn-primary approve-skill">Approve</button>
                <button class="btn btn-danger reject-skill">Reject</button>
            </div>
        </div>
        <div class="pending-skill-item">
            <div class="skill-info">
                <p>Skill: "Excel Macros for Beginners"</p>
                <p class="skill-user">Submitted by: Jane Smith</p>
            </div>
            <div class="admin-skill-actions">
                <button class="btn btn-primary approve-skill">Approve</button>
                <button class="btn btn-danger reject-skill">Reject</button>
            </div>
        </div>
    `;
    
    // Load swap stats
    document.getElementById('pendingSwapCount').textContent = 
        swapRequests.filter(s => s.status === 'pending').length;
    document.getElementById('acceptedSwapCount').textContent = 
        swapRequests.filter(s => s.status === 'accepted').length;
    document.getElementById('completedSwapCount').textContent = 
        swapRequests.filter(s => s.status === 'completed').length;
    
    // Load all swaps
    const adminSwapList = document.getElementById('adminSwapList');
    adminSwapList.innerHTML = swapRequests.map(swap => {
        const fromUser = users.find(u => u.id === swap.fromUserId);
        const toUser = users.find(u => u.id === swap.toUserId);
        
        return `
            <div class="swap-item">
                <div class="swap-header">
                    <div class="swap-user">
                        <div class="swap-user-info">
                            <h3>From: ${fromUser?.name || 'Unknown'}</h3>
                            <h3>To: ${toUser?.name || 'Unknown'}</h3>
                            <p>Status: ${swap.status} | Date: ${swap.date}</p>
                        </div>
                    </div>
                </div>
                <div class="swap-details">
                    ${swap.message ? `<p>${swap.message}</p>` : ''}
                    <div class="swap-skills">
                        <div>
                            <h4>Requested Skills:</h4>
                            <ul>
                                ${swap.requestedSkills.map(skill => `<li>${skill}</li>`).join('')}
                            </ul>
                        </div>
                        <div>
                            <h4>Offered Skills:</h4>
                            <ul>
                                ${swap.offeredSkills.map(skill => `<li>${skill}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Show admin tab
function showAdminTab(tabId) {
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelector(`.admin-tab[data-tab="${tabId}"]`).classList.add('active');
    
    document.querySelectorAll('.admin-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    document.getElementById(`${tabId}Tab`).classList.add('active');
}

// Ban user
function banUser(userId) {
    if (confirm('Are you sure you want to ban this user?')) {
        users = users.filter(u => u.id !== userId);
        showNotification('success', 'User banned successfully');
        loadAdminData();
    }
}

// Prepare feedback form
function prepareFeedback(swapId, userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    document.getElementById('feedbackSwapId').value = swapId;
    document.getElementById('feedbackUserName').textContent = user.name;
    
    // Reset stars
    ratingStars.forEach(star => {
        star.classList.remove('active');
        star.classList.remove('fas');
        star.classList.add('far');
    });
    
    document.getElementById('feedbackRating').value = '0';
    document.getElementById('feedbackComments').value = '';
    
    showModal(feedbackModal);
}

// Set rating
function setRating(rating) {
    ratingStars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active', 'fas');
            star.classList.remove('far');
        } else {
            star.classList.remove('active', 'fas');
            star.classList.add('far');
        }
    });
    
    document.getElementById('feedbackRating').value = rating;
}

// Submit feedback
function submitFeedback(e) {
    e.preventDefault();
    
    const swapId = document.getElementById('feedbackSwapId').value;
    const rating = parseInt(document.getElementById('feedbackRating').value);
    const comments = document.getElementById('feedbackComments').value;
    
    if (rating === 0) {
        showNotification('error', 'Please select a rating');
        return;
    }
    
    // Find the swap
    const swap = swapRequests.find(s => s.id === swapId);
    if (!swap) return;
    
    // Get the other user's ID
    const otherUserId = swap.fromUserId === currentUser.id ? swap.toUserId : swap.fromUserId;
    
    // Add rating to the other user
    const user = users.find(u => u.id === otherUserId);
    if (user) {
        if (!user.ratings) user.ratings = [];
        user.ratings.push({
            fromUserId: currentUser.id,
            rating,
            comments,
            date: new Date().toISOString().split('T')[0]
        });
    }
    
    // Mark swap as rated
    swap.rated = true;
    
    showNotification('success', 'Thank you for your feedback!');
    feedbackModal.classList.remove('active');
    loadSwapsData();
}

// Show notification
function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notificationContainer.appendChild(notification);
    
    // Remove notification after animation
    setTimeout(() => {
        notification.remove();
    }, 3500);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);