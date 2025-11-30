import { Request, Response } from 'express';
import prisma from '../prisma';

export async function listPacientes(_req: Request, res: Response) {
  const pacientes = await prisma.paciente.findMany();
  res.json(pacientes);
}

export async function getPaciente(req: Request, res: Response) {
  const id = Number(req.params.id);
  const paciente = await prisma.paciente.findUnique({ where: { PacienteID: id } });
  if (!paciente) return res.status(404).json({ error: 'Paciente não encontrado' });
  res.json(paciente);
}

export async function createPaciente(req: Request, res: Response) {
  const payload = req.body;
  try {
    const created = await prisma.paciente.create({ data: payload });
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function updatePaciente(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const updated = await prisma.paciente.update({ where: { PacienteID: id }, data: req.body });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function deletePaciente(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    await prisma.paciente.delete({ where: { PacienteID: id } });
    res.status(204).end();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
