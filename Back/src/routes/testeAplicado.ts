import express from 'express';
import {
  listTestes,
  getTeste,
  createTeste,
  updateTeste,
  deleteTeste,
} from '../controllers/testeController';

const router = express.Router();

router.get('/', listTestes);
router.get('/:id', getTeste);
router.post('/', createTeste);
router.put('/:id', updateTeste);
router.delete('/:id', deleteTeste);

export default router;
