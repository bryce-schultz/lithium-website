// Mobile navigation toggle
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

// Header background change on scroll
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(30, 42, 58, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
            } else {
                header.style.background = 'rgba(30, 42, 58, 0.95)';
                header.style.boxShadow = 'none';
            }
        });
    }
});

// Intersection Observer for animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards and sections for animation
    const animatedElements = document.querySelectorAll('.overview-card, .feature-item, .example-card, .doc-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Copy code functionality
document.addEventListener('DOMContentLoaded', function() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach((codeBlock, index) => {
        const pre = codeBlock.parentElement;
        
        // Skip adding copy button to hero demo (animated code block)
        if (pre.closest('.hero-demo')) {
            return;
        }
        
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '📋';
        copyButton.title = 'Copy code';
        
        // Style the copy button
        const isHeroDemo = pre.closest('.hero-demo');
        const topPosition = isHeroDemo ? '1rem' : '1rem';
        
        copyButton.style.cssText = `
            position: absolute;
            top: ${topPosition};
            right: 1rem;
            background: rgba(52, 73, 94, 0.8);
            color: #87ceeb;
            border: none;
            padding: 0.5rem;
            border-radius: 0.25rem;
            cursor: pointer;
            font-size: 0.8rem;
            transition: all 0.3s ease;
            z-index: 10;
        `;
        
        // Add hover effect
        copyButton.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(52, 73, 94, 1)';
            this.style.transform = 'scale(1.1)';
        });
        
        copyButton.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(52, 73, 94, 0.8)';
            this.style.transform = 'scale(1)';
        });
        
        // Add copy functionality
        copyButton.addEventListener('click', function() {
            const code = codeBlock.textContent;
            
            navigator.clipboard.writeText(code).then(function() {
                copyButton.innerHTML = '✅';
                copyButton.style.color = '#2ecc71';
                
                setTimeout(function() {
                    copyButton.innerHTML = '📋';
                    copyButton.style.color = '#87ceeb';
                }, 2000);
            }).catch(function() {
                copyButton.innerHTML = '❌';
                copyButton.style.color = '#e74c3c';
                
                setTimeout(function() {
                    copyButton.innerHTML = '📋';
                    copyButton.style.color = '#87ceeb';
                }, 2000);
            });
        });
        
        // Add button to pre element
        if (pre.style.position !== 'relative') {
            pre.style.position = 'relative';
        }
        pre.appendChild(copyButton);
    });
});

// Simple syntax highlighting for Lithium code
function applySyntaxHighlighting(codeElement) {
    // Always get fresh text content
    let code = codeElement.textContent;
    
    // Escape HTML first
    code = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Use placeholders to avoid conflicts between regex patterns
    const tokens = [];
    let tokenIndex = 0;
    
    function createToken(className, content) {
        const token = `__TOKEN_${tokenIndex}__`;
        tokens.push({ token, html: `<span class="${className}">${content}</span>` });
        tokenIndex++;
        return token;
    }
    
    // Comments first (they can contain keywords/strings)
    code = code.replace(/#(.*)$/gm, (match, content) => {
        return createToken('comment', '#' + content);
    });
    
    // Strings (handle escaped quotes)
    code = code.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, (match, content) => {
        return createToken('string', `"${content}"`);
    });
    
    // Handle 'class' keyword and class names together (class definitions only)
    code = code.replace(/\bclass\s+([A-Z][a-zA-Z0-9_]*)/g, (match, className) => {
        return createToken('keyword', 'class') + ' ' + createToken('class-name', className);
    });
    
    // Keywords (excluding 'class' since we handled it above)
    const keywords = ['fn', 'let', 'const', 'if', 'else', 'while', 'for', 'foreach', 'return', 'break', 'continue', 'assert', 'import', 'true', 'false', 'null'];
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        code = code.replace(regex, () => {
            return createToken('keyword', keyword);
        });
    });
    
    // Numbers
    code = code.replace(/\b(\d+\.?\d*)\b/g, (match, number) => {
        return createToken('number', number);
    });
    
    // Function calls and constructor calls (anything followed by parentheses)
    // This will treat Point(10, 20) as a function call, not a class name
    code = code.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)(\s*)(?=\()/g, (match, funcName, spaces) => {
        return createToken('function', funcName) + spaces;
    });
    
    // Replace all tokens with their actual HTML
    tokens.forEach(({ token, html }) => {
        // Use split and join for more reliable replacement
        code = code.split(token).join(html);
    });
    
    // Check for any remaining unreplaced tokens
    const remainingTokens = code.match(/__TOKEN_\d+__/g);
    if (remainingTokens) {
        console.warn('Unreplaced tokens found:', remainingTokens);
        // Force replace any remaining tokens with their content
        remainingTokens.forEach(token => {
            const tokenMatch = token.match(/__TOKEN_(\d+)__/);
            if (tokenMatch) {
                const index = parseInt(tokenMatch[1]);
                if (tokens[index]) {
                    code = code.split(token).join(tokens[index].html);
                }
            }
        });
    }
    
    codeElement.innerHTML = code;
}

// Apply syntax highlighting to all code blocks
document.addEventListener('DOMContentLoaded', function() {
    // Apply to all code blocks except the hero (which has its own timing)
    const codeBlocks = document.querySelectorAll('code.language-lithium:not(.hero-demo code), pre code:not(.hero-demo pre code)');
    
    codeBlocks.forEach(block => {
        applySyntaxHighlighting(block);
    });
});

// Add typing animation to hero code (plays on every page load)
document.addEventListener('DOMContentLoaded', function() {
    const heroCode = document.querySelector('.hero-demo pre code');
    
    if (heroCode) {
        const originalCode = heroCode.textContent;
        
        // Clear the display
        heroCode.innerHTML = '';
        
        let currentCharIndex = 0;
        
        function typeCode() {
            if (currentCharIndex < originalCode.length) {
                // Get the current portion of text we want to show
                const currentText = originalCode.substring(0, currentCharIndex + 1);
                
                // Create a temporary element to apply highlighting
                const tempElement = document.createElement('div');
                tempElement.textContent = currentText;
                
                // Apply syntax highlighting
                applySyntaxHighlighting(tempElement);
                
                // Update the display
                heroCode.innerHTML = tempElement.innerHTML;
                
                currentCharIndex++;
                
                // Adjust timing based on character type
                const currentChar = originalCode[currentCharIndex - 1];
                let delay = 20;
                if (currentChar === '\n') {
                    delay = 100; // Pause at newlines
                } else if (currentChar === ' ') {
                    delay = 30; // Slight pause at spaces
                }
                
                setTimeout(typeCode, delay);
            }
        }
        
        // Start typing animation after a delay
        setTimeout(typeCode, 1000);
    }
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

// Add CSS for active nav link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        background: rgba(135, 206, 235, 0.2);
        color: #add8e6;
    }
    
    .copy-button {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    pre:hover .copy-button {
        opacity: 1;
    }
`;
document.head.appendChild(style);
