import React, { useState, useEffect, useCallback } from 'react';
import { Plane, Zap } from 'lucide-react';

interface GameObject {
  x: number;
  y: number;
}

const Game: React.FC = () => {
  const [player, setPlayer] = useState<GameObject>({ x: 200, y: 380 });
  const [enemies, setEnemies] = useState<GameObject[]>([]);
  const [bullets, setBullets] = useState<GameObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const movePlayer = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;
    setPlayer(prev => {
      let newX = prev.x;
      if (e.key === 'ArrowLeft') newX = Math.max(0, prev.x - 10);
      if (e.key === 'ArrowRight') newX = Math.min(380, prev.x + 10);
      return { ...prev, x: newX };
    });
  }, [gameOver]);

  const shoot = useCallback(() => {
    if (gameOver) return;
    setBullets(prev => [...prev, { x: player.x + 15, y: player.y }]);
  }, [player, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', movePlayer);
    window.addEventListener('keydown', e => {
      if (e.code === 'Space') shoot();
    });
    return () => {
      window.removeEventListener('keydown', movePlayer);
      window.removeEventListener('keydown', shoot);
    };
  }, [movePlayer, shoot]);

  useEffect(() => {
    if (gameOver) return;
    const gameLoop = setInterval(() => {
      // Move bullets
      setBullets(prev => prev.filter(b => b.y > 0).map(b => ({ ...b, y: b.y - 5 })));

      // Move enemies
      setEnemies(prev => {
        const newEnemies = prev.map(e => ({ ...e, y: e.y + 1 }));
        if (Math.random() < 0.02) {
          newEnemies.push({ x: Math.random() * 380, y: 0 });
        }
        return newEnemies;
      });

      // Check collisions
      setEnemies(prev => {
        const newEnemies = prev.filter(enemy => {
          const hitByBullet = bullets.some(bullet =>
            Math.abs(bullet.x - enemy.x) < 20 && Math.abs(bullet.y - enemy.y) < 20
          );
          if (hitByBullet) {
            setScore(s => s + 10);
            return false;
          }
          return true;
        });
        return newEnemies;
      });

      // Check game over
      if (enemies.some(enemy => Math.abs(enemy.x - player.x) < 20 && Math.abs(enemy.y - player.y) < 20)) {
        setGameOver(true);
      }
    }, 20);

    return () => clearInterval(gameLoop);
  }, [bullets, enemies, player, gameOver]);

  const restartGame = () => {
    setPlayer({ x: 200, y: 380 });
    setEnemies([]);
    setBullets([]);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="relative w-[400px] h-[400px] bg-gray-800 border-4 border-gray-700">
      {gameOver ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75">
          <h2 className="text-3xl font-bold mb-4">游戏结束</h2>
          <p className="text-xl mb-4">得分: {score}</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={restartGame}
          >
            重新开始
          </button>
        </div>
      ) : (
        <>
          <div className="absolute top-2 left-2 text-lg">得分: {score}</div>
          <Plane
            className="absolute text-blue-500"
            style={{ left: `${player.x}px`, top: `${player.y}px` }}
            size={40}
          />
          {enemies.map((enemy, index) => (
            <Plane
              key={index}
              className="absolute text-red-500"
              style={{ left: `${enemy.x}px`, top: `${enemy.y}px` }}
              size={30}
            />
          ))}
          {bullets.map((bullet, index) => (
            <Zap
              key={index}
              className="absolute text-yellow-500"
              style={{ left: `${bullet.x}px`, top: `${bullet.y}px` }}
              size={20}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Game;