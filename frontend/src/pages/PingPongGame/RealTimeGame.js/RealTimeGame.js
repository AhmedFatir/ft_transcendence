import React, { useEffect, useState, useRef, useCallback } from 'react';
import useAuth from '../../../hooks/useAuth';
import useFetch from '../../../hooks/useFetch';
import Waiting from '../components/Waiting';
import PlayerInfo from '../components/PlayerInfo';
import ScoreBoard from "../components/ScoreBoard";
import { useNavigate } from 'react-router-dom';
import hell from "../asstes/hell.png";
import forest from "../asstes/forest.png";
import graveyard from "../asstes/graveyard.png";
import avatar1 from '../asstes/avatar1.png';
import avatar2 from '../asstes/avatar2.png';
import exit from "../asstes/right-arrow.png";
import MatchResult from '../components/MatchResult';
import "../stylesheet/game-style.css";
import WaitForReconnection from '../components/WaitForReconnection';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const WS_BACKEND_URL = process.env.REACT_APP_WS_BACKEND_URL;

const RealTimeGame = ({ mode }) => {
    const lastUpdateTime = useRef(0);
    const animationFrameId = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const { auth } = useAuth();
    const [opponentDisconnected, showOpponentDisconnected] = useState(false);
    const [opponent, setOpponent] = useState(null);
    const [endPoint, setEndPoint] = useState("");
    const [background, setBackground] = useState(null);
    const [keys, setKeys] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [player1Id, setPlayer1Id] = useState(null);
    const [player2Id, setPlayer2Id] = useState(null);
    const [showWaiting, setShowWaiting] = useState(false);
    const [startGame, setStartGame] = useState(false);
    const [socket, setSocket] = useState(null);
    const [gameState, setGameState] = useState(null);
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);
    const [gameRunning, setGameRunning] = useState(true);
    const [showExitPopup, setShowExitPopup] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [winner, setWinner] = useState("");
    const [sendGotIt, setSendGotIt] = useState(false);
    const [sendWaiting, setSendWaiting] = useState(false);
    const [gameOver, setGameOver] = useState();
    const [backToLobby, setBackToLobby] = useState(false);
    const [pauseGame, setPauseGame] = useState(false);
    const [message, setMessage] = useState("");
    const [profileData, setProfileData] = useState(null);
    const [won, setWon] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: 1384, height: 696 });

    useEffect(() => {
        switch (mode) {
            case "invite":
                setEndPoint("invite-game-room");
                break;
            case "random":
                setEndPoint("game-room");
                break;
            case "tournament":
                setEndPoint("tournament-room");
                break;
            default:
                setEndPoint("");
        }
    }, [mode]);

    const { data: gameSettings, isLoading: gameSettingsLoading } = useFetch(`${BACKEND_URL}/api/game/game-settings/current-user/`);
    const { data: room } = useFetch(roomId ? `${BACKEND_URL}/api/game/${endPoint}/${roomId}` : null);
    const { data: player1 } = useFetch(player1Id ? `${BACKEND_URL}/user/stats/${player1Id}` : null);
    const { data: player2 } = useFetch(player2Id ? `${BACKEND_URL}/user/stats/${player2Id}` : null);
    const { data: currentUser } = useFetch(`${BACKEND_URL}/user/stats`);

    useEffect(() => {
        if (currentUser) {
            setProfileData(currentUser);
        }
        if (currentUser === player1) {
            setOpponent(player2);
        } else {
            setOpponent(player1);
        }
    }, [currentUser, player1, player2])

    const initializeWebSocket = () => {
        const ws = new WebSocket(`${WS_BACKEND_URL}/ws/game/?token=${auth.accessToken}`);
        ws.onopen = () => ws.send(JSON.stringify({ action: mode}));
        ws.onmessage = handleWebSocketMessage;
        ws.onclose = () => console.log("WebSocket connection closed");
        ws.onerror = (error) => console.error("WebSocket connection error:", error);
        setSocket(ws);
        return () => ws.close();
    };

    const handleWebSocketMessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("WebSocket Message:", data); 
        switch (data.action) {
            case 'start_game':
                startNewGame(data);
                break;
            case 'connected':
                setRoomId(data.room_id);
                setShowWaiting(true);
                break;
            case 'update_game_state':
                setGameState(data.game_state);
                break;
            case 'update_player_movement':
                setGameState(data.game_state);
                break;
            case 'game_over':
                setGameOver(true);
                endGame(data);
                break;
            case "game_canceled":
                setGameOver(true);
                endGame(data);
                break;
            case 'opponent_disconnected':
                if (!gameOver){
                    showOpponentDisconnected(true);
                    handleOpponentDisconnected()
                }
                break;
            case 'opponent_connected':
                showOpponentDisconnected(false);
                setGameState(data.game_state);
                setGameRunning(true);
                setSendGotIt(true);
                break;
            case "reconnected":
                setShowWaiting(false);
                setRoomId(data.room_id);
                setGameState(data.game_state);
                setStartGame(true);
                setGameRunning(true);
                setSendGotIt(true);
                break;
            case "you_won":
                showOpponentDisconnected(false);
                endGame(data);
                break;
            default:
                if (data.message) {
                    alert(data.message);
                }
                break;
        }
    };

    const handleOpponentDisconnected = () => {
        if (!gameOver){
            showOpponentDisconnected(true);
            setSendWaiting(true);
        }
    }
    
    useEffect(() => {
        if (sendWaiting && socket) {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ action: "im_waiting" }));
            } else {
                console.error('WebSocket is not open, unable to send message');
            }
            setSendWaiting(false);
        }
    }, [sendWaiting, socket]);

    useEffect(() => {
        if (sendGotIt && socket) {
            socket.send(JSON.stringify({ action: "got_it" }));
            setSendGotIt(false);
        }
    }, [socket, sendGotIt]);

    useEffect(() => {
        if (gameState) {
            const players = Object.values(gameState.players);
            if (players.length === 2) {
                setPlayer1Id(players[0].id);
                setPlayer2Id(players[1].id);
            }
        }
    }, [gameState]);

    const startNewGame = (data) => {
        setShowWaiting(false);
        setRoomId(data.room_id);
        setPlayer1Id(data.player1_id);
        setPlayer2Id(data.player2_id);
        setGameState(data.game_state);
    };

    const endGame = (data) => {
        setGameRunning(false);
        setWinner(data.winner);
        setShowResult(true);
        if (socket) {
            socket.close();
        }
    };
    
    const calculateCanvasSize = useCallback(() => {
        const containerWidth = window.innerWidth * 0.8;
        const containerHeight = window.innerHeight * 0.7;
        const aspectRatio = 16 / 9;

        let newWidth, newHeight;

        if (containerWidth / containerHeight > aspectRatio) {
            newHeight = containerHeight;
            newWidth = newHeight * aspectRatio;
        } else {
            newWidth = containerWidth;
            newHeight = newWidth / aspectRatio;
        }

        setCanvasSize({ width: Math.floor(newWidth), height: Math.floor(newHeight) });
    }, []);

    useEffect(() => {
        calculateCanvasSize();
        window.addEventListener('resize', calculateCanvasSize);
        return () => window.removeEventListener('resize', calculateCanvasSize);
    }, [calculateCanvasSize]);

    const scaleFactor = useCallback(() => {
        return {
            x: canvasSize.width / gameState.canvas.width,
            y: canvasSize.height / gameState.canvas.height
        };
    }, [canvasSize, gameState]);

    const initializeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas || !gameState) return;

        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        const { ball, net } = gameState;
        const players = Object.values(gameState.players);
        if (players.length >= 2) {
            setScore1(players[0].score || 0);
            setScore2(players[1].score || 0);
        }

        const scale = scaleFactor();

        const drawRect = (x, y, w, h, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(x * scale.x, y * scale.y, w * scale.x, h * scale.y);
        };

        const drawArc = (x, y, r, color) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x * scale.x, y * scale.y, r * Math.min(scale.x, scale.y), 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        };

        const drawRoundedRect = (x, y, width, height, radius) => {
            ctx.beginPath();
            ctx.moveTo((x + radius) * scale.x, y * scale.y);
            ctx.arcTo((x + width) * scale.x, y * scale.y, (x + width) * scale.x, (y + height) * scale.y, radius * Math.min(scale.x, scale.y));
            ctx.arcTo((x + width) * scale.x, (y + height) * scale.y, x * scale.x, (y + height) * scale.y, radius * Math.min(scale.x, scale.y));
            ctx.arcTo(x * scale.x, (y + height) * scale.y, x * scale.x, y * scale.y, radius * Math.min(scale.x, scale.y));
            ctx.arcTo(x * scale.x, y * scale.y, (x + width) * scale.x, y * scale.y, radius * Math.min(scale.x, scale.y));
            ctx.closePath();
            ctx.fill();
        };

        const drawNet = () => {
            for (let i = 0; i <= canvas.height; i += 15 * scale.y) {
                drawRect(net.x, net.y + i / scale.y, net.width, net.height, net.color);
            }
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(22, 22, 37, 0.9)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawNet();

            Object.values(gameState.players).forEach(player => {
                ctx.fillStyle = player.color;
                drawRoundedRect(player.x, player.y, player.width, player.height, 9);
            });

            drawArc(ball.x, ball.y, ball.radius, ball.color);
        };

        const gameLoop = (timestamp) => {
            if (!gameRunning) return;

            const deltaTime = timestamp - lastUpdateTime.current;
            const interpolation = Math.min(1, deltaTime / 16.67);

            render(interpolation);

            lastUpdateTime.current = timestamp;
            animationFrameId.current = requestAnimationFrame(gameLoop);
        };
        animationFrameId.current = requestAnimationFrame(gameLoop);
    }, [gameState, canvasSize, scaleFactor, gameRunning]);

    useEffect(() => {
        if (gameState) {
            initializeCanvas();
        }
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [gameState, initializeCanvas]);

    const handleKeyDown = (evt) => {
        let direction = null;
        switch(evt.key) {
            case 'w':
            case 'ArrowUp':
                direction = 'up'
                break
            case 's':
            case 'ArrowDown':
                direction = 'down'
                break
            default:
                break
        }

        if (direction) {
            sendPlayerMovement(currentUser?.username, direction, canvasSize);
        }
    };

    const sendPlayerMovement = (username, direction, size) => {
        if (socket && username) {
            socket.send(JSON.stringify({
                action: 'player_movement',
                user: username,
                direction: direction,
                canvasSize: size
            }));
        }
    };

    const handleExitGame = () => {
        setPauseGame(true);
        setShowExitPopup(true);
    };

    const confirmExitGame = (confirm) => {
        setShowExitPopup(false);
        if (confirm) {
            setGameRunning(false);
            socket.close();
            navigate('/game', {replace:true})
        } else {
            setPauseGame(false);
        }
    };

    useEffect(() => {
        if (gameSettings && !gameSettingsLoading) {
            setBackground(gameSettings.background === 'hell' ? hell : gameSettings.background === 'forest' ? forest : graveyard);
            setKeys(gameSettings.keys);
        }
    }, [gameSettingsLoading, gameSettings]);

    useEffect(() => {
        if (auth.accessToken) {
            initializeWebSocket();
        }
    }, [auth.accessToken]);

    useEffect(() => {
        if (room) {
            setPlayer1Id(room.player1);
            setPlayer2Id(room.player2);
        }
    }, [room]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [keys, currentUser]);

    useEffect(() => {
        window.onpopstate = () => {
            socket.close();
            navigate('/game', { replace:true});
        };
        window.onbeforeunload = () => {
            socket.close();
            navigate('/game', { replace:true});
        }
    }, [socket])

    useEffect(() => {
        if (gameState) {
            initializeCanvas();
        }
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [gameState]);

    const handleStartGame = () => {
        setSendGotIt(true);
        setStartGame(true);
    }

    const handleBackToLobby = () => {
        setShowResult(false);
        navigate('/game', { replace:true});
    }
    useEffect(() => {
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [socket]);
    return (
        <div className="pingponggame-container random-game" style={{ backgroundImage: `url(${background})` }}>
            {room && player1 && player2 && (
                <div className="player-info-container">
                    <PlayerInfo player1={player1} player2={player2} onStartGame={handleStartGame} socket={socket}/>
                </div>
            )}
            {opponentDisconnected && (
                <WaitForReconnection opponent={opponent}/>
            )}
            {showResult && (
                <MatchResult winner={winner} onBack={handleBackToLobby}/>
            )}
            {showWaiting && (
                <Waiting player={currentUser}/>
            )}
            {startGame && room && player1 && player2 && (
                <>
                    <ScoreBoard
                        user1Score={score1}
                        user2Score={score2}
                        user1={player1}
                        user1Avatar={`${BACKEND_URL}${player1.avatar}`}
                        user2={player2}
                    />
                    <div className="game-container">
                        <canvas className='canvas-container' ref={canvasRef}></canvas>
                    </div>
                </>
            )}
            <button className='exit-game-button' onClick={handleExitGame}>
                <img src={exit} alt="exit" className='exit-logo'/>
            </button>
            {showExitPopup && (
                <div className="exit-popup">
                    <div className="exit-popup-content">
                        <h2>BACK TO LOBBY ?</h2>
                        <div className="exit-popup-buttons">
                            <button onClick={() => confirmExitGame(true)}>Yes</button>
                            <button onClick={() => confirmExitGame(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div> 
    );
};

export default RealTimeGame;
