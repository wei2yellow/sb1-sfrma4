import React from 'react';
import { useAuthStore } from '../store/authStore';
import { ROLE_PERMISSIONS } from '../types/permissions';
import {
  Users,
  ClipboardList,
  Bell,
  MessageSquare,
  CheckCircle2,
  FileText,
  BookOpen,
  Award,
  Settings,
  Lock
} from 'lucide-react';

const roleDescriptions: Record<string, {
  title: string;
  description: string;
  icon: React.ReactNode;
  permissions: {
    title: string;
    description: string;
  }[];
}> = {
  'ADMIN': {
    title: '總管理者',
    description: '擁有系統最高權限，可以管理所有功能和人員',
    icon: <Settings className="w-6 h-6" />,
    permissions: [
      { title: '帳號管理', description: '新增/刪除所有職位的帳號' },
      { title: '使用統計', description: '查看所有人員的系統使用情況和活動記錄' },
      { title: '權限管理', description: '管理和分配各職位的權限' },
      { title: '評優改進', description: '可對二級、三級、四級人員進行評優和改進記錄' },
      { title: '教學管理', description: '編輯和管理所有教學內容' },
      { title: '公告管理', description: '發布全體公告和重要通知' },
      { title: '任務管理', description: '創建和分配所有類型的任務' },
      { title: '排班管理', description: '管理所有人員的排班和工作安排' }
    ]
  },
  'MANAGER': {
    title: '管理者',
    description: '具有大部分管理權限，負責日常營運管理',
    icon: <Users className="w-6 h-6" />,
    permissions: [
      { title: '評優改進', description: '可對二級、三級、四級人員進行評優和改進記錄' },
      { title: '教學管理', description: '編輯和管理教學內容' },
      { title: '公告管理', description: '發布公告和通知' },
      { title: '任務管理', description: '創建和分配任務' },
      { title: '排班管理', description: '管理人員排班' }
    ]
  },
  'SERVICE_LEADER': {
    title: '外場幹部',
    description: '負責外場人員的管理和培訓',
    icon: <Award className="w-6 h-6" />,
    permissions: [
      { title: '評優改進', description: '可對三級、四級人員進行評優和改進記錄' },
      { title: '教學管理', description: '編輯外場相關教學內容' },
      { title: '任務分配', description: '創建和分配外場任務' },
      { title: '排班管理', description: '管理外場人員排班' },
      { title: '庫存管理', description: '管理外場庫存' }
    ]
  },
  'BAR_LEADER': {
    title: '吧檯幹部',
    description: '負責吧檯人員的管理和培訓',
    icon: <Award className="w-6 h-6" />,
    permissions: [
      { title: '評優改進', description: '可對三級、四級人員進行評優和改進記錄' },
      { title: '教學管理', description: '編輯吧檯相關教學內容' },
      { title: '任務分配', description: '創建和分配吧檯任務' },
      { title: '排班管理', description: '管理吧檯人員排班' },
      { title: '庫存管理', description: '管理吧檯庫存' }
    ]
  },
  'SERVICE': {
    title: '外場人員',
    description: '負責外場日常運營工作',
    icon: <ClipboardList className="w-6 h-6" />,
    permissions: [
      { title: '任務執行', description: '執行和回報外場任務' },
      { title: '庫存回報', description: '回報外場庫存情況' },
      { title: '建立事項', description: '建立外場日常和額外事項' }
    ]
  },
  'BAR': {
    title: '吧檯人員',
    description: '負責吧檯日常運營工作',
    icon: <ClipboardList className="w-6 h-6" />,
    permissions: [
      { title: '任務執行', description: '執行和回報吧檯任務' },
      { title: '庫存回報', description: '回報吧檯庫存情況' },
      { title: '建立事項', description: '建立吧檯日常和額外事項' }
    ]
  },
  'NEW_SERVICE': {
    title: '外場新進人員',
    description: '外場實習階段人員',
    icon: <BookOpen className="w-6 h-6" />,
    permissions: [
      { title: '任務執行', description: '執行指派的外場任務' },
      { title: '學習資源', description: '查看外場培訓內容' },
      { title: '提出疑問', description: '對公告或任務提出疑問' }
    ]
  },
  'NEW_BAR': {
    title: '吧檯新進人員',
    description: '吧檯實習階段人員',
    icon: <BookOpen className="w-6 h-6" />,
    permissions: [
      { title: '任務執行', description: '執行指派的吧檯任務' },
      { title: '學習資源', description: '查看吧檯培訓內容' },
      { title: '提出疑問', description: '對公告或任務提出疑問' }
    ]
  }
};

export default function RolePermissions() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-navy">職位權限說明</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(roleDescriptions).map(([role, data]) => (
          <div
            key={role}
            className="bg-white rounded-xl shadow-premium p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-navy/5 rounded-full">
                {data.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy">{data.title}</h3>
                <p className="text-sm text-gray-600">{data.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-navy flex items-center gap-2">
                <Lock className="w-4 h-4" />
                權限列表
              </h4>
              <div className="grid gap-3">
                {data.permissions.map((permission, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-navy">{permission.title}</p>
                      <p className="text-sm text-gray-600">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}