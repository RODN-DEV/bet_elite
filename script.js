// --- script.js: Main Application Logic (UPDATED for VIP Lock) ---

document.addEventListener('DOMContentLoaded', () => {
    // --- Security Constant ---
    // SHA-256 hash for the password "123008"
    const VIP_PASSWORD_HASH = '2e41c49b6b8b939c00b0f7771746682672b15392e273e86c0c4515f483584852';
    
    // Check session storage if the VIP access is already granted
    let isVipUnlocked = sessionStorage.getItem('vipAccess') === 'true';

    // --- UI Elements ---
    const sidebar = document.getElementById('sidebar');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeBtn = document.getElementById('close-btn');
    const tabButtons = document.querySelectorAll('.tab-button');
    const contentSections = document.querySelectorAll('.tips-content, #history-tab, #privacy-policy');
    const sidebarNavItems = document.querySelectorAll('.sidebar-nav .nav-item');

    // --- 1. Hashing Function (Required for client-side comparison) ---
    // This is an asynchronous function to hash the user's input password.
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer)); 
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }


    // --- 2. VIP Authentication Modal/Prompt ---
    async function authenticateVip(sectionId) {
        if (isVipUnlocked) {
            return true;
        }

        const userInput = prompt("🔒 Enter the VIP Access Code to view this section:");
        if (!userInput) {
            return false; // User cancelled
        }

        // Hash the user input and compare
        const hashedInput = await hashPassword(userInput.trim());

        if (hashedInput === VIP_PASSWORD_HASH) {
            // Success! Set flag and allow access
            isVipUnlocked = true;
            sessionStorage.setItem('vipAccess', 'true');
            alert("✅ Access Granted! Welcome to the VIP section.");
            return true;
        } else {
            alert("❌ Incorrect Access Code. Please try again or join our Telegram channel for VIP access.");
            // Revert to a non-VIP section (e.g., Free Tips)
            handleTabSwitch('free-section'); 
            updateActiveState('free-section');
            return false;
        }
    }


    // --- 3. Sidebar and Menu Logic (Same as before, except for navigation) ---
    const openSidebar = () => {
        sidebar.classList.add('open');
        document.body.style.overflow = 'hidden'; 
    };

    const closeSidebar = () => {
        sidebar.classList.remove('open');
        document.body.style.overflow = 'auto';
    };

    hamburgerBtn.addEventListener('click', openSidebar);
    closeBtn.addEventListener('click', closeSidebar);

    sidebarNavItems.forEach(item => {
        item.addEventListener('click', async (event) => {
            event.preventDefault();
            closeSidebar();
            
            const targetId = item.getAttribute('href').substring(1);

            // Handle VIP check for sidebar navigation
            if (targetId.startsWith('vip-')) {
                const authorized = await authenticateVip(targetId);
                if (!authorized) return; // Stop if authentication fails
            }
            
            if (targetId === 'home') {
                handleTabSwitch('vip-5-odds');
            } else if (targetId === 'history-tab' || targetId === 'privacy-policy') {
                showMainSection(targetId);
            }
            
            updateActiveState(targetId);

            if (item.id === 'telegram-link') {
                window.open('https://t.me/elite_betting_tip', '_blank');
            }
        });
    });


    // --- 4. Tab/Section Switching Logic (Modified to include VIP check) ---

    const showMainSection = (targetSectionId) => {
        contentSections.forEach(section => {
            section.classList.add('hidden');
        });
        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            if (targetSectionId === 'history-tab' && typeof renderHistory === 'function') {
                renderHistory();
            }
        }
    }

    const handleTabSwitch = (sectionId) => {
        showMainSection('tips-section'); 
        
        document.querySelectorAll('.tips-content').forEach(content => {
            content.classList.add('hidden');
        });

        document.getElementById(sectionId).classList.remove('hidden');
        renderTips(sectionId);
    }

    const updateActiveState = (targetId) => {
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-section') === targetId) {
                btn.classList.add('active');
            }
        });
        
        sidebarNavItems.forEach(item => {
            item.classList.remove('active');
            const hrefId = item.getAttribute('href').substring(1);
            if (targetId.includes('vip-') || targetId === 'free-section') {
                if (hrefId === 'home') {
                     item.classList.add('active');
                }
            } else if (hrefId === targetId) {
                item.classList.add('active');
            }
        });
    };

    // Event listeners for the top navigation tabs (Crucial modification here)
    tabButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const sectionId = button.getAttribute('data-section');
            
            // --- VIP Check ---
            if (sectionId.startsWith('vip-')) {
                const authorized = await authenticateVip(sectionId);
                if (!authorized) {
                    // If auth fails, ensure the currently visible tab (free-section) remains active
                    updateActiveState('free-section');
                    return; 
                }
            }
            // --- End VIP Check ---

            updateActiveState(sectionId);

            if (sectionId === 'history-tab') {
                showMainSection(sectionId);
            } else {
                handleTabSwitch(sectionId);
            }
        });
    });

    // --- 5. Dynamic Tip Rendering (Same as before) ---

    const createGameCard = (game) => {
        // ... (Game card creation logic remains the same)
        const status = 'pending'; 

        return `
            <div class="game-card" id="${game.id}">
                <h4>${game.matchup}</h4>
                <div class="match-time">${game.time}</div>
                <div class="tip-odds">
                    Tip: **${game.tip}** <br> Odds: <span class="odds-value">${game.odds.toFixed(2)}</span>
                </div>
                <div class="status-badge ${status}">
                    <i class="fas fa-clock"></i> PENDING
                </div>
            </div>
        `;
    };

    const renderTips = (section) => {
        const gamesListContainer = document.querySelector(`#${section} .games-list`);
        if (!gamesListContainer) return;

        const filteredTips = todayTips.filter(tip => tip.section === section);

        // Render the tips or a locked message
        if (filteredTips.length === 0) {
            gamesListContainer.innerHTML = `<p style="text-align: center; padding: 20px;">No games available yet for the **${section.replace('-', ' ').toUpperCase()}** section.</p>`;
            return;
        }

        // Display a locked message if it's VIP and not unlocked (although the auth check prevents this visually)
        if (section.startsWith('vip-') && !isVipUnlocked) {
             gamesListContainer.innerHTML = `<div class="locked-message" style="text-align: center; padding: 40px; color: var(--danger-color);">
                <h2>🔒 This section is locked!</h2>
                <p>Please enter the VIP Access Code to view premium tips.</p>
                <p>Join our Telegram channel for access: <a href="https://t.me/elite_betting_tip" target="_blank" style="color: #0088cc;">t.me/elite_betting_tip</a></p>
             </div>`;
        } else {
            gamesListContainer.innerHTML = filteredTips.map(createGameCard).join('');
        }
    };


    // --- 6. Initialization ---

    // Initial load: Render the default 5 Odds VIP section (will prompt if not unlocked)
    // To ensure the app loads cleanly, let's default to the FREE section instead.
    renderTips('free-section'); 
    updateActiveState('free-section'); // Set FREE as the active tab initially.
});
