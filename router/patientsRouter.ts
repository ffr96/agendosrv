import express from 'express';
import mPatient from '../schema/patient';

const router = express.Router();

router.get('/:id', async(req,res) => {
  if (req.user) {
    try {
      const data = await mPatient.findOne({dni: req.params.id});
      res.send(data);
    } catch(e) {
      res.status(404).send(`Unable to find ${e}`);
    }
  } else {
    res.status(405).send('login required');
  }
});

export default router;