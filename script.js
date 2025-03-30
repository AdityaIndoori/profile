document.addEventListener('DOMContentLoaded', () => {
    console.log('Interactive profile loaded!');

    // --- Theme Switch Logic ---
    const themeToggle = document.getElementById('checkbox');
    const themeToggleLabel = document.querySelector('.theme-switch-wrapper span'); // Get the label span
    const currentTheme = localStorage.getItem('theme') || 'dark'; // Default to dark (Synthwave)

    // Function to update toggle label
    function updateToggleLabel(theme) {
        themeToggleLabel.textContent = theme === 'light' ? 'Toggle Dark Mode' : 'Toggle Light Mode';
    }

    // Apply saved theme on load. Default is dark (Synthwave).
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode'); // Use light-mode class now
        themeToggle.checked = true; // Checked means light mode is ON
        updateToggleLabel('light'); // Update label on load
    } else {
        // Default state is dark mode (Synthwave), no class needed initially
        themeToggle.checked = false; // Unchecked means dark mode (Synthwave) is ON
        updateToggleLabel('dark'); // Update label on load
    }

    // Listener for theme toggle
    themeToggle.addEventListener('change', function() {
        let newTheme;
        if (this.checked) { // If checked, switch to light mode
            document.body.classList.add('light-mode');
            newTheme = 'light';
            localStorage.setItem('theme', newTheme);
        } else { // If unchecked, switch to dark mode (Synthwave)
            document.body.classList.remove('light-mode');
            newTheme = 'dark';
            localStorage.setItem('theme', newTheme);
        }
        updateToggleLabel(newTheme); // Update label text
    });

    // --- Typing Animation Logic ---
    const typingElement = document.getElementById('job-title-typing');
    const textToType = "Software Development Engineer";
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 150; // Milliseconds per character
    const deletingSpeed = 75;
    const delayBeforeDelete = 2000; // Wait 2s before deleting

    function typeEffect() {
        const currentText = textToType.substring(0, charIndex);
        typingElement.textContent = currentText;

        if (!isDeleting && charIndex < textToType.length) {
            // Typing forward
            charIndex++;
            setTimeout(typeEffect, typingSpeed);
        } else if (isDeleting && charIndex > 0) {
            // Deleting
            charIndex--;
            setTimeout(typeEffect, deletingSpeed);
        } else if (!isDeleting && charIndex === textToType.length) {
            // Finished typing, wait before deleting
            isDeleting = true;
            setTimeout(typeEffect, delayBeforeDelete);
        } else if (isDeleting && charIndex === 0) {
            // Finished deleting, start typing again
            isDeleting = false;
            setTimeout(typeEffect, typingSpeed);
        }
    }
    // Start the typing effect after a short delay
    setTimeout(typeEffect, 500);


    // --- Scroll Animation Logic ---
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.1 // trigger when 10% of the section is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing the element once it's visible
                // observer.unobserve(entry.target);
            } else {
                // Optional: Remove class if you want animation to repeat when scrolling out/in
                // entry.target.classList.remove('visible');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // --- Skill Tag Interaction (Placeholder Removed) ---
    const skillTags = document.querySelectorAll('.skill-category li');
    skillTags.forEach(tag => {
        // Removed alert on click. Interaction can be added later.
        // Example: Add a class on click
        // tag.addEventListener('click', () => {
        //     tag.classList.toggle('selected-skill');
        // });
    });

    // --- Achievement Notification Logic ---
    const achievementItems = document.querySelectorAll('#achievements li');
    const notificationArea = document.getElementById('notification-area');

    achievementItems.forEach(item => {
        item.style.cursor = 'pointer'; // Make it clear it's clickable
        item.classList.add('interactive-item'); // Add hover effect class if not already applied by other means
        item.addEventListener('click', () => {
            // Use a slightly more engaging message
            showNotification(`🏆 Achievement Unlocked: "${item.textContent.substring(0, 40)}..."`);
        });
    });

    // --- Modified Notification Logic ---
    // const notificationArea = document.getElementById('notification-area'); // REMOVED DUPLICATE DECLARATION

    // Function to show notification at random positions
    function showNotification(message, type = 'info') { // Added type for potential styling later
        const notification = document.createElement('div');
        notification.classList.add('notification');
        // Add type class if needed: notification.classList.add(`notification-${type}`);
        notification.textContent = message;

        // --- Random Position Logic ---
        const positions = [
            { bottom: '20px', right: '20px', transform: 'translateX(110%)' }, // Bottom Right
            { bottom: '20px', left: '20px', transform: 'translateX(-110%)' }, // Bottom Left
            { top: '80px', right: '20px', transform: 'translateX(110%)' },    // Top Right (avoid header)
            { top: '80px', left: '20px', transform: 'translateX(-110%)' }     // Top Left (avoid header)
        ];
        // Avoid placing multiple notifications in the exact same spot simultaneously
        const existingNotifications = notificationArea.children.length;
        const positionIndex = existingNotifications % positions.length; // Cycle through positions
        const randomPosition = positions[positionIndex];

        // Apply position styles
        notification.style.position = 'fixed';
        Object.keys(randomPosition).forEach(key => {
            if (key !== 'transform') {
                 notification.style[key] = randomPosition[key];
            }
        });
        notification.style.transform = randomPosition.transform; // Set initial transform for slide-in

        notificationArea.appendChild(notification);

        // Trigger the animation (slide in to transform: translateX(0))
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                notification.style.transform = 'translateX(0) translateY(0)'; // Final visible position
                notification.classList.add('show'); // Controls opacity
            });
        });

        // Remove the notification after a few seconds
        setTimeout(() => {
            notification.style.transform = randomPosition.transform; // Slide back out
            notification.classList.remove('show'); // Fade out
            // Remove the element from DOM after transition ends
            notification.addEventListener('transitionend', () => {
                notification.remove();
            }, { once: true });
        }, 3500); // Display for 3.5 seconds
    }

    // --- Add Click Listeners for Notifications ---

    // Skills (already selected)
    skillTags.forEach(tag => {
        tag.style.cursor = 'pointer'; // Ensure cursor indicates clickability
        tag.classList.add('interactive-item');
        tag.addEventListener('click', () => {
            showNotification(`🔧 Skill: ${tag.textContent}`);
        });
    });

    // Experience Titles
    const experienceTitles = document.querySelectorAll('#experience .interactive-title');
    experienceTitles.forEach(title => {
        title.style.cursor = 'pointer';
        title.classList.add('interactive-item');
        title.addEventListener('click', () => {
            showNotification(`🏢 Experience: ${title.textContent.split('|')[0].trim()}`);
        });
    });

    // Project Titles (already selected)
    const projectTitles = document.querySelectorAll('#projects .interactive-title'); // Ensure correct selector
    projectTitles.forEach(title => {
        title.style.cursor = 'pointer';
        title.classList.add('interactive-item');
         title.addEventListener('click', () => {
            showNotification(`💡 Project: ${title.textContent}`);
        });
    });

    // Education Titles
    const educationTitles = document.querySelectorAll('#education .interactive-title');
    educationTitles.forEach(title => {
        title.style.cursor = 'pointer';
        title.classList.add('interactive-item');
         title.addEventListener('click', () => {
            showNotification(`🎓 Education: ${title.textContent}`);
        });
    });

    // --- Looping Intro Heading Typing Animation ---
    const introHeadingElement = document.querySelector('.intro-heading');
    const introPhrases = ["Authenticating user...", "Authorizing access..."];
    let introPhraseIndex = 0;
    let introCharIndex = 0;
    let introIsDeleting = false;
    const introTypingSpeed = 120; // Faster typing
    const introDeletingSpeed = 60; // Faster deleting
    const delayBetweenPhrases = 1500; // Wait 1.5s

    function createCursorSpan() {
        const cursorSpan = document.createElement('span');
        cursorSpan.classList.add('typing-cursor');
        return cursorSpan;
    }

    let cursorSpan = createCursorSpan(); // Create initial cursor

    function typeIntroHeading() {
        const currentPhrase = introPhrases[introPhraseIndex];
        let textToShow = '';

        // Remove cursor before updating text
        if (introHeadingElement.contains(cursorSpan)) {
            introHeadingElement.removeChild(cursorSpan);
        }

        if (!introIsDeleting) {
            // Typing forward
            textToShow = currentPhrase.substring(0, introCharIndex + 1);
            introHeadingElement.textContent = textToShow;
            introCharIndex++;
        } else {
            // Deleting
            textToShow = currentPhrase.substring(0, introCharIndex);
            introHeadingElement.textContent = textToShow;
            introCharIndex--;
        }

        // Add cursor back after updating text
        introHeadingElement.appendChild(cursorSpan);

        let timeOut = introIsDeleting ? introDeletingSpeed : introTypingSpeed;

        if (!introIsDeleting && introCharIndex === currentPhrase.length) {
            // Finished typing current phrase
            introIsDeleting = true;
            timeOut = delayBetweenPhrases; // Wait before deleting
        } else if (introIsDeleting && introCharIndex === 0) {
            // Finished deleting current phrase
            introIsDeleting = false;
            introPhraseIndex = (introPhraseIndex + 1) % introPhrases.length; // Move to next phrase
            timeOut = introTypingSpeed; // Start typing next phrase immediately
        }

        setTimeout(typeIntroHeading, timeOut);
    }

    // Start the intro heading typing effect if the element exists
    if (introHeadingElement) {
         // Ensure the element is empty initially and add the cursor
         introHeadingElement.textContent = '';
         introHeadingElement.appendChild(cursorSpan);
         setTimeout(typeIntroHeading, 500); // Start after a short delay
    }

});
