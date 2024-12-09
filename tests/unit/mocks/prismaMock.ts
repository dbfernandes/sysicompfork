// tests/unit/mocks/prismaMock.ts
import { PrismaClient } from '@prisma/client';
import { mockDeep, MockProxy } from 'jest-mock-extended';

// Cria um mock profundo do PrismaClient
export const prismaMock: MockProxy<PrismaClient> = mockDeep<PrismaClient>();
