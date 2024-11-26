import React, { useState } from 'react';
import { useInventoryStore } from '../store/inventoryStore';
import { useAuthStore } from '../store/authStore';
import { usePermissions } from '../hooks/usePermissions';
import { PlusCircle, Search, Filter, Package, AlertTriangle, History } from 'lucide-react';
import SupplierModal from '../components/inventory/SupplierModal';
import ItemModal from '../components/inventory/ItemModal';
import StockCheckModal from '../components/inventory/StockCheckModal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function Inventory() {
  const { user } = useAuthStore();
  const { hasPermission } = usePermissions();
  const { suppliers, items, getLowStockItems } = useInventoryStore();
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  const canManageSuppliers = hasPermission('MANAGE_INVENTORY');
  const canCheckStock = !['NEW_SERVICE', 'NEW_BAR'].includes(user?.role || '');
  
  const lowStockItems = getLowStockItems();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-navy">庫存管理</h1>
        {canManageSuppliers && (
          <button
            onClick={() => setShowSupplierModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            新增廠商
          </button>
        )}
      </div>

      {lowStockItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              庫存警示
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-amber-50 rounded-lg border border-amber-100"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-navy">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        目前庫存：{item.currentStock} {item.unit}
                      </p>
                      <p className="text-sm text-amber-600">
                        安全庫存：{item.safetyStock} {item.unit}
                      </p>
                    </div>
                    {canCheckStock && (
                      <button
                        onClick={() => {
                          setSelectedItem(item.id);
                          setShowStockModal(true);
                        }}
                        className="text-amber-600 hover:text-amber-700"
                      >
                        <History className="w-5 h-5" />
                      </button>
                    )}
                  </div>
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
                placeholder="搜尋品項..."
                className="pl-10 input-primary"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-primary w-48"
            >
              <option value="all">所有類別</option>
              <option value="drink">飲品</option>
              <option value="food">食材</option>
              <option value="package">包材</option>
              <option value="other">其他</option>
            </select>
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            進階篩選
          </button>
        </div>

        {/* Suppliers and Items list will be implemented here */}
      </div>

      {showSupplierModal && (
        <SupplierModal
          isOpen={showSupplierModal}
          onClose={() => {
            setShowSupplierModal(false);
            setSelectedSupplier(null);
          }}
          supplierId={selectedSupplier}
        />
      )}

      {showItemModal && (
        <ItemModal
          isOpen={showItemModal}
          onClose={() => {
            setShowItemModal(false);
            setSelectedItem(null);
          }}
          supplierId={selectedSupplier!}
          itemId={selectedItem}
        />
      )}

      {showStockModal && selectedItem && (
        <StockCheckModal
          isOpen={showStockModal}
          onClose={() => {
            setShowStockModal(false);
            setSelectedItem(null);
          }}
          itemId={selectedItem}
        />
      )}
    </div>
  );
}