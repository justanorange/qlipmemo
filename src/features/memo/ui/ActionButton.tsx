interface ActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  text: string;
  color: 'red' | 'blue' | 'yellow';
  isActive?: boolean;
  fullWidth?: boolean;
}

export function ActionButton({ 
  onClick,
  icon,
  text,
  color,
  isActive,
  fullWidth = true 
}: ActionButtonProps) {
  const colorClasses = {
    red: 'bg-red-800 border-t-red-700 dark:bg-red-950 dark:border-t-red-900',
    blue: 'bg-sky-800 border-t-sky-700 dark:bg-sky-950 dark:border-t-sky-700',
    yellow: 'bg-yellow-500 border-t-yellow-400 dark:bg-yellow-500 dark:border-t-yellow-400'
  };

  const activeColorClasses = {
    red: 'bg-gray-800 border-t-red-700 dark:bg-zinc-800 dark:border-t-red-900',
    blue: 'bg-gray-800 border-t-sky-700 dark:bg-zinc-800 dark:border-t-sky-700',
    yellow: 'bg-yellow-500 border-t-yellow-400 dark:bg-yellow-500 dark:border-t-yellow-400'
  };

  return (
    <button
      onClick={onClick}
      className={`
        flex ${fullWidth ? 'flex-1' : 'px-7'} justify-center items-center gap-1.5 py-6
        border-t-3 text-center capitalize text-base tracking-tight font-bold text-white
        ${isActive ? activeColorClasses[color] : colorClasses[color]}
      `}
    >
      {icon}
      {text !== '' && (
        <span>{text}</span>
      )}
    </button>
  );
}
