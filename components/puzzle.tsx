"use client";

import { useDrag } from "react-dnd";
import { FC } from "react";

interface PuzzleProps {
  id: string;
  imageSrc: string;
  correctPosition: {
    row: number;
    col: number;
  };
}

const Puzzle: FC<PuzzleProps> = ({ id, imageSrc }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "PIECE",
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return <img className="puzzle" src={imageSrc} ref={drag} />;
};

export default Puzzle;
