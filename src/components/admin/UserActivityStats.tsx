import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Clock, Activity } from 'lucide-react';

export default function UserActivityStats() {
  const { users } = useAuthStore();

  const activityData = users.map(user => ({
    name: user.name,
    totalTime: user.totalLoginTime || 0,
    lastActive: user.lastActive
  }));

  return (
    <div className="bg-white rounded-xl shadow-premium p-6">
      <h2 className="text-lg font-semibold text-navy mb-6">使用者活動統計</h2>
      
      <div className="space-y-6">
        <div className="h-80">
          <BarChart
            width={800}
            height={300}
            data={activityData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalTime" name="使用時長 (分鐘)" fill="rgb(6,28,64)" />
          </BarChart>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-navy mb-4">最近活動記錄</h3>
          <div className="space-y-2">
            {users.map(user => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-full">
                    <Clock className="w-4 h-4 text-navy" />
                  </div>
                  <div>
                    <p className="font-medium text-navy">{user.name}</p>
                    <p className="text-sm text-gray-500">
                      {user.role === 'ADMIN' ? '總管理者' : 
                       user.role === 'MANAGER' ? '管理者' :
                       user.role === 'SERVICE_LEADER' ? '外場幹部' :
                       user.role === 'BAR_LEADER' ? '內場幹部' :
                       user.role === 'SERVICE' ? '外場人員' :
                       user.role === 'BAR' ? '吧檯人員' :
                       user.role === 'NEW_SERVICE' ? '外場新進人員' : '吧檯新進人員'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    最後活動：{user.lastActive ? format(new Date(user.lastActive), 'yyyy/MM/dd HH:mm') : '尚未登入'}
                  </p>
                  <p className="text-sm text-gray-600">
                    總使用時長：{Math.round(user.totalLoginTime || 0)} 分鐘
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}