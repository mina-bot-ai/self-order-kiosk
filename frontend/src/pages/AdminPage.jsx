import React, { useState, useEffect, useCallback } from 'react';

const API = import.meta.env.VITE_API_URL || '';
const ADMIN_TOKEN = 'admin123';

const STATUS_COLORS = {
  received:  'bg-orange-500/20 text-orange-300 border border-orange-500/40',
  preparing: 'bg-blue-500/20   text-blue-300   border border-blue-500/40',
  ready:     'bg-green-500/20  text-green-300  border border-green-500/40',
  completed: 'bg-gray-500/20   text-gray-300   border border-gray-500/40',
};

const NEXT_STATUS = {
  received:  { label: 'Mark Preparing', next: 'preparing' },
  preparing: { label: 'Mark Ready',     next: 'ready' },
  ready:     { label: 'Complete',        next: 'completed' },
};

// ── Login Screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (password === ADMIN_TOKEN) {
      onLogin();
    } else {
      setError('Invalid password');
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-3xl p-10 w-full max-w-sm border border-gray-800 shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🔐</div>
          <h1 className="text-3xl font-black text-white">Admin Panel</h1>
          <p className="text-gray-400 mt-2">Kiosk Management Dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-5 py-4 text-lg focus:outline-none focus:border-orange-400 placeholder-gray-500"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl text-lg font-bold transition-all active:scale-95"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-gray-600 text-xs mt-6">Default password: admin123</p>
      </div>
    </div>
  );
}

