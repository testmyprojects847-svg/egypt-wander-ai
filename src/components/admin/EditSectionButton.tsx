import { Pencil } from 'lucide-react';

interface EditSectionButtonProps {
  label: string;
  onClick: () => void;
}

export function EditSectionButton({ label, onClick }: EditSectionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded text-primary text-xs font-playfair tracking-wider uppercase transition-colors"
    >
      <Pencil className="w-3 h-3" />
      {label}
    </button>
  );
}
