document.addEventListener('DOMContentLoaded', () => {
    // Audio Objects
    const bgm = document.getElementById('bgm-audio');
    const favAudio = document.getElementById('fav-audio');
    let isFavPlaying = false;

    // --- 1. PARTICLE SYSTEM (Chocolates, Flowers, Petals) ---
    window.triggerEffect = (type) => {
        const container = document.getElementById('particle-container');
        const emojis = {
            'chocolate': ['🍫', '🍬', '🍪'],
            'flower': ['🌹', '🌸', '💐'],
            'magic': ['✨', '💖', '⚜️']
        };
        
        // Spawn 20 items
        for(let i = 0; i < 20; i++) {
            const el = document.createElement('div');
            el.className = 'falling-item';
            
            // Pick random emoji from set
            const set = emojis[type] || emojis['magic'];
            el.innerText = set[Math.floor(Math.random() * set.length)];
            
            // Random positioning
            el.style.left = Math.random() * 100 + 'vw';
            el.style.animationDuration = (Math.random() * 3 + 3) + 's'; // 3-6s fall
            el.style.fontSize = (Math.random() * 20 + 20) + 'px'; // Size variation
            
            container.appendChild(el);
            setTimeout(() => el.remove(), 6000);
        }
    };

    // --- 2. MUSIC TOGGLE LOGIC ---
    window.toggleMusic = () => {
        const icon = document.getElementById('music-icon');
        if (!isFavPlaying) {
            bgm.pause();
            favAudio.volume = 1.0;
            favAudio.play().catch(e => console.log("Interaction needed"));
            icon.className = "fas fa-pause";
            triggerEffect('magic'); // Visual feedback
        } else {
            favAudio.pause();
            bgm.play();
            icon.className = "fas fa-music";
        }
        isFavPlaying = !isFavPlaying;
    };

    // --- 3. ENVELOPE & PASSWORD ---
    document.getElementById('envelope-btn').onclick = function() {
        this.classList.add('open');
        setTimeout(() => {
            document.getElementById('envelope-stage').classList.add('hidden');
            document.getElementById('login-screen').classList.remove('hidden');
        }, 800);
    };

    document.getElementById('enter-btn').onclick = () => {
        const input = document.getElementById('password-input').value.trim();
        if (input.toLowerCase() === "radhu") {
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('main-content').classList.remove('hidden');
            bgm.volume = 0.5;
            bgm.play();
            initScratch(); // Initialize scratch card
        } else {
            document.getElementById('password-input').style.borderColor = "red";
            setTimeout(() => document.getElementById('password-input').style.borderColor = "#555", 1000);
        }
    };

    // --- 4. NAVIGATION ---
    window.goToLetter = () => {
        document.getElementById('step-gallery').classList.add('hidden');
        document.getElementById('step-letter').classList.remove('hidden');
        startTypewriter();
    };

    // --- 5. SCRATCH REVEAL ---
    function initScratch() {
        const canvas = document.getElementById('scratch-canvas');
        const ctx = canvas.getContext('2d');
        const parent = canvas.parentElement;
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;

        // Gold Foil Gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#bf953f');
        gradient.addColorStop(0.5, '#fcf6ba');
        gradient.addColorStop(1, '#b38728');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Text on Foil
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.font = "20px Cinzel Decorative";
        ctx.textAlign = "center";
        ctx.fillText("Scratch to Reveal", canvas.width/2, canvas.height/2);

        let isRevealed = false;

        const scratch = (e) => {
            if (isRevealed) return;
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            const y = (e.clientY || e.touches[0].clientY) - rect.top;

            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, Math.PI * 2);
            ctx.fill();

            // Check Progress
            const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let clearCount = 0;
            for (let i = 3; i < pixels.length; i += 4) {
                if (pixels[i] === 0) clearCount++;
            }

            if (clearCount > (pixels.length / 4) * 0.4) {
                isRevealed = true;
                canvas.style.transition = "opacity 1s";
                canvas.style.opacity = "0";
                triggerEffect('flower'); // Celebration
                setTimeout(() => {
                    document.getElementById('step-reveal').classList.add('hidden');
                    document.getElementById('step-gallery').classList.remove('hidden');
                }, 2000);
            }
        };

        canvas.addEventListener('mousemove', (e) => { if (e.buttons === 1) scratch(e); });
        canvas.addEventListener('touchmove', (e) => { e.preventDefault(); scratch(e); }, { passive: false });
    }

    // --- 6. TYPEWRITER EFFECT ---
    function startTypewriter() {
        const text = "To Radhu,\n\nFrom the moment I met you, life became a melody I never want to stop singing. You are the grace in the flowers, the sweetness in the chocolate, and the beat in my heart.\n\nThank you for being you.\n\nLove always.";
        let i = 0;
        const container = document.getElementById('typewriter-area');
        container.innerHTML = ""; // Clear previous

        function type() {
            if (i < text.length) {
                if (text.charAt(i) === "\n") {
                    container.innerHTML += "<br>";
                } else {
                    container.innerHTML += text.charAt(i);
                }
                i++;
                setTimeout(type, 50);
            } else {
                document.getElementById('signature').classList.remove('hidden');
                triggerEffect('magic');
            }
        }
        type();
    }
});