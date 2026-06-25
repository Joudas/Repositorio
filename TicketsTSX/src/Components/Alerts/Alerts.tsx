import { useAlertStore } from '@/Store/alertStore';
import { useEffect, useState } from 'react'

export default function Alerts({ message, duration = 3000 }: { message: string, duration?: number }) {
  const [progress, setProgress] = useState(100);
  const { closeAlert } = useAlertStore();

  useEffect(() => {

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (duration / 50));
        if (newProgress <= 0) {
          clearInterval(interval);
          closeAlert();
          return 0;
        }
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div className='absolute top-4 right-4 z-102 w-80 overflow-hidden rounded-lg shadow-lg animate-slide-out-right'>
      <div className={`bg-white ${isError ? 'text-red-500' : 'text-green-500'} px-4 py-3 font-semibold text-sm flex items-center gap-2 `}>
        <svg className='w-5 h-5 shrink-0' fill='currentColor' viewBox='0 0 20 20'>
          <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
        </svg>
        {message}
      </div>
      <div className='h-1 white'>
        <div
          className={`h-full ${isError ? 'bg-red-500' : 'bg-green-500'} transition-all duration-75`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
