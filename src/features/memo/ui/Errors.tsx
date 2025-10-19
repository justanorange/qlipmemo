interface ErrorsProps {
  error: string | null;
};

export function Errors({ error }: ErrorsProps) {
  return error && (
    <div className="text-red-500 p-3 bg-red-50 dark:bg-red-900/20 mb-0">
      {error}
    </div>
  )
}
