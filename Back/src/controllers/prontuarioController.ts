import { Request, Response } from 'express';
import prisma from '../prisma';

export async function listProntuarios(_req: Request, res: Response) {
  const items = await prisma.prontuario.findMany();
  res.json(items);
}

export async function getProntuario(req: Request, res: Response) {
  const id = Number(req.params.id);
  const item = await prisma.prontuario.findUnique({ where: { ProntuarioID: id } });
  if (!item) return res.status(404).json({ error: 'Prontuário não encontrado' });
  res.json(item);
}

export async function createProntuario(req: Request, res: Response) {
  try {
    const created = await prisma.prontuario.create({ data: req.body });
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateProntuario(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const updated = await prisma.prontuario.update({ where: { ProntuarioID: id }, data: req.body });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteProntuario(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    await prisma.prontuario.delete({ where: { ProntuarioID: id } });
    res.status(204).end();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
