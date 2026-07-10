const fs = require('fs');
const path = require('path');

const adminFile = path.join(__dirname, 'src', 'admin', 'AdminDashboard.jsx');
let content = fs.readFileSync(adminFile, 'utf8');

// 1. Imports
content = content.replace(
  `import api, { fetchProducts, fetchCategories, fetchOrders, fetchCoupons, fetchUsers, fetchShowcase, blockUser as apiBlockUser, deleteUser as apiDeleteUser, updateShowcase, uploadImage, fetchCollections, addCollection, deleteCollection } from "../api";`,
  `import api, { fetchProducts, fetchCategories, fetchOrders, fetchCoupons, fetchUsers, fetchShowcase, blockUser as apiBlockUser, deleteUser as apiDeleteUser, updateShowcase, uploadImage, fetchCollections, addCollection, deleteCollection } from "../api";\nimport socket from "../socket";`
);

// 2. Socket effect
const socketEffect = `
  useEffect(() => {
    socket.on('order_placed', (newOrder) => {
      setOrders(prev => [newOrder, ...prev]);
    });
    socket.on('order_updated', (updatedOrder) => {
      setOrders(prev => prev.map(o => (o._id === updatedOrder._id ? updatedOrder : o)));
    });
    return () => {
      socket.off('order_placed');
      socket.off('order_updated');
    };
  }, []);
`;
content = content.replace(
  `useEffect(() => {\n    loadDashboardData();\n  }, []);`,
  `useEffect(() => {\n    loadDashboardData();\n  }, []);\n\n${socketEffect}`
);

fs.writeFileSync(adminFile, content);
console.log('Done refactoring AdminDashboard.jsx');
