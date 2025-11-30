import { Request, Response } from 'express';

// Retorna um relatório de exemplo (não depende do banco). Útil para testar integração front-back.
export async function sampleRelatorio(_req: Request, res: Response) {
  const sample = {
    paciente: {
      nome: 'Carlos Silva',
      idade: 42,
      prontuario: 'PRT-12345'
    },
    resultados: {
      ASRS_18: 'Triagem Positiva',
      PHQ_9: 'Sintomas Moderados',
      itensCriticos: 1
    },
    laudo: `O paciente apresenta pontuação sugestiva de TDAH e sintomas depressivos de intensidade moderada. Recomenda-se avaliação completa.`
  };

  res.json(sample);
}
