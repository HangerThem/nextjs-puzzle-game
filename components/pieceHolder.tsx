import { useDrop } from "react-dnd";

interface PieceHolderProps {
  onDrop: (id: string) => void;
  children?: React.ReactNode;
}

const PieceHolder: React.FC<PieceHolderProps> = ({ onDrop, children }) => {
  const [, drop] = useDrop({
    accept: "PIECE",
    drop: (item: { id: string }) => onDrop(item.id),
  });

  return (
    <div ref={drop} className="piece-holder">
      {children}
    </div>
  );
};

export default PieceHolder;
