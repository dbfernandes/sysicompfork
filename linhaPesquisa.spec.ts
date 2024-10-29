import { Request, Response } from 'express';
import linhaDePesquisaController from './src/resources/linhasDePesquisa/linhasDePesquisa.controller';
import { describe, it } from 'node:test';
import { jest, expect } from '@jest/globals';

// Mock para o Response
const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res) as any;
  res.json = jest.fn().mockReturnValue(res) as any;
  return res;
};

describe('Linha de Pesquisa Controller', () => {
  
  it('deve listar todas as linhas de pesquisa', async () => {
    const req = {} as Request;
    const res = mockResponse();

    await linhaDePesquisaController.listar(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });

  it('deve criar uma nova linha de pesquisa', async () => {
    const req = { body: { nome: 'Nova Linha de Pesquisa' } } as Request;
    const res = mockResponse();

    await linhaDePesquisaController.criar(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ nome: 'Nova Linha de Pesquisa' }));
  });

  it('deve remover uma linha de pesquisa', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const res = mockResponse();

    await linhaDePesquisaController.remover(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ mensagem: 'Linha de pesquisa removida com sucesso' }));
  });

  it('deve editar uma linha de pesquisa existente', async () => {
    const req = { params: { id: '1' }, body: { nome: 'Linha de Pesquisa Editada' } } as unknown as Request;
    const res = mockResponse();

    await linhaDePesquisaController.editar(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ nome: 'Linha de Pesquisa Editada' }));
  });

});