const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'admin', 'AdminDashboard.jsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Imports
content = content.replace(
  `import api, { fetchProducts, fetchCategories, fetchOrders, fetchCoupons, fetchUsers, fetchShowcase, blockUser as apiBlockUser, deleteUser as apiDeleteUser, updateShowcase, uploadImage } from "../api";`,
  `import api, { fetchProducts, fetchCategories, fetchOrders, fetchCoupons, fetchUsers, fetchShowcase, blockUser as apiBlockUser, deleteUser as apiDeleteUser, updateShowcase, uploadImage, fetchCollections, addCollection, deleteCollection } from "../api";`
);
content = content.replace(
  `import AddCategoryModal from "./AddCategoryModal";`,
  `import AddCategoryModal from "./AddCategoryModal";\nimport AddCollectionModal from "./AddCollectionModal";`
);

// 2. States
content = content.replace(
  `const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);`,
  `const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);\n  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);`
);
content = content.replace(
  `const [categories, setCategories] = useState([]);`,
  `const [categories, setCategories] = useState([]);\n  const [collections, setCollections] = useState([]);`
);

// 3. API calls
content = content.replace(
  `fetchProducts(), fetchCategories(), fetchOrders(), fetchCoupons(), fetchUsers(), fetchShowcase()`,
  `fetchProducts(), fetchCategories(), fetchOrders(), fetchCoupons(), fetchUsers(), fetchShowcase(), fetchCollections()`
);
content = content.replace(
  `const [prodRes, catRes, ordRes, coupRes, userRes, showRes] = await Promise.all([`,
  `const [prodRes, catRes, ordRes, coupRes, userRes, showRes, colRes] = await Promise.all([`
);
content = content.replace(
  `setCategories(catRes.data);`,
  `setCategories(catRes.data);\n        setCollections(colRes.data);`
);

// 4. Categories JSX
content = content.replace(
  `<button className="btn-outline">+ New</button>`,
  `<button className="btn-outline" onClick={() => setIsAddCollectionOpen(true)}>+ New</button>`
);
content = content.replace(
  `{Array.from(new Set(categories.map(c => c.collectionName).filter(Boolean))).map(col => (
                      <tr key={col}>
                        <td>{col}</td>
                        <td>
                          <button className="btn-action" style={{ background: '#EF4444', padding: '6px 12px' }}>
                            <Trash size={16} weight="bold" />
                          </button>
                        </td>
                      </tr>
                    ))}`,
  `{collections.map(col => (
                      <tr key={col._id}>
                        <td>{col.name}</td>
                        <td>
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
                        </td>
                      </tr>
                    ))}`
);
content = content.replace(
  `<button className="btn-action" style={{ background: '#EF4444', padding: '6px 12px' }}>
                            <Trash size={16} weight="bold" />
                          </button>`,
  `<button className="btn-action" style={{ background: '#EF4444', padding: '6px 12px' }} onClick={async () => {
                            if(window.confirm('Delete category?')) {
                              try {
                                await api.delete('/categories/' + cat._id);
                                setCategories(categories.filter(c => c._id !== cat._id));
                              } catch(e) { console.error(e); }
                            }
                          }}>
                            <Trash size={16} weight="bold" />
                          </button>`
);

// 5. Modals and Save Logic
content = content.replace(
  `await api.post('/products', newProduct);`,
  `// Upload images first
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
              colors: JSON.parse(newProduct.get('colors') || '[]'),
              sizes: JSON.parse(newProduct.get('sizes') || '[]'),
              tags: JSON.parse(newProduct.get('tags') || '[]'),
              images: imageUrls
            };
            await api.post('/products', prodData);`
);

content = content.replace(
  `collections={Array.from(new Set(categories.map(c => c.collectionName).filter(Boolean)))}`,
  `collections={collections.map(c => c.name)}`
);

content = content.replace(
  `await api.post('/categories', newCategoryFormData, { headers: { 'Content-Type': 'multipart/form-data' }});`,
  `const thumb = newCategoryFormData.get('thumbnail');
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
            await api.post('/categories', catData);`
);

// Add AddCollectionModal
content = content.replace(
  `<AddCouponModal `,
  `<AddCollectionModal
        isOpen={isAddCollectionOpen}
        onClose={() => setIsAddCollectionOpen(false)}
        onSave={async (newCol) => {
          try {
            await addCollection(newCol);
            const { data } = await fetchCollections();
            setCollections(data);
          } catch(err) { console.error(err); }
        }}
      />
      <AddCouponModal `
);

fs.writeFileSync(file, content);
console.log('Done modifying AdminDashboard.jsx');
