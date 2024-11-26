import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useTrainingStore } from '../../store/trainingStore';
import { TrainingCategory, ContentType } from '../../types/training';
import { X, Plus, GripVertical, Type, Video } from 'lucide-react';

interface TrainingModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId?: string;
}

export default function TrainingModuleModal({
  isOpen,
  onClose,
  moduleId
}: TrainingModuleModalProps) {
  const { user } = useAuthStore();
  const { addModule, updateModule, addContent } = useTrainingStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TrainingCategory>('basic');
  const [duration, setDuration] = useState('');
  const [contents, setContents] = useState<Array<{
    type: ContentType;
    content: string;
    order: number;
  }>>([]);

  const handleAddContent = (type: ContentType) => {
    setContents([
      ...contents,
      { type, content: '', order: contents.length }
    ]);
  };

  const handleContentChange = (index: number, content: string) => {
    const newContents = [...contents];
    newContents[index].content = content;
    setContents(newContents);
  };

  const handleRemoveContent = (index: number) => {
    setContents(contents.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const moduleData = {
      title,
      description,
      category,
      duration,
      createdBy: user.id
    };

    const id = moduleId || addModule(moduleData);
    contents.forEach((content) => {
      addContent(id, content);
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-navy/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-premium p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-navy">
            {moduleId ? '編輯教學內容' : '新增教學內容'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-navy mb-1">
              標題
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">
              描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-primary h-24"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                類別
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TrainingCategory)}
                className="input-primary"
                required
              >
                <option value="basic">基礎訓練</option>
                <option value="service">服務技能</option>
                <option value="product">產品知識</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                預計時長
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="input-primary"
                placeholder="例：30分鐘"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-navy">
                教學內容
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAddContent('text')}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Type className="w-4 h-4" />
                  添加文字
                </button>
                <button
                  type="button"
                  onClick={() => handleAddContent('video')}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  添加影片
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {contents.map((content, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <button
                    type="button"
                    className="mt-2 text-gray-400 hover:text-gray-600"
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>
                  <div className="flex-1">
                    {content.type === 'text' ? (
                      <textarea
                        value={content.content}
                        onChange={(e) => handleContentChange(index, e.target.value)}
                        className="input-primary h-32"
                        placeholder="輸入文字內容..."
                      />
                    ) : (
                      <input
                        type="url"
                        value={content.content}
                        onChange={(e) => handleContentChange(index, e.target.value)}
                        className="input-primary"
                        placeholder="輸入影片連結..."
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveContent(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              取消
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {moduleId ? '更新' : '建立'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}