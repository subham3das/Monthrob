import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).populate('category', 'name').lean();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, category, mrp, price, discount, status, images, colors, sizes, tags, description, collectionName, material, stock } = req.body;
    const product = new Product({
      name, category, mrp, price, discount, status, 
      images, colors, sizes, tags, description, collectionName, material, stock
    });
    const createdProduct = await product.save();
    if (req.io) {
      req.io.emit('product_added', createdProduct);
    }
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }
    ).populate('category', 'name');
    
    if (updatedProduct) {
      if (req.io) {
        req.io.emit('product_updated', updatedProduct);
      }
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await Product.deleteOne({ _id: product._id });
      if (req.io) {
        req.io.emit('product_deleted', product._id);
      }
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
