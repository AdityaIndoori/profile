// Theme persistence, footer year, and native QR dialog wiring.
// Everything else in the page works with JavaScript disabled.

(function () {
    'use strict';

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
    if (themeToggle) {
        var isLight = readStoredTheme() === 'light';
        document.body.classList.toggle('light-mode', isLight);
        themeToggle.checked = isLight;

        themeToggle.addEventListener('change', function () {
            document.body.classList.toggle('light-mode', themeToggle.checked);
            writeStoredTheme(themeToggle.checked ? 'light' : 'dark');
        });
    }

    var yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    var qrLink = document.getElementById('qr-link');
    var qrModal = document.getElementById('qr-modal');
    if (qrLink && qrModal && typeof qrModal.showModal === 'function') {
        var closeButton = qrModal.querySelector('.close-button');

        qrLink.addEventListener('click', function (e) {
            e.preventDefault();
            qrModal.showModal();
        });

        if (closeButton) {
            closeButton.addEventListener('click', function () {
                qrModal.close();
            });
        }

        // Click on the ::backdrop lands on the dialog element itself, not .modal-content.
        qrModal.addEventListener('click', function (e) {
            if (e.target === qrModal) {
                qrModal.close();
            }
        });
    }
}());
