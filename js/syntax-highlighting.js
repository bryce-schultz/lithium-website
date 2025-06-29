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
    
    // Strings (can contain keywords)
    code = code.replace(/"([^"\\]|\\.)*"/g, (match) => {
        return createToken('string', match);
    });
    
    // Numbers
    code = code.replace(/\b\d+\.?\d*\b/g, (match) => {
        return createToken('number', match);
    });
    
    // Class names (only when they appear after 'class' keyword) - BEFORE keywords
    code = code.replace(/\bclass\s+([A-Za-z_][A-Za-z0-9_]*)/g, (match, className) => {
        const classToken = createToken('class-name', className);
        return match.replace(className, classToken);
    });
    
    // Keywords
    const keywords = [
        'fn', 'let', 'const', 'if', 'else', 'while', 'for', 'foreach',
        'return', 'break', 'continue', 'class', 'import', 'assert',
        'true', 'false', 'null'
    ];
    
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        code = code.replace(regex, (match) => {
            return createToken('keyword', match);
        });
    });
    
    // Function calls (word followed by parentheses)
    code = code.replace(/\b([A-Za-z_][A-Za-z0-9_]*)\s*\(/g, (match, funcName) => {
        // Skip if it's already a keyword token or class token
        if (match.includes('__TOKEN_')) return match;
        
        const funcToken = createToken('function', funcName);
        return match.replace(funcName, funcToken);
    });
    
    // Replace all tokens with their HTML
    tokens.forEach(({ token, html }) => {
        // Use split/join to handle multiple occurrences and avoid regex issues
        if (code.includes(token)) {
            code = code.split(token).join(html);
        }
    });
    
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
