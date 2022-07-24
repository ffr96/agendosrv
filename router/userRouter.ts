import express from 'express';
import mUser from '../schema/users';
import crypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { parseString } from '../utils/parsers';

const router = express.Router();

router.post('/', async(req, res) => {
  try {
    const passwordHash = await crypt.hash(parseString(req.body.password), 10);
    const user = new mUser({
      username: parseString(req.body.username),
      passwordHash
    });

    await user.save();
    return res.send(user);
  } catch(e) {
    console.log((e as Error).message);
    return res.send('Invalid username or password');
  }
});

router.post('/login', async(req, res) => {
  try {
    const user = await mUser.findOne({username: parseString(req.body?.username)});
    if (user) {
      const isCorrect = await crypt.compare(parseString(req.body.password), user.passwordHash);
      const toSign = {
        username: user.username,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        id: user._id
      };

      if (isCorrect) {
        const token = jwt.sign(toSign, parseString(process.env.CODE));
        return res.send({token, username: user.username});
      } else {
        return res.status(400).send('Wrong username or password');
      }
    } else {
     return res.status(404).send('User not found').end();
    }
  } catch(e) {
    console.log((e as Error).message);
    return res.status(400).send({message:'Invalid user'}).end();
  }

});

export default router;