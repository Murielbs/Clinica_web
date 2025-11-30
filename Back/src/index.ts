import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import pacienteRouter from './routes/paciente';
import medicoRouter from './routes/medico';
import prontuarioRouter from './routes/prontuario';
import consultaRouter from './routes/consulta';
import diagnosticoRouter from './routes/diagnostico';
import testeRouter from './routes/testeAplicado';
import documentoRouter from './routes/documento';
import authRouter from './routes/auth';
import relatorioRouter from './routes/relatorio';

// Carrega `.env` local do backend primeiro; se `DATABASE_URL` não estiver presente,
// tenta carregar o `.env` na raiz do repositório (onde você colocou o DATABASE_URL).
dotenv.config();
if (!process.env.DATABASE_URL) {
  const rootEnv = path.resolve(__dirname, '../../.env');
  dotenv.config({ path: rootEnv });
  if (process.env.DATABASE_URL) {
    console.log('[env] carregado DATABASE_URL a partir de', rootEnv);
  }
}

const app = express();
app.use(bodyParser.json());

const frontUrl = process.env.FRONT_URL || 'http://localhost:5173';
app.use(cors({ origin: frontUrl, credentials: true }));

app.get('/health', (_req: Request, res: Response) => res.json({ status: 'ok' }));

app.use('/pacientes', pacienteRouter);
app.use('/medicos', medicoRouter);
app.use('/prontuarios', prontuarioRouter);
app.use('/consultas', consultaRouter);
app.use('/auth', authRouter);
app.use('/diagnosticos', diagnosticoRouter);
app.use('/testes', testeRouter);
app.use('/documentos', documentoRouter);
app.use('/relatorios', relatorioRouter);

// tratamento de erro simples
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
