document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const sections = document.querySelectorAll('.section');
    const fireOverlay = document.querySelector('.fire-overlay');
    const fireSpread = document.querySelector('.fire-spread');
    
    // Fire particles
    createFireParticles();
    
    // Intersection Observer to detect sections in viewport
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // If impact section is visible, animate fire spreading
                if (entry.target.id === 'impact' && fireSpread) {
                    setTimeout(() => {
                        fireSpread.style.width = '100%';
                    }, 500);
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Scroll event for fire overlay effect
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollPosition / documentHeight;
        
        // Gradually increase fire overlay height based on scroll position
        const maxFireHeight = window.innerHeight * 0.5; // 50% of viewport height
        const fireHeight = scrollProgress * maxFireHeight;
        fireOverlay.style.height = `${fireHeight}px`;
        
        // Change fire overlay intensity based on scroll position
        const intensity = 0.1 + (scrollProgress * 0.2);
        fireOverlay.style.background = `linear-gradient(to top, 
            rgba(255, 70, 0, ${intensity + 0.2}), 
            rgba(255, 165, 0, ${intensity}), 
            transparent)`;
    });
    
    // Function to create fire particles at the bottom of the screen
    function createFireParticles() {
        const fireParticlesContainer = document.createElement('div');
        fireParticlesContainer.className = 'fire-particles';
        fireParticlesContainer.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 150px;
            z-index: 2;
            pointer-events: none;
            overflow: hidden;
        `;
        document.body.appendChild(fireParticlesContainer);
        
        // Create particles
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            createParticle(fireParticlesContainer);
        }
        
        // Continuously create new particles
        setInterval(() => {
            if (window.scrollY > window.innerHeight * 0.5) {
                createParticle(fireParticlesContainer);
            }
        }, 300);
    }
    
    function createParticle(container) {
        const particle = document.createElement('div');
        
        // Random position, size, and animation duration
        const size = Math.random() * 15 + 5;
        const posX = Math.random() * window.innerWidth;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 1;
        
        particle.style.cssText = `
            position: absolute;
            bottom: -${size}px;
            left: ${posX}px;
            width: ${size}px;
            height: ${size}px;
            background-color: rgba(255, ${Math.random() * 165 + 70}, 0, ${Math.random() * 0.5 + 0.5});
            border-radius: 50%;
            filter: blur(${size / 5}px);
            animation: rise ${duration}s ease-out ${delay}s forwards;
            opacity: 0;
        `;
        
        container.appendChild(particle);
        
        // Remove particle after animation completes
        setTimeout(() => {
            particle.remove();
        }, (duration + delay) * 1000);
    }
    
    // Add keyframes for particle animation
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`
        @keyframes rise {
            0% {
                transform: translateY(0) scale(1);
                opacity: 0.8;
            }
            100% {
                transform: translateY(-150px) scale(0);
                opacity: 0;
            }
        }
    `, styleSheet.cssRules.length);
    
    // Add animations for facts and stats
    animateFactsAndStats();
    
    // Animation for facts and statistical data
    function animateFactsAndStats() {
        const factCards = document.querySelectorAll('.fact-card');
        const statItems = document.querySelectorAll('.stat-item');
        
        factCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.transitionDelay = `${index * 0.2}s`;
        });
        
        statItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.transitionDelay = `${index * 0.2}s`;
            
            // Animate the number count-up
            const statNumber = item.querySelector('.stat-number');
            if (statNumber) {
                const targetNumber = statNumber.textContent;
                statNumber.textContent = '0';
                
                // Store original value for number animation
                statNumber.setAttribute('data-target', targetNumber);
            }
        });
        
        // Create an observer for these elements
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = entry.target.classList.contains('fact-card') 
                        ? 'translateY(0)' 
                        : 'scale(1)';
                    
                    // If it's a stat item, animate the number
                    if (entry.target.classList.contains('stat-item')) {
                        const statNumber = entry.target.querySelector('.stat-number');
                        if (statNumber) {
                            animateNumber(statNumber);
                        }
                    }
                    
                    // Stop observing after animation
                    animationObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        factCards.forEach(card => {
            animationObserver.observe(card);
        });
        
        statItems.forEach(item => {
            animationObserver.observe(item);
        });
    }
    
    // Function to animate number counting
    function animateNumber(element) {
        const target = element.getAttribute('data-target');
        let isPercentage = target.includes('%');
        let targetNum = parseFloat(target.replace(/[^\d.-]/g, ''));
        let current = 0;
        let increment = targetNum / 100;
        let duration = 1500; // ms
        let interval = duration / 100;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNum) {
                element.textContent = target; // Use original text with formatting
                clearInterval(timer);
            } else {
                // Format number based on whether it's percentage or other value
                if (isPercentage) {
                    element.textContent = `${Math.floor(current)}%`;
                } else if (target.includes('ล้าน')) {
                    element.textContent = `${Math.floor(current / 100) / 10} ล้านไร่`;
                } else {
                    element.textContent = Math.floor(current).toLocaleString();
                }
            }
        }, interval);
    }
    
    // Add parallax effect to background images
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        // Parallax for intro section
        const introSection = document.getElementById('intro');
        if (introSection) {
            const introBackground = window.getComputedStyle(introSection).backgroundImage;
            if (introBackground && introBackground !== 'none') {
                const yPos = -(scrollPosition * 0.3);
                introSection.style.backgroundPosition = `center ${yPos}px`;
            }
        }
        
        // Parallax for call-to-action section
        const ctaSection = document.getElementById('call-to-action');
        if (ctaSection) {
            const ctaBackground = window.getComputedStyle(ctaSection).backgroundImage;
            if (ctaBackground && ctaBackground !== 'none') {
                const yPos = -(scrollPosition - ctaSection.offsetTop) * 0.2;
                ctaSection.style.backgroundPosition = `center ${yPos}px`;
            }
        }
    });
    
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});