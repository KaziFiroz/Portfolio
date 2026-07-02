
document.addEventListener('DOMContentLoaded', function () {

    (function initReveal() {
        const items = document.querySelectorAll('.reveal');
        if (!items.length || !('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );

        items.forEach((el) => {
            const rect = el.getBoundingClientRect();
            const alreadyInView = rect.top < window.innerHeight && rect.bottom > 0;
            if (!alreadyInView) {
                el.classList.add('pre-reveal');
                observer.observe(el);
            }
        });
    })();

    // ----------------------------------------------------------------
    // 2. Navigation
    // ----------------------------------------------------------------
    (function initNav() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        const sections = document.querySelectorAll('main section[id]');
        const backToTop = document.querySelector('.back-to-top');

        // Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                const isOpen = navMenu.classList.toggle('is-open');
                navToggle.setAttribute('aria-expanded', String(isOpen));
            });

            navMenu.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    navMenu.classList.remove('is-open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // Smooth scroll for in-page anchors (ignores bare "#" placeholders)
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (!href || href.length < 2) return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    history.replaceState(null, '', href);
                }
            });
        });

        // Scroll-spy: highlight the nav link for the section in view
        if (sections.length && navLinks.length) {
            const spy = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const id = entry.target.getAttribute('id');
                            navLinks.forEach((link) => {
                                const matches = link.getAttribute('href') === `#${id}`;
                                link.classList.toggle('active', matches);
                                if (matches) {
                                    link.setAttribute('aria-current', 'page');
                                } else {
                                    link.removeAttribute('aria-current');
                                }
                            });
                        }
                    });
                },
                { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
            );
            sections.forEach((section) => spy.observe(section));
        }

        // Back-to-top button
        if (backToTop) {
            const toggleBackToTop = () => {
                backToTop.classList.toggle('is-visible', window.scrollY > 600);
            };
            window.addEventListener('scroll', toggleBackToTop, { passive: true });
            toggleBackToTop();
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    })();

    // ----------------------------------------------------------------
    // 3. Skills: tab switching + dot-rating reveal animation
    // ----------------------------------------------------------------
    (function initSkills() {
        const tabs = document.querySelectorAll('.skills-tab');
        const panels = document.querySelectorAll('.skills-panel');
        const cards = document.querySelectorAll('.skill-card');

        // Reveal dot ratings for cards already in the initially-active panel
        function revealCardsIn(panel) {
            panel.querySelectorAll('.skill-card').forEach((card) => {
                card.classList.add('is-visible');
            });
        }

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const targetId = tab.dataset.target;

                tabs.forEach((t) => {
                    t.classList.toggle('is-active', t === tab);
                    t.setAttribute('aria-selected', String(t === tab));
                });

                panels.forEach((panel) => {
                    const isTarget = panel.id === targetId;
                    panel.classList.toggle('is-active', isTarget);

                    if (isTarget) revealCardsIn(panel);
                });
            });
        });

        // Animate the initially-visible panel's cards in on scroll
        if (cards.length && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-visible');
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.3 }
            );
            cards.forEach((card) => observer.observe(card));
        } else {
            cards.forEach((card) => card.classList.add('is-visible'));
        }
    })();

    // ----------------------------------------------------------------
    // 4. Contact form: validation + submission
    // ----------------------------------------------------------------
    (function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const fields = {
            name: { input: document.getElementById('name'), error: document.getElementById('name-error'), validate: validateName },
            email: { input: document.getElementById('email'), error: document.getElementById('email-error'), validate: validateEmail },
            subject: { input: document.getElementById('subject'), error: document.getElementById('subject-error'), validate: validateSubject },
            message: { input: document.getElementById('message'), error: document.getElementById('message-error'), validate: validateMessage },
        };

        const submitBtn = document.getElementById('submitBtn');
        const submitBtnText = submitBtn.querySelector('.btn-text');
        const statusBox = document.getElementById('form-status');

        function validateName(value) {
            if (value.trim() === '') return 'Name is required';
            if (value.trim().length < 2) return 'Name must be at least 2 characters';
            return '';
        }

        function validateEmail(value) {
            if (value.trim() === '') return 'Email is required';
            const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!pattern.test(value)) return 'Please enter a valid email address';
            return '';
        }

        function validateSubject(value) {
            if (value.trim() === '') return 'Subject is required';
            if (value.trim().length < 3) return 'Subject must be at least 3 characters';
            return '';
        }

        function validateMessage(value) {
            if (value.trim() === '') return 'Message is required';
            if (value.trim().length < 10) return 'Message must be at least 10 characters';
            return '';
        }

        function showError(field, message) {
            field.error.textContent = message;
            field.input.classList.add('has-error');
        }

        function clearError(field) {
            field.error.textContent = '';
            field.input.classList.remove('has-error');
        }

        function setStatus(kind, message) {
            statusBox.className = 'form-status is-visible is-' + kind;
            statusBox.textContent = message;
        }

        function clearStatus() {
            statusBox.className = 'form-status';
            statusBox.textContent = '';
        }

        Object.values(fields).forEach((field) => {
            field.input.addEventListener('blur', () => {
                const message = field.validate(field.input.value);
                message ? showError(field, message) : clearError(field);
            });

            field.input.addEventListener('input', () => {
                if (field.input.classList.contains('has-error')) {
                    const message = field.validate(field.input.value);
                    if (!message) clearError(field);
                }
            });
        });

        [fields.name.input, fields.email.input, fields.subject.input].forEach((input) => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') e.preventDefault();
            });
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            clearStatus();

            let hasError = false;
            Object.values(fields).forEach((field) => {
                const message = field.validate(field.input.value);
                if (message) {
                    showError(field, message);
                    hasError = true;
                } else {
                    clearError(field);
                }
            });

            if (hasError) return;

            submitBtn.disabled = true;
            submitBtnText.textContent = 'Sending...';

            fetch(form.action, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: new FormData(form),
            })
                .then((response) => {
                    if (response.ok) {
                        setStatus('success', "Message sent — thanks for reaching out! I'll get back to you soon.");
                        form.reset();
                    } else {
                        setStatus('error', 'Something went wrong sending your message. Please try again or email me directly.');
                    }
                })
                .catch(() => {
                    setStatus('error', 'Network error — please check your connection and try again.');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtnText.textContent = 'Send Message';
                });
        });
    })();

});
