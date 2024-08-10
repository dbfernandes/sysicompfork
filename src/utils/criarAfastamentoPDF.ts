import fs from 'fs';
import path from 'path';
import Puppeteer from 'puppeteer';
import usuarioService from '../resources/usuarios/usuario.service';
import afastamentoService from '../resources/afastamentoTemporario/afastamentoTemporario.service';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 1. Pegar dados do afastamento (Pegar o usario, afastamento, email) e formatar tudo em uma constante
// 2. Pegar o modelo do afastamento(header e footer) e compilar o HTML
// 3. Gerar o PDF
