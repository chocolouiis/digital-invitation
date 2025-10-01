document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements (Get all elements at once when DOM is ready) ---
    const loadingPage = document.getElementById('loading-page');
    const codeInputPage = document.getElementById('code-input-page');
    const invitationPage = document.getElementById('invitation-page');

    const codeInput = document.getElementById('code-input');
    const submitCodeBtn = document.getElementById('submit-code-btn');
    const errorMessage = document.getElementById('error-message');

    const teacherGenderSpan = document.getElementById('teacher-gender');
    const teacherNameSpan = document.getElementById('teacher-name');
    const detailDateSpan = document.getElementById('detail-date');
    const detailTimeSpan = document.getElementById('detail-time');
    const detailIdSpan = document.getElementById('detail-id');
    const detailPasscodeSpan = document.getElementById('detail-passcode');

    const starsContainer = document.querySelector('.stars-container');

    let allInvitationData = []; // To store all invitations loaded from data.json

    // --- Page Transition Logic ---
    /**
     * Shows a specific page and hides others.
     * @param {HTMLElement} pageToShow The page element to display.
     */
    function showPage(pageToShow) {
        const pages = [loadingPage, codeInputPage, invitationPage];
        pages.forEach(page => {
            if (page === pageToShow) {
                page.classList.add('active'); // Activate the selected page
            } else {
                page.classList.remove('active'); // Deactivate other pages
            }
        });
    }

    // --- Star Animation (Twinkle & Fall) ---
    const NUM_STARS_TWINKLE = 30; // Number of twinkling stars
    const NUM_STARS_FALL = 5;    // Number of falling stars (less frequent)

    /**
     * Creates and appends a star element to the stars container.
     * @param {'twinkle' | 'fall'} type The type of star animation.
     */
    function createStar(type) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random position within the viewport
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;

        // Random size for the star
        const size = Math.random() * 3 + 1; // 1px to 4px
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        if (type === 'twinkle') {
            star.style.animation = `star-twinkle ${Math.random() * 3 + 2}s infinite ease-in-out alternate`;
            star.style.animationDelay = `${Math.random() * 2}s`; // Stagger delays for twinkling
        } else if (type === 'fall') {
            star.classList.add('falling-star');
            star.style.animation = `star-fall ${Math.random() * 5 + 3}s linear forwards`; // `forwards` to stay at end state (removed by JS)
            star.style.animationDelay = `${Math.random() * 10}s`; // Stagger delays for falling stars
            star.style.transform = `translateX(-50%)`; // For proper animation origin

            // Remove falling star after animation and re-create for continuous effect
            star.addEventListener('animationend', () => {
                star.remove();
                // Re-add a new falling star after a random delay
                setTimeout(() => createStar('fall'), Math.random() * 10000 + 5000); // 5-15s delay
            });
        }
        starsContainer.appendChild(star);
    }

    /** Initializes both twinkling and falling stars. */
    function initStars() {
        // Create twinkling stars
        for (let i = 0; i < NUM_STARS_TWINKLE; i++) {
            createStar('twinkle');
        }
        // Create initial falling stars with staggered delays
        for (let i = 0; i < NUM_STARS_FALL; i++) {
            setTimeout(() => createStar('fall'), Math.random() * 5000); // 0-5s initial stagger
        }
    }

    // --- Data Loading (Frontend-only for GitHub Pages) ---
    /**
     * Loads all invitation data directly from data.json file.
     * @returns {Promise<void>} A promise that resolves when data is loaded.
     */
    async function loadAllInvitationData() {
        try {
            const response = await fetch('data.json'); // Fetch data.json directly
            if (!response.ok) {
                // Throw an error if the network response was not ok
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            allInvitationData = data.invitations; // Store all invitations in the global array
            console.log('All invitation data loaded successfully:', allInvitationData);
        } catch (error) {
            console.error('Failed to load invitation data from data.json:', error);
            errorMessage.textContent = 'Error loading data. Please try again later.';
            errorMessage.classList.add('visible');
            // In a real app, you might want to show a retry button or a more robust error screen.
        }
    }

    // --- Input Validation & Display Invitation ---
    // Event listener for the submit button click
    submitCodeBtn.addEventListener('click', () => {
        handleCodeSubmission();
    });

    // Event listener for 'Enter' key press on the input field
    codeInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleCodeSubmission();
        }
    });

    /** Handles the submission of the invitation code. */
    async function handleCodeSubmission() {
        const inputCode = codeInput.value.trim();
        errorMessage.classList.remove('visible'); // Hide any previous error message

        if (!inputCode) {
            errorMessage.textContent = 'Please enter a code.';
            errorMessage.classList.add('visible');
            return; // Stop if input is empty
        }

        // Find the invitation directly from the pre-loaded data
        const foundInvitation = allInvitationData.find(inv => inv.code === inputCode);

        if (foundInvitation) {
            displayInvitation(foundInvitation); // Populate invitation details
            showPage(invitationPage); // Transition to the invitation page
            codeInput.value = ''; // Clear the input field
        } else {
            errorMessage.textContent = 'Invalid code. Please try again.';
            errorMessage.classList.add('visible'); // Show error message
            codeInput.value = ''; // Clear the input field
            codeInput.focus(); // Focus back to the input for easy retry
        }
    }

    /**
     * Populates the invitation page with details from the provided invitation object.
     * @param {object} invitation The invitation data object.
     */
    function displayInvitation(invitation) {
        // Set teacher gender and name based on the data
        if (invitation.gender === 'male') {
            teacherGenderSpan.textContent = 'ဆရာ';
        } else if (invitation.gender === 'female') {
            teacherGenderSpan.textContent = 'ဆရာမ';
        } else {
            teacherGenderSpan.textContent = ''; // Default or handle other cases if needed
        }
        teacherNameSpan.textContent = invitation.teacherName;

        // Set additional details
        detailDateSpan.textContent = invitation.additionalInfo.date;
        detailTimeSpan.textContent = invitation.additionalInfo.time;
        detailIdSpan.textContent = invitation.additionalInfo.id;
        detailPasscodeSpan.textContent = invitation.zoomPasscode;
    }

    // --- Initialization Function ---
    /**
     * Initializes the application: starts animations, loads data, and manages page transitions.
     */
    async function initializeApp() {
        initStars(); // Start star animations immediately

        showPage(loadingPage); // Start by showing the loading page

        await loadAllInvitationData(); // Asynchronously load all invitation data

        // After loading is complete (or after a fixed delay), transition to the code input page
        setTimeout(() => {
            showPage(codeInputPage);
        }, 3000); // 3-second delay for loading page (can be adjusted)
    }

    // Run the initialization function when the script loads
    initializeApp();
});
