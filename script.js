window.addEventListener('DOMContentLoaded', () => {
    const curtain = document.getElementById('curtain');
    const grid = document.querySelector('.main-grid');

    // Trigger curtain opening after a short delay
    setTimeout(() => {
        curtain.classList.add('curtain-open');
        grid.classList.add('reveal');
    }, 500);
});

const launchBtn = document.getElementById('launch-btn');
const initialView = document.getElementById('initial-view');
const countdownView = document.getElementById('countdown-view');
const timerText = document.getElementById('timer-text');
const progressCircle = document.querySelector('.progress-ring__circle');

const OFFICIAL_DOMAIN = 'https://dhashamedia.com';
const COUNTDOWN_TIME = 10;
const CIRCLE_RADIUS = 54;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

if (progressCircle) {
    progressCircle.style.strokeDasharray = `${CIRCLE_CIRCUMFERENCE} ${CIRCLE_CIRCUMFERENCE}`;
    // Start with the circle full
    progressCircle.style.strokeDashoffset = 0;
}

function setProgress(percent) {
    if (progressCircle) {
        // Drain the circle as time passes
        // 0% (Start) -> offset 0 (Full)
        // 100% (End) -> offset circumference (Empty)
        const offset = (percent / 100) * CIRCLE_CIRCUMFERENCE;
        progressCircle.style.strokeDashoffset = offset;
    }
}

launchBtn.addEventListener('click', () => {
    // Fade out initial content
    initialView.classList.add('fade-out');

    setTimeout(() => {
        initialView.classList.add('hidden');
        countdownView.classList.remove('hidden');
        countdownView.classList.add('fade-in');

        // Ensure timer starts at total time
        timerText.innerText = COUNTDOWN_TIME;
        setProgress(0);

        setTimeout(startCountdown, 100);
    }, 800);
});

function startCountdown() {
    let timeLeft = COUNTDOWN_TIME;

    const interval = setInterval(() => {
        timeLeft--;

        if (timeLeft >= 0) {
            timerText.innerText = timeLeft;
            const percent = ((COUNTDOWN_TIME - timeLeft) / COUNTDOWN_TIME) * 100;
            setProgress(percent);

            // Trigger partial confetti on countdown beats
            if (timeLeft <= 3 && timeLeft > 0) {
                confetti({
                    particleCount: 40,
                    spread: 40,
                    origin: { y: 0.6 },
                    colors: ['#DAC291', '#ffffff']
                });
            }
        }

        if (timeLeft <= 0) {
            clearInterval(interval);
            triggerFinalCelebration();
        }
    }, 1000);
}

function triggerFinalCelebration() {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 10,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#DAC291', '#ffffff']
        });
        confetti({
            particleCount: 10,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#DAC291', '#ffffff']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());

    setTimeout(redirectToDomain, 2000);
}

function redirectToDomain() {
    const grid = document.querySelector('.main-grid');
    grid.style.opacity = '0';
    grid.style.transform = 'translateY(-20px) scale(0.98)';
    grid.style.transition = 'all 1.5s cubic-bezier(0.77, 0, 0.175, 1)';

    setTimeout(() => {
        window.location.href = OFFICIAL_DOMAIN;
    }, 1500);
}
