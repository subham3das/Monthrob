const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'admin', 'AdminDashboard.jsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Insert variables before return
const variables = `
  const netRevenue = orders.reduce((acc, o) => acc + (o.status !== 'Cancelled' && o.status !== 'Returned' ? (Number(o.totalAmount) || 0) : 0), 0);
  const lossAndReturns = orders.reduce((acc, o) => acc + (o.status === 'Cancelled' || o.status === 'Returned' ? (Number(o.totalAmount) || 0) : 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? (netRevenue / totalOrders).toFixed(2) : 0;
`;
if (!content.includes('const netRevenue')) {
  content = content.replace('  return (', `${variables}\n  return (`);
}

// 2. Replace stat cards
const statCardsOld = `<div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">NET REVENUE</div>
                <div className="stat-value" style={{ alignItems: 'center' }}>
                  <div className="stat-dot green"></div>
                  <div className="stat-dot green"></div>
                  <div className="stat-dot green"></div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">LOSS & RETURNS</div>
                <div className="stat-value" style={{ alignItems: 'center' }}>
                  <div className="stat-dot red"></div>
                  <div className="stat-dot red"></div>
                  <div className="stat-dot red"></div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">TOTAL ORDERS</div>
                <div className="stat-value" style={{ alignItems: 'center' }}>
                  <div className="stat-dot"></div>
                  <div className="stat-dot"></div>
                  <div className="stat-dot"></div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">AVG. ORDER VALUE</div>
                <div className="stat-value" style={{ alignItems: 'center' }}>
                  <div className="stat-dot"></div>
                  <div className="stat-dot"></div>
                  <div className="stat-dot"></div>
                </div>
              </div>
            </div>`;

const statCardsNew = `<div className="stats-grid">
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
            </div>`;

content = content.replace(statCardsOld, statCardsNew);

// 3. Replace tables
const tablesOld = `<div className="table-card">
              <h2 className="table-title">Recent Orders</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>CUSTOMER</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Empty placeholder rows for now */}
                </tbody>
              </table>
            </div>

            <div className="table-card">
              <h2 className="table-title danger">Lost Revenue Profiles</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>OFFENDING PRODUCTS</th>
                    <th>LOSS AMOUNT</th>
                    <th>STATUS REASON</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Empty placeholder rows for now */}
                </tbody>
              </table>
            </div>`;

const tablesNew = `<div className="table-card">
              <h2 className="table-title">Recent Orders</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>CUSTOMER</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(order => (
                    <OrderRow key={order._id} order={order} onUpdate={handleUpdateOrder} />
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>No orders yet.</td>
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
                      <td>#{order._id.slice(-6).toUpperCase()}</td>
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
            </div>`;

content = content.replace(tablesOld, tablesNew);

fs.writeFileSync(file, content);
console.log('Metrics updated.');
