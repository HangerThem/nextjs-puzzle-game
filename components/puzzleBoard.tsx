"use client";

import { useEffect, useState } from "react";
import Puzzle from "@/components/puzzle";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import GridSquare from "@/components/gridSquare";
import PieceHolder from "@/components/pieceHolder";
import Image from "next/image";

let puzzleData = [
  {
    id: "piece1",
    imageSrc: "./image1x1.jpeg",
    correctPosition: { row: 0, col: 0 },
  },
  {
    id: "piece2",
    imageSrc: "./image1x2.jpeg",
    correctPosition: { row: 1, col: 0 },
  },
  {
    id: "piece3",
    imageSrc: "./image1x3.jpeg",
    correctPosition: { row: 2, col: 0 },
  },
  {
    id: "piece4",
    imageSrc: "./image1x4.jpeg",
    correctPosition: { row: 3, col: 0 },
  },
  {
    id: "piece5",
    imageSrc: "./image1x5.jpeg",
    correctPosition: { row: 4, col: 0 },
  },
  {
    id: "piece6",
    imageSrc: "./image2x1.jpeg",
    correctPosition: { row: 0, col: 1 },
  },
  {
    id: "piece7",
    imageSrc: "./image2x2.jpeg",
    correctPosition: { row: 1, col: 1 },
  },
  {
    id: "piece8",
    imageSrc: "./image2x3.jpeg",
    correctPosition: { row: 2, col: 1 },
  },
  {
    id: "piece9",
    imageSrc: "./image2x4.jpeg",
    correctPosition: { row: 3, col: 1 },
  },
  {
    id: "piece10",
    imageSrc: "./image2x5.jpeg",
    correctPosition: { row: 4, col: 1 },
  },
  {
    id: "piece11",
    imageSrc: "./image3x1.jpeg",
    correctPosition: { row: 0, col: 2 },
  },
  {
    id: "piece12",
    imageSrc: "./image3x2.jpeg",
    correctPosition: { row: 1, col: 2 },
  },
  {
    id: "piece13",
    imageSrc: "./image3x3.jpeg",
    correctPosition: { row: 2, col: 2 },
  },
  {
    id: "piece14",
    imageSrc: "./image3x4.jpeg",
    correctPosition: { row: 3, col: 2 },
  },
  {
    id: "piece15",
    imageSrc: "./image3x5.jpeg",
    correctPosition: { row: 4, col: 2 },
  },
  {
    id: "piece16",
    imageSrc: "./image4x1.jpeg",
    correctPosition: { row: 0, col: 3 },
  },
  {
    id: "piece17",
    imageSrc: "./image4x2.jpeg",
    correctPosition: { row: 1, col: 3 },
  },
  {
    id: "piece18",
    imageSrc: "./image4x3.jpeg",
    correctPosition: { row: 2, col: 3 },
  },
  {
    id: "piece19",
    imageSrc: "./image4x4.jpeg",
    correctPosition: { row: 3, col: 3 },
  },
  {
    id: "piece20",
    imageSrc: "./image4x5.jpeg",
    correctPosition: { row: 4, col: 3 },
  },
];

interface PuzzleProps {
  id: string;
  imageSrc: string;
  correctPosition: {
    row: number;
    col: number;
  };
}

interface Mode {
  mode: "easy" | "medium" | "hard";
}

const PuzzleBoard = () => {
  const [grid, setGrid] = useState<(PuzzleProps | null)[][]>(
    Array(5)
      .fill(null)
      .map(() => Array(4).fill(null))
  );
  const [isPuzzleCorrect, setIsPuzzleCorrect] = useState(false);
  const [puzzlePieces, setPuzzlePieces] = useState(puzzleData);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode["mode"]>("easy");
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (!isPuzzleCorrect) {
      intervalId = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 100);
      }, 100);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPuzzleCorrect]);

  const timeConvertor = (millisec: number) => {
    const minutes = Math.floor(millisec / 60000)
      .toString()
      .padStart(2, "0");
    const seconds = ((millisec % 60000) / 1000)
      .toFixed(0)
      .toString()
      .padStart(2, "0");
    const milliseconds = (millisec % 1000)
      .toString()
      .substring(0, 2)
      .padEnd(2, "0");

    return `${minutes}:${seconds}:${milliseconds}`;
  };

  const handleDrop = (pieceId: string, row: number, col: number) => {
    setGrid((prev) => {
      const newGrid = [...prev];
      for (let i = 0; i < newGrid.length; i++) {
        for (let j = 0; j < newGrid[i].length; j++) {
          if (newGrid[i][j] && newGrid[i][j]?.id === pieceId) {
            newGrid[i][j] = null;
          }
        }
      }
      const piece = puzzleData.find((piece) => piece.id === pieceId);
      if (piece) {
        newGrid[row][col] = piece;
      }

      return newGrid;
    });
  };

  const handleVerify = () => {
    const isCorrect = grid.every((row, i) =>
      row.every(
        (piece, j) =>
          piece === null ||
          (piece.correctPosition.row === i && piece.correctPosition.col === j)
      )
    );

    if (isCorrect) {
      setIsPuzzleCorrect(true);
    } else if (mode === "easy") {
      setGrid((prev) => {
        const newGrid = [...prev];
        for (let i = 0; i < newGrid.length; i++) {
          for (let j = 0; j < newGrid[i].length; j++) {
            if (
              newGrid[i][j] &&
              (newGrid[i][j]?.correctPosition.row !== i ||
                newGrid[i][j]?.correctPosition.col !== j)
            ) {
              newGrid[i][j] = null;
            }
          }
        }
        return newGrid;
      });
    } else {
      reset();
    }
  };

  const handleRemove = (pieceId: string) => {
    setGrid((prev) => {
      const newGrid = [...prev];
      for (let i = 0; i < newGrid.length; i++) {
        for (let j = 0; j < newGrid[i].length; j++) {
          if (newGrid[i][j] && newGrid[i][j]?.id === pieceId) {
            newGrid[i][j] = null;
          }
        }
      }
      return newGrid;
    });
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (mode === "hard") {
      intervalId = setInterval(() => {
        setPuzzlePieces((prev) => shuffle([...prev]));
      }, 5000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [mode]);

  const handleChange = (value: Mode["mode"]) => {
    setMode(value);
    reset();
  };

  const shuffle = (array: any[]) => {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  const reset = () => {
    setElapsedTime(0);
    setGrid(
      Array(5)
        .fill(null)
        .map(() => Array(4).fill(null))
    );
    setIsPuzzleCorrect(false);
    setPuzzlePieces(shuffle([...puzzlePieces]));
  };

  useEffect(() => {
    setPuzzlePieces(shuffle([...puzzlePieces]));
    setLoading(false);
  }, []);

  if (isPuzzleCorrect) {
    return (
      <div className="solved-container">
        <h1 className="final-time">Your time: {timeConvertor(elapsedTime)}</h1>
        <Image
          src="/solvedPuzzle.jpeg"
          alt="puzzle solved"
          width={500}
          height={500}
          className="solved-image"
        />
        <button onClick={reset} className="success full-width">
          Play Again
        </button>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <h1 className="timer">{timeConvertor(elapsedTime)}</h1>
      <div className="grid">
        {grid.map((row, i) =>
          row.map((piece, j) => (
            <GridSquare
              key={`${i}-${j}`}
              onDrop={(id) => handleDrop(id, i, j)}
              piece={piece}
              position={{ row: i, col: j }}
            />
          ))
        )}
      </div>
      <div className="buttons">
        <div>
          <button
            onClick={() => handleChange("easy")}
            className={`${mode === "easy" ? "" : "inactive"} success`}
          >
            Easy
          </button>
          <button
            onClick={() => handleChange("medium")}
            className={`${mode === "medium" ? "" : "inactive"} warning`}
          >
            Medium
          </button>
          <button
            onClick={() => handleChange("hard")}
            className={`${mode === "hard" ? "" : "inactive"} danger`}
          >
            Hard
          </button>
        </div>
        <div>
          <button
            onClick={handleVerify}
            disabled={!grid.flat().every(Boolean)}
            className="success"
          >
            Verify
          </button>
          <button onClick={reset} className="danger">
            Reset
          </button>
        </div>
      </div>
      <PieceHolder onDrop={handleRemove}>
        {loading ? (
          <h1>Loading...</h1>
        ) : (
          puzzlePieces
            .filter(
              (piece) =>
                !grid.flat().some((gridPiece) => gridPiece?.id === piece.id)
            )
            .map((piece) => (
              <Puzzle
                key={piece.id}
                id={piece.id}
                imageSrc={piece.imageSrc}
                correctPosition={piece.correctPosition}
              />
            ))
        )}
      </PieceHolder>
    </DndProvider>
  );
};

export default PuzzleBoard;
