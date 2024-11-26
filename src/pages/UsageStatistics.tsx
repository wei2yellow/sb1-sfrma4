import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { UserStatistics } from '../types/statistics';
import { Clock, Users, CheckCircle } from 'lucide-react';

export default function UsageStatistics() {
  const [statistics, setStatistics] = React.useState<UserStatistics[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Fetch statistics data
    setLoading(false);
  }, []);

  const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
    <div className="bg-white rounded-lg shadow-premium p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="p-3 bg-navy/5 rounded-full">
            {icon}
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-lg font-semibold text-navy">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-navy mb-6">使用統計</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard
          title="總使用時長"
          value="123小時"
          icon={<Clock className="h-6 w-6 text-navy" />}
        />
        <StatCard
          title="活躍使用者"
          value="12人"
          icon={<Users className="h-6 w-6 text-navy" />}
        />
        <StatCard
          title="任務完成率"
          value="85%"
          icon={<CheckCircle className="h-6 w-6 text-navy" />}
        />
      </div>

      <div className="bg-white rounded-xl shadow-premium p-6">
        <h2 className="text-lg font-semibold text-navy mb-4">使用時長統計</h2>
        <div className="h-80">
          <BarChart
            width={800}
            height={300}
            data={statistics}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalLoginTime" name="使用時長" fill="rgb(6,28,64)" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}