import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Smartphone, Download, Share2 } from 'lucide-react';

export default function QRCode() {
  const appUrl = window.location.origin;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '茶自點林口A9員工系統',
          text: '掃描 QR Code 或點擊連結使用系統',
          url: appUrl,
        });
      } catch (error) {
        console.error('分享失敗:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>掃描 QR Code 使用系統</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center">
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="w-48 h-48 mb-4"
            />
            <p className="text-sm text-gray-500 text-center">
              使用手機相機掃描上方 QR Code，<br />
              或點擊下方按鈕將系統加入主畫面
            </p>
          </div>

          <div className="space-y-3">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => window.location.href = appUrl}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              開啟系統
            </Button>

            <Button
              variant="secondary"
              className="w-full"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-2" />
              分享連結
            </Button>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                const link = document.createElement('a');
                link.href = qrCodeUrl;
                link.download = 'qrcode.png';
                link.click();
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              下載 QR Code
            </Button>
          </div>

          <div className="text-sm text-gray-500 space-y-2">
            <h4 className="font-medium text-navy">如何加入主畫面？</h4>
            <div className="space-y-1">
              <p>iOS 使用者：</p>
              <ol className="list-decimal list-inside pl-4">
                <li>使用 Safari 開啟系統</li>
                <li>點擊分享按鈕</li>
                <li>選擇「加入主畫面」</li>
              </ol>
            </div>
            <div className="space-y-1">
              <p>Android 使用者：</p>
              <ol className="list-decimal list-inside pl-4">
                <li>使用 Chrome 開啟系統</li>
                <li>點擊選單按鈕</li>
                <li>選擇「加入主畫面」</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}