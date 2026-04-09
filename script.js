document.addEventListener('DOMContentLoaded', () => {
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const mainContainer = document.getElementById('main-container');
    const successContainer = document.getElementById('success-container');
    
    let isAppendedToBody = false;

    // Make the button move around
    function dodgeButton() {
        if (!isAppendedToBody) {
            // First time dodging: we must move the button to the body 
            // so it acts globally and isn't trapped by the .card's backdrop-filter containing block
            const rect = noBtn.getBoundingClientRect();
            document.body.appendChild(noBtn);
            
            isAppendedToBody = true;
            
            noBtn.style.position = 'fixed';
            noBtn.style.left = `${rect.left}px`;
            noBtn.style.top = `${rect.top}px`;
            noBtn.style.width = `${rect.width}px`; 
            noBtn.style.height = `${rect.height}px`;
            noBtn.style.zIndex = '9999';
            noBtn.style.margin = '0'; // reset any margins it had in the button group
            
            // Allow a tiny delay for the browser to register its new fixed position 
            // before we transition it safely
            setTimeout(calculateNewPosition, 50);
        } else {
            calculateNewPosition();
        }
    }

    function calculateNewPosition() {
        // Adjust for mobile screens like iPhone 12 safe areas
        const windowWidth = document.documentElement.clientWidth;
        const windowHeight = document.documentElement.clientHeight;
        
        const btnWidth = noBtn.offsetWidth;
        const btnHeight = noBtn.offsetHeight;
        
        // Randomly calculate safe coordinates within screen, adding extra padding. 
        // We use slightly larger bounds for padding to ensure it fits safely inside mobile viewports.
        const padding = 20;
        const safeWidth = windowWidth - btnWidth - (padding * 2);
        const safeHeight = windowHeight - btnHeight - (padding * 2);

        // Making sure it does not calculate negative safe widths/heights
        const randomX = Math.max(padding, Math.floor(Math.random() * safeWidth) + padding);
        const randomY = Math.max(padding, Math.floor(Math.random() * safeHeight) + padding);
        
        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;
        noBtn.style.transition = 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'; // Smooth but fast animation
    }

    // Dodging triggers: mouseover for desktop, touch for mobile
    noBtn.addEventListener('mouseover', dodgeButton);
    
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevents it from actually triggering click on iOS devices
        dodgeButton();
    }, { passive: false });
    
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        dodgeButton(); 
    });

    yesBtn.addEventListener('click', () => {
        createConfetti();
        
        mainContainer.classList.add('hidden');
        successContainer.classList.remove('hidden');
        
        noBtn.style.display = 'none'; // Clear the NO button when done
    });

    function createConfetti() {
        const colors = ['#84fab0', '#8fd3f4', '#e0c3fc', '#8ec5fc', '#ffd166'];
        
        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            
            confetti.style.position = 'fixed';
            confetti.style.width = `${Math.random() * 10 + 6}px`;
            confetti.style.height = `${Math.random() * 10 + 6}px`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.top = `-20px`;
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            confetti.style.zIndex = '9999';
            confetti.style.opacity = Math.random() + 0.2;
            confetti.style.pointerEvents = 'none';
            
            document.body.appendChild(confetti);
            
            const fallDuration = Math.random() * 3 + 2;
            const delay = Math.random() * 1.5;
            
            confetti.animate([
                { transform: `translate3d(0, 0, 0) rotate(0deg)`, opacity: 1 },
                { transform: `translate3d(${Math.random() * 200 - 100}px, 100vh, 0) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], {
                duration: fallDuration * 1000,
                delay: delay * 1000,
                easing: 'cubic-bezier(.37,0,.63,1)',
                fill: 'forwards'
            });
            
            setTimeout(() => {
                confetti.remove();
            }, (fallDuration + delay) * 1000);
        }
    }
});
