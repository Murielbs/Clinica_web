import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Token não fornecido' });
  const token = auth.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'dev-secret';
  try {
    const payload: any = jwt.verify(token, secret);
    
    (req as any).medicoId = payload.medicoId;
    next();
  } catch (err: any) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}
