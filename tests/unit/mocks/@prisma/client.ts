import { PrismaClient } from '@prisma/client';
import { mockDeep, MockProxy } from 'jest-mock-extended';

// Cria um mock profundo do PrismaClient
const prismaMock: MockProxy<PrismaClient> = mockDeep<PrismaClient>();

// Mocka o construtor do PrismaClient para sempre retornar o mock
const PrismaClientMock = jest.fn(() => prismaMock);

export { PrismaClientMock as PrismaClient, prismaMock };
