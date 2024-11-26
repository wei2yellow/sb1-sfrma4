import React, { useState } from 'react';
import { PlusCircle, Filter, Search, Award, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface EvaluationRecord {
  id: string;
  employeeName: string;
  type: 'positive' | 'improvement';
  categories: string[];
  description: string;
  createdAt: string;
  createdBy: string;
  visibility: string[];
}

export default function Evaluation() {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [records, setRecords] = useState<EvaluationRecord[]>([]);

  const handleAddRecord = () => {
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-navy">評優與改進記錄</h1>
        <button
          onClick={handleAddRecord}
          className="btn-primary flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          新增評優/改進記錄
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-premium p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 flex gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜尋員工姓名..."
                className="pl-10 input-primary"
              />
            </div>
            <div className="w-48">
              <select className="input-primary">
                <option value="all">所有類型</option>
                <option value="positive">評優記錄</option>
                <option value="improvement">改進記錄</option>
              </select>
            </div>
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            進階篩選
          </button>
        </div>

        <div className="space-y-4">
          {records.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy/5 mb-4">
                <Award className="w-8 h-8 text-navy" />
              </div>
              <h3 className="text-lg font-medium text-navy mb-2">尚無評估記錄</h3>
              <p className="text-gray-500">
                點擊上方「新增評優/改進記錄」按鈕來建立第一筆記錄
              </p>
            </div>
          ) : (
            records.map((record) => (
              <div
                key={record.id}
                className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`p-2 rounded-full ${
                    record.type === 'positive'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  {record.type === 'positive' ? (
                    <Award className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-navy">
                      {record.employeeName}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {format(new Date(record.createdAt), 'yyyy/MM/dd HH:mm')}
                    </span>
                  </div>
                  <div className="flex gap-2 mb-2">
                    {record.categories.map((category) => (
                      <span
                        key={category}
                        className="px-2 py-0.5 text-xs rounded-full bg-navy/5 text-navy"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{record.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-navy/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-premium p-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold text-navy mb-6">
              新增評優/改進記錄
            </h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  員工姓名
                </label>
                <input type="text" className="input-primary" />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  記錄類型
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="positive"
                      className="mr-2"
                    />
                    評優
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="improvement"
                      className="mr-2"
                    />
                    改進
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  評估項目
                </label>
                <div className="flex flex-wrap gap-4">
                  {['效率', '態度', '技能', '團隊合作', '顧客服務'].map(
                    (category) => (
                      <label key={category} className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        {category}
                      </label>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  記錄描述
                </label>
                <textarea
                  className="input-primary h-32"
                  placeholder="請詳細描述評優/改進內容..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  可見範圍
                </label>
                <select className="input-primary">
                  <option value="all_managers">所有管理者可見</option>
                  <option value="specific">指定管理者</option>
                </select>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button type="submit" className="btn-primary">
                  儲存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}