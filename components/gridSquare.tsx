import { useDrop } from "react-dnd";
import Puzzle from "@/components/puzzle";

interface PuzzleProps {
  id: string;
  imageSrc: string;
  correctPosition: {
    row: number;
    col: number;
  };
}

interface GridSquareProps {
  onDrop: (id: string) => void;
  piece: PuzzleProps | null;
  position: {
    row: number;
    col: number;
  };
}

const GridSquare: React.FC<GridSquareProps> = ({ onDrop, piece, position }) => {
  const [, drop] = useDrop({
    accept: "PIECE",
    drop: (item: { id: string }) => onDrop(item.id),
  });

  return (
    <div
      ref={drop}
      className={`grid-square ${position.row % 2 === position.col % 2 ? "dark" : "light"}`}
    >
      {piece && (
        <Puzzle
          id={piece.id}
          imageSrc={piece.imageSrc}
          correctPosition={piece.correctPosition}
        />
      )}
    </div>
  );
};

export default GridSquare;
