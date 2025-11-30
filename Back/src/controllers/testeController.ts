import { Request, Response } from 'express';
import prisma from '../prisma';

export async function listTestes(_req: Request, res: Response) {
  const items = await prisma.testeAplicado.findMany();
  res.json(items);
}

export async function getTeste(req: Request, res: Response) {
  const id = Number(req.params.id);
  const item = await prisma.testeAplicado.findUnique({ where: { TesteID: id } });
  if (!item) return res.status(404).json({ error: 'Teste não encontrado' });
  res.json(item);
}

export async function createTeste(req: Request, res: Response) {
  try {
    const created = await prisma.testeAplicado.create({ data: req.body });
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateTeste(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const updated = await prisma.testeAplicado.update({ where: { TesteID: id }, data: req.body });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteTeste(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    await prisma.testeAplicado.delete({ where: { TesteID: id } });
    res.status(204).end();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
