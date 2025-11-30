import express from 'express';
import {
  listDocumentos,
  getDocumento,
  createDocumento,
  updateDocumento,
  deleteDocumento,
} from '../controllers/documentoController';

const router = express.Router();

router.get('/', listDocumentos);
router.get('/:id', getDocumento);
router.post('/', createDocumento);
router.put('/:id', updateDocumento);
router.delete('/:id', deleteDocumento);

export default router;
