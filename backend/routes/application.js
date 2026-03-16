import express from 'express';
import Application from '../models/Application.js';
import mongoose from 'mongoose';

const router = express.Router();
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
  const apps = await Application.find().sort({createdAt:-1});
  res.json(apps);
})

router.patch('/:id', async (req, res) => {
  const app = await Application.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(app);
});

router.delete("/:id",async(req,res)=>{
  try{
  const app = await Application.findByIdAndDelete(req.params.id)
   res.json({ success: true, message: 'Application deleted' });
  }catch(error){
  res.status(500).json({ error: error.message });
  }

})



export default router;