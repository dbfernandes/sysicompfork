"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// test/integration/signUp.spec.ts
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../../src/app")); // Ajuste o caminho conforme necessário
const candidato_service_1 = __importDefault(require("../../../src/resources/candidato/candidato.service"));
const edital_service_1 = __importDefault(require("../../../src/resources/edital/edital.service"));
// Mock dos serviços
jest.mock('../../../src/resources/candidato/candidato.service');
jest.mock('../../../src/resources/edital/edital.service');
const agent = supertest_1.default.agent(app_1.default);
let csrfToken;
function extractCsrfTokenFromBody(res) {
    const body = res.text;
    // Expressão regular para encontrar o campo _csrf no HTML
    const csrfTokenMatch = body.match(/name="_csrf" value="([^"]+)"/);
    if (csrfTokenMatch && csrfTokenMatch[1]) {
        return csrfTokenMatch[1];
    }
    else {
        throw new Error('CSRF token não encontrado no corpo da resposta');
    }
}
describe('Rota SignUp', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Configurar mocks antes dos testes
        edital_service_1.default.listEditalsAvailable.mockResolvedValue([
            // Mock dos editais disponíveis
            { id: 1, name: 'Edital 1' },
        ]);
        const response = yield agent.get('/selecaoppgi/cadastro');
        csrfToken = extractCsrfTokenFromBody(response);
    }));
    describe('GET /selecaoppgi/cadastro', () => {
        it('deve renderizar a view signUp com status 200', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get('/selecaoppgi/cadastro')
                .set('Accept', 'text/html');
            expect(response.status).toBe(200);
            expect(response.text).toContain('<h1>Editais Disponíveis</h1>');
        }));
    });
    describe('POST /selecaoppgi/cadastro', () => {
        it('deve criar um novo candidato quando os dados são válidos', () => __awaiter(void 0, void 0, void 0, function* () {
            candidato_service_1.default.findCandidatoByEmailAndEdital.mockResolvedValue(null);
            candidato_service_1.default.create.mockResolvedValue({
                email: 'test@example.com',
                idEdital: 1,
                id: 123,
                posicaoEdital: 1,
            });
            const response = yield agent
                .post('/selecaoppgi/cadastro')
                .send({
                email: 'test@example.com',
                senha: 'password123',
                edital: '1',
                _csrf: csrfToken,
            })
                .set('Accept', 'application/json');
            expect(response.status).toBe(201);
        }));
        it('deve retornar 403 quando os dados são incompletos', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield agent
                .post('/selecaoppgi/cadastro')
                .send({
                email: 'test@example.com',
                senha: '',
                edital: '1',
                _csrf: csrfToken,
            })
                .set('Accept', 'application/json');
            expect(response.status).toBe(403);
            expect(response.body.error).toBe('Dados incompletos ou mal formatados');
        }));
        it('deve retornar 409 quando o candidato já existe', () => __awaiter(void 0, void 0, void 0, function* () {
            candidato_service_1.default.findCandidatoByEmailAndEdital.mockResolvedValue({
                id: 123,
                email: 'existing@example.com',
            });
            const response = yield agent
                .post('/selecaoppgi/cadastro')
                .send({
                email: 'existing@example.com',
                senha: 'password123',
                edital: '1',
                _csrf: csrfToken,
            })
                .set('Accept', 'application/json');
            expect(response.status).toBe(409);
            expect(response.body.error).toBe('Candidato já existe para este edital');
        }));
        it('deve retornar 500 em caso de erro no servidor', () => __awaiter(void 0, void 0, void 0, function* () {
            candidato_service_1.default.findCandidatoByEmailAndEdital.mockResolvedValue(null);
            candidato_service_1.default.create.mockRejectedValue(new Error('Erro no banco de dados'));
            const response = yield agent
                .post('/selecaoppgi/cadastro')
                .send({
                email: 'test@example.com',
                senha: 'password123',
                edital: '1',
                _csrf: csrfToken,
            })
                .set('Accept', 'application/json');
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Não foi possível criar o candidato');
        }));
    });
});
