import { Request, Response } from 'express';
import prisma from '../prisma';

export async function listConsultas(_req: Request, res: Response) {
  const items = await prisma.consulta.findMany();
  res.json(items);
}

export async function getConsulta(req: Request, res: Response) {
  const id = Number(req.params.id);
  const item = await prisma.consulta.findUnique({ where: { ConsultaID: id } });
  if (!item) return res.status(404).json({ error: 'Consulta não encontrada' });
  res.json(item);
}

export async function createConsulta(req: Request, res: Response) {
  try {
    const created = await prisma.consulta.create({ data: req.body });
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateConsulta(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const updated = await prisma.consulta.update({ where: { ConsultaID: id }, data: req.body });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteConsulta(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    await prisma.consulta.delete({ where: { ConsultaID: id } });
    res.status(204).end();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function getPacientesHoje(req: Request, res: Response) {
  const medicoIdParam = Number(req.params.medicoId);
  if (Number.isNaN(medicoIdParam)) return res.status(400).json({ error: 'MedicoID inválido' });

  const tokenMedicoId = (req as any).medicoId as number | undefined;
  if (tokenMedicoId && tokenMedicoId !== medicoIdParam) return res.status(403).json({ error: 'Acesso negado' });

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const amanha = new Date(hoje);
  amanha.setDate(hoje.getDate() + 1);

  try {
    const consultas = await prisma.consulta.findMany({
      where: {
        MedicoID: medicoIdParam,
        DataHoraInicio: {
          gte: hoje,
          lt: amanha,
        },
      },
      include: {
        prontuario: {
          include: {
            paciente: true,
          },
        },
      },
      orderBy: { DataHoraInicio: 'asc' },
    });

    const seen = new Set<number>();
    const pacientes: any[] = [];
    for (const c of consultas) {
      const p = c.prontuario?.paciente;
      if (p && !seen.has(p.PacienteID)) {
        seen.add(p.PacienteID);
        pacientes.push({ ConsultaID: c.ConsultaID, DataHoraInicio: c.DataHoraInicio, paciente: p });
      }
    }

    res.json(pacientes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
