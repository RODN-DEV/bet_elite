// --- Data.js: Today's Betting Tips for December 16th ---

/**
 * Structure for a single game tip:
 * {
 * id: string,
 * matchup: string,  // e.g., "Team A vs Team B"
 * time: string,     // e.g., "17:00 EAT"
 * tip: string,      // e.g., "Over 2.5 Goals"
 * odds: number,     // e.g., 1.85
 * section: string   // 'vip-5-odds', 'vip-3-odds', or 'free-section'
 * }
 */

const todayTips = [
    // --- FREE Section (Based on the image) ---
    {
        id: 'free-001',
        matchup: 'Winterthur vs Thun',
        time: '21:30 EAT', // Using time from image
        tip: 'Away Win (2)',
        odds: 1.82,
        section: 'free-section'
    },
    {
        id: 'free-002',
        matchup: 'St. Gallen vs Sion',
        time: '21:30 EAT', // Using time from image
        tip: 'Home/Away (12)',
        odds: 1.29,
        section: 'free-section'
    },

    // --- 3 Odds VIP Section ---
    {
        id: 'vip-3-001',
        matchup: 'Oc Chrleroi vs Lommel',
        time: 'TBA',
        tip: 'Away Win',
        odds: 1.85,
        section: 'vip-3-odds'
    },
    {
        id: 'vip-3-002',
        matchup: 'Queen of South vs Dunfermiline',
        time: 'TBA',
        tip: 'Away Win',
        odds: 1.95,
        section: 'vip-3-odds'
    }, 
    // Total combined odds: 1.85 * 1.95 = 3.6075 (Above 3 Odds Goal)

    // --- 5 Odds VIP Section ---
    {
        id: 'vip-5-001',
        matchup: 'Cardiff vs Bristol Ferry',
        time: 'TBA',
        tip: 'Home Win',
        odds: 1.70,
        section: 'vip-5-odds'
    },
    {
        id: 'vip-5-002',
        matchup: 'Montrose vs Spartans',
        time: 'TBA',
        tip: 'Home Win',
        odds: 2.15,
        section: 'vip-5-odds'
    },
    {
        id: 'vip-5-003',
        matchup: 'Koninklijke Lierse S vs KV Kortrijk',
        time: 'TBA',
        tip: 'Away Win',
        odds: 2.10,
        section: 'vip-5-odds'
    },
    // Total combined odds: 1.70 * 2.15 * 2.10 = 7.6755 (Above 5 Odds Goal)
];


// --- Data.js: History of Past Games (Now Empty) ---
// History is now empty as requested. When history is added, this array will be populated.
const historyData = [];
