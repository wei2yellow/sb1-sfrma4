import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { usePermissions } from '../hooks/usePermissions';
import { useTrainingStore } from '../store/trainingStore';
import TrainingModuleModal from '../components/training/TrainingModuleModal';
import TrainingSchedule from '../components/training/TrainingSchedule';
import { PlusCircle, Search, Filter, Book, Calendar, CheckCircle2, Type, Video, LayoutGrid, List } from 'lucide-react';

export default function NewStaffTraining() {
  const { user } = useAuthStore();
  const { hasPermission } = usePermissions();
  const { modules, getModulesByCategory } = useTrainingStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'schedule'>('grid');
  
  const canManage = hasPermission('MANAGE_CONTENT');
  const canView = true;

  const filteredModules = getModulesByCategory(category).filter(module =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditModule = (moduleId: string) => {
    setSelectedModule(moduleId);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-navy">新進人員教學</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white rounded-lg shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'text-navy bg-navy/5' : 'text-gray-400'} rounded-l-lg`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('schedule')}
              className={`p-2 ${viewMode === 'schedule' ? 'text-navy bg-navy/5' : 'text-gray-400'} rounded-r-lg`}
            >
              <Calendar className="w-5 h-5" />
            </button>
          </div>
          {canManage && (
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              新增教學內容
            </button>
          )}
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="bg-white rounded-xl shadow-premium p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 flex gap-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜尋教學內容..."
                  className="pl-10 input-primary"
                />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-primary w-48"
              >
                <option value="all">所有類別</option>
                <option value="basic">基礎訓練</option>
                <option value="service">服務技能</option>
                <option value="product">產品知識</option>
              </select>
            </div>
            <button className="btn-secondary flex items-center gap-2">
              <Filter className="w-4 h-4" />
              進階篩選
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModules.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy/5 mb-4">
                  <Book className="w-8 h-8 text-navy" />
                </div>
                <h3 className="text-lg font-medium text-navy mb-2">
                  尚無教學內容
                </h3>
                <p className="text-gray-500">
                  {canManage ? '點擊上方「新增教學內容」按鈕來建立第一個教學模組' : '目前沒有可用的教學內容'}
                </p>
              </div>
            ) : (
              filteredModules.map((module) => (
                <div
                  key={module.id}
                  className="bg-white border border-gray-100 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <div className="p-4">
                    <h3 className="font-medium text-navy mb-2">{module.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {module.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {module.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        {module.completedBy?.length || 0} 人完成
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {module.contents.some(c => c.type === 'text') && (
                        <span className="px-2 py-1 text-xs bg-navy/5 text-navy rounded-full flex items-center gap-1">
                          <Type className="w-3 h-3" />
                          文字說明
                        </span>
                      )}
                      {module.contents.some(c => c.type === 'video') && (
                        <span className="px-2 py-1 text-xs bg-navy/5 text-navy rounded-full flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          影片教學
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-between">
                    <button
                      onClick={() => handleEditModule(module.id)}
                      className="text-sm text-navy hover:text-navy/80 transition-colors"
                    >
                      查看詳情
                    </button>
                    {canManage && (
                      <button
                        onClick={() => handleEditModule(module.id)}
                        className="text-sm text-navy hover:text-navy/80 transition-colors"
                      >
                        編輯
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <TrainingSchedule modules={filteredModules} />
      )}

      {showModal && (
        <TrainingModuleModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedModule(null);
          }}
          moduleId={selectedModule || undefined}
        />
      )}
    </div>
  );
}