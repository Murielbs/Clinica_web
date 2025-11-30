import { Request, Response } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcrypt';

export async function listMedicos(_req: Request, res: Response) {
  const medicos = await prisma.medico.findMany();
  res.json(medicos);
}

export async function getMedico(req: Request, res: Response) {
  const id = Number(req.params.id);
  const medico = await prisma.medico.findUnique({ where: { MedicoID: id } });
  if (!medico) return res.status(404).json({ error: 'Médico não encontrado' });
  res.json(medico);
}

export async function createMedico(req: Request, res: Response) {
  try {
    const payload = req.body || {};
    const rawSenha = payload.senha ?? payload.Senha ?? payload.password ?? payload.Password;
    // se receber senha, hashear e inserir usando query raw para garantir que a coluna exista
    if (rawSenha) {
      const hashed = await bcrypt.hash(String(rawSenha), 10);
      const nome = payload.NomeCompleto ?? null;
      const crm = payload.CRM ?? null;
      const email = payload.Email ?? null;
      const telefone = payload.Telefone ?? null;
      const especialidade = payload.Especialidade ?? null;

      await prisma.$queryRaw`
        INSERT INTO \`Médico\` (NomeCompleto, CRM, Email, Telefone, Especialidade, Senha)
        VALUES (${nome}, ${crm}, ${email}, ${telefone}, ${especialidade}, ${hashed})
      `;

      // buscar o médico inserido para retornar
      const rows: any = await prisma.$queryRaw`SELECT * FROM \`Médico\` WHERE Email = ${email} LIMIT 1`;
      const medico = Array.isArray(rows) ? rows[0] : rows;
      if (!medico) return res.status(201).json({ message: 'Médico criado' });
      // não retornar a senha
      delete medico.Senha;
      delete medico.senha;
      delete medico.password;
      delete medico.Password;
      return res.status(201).json(medico);
    }

    // fallback: usar client prisma se não houver senha no payload
    const created = await prisma.medico.create({ data: payload });
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateMedico(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const updated = await prisma.medico.update({ where: { MedicoID: id }, data: req.body });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteMedico(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    await prisma.medico.delete({ where: { MedicoID: id } });
    res.status(204).end();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
