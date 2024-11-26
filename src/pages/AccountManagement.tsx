import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { PlusCircle, Trash2, Search, Filter, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const roleLabels: Record<string, string> = {
  'SUPER_ADMIN': '超級管理者',
  'ADMIN': '總管理者',
  'MANAGER': '管理者',
  'SERVICE_LEADER': '外場幹部',
  'BAR_LEADER': '內場幹部',
  'SERVICE': '外場人員',
  'BAR': '吧檯人員',
  'NEW_SERVICE': '外場新進人員',
  'NEW_BAR': '吧檯新進人員'
};

interface CreateUserForm {
  username: string;
  password: string;
  name: string;
  role: string;
}

export default function AccountManagement() {
  const { user, users = [], addUser, deleteUser, fetchUsers } = useAuthStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [createForm, setCreateForm] = useState<CreateUserForm>({
    username: '',
    password: '',
    name: '',
    role: 'NEW_SERVICE'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers().catch(console.error);
  }, [fetchUsers]);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createForm.username || !createForm.password || !createForm.name) {
      setError('請填寫所有必填欄位');
      return;
    }

    try {
      await addUser({
        username: createForm.username,
        password: createForm.password,
        name: createForm.name,
        role: createForm.role as UserRole
      });

      setShowCreateModal(false);
      setCreateForm({
        username: '',
        password: '',
        name: '',
        role: 'NEW_SERVICE'
      });
      setError('');
      toast.success('帳號建立成功');
    } catch (err) {
      setError('建立帳號時發生錯誤');
      toast.error('建立帳號失敗');
    }
  };

  const handleDeleteAccount = (userId: string) => {
    setSelectedUser(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      try {
        await deleteUser(selectedUser);
        setShowDeleteModal(false);
        setSelectedUser(null);
        toast.success('帳號刪除成功');
      } catch (error) {
        toast.error('刪除帳號失敗');
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Rest of the component remains the same */}
    </div>
  );
}