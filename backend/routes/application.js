import express from 'express';
import Application from '../models/Application.js';


const router = express.Router();

router.get("/",async(req,res)=>{
    const apps = await Application.find().toSorted({createdAt:-1});
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


export default router;