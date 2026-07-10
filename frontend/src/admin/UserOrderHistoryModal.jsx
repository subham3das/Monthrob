import React, { useState, useEffect } from "react";
import { X, UserCircle, CircleNotch } from "@phosphor-icons/react";
import { fetchMyOrders } from "../api";

export default function UserOrderHistoryModal({ isOpen, onClose, user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user?._id) {
      setLoading(true);
      fetchMyOrders(user._id)
        .then(res => setOrders(res.data || []))
        .catch(err => console.error("Failed to fetch user orders:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  return (
    <div className="modal-overlay">
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
          overflow: hidden;
          font-family: var(--font-body, 'Outfit', sans-serif);
        }

        .modal-content {
          background: #FFFFFF;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          position: relative;
          display: flex;
          flex-direction: column;
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .modal-header {
          padding: 24px 32px;
          border-bottom: 1px solid #F4F4F5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fff;
          z-index: 10;
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
          flex-shrink: 0;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 800;
          color: #1A1A1A;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-details-sub {
          font-size: 13px;
          font-weight: 500;
          color: #71717A;
          margin-top: 4px;
        }

        .close-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #A1A1AA;
          display: flex;
          padding: 4px;
          border-radius: 50%;
          transition: background 0.2s, color 0.2s;
        }

        .close-btn:hover {
          background: #F4F4F5;
          color: #1A1A1A;
        }

        .modal-body {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          overflow-y: auto;
          flex: 1;
        }

        .history-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .history-table th {
          text-align: left;
          padding: 0 0 16px 0;
          font-size: 11px;
          font-weight: 800;
          color: #71717A;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #F4F4F5;
        }

        .history-table td {
          padding: 16px 0;
          font-size: 14px;
          font-weight: 500;
          color: #1A1A1A;
          border-bottom: 1px solid #F4F4F5;
        }

        .history-table tr:last-child td {
          border-bottom: none;
        }

        .status-pill {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 99px;
          font-size: 12px;
          font-weight: 700;
        }

        .status-delivered { background: #E8F5E9; color: #2E7D32; }
        .status-processing { background: #FFF3E0; color: #E65100; }
        .status-shipped { background: #E3F2FD; color: #1565C0; }

      `}</style>

      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              <UserCircle size={28} weight="fill" color="#1A1A1A" />
              User Order History
            </h2>
            <div className="user-details-sub">{user.email} &nbsp;•&nbsp; {user.phone}</div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} weight="bold" />
          </button>
        </div>

        <div className="modal-body">
          <table className="history-table">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>DATE</th>
                <th>ITEMS</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "40px" }}>
                    <CircleNotch size={32} weight="bold" color="#A1A1AA" className="spin-anim" />
                    <style>{`
                      @keyframes spin { 100% { transform: rotate(360deg); } }
                      .spin-anim { animation: spin 1s linear infinite; }
                    `}</style>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "#71717A", fontWeight: 500 }}>
                    No orders found for this user.
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order._id}>
                    <td>#{order.shortId || order._id.slice(-6).toUpperCase()}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td>
                      {order.items?.length || 0} item{(order.items?.length !== 1) ? 's' : ''} 
                      {order.items?.length > 0 && order.items[0].product?.name && ` (${order.items[0].product.name}${order.items.length > 1 ? ', ...' : ''})`}
                    </td>
                    <td>Rs. {(order.totalAmount || 0).toFixed(2)}</td>
                    <td>
                      <span className={`status-pill status-${(order.status || 'Placed').toLowerCase()}`}>
                        {order.status || 'Placed'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
