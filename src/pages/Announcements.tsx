import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useAnnouncementStore } from '../store/announcementStore';
import { format } from 'date-fns';
import { MessageSquare, CheckCircle, AlertCircle, PlusCircle } from 'lucide-react';

export default function Announcements() {
  const { user } = useAuthStore();
  const {
    announcements,
    markAsRead,
    addQuestion,
    getVisibleAnnouncements
  } = useAnnouncementStore();
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<string | null>(null);
  const [question, setQuestion] = useState('');

  const visibleAnnouncements = user
    ? getVisibleAnnouncements(user.id, user.role)
    : [];

  const handleMarkAsRead = (announcementId: string) => {
    if (user) {
      markAsRead(announcementId, user.id);
    }
  };

  const handleSubmitQuestion = (announcementId: string) => {
    if (user && question.trim()) {
      addQuestion(announcementId, question, user.id);
      setQuestion('');
      setSelectedAnnouncement(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-navy">公告事項</h1>
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => setShowNewModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            新增公告
          </button>
        )}
      </div>

      <div className="space-y-4">
        {visibleAnnouncements.map((announcement) => {
          const isRead = announcement.readBy.some((r) => r.userId === user?.id);
          const hasQuestions = announcement.questions && announcement.questions.length > 0;

          return (
            <div
              key={announcement.id}
              className="bg-white rounded-xl shadow-premium p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-navy">
                    {announcement.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {format(new Date(announcement.createdAt), 'yyyy/MM/dd HH:mm')}
                  </p>
                </div>
                {!isRead && (
                  <button
                    onClick={() => handleMarkAsRead(announcement.id)}
                    className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                    標記已讀
                  </button>
                )}
              </div>

              <div className="prose prose-sm max-w-none mb-4">
                {announcement.content}
              </div>

              {hasQuestions && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-navy mb-2">相關問題</h4>
                  <div className="space-y-2">
                    {announcement.questions?.map((q) => (
                      <div key={q.id} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-navy">{q.question}</p>
                        {q.answer && (
                          <p className="text-sm text-gray-600 mt-2">
                            回覆：{q.answer}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setSelectedAnnouncement(announcement.id)}
                  className="text-sm text-navy hover:text-navy/80 flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  提出疑問
                </button>
              </div>

              {selectedAnnouncement === announcement.id && (
                <div className="mt-4">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="請輸入您的問題..."
                    className="input-primary h-24"
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      onClick={() => setSelectedAnnouncement(null)}
                      className="btn-secondary"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => handleSubmitQuestion(announcement.id)}
                      className="btn-primary"
                    >
                      送出問題
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {visibleAnnouncements.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-premium">
            <AlertCircle className="w-12 h-12 text-navy/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-navy mb-2">
              目前沒有公告
            </h3>
            <p className="text-gray-500">新的公告將會顯示在這裡</p>
          </div>
        )}
      </div>
    </div>
  );
}