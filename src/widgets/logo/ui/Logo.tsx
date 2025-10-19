import { useUIStore } from '@/shared/lib/stores/uiStore';

export const Logo = () => {
  const isLogoSpinning = useUIStore((state) => state.isLogoSpinning);
  
  return (
    <img className={`size-10 ${isLogoSpinning ? 'logo--spinning' : ''}`} src="/logo.svg" alt="Logo" />
  )
}
