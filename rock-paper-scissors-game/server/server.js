const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// In-memory database
let games = new Map();

// Function to generate a short, unique ID
function generateShortId() {
    return crypto.randomBytes(3).toString('hex');
}

// Clear all games on server start
console.log('Server starting, clearing all games...');
games.clear();

// Create a new game
app.post('/game', (req, res) => {
    let gameId;
    do {
        gameId = generateShortId();
    } while (games.has(gameId));

    games.set(gameId, {
        id: gameId,
        players: [],
        choices: {},
        health: { '1': 3, '2': 3 },
        status: 'waiting',
        roundResult: null,
        roundNumber: 1
    });
    res.json({ gameId });
});

// Check if a game exists
app.get('/game/:id/exists', (req, res) => {
    const gameId = req.params.id;
    res.json({ exists: games.has(gameId) });
});

// Join a game
app.post('/game/:id/join/:player', (req, res) => {
    const gameId = req.params.id;
    const player = req.params.player;
    const game = games.get(gameId);

    console.log(`Attempt to join game ${gameId} as player ${player}`);

    if (!game) {
        console.log(`Game ${gameId} not found`);
        return res.status(404).json({ error: 'Game not found' });
    }

    if (game.players.length >= 2 && !game.players.includes(player)) {
        console.log(`Game ${gameId} is full`);
        return res.status(400).json({ error: 'Game is full' });
    }

    if (!game.players.includes(player)) {
        game.players.push(player);
    }

    if (game.players.length === 2) {
        game.status = 'round_active';
    }

    console.log(`Player ${player} joined game ${gameId}. Game state:`, game);
    res.json({ player });
});

// Make a choice
app.post('/game/:id/choice', (req, res) => {
    const { id: gameId } = req.params;
    const { player, choice } = req.body;

    const game = games.get(gameId);
    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }

    game.choices[player] = choice;

    if (Object.keys(game.choices).length === 2) {
        calculateRound(game);
    }

    res.json({ success: true });
});

// Get game state
app.get('/game/:id', (req, res) => {
    const gameId = req.params.id;
    const game = games.get(gameId);

    if (!game) {
        return res.status(404).json({ error: 'Game not found' });
    }

    res.json(game);
});

function calculateRound(game) {
    const choice1 = game.choices['1'];
    const choice2 = game.choices['2'];

    if (choice1 === choice2) {
        game.roundResult = 'tie';
    } else if (
        (choice1 === 'rock' && choice2 === 'scissors') ||
        (choice1 === 'paper' && choice2 === 'rock') ||
        (choice1 === 'scissors' && choice2 === 'paper')
    ) {
        game.health['2']--;
        game.roundResult = 'player1';
    } else {
        game.health['1']--;
        game.roundResult = 'player2';
    }

    game.status = 'round_complete';

    if (game.health['1'] === 0 || game.health['2'] === 0) {
        game.status = 'game_over';
    } else {
        // Set a timeout to start the next round
        setTimeout(() => {
            game.status = 'round_active';
            game.choices = {};
            game.roundResult = null;
            game.roundNumber++;
        }, 3000); // 3 seconds delay
    }
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});