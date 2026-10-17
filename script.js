/* ========================================
   1. ELEMENTS
======================================== */

const languageBtn = document.getElementById("languageBtn");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navbar = document.getElementById("navbar");
const backToTop = document.getElementById("backToTop");

const changingText = document.getElementById("changingText");

const musicBtn = document.getElementById("musicBtn");
const musicIcon = document.getElementById("musicIcon");
const musicText = document.getElementById("musicText");
const backgroundMusic = document.getElementById("backgroundMusic");

const pageLoader = document.getElementById("pageLoader");
const loaderProgress = document.getElementById("loaderProgress");
const loaderPercentage = document.getElementById("loaderPercentage");
const loaderStatus = document.getElementById("loaderStatus");


/* ========================================
   2. LANGUAGE
======================================== */

let currentLanguage = localStorage.getItem("language") || "ar";

if (currentLanguage !== "ar" && currentLanguage !== "en") {
    currentLanguage = "ar";
}


/* ========================================
   3. TYPING ANIMATION
======================================== */

const phrases = {
    ar: [
        "مطور ويب",
        "مهتم بتطوير البرمجيات",
        "شغوف بالتعلم المستمر"
    ],

    en: [
        "Web Developer",
        "Interested in Software Development",
        "Passionate About Learning"
    ]
};

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimeout;

function typePhrase() {
    if (!changingText) return;

    const currentPhrases = phrases[currentLanguage];
    const currentPhrase = currentPhrases[phraseIndex];

    if (isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    changingText.textContent = currentPhrase.substring(0, charIndex);

    let typingSpeed = isDeleting ? 40 : 90;

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 1800;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;

        phraseIndex = (phraseIndex + 1) % currentPhrases.length;

        typingSpeed = 350;
    }

    typingTimeout = setTimeout(typePhrase, typingSpeed);
}

function restartTyping() {
    clearTimeout(typingTimeout);

    phraseIndex = 0;
    charIndex = 0;
    isDeleting = false;

    if (changingText) {
        changingText.textContent = "";
    }

    typePhrase();
}


/* ========================================
   4. SKILLS DIRECTION
======================================== */

function updateSkillDirection() {
    document.querySelectorAll(".skill-info").forEach(element => {
        element.style.direction = "ltr";
        element.style.display = "flex";
        element.style.justifyContent = "space-between";
        element.style.flexDirection =
            currentLanguage === "ar" ? "row-reverse" : "row";
    });
}




/* ========================================
   5. MUSIC PLAYER
======================================== */

const musicLabels = {
    ar: {
        play: "🎵",
        pause: "🎵",
        error: "تعذر تشغيل الموسيقى"
    },

    en: {
        play: "Play Music",
        pause: "Pause Music",
        error: "Unable to play music"
    }
};

function updateMusicButton() {
    if (!musicBtn || !musicIcon || !musicText) return;

    const labels = musicLabels[currentLanguage];

    if (backgroundMusic && !backgroundMusic.paused) {
        musicIcon.className = "fa-solid fa-pause";
        musicText.textContent = labels.pause;
        musicBtn.setAttribute("aria-pressed", "true");
    } else {
        musicIcon.className = "fa-solid fa-play";
        musicText.textContent = labels.play;
        musicBtn.setAttribute("aria-pressed", "false");
    }
}

if (backgroundMusic) {
    backgroundMusic.volume = 0.35;
}

if (musicBtn && backgroundMusic) {
    musicBtn.addEventListener("click", async () => {
        if (backgroundMusic.paused) {
            try {
                await backgroundMusic.play();
                updateMusicButton();
            } catch (error) {
                musicText.textContent =
                    musicLabels[currentLanguage].error;

                console.error("Music playback error:", error);
            }
        } else {
            backgroundMusic.pause();
            updateMusicButton();
        }
    });

    backgroundMusic.addEventListener("play", updateMusicButton);
    backgroundMusic.addEventListener("pause", updateMusicButton);
    backgroundMusic.addEventListener("ended", updateMusicButton);
}


/* ========================================
   6. UPDATE WEBSITE LANGUAGE
======================================== */

function updateLanguage() {
    document.documentElement.lang = currentLanguage;

    document.documentElement.dir =
        currentLanguage === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-ar][data-en]").forEach(element => {
        element.textContent = element.getAttribute(
            `data-${currentLanguage}`
        );
    });

    if (languageBtn) {
        languageBtn.textContent =
            currentLanguage === "ar" ? "EN" : "AR";
    }

    localStorage.setItem("language", currentLanguage);

    updateSkillDirection();
    updateMusicButton();
    updateLoaderLanguage();
    restartTyping();
}

if (languageBtn) {
    languageBtn.addEventListener("click", () => {
        currentLanguage = currentLanguage === "ar" ? "en" : "ar";

        updateLanguage();
    });
}


/* ========================================
   7. MOBILE NAVIGATION
======================================== */

function closeMenu() {
    if (!navMenu || !menuToggle) return;

    navMenu.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");

    const icon = menuToggle.querySelector("i");

    if (icon) {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }
}

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", event => {
        event.stopPropagation();

        const isOpen = navMenu.classList.toggle("active");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-bars", !isOpen);
            icon.classList.toggle("fa-xmark", isOpen);
        }
    });

    navMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", event => {
        if (
            !navMenu.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });
}


/* ========================================
   8. NAVBAR & BACK TO TOP
======================================== */

