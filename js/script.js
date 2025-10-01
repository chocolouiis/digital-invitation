document.addEventListener('DOMContentLoaded', () => {
    // ... (existing DOM elements and page transition logic) ...

    const starsContainer = document.querySelector('.stars-container');

    let allInvitationData = []; // To store all invitations from data.json

    // --- Page Transition Logic ---
    function showPage(pageToShow) {
        const pages = [loadingPage, codeInputPage, invitationPage];
        pages.forEach(page => {
            if (page === pageToShow) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });
    }

    // --- Star Animation (Twinkle & Fall) ---
    // (No changes here, remains the same)
    const NUM_STARS_TWINKLE = 30;
    const NUM_STARS_FALL = 5;

    function createStar(type) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        if (type === 'twinkle') {
            star.style.animation = `star-twinkle ${Math.random() * 3 + 2}s infinite ease-in-out alternate`;
            star.style.animationDelay = `${Math.random() * 2}s`;
        } else if (type === 'fall') {
            star.classList.add('falling-star');
            star.style.animation = `star-fall ${Math.random() * 5 + 3}s linear forwards`;
            star.style.animationDelay = `${Math.random() * 10}s`;
            star.addEventListener('animationend', () => {
                star.remove();
                setTimeout(() => createStar('fall'), Math.random() * 10000 + 5000);
            });
        }
        starsContainer.appendChild(star);
    }

    function initStars() {
        for (let i = 0; i < NUM_STARS_TWINKLE; i++) {
            createStar('twinkle');
        }
        for (let i = 0; i < NUM_STARS_FALL; i++) {
            setTimeout(() => createStar('fall'), Math.random() * 5000);
        }
    }


    // --- Data Loading (Frontend-only) ---
    async function loadAllInvitationData() {
        try {
            const response = await fetch('data.json'); // Fetch data.json directly
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            allInvitationData = data.invitations; // Store all invitations
            console.log('All invitation data loaded:', allInvitationData);
        } catch (error) {
            console.error('Failed to load invitation data from data.json:', error);
            errorMessage.textContent = 'Error loading data. Please try again later.';
            errorMessage.classList.add('visible');
            // Potentially show an error page or retry option
        }
    }

    // --- Input Validation & Display Invitation ---
    submitCodeBtn.addEventListener('click', () => {
        handleCodeSubmission();
    });

    codeInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleCodeSubmission();
        }
    });

    async function handleCodeSubmission() {
        const inputCode = codeInput.value.trim();
        errorMessage.classList.remove('visible');

        if (!inputCode) {
            errorMessage.textContent = 'Please enter a code.';
            errorMessage.classList.add('visible');
            return;
        }

        // Find invitation directly from loaded data
        const foundInvitation = allInvitationData.find(inv => inv.code === inputCode);

        if (foundInvitation) {
            displayInvitation(foundInvitation);
            showPage(invitationPage);
            codeInput.value = ''; // Clear input
        } else {
            errorMessage.textContent = 'Invalid code. Please try again.';
            errorMessage.classList.add('visible');
            codeInput.value = ''; // Clear input
            codeInput.focus(); // Focus back to input
        }
    }

    function displayInvitation(invitation) {
        // ... (No changes here, remains the same) ...
        if (invitation.gender === 'male') {
            teacherGenderSpan.textContent = 'ဆရာ';
        } else if (invitation.gender === 'female') {
            teacherGenderSpan.textContent = 'ဆရာမ';
        } else {
            teacherGenderSpan.textContent = '';
        }
        teacherNameSpan.textContent = invitation.teacherName;

        detailDateSpan.textContent = invitation.additionalInfo.date;
        detailTimeSpan.textContent = invitation.additionalInfo.time;
        detailIdSpan.textContent = invitation.additionalInfo.id;
        detailPasscodeSpan.textContent = invitation.zoomPasscode;
    }

    // --- Initial Setup ---
    async function initializeApp() {
        initStars(); // Start star animations immediately

        showPage(loadingPage); // Start with loading page

        await loadAllInvitationData(); // Load all data from data.json directly

        // After loading (e.g., 2-3 seconds), transition to code input page
        setTimeout(() => {
            showPage(codeInputPage);
        }, 3000); // Adjust loading time as needed
    }

    initializeApp(); // Run the initialization
});