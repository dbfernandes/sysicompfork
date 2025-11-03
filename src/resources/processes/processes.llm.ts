import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_API_KEY!;
const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-pro';

if (!apiKey) {
  console.warn(
    '[LLM] GOOGLE_API_KEY ausente. A geração por IA ficará indisponível.',
  );
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateBpmnFromDescription(
  description: string,
  context?: {
    title?: string;
    language?: 'pt' | 'en';
  },
) {
  if (!genAI) throw new Error('LLM API não configurada');

  const model = genAI.getGenerativeModel({ model: modelName });

  const lang = context?.language || 'pt';
  const title = (context?.title || 'Processo Inicial')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const prompt = buildPrompt({ description, title, lang });
  console.log(prompt);
  // Importante: peça somente o XML, sem comentários ou markdown
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 8000,
    },
  });

  const text = result.response.text().trim();
  console.log(text);
  // Pós-processo básico: retirar cercas de código e validar o root
  const xml = text
    .replace(/^```xml\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  if (
    !xml.includes('<bpmn:definitions') ||
    !xml.includes('</bpmn:definitions>')
  ) {
    throw new Error('Resposta da IA não contém um BPMN XML válido.');
  }

  return xml;
}
function buildPrompt({
  description,
  title,
  lang,
}: {
  description: string;
  title: string;
  lang: 'pt' | 'en';
}) {
  const usePt = (lang ?? 'pt') === 'pt';

  return `
Você é um especialista em modelagem BPMN 2.0 que atende a **Secretaria do Instituto de Computação** de uma **Universidade Federal** no Brasil.
Seu objetivo é gerar **exclusivamente** um **BPMN 2.0 XML válido**, compatível com bpmn.io, para apoiar fluxos internos da Secretaria (ex.: preparação e publicação de **edital**, **inscrição**, **homologação**, **agendamento de banca**, **qualificação** e **defesa**).

### 📌 Contexto e Diretrizes Institucionais
- O diagrama será usado por **servidores técnico-administrativos**, **coordenação**, **docentes** e **discentes**.
- **Privacidade**: **NÃO** inclua dados pessoais (CPF, e-mail, RG, telefone). Use rótulos genéricos (ex.: “Candidato”, “Servidor da Secretaria”, “Docente”).
- Linguagem: **${usePt ? 'Português (Brasil)' : 'English'}**, clara e administrativa, com rótulos de tarefas iniciando em **verbo de ação** (ex.: “Conferir Documentos”, “Emitir Portaria”).
- Atores/partes envolvidas típicas: **Secretaria**, **Coordenação**, **Comissão**, **Docente**, **Discente/Candidato**, **Sistemas** (ex.: “Sistema de Inscrição”, “Sistema de Agendamento”).
- **Pools/Lanes**: só use se a descrição **explicitar** atores distintos e necessários; caso contrário, **não usar** (modelo enxuto).
- **Conformidade**: foque no fluxo administrativo, decisões (gateways) objetivas e entregáveis (ex.: “Lista Homologada”, “Ata de Defesa”).

### ✅ Requisitos OBRIGATÓRIOS da Saída
1) **Responda SOMENTE com XML BPMN 2.0** (sem markdown, sem comentários, sem texto fora do XML).
2) Use estes namespaces:
   xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
   xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
   xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
   xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
3) Estrutura mínima:
   - <bpmn:definitions> como raiz;
   - Um <bpmn:process isExecutable="false" name="${title}">;
   - **Um** <bpmn:startEvent> (“Início”) e **um** <bpmn:endEvent> (“Fim”);
   - **6 a 14 elementos** no total (tarefas, gateways e eventos), com **IDs únicos** (ex.: StartEvent_1, Task_1, Gateway_1).
4) Nomenclatura:
   - Tarefas com **verbos** (ex.: “Receber Inscrição”, “Validar Documentos”, “Publicar Resultado”).
   - Gateways com **pergunta objetiva** (ex.: “Documentos Completos?”).
   - **Sem dados pessoais** nos nomes.
5) Gateways apenas quando houver **decisão real** descrita; evite complexidade desnecessária.
6) **Não** inclua pools/lanes/mensagens a menos que explicitamente exigido.
7) **Nada** além do XML.

### 🧭 Exemplos (apenas referência de estilo; NÃO copiar)
- Exemplo de tarefas administrativas: “Receber Solicitação”, “Conferir Requisitos do Edital”, “Registrar no Sistema”, “Emitir Comunicado”, “Arquivar Documentos”.
- Exemplo de decisão: “Documentação Válida?”, “Orientador Confirmado?”, “Defesa Aprovada?”.

### 📝 Descrição fornecida (resuma em um fluxo administrativo claro)
"""
${description}
"""

### 🚀 Gere agora o BPMN 2.0 XML **completo** e **válido**, pronto para importação no bpmn.io, obedecendo a todos os requisitos acima.
`.trim();
}
