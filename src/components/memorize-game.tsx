import clsx from "clsx";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
type Card = {
  id: number;
  number: number;
};
function MemorizeGame() {
  const [gridSize, setGridSize] = useState<number>(4);

  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [disabled, setDisabled] = useState(false);

  const [won, setWon] = useState(true);

  function handleGridSizeChange(e: ChangeEvent<HTMLInputElement>) {
    const size = parseInt(e.target.value);
    if (size >= 2 && size <= 10) setGridSize(size);
  }

  const initializeGame = useCallback(() => {
    const totalCards = gridSize ** 2;
    const pairCount = Math.floor(totalCards / 2);
    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);

    const shuffledCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((number, index) => ({
        id: index,
        number,
      }));

    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setDisabled(false);
    setWon(false);
  }, [gridSize]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setWon(true);
    }
  }, [solved, cards]);

  function handleClick(id: number) {
    if (disabled || won) return;

    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }

    if (flipped.length === 1) {
      setDisabled(true);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);
        // check match logic
        checkMatch(id);
      } else {
        setFlipped([]);
        setDisabled(false);
      }
    }
  }

  function checkMatch(secondId: number) {
    const [firstId] = flipped;

    if (cards[firstId].number === cards[secondId].number) {
      setSolved([...solved, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
    } else {
      // 延时翻转（给用户一点记忆的时间）
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  }

  function isFlipped(id: number) {
    return flipped.includes(id) || solved.includes(id);
  }

  function isSolved(id: number) {
    return solved.includes(id);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Memorize Game</h1>
      {/* input */}
      <div className="mb-4">
        <label htmlFor="gridSize" className="mr-2">
          Grid Size: (max 10)
        </label>
        <input
          className="border-2 border-gray-300 p-2 rounded py-1"
          id="gridSize"
          type="number"
          min={2}
          max={10}
          value={gridSize}
          onChange={handleGridSizeChange}
        />
      </div>

      {/* Game Board */}
      <div
        className={clsx(`grid gap-2 mb-4 grid-cols-${gridSize}`)}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))`,
          width: `min(100%, ${gridSize * 5.5}rem)`,
        }}
      >
        {cards?.map((card, index) => {
          return (
            <div
              onClick={() => handleClick(index)}
              className={clsx(
                "aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-300",
                isFlipped(card.id)
                  ? isSolved(card.id)
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-400"
              )}
              key={card.id}
            >
              {isFlipped(card.id) ? card.number : "?"}
            </div>
          );
        })}
      </div>

      {/* Result */}
      {won && (
        <div className="mt-4 text-4xl font-bold text-green-600 animate-bounce">
          You Won!
        </div>
      )}
      {/* MemorizeGame */}

      <button
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        onClick={initializeGame}
      >
        {won ? "Play Again" : "Reset"}
      </button>
    </main>
  );
}

export default MemorizeGame;
