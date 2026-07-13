import React, { useState, useEffect } from "react";
import api, { fetchProducts, fetchCategories, fetchOrders, fetchCoupons, fetchUsers, fetchShowcase, blockUser as apiBlockUser, deleteUser as apiDeleteUser, updateShowcase, uploadImage, fetchCollections, addCollection, deleteCollection, deleteProduct, updateCollection, updateCategory, deleteAllOrders, resetAllRevenue, resetFund, fetchAdmins, addAdmin, removeAdmin, fetchAdminLogs, clearAdminLogs } from "../api";
import socket from "../socket";
import {
  SquaresFour,
  ShoppingBag,
  Package,
  Tag,
  Image as ImageIcon,
  Gear,
  SignOut,
  FloppyDisk,
  Trash,
  UploadSimple,
  WarningCircle,
  PencilSimple,
  Check,
  X,
  ClipboardText
} from "@phosphor-icons/react";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import AddCategoryModal from "./AddCategoryModal";
import AddCollectionModal from "./AddCollectionModal";
import AddCouponModal from "./AddCouponModal";
import UserOrderHistoryModal from "./UserOrderHistoryModal";
import EditCollectionModal from "./EditCollectionModal";
import EditCategoryModal from "./EditCategoryModal";

function OrderRow({ order, onUpdate }) {
  const [status, setStatus] = useState(order.status || 'Placed');
  const [trackingLink, setTrackingLink] = useState(order.trackingLink || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    try {
      await onUpdate(order._id, { status, trackingLink });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update order.");
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await onUpdate(order._id, { status: 'Cancelled', trackingLink });
        setStatus('Cancelled');
        setIsEditing(false);
      } catch (err) {
        console.error(err);
        alert("Failed to cancel order.");
      }
    }
  };

  const getStatusColor = (s) => {
    switch(s) {
      case 'Delivered': return { bg: '#DCFCE7', color: '#166534' };
      case 'Cancelled': return { bg: '#FEE2E2', color: '#991B1B' };
      case 'Placed': return { bg: '#FEF3C7', color: '#92400E' };
      case 'Confirmed': return { bg: '#DBEAFE', color: '#1E40AF' };
      case 'Shipped': return { bg: '#F3E8FF', color: '#6B21A8' };
      default: return { bg: '#FEF3C7', color: '#92400E' };
    }
  };
  const statusColor = getStatusColor(order.status || 'Placed');

  return (
    <tr>
      <td><span style={{ fontWeight: 700, color: '#1A1A1A' }}>#{order.shortId || order._id.slice(-6).toUpperCase()}</span></td>
      <td>
        <div style={{ fontWeight: 600 }}>{order.user?.name || 'Guest'}</div>
        <div style={{ fontSize: '11px', color: '#71717A', marginTop: '2px' }}>
          {order.user?.phone || (typeof order.shippingAddress === 'string' ? '' : order.shippingAddress?.phone || '')}
        </div>
        <div style={{ fontSize: '11px', color: '#71717A', marginTop: '2px' }}>
          {typeof order.shippingAddress === 'string' ? '' : (order.shippingAddress?.email || '')}
        </div>
      </td>
      <td>
        <div style={{ 
          fontSize: '11px', 
          color: '#3F3F46', 
          maxWidth: '180px' 
        }}>
          {typeof order.shippingAddress === 'string' ? order.shippingAddress : (
            <>
              {order.shippingAddress?.phone ? <div style={{ fontWeight: 600, marginBottom: 2 }}>{order.shippingAddress.phone}</div> : null}
              <div>{order.shippingAddress?.addressLine || 'No address'}</div>
            </>
          )}
        </div>
      </td>
      <td>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '220px' }}>
          {order.items?.slice(0, 3).map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
              {item.product?.images?.[0] ? (
                <img src={item.product.images[0]} alt="" style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} />
              ) : null}
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>
                  {item.product?.name || 'Deleted Product'}
                </div>
                <div style={{ color: '#71717A', fontSize: '10px' }}>
                  x{item.quantity || 1}
                  {item.size ? ` · Size: ${item.size}` : ''}
                  {item.color ? ` · Color: ${item.color}` : ''}
                </div>
              </div>
              <span style={{ fontWeight: 600, flexShrink: 0 }}>₹{item.priceAtTime || item.product?.price || 0}</span>
            </div>
          ))}
          {(order.items?.length || 0) > 3 ? <div style={{ fontSize: '10px', color: '#71717A' }}>+{order.items.length - 3} more</div> : null}
        </div>
      </td>
      <td>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#1A1A1A' }}>
          {order.paymentMethod ? (order.paymentMethod.toLowerCase() === 'cod' || order.paymentMethod.toLowerCase() === 'cash on delivery' ? 'COD' : order.paymentMethod.toUpperCase()) : 'UNKNOWN'}
        </div>
        <div style={{ 
          display: 'inline-block',
          fontSize: '10px', 
          marginTop: '4px', 
          padding: '2px 6px',
          borderRadius: '4px',
          backgroundColor: order.isPaid ? '#DCFCE7' : '#FEF3C7',
          color: order.isPaid ? '#166534' : '#92400E', 
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {order.isPaid ? 'Paid' : 'Unpaid'}
        </div>
      </td>
      <td>
        <div style={{ fontWeight: 500 }}>{new Date(order.createdAt || order.date || Date.now()).toLocaleDateString()}</div>
        <div style={{ fontSize: '11px', color: '#71717A', marginTop: '2px' }}>{new Date(order.createdAt || order.date || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </td>
      <td><span style={{ fontWeight: 700 }}>₹{order.totalAmount}</span></td>
      <td>
        {isEditing ? (
          <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', minWidth: '160px' }}>
            <select className="form-select" style={{ padding: '6px 10px', fontSize: '12px', height: '32px' }} value={status} onChange={e => setStatus(e.target.value)}>
              <option value="Placed">Placed</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <input type="text" className="form-input" style={{ padding: '6px 10px', fontSize: '12px', height: '32px' }} value={trackingLink} onChange={e => setTrackingLink(e.target.value)} placeholder="Tracking Link..." />
            <div style={{ display: 'flex', gap: '4px' }}>
              <button className="btn-action" style={{ padding: '4px', flex: 1, display: 'flex', justifyContent: 'center' }} onClick={handleSave} title="Save">
                <Check size={16} weight="bold" />
              </button>
              <button className="btn-action" style={{ padding: '4px', flex: 1, display: 'flex', justifyContent: 'center', background: '#F4F4F5', color: '#1A1A1A' }} onClick={() => setIsEditing(false)} title="Cancel Edit">
                <X size={16} weight="bold" />
              </button>
              <button className="btn-action" style={{ padding: '4px', flex: 1, display: 'flex', justifyContent: 'center', background: '#FEF2F2', color: '#DC2626' }} onClick={handleCancelOrder} title="Cancel Order">
                <Trash size={16} weight="bold" />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
              <span style={{ 
                padding: '4px 8px', 
                borderRadius: '6px', 
                fontSize: '11px', 
                fontWeight: 800, 
                backgroundColor: statusColor.bg, 
                color: statusColor.color,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {order.status || 'Placed'}
              </span>
              {order.trackingLink ? (
                <a href={order.trackingLink} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}>Track order &rarr;</a>
              ) : (
                <span style={{ fontSize: '11px', color: '#A1A1AA' }}>No tracking</span>
              )}
            </div>
            <button 
              className="btn-outline" 
              style={{ padding: '6px', borderRadius: '8px', border: 'none', background: '#F4F4F5', color: '#71717A' }} 
              onClick={() => {
                setStatus(order.status || 'Placed');
                setTrackingLink(order.trackingLink || '');
                setIsEditing(true);
              }}
              title="Edit Status"
            >
              <PencilSimple size={16} weight="bold" />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

export default function AdminDashboard({ adminUser, onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [selectedProductToEdit, setSelectedProductToEdit] = useState(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [isEditCollectionOpen, setIsEditCollectionOpen] = useState(false);
  const [selectedCollectionToEdit, setSelectedCollectionToEdit] = useState(null);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [selectedCategoryToEdit, setSelectedCategoryToEdit] = useState(null);

  // API States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [adminLogs, setAdminLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Showcase state
  const [showcaseHeadlines, setShowcaseHeadlines] = useState({ main: "", sub: "" });
  const [showcaseSlides, setShowcaseSlides] = useState([
    { id: Date.now(), media: null, linkType: "None" }
  ]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [prodRes, catRes, ordRes, coupRes, userRes, showRes, colRes, adminRes, logsRes] = await Promise.all([
          fetchProducts(), fetchCategories(), fetchOrders(), fetchCoupons(), fetchUsers(), fetchShowcase(), fetchCollections(), fetchAdmins(), fetchAdminLogs()
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
        setCollections(colRes.data);
        setOrders(ordRes.data);
        setCoupons(coupRes.data);
        setUsers(userRes.data);
        if (adminRes) setAdmins(adminRes.data);
        if (logsRes) setAdminLogs(logsRes.data);
        setShowcaseHeadlines({ main: showRes.data.mainHeadline, sub: showRes.data.subHeadline });
        setShowcaseSlides(showRes.data.slides && showRes.data.slides.length > 0 ? showRes.data.slides : [{ id: Date.now(), media: null, linkType: "None", platform: "All" }]);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  // Real-time socket listeners for admin dashboard
  useEffect(() => {
    socket.on('order_placed', (newOrder) => {
      setOrders(prev => [newOrder, ...(Array.isArray(prev) ? prev : [])]);
    });
    socket.on('order_updated', (updatedOrder) => {
      setOrders(prev => Array.isArray(prev) ? prev.map(o => o._id === updatedOrder._id ? updatedOrder : o) : prev);
    });
    socket.on('product_added', (newProd) => {
      setProducts(prev => [newProd, ...(Array.isArray(prev) ? prev : [])]);
    });
    socket.on('product_updated', (updatedProd) => {
      setProducts(prev => Array.isArray(prev) ? prev.map(p => p._id === updatedProd._id ? updatedProd : p) : prev);
    });
    socket.on('product_deleted', (prodId) => {
      setProducts(prev => Array.isArray(prev) ? prev.filter(p => p._id !== prodId) : prev);
    });
    socket.on('category_added', () => { fetchCategories().then(r => setCategories(r.data)).catch(() => {}); });
    socket.on('category_updated', () => { fetchCategories().then(r => setCategories(r.data)).catch(() => {}); });
    socket.on('category_deleted', () => { fetchCategories().then(r => setCategories(r.data)).catch(() => {}); });
    socket.on('collection_added', () => { fetchCollections().then(r => setCollections(r.data)).catch(() => {}); });
    socket.on('collection_updated', () => { fetchCollections().then(r => setCollections(r.data)).catch(() => {}); });
    socket.on('collection_deleted', () => { fetchCollections().then(r => setCollections(r.data)).catch(() => {}); });
    socket.on('coupon_added', () => { fetchCoupons().then(r => setCoupons(r.data)).catch(() => {}); });
    socket.on('coupon_deleted', () => { fetchCoupons().then(r => setCoupons(r.data)).catch(() => {}); });
    socket.on('user_updated', () => { fetchUsers().then(r => setUsers(r.data)).catch(() => {}); });
    socket.on('user_deleted', () => { fetchUsers().then(r => setUsers(r.data)).catch(() => {}); });
    socket.on('admin_added', () => { fetchAdmins().then(r => setAdmins(r.data)).catch(() => {}); });
    socket.on('admin_deleted', () => { fetchAdmins().then(r => setAdmins(r.data)).catch(() => {}); });
    socket.on('showcase_updated', () => {
      fetchShowcase().then(r => {
        setShowcaseHeadlines({ main: r.data.mainHeadline, sub: r.data.subHeadline });
        setShowcaseSlides(r.data.slides && r.data.slides.length > 0 ? r.data.slides : [{ id: Date.now(), media: null, linkType: "None", platform: "All" }]);
      }).catch(() => {});
    });
    return () => {
      socket.off('order_placed');
      socket.off('order_updated');
      socket.off('product_added');
      socket.off('product_updated');
      socket.off('product_deleted');
      socket.off('category_added');
      socket.off('category_updated');
      socket.off('category_deleted');
      socket.off('collection_added');
      socket.off('collection_updated');
      socket.off('collection_deleted');
      socket.off('coupon_added');
      socket.off('coupon_deleted');
      socket.off('user_updated');
      socket.off('user_deleted');
      socket.off('admin_added');
      socket.off('admin_deleted');
      socket.off('showcase_updated');
    };
  }, []);

  const handleAddSlide = () => {
    if (showcaseSlides.length < 5) {
      setShowcaseSlides([...showcaseSlides, { id: Date.now(), media: null, linkType: "None", platform: "All" }]);
    }
  };

  const handleRemoveSlide = (id) => {
    setShowcaseSlides(showcaseSlides.filter(s => s.id !== id));
  };

  const handleSlideChange = (id, field, value) => {
    setShowcaseSlides(showcaseSlides.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSaveShowcase = async () => {
    try {
      const compiledSlides = [];
      for (const slide of showcaseSlides) {
        let mediaUrl = slide.mediaUrl;
        if (slide.mediaFile) {
          const res = await uploadImage(slide.mediaFile);
          mediaUrl = res.data.url;
        }
        if (!mediaUrl) continue; // Skip slides without an image
        compiledSlides.push({
          mediaUrl,
          linkType: slide.linkType,
          linkedProductId: slide.linkType === 'Product' ? slide.linkTarget : undefined,
          linkedCollectionName: slide.linkType === 'Collection' ? slide.linkTarget : undefined,
          platform: slide.platform || 'All'
        });
      }
      await updateShowcase({
        mainHeadline: showcaseHeadlines.main,
        subHeadline: showcaseHeadlines.sub,
        slides: compiledSlides
      });
      alert('Showcase saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save showcase');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter(p => p._id !== productId));
      } catch (err) {
        console.error("Failed to delete product", err);
        alert("Failed to delete product");
      }
    }
  };

  // Settings state
  const [resetConfirmStage, setResetConfirmStage] = useState(0); // 0 = default, 1 = confirm, 2 = done
  const [revenueResetStage, setRevenueResetStage] = useState(0);
  const [deleteOrdersStage, setDeleteOrdersStage] = useState(0);

  const [adminEmailInput, setAdminEmailInput] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [fundResetStage, setFundResetStage] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const toggleBlockUser = async (userId) => {
    const userToBlock = users.find(u => u._id === userId);
    if (!userToBlock) return;
    try {
      await apiBlockUser(userId, !userToBlock.isBlocked);
      setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u));
    } catch (err) {
      console.error("Failed to block user", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await apiDeleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const handleUpdateOrder = async (orderId, data) => {
    try {
      await api.put(`/orders/${orderId}`, data);
      const { data: updatedOrders } = await fetchOrders();
      setOrders(updatedOrders);
    } catch (err) {
      console.error("Failed to update order", err);
    }
  };

  const handleResetData = () => {
    if (resetConfirmStage === 0) setResetConfirmStage(1);
    else if (resetConfirmStage === 1) {
      console.log("ALL DATA RESET.");
      setResetConfirmStage(2);
      setTimeout(() => setResetConfirmStage(0), 3000);
    }
  };

  const handleResetRevenue = async () => {
    if (revenueResetStage === 0) setRevenueResetStage(1);
    else if (revenueResetStage === 1) {
      try {
        await resetAllRevenue();
        setRevenueResetStage(2);
        setOrders(prev => prev.map(o => ({ ...o, totalAmount: 0 })));
        setTimeout(() => setRevenueResetStage(0), 3000);
      } catch (err) {
        console.error(err);
        alert("Failed to reset revenue.");
        setRevenueResetStage(0);
      }
    }
  };

  const handleDeleteAllOrders = async () => {
    if (deleteOrdersStage === 0) setDeleteOrdersStage(1);
    else if (deleteOrdersStage === 1) {
      try {
        await deleteAllOrders();
        setDeleteOrdersStage(2);
        setOrders([]);
        setTimeout(() => setDeleteOrdersStage(0), 3000);
      } catch (err) {
        console.error(err);
        alert("Failed to delete orders.");
        setDeleteOrdersStage(0);
      }
    }
  };

  const handleResetFund = async () => {
    if (fundResetStage === 0) setFundResetStage(1);
    else if (fundResetStage === 1) {
      try {
        await resetFund();
        setFundResetStage(2);
        setTimeout(() => setFundResetStage(0), 3000);
      } catch (err) {
        console.error(err);
        alert("Failed to reset fund.");
        setFundResetStage(0);
      }
    }
  };

  const handleViewOrders = (user) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const netRevenue = orders.reduce((acc, o) => acc + (o.status !== 'Cancelled' && o.status !== 'Returned' ? (Number(o.totalAmount) || 0) : 0), 0);
  const lossAndReturns = orders.reduce((acc, o) => acc + (o.status === 'Cancelled' || o.status === 'Returned' ? (Number(o.totalAmount) || 0) : 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? (netRevenue / totalOrders).toFixed(2) : 0;

  return (
    <div className="admin-layout">
      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background-color: #F8F9FA;
          font-family: var(--font-body, 'Outfit', sans-serif);
          color: #1A1A1A;
        }

        /* Sidebar */
        .admin-sidebar {
          width: 250px;
          background-color: #FFFFFF;
          border-right: 1px solid #E4E4E7;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 30px 24px;
          margin-bottom: 10px;
        }

        .brand-logo-box {
          width: 32px;
          height: 32px;
          background-color: #0F0F0F;
          color: #fff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 18px;
        }

        .brand-text {
          font-size: 18px;
          font-weight: 900;
          line-height: 1.1;
          font-family: var(--font-heading, 'Outfit', sans-serif);
          text-transform: lowercase;
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 0 16px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          color: #71717A;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: transparent;
          border: none;
          text-align: left;
          width: 100%;
        }

        .nav-item:hover {
          color: #0F0F0F;
          background: #F4F4F5;
        }

        .nav-item.active {
          background-color: #0F0F0F;
          color: #FFFFFF;
        }

        .nav-item svg {
          font-size: 20px;
        }

        .sidebar-footer {
          padding: 24px 16px;
          border-top: 1px solid #E4E4E7;
        }

        .exit-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: #71717A;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          background: transparent;
          border: none;
          transition: color 0.2s;
          width: 100%;
          text-align: left;
        }

        .exit-btn:hover {
          color: #EF4444;
        }

        /* Main Content */
        .admin-main {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .page-title {
          font-size: 24px;
          font-weight: 800;
          color: #1A1A1A;
        }

        .user-status {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .loading-text {
          font-size: 14px;
          font-weight: 600;
          color: #1A1A1A;
        }

        .avatar-circle {
          width: 36px;
          height: 36px;
          background-color: #E4E4E7;
          border-radius: 50%;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }

        .stat-label {
          font-size: 11px;
          font-weight: 800;
          color: #71717A;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1A1A1A;
          display: flex;
          gap: 4px;
        }
        
        .stat-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #1A1A1A;
        }

        .stat-dot.green { background: #22C55E; }
        .stat-dot.red { background: #EF4444; }

        /* Tables Cards */
        .table-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
          margin-bottom: 24px;
        }

        .table-title {
          font-size: 18px;
          font-weight: 800;
          margin-bottom: 24px;
          color: #1A1A1A;
        }

        .table-title.danger {
          color: #EF4444;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          text-align: left;
          font-size: 11px;
          font-weight: 800;
          color: #71717A;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding-bottom: 16px;
          border-bottom: 1px solid #F4F4F5;
        }

        .data-table td {
          padding: 16px 0;
          font-size: 14px;
          font-weight: 500;
          color: #1A1A1A;
        }
        
        /* Input & Select fields inside dashboard */
        .form-input, .form-select {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #E4E4E7;
          border-radius: 12px;
          font-family: inherit;
          font-size: 14px;
          color: #1A1A1A;
          background-color: #FAFAFA;
          outline: none;
          transition: all 0.2s ease;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02);
        }

        .form-input:focus, .form-select:focus {
          border-color: #0F0F0F;
          background-color: #FFFFFF;
          box-shadow: 0 0 0 4px rgba(15, 15, 15, 0.1);
        }

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%231A1A1A' viewBox='0 0 256 256'%3E%3Cpath d='M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          padding-right: 40px;
        }
        .btn-action {
          background-color: #0F0F0F;
          color: #FFFFFF;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 13px;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-action:hover {
          background-color: #2a2a2a;
        }

        /* Outline Button */
        .btn-outline {
          background-color: transparent;
          color: #1A1A1A;
          padding: 6px 14px;
          border-radius: 99px;
          font-weight: 700;
          font-size: 12px;
          border: 1px solid #E4E4E7;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-outline:hover {
          border-color: #1A1A1A;
          background: #FAFAFA;
        }

        /* Two column layout for categories */
        .split-layout {
          display: flex;
          gap: 24px;
        }
        
        .split-card {
          flex: 1;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .card-header .table-title {
          margin-bottom: 0;
        }

        /* Showcase Styles */
        .showcase-card {
          border: 1px solid #E4E4E7;
          border-radius: 16px;
          padding: 32px;
          background: #FFFFFF;
          margin-bottom: 24px;
          position: relative;
        }

        .showcase-card-title {
          font-size: 16px;
          font-weight: 800;
          color: #1A1A1A;
          margin-bottom: 24px;
        }

        .media-dropzone {
          border: 2px dashed #E4E4E7;
          border-radius: 12px;
          height: 120px;
          width: 320px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #A1A1AA;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .media-dropzone:hover {
          border-color: #0F0F0F;
          color: #0F0F0F;
        }

        .media-dropzone svg {
          margin-bottom: 8px;
        }

        .btn-full-outline {
          width: 100%;
          padding: 16px;
          background: transparent;
          border: 1px solid #E4E4E7;
          border-radius: 12px;
          color: #1A1A1A;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-full-outline:hover {
          background: #FAFAFA;
        }

        .btn-icon {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-delete {
          position: absolute;
          top: 32px;
          right: 32px;
          background: transparent;
          border: none;
          color: #EF4444;
          cursor: pointer;
          padding: 4px;
          border-radius: 8px;
          transition: background 0.2s;
          z-index: 10;
        }
        
        .btn-delete:hover {
          background: #FEE2E2;
        }

        /* Danger Zone Styles */
        .danger-card {
          border: 1px solid #FECACA;
          background: #FEF2F2;
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 24px;
        }

        .danger-title {
          font-size: 16px;
          font-weight: 800;
          color: #DC2626;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .danger-desc {
          font-size: 13px;
          color: #991B1B;
          margin-bottom: 24px;
        }

        .btn-danger {
          background: #EF4444;
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-danger:hover {
          background: #DC2626;
        }

        .btn-danger-outline {
          background: transparent;
          color: #EF4444;
          border: 1px solid #FECACA;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-danger-outline:hover {
          background: #FEE2E2;
          border-color: #FCA5A5;
        }
      `}</style>

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo-box">Z</div>
          <div className="brand-text">
            monthrob<br/>admin
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <SquaresFour weight={activeTab === 'dashboard' ? 'fill' : 'regular'} />
            Dashboard
          </button>
          <button className={`nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            <ShoppingBag weight={activeTab === 'products' ? 'fill' : 'regular'} />
            Products
          </button>
          <button className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
            <SquaresFour weight={activeTab === 'categories' ? 'fill' : 'regular'} />
            Categories
          </button>
          <button className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <Package weight={activeTab === 'orders' ? 'fill' : 'regular'} />
            Orders
          </button>
          <button className={`nav-item ${activeTab === 'coupons' ? 'active' : ''}`} onClick={() => setActiveTab('coupons')}>
            <Tag weight={activeTab === 'coupons' ? 'fill' : 'regular'} />
            Coupons
          </button>
          <button className={`nav-item ${activeTab === 'showcase' ? 'active' : ''}`} onClick={() => setActiveTab('showcase')}>
            <ImageIcon weight={activeTab === 'showcase' ? 'fill' : 'regular'} />
            Showcase
          </button>
          <button className={`nav-item ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>
            <ClipboardText weight={activeTab === 'logs' ? 'fill' : 'regular'} />
            Admin Logs
          </button>
          {/* Requested Settings Option */}
          <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Gear weight={activeTab === 'settings' ? 'fill' : 'regular'} />
            Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="exit-btn" onClick={onLogout}>
            <SignOut weight="bold" />
            Exit Panel
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {activeTab === 'dashboard' && (
          <>
            <header className="page-header">
              <h1 className="page-title">Dashboard Overview</h1>
              <div className="user-status">
                <span className="loading-text">{adminUser?.name || adminUser?.email || "Admin"}</span>
                <div className="avatar-circle"></div>
              </div>
            </header>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">NET REVENUE</div>
                <div className="stat-value">₹{netRevenue.toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">LOSS & RETURNS</div>
                <div className="stat-value" style={{ color: 'var(--color-danger)' }}>₹{lossAndReturns.toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">TOTAL ORDERS</div>
                <div className="stat-value">{totalOrders}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">AVG. ORDER VALUE</div>
                <div className="stat-value">₹{Number(avgOrderValue).toLocaleString()}</div>
              </div>
            </div>

            <div className="table-card">
              <h2 className="table-title">Recent Orders</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>CUSTOMER</th>
                    <th>ADDRESS</th>
                    <th>ITEMS</th>
                    <th>PAYMENT</th>
                    <th>DATE</th>
                    <th>AMOUNT</th>
                    <th>STATUS/TRACKING</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(order => (
                    <OrderRow key={order._id} order={order} onUpdate={handleUpdateOrder} />
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>No orders yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-card">
              <h2 className="table-title danger">Lost Revenue Profiles</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>CUSTOMER</th>
                    <th>LOSS AMOUNT</th>
                    <th>STATUS REASON</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.filter(o => o.status === 'Cancelled' || o.status === 'Returned').slice(0, 5).map(order => (
                    <tr key={order._id}>
                      <td>#{order.shortId || order._id.slice(-6).toUpperCase()}</td>
                      <td>{order.user?.name || 'Guest'}</td>
                      <td style={{ color: 'var(--color-danger)' }}>₹{order.totalAmount}</td>
                      <td>{order.status}</td>
                    </tr>
                  ))}
                  {orders.filter(o => o.status === 'Cancelled' || o.status === 'Returned').length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>No lost revenue.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'products' && (
          <>
            <header className="page-header">
              <h1 className="page-title">Product Management</h1>
              <button className="btn-action" onClick={() => setIsAddProductOpen(true)}>+ Add New Product</button>
            </header>

            <div className="table-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>PREVIEW</th>
                    <th>NAME</th>
                    <th>CATEGORY</th>
                    <th>PRICE (₹)</th>
                    <th>STOCK</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <td>
                        <div className="product-img-box" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                          {product.images && product.images[0] ? <img src={product.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} alt="prod" /> : <ImageIcon size={20} />}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{product.name}</span>
                      </td>
                      <td>{product.category?.name || 'Uncategorized'}</td>
                      <td>₹{product.price}</td>
                      <td>
                        {product.stock}
                        {product.stock < 10 && (
                          <span style={{ display: 'block', fontSize: '11px', color: '#DC2626', fontWeight: 'bold' }}>Low in stock</span>
                        )}
                      </td>
                      <td>
                        <span style={{ padding: '4px 8px', background: product.stock > 0 ? '#DCFCE7' : '#FEE2E2', color: product.stock > 0 ? '#166534' : '#991B1B', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn-outline" 
                            style={{ padding: '6px 12px', fontSize: '13px' }}
                            onClick={() => {
                              setSelectedProductToEdit(product);
                              setIsEditProductOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <button className="btn-action" style={{ background: '#EF4444', padding: '6px 12px' }} onClick={() => handleDeleteProduct(product._id)}>
                            <Trash size={16} weight="bold" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'categories' && (
          <>
            <header className="page-header">
              <h1 className="page-title">Category Hierarchy</h1>
            </header>

            <div className="split-layout">
              <div className="table-card split-card" style={{ flex: 1 }}>
                <div className="card-header">
                  <h2 className="table-title">Collections</h2>
                  <button className="btn-outline" onClick={() => setIsAddCollectionOpen(true)}>+ New</button>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Unique collections extracted from categories */}
                    {collections.map(col => (
                      <tr key={col._id}>
                        <td>{col.name}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              className="btn-outline" 
                              style={{ padding: '6px 12px', fontSize: '13px' }}
                              onClick={() => {
                                setSelectedCollectionToEdit(col);
                                setIsEditCollectionOpen(true);
                              }}
                            >
                              Edit
                            </button>
                            <button className="btn-action" style={{ background: '#EF4444', padding: '6px 12px' }} onClick={async () => {
                              if(window.confirm('Delete collection?')) {
                                try {
                                  await deleteCollection(col._id);
                                  setCollections(collections.filter(c => c._id !== col._id));
                                } catch(e) { console.error(e); }
                              }
                            }}>
                              <Trash size={16} weight="bold" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="table-card split-card" style={{ flex: 2 }}>
                <div className="card-header">
                  <h2 className="table-title">Categories</h2>
                  <button className="btn-action" onClick={() => setIsAddCategoryOpen(true)}>+ Add Category</button>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>THUMB</th>
                      <th>CATEGORY NAME</th>
                      <th>COLLECTION</th>
                      <th>ITEMS</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(cat => (
                      <tr key={cat._id}>
                        <td>
                          <img src={cat.thumbnail || 'https://via.placeholder.com/40'} alt={cat.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} />
                        </td>
                        <td>{cat.name}</td>
                        <td>{cat.collectionName}</td>
                        <td>{products.filter(p => p.category?._id === cat._id).length}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              className="btn-outline" 
                              style={{ padding: '6px 12px', fontSize: '13px' }}
                              onClick={() => {
                                setSelectedCategoryToEdit(cat);
                                setIsEditCategoryOpen(true);
                              }}
                            >
                              Edit
                            </button>
                            <button className="btn-action" style={{ background: '#EF4444', padding: '6px 12px' }} onClick={async () => {
                              if(window.confirm('Delete category?')) {
                                try {
                                  await api.delete('/categories/' + cat._id);
                                  setCategories(categories.filter(c => c._id !== cat._id));
                                } catch(e) { console.error(e); }
                              }
                            }}>
                              <Trash size={16} weight="bold" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <>
            <header className="page-header">
              <h1 className="page-title">Order Management</h1>
            </header>

            <div className="table-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>CUSTOMER</th>
                    <th>ADDRESS</th>
                    <th>ITEMS</th>
                    <th>PAYMENT</th>
                    <th>DATE</th>
                    <th>AMOUNT</th>
                    <th>STATUS/TRACKING</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <OrderRow key={order._id} order={order} onUpdate={handleUpdateOrder} />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'coupons' && (
          <>
            <header className="page-header">
              <h1 className="page-title">Coupon Management</h1>
              <button className="btn-action" onClick={() => setIsAddCouponOpen(true)}>+ Create Discount Coupon</button>
            </header>

            <div className="table-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>CODE</th>
                    <th>DISCOUNT</th>
                    <th>MIN ORDER</th>
                    <th>MAX USES</th>
                    <th>PER USER</th>
                    <th>USAGE</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                    {coupons.map(coupon => (
                      <tr key={coupon._id}>
                        <td style={{ fontWeight: 800, color: '#1A1A1A' }}>{coupon.code}</td>
                        <td>{coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}</td>
                        <td>₹{coupon.minOrderAmount || 0}</td>
                        <td>{coupon.maxUsers}</td>
                        <td>{coupon.limitPerUser}</td>
                        <td>{coupon.usageCount || 0}</td>
                        <td>
                          <span style={{ padding: '4px 8px', background: coupon.isActive ? '#DCFCE7' : '#FEE2E2', color: coupon.isActive ? '#166534' : '#991B1B', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
                            {coupon.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button className="btn-action" style={{ background: '#EF4444', padding: '6px 12px' }} onClick={async () => {
                            if (window.confirm(`Delete coupon ${coupon.code}?`)) {
                              await api.delete(`/coupons/${coupon._id}`);
                              setCoupons(coupons.filter(c => c._id !== coupon._id));
                            }
                          }}>
                            <Trash size={16} weight="bold" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'showcase' && (
          <>
            <header className="page-header">
              <h1 className="page-title">Hero Showcase</h1>
              <button className="btn-action btn-icon" onClick={handleSaveShowcase}><FloppyDisk size={18} weight="fill" /> Save Changes</button>
            </header>

            <div className="showcase-card">
              <h2 className="showcase-card-title">Overall Headlines</h2>
              <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#1A1A1A' }}>Main Headline</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={showcaseHeadlines.main} 
                    onChange={(e) => setShowcaseHeadlines({...showcaseHeadlines, main: e.target.value})} 
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#1A1A1A' }}>Sub-Headline</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={showcaseHeadlines.sub} 
                    onChange={(e) => setShowcaseHeadlines({...showcaseHeadlines, sub: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            {showcaseSlides.map((slide, index) => (
              <div key={slide.id} className="showcase-card">
                <button className="btn-delete" onClick={() => handleRemoveSlide(slide.id)}>
                  <Trash size={20} weight="fill" />
                </button>
                <div style={{ display: 'flex', gap: '48px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>Slide Media (High Res)</label>
                    <label className="media-dropzone" htmlFor={`slide-media-${slide.id}`} style={{ position: 'relative' }}>
                      {slide.mediaFile || slide.mediaUrl ? (
                        <>
                          <img src={slide.mediaFile ? URL.createObjectURL(slide.mediaFile) : slide.mediaUrl} alt="slide" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                          <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', pointerEvents: 'none' }}>
                            Change Image
                          </div>
                        </>
                      ) : (
                        <>
                          <UploadSimple size={24} weight="bold" />
                          <span style={{ fontSize: '12px', fontWeight: 600 }}>Drag & Drop or Click</span>
                        </>
                      )}
                    </label>
                    <input 
                      type="file" 
                      id={`slide-media-${slide.id}`} 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={(e) => handleSlideChange(slide.id, 'mediaFile', e.target.files[0])}
                    />
                  </div>
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '300px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#1A1A1A' }}>Show on Device</label>
                    <select 
                      className="form-select" 
                      value={slide.platform || 'All'}
                      onChange={(e) => handleSlideChange(slide.id, 'platform', e.target.value)}
                    >
                      <option value="All">Both PC & Phone</option>
                      <option value="Desktop">PC Only</option>
                      <option value="Mobile">Phone Only</option>
                    </select>

                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#1A1A1A', marginTop: '8px' }}>Link Type</label>
                    <select 
                      className="form-select" 
                      value={slide.linkType}
                      onChange={(e) => handleSlideChange(slide.id, 'linkType', e.target.value)}
                    >
                      <option value="None">None</option>
                      <option value="Product">Product</option>
                      <option value="Collection">Collection</option>
                    </select>
                    {slide.linkType !== 'None' && (
                      <input 
                        type="text" 
                        className="form-input" 
                        value={slide.linkTarget || ''}
                        onChange={(e) => handleSlideChange(slide.id, 'linkTarget', e.target.value)}
                        placeholder={`Search ${slide.linkType.toLowerCase()}... (Enter ID or Name)`}
                        style={{ marginTop: '8px' }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {showcaseSlides.length < 5 && (
              <button className="btn-full-outline" onClick={handleAddSlide}>
                + Add New Slide (Max 5)
              </button>
            )}
          </>
        )}

        {activeTab === 'logs' && (
          <>
            <header className="page-header">
              <h1 className="page-title">Activity Logs</h1>
              {adminUser?.isSuperAdmin && (
                <button 
                  className="btn-danger" 
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to clear all admin logs? This cannot be undone.")) {
                      try {
                        await clearAdminLogs();
                        setAdminLogs([]);
                      } catch (err) {
                        alert(err.response?.data?.message || "Failed to clear logs");
                      }
                    }
                  }}
                >
                  <Trash size={16} weight="bold" style={{ marginRight: '8px' }}/>
                  Clear Logs
                </button>
              )}
            </header>
            <div className="table-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>DATE & TIME</th>
                    <th>ADMIN EMAIL</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {adminLogs.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>No activity logs found.</td>
                    </tr>
                  ) : (
                    adminLogs.map(log => (
                      <tr key={log._id}>
                        <td style={{ color: '#71717A', fontSize: '13px' }}>
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td style={{ fontWeight: 600 }}>{log.adminEmail}</td>
                        <td>{log.action}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <>
            <header className="page-header">
              <h1 className="page-title">Settings & Management</h1>
            </header>

            <div className="danger-card">
              <h2 className="danger-title"><WarningCircle size={24} weight="bold" /> Danger Zone</h2>
              <p className="danger-desc">Actions here are permanent and cannot be undone. Please proceed with caution.</p>
              
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button 
                  className={resetConfirmStage === 1 ? "btn-danger" : "btn-danger-outline"} 
                  onClick={handleResetData}
                  style={{ minWidth: '180px' }}
                >
                  {resetConfirmStage === 0 && "Reset All Data"}
                  {resetConfirmStage === 1 && "Are you sure? Click again"}
                  {resetConfirmStage === 2 && "Data Reset Complete!"}
                </button>

                <button className="btn-danger-outline" onClick={() => console.log('Deleting user data...')}>
                  Delete User Data
                </button>

                <button 
                  className={revenueResetStage === 1 ? "btn-danger" : "btn-danger-outline"} 
                  onClick={handleResetRevenue}
                  style={{ minWidth: '180px' }}
                >
                  {revenueResetStage === 0 && "Reset All Revenue"}
                  {revenueResetStage === 1 && "Are you sure? Click again"}
                  {revenueResetStage === 2 && "Revenue Reset Complete!"}
                </button>

                <button 
                  className={deleteOrdersStage === 1 ? "btn-danger" : "btn-danger-outline"} 
                  onClick={handleDeleteAllOrders}
                  style={{ minWidth: '180px' }}
                >
                  {deleteOrdersStage === 0 && "Delete All Orders"}
                  {deleteOrdersStage === 1 && "Are you sure? Click again"}
                  {deleteOrdersStage === 2 && "All Orders Deleted!"}
                </button>

                <button 
                  className={fundResetStage === 1 ? "btn-danger" : "btn-danger-outline"} 
                  onClick={handleResetFund}
                  style={{ minWidth: '180px' }}
                >
                  {fundResetStage === 0 && "Reset Fund"}
                  {fundResetStage === 1 && "Are you sure? Click again"}
                  {fundResetStage === 2 && "Fund Reset to 0%!"}
                </button>
              </div>
            </div>

            <div className="table-card">
              <h2 className="table-title">User List</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>USER ID</th>
                    <th>EMAIL</th>
                    <th>PHONE NUMBER</th>
                    <th>TOTAL ORDERS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} style={{ opacity: user.isBlocked ? 0.6 : 1 }}>
                      <td>
                        {user._id}
                        {user.isBlocked && <span style={{ marginLeft: '8px', color: '#DC2626', fontSize: '12px', fontWeight: 700 }}>BLOCKED</span>}
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone || 'N/A'}</td>
                      <td>{user.orders?.length || 0} orders</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button className="btn-outline" onClick={() => handleViewOrders(user)}>
                            View Orders
                          </button>
                          <button 
                            className="btn-outline" 
                            style={{ color: user.isBlocked ? '#2E7D32' : '#DC2626', borderColor: user.isBlocked ? '#A5D6A7' : '#FECACA' }}
                            onClick={() => toggleBlockUser(user._id)}
                          >
                            {user.isBlocked ? "Unblock" : "Block"}
                          </button>
                          <button 
                            className="btn-action" 
                            style={{ background: '#EF4444', padding: '6px 12px' }}
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            <Trash size={16} weight="bold" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-card">
              <h2 className="table-title">Admin Access</h2>
              <p style={{ fontSize: '13px', color: '#71717A', marginBottom: '16px' }}>
                Only these emails can log in to the admin panel via Google.
              </p>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <input
                  type="email"
                  placeholder="Enter email to grant admin access"
                  value={adminEmailInput}
                  onChange={(e) => setAdminEmailInput(e.target.value)}
                  style={{
                    flex: 1, padding: '10px 14px', borderRadius: '10px',
                    border: '1.5px solid #E4E4E7', fontSize: '14px', outline: 'none'
                  }}
                />
                <button
                  className="btn-action"
                  style={{ background: '#0F0F0F', padding: '10px 20px', whiteSpace: 'nowrap' }}
                  disabled={addingAdmin || !adminEmailInput.trim()}
                  onClick={async () => {
                    setAddingAdmin(true);
                    try {
                      await addAdmin(adminEmailInput.trim());
                      setAdminEmailInput("");
                      const { data } = await fetchAdmins();
                      setAdmins(data);
                    } catch (err) {
                      alert(err.response?.data?.message || "Failed to add admin");
                    }
                    setAddingAdmin(false);
                  }}
                >
                  {addingAdmin ? "Adding..." : "Add Admin"}
                </button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>EMAIL</th>
                    <th>NAME</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(admin => (
                    <tr key={admin._id}>
                      <td>
                        {admin.email}
                        {admin.isSuperAdmin && <span style={{ marginLeft: '8px', padding: '2px 8px', background: '#0F0F0F', color: '#fff', borderRadius: '99px', fontSize: '10px', fontWeight: 800 }}>SUPER</span>}
                        {admin.email === adminUser?.email && <span style={{ marginLeft: '8px', padding: '2px 8px', background: '#3B82F6', color: '#fff', borderRadius: '99px', fontSize: '10px', fontWeight: 800 }}>CURRENT SESSION</span>}
                      </td>
                      <td>{admin.name || '-'}</td>
                      <td>
                        {admin.isSuperAdmin ? (
                          <span style={{ fontSize: '12px', color: '#A1A1AA' }}>Protected</span>
                        ) : (
                          <button
                            className="btn-action"
                            style={{ background: '#EF4444', padding: '6px 12px' }}
                            onClick={async () => {
                              if (window.confirm(`Remove ${admin.email} from admin access?`)) {
                                try {
                                  await removeAdmin(admin._id);
                                  setAdmins(admins.filter(a => a._id !== admin._id));
                                } catch (err) {
                                  alert(err.response?.data?.message || "Failed to remove");
                                }
                              }
                            }}
                          >
                            <Trash size={16} weight="bold" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      <AddProductModal 
        isOpen={isAddProductOpen} 
        onClose={() => setIsAddProductOpen(false)} 
        categories={categories}
        collections={collections.map(c => c.name)}
        onSave={async (newProduct) => {
          try {
            // newProduct is a FormData object because of images
            // Upload images first
            const images = newProduct.getAll('images');
            const imageUrls = [];
            for(const img of images) {
              const res = await uploadImage(img);
              imageUrls.push(res.data.url);
            }
            const prodData = {
              name: newProduct.get('name'),
              price: newProduct.get('price'),
              mrp: newProduct.get('mrp'),
              category: newProduct.get('category'),
              collectionName: newProduct.get('collectionName'),
              description: newProduct.get('description'),
              material: newProduct.get('material'),
              stock: Number(newProduct.get('stock') || 0),
              colors: JSON.parse(newProduct.get('colors') || '[]'),
              sizes: JSON.parse(newProduct.get('sizes') || '[]'),
              tags: JSON.parse(newProduct.get('tags') || '[]'),
              images: imageUrls
            };
            await api.post('/products', prodData); // Wait, we have api.js methods.
            const { data } = await fetchProducts();
            setProducts(data);
          } catch(err) { 
            alert(err.response?.data?.message || err.message);
            throw err;
          }
        }} 
      />

      <EditProductModal 
        isOpen={isEditProductOpen} 
        onClose={() => { setIsEditProductOpen(false); setSelectedProductToEdit(null); }} 
        initialData={selectedProductToEdit}
        categories={categories}
        collections={collections.map(c => c.name)}
        onSave={async (id, editedProduct) => {
          try {
            const images = editedProduct.getAll('images');
            const newImageUrls = [];
            for(const img of images) {
              const res = await uploadImage(img);
              newImageUrls.push(res.data.url);
            }
            
            const existingImages = JSON.parse(editedProduct.get('existingImages') || '[]');
            
            const prodData = {
              name: editedProduct.get('name'),
              price: editedProduct.get('price'),
              mrp: editedProduct.get('mrp'),
              category: editedProduct.get('category'),
              collectionName: editedProduct.get('collectionName'),
              description: editedProduct.get('description'),
              material: editedProduct.get('material'),
              stock: Number(editedProduct.get('stock') || 0),
              colors: JSON.parse(editedProduct.get('colors') || '[]'),
              sizes: JSON.parse(editedProduct.get('sizes') || '[]'),
              tags: JSON.parse(editedProduct.get('tags') || '[]'),
              images: [...existingImages, ...newImageUrls]
            };
            
            await api.put(`/products/${id}`, prodData);
            const { data } = await fetchProducts();
            setProducts(data);
          } catch(err) { 
            alert(err.response?.data?.message || err.message);
            throw err;
          }
        }} 
      />

      <AddCategoryModal  
        isOpen={isAddCategoryOpen} 
        onClose={() => setIsAddCategoryOpen(false)}
        collections={collections.map(c => c.name)}
        onSave={async (newCategoryFormData) => {
          try {
            const thumb = newCategoryFormData.get('thumbnail');
            let thumbUrl = '';
            if(thumb) {
              const res = await uploadImage(thumb);
              thumbUrl = res.data.url;
            }
            const catData = {
              name: newCategoryFormData.get('name'),
              collectionName: newCategoryFormData.get('collectionName'),
              thumbnail: thumbUrl
            };
            await api.post('/categories', catData);
            const { data } = await fetchCategories();
            setCategories(data);
          } catch(err) { 
            alert(err.response?.data?.message || err.message);
            throw err;
          }
        }} 
      />

      <AddCollectionModal
        isOpen={isAddCollectionOpen}
        onClose={() => setIsAddCollectionOpen(false)}
        onSave={async (newColFormData) => {
          try {
            const imageFile = newColFormData.get('image');
            let imageUrl = '';
            if (imageFile) {
              const res = await uploadImage(imageFile);
              imageUrl = res.data.url;
            }
            const colData = {
              name: newColFormData.get('name'),
              image: imageUrl
            };
            await addCollection(colData);
            const { data } = await fetchCollections();
            setCollections(data);
          } catch(err) { 
            alert(err.response?.data?.message || err.message);
            throw err;
          }
        }}
      />

      <EditCollectionModal
        isOpen={isEditCollectionOpen}
        onClose={() => {
          setIsEditCollectionOpen(false);
          setSelectedCollectionToEdit(null);
        }}
        collection={selectedCollectionToEdit}
        onSave={async (updatedColFormData) => {
          try {
            const imageFile = updatedColFormData.get('image');
            let imageUrl = updatedColFormData.get('existingImageUrl') || '';
            if (imageFile && imageFile instanceof File) {
              const res = await uploadImage(imageFile);
              imageUrl = res.data.url;
            }
            const colData = {
              name: updatedColFormData.get('name'),
              image: imageUrl
            };
            await updateCollection(selectedCollectionToEdit._id, colData);
            const { data } = await fetchCollections();
            setCollections(data);
          } catch(err) {
            alert(err.response?.data?.message || err.message);
            throw err;
          }
        }}
      />

      <EditCategoryModal
        isOpen={isEditCategoryOpen}
        onClose={() => {
          setIsEditCategoryOpen(false);
          setSelectedCategoryToEdit(null);
        }}
        collections={collections.map(c => c.name)}
        category={selectedCategoryToEdit}
        onSave={async (editedCategoryFormData) => {
          try {
            const thumb = editedCategoryFormData.get('thumbnail');
            let thumbUrl = editedCategoryFormData.get('existingThumbnailUrl') || '';
            if (thumb && thumb instanceof File) {
              const res = await uploadImage(thumb);
              thumbUrl = res.data.url;
            }
            const catData = {
              name: editedCategoryFormData.get('name'),
              collectionName: editedCategoryFormData.get('collectionName'),
              thumbnail: thumbUrl
            };
            await updateCategory(selectedCategoryToEdit._id, catData);
            const { data } = await fetchCategories();
            setCategories(data);
          } catch(err) {
            alert(err.response?.data?.message || err.message);
            throw err;
          }
        }}
      />

      <AddCouponModal 
        isOpen={isAddCouponOpen} 
        onClose={() => setIsAddCouponOpen(false)} 
        onSave={async (newCoupon) => {
          try {
            await api.post('/coupons', newCoupon);
            const { data } = await fetchCoupons();
            setCoupons(data);
          } catch(err) { 
            alert(err.response?.data?.message || err.message);
            throw err;
          }
        }} 
      />

      <UserOrderHistoryModal 
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
