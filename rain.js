const DROP_COUNT   = 120;   // more = heavier rain
const MIN_SPEED    = 800;   // ms
const MAX_SPEED    = 2200;  // ms
const MIN_DELAY    = 0;     // ms
const MAX_DELAY    = 3000;  // ms

const container = document.getElementById('rain-container');

function random(min, max) { 
  return Math.random() * (max - min) + min; 
}

for (let i = 0; i < DROP_COUNT; i++) {
  const drop = document.createElement('div');
  drop.className = 'drop';

  // Random horizontal position
  drop.style.left = `${random(0, 100)}vw`;

  // Random speed & delay
  const speed = random(MIN_SPEED, MAX_SPEED);
  const delay = random(MIN_DELAY, MAX_DELAY);
  drop.style.animationDuration = `${speed}ms`;
  drop.style.animationDelay = `${delay}ms`;

  // Slight random tilt for realism
  const tilt = random(-15, 15);
  drop.style.transform = `rotate(${tilt}deg)`;

  container.appendChild(drop);
}
document.addEventListener('DOMContentLoaded', () => {
    // Check if the current page uses the alternate background, and if so, skip the scroll effect.
    if (document.body.classList.contains('index2-bg')) {
        return; 
    }

    const body = document.body;

    // The color will change when the user scrolls 800 pixels down.
    const scrollThreshold = 800; 

    // Define the colors (make sure these match your CSS transition setup)
    const initialColor = '#7900FF';     // Starting Purple 
    const newColor = '#ff69b4';         // Hot Pink (example change)

    function handleScroll() {
        const scrollPosition = window.scrollY;

        // If the user scrolls past the threshold, change to the new color.
        if (scrollPosition > scrollThreshold) {
            body.style.backgroundColor = newColor;
        } else {
            // Otherwise, reset to the initial color.
            body.style.backgroundColor = initialColor;
        }
    }

    // Attach the scroll listener
    window.addEventListener('scroll', handleScroll);

    // Run once on load to set the correct color if the user loads the page scrolled down
    handleScroll(); 
});

document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    const nav = document.querySelector('.carousel-nav');
    const indicators = Array.from(nav.children);
    
    // Calculate the size of a single slide
    const slideWidth = slides[0].getBoundingClientRect().width;

    // Arrange the slides next to one another
    const setSlidePosition = (slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    };
    slides.forEach(setSlidePosition);

    // --- Core Movement Function ---
    const moveToSlide = (currentSlide, targetSlide) => {
        const amountToMove = targetSlide.style.left;
        
        // 1. Move the track
        track.style.transform = 'translateX(-' + amountToMove + ')';
        
        // 2. Update the 'current-slide' class
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    };

    // --- Indicator Update Function ---
    const updateIndicators = (currentIndicator, targetIndicator) => {
        currentIndicator.classList.remove('current-slide');
        targetIndicator.classList.add('current-slide');
    };
    
    // --- Arrow Visibility Function ---
    const updateArrows = (targetIndex) => {
        if (targetIndex === 0) {
            prevButton.classList.add('is-hidden');
            nextButton.classList.remove('is-hidden');
        } else if (targetIndex === slides.length - 1) {
            prevButton.classList.remove('is-hidden');
            nextButton.classList.add('is-hidden');
        } else {
            prevButton.classList.remove('is-hidden');
            nextButton.classList.remove('is-hidden');
        }
    }
    
    // Initialize: Hide the prev button on the first slide
    updateArrows(0);

    // --- Next Button Click Listener ---
    nextButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.current-slide');
        const nextSlide = currentSlide.nextElementSibling;
        const currentIndicator = nav.querySelector('.current-slide');
        const nextIndicator = currentIndicator.nextElementSibling;
        const nextIndex = slides.findIndex(slide => slide === nextSlide);

        moveToSlide(currentSlide, nextSlide);
        updateIndicators(currentIndicator, nextIndicator);
        updateArrows(nextIndex);
    });

    // --- Previous Button Click Listener ---
    prevButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.current-slide');
        const prevSlide = currentSlide.previousElementSibling;
        const currentIndicator = nav.querySelector('.current-slide');
        const prevIndicator = currentIndicator.previousElementSibling;
        const prevIndex = slides.findIndex(slide => slide === prevSlide);
        
        moveToSlide(currentSlide, prevSlide);
        updateIndicators(currentIndicator, prevIndicator);
        updateArrows(prevIndex);
    });

    // --- Indicator Click Listener ---
    nav.addEventListener('click', e => {
        const targetIndicator = e.target.closest('button');
        if (!targetIndicator) return;

        const currentSlide = track.querySelector('.current-slide');
        const currentIndicator = nav.querySelector('.current-slide');
        const targetIndex = indicators.findIndex(indicator => indicator === targetIndicator);
        const targetSlide = slides[targetIndex];

        moveToSlide(currentSlide, targetSlide);
        updateIndicators(currentIndicator, targetIndicator);
        updateArrows(targetIndex);
    });

});