import { ActionButton } from './ActionButton';
import { Trash2 } from 'lucide-react';

interface EraseButtonProps {
  onClick: () => void;
  showText?: boolean;
  fullWidth?: boolean;
}

export function EraseButton({ onClick, showText = true, fullWidth = true }: EraseButtonProps) {
  return (
    <ActionButton
      onClick={onClick}
      icon={<Trash2 size={20} />}
      text={showText ? 'ERASE' : ''}
      color="yellow"
      fullWidth={fullWidth}
    />
  );
}
