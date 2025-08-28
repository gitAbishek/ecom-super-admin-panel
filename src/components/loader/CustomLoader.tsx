import { Loader2 } from 'lucide-react';

interface CustomLoaderProps {
  text?: string;
}

export default function CustomLoader({ text = 'Loading...' }: CustomLoaderProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin mr-2" />
      <span className="text-gray-600 dark:text-gray-400">{text}</span>
    </div>
  );
}
