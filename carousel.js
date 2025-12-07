(function() {
    // -----------------------------
    // 1. FIX: Load YouTube API (Added the missing URL)
    // -----------------------------
    if (!window.YT) { 
        let tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api"; // <--- FIXED THIS LINE
        document.head.appendChild(tag);
    }

    // -----------------------------
    // Variables
    // -----------------------------
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    const dots = Array.from(document.querySelectorAll('.carousel-indicator'));
    let currentIndex = 0;
    let players = [];

    // -----------------------------
    // Initialize YouTube players
    // -----------------------------
    window.onYouTubeIframeAPIReady = function() {
        slides.forEach(slide => {
            const iframe = slide.querySelector('iframe');
            if(iframe) {
                // Note: Ensure your iframes in HTML have 'src' attributes with video URLs, 
                // or pass 'videoId' here if you want to load them via JS.
                const player = new YT.Player(iframe, { events: { 'onReady': () => {} } });
                players.push(player);
            }
        });
    };

    // -----------------------------
    // 2. FIX: Update slide function (Used % instead of Pixels)
    // -----------------------------
    const updateSlide = index => {
        // WE REMOVED: const slideWidth = slides[0].getBoundingClientRect().width;
        
        // NEW MATH: Move by 100% * index. This is much smoother and never breaks layout.
        track.style.transform = `translateX(-${index * 100}%)`;

        // Pause previous video if exists (Safety check added)
        if (players[currentIndex] && typeof players[currentIndex].pauseVideo === 'function') {
            players[currentIndex].pauseVideo();
        }

        currentIndex = index;

        // Update dots
        dots.forEach(dot => dot.classList.remove('current-slide'));
        if(dots[currentIndex]) dots[currentIndex].classList.add('current-slide');
    };

    // -----------------------------
    // Update buttons visibility
    // -----------------------------
    const updateButtons = () => {
        // Added safety check for buttons existing
        if (!prevButton || !nextButton) return; 

        if (window.innerWidth > 768) {
            prevButton.style.display = currentIndex === 0 ? 'none' : 'block';
            nextButton.style.display = currentIndex === slides.length - 1 ? 'none' : 'block';
        }
    };

    // -----------------------------
    // Initial setup
    // -----------------------------
    window.addEventListener('load', () => {
        updateSlide(0);
        updateButtons();
    });

    // -----------------------------
    // Button event listeners
    // -----------------------------
    if(nextButton) {
        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) {
                updateSlide(currentIndex + 1);
                updateButtons();
            }
        });
    }

    if(prevButton) {
        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                updateSlide(currentIndex - 1);
                updateButtons();
            }
        });
    }

    // -----------------------------
    // Dots event listeners
    // -----------------------------
    dots.forEach((dot, i) => dot.addEventListener('click', () => {
        updateSlide(i);
        updateButtons();
    }));

    // -----------------------------
    // Resize handler
    // -----------------------------
    window.addEventListener('resize', () => {
        // Even with %, we update to ensure buttons appear/disappear correctly
        updateButtons(); 
    });

    // -----------------------------
    // Mobile swipe logic
    // -----------------------------
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, {passive: true});
    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});

    function handleSwipe() {
        const delta = touchEndX - touchStartX;
        if (Math.abs(delta) > 50) {
            if (delta < 0 && currentIndex < slides.length - 1) updateSlide(currentIndex + 1);
            else if (delta > 0 && currentIndex > 0) updateSlide(currentIndex - 1);
            updateButtons();
        }
    }

    // -----------------------------
    // RAIN GENERATOR
    // -----------------------------
    function createRain() {
        const container = document.getElementById('rain-container');
        if(!container) return;

        const rainAmount = 30; 
        
        for (let i = 0; i < rainAmount; i++) {
            const drop = document.createElement('div');
            drop.classList.add('drop');
            drop.style.left = Math.random() * 100 + 'vw';
            drop.style.animationDuration = Math.random() * 1 + 0.5 + 's';
            drop.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(drop);
        }
    }
    
    createRain();

})();