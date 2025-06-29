// Copy button functionality for code blocks
document.addEventListener('DOMContentLoaded', function() {
    // Add copy buttons to all pre elements except hero demo and VS Code mockup
    const preElements = document.querySelectorAll('pre:not(.hero-demo pre):not(.vscode-content pre)');
    
    preElements.forEach(pre => {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        
        copyButton.addEventListener('click', function() {
            const code = pre.querySelector('code').textContent;
            
            navigator.clipboard.writeText(code).then(function() {
                copyButton.classList.add('success');
                
                setTimeout(function() {
                    copyButton.classList.remove('success');
                }, 2000);
            }).catch(function() {
                copyButton.classList.add('error');
                
                setTimeout(function() {
                    copyButton.classList.remove('error');
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
