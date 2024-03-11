import './Note.scss';

interface NoteProps {
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
}

const Note = ({
  className = '',
  onClick = () => ({}),
  isActive = false
}: NoteProps) => (
  <button
    className={`note-button ${className} ${isActive && 'note-button--active'}`}
    onClick={onClick}
  />
);

export default Note;
