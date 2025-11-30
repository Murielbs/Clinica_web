import { Request, Response } from 'express';
import prisma from '../prisma';

export async function listDiagnosticos(_req: Request, res: Response) {
  const items = await prisma.diagnostico.findMany();
  res.json(items);
}

export async function getDiagnostico(req: Request, res: Response) {
  const id = Number(req.params.id);
  const item = await prisma.diagnostico.findUnique({ where: { DiagnosticoID: id } });
  if (!item) return res.status(404).json({ error: 'Diagnóstico não encontrado' });
  res.json(item);
}

export async function createDiagnostico(req: Request, res: Response) {
  try {
    const created = await prisma.diagnostico.create({ data: req.body });
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateDiagnostico(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const updated = await prisma.diagnostico.update({ where: { DiagnosticoID: id }, data: req.body });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteDiagnostico(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    await prisma.diagnostico.delete({ where: { DiagnosticoID: id } });
    res.status(204).end();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
