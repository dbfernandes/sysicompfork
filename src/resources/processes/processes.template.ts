export function getTemplateXml(key: string, title?: string): string {
  const t = (title || 'Processo Inicial')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  switch (key) {
    case 'vazio':
      return baseXml(t, '');
    case 'padrao':
      return baseXml(
        t,
        `
        <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1"/>
        <bpmn:task id="Task_1" name="Tarefa 1"/>
        <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="EndEvent_1"/>
      `,
      );
    case 'inscricao':
      return baseXml(
        t,
        `
        <bpmn:sequenceFlow id="F1" sourceRef="StartEvent_1" targetRef="Task_coletar"/>
        <bpmn:task id="Task_coletar" name="Coletar Documentos"/>
        <bpmn:sequenceFlow id="F2" sourceRef="Task_coletar" targetRef="Gateway_decisao"/>
        <bpmn:exclusiveGateway id="Gateway_decisao" name="Documentos OK?"/>
        <bpmn:sequenceFlow id="F3" sourceRef="Gateway_decisao" targetRef="Task_corrigir">
          <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression"><![CDATA[nao]]></bpmn:conditionExpression>
        </bpmn:sequenceFlow>
        <bpmn:task id="Task_corrigir" name="Solicitar Correção"/>
        <bpmn:sequenceFlow id="F4" sourceRef="Task_corrigir" targetRef="Gateway_decisao"/>

        <bpmn:sequenceFlow id="F5" sourceRef="Gateway_decisao" targetRef="Task_homologar">
          <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression"><![CDATA[sim]]></bpmn:conditionExpression>
        </bpmn:sequenceFlow>
        <bpmn:task id="Task_homologar" name="Homologar Inscrição"/>
        <bpmn:sequenceFlow id="F6" sourceRef="Task_homologar" targetRef="EndEvent_1"/>
      `,
      );
    case 'homologacao':
      return baseXml(
        t,
        `
        <bpmn:sequenceFlow id="Fa" sourceRef="StartEvent_1" targetRef="Task_validar"/>
        <bpmn:task id="Task_validar" name="Validar Documentos"/>
        <bpmn:sequenceFlow id="Fb" sourceRef="Task_validar" targetRef="EndEvent_1"/>
      `,
      );
    default:
      return baseXml(t, '');
  }
}

function baseXml(title: string, inner: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  id="Definitions_${Date.now()}" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_${Date.now()}" name="${title}" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Início"/>
    ${inner}
    <bpmn:endEvent id="EndEvent_1" name="Fim"/>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_${Date.now()}"/>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;
}
