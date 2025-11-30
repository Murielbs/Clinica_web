import { Request, Response } from 'express';
import prisma from '../prisma';

export async function listDocumentos(_req: Request, res: Response) {
  const items = await prisma.documento.findMany();
  res.json(items);
}

export async function getDocumento(req: Request, res: Response) {
  const id = Number(req.params.id);
  const item = await prisma.documento.findUnique({ where: { DocumentoID: id } });
  if (!item) return res.status(404).json({ error: 'Documento não encontrado' });
  res.json(item);
}

export async function createDocumento(req: Request, res: Response) {
  try {
    const created = await prisma.documento.create({ data: req.body });
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateDocumento(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const updated = await prisma.documento.update({ where: { DocumentoID: id }, data: req.body });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteDocumento(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    await prisma.documento.delete({ where: { DocumentoID: id } });
    res.status(204).end();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
