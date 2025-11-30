import express from 'express';
import {
  listProntuarios,
  getProntuario,
  createProntuario,
  updateProntuario,
  deleteProntuario,
} from '../controllers/prontuarioController';

const router = express.Router();

router.get('/', listProntuarios);
router.get('/:id', getProntuario);
router.post('/', createProntuario);
router.put('/:id', updateProntuario);
router.delete('/:id', deleteProntuario);

export default router;
