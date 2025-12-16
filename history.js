// --- history.js: History Tab Rendering Logic ---

/**
 * Creates the HTML structure for a historical game card.
 * @param {object} game - The game object from historyData or a modified todayTips game.
 * @returns {string} The HTML string for the game card.
 */
const createHistoryCard = (game) => {
    let statusClass = game.status;
    let statusText = '';
    let statusIcon = '';
    
    if (game.status === 'win') {
        statusText = 'WIN';
        statusIcon = '<i class="fas fa-check"></i>'; 
    } else if (game.status === 'loss') {
        statusText = 'LOST';
        statusIcon = 'XX'; 
    } else if (game.status === 'pending') {
        statusText = 'PENDING';
        statusIcon = '<i class="fas fa-clock"></i>';
        statusClass = 'pending';
    }

    const scoreDisplay = game.finalScore ? `<div class="final-score">${game.finalScore}</div>` : `<div class="final-score">Tip: ${game.tip}</div>`;

    return `
        <div class="game-card history-card ${statusClass}">
            <h4>${game.matchup}</h4>
            <div class="match-time">${game.date || 'N/A'}</div>
            ${scoreDisplay}
            <div class="status-badge ${statusClass}">
                ${statusIcon} ${statusText}
            </div>
        </div>
    `;
};


/**
 * Renders the full history list, including past games and today's pending games.
 */
const renderHistory = () => {
    const historyListContainer = document.getElementById('history-list');
    if (!historyListContainer) return;
    
    // --- Set the fixed date for "Today" as requested by the user ---
    const todayDate = '16/12/2025'; 

    // 1. Prepare Today's Games for History View
    const todayHistoryTips = todayTips.map(tip => ({
        id: tip.id,
        date: todayDate, // Fixed date for consistency
        matchup: tip.matchup,
        tip: tip.tip,
        finalScore: null, 
        status: 'pending' 
    }));

    // 2. Combine Today's pending tips with the (now empty) historyData
    const combinedHistory = [...todayHistoryTips, ...historyData]; // historyData is now empty

    if (combinedHistory.length === 0) {
        historyListContainer.innerHTML = `<p style="text-align: center; padding: 40px; color: #f39c12;">
            The history is currently empty. All games for today (${todayDate}) are listed below.
        </p>`;
        return;
    }

    // 3. Group by Date for display
    const historyByDate = combinedHistory.reduce((acc, game) => {
        const dateKey = game.date || 'Unknown Date'; 
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(game);
        return acc;
    }, {});

    let historyHTML = '';

    // Iterate through grouped history to build the HTML
    for (const date in historyByDate) {
        historyHTML += `
            <div class="history-date-group">
                <h3 style="color: #f1c40f; margin-top: 20px; border-bottom: 1px solid rgba(241, 196, 15, 0.3); padding-bottom: 5px;">📅 ${date}</h3>
                ${historyByDate[date].map(createHistoryCard).join('')}
            </div>
        `;
    }

    historyListContainer.innerHTML = historyHTML;
};
