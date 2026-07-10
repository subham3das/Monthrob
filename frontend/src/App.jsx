import React, { useState, useEffect } from "react";
import {
  fetchProducts, fetchCollections, createOrder, fetchMyOrders, useCoupon, fetchCollectiveJar,
  addCollection, deleteCollection, createProduct, deleteProduct, updateOrder, fetchOrders
} from "./api";
import socket from "./socket";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Hero from "./components/Hero";
import CollectionsBar from "./components/CollectionsBar";
import ProductShowcase from "./components/ProductShowcase";
import MobileNav from "./components/MobileNav";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Footer from "./components/Footer";
import ShopPage from "./components/ShopPage";
import CartPage from "./components/CartPage";
import ProfilePage from "./components/ProfilePage";
import AdminPanel from "./components/AdminPanel";

import ProductDetailPage from "./components/ProductDetailPage";
import CheckoutPage from "./components/CheckoutPage";
import OrderSuccessPage from "./components/OrderSuccessPage";

function App() {
  // Core App States
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [collectiveJar, setCollectiveJar] = useState({ totalDonation: 0, targetGoal: 5000, percentage: 0 });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, colRes, jarRes] = await Promise.all([
          fetchProducts(),
          fetchCollections(),
          fetchCollectiveJar()
        ]);
        setProducts(prodRes.data);
        setCollections(colRes.data);
        setCollectiveJar(jarRes.data);
      } catch (err) {
        console.error("Failed to load storefront data", err);
      }
    };
    loadData();
  }, []);

  // Admin Mode detection
  const isAdminMode = new URLSearchParams(window.location.search).get("admin") === "true";
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("monthrob_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [activePage, _setActivePage] = useState("home");
  const [activeCollection, setActiveCollection] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Drawer/Modal States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Profile Sub-navigation States
  const [profileView, setProfileView] = useState("dashboard"); // dashboard, my-orders, tracking
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);

  // User Profile State
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem("monthrob_profile");
    return saved ? JSON.parse(saved) : null;
  });

  // Authentication State
  const [authUser, setAuthUser] = useState(() => {
    const saved = localStorage.getItem("monthrob_auth");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem("monthrob_profile", JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem("monthrob_auth", JSON.stringify(authUser));
  }, [authUser]);

  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (authUser?._id) {
      const saved = localStorage.getItem(`monthrob_addresses_${authUser._id}`);
      setAddresses(saved ? JSON.parse(saved) : []);
    } else {
      setAddresses([]);
    }
  }, [authUser]);

  useEffect(() => {
    if (authUser?._id) {
      localStorage.setItem(`monthrob_addresses_${authUser._id}`, JSON.stringify(addresses));
    }
  }, [addresses, authUser]);

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("monthrob_orders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (authUser?._id) {
      fetchMyOrders(authUser._id)
        .then(res => setOrders(res.data))
        .catch(console.error);
    }
  }, [authUser]);

  useEffect(() => {
    localStorage.setItem("monthrob_orders", JSON.stringify(orders));
  }, [orders]);

  const [adminOrders, setAdminOrders] = useState([]);

  useEffect(() => {
    if (isAdminMode) {
      fetchOrders()
        .then(res => {
          const normalized = res.data.map(o => ({
            ...o,
            id: o._id,
            date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '',
            total: o.totalAmount,
            courierLink: o.trackingLink || ''
          }));
          setAdminOrders(normalized);
        })
        .catch(console.error);
    }
  }, [isAdminMode]);

  const handleAddCollection = async (data) => {
    try {
      const res = await addCollection(data);
      setCollections(prev => [...prev, res.data]);
    } catch (err) {
      console.error("Failed to add collection", err);
    }
  };

  const handleDeleteCollection = async (name) => {
    try {
      const col = collections.find(c => (c.name || c) === name);
      if (!col || !col._id) return;
      await deleteCollection(col._id);
      setCollections(prev => prev.filter(c => (c.name || c) !== name));
    } catch (err) {
      console.error("Failed to delete collection", err);
    }
  };

  const handleAddProduct = async (data) => {
    try {
      const payload = {
        name: data.name,
        price: Number(data.price),
        mrp: Number(data.price),
        images: [data.image],
        description: data.description,
        collectionName: data.collections[0] || '',
        category: null,
        discount: 0,
        status: 'Active',
        colors: [],
        sizes: [],
        tags: [],
        material: '',
        stock: 0
      };
      const res = await createProduct(payload);
      setProducts(prev => [res.data, ...prev]);
    } catch (err) {
      console.error("Failed to add product", err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => (p._id || p.id) !== id));
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const res = await updateOrder(orderId, { status });
      setAdminOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...res.data, id: res.data._id, status: res.data.status } : o));
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  const handleUpdateOrderCourierLink = async (orderId, link) => {
    try {
      const res = await updateOrder(orderId, { trackingLink: link });
      setAdminOrders(prev => prev.map(o => o.id === orderId ? { ...o, courierLink: link, trackingLink: link } : o));
    } catch (err) {
      console.error("Failed to update courier link", err);
    }
  };

  const setActivePage = (page) => {
    _setActivePage(page);
    setSelectedProduct(null);
    setProfileView("dashboard");
    setTrackingOrder(null);
  };

  // If activePage is admin but not in admin mode, redirect
  useEffect(() => {
    if (activePage === "admin" && !isAdminMode) {
      setActivePage("home");
    }
  }, [activePage, isAdminMode]);

  // If activePage is profile but user is not logged in, redirect to login
  useEffect(() => {
    if (activePage === "profile" && !authUser) {
      setActivePage("login");
    }
  }, [activePage, authUser]);

  
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
    socket.on('order_placed', () => {
      fetchCollectiveJar().then(res => setCollectiveJar(res.data)).catch(console.error);
    });
    return () => {
      socket.off('product_added');
      socket.off('product_deleted');
      socket.off('order_updated');
      socket.off('order_placed');
    };
  }, [trackingOrder]);

  // Sync cart to LocalStorage
  useEffect(() => {
    localStorage.setItem("monthrob_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Cart Operations
  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) =>
        (item._id || item.id) === (product._id || product.id) &&
        (item.selectedSize || '') === (product.selectedSize || '') &&
        (item.selectedColor || '') === (product.selectedColor || '')
      );
      if (existing) {
        return prevItems.map((item) =>
          (item._id || item.id) === (product._id || product.id) &&
          (item.selectedSize || '') === (product.selectedSize || '') &&
          (item.selectedColor || '') === (product.selectedColor || '')
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => (item._id || item.id) !== productId));
  };

  const handleUpdateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        (item._id || item.id) === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setCartOpen(false);
    setActivePage("checkout");
  };

  const handlePlaceOrder = async (checkoutDetails) => {
    try {
      const orderData = {
        user: authUser?._id, // Assume logged in, or handle guest
        items: checkoutDetails.items.map(i => ({ product: i._id || i.id, quantity: i.quantity, priceAtTime: i.price, size: i.selectedSize || '', color: i.selectedColor || '' })),
        totalAmount: checkoutDetails.total,
        status: "Placed",
        shippingAddress: checkoutDetails.shippingAddress,
        paymentMethod: checkoutDetails.paymentMethod,
        donation: checkoutDetails.donation,
        discount: checkoutDetails.discount
      };
      const res = await createOrder(orderData);
      // Mark coupon as used
      if (checkoutDetails.couponId && authUser?._id) {
        useCoupon(checkoutDetails.couponId, authUser._id).catch(() => {}); // ponytail: fire-and-forget
      }
      setOrders(prev => [res.data, ...(Array.isArray(prev) ? prev : [])]);
      setCartItems([]);
      setLastPlacedOrder(res.data);
      setActivePage("order-success");
    } catch (error) {
      console.error("Failed to place order:", error);
      const errMsg = error.response?.data?.message || error.message || "Unknown error";
      alert("Failed to place order. Reason: " + errMsg);
    }
  };

  
  const handleSeeAllClick = (colName) => {
    setActiveCollection(colName === "All Products" ? "All" : colName);
    setActivePage("shop");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      {/* Liquid morphing background blobs */}
      <div className="liquid-bg">
        <div className="liquid-blob liquid-blob-1"></div>
        <div className="liquid-blob liquid-blob-2"></div>
        <div className="liquid-blob liquid-blob-3"></div>
      </div>

      {/* Header */}
      <Header
        cartCount={cartCount}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        onMenuClick={() => setSidebarOpen(true)}
        onCartClick={() => setCartOpen(true)}
        onProfileClick={() => setActivePage("profile")}
        onAdminClick={() => setActivePage("admin")}
        setActivePage={setActivePage}
        isAdminMode={isAdminMode}
        products={products}
        onProductClick={setSelectedProduct}
        onBack={
          selectedProduct
            ? () => setSelectedProduct(null)
            : (activePage === "profile" && profileView !== "dashboard")
            ? () => {
                if (profileView === "tracking") {
                  setProfileView("my-orders");
                } else if (profileView === "my-orders") {
                  setProfileView("dashboard");
                }
              }
            : activePage === "checkout" || activePage === "order-success"
            ? () => setActivePage("shop")
            : undefined
        }
        title={
          (activePage === "profile" && profileView === "my-orders")
            ? "My Orders"
            : (activePage === "profile" && profileView === "tracking")
            ? "Track Order"
            : activePage === "checkout"
            ? "Secure Checkout"
            : activePage === "order-success"
            ? "Order Receipt"
            : undefined
        }
        authUser={authUser}
        setAuthUser={setAuthUser}
      />

      {/* Navigation Sidebar (Desktop drawer) */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePage={activePage}
        setActivePage={setActivePage}
        onAdminClick={() => setActivePage("admin")}
        onCartClick={() => setCartOpen(true)}
        isAdminMode={isAdminMode}
      />

      {/* Shopping Cart Drawer */}
      <CartPage
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {/* Main Pages Router */}
      <main style={{ paddingBottom: "70px" }}> {/* spacing for mobile nav */}
        {activePage === "home" && (
          <>
            {/* Hero Section */}
            <Hero onShopClick={() => setActivePage("shop")} />

            {/* Dynamic Collections Bar */}
            <CollectionsBar
              collections={collections}
              activeCollection={activeCollection}
              setActiveCollection={setActiveCollection}
              onCollectionChange={(col) => {
                setActiveCollection(col);
                setActivePage("shop"); // Route to shop page with this filter
              }}
            />

            {/* Product Showcases by Collections */}
            {/* 1. All Products */}
            <ProductShowcase
              collectionName="All Products"
              products={products}
              onAddToCart={handleAddToCart}
              onProductClick={setSelectedProduct}
              onSeeAllClick={handleSeeAllClick}
            />

            {/* 2. Differentiated by individual active collections */}
            {collections
              .map((c) => (c && c.name) ? c.name : c)
              .filter((name) => name !== "All" && name !== "All Products")
              .map((colName) => (
                <ProductShowcase
                  key={colName}
                  collectionName={colName}
                  products={products}
                  onAddToCart={handleAddToCart}
                  onProductClick={setSelectedProduct}
                  onSeeAllClick={handleSeeAllClick}
                />
              ))}

            {/* The Collective Jar Banner */}
            <div className="collective-banner-wrapper">
              <div className="collective-banner-box">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "1rem", display: "flex", alignItems: "center" }}>❤️</span>
                    <span className="collective-title">THE COLLECTIVE JAR</span>
                  </div>
                  <span className="collective-status">{collectiveJar.percentage}% FUNDED</span>
                </div>
                {/* Progress Bar */}
                <div style={{ width: "100%", height: "8px", background: "#f4f4f5", border: "1px solid var(--color-border)", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ width: `${collectiveJar.percentage}%`, height: "100%", background: "#000000", transition: "width 0.4s ease-out" }} />
                </div>
              </div>
            </div>
          </>
        )}

        {activePage === "shop" && (
          <ShopPage
            products={products}
            collections={collections}
            activeCollection={activeCollection}
            setActiveCollection={setActiveCollection}
            onAddToCart={handleAddToCart}
            searchQuery={searchQuery}
            onProductClick={setSelectedProduct}
          />
        )}

        {activePage === "login" && (
          <LoginPage
            setAuthUser={setAuthUser}
            setActivePage={setActivePage}
          />
        )}

        {activePage === "signup" && (
          <SignupPage
            setAuthUser={setAuthUser}
            setActivePage={setActivePage}
          />
        )}

        {activePage === "profile" && (
          <ProfilePage
            orders={orders}
            setOrders={setOrders}
            profileView={profileView}
            setProfileView={setProfileView}
            trackingOrder={trackingOrder}
            setTrackingOrder={setTrackingOrder}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            addresses={addresses}
            setAddresses={setAddresses}
            setCartItems={setCartItems}
            setActivePage={setActivePage}
            setAuthUser={setAuthUser}
          />
        )}

        {activePage === "admin" && (
          <AdminPanel
            collections={collections}
            products={products}
            onAddCollection={handleAddCollection}
            onDeleteCollection={handleDeleteCollection}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            orders={adminOrders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateOrderCourierLink={handleUpdateOrderCourierLink}
          />
        )}

        {activePage === "checkout" && (
          <CheckoutPage
            cartItems={cartItems}
            userProfile={userProfile}
            onPlaceOrder={handlePlaceOrder}
            onBack={() => setActivePage("shop")}
            addresses={addresses}
            setAddresses={setAddresses}
          />
        )}

        {activePage === "order-success" && (
          <OrderSuccessPage
            order={lastPlacedOrder}
            onContinueShopping={() => setActivePage("shop")}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActivePage={setActivePage}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onAdminClick={() => setActivePage("admin")}
        isAdminMode={isAdminMode}
        authUser={authUser}
      />

      {/* Product Detail Page */}
      {selectedProduct && (
        <ProductDetailPage
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onAddToCart={(product) => {
            handleAddToCart(product);
          }}
        />
      )}
    </>
  );
}

export default App;
