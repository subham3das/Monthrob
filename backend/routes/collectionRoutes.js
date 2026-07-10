import express from 'express';
import Collection from '../models/Collection.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const collections = await Collection.find({}).lean();
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const collection = new Collection(req.body);
    const created = await collection.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Collection not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Collection.findByIdAndDelete(req.params.id);
    res.json({ message: 'Collection removed' });
  } catch (error) {
    res.status(404).json({ message: 'Collection not found' });
  }
});

export default router;
