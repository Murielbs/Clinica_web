import express from 'express';
import {
  listConsultas,
  getConsulta,
  createConsulta,
  updateConsulta,
  deleteConsulta,
  getPacientesHoje,
} from '../controllers/consultaController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', listConsultas);
router.get('/:id', getConsulta);
router.post('/', createConsulta);
router.put('/:id', updateConsulta);
router.delete('/:id', deleteConsulta);


router.get('/medico/:medicoId/pacientes-hoje', authMiddleware, getPacientesHoje);

export default router;
