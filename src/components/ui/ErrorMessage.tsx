import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message: string;
}

export function ErrorMessage({ 
  title = '發生錯誤', 
  message,
  className,
  ...props 
}: ErrorMessageProps) {
  return (
    <div
      className={cn(
        'rounded-lg bg-red-50 p-4',
        className
      )}
      {...props}
    >
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <div className="mt-1 text-sm text-red-700">{message}</div>
        </div>
      </div>
    </div>
  );
}