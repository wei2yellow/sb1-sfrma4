import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from './ui/Button';

export function AddToHomeScreen() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-white rounded-lg shadow-premium p-4 animate-slide-in md:max-w-sm md:left-4 md:right-auto">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-navy">加入主畫面</h3>
          <p className="text-sm text-gray-500 mt-1">
            將應用程式加入主畫面，方便下次使用
          </p>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-4">
        <Button
          onClick={handleInstall}
          className="w-full"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          加入主畫面
        </Button>
      </div>
    </div>
  );
}