const fs = require('fs');
const path = require('path');

const appFile = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(appFile, 'utf8');

// 1. Imports
content = content.replace(
  `import { fetchProducts, fetchCategories } from "./api";`,
  `import { fetchProducts, fetchCategories, createOrder, fetchMyOrders } from "./api";\nimport socket from "./socket";`
);
content = content.replace(`import AdminPanel from "./components/AdminPanel";\n`, ``);

// 2. Orders state and fetch effect
content = content.replace(
  /const \[orders, setOrders\] = useState\(\(\) => \{[\s\S]*?\}\);\n\n  useEffect\(\(\) => \{\n    localStorage\.setItem\("monthrob_orders", JSON\.stringify\(orders\)\);\n  \}, \[orders\]\);/,
  `const [orders, setOrders] = useState([]);\n\n  useEffect(() => {\n    if (authUser?._id) {\n      fetchMyOrders(authUser._id).then(res => setOrders(res.data)).catch(console.error);\n    } else {\n      setOrders([]);\n    }\n  }, [authUser]);`
);

// 3. Socket effects
const socketEffect = `
  useEffect(() => {
    socket.on('product_added', (newProd) => {
      setProducts(prev => [newProd, ...prev]);
    });
    socket.on('product_deleted', (prodId) => {
      setProducts(prev => prev.filter(p => p._id !== prodId && p.id !== prodId));
    });
    socket.on('order_updated', (updatedOrder) => {
      setOrders(prev => prev.map(o => (o._id === updatedOrder._id ? updatedOrder : o)));
      if (trackingOrder && trackingOrder._id === updatedOrder._id) {
        setTrackingOrder(updatedOrder);
      }
    });
    return () => {
      socket.off('product_added');
      socket.off('product_deleted');
      socket.off('order_updated');
    };
  }, [trackingOrder]);
`;
content = content.replace(
  `// Sync cart to LocalStorage`,
  `${socketEffect}\n  // Sync cart to LocalStorage`
);

// 4. Handle Place Order
const placeOrderContent = `
  const handlePlaceOrder = async (checkoutDetails) => {
    try {
      const orderData = {
        user: authUser?._id, // Assume logged in, or handle guest
        items: checkoutDetails.items.map(i => ({ product: i._id || i.id, quantity: i.quantity, priceAtTime: i.price })),
        totalAmount: checkoutDetails.total,
        status: "Placed",
        shippingAddress: checkoutDetails.shippingAddress,
        paymentMethod: checkoutDetails.paymentMethod,
        donation: checkoutDetails.donation,
        discount: checkoutDetails.discount
      };
      const res = await createOrder(orderData);
      setOrders([res.data, ...orders]);
      setCartItems([]);
      setLastPlacedOrder(res.data);
      setActivePage("order-success");
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Failed to place order. Please try again.");
    }
  };
`;
content = content.replace(
  /const handlePlaceOrder = \(checkoutDetails\) => \{[\s\S]*?setActivePage\("order-success"\);\n  \};/,
  placeOrderContent.trim()
);

// 5. Remove unused Admin functions
content = content.replace(/const handleUpdateOrderStatus = [\s\S]*?const handleDeleteProduct = \(prodId\) => \{\n    setProducts\(products\.filter\(\(p\) => p\.id !== prodId\)\);\n  \};\n/g, ``);

// 6. Remove <AdminPanel />
content = content.replace(
  /\{activePage === "admin" && \([\s\S]*?\}\)}/,
  `{activePage === "admin" && (\n          <div style={{ padding: "5rem 2rem", textAlign: "center", minHeight: "60vh" }}>\n            <h2>Admin Panel has moved!</h2>\n            <p>Please use the dedicated Admin application.</p>\n          </div>\n        )}`
);

fs.writeFileSync(appFile, content);
console.log('Done refactoring App.jsx');
