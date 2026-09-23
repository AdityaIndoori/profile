// Theme persistence, footer year, looping typing animations, progressive
// section reveal, hover/pinned detail toggles, click notifications, and
// native QR/résumé dialog wiring.
//
// Everything on this page is readable and usable with JavaScript disabled:
// details render expanded, sections render visible, and the QR/résumé links
// fall back to their real hrefs.

(function () {
    'use strict';

    // Mark JS as available so CSS can hide expandable detail text (it is
    // shown by default for no-JS visitors) and gate the reveal/typing effects.
    document.documentElement.classList.add('js');

    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function applyMotionState(reduced) {
        document.documentElement.classList.toggle('motion-enabled', !reduced);
    }

    // ------------------------------------------------------------------
    // Theme switch
    // ------------------------------------------------------------------
    function readStoredTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (err) {
            return null; // Storage disabled/blocked (e.g. SecurityError) — fall back silently.
        }
    }

    function writeStoredTheme(value) {
        try {
            localStorage.setItem('theme', value);
        } catch (err) {
            // Ignore — theme still applies for this page view, just isn't persisted.
        }
    }

    var themeToggle = document.getElementById('checkbox');
    var themeLabel = document.getElementById('theme-label');

    function updateThemeLabel(theme) {
        if (themeLabel) {
            themeLabel.textContent = theme === 'light' ? 'Toggle Dark Mode' : 'Toggle Light Mode';
        }
    }

    if (themeToggle) {
        var storedTheme = readStoredTheme() || 'dark'; // Default to dark.
        var isLight = storedTheme === 'light';
        document.body.classList.toggle('light-mode', isLight);
        themeToggle.checked = isLight;
        updateThemeLabel(storedTheme);

        themeToggle.addEventListener('change', function () {
            var newTheme = themeToggle.checked ? 'light' : 'dark';
            document.body.classList.toggle('light-mode', themeToggle.checked);
            writeStoredTheme(newTheme);
            updateThemeLabel(newTheme);
        });
    }

    // ------------------------------------------------------------------
    // Footer year
    // ------------------------------------------------------------------
    var yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // ------------------------------------------------------------------
    // Looping header typing animation — writes only #job-title-typing
    // (aria-hidden); the sr-only static text stays untouched for a11y.
    // ------------------------------------------------------------------
    var jobTitleEl = document.getElementById('job-title-typing');
    var JOB_TITLE_TEXT = 'Software Development Engineer II';
    var JOB_TYPING_SPEED = 150;
    var JOB_DELETING_SPEED = 75;
    var JOB_HOLD_DELAY = 2000;
    var JOB_START_DELAY = 500;
    var jobTitleTimer = null;
    var jobTitleToken = 0;

    function stopJobTitleTyping() {
        if (jobTitleTimer) {
            clearTimeout(jobTitleTimer);
            jobTitleTimer = null;
        }
        jobTitleToken++; // Invalidate any in-flight callback so loops never pile up.
    }

    function showStaticJobTitle() {
        if (jobTitleEl) {
            jobTitleEl.textContent = JOB_TITLE_TEXT;
        }
    }

    function startJobTitleTyping() {
        if (!jobTitleEl) {
            return;
        }
        stopJobTitleTyping();
        var token = jobTitleToken;
        var charIndex = 0;
        var isDeleting = false;

        function tick() {
            if (token !== jobTitleToken) {
                return; // Superseded by a stop/restart — abort quietly.
            }
            jobTitleEl.textContent = JOB_TITLE_TEXT.substring(0, charIndex);
            var delay;
            if (!isDeleting && charIndex < JOB_TITLE_TEXT.length) {
                charIndex++;
                delay = JOB_TYPING_SPEED;
            } else if (isDeleting && charIndex > 0) {
                charIndex--;
                delay = JOB_DELETING_SPEED;
            } else if (!isDeleting && charIndex === JOB_TITLE_TEXT.length) {
                isDeleting = true;
                delay = JOB_HOLD_DELAY;
            } else {
                isDeleting = false;
                delay = JOB_TYPING_SPEED;
            }
            jobTitleTimer = setTimeout(tick, delay);
        }

        jobTitleTimer = setTimeout(tick, JOB_START_DELAY);
    }

    // ------------------------------------------------------------------
    // Looping intro typing animation — writes only #intro-typing
    // (aria-hidden); the sr-only static label and cursor span stay put.
    // ------------------------------------------------------------------
    var introTypingEl = document.getElementById('intro-typing');
    var INTRO_PHRASES = ['Authenticating user...', 'Authorizing access...'];
    var INTRO_TYPING_SPEED = 120;
    var INTRO_DELETING_SPEED = 60;
    var INTRO_HOLD_DELAY = 1500;
    var INTRO_START_DELAY = 500;
    var introTimer = null;
    var introToken = 0;

    function stopIntroTyping() {
        if (introTimer) {
            clearTimeout(introTimer);
            introTimer = null;
        }
        introToken++;
    }

    function showStaticIntro() {
        if (introTypingEl) {
            introTypingEl.textContent = INTRO_PHRASES[0];
        }
    }

    function startIntroTyping() {
        if (!introTypingEl) {
            return;
        }
        stopIntroTyping();
        var token = introToken;
        var phraseIndex = 0;
        var charIndex = 0;
        var isDeleting = false;

        function tick() {
            if (token !== introToken) {
                return;
            }
            var phrase = INTRO_PHRASES[phraseIndex];
            var delay;
            if (!isDeleting) {
                charIndex++;
                introTypingEl.textContent = phrase.substring(0, charIndex);
                if (charIndex === phrase.length) {
                    isDeleting = true;
                    delay = INTRO_HOLD_DELAY;
                } else {
                    delay = INTRO_TYPING_SPEED;
                }
            } else {
                charIndex--;
                introTypingEl.textContent = phrase.substring(0, charIndex);
                if (charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % INTRO_PHRASES.length;
                    delay = INTRO_TYPING_SPEED;
                } else {
                    delay = INTRO_DELETING_SPEED;
                }
            }
            introTimer = setTimeout(tick, delay);
        }

        introTimer = setTimeout(tick, INTRO_START_DELAY);
    }

    function initTypingAnimations(reduced) {
        if (reduced) {
            stopJobTitleTyping();
            showStaticJobTitle();
            stopIntroTyping();
            showStaticIntro();
        } else {
            startJobTitleTyping();
            startIntroTyping();
        }
    }

    // Single shared reduced-motion listener drives both the root class and
    // the typing loops — stop timers going into reduced motion, restore them
    // (once, never piling up) coming back out.
    function onMotionChange(e) {
        applyMotionState(e.matches);
        initTypingAnimations(e.matches);
    }
    if (motionQuery.addEventListener) {
        motionQuery.addEventListener('change', onMotionChange);
    } else if (motionQuery.addListener) {
        motionQuery.addListener(onMotionChange);
    }

    applyMotionState(motionQuery.matches);
    initTypingAnimations(motionQuery.matches);

    // ------------------------------------------------------------------
    // Progressive section reveal
    // ------------------------------------------------------------------
    (function initSectionReveal() {
        var motionEnabled = document.documentElement.classList.contains('motion-enabled');
        if (!motionEnabled || !('IntersectionObserver' in window)) {
            return; // Reduced motion or unsupported: sections stay plainly visible.
        }

        var sections = document.querySelectorAll('main section');
        if (!sections.length) {
            return;
        }

        var isNarrowViewport = window.matchMedia('(max-width: 600px)').matches;
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.classList.remove('reveal-pending');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            // Tall sections on small screens may never reach 10% visibility.
            threshold: isNarrowViewport ? 0 : 0.1
        });

        sections.forEach(function (section) {
            section.classList.add('reveal-pending');
            observer.observe(section);
        });

        // A direct link to a section (e.g. nav anchor, shared URL fragment)
        // should show its target immediately rather than waiting on scroll.
        if (window.location.hash) {
            var target = document.getElementById(window.location.hash.slice(1));
            var targetSection = target ? target.closest('section') : null;
            if (targetSection) {
                targetSection.classList.add('visible');
                targetSection.classList.remove('reveal-pending');
                observer.unobserve(targetSection);
            }
        }
    }());

    // ------------------------------------------------------------------
    // Expandable detail items (Experience bullets, Projects)
    // Hover expands; focus expands; a click on the toggle pins/unpins
    // (persistent expansion for touch); Escape collapses and blocks an
    // immediate hover/focus re-open until the interaction actually changes.
    // ------------------------------------------------------------------
    (function initExpandableItems() {
        var items = document.querySelectorAll('.expandable-item');
        items.forEach(function (item) {
            var toggle = item.querySelector('.detail-toggle');
            if (!toggle) {
                return;
            }

            var state = { hovering: false, focused: false, pinned: false, blocked: false };

            function apply() {
                var expanded = state.pinned || (!state.blocked && (state.hovering || state.focused));
                item.classList.toggle('expanded', expanded);
                toggle.setAttribute('aria-expanded', String(expanded));
            }

            item.addEventListener('pointerenter', function (e) {
                if (e.pointerType !== 'mouse') return;
                state.hovering = true;
                if (!state.focused) state.blocked = false;
                apply();
            });
            item.addEventListener('pointerleave', function (e) {
                if (e.pointerType !== 'mouse') return;
                state.hovering = false;
                if (!state.focused) state.blocked = false;
                apply();
            });
            item.addEventListener('focusin', function () {
                state.focused = true;
                apply();
            });
            item.addEventListener('focusout', function (e) {
                if (item.contains(e.relatedTarget)) {
                    return; // Focus just moved to another focusable node inside the same item.
                }
                state.focused = false;
                state.blocked = false;
                apply();
            });
            item.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' || e.key === 'Esc') {
                    state.pinned = false;
                    state.blocked = true;
                    apply();
                }
            });

            toggle.addEventListener('click', function () {
                state.pinned = !state.pinned;
                state.blocked = !state.pinned;
                apply();
            });
        });
    }());

    // ------------------------------------------------------------------
    // Click notifications
    // ------------------------------------------------------------------
    var notificationArea = document.getElementById('notification-area');

    function isLinkClick(e) {
        return !!(e.target && e.target.closest && e.target.closest('a'));
    }

    // Strips decorative icon spans (aria-hidden) out of a button's text so
    // notification messages read the same as the visible label without the emoji glyph.
    function cleanText(el) {
        var clone = el.cloneNode(true);
        clone.querySelectorAll('.icon').forEach(function (icon) {
            icon.remove();
        });
        return clone.textContent.trim();
    }

    function showNotification(message) {
        if (!notificationArea) {
            return;
        }
        var notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;

        var positions = [
            { bottom: '20px', right: '20px', transform: 'translateX(110%)' }, // Bottom Right
            { bottom: '20px', left: '20px', transform: 'translateX(-110%)' }, // Bottom Left
            { top: '80px', right: '20px', transform: 'translateX(110%)' },    // Top Right (avoid header)
            { top: '80px', left: '20px', transform: 'translateX(-110%)' }     // Top Left (avoid header)
        ];
        var positionIndex = notificationArea.children.length % positions.length;
        var position = positions[positionIndex];

        notification.style.position = 'fixed';
        Object.keys(position).forEach(function (key) {
            if (key !== 'transform') {
                notification.style[key] = position[key];
            }
        });
        notification.style.transform = position.transform;

        notificationArea.appendChild(notification);

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                notification.style.transform = 'translateX(0) translateY(0)';
                notification.classList.add('show');
            });
        });

        var removed = false;
        function remove() {
            if (removed) {
                return;
            }
            removed = true;
            notification.remove();
        }

        setTimeout(function () {
            notification.style.transform = position.transform;
            notification.classList.remove('show');
            notification.addEventListener('transitionend', remove, { once: true });
            // Reduced motion (or any environment without a transition) never
            // fires transitionend — guarantee cleanup regardless.
            setTimeout(remove, 600);
        }, 3500);
    }

    document.querySelectorAll('.skill-notify').forEach(function (btn) {
        btn.classList.add('interactive-item');
        btn.addEventListener('click', function (e) {
            if (isLinkClick(e)) {
                return;
            }
            showNotification('🔧 Skill: ' + btn.textContent.trim());
        });
    });

    document.querySelectorAll('#achievements li').forEach(function (item) {
        item.classList.add('interactive-item');
        item.addEventListener('click', function (e) {
            if (isLinkClick(e)) return;
            showNotification('🏆 Achievement Unlocked: "' + item.textContent.trim().substring(0, 40) + '..."');
        });
    });

    function wireInteractiveTitles(sectionSelector, icon, formatMessage) {
        document.querySelectorAll(sectionSelector + ' .interactive-title').forEach(function (btn) {
            btn.classList.add('interactive-item');
            btn.addEventListener('click', function (e) {
                if (isLinkClick(e)) {
                    return;
                }
                showNotification(icon + ' ' + formatMessage(cleanText(btn)));
            });
        });
    }

    wireInteractiveTitles('#experience', '🏢', function (text) {
        return 'Experience: ' + text.split('|')[0].trim();
    });
    wireInteractiveTitles('#projects', '💡', function (text) {
        return 'Project: ' + text;
    });
    wireInteractiveTitles('#education', '🎓', function (text) {
        return 'Education: ' + text;
    });

    // ------------------------------------------------------------------
    // Native QR / résumé dialogs
    // ------------------------------------------------------------------
    function initModal(linkId, dialogId) {
        var link = document.getElementById(linkId);
        var dialog = document.getElementById(dialogId);
        if (!link || !dialog || typeof dialog.showModal !== 'function') {
            return; // Unsupported: leave the link's real href as the fallback.
        }

        var closeButton = dialog.querySelector('.close-button');
        var lastFocused = null;

        link.addEventListener('click', function (e) {
            e.preventDefault();
            lastFocused = document.activeElement;
            dialog.showModal();
        });

        if (closeButton) {
            closeButton.addEventListener('click', function () {
                dialog.close();
            });
        }

        // A click on the ::backdrop lands on the dialog element itself, not .modal-content.
        dialog.addEventListener('click', function (e) {
            if (e.target === dialog) {
                dialog.close();
            }
        });

        // Fires on every close path (close button, backdrop click, native Escape/cancel).
        dialog.addEventListener('close', function () {
            if (lastFocused && typeof lastFocused.focus === 'function') {
                lastFocused.focus();
            }
        });
    }

    initModal('qr-link', 'qr-modal');
    initModal('resume-link', 'resume-modal');
}());