function handleScroll() {
    const scrollPosition = window.scrollY;

    if (navbar) {
        navbar.classList.toggle(
            "scrolled",
            scrollPosition > 40
        );
    }

    if (backToTop) {
        backToTop.classList.toggle(
            "show",
            scrollPosition > 500
        );
    }
}

window.addEventListener("scroll", handleScroll);

handleScroll();

if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


/* ========================================
   9. SCROLL REVEAL
======================================== */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");

                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach(element => {
        element.classList.add("visible");
    });
}


/* ========================================
   10. SKILL BARS & PERCENTAGES
======================================== */

const skillElements = document.querySelectorAll(".skill");

function animateSkill(skill) {
    const fill = skill.querySelector(".skill-fill");
    const percent = skill.querySelector(".skill-percent");

    if (!fill) return;

    const rawProgress = Number(fill.dataset.progress);

    const progress = Number.isFinite(rawProgress)
        ? Math.min(100, Math.max(0, rawProgress))
        : 0;

    // Start the skill bar from zero.
    fill.style.width = "0%";

    // Start the percentage counter from zero.
    if (percent) {
        percent.textContent = "0%";
    }

    // Animate the bar.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            fill.style.width = `${progress}%`;
        });
    });

    // Animate the number alongside the bar.
    if (percent) {
        const duration = 1500;
        let startTime = null;

        function animatePercentage(timestamp) {
            if (startTime === null) {
                startTime = timestamp;
            }

            const elapsed = timestamp - startTime;

            const ratio = Math.min(elapsed / duration, 1);

            // Smooth easing.
            const eased = 1 - Math.pow(1 - ratio, 3);

            const currentValue = Math.round(
                progress * eased
            );

            percent.textContent = `${currentValue}%`;

            if (ratio < 1) {
                requestAnimationFrame(animatePercentage);
            } else {
                percent.textContent = `${progress}%`;
            }
        }

        requestAnimationFrame(animatePercentage);
    }
}

if ("IntersectionObserver" in window) {
    const skillObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                animateSkill(entry.target);

                skillObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.2
        }
    );

    skillElements.forEach(skill => {
        skillObserver.observe(skill);
    });
} else {
    skillElements.forEach(skill => {
        animateSkill(skill);
    });
}


/* ========================================
   11. SMOOTH SECTION NAVIGATION
======================================== */

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") return;

        const targetElement = document.getElementById(
            targetId.substring(1)
        );

        if (targetElement) {
            event.preventDefault();

            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            closeMenu();
        }
    });
});


/* ========================================
   12. FLOATING PARTICLES
======================================== */

document.querySelectorAll(
    ".floating-particles span"
).forEach(particle => {
    const delay = Math.random() * 8;
    const duration = 6 + Math.random() * 10;
    const x = Math.random() * 100;
    const size = 2 + Math.random() * 4;

    particle.style.setProperty(
        "--delay",
        `${delay}s`
    );

    particle.style.setProperty(
        "--duration",
        `${duration}s`
    );

    particle.style.setProperty(
        "--x",
        `${x}%`
    );

    particle.style.setProperty(
        "--size",
        `${size}px`
    );
});


/* ========================================
   13. PAGE LOADER
======================================== */

const loaderMessages = {
    ar: [
        "جاري تجهيز الموقع...",
        "تحميل المكونات...",
        "تهيئة الواجهة...",
        "تشغيل النظام...",
        "جاهز"
    ],

    en: [
        "Preparing website...",
        "Loading components...",
        "Initializing interface...",
        "Starting system...",
        "Ready"
    ]
};

function updateLoaderLanguage() {
    if (!loaderStatus) return;

    const messages = loaderMessages[currentLanguage];

    if (loaderPercentage) {
        const value = parseInt(loaderPercentage.textContent, 10) || 0;

        if (value >= 100) {
            loaderStatus.textContent = messages[4];
        } else if (value >= 75) {
            loaderStatus.textContent = messages[3];
        } else if (value >= 50) {
            loaderStatus.textContent = messages[2];
        } else if (value >= 25) {
            loaderStatus.textContent = messages[1];
        } else {
            loaderStatus.textContent = messages[0];
        }
    } else {
        loaderStatus.textContent = messages[0];
    }
}

function startLoader() {
    if (!pageLoader) return;

    let loaderValue = 0;

    if (loaderProgress) {
        loaderProgress.style.width = "0%";
    }

    if (loaderPercentage) {
        loaderPercentage.textContent = "0%";
    }

    updateLoaderLanguage();

    const loaderInterval = setInterval(() => {
        loaderValue += Math.floor(Math.random() * 4) + 1;

        if (loaderValue >= 100) {
            loaderValue = 100;

            clearInterval(loaderInterval);

            if (loaderProgress) {
                loaderProgress.style.width = "100%";
            }

            if (loaderPercentage) {
                loaderPercentage.textContent = "100%";
            }

            updateLoaderLanguage();

            setTimeout(() => {
                pageLoader.classList.add("hidden");
            }, 500);

            return;
        }

        if (loaderProgress) {
            loaderProgress.style.width = `${loaderValue}%`;
        }

        if (loaderPercentage) {
            loaderPercentage.textContent = `${loaderValue}%`;
        }

        updateLoaderLanguage();
    }, 70);
}


/* ========================================
   14. INITIALIZE
======================================== */

updateLanguage();

updateMusicButton();

startLoader();
