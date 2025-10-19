import { Github } from 'lucide-react';

import { Logo } from '@/widgets/logo/ui/Logo';

export const Header = () => {
  return (
    <header className="p-6 flex items-center justify-between">
      <div className="flex gap-2">
        <Logo />
        <h1
          className="
            text-4xl
            font-bold
          "
        >
          <span className="text-red-600 dark:text-red-700">Qlip</span><span className="text-sky-600 dark:text-sky-700">Memo</span>
        </h1>
      </div>
      <a href="https://github.com/justanorange/qlipmemo" target="_blank"><Github /></a>
    </header>
  )
}
