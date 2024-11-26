import React, { useState } from 'react';
import { useSituationStore } from '../store/situationStore';
import { useAuthStore } from '../store/authStore';
import { usePermissions } from '../hooks/usePermissions';
import { PlusCircle, Search, Filter, AlertCircle, MessageSquare } from 'lucide-react';
import SituationModal from '../components/situations/SituationModal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function ServiceSituations() {
  const { user } = useAuthStore();
  const { hasPermission } = usePermissions();
  const { situations, getSituationsByCategory, getHighPrioritySituations } = useSituationStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedSituation, setSelectedSituation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  const canManage = ['ADMIN', 'MANAGER', 'SERVICE_LEADER', 'BAR_LEADER'].includes(user?.role || '');
  const highPrioritySituations = getHighPrioritySituations();

  const handleEditSituation = (situationId: string) => {
    setSelectedSituation(situationId);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-navy">應對情況</h1>
        {canManage && (
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            新增情況
          </button>
        )}
      </div>

      {highPrioritySituations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              重要情況提醒
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {highPrioritySituations.map((situation) => (
                <div
                  key={situation.id}
                  className="p-4 bg-red-50 rounded-lg border border-red-100"
                >
                  <h3 className="font-medium text-navy mb-2">{situation.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{situation.description}</p>
                  <button
                    onClick={() => handleEditSituation(situation.id)}
                    className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <MessageSquare className="w-4 h-4" />
                    查看應對方法
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-white rounded-xl shadow-premium p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 flex gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜尋情況..."
                className="pl-10 input-primary"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-primary w-48"
            >
              <option value="all">所有類別</option>
              <option value="customer">顧客服務</option>
              <option value="service">服務流程</option>
              <option value="emergency">緊急狀況</option>
              <option value="other">其他</option>
            </select>
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            進階篩選
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getSituationsByCategory(category)
            .filter(situation =>
              situation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              situation.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((situation) => (
              <div
                key={situation.id}
                className="bg-white border border-gray-100 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-navy">{situation.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      situation.priority === 'high' ? 'bg-red-100 text-red-700' :
                      situation.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {situation.priority === 'high' ? '高優先' :
                       situation.priority === 'medium' ? '中優先' : '低優先'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{situation.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {situation.responses?.length || 0} 個應對方法
                    </span>
                    <button
                      onClick={() => handleEditSituation(situation.id)}
                      className="text-sm text-navy hover:text-navy/80 transition-colors"
                    >
                      查看詳情
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {showModal && (
        <SituationModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedSituation(null);
          }}
          situationId={selectedSituation}
        />
      )}
    </div>
  );
}