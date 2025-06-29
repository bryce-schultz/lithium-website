// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add active state to navigation based on scroll position
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    let isScrolling = false;
    
    function updateActiveNav() {
        const scrollPos = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const viewportCenter = scrollPos + windowHeight / 2;
        
        // Check if we're at the bottom of the page (within 50px)
        if (scrollPos + windowHeight >= documentHeight - 50) {
            // Highlight the last section (download)
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#download') {
                    link.classList.add('active');
                }
            });
            return;
        }
        
        // Find the section that's most visible/centered in the viewport
        let activeSection = null;
        let closestDistance = Infinity;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionCenter = sectionTop + sectionHeight / 2;
            const sectionId = section.getAttribute('id');
            
            // Calculate distance from viewport center to section center
            const distance = Math.abs(viewportCenter - sectionCenter);
            
            // Also check if the section is actually visible in the viewport
            const sectionBottom = sectionTop + sectionHeight;
            const isVisible = (sectionBottom > scrollPos + 80) && (sectionTop < scrollPos + windowHeight - 80);
            
            if (isVisible && distance < closestDistance) {
                closestDistance = distance;
                activeSection = sectionId;
            }
        });
        
        // Fallback: if no section is properly centered, use the traditional method
        if (!activeSection) {
            const scrollPosWithOffset = scrollPos + 150;
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosWithOffset >= sectionTop && scrollPosWithOffset < sectionTop + sectionHeight) {
                    activeSection = sectionId;
                }
            });
        }
        
        // Update nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (activeSection && link.getAttribute('href') === `#${activeSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Throttle scroll events to prevent excessive calculations
    function handleScroll() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                updateActiveNav();
                isScrolling = false;
            });
            isScrolling = true;
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    updateActiveNav(); // Initial call
});
