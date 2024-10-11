import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = '/api';

function App() {
    const [gameId, setGameId] = useState(null)
    const [player, setPlayer] = useState(null)
    const [gameState, setGameState] = useState(null)
    const [choice, setChoice] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        checkGameExistence();
    }, [])

    const checkGameExistence = async () => {
        // Parse URL parameters
        const params = new URLSearchParams(window.location.search)
        const gameIdParam = params.get('gameId')
        const playerParam = params.get('player')

        if (gameIdParam) {
            try {
                const response = await axios.get(`${API_URL}/game/${gameIdParam}/exists`)
                if (response.data.exists) {
                    console.log('Game ID found in URL:', gameIdParam)
                    setGameId(gameIdParam)
                    if (playerParam) {
                        console.log('Player number found in URL:', playerParam)
                        setPlayer(playerParam)
                        joinGame(gameIdParam, playerParam)
                    }
                } else {
                    console.log('Game not found, clearing URL parameters')
                    clearUrlParameters()
                }
            } catch (error) {
                console.error('Error checking game existence:', error)
                clearUrlParameters()
            }
        }
    }

    const clearUrlParameters = () => {
        window.history.pushState({}, '', window.location.pathname)
        setGameId(null)
        setPlayer(null)
        setGameState(null)
        setChoice(null)
        setError(null)
    }

    useEffect(() => {
        if (gameId) {
            const interval = setInterval(() => {
                fetchGameState()
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [gameId])

    const createGame = async () => {
        try {
            const response = await axios.post(`${API_URL}/game`)
            const newGameId = response.data.gameId
            console.log('New game created:', newGameId)
            setGameId(newGameId)
            setPlayer('1')
            // Update URL with the new game ID and player number
            window.history.pushState({}, '', `?gameId=${newGameId}&player=1`)
            joinGame(newGameId, '1')
        } catch (error) {
            console.error('Error creating game:', error)
            setError('Failed to create game. Please try again.')
        }
    }

    const joinGame = async (id, playerNumber) => {
        try {
            console.log('Attempting to join game:', id, 'as player:', playerNumber)
            const response = await axios.post(`${API_URL}/game/${id}/join/${playerNumber}`)
            setPlayer(playerNumber)
            setGameId(id)
            console.log('Joined game successfully. Player:', playerNumber)
        } catch (error) {
            console.error('Error joining game:', error)
            if (error.response && error.response.status === 400 && error.response.data.error === 'Game is already finished') {
                setError('This game has already finished. Please start a new game.')
            } else {
                setError('Error joining game. Please check the game ID and try again.')
            }
            clearUrlParameters()
        }
    }

    const fetchGameState = async () => {
        try {
            const response = await axios.get(`${API_URL}/game/${gameId}`)
            setGameState(response.data)

            // Reset choice when a new round starts
            if (response.data.status === 'round_active' && !response.data.choices[player]) {
                setChoice(null)
            }
        } catch (error) {
            console.error('Error fetching game state:', error)
            setError('Error fetching game state. The game might not exist.')
            clearUrlParameters()
        }
    }

    const makeChoice = async (selectedChoice) => {
        if (gameState.status !== 'round_active') {
            console.log('Cannot make a choice. Game is not in active round state.')
            return
        }
        setChoice(selectedChoice)
        try {
            await axios.post(`${API_URL}/game/${gameId}/choice`, {
                player,
                choice: selectedChoice,
            })
        } catch (error) {
            console.error('Error making choice:', error)
            if (error.response && error.response.status === 400 && error.response.data.error === 'Game is already finished') {
                setError('This game has already finished. Please start a new game.')
                clearUrlParameters()
            } else {
                setError('Error making choice. Please try again.')
            }
        }
    }

    const renderGame = () => {
        if (!gameState) return <p>Loading game state...</p>

        if (gameState.status === 'waiting') {
            return (
                <div>
                    <p>Waiting for opponent. Share this URL with your opponent:</p>
                    <input
                        type="text"
                        value={`${window.location.origin}${window.location.pathname}?gameId=${gameId}&player=2`}
                        readOnly
                        style={{width: '100%', marginBottom: '10px'}}
                    />
                    <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?gameId=${gameId}&player=2`)}>
                        Copy Game URL
                    </button>
                </div>
            )
        }

        if (gameState.status === 'game_over') {
            const winner = gameState.winner === player ? 'You win!' : 'Opponent wins!'
            return (
                <div>
                    <p>Game Over! {winner}</p>
                    <button onClick={() => {
                        clearUrlParameters()
                        createGame()
                    }}>Start New Game</button>
                </div>
            )
        }

        return (
            <div>
                <p>You are Player {player}</p>
                <p>Round: {gameState.roundNumber}</p>
                <p>Your health: {gameState.health[player]}</p>
                <p>Opponent health: {gameState.health[player === '1' ? '2' : '1']}</p>
                {gameState.status === 'round_complete' && gameState.roundResult && (
                    <p>
                        Round result:
                        {gameState.roundResult === 'tie' ? ' Tie!' :
                            gameState.roundResult === `player${player}` ? ' You won!' : ' Opponent won!'}
                    </p>
                )}
                {gameState.status === 'round_active' && !choice && (
                    <div>
                        <button onClick={() => makeChoice('rock')}>Rock</button>
                        <button onClick={() => makeChoice('paper')}>Paper</button>
                        <button onClick={() => makeChoice('scissors')}>Scissors</button>
                    </div>
                )}
                {gameState.status === 'round_active' && choice && <p>You chose: {choice}. Waiting for opponent...</p>}
                {gameState.status === 'round_complete' && <p>Round complete! Next round starting soon...</p>}
            </div>
        )
    }

    return (
        <div>
            <h1>Rock Paper Scissors Auto Battle</h1>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {!gameId && (
                <div>
                    <button onClick={createGame}>Create New Game</button>
                </div>
            )}
            {gameId && renderGame()}
        </div>
    )
}

export default App