import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'lg';
}

export function Loading({ size = 'default', className, ...props }: LoadingProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        size === 'sm' && 'p-2',
        size === 'default' && 'p-4',
        size === 'lg' && 'p-8',
        className
      )}
      {...props}
    >
      <Loader2 
        className={cn(
          'animate-spin text-navy',
          size === 'sm' && 'h-4 w-4',
          size === 'default' && 'h-8 w-8',
          size === 'lg' && 'h-12 w-12'
        )} 
      />
    </div>
  );
}