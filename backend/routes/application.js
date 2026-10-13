import express from 'express';
import Application from '../models/Application.js';
import mongoose from 'mongoose';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
router.use(requireAuth);
// GET total analyses count
router.get('/stats', async (req, res) => {
  try {
    const stats = await mongoose.connection.db
      .collection('stats')
      .findOne({ _id: 'global' });
    res.json({ totalAnalyses: stats?.totalAnalyses || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/",async(req,res)=>{
  const apps = await Application.find({ user: req.user.id }).sort({createdAt:-1});
  res.json(apps);
})

router.patch('/:id', async (req, res) => {
  const app = await Application.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { status: req.body.status },
    { new: true }
  );
  if (!app) return res.status(404).json({ error: 'Application not found' });
  res.json(app);
});

router.delete("/:id",async(req,res)=>{
  try{
  const app = await Application.findOneAndDelete({ _id: req.params.id, user: req.user.id })
  if (!app) return res.status(404).json({ error: 'Application not found' });
   res.json({ success: true, message: 'Application deleted' });
  }catch(error){
  res.status(500).json({ error: error.message });
  }

})



export default router;
