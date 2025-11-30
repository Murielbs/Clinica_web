import express from 'express';
import { sampleRelatorio } from '../controllers/relatorioController';

const router = express.Router();

router.get('/sample', sampleRelatorio);

export default router;
