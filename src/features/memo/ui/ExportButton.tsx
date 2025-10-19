import { Download } from 'lucide-react';

interface ExportButtonProps {
  handleExport: () => void;
};

export function ExportButton({ handleExport }: ExportButtonProps) {
  return (
    <button
      onClick={handleExport}
      className="
        absolute bottom-1 right-1 p-3
        flex justify-center items-center gap-2
        text-black/70 dark:text-white/70 text-center capitalize text-xs tracking-tight font-bold
      "
    >
      <Download size={16} />
      <span>EXPORT</span>
    </button>
  );
}
