import express from 'express';
import {
  listDiagnosticos,
  getDiagnostico,
  createDiagnostico,
  updateDiagnostico,
  deleteDiagnostico,
} from '../controllers/diagnosticoController';

const router = express.Router();

router.get('/', listDiagnosticos);
router.get('/:id', getDiagnostico);
router.post('/', createDiagnostico);
router.put('/:id', updateDiagnostico);
router.delete('/:id', deleteDiagnostico);

export default router;
