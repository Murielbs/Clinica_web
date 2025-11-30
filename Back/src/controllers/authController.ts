import { Request, Response } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function login(req: Request, res: Response) {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  console.log(`[auth] login attempt for email: ${email}`);
  try {
    // debug: log incoming body keys
    // console.log('Request body keys:', Object.keys(req.body));
  } catch (e) {
    // ignore
  }
  try {
    // Caso a variável de ambiente DATABASE_URL não esteja definida (ex: ambiente local de desenvolvimento
    // sem acesso ao banco), suportamos um modo de desenvolvimento que permite um login fake quando
    // `DEV_ALLOW_FAKE_AUTH` estiver definido como 'true'. Isso facilita testar integração front-back
    // sem tocar no banco de dados real.
    if (!process.env.DATABASE_URL && process.env.DEV_ALLOW_FAKE_AUTH === 'true') {
      console.warn('[auth] DATABASE_URL não encontrada — usando fallback DEV_ALLOW_FAKE_AUTH');
      // aceita a combinação fornecida pelo usuário para testes
      if (email === 'joao.almeida@hospital.com' && senha === 'Joao123') {
        const medico: any = {
          MedicoID: 1,
          Email: email,
          Nome: 'Dr. João Almeida',
          Especialidade: 'Clínica Geral'
        };

        const secret = process.env.JWT_SECRET || 'dev-secret';
        const token = jwt.sign({ medicoId: medico.MedicoID, email: medico.Email }, secret, { expiresIn: '8h' });
        return res.json({ token, medico });
      } else {
        return res.status(401).json({ error: 'Credenciais inválidas (fake)' });
      }
    }

    const rows: any = await prisma.$queryRaw`SELECT * FROM \`Médico\` WHERE Email = ${email} LIMIT 1`;
    const medico = Array.isArray(rows) ? rows[0] : rows;
    if (!medico) return res.status(401).json({ error: 'Credenciais inválidas' });

    const storedPassword = medico.Senha || medico.senha || medico.Password || medico.password;
    if (!storedPassword) return res.status(500).json({ error: 'Senha não encontrada para o usuário' });

    let passwordMatch = false;
    if (typeof storedPassword === 'string' && (storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2y$'))) {
      passwordMatch = await bcrypt.compare(senha, storedPassword);
    } else {
      passwordMatch = senha === storedPassword;
    }

    if (!passwordMatch) return res.status(401).json({ error: 'Credenciais inválidas' });

    const secret = process.env.JWT_SECRET || 'dev-secret';
    const token = jwt.sign({ medicoId: medico.MedicoID, email: medico.Email }, secret, { expiresIn: '8h' });

    const { Senha, senha: s, Password, password, ...medicoSemSenha } = medico;

    res.json({ token, medico: medicoSemSenha });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
