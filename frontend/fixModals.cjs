const fs = require('fs');
const path = require('path');

const modals = [
  'AddProductModal.jsx',
  'AddCategoryModal.jsx',
  'AddCollectionModal.jsx',
  'AddCouponModal.jsx'
];

for (const modal of modals) {
  const filePath = path.join(__dirname, 'src', 'admin', modal);
  let content = fs.readFileSync(filePath, 'utf8');

  // Add isSaving state
  if (!content.includes('const [isSaving, setIsSaving]')) {
    content = content.replace('const [name, setName] = useState("");', 'const [name, setName] = useState("");\n  const [isSaving, setIsSaving] = useState(false);');
    content = content.replace('const [formData, setFormData]', 'const [isSaving, setIsSaving] = useState(false);\n  const [formData, setFormData]');
  }

  // Make handleSave async
  content = content.replace('const handleSave = () => {', 'const handleSave = async () => {');

  // Update handleSave logic to await onSave and manage isSaving
  if (modal === 'AddCollectionModal.jsx') {
    content = content.replace(
      `onSave({ name: name.trim() });
    setName("");
    onClose();`,
      `setIsSaving(true);
    try {
      await onSave({ name: name.trim() });
      setName("");
      onClose();
    } finally {
      setIsSaving(false);
    }`
    );
  } else if (modal === 'AddProductModal.jsx' || modal === 'AddCategoryModal.jsx' || modal === 'AddCouponModal.jsx') {
    content = content.replace(
      `onSave(data);
    onClose();`,
      `setIsSaving(true);
    try {
      await onSave(data);
      onClose();
    } finally {
      setIsSaving(false);
    }`
    );
    // AddCouponModal uses something else maybe?
    content = content.replace(
      `onSave(payload);
    onClose();`,
      `setIsSaving(true);
    try {
      await onSave(payload);
      onClose();
    } finally {
      setIsSaving(false);
    }`
    );
  }

  // Update save button
  content = content.replace(/<button className="btn-save" onClick=\{handleSave\}>([^<]+)<\/button>/g, '<button className="btn-save" onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "$1"}</button>');

  fs.writeFileSync(filePath, content);
}
console.log('Modals updated');
