import express from 'express';
import {
  listMedicos,
  getMedico,
  createMedico,
  updateMedico,
  deleteMedico,
} from '../controllers/medicoController';

const router = express.Router();

router.get('/', listMedicos);
router.get('/:id', getMedico);
router.post('/', createMedico);
router.put('/:id', updateMedico);
router.delete('/:id', deleteMedico);

export default router;