// ── Orders Tab ────────────────────────────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/admin/orders`, {
        headers: { 'x-admin-token': ADMIN_TOKEN },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch {
      // backend offline — show empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  async function advanceStatus(orderId, nextStatus) {
    setUpdating(orderId);
    try {
      const id = orderId.replace('#', '');
      await fetch(`${API}/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': ADMIN_TOKEN,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      await fetchOrders();
    } finally {
      setUpdating(null);
    }
  }

  if (loading) {
    return <div className="text-center text-gray-400 py-20 text-lg">Loading orders…</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-3">📋</div>
        <p className="text-gray-400 text-lg">No orders yet. They'll appear here automatically.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map(order => (
        <div key={order.id} className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-white font-black text-xl">{order.id}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[order.status] || STATUS_COLORS.completed}`}>
                  {order.status}
                </span>
                <span className="text-gray-500 text-sm">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="mt-2 text-gray-300 text-sm">
                {(order.items || []).map((item, i) => (
                  <span key={i}>
                    {item.quantity}× {item.name}{item.size && item.size !== 'Regular' ? ` (${item.size})` : ''}
                    {i < order.items.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-orange-400 font-bold text-xl">${(order.total || 0).toFixed(2)}</span>
              {NEXT_STATUS[order.status] && (
                <button
                  onClick={() => advanceStatus(order.id, NEXT_STATUS[order.status].next)}
                  disabled={updating === order.id}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all active:scale-95"
                >
                  {updating === order.id ? '…' : NEXT_STATUS[order.status].label}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Menu Tab ──────────────────────────────────────────────────────────────────
function MenuTab() {
  const [menuData, setMenuData] = useState(null);
  const [customItems, setCustomItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: 'burgers', price: '', description: '', icon: '🍽️' });
  const [saving, setSaving] = useState(false);

  async function fetchMenu() {
    try {
      const res = await fetch(`${API}/api/admin/menu`, {
        headers: { 'x-admin-token': ADMIN_TOKEN },
      });
      if (res.ok) {
        const data = await res.json();
        setMenuData(data);
        setCustomItems(data.customItems || []);
      }
    } catch {
      // offline
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchMenu(); }, []);

  async function handleAddItem(e) {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    setSaving(true);
    try {
      await fetch(`${API}/api/admin/menu/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
        body: JSON.stringify({ ...newItem, price: parseFloat(newItem.price) }),
      });
      setNewItem({ name: '', category: 'burgers', price: '', description: '', icon: '🍽️' });
      setShowAddForm(false);
      await fetchMenu();
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateItem(e) {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);
    try {
      await fetch(`${API}/api/admin/menu/items/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
        body: JSON.stringify(editingItem),
      });
      setEditingItem(null);
      await fetchMenu();
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteItem(id) {
    if (!window.confirm('Delete this item?')) return;
    try {
      await fetch(`${API}/api/admin/menu/items/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': ADMIN_TOKEN },
      });
      await fetchMenu();
    } catch { /* ignore */ }
  }

  if (loading) return <div className="text-center text-gray-400 py-20">Loading menu…</div>;

  const categories = menuData?.categories || [];
  const CATEGORY_OPTIONS = categories.map(c => ({ id: c.id, name: c.name }));

  return (
    <div className="space-y-6">
      {/* Add new item button */}
      <div className="flex justify-end">
        <button
          onClick={() => { setShowAddForm(!showAddForm); setEditingItem(null); }}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
        >
          {showAddForm ? '✕ Cancel' : '+ Add New Item'}
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <form onSubmit={handleAddItem} className="bg-gray-800 rounded-2xl p-6 border border-green-500/40 space-y-4">
          <h3 className="text-white font-bold text-lg">New Menu Item</h3>
          <div className="grid grid-cols-2 gap-4">
            <input required value={newItem.name} onChange={e => setNewItem(p => ({...p, name: e.target.value}))}
              placeholder="Item name *" className="bg-gray-700 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-orange-400 focus:outline-none" />
            <input required type="number" step="0.01" value={newItem.price} onChange={e => setNewItem(p => ({...p, price: e.target.value}))}
              placeholder="Price *" className="bg-gray-700 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-orange-400 focus:outline-none" />
            <select value={newItem.category} onChange={e => setNewItem(p => ({...p, category: e.target.value}))}
              className="bg-gray-700 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-orange-400 focus:outline-none">
              {CATEGORY_OPTIONS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              <option value="custom">Specials</option>
            </select>
            <input value={newItem.icon} onChange={e => setNewItem(p => ({...p, icon: e.target.value}))}
              placeholder="Emoji icon" className="bg-gray-700 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-orange-400 focus:outline-none" />
          </div>
          <textarea value={newItem.description} onChange={e => setNewItem(p => ({...p, description: e.target.value}))}
            placeholder="Description" rows={2}
            className="w-full bg-gray-700 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-orange-400 focus:outline-none resize-none" />
          <button type="submit" disabled={saving}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold transition-all">
            {saving ? 'Saving…' : 'Add Item'}
          </button>
        </form>
      )}

      {/* Custom items section */}
      {customItems.length > 0 && (
        <div>
          <h3 className="text-orange-400 font-bold text-sm uppercase tracking-wider mb-3">Custom / Specials</h3>
          <div className="space-y-2">
            {customItems.map(item => (
              <div key={item.id}>
                {editingItem?.id === item.id ? (
                  <form onSubmit={handleUpdateItem} className="bg-gray-800 rounded-2xl p-5 border border-orange-500/40 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input value={editingItem.name} onChange={e => setEditingItem(p => ({...p, name: e.target.value}))}
                        className="bg-gray-700 text-white rounded-xl px-4 py-2 border border-gray-600 focus:border-orange-400 focus:outline-none" />
                      <input type="number" step="0.01" value={editingItem.price} onChange={e => setEditingItem(p => ({...p, price: parseFloat(e.target.value)}))}
                        className="bg-gray-700 text-white rounded-xl px-4 py-2 border border-gray-600 focus:border-orange-400 focus:outline-none" />
                    </div>
                    <textarea value={editingItem.description} onChange={e => setEditingItem(p => ({...p, description: e.target.value}))}
                      rows={2} className="w-full bg-gray-700 text-white rounded-xl px-4 py-2 border border-gray-600 focus:border-orange-400 focus:outline-none resize-none" />
                    <div className="flex gap-2">
                      <button type="submit" disabled={saving} className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold text-sm">
                        {saving ? '…' : 'Save'}
                      </button>
                      <button type="button" onClick={() => setEditingItem(null)} className="bg-gray-600 text-white px-4 py-2 rounded-xl font-bold text-sm">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon || '🍽️'}</span>
                      <div>
                        <p className="text-white font-semibold">{item.name}</p>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-orange-400 font-bold">${parseFloat(item.price).toFixed(2)}</span>
                      <button onClick={() => { setEditingItem(item); setShowAddForm(false); }}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium">Edit</button>
                      <button onClick={() => handleDeleteItem(item.id)}
                        className="bg-red-900/40 hover:bg-red-800/60 text-red-400 px-3 py-1.5 rounded-lg text-sm font-medium">Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Default menu items (read-only) */}
      {categories.map(cat => (
        <div key={cat.id}>
          <h3 className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-3">
            {cat.icon} {cat.name}
          </h3>
          <div className="space-y-2">
            {cat.items.filter(i => !i.isCustom).map(item => (
              <div key={item.id} className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/60 flex items-center justify-between gap-3 opacity-75">
                <div>
                  <p className="text-white font-medium">{item.name}</p>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 font-bold">${item.price.toFixed(2)}</span>
                  {item.sizes && (
                    <span className="text-gray-600 text-xs">{item.sizes.join(' / ')}</span>
                  )}
                  <span className="text-gray-600 text-xs italic">default</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main AdminPage ─────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍔</span>
          <div>
            <h1 className="text-xl font-black text-white">Kiosk Admin</h1>
            <p className="text-gray-500 text-xs">Management Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href="/" className="text-gray-400 hover:text-white text-sm transition-colors">← Back to Kiosk</a>
          <button
            onClick={() => setLoggedIn(false)}
            className="ml-4 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm transition-all"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-6 pt-6">
        <div className="flex gap-2 mb-6">
          {['orders', 'menu'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-bold text-sm capitalize transition-all ${
                activeTab === tab
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {tab === 'orders' ? '📋 Orders' : '🍽️ Menu'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <main className="px-6 pb-10">
        {activeTab === 'orders' ? <OrdersTab /> : <MenuTab />}
      </main>
    </div>
  );
}
