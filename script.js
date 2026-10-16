
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

const musicLabels = {
    ar: {
        play: "تشغيل الموسيقى",
        pause: "إيقاف الموسيقى",
        error: "تعذر تشغيل الموسيقى"
    },

    en: {
        play: "Play Music",
        pause: "Pause Music",
        error: "Unable to play music"
    }
};


/* ========================================
   3. TYPING ANIMATION
======================================== */

let phraseIndex = 0;
let characterIndex = 0;
let deleting = false;
let typingTimer;

function typePhrase() {
    if (!changingText) {
        return;
    }

    const currentPhrases = phrases[currentLanguage];
    const currentPhrase = currentPhrases[phraseIndex];

    if (!deleting) {
        characterIndex++;

        changingText.textContent =
            currentPhrase.substring(0, characterIndex);

        if (characterIndex >= currentPhrase.length) {
            deleting = true;

            typingTimer = setTimeout(typePhrase, 1800);
            return;
        }

        typingTimer = setTimeout(typePhrase, 70);

    } else {
        characterIndex--;

        changingText.textContent =
            currentPhrase.substring(0, characterIndex);

        if (characterIndex <= 0) {
            characterIndex = 0;
            deleting = false;

            phraseIndex =
                (phraseIndex + 1) % currentPhrases.length;

            typingTimer = setTimeout(typePhrase, 400);
            return;
        }

        typingTimer = setTimeout(typePhrase, 35);
    }
}

function restartTyping() {
    if (!changingText) {
        return;
    }

    clearTimeout(typingTimer);

    phraseIndex = 0;
    characterIndex = 0;
    deleting = false;

    changingText.textContent = "";

    typePhrase();
}


/* ========================================
   4. SKILLS DIRECTION
======================================== */

function updateSkillDirection() {
    const skillContainers = document.querySelectorAll(
        ".skill-info, .skill-top"
    );

    skillContainers.forEach(container => {
        container.style.direction =
            currentLanguage === "ar" ? "rtl" : "ltr";
    });
}


/* ========================================
   5. MUSIC PLAYER
======================================== */

function updateMusicButton() {
    if (!musicBtn || !backgroundMusic) {
        return;
    }

    const isPlaying = !backgroundMusic.paused;

    const labels = musicLabels[currentLanguage];

    if (musicIcon) {
        musicIcon.className = isPlaying
            ? "fa-solid fa-pause"
            : "fa-solid fa-play";
    }

    if (musicText) {
        musicText.textContent = isPlaying
            ? labels.pause
            : labels.play;
    }

    musicBtn.setAttribute(
        "aria-label",
        isPlaying ? labels.pause : labels.play
    );

    musicBtn.setAttribute(
        "aria-pressed",
        String(isPlaying)
    );
}

if (backgroundMusic) {
    backgroundMusic.volume = 0.35;

    backgroundMusic.addEventListener("play", updateMusicButton);
    backgroundMusic.addEventListener("pause", updateMusicButton);
    backgroundMusic.addEventListener("ended", updateMusicButton);
}

if (musicBtn && backgroundMusic) {
    musicBtn.addEventListener("click", async () => {
        if (backgroundMusic.paused) {
            try {
                await backgroundMusic.play();
            } catch (error) {
                console.error("Music playback failed:", error);

                const labels = musicLabels[currentLanguage];

                if (musicText) {
                    musicText.textContent = labels.error;
                }

                return;
            }
        } else {
            backgroundMusic.pause();
        }

        updateMusicButton();
    });
}


/* ========================================
   6. UPDATE WEBSITE LANGUAGE
======================================== */

function updateLanguage() {
    document.querySelectorAll("[data-ar][data-en]").forEach(element => {
        element.textContent =
            currentLanguage === "ar"
                ? element.dataset.ar
                : element.dataset.en;
    });

    document.documentElement.lang = currentLanguage;

    document.documentElement.dir =
        currentLanguage === "ar" ? "rtl" : "ltr";

    if (languageBtn) {
        languageBtn.textContent =
            currentLanguage === "ar" ? "EN" : "AR";
    }

    document.title =
        currentLanguage === "ar"
            ? "نواف علي | مطور ويب"
            : "Nawaf Ali | Web Developer";

    localStorage.setItem("language", currentLanguage);

    updateSkillDirection();
    updateMusicButton();
    updateLoaderLanguage();
    restartTyping();
}

if (languageBtn) {
    languageBtn.addEventListener("click", () => {
        currentLanguage =
            currentLanguage === "ar" ? "en" : "ar";

        updateLanguage();
    });
}


/* ========================================
   7. MOBILE NAVIGATION
======================================== */

function closeMenu() {
    if (!navMenu || !menuToggle) {
        return;
    }

    navMenu.classList.remove("active");

    menuToggle.innerHTML =
        '<i class="fa-solid fa-bars"></i>';

    menuToggle.setAttribute("aria-expanded", "false");
}

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("active");

        menuToggle.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    });

    document.querySelectorAll(".nav-menu a").forEach(link => {
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
}


/* ========================================
   8. NAVBAR & BACK TO TOP
======================================== */

function updateScrollElements() {
    if (navbar) {
        navbar.classList.toggle(
            "scrolled",
            window.scrollY > 40
        );
    }

    if (backToTop) {
        backToTop.classList.toggle(
            "show",
            window.scrollY > 500
        );
    }
}

window.addEventListener("scroll", updateScrollElements, {
    passive: true
});

updateScrollElements();

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
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

} else {
    revealElements.forEach(element => {
        element.classList.add("visible");
    });
}


/* ========================================
   10. SKILL BARS
======================================== */

const skillElements = document.querySelectorAll(".skill");

if ("IntersectionObserver" in window) {
    const skillObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }

            const fill = entry.target.querySelector(".skill-fill");

            if (fill) {
                const progress = Number(fill.dataset.progress);

                if (Number.isFinite(progress)) {
                    fill.style.width =
                        `${Math.min(100, Math.max(0, progress))}%`;
                }
            }

            skillObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.35
    });

    skillElements.forEach(skill => {
        skillObserver.observe(skill);
    });

} else {
    skillElements.forEach(skill => {
        const fill = skill.querySelector(".skill-fill");

        if (fill) {
            fill.style.width =
                `${fill.dataset.progress || 0}%`;
        }
    });
}


/* ========================================
   11. SMOOTH SECTION NAVIGATION
======================================== */

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
            return;
        }

        const target = document.getElementById(
            targetId.substring(1)
        );

        if (!target) {
            return;
        }

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});


/* ========================================
   12. FLOATING PARTICLES
======================================== */

const particles = document.querySelectorAll(
    ".floating-particles span"
);

particles.forEach((particle, index) => {
    particle.style.setProperty(
        "--delay",
        `${index * -1.7}s`
    );

    particle.style.setProperty(
        "--duration",
        `${8 + (index % 5)}s`
    );

    particle.style.setProperty(
        "--x",
        `${(index * 83) % 100}%`
    );

    particle.style.setProperty(
        "--size",
        `${2 + (index % 4)}px`
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

let loaderValue = 0;
let loaderInterval = null;

function updateLoaderLanguage() {
    if (!loaderStatus) {
        return;
    }

    const messageIndex = loaderValue >= 100
        ? 4
        : Math.min(Math.floor(loaderValue / 25), 3);

    loaderStatus.textContent =
        loaderMessages[currentLanguage][messageIndex];
}

function startLoader() {
    if (
        !pageLoader ||
        !loaderProgress ||
        !loaderPercentage ||
        !loaderStatus
    ) {
        return;
    }

    loaderInterval = setInterval(() => {
        loaderValue += Math.floor(Math.random() * 5) + 1;

        if (loaderValue >= 100) {
            loaderValue = 100;

            clearInterval(loaderInterval);
            loaderInterval = null;
        }

        loaderProgress.style.width = `${loaderValue}%`;
        loaderPercentage.textContent = `${loaderValue}%`;

        updateLoaderLanguage();

        if (loaderValue >= 100) {
            setTimeout(() => {
                pageLoader.classList.add("hidden");
            }, 500);
        }
    }, 70);
}


/* ========================================
   14. INITIALIZE
======================================== */

updateLanguage();
updateMusicButton();
startLoader();

