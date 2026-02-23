function getCompleteFormData() {
  const [file] = document.querySelector('#vittaexml').files;
  const reader = new FileReader();
  var xmlText = '';
  var x2js = new X2JS();
  reader.addEventListener(
    'load',
    () => {
      try {
        xmlText = x2js.xml_str2json(reader.result);

        const nomeCompleto =
          xmlText['CURRICULO-VITAE']['DADOS-GERAIS']['NOME-COMPLETO'];
        const dataAtualizacao = xmlText['CURRICULO-VITAE']['_DATA-ATUALIZACAO'];

        const userDict = {};
        userDict['lattesId'] =
          xmlText['CURRICULO-VITAE']['_NUMERO-IDENTIFICADOR'];
        userDict['resumo'] = xmlText['CURRICULO-VITAE']['DADOS-GERAIS'][
          'RESUMO-CV'
        ]
          ? xmlText['CURRICULO-VITAE']['DADOS-GERAIS']['RESUMO-CV'][
              '_TEXTO-RESUMO-CV-RH'
            ]
          : '';
        userDict['resumoIngles'] =
          userDict['resumo'] != ''
            ? xmlText['CURRICULO-VITAE']['DADOS-GERAIS']['RESUMO-CV'][
                '_TEXTO-RESUMO-CV-RH-EN'
              ]
            : '';
        userDict['ultimaAtualizacao'] = parseDateDDMMYYYY(dataAtualizacao);
        const formacao =
          xmlText['CURRICULO-VITAE']['DADOS-GERAIS'][
            'FORMACAO-ACADEMICA-TITULACAO'
          ];
        var formacaoTexto = '';
        var formacaoTextoIngles = '';
        if (formacao.hasOwnProperty('DOUTORADO')) {
          formacaoTexto += 'Doutorado;';
          formacaoTextoIngles += 'Doctorate;';
          if (formacao['DOUTORADO'].length > 0) {
            const curso = formacao['DOUTORADO'][0]['_NOME-CURSO'] + ';';
            const cursoIngles =
              formacao['DOUTORADO'][0]['_NOME-CURSO-INGLES'] == ''
                ? formacao['DOUTORADO'][0]['_NOME-CURSO'] + ';'
                : formacao['DOUTORADO'][0]['_NOME-CURSO-INGLES'] + ';';
            const instituicao =
              formacao['DOUTORADO'][0]['_NOME-INSTITUICAO'] + ';';
            const ano = formacao['DOUTORADO'][0]['_ANO-DE-CONCLUSAO'] + ';';
            formacaoTexto += curso + instituicao + ano;
            formacaoTextoIngles += cursoIngles + instituicao + ano;
          } else {
            const curso = formacao['DOUTORADO']['_NOME-CURSO'] + ';';
            const cursoIngles =
              formacao['DOUTORADO']['_NOME-CURSO-INGLES'] == ''
                ? formacao['DOUTORADO']['_NOME-CURSO'] + ';'
                : formacao['DOUTORADO']['_NOME-CURSO-INGLES'] + ';';
            const instituicao =
              formacao['DOUTORADO']['_NOME-INSTITUICAO'] + ';';
            const ano = formacao['DOUTORADO']['_ANO-DE-CONCLUSAO'] + ';';
            formacaoTexto += curso + instituicao + ano;
            formacaoTextoIngles += cursoIngles + instituicao + ano;
          }
        } else if (formacao.hasOwnProperty('MESTRADO')) {
          formacaoTexto += 'Mestrado;';
          formacaoTextoIngles += "Master's degree;";
          if (formacao['MESTRADO'].length > 0) {
            const curso = formacao['MESTRADO'][0]['_NOME-CURSO'] + ';';
            const cursoIngles =
              formacao['MESTRADO'][0]['_NOME-CURSO-INGLES'] == ''
                ? formacao['MESTRADO'][0]['_NOME-CURSO'] + ';'
                : formacao['MESTRADO'][0]['_NOME-CURSO-INGLES'] + ';';
            const instituicao =
              formacao['MESTRADO'][0]['_NOME-INSTITUICAO'] + ';';
            const ano = formacao['MESTRADO'][0]['_ANO-DE-CONCLUSAO'] + ';';
            formacaoTexto += curso + instituicao + ano;
            formacaoTextoIngles += cursoIngles + instituicao + ano;
          } else {
            const curso = formacao['MESTRADO']['_NOME-CURSO'] + ';';
            const cursoIngles =
              formacao['MESTRADO']['_NOME-CURSO-INGLES'] == ''
                ? formacao['MESTRADO']['_NOME-CURSO'] + ';'
                : formacao['MESTRADO']['_NOME-CURSO-INGLES'] + ';';
            const instituicao = formacao['MESTRADO']['_NOME-INSTITUICAO'] + ';';
            const ano = formacao['MESTRADO']['_ANO-DE-CONCLUSAO'] + ';';
            formacaoTexto += curso + instituicao + ano;
            formacaoTextoIngles += cursoIngles + instituicao + ano;
          }
        } else {
          formacaoTexto += 'Graduado;';
          formacaoTextoIngles += 'Graduate;';
          if (formacao['GRADUACAO'].length > 0) {
            const curso = formacao['GRADUACAO'][0]['_NOME-CURSO'] + ';';
            const cursoIngles =
              formacao['GRADUACAO'][0]['_NOME-CURSO-INGLES'] == ''
                ? formacao['GRADUACAO'][0]['_NOME-CURSO'] + ';'
                : formacao['GRADUACAO'][0]['_NOME-CURSO-INGLES'] + ';';
            const instituicao =
              formacao['GRADUACAO'][0]['_NOME-INSTITUICAO'] + ';';
            const ano = formacao['GRADUACAO'][0]['_ANO-DE-CONCLUSAO'] + ';';
            formacaoTexto += curso + instituicao + ano;
            formacaoTextoIngles += cursoIngles + instituicao + ano;
          } else {
            const curso = formacao['GRADUACAO']['_NOME-CURSO'] + ';';
            const cursoIngles =
              formacao['GRADUACAO']['_NOME-CURSO-INGLES'] == ''
                ? formacao['GRADUACAO']['_NOME-CURSO'] + ';'
                : formacao['GRADUACAO']['_NOME-CURSO-INGLES'] + ';';
            const instituicao =
              formacao['GRADUACAO']['_NOME-INSTITUICAO'] + ';';
            const ano = formacao['GRADUACAO']['_ANO-DE-CONCLUSAO'] + ';';
            formacaoTexto += curso + instituicao + ano;
            formacaoTextoIngles += cursoIngles + instituicao + ano;
          }
        }
        userDict['formacao'] = formacaoTexto;
        userDict['formacaoIngles'] = formacaoTextoIngles;

        const publicacoes =
          xmlText['CURRICULO-VITAE']['PRODUCAO-BIBLIOGRAFICA'];
        let publicDict = {};
        if (publicacoes) {
          for (var i in publicacoes) {
            var val = publicacoes[i];
            for (var j in val) {
              var sub_key = j;
              var sub_val = val[j];
              if (sub_val.length > 0) {
                publicDict[j] = [];
                for (var m in sub_val) {
                  const publicValue = get_publicDict(sub_val[m]);
                  publicDict[j].push(publicValue);
                }
              } else {
                if (sub_val.hasOwnProperty('AUTORES')) {
                  publicDict[j] = [];
                  const publicValue = get_publicDict(sub_val);
                  publicDict[j].push(publicValue);
                } else {
                  for (var k in sub_val) {
                    if (sub_val[k].length > 0) {
                      publicDict[k] = [];
                      for (var l in sub_val[k]) {
                        const publicValue = get_publicDict(sub_val[k][l]);
                        publicDict[k].push(publicValue);
                      }
                    } else {
                      if (sub_val[k].hasOwnProperty('AUTORES')) {
                        publicDict[k] = [];
                        const publicValue = get_publicDict(sub_val[k]);
                        publicDict[k].push(publicValue);
                      }
                    }
                  }
                }
              }
            }
          }
        }

        const instituicoes =
          xmlText?.['CURRICULO-VITAE']?.['DADOS-GERAIS']?.[
            'ATUACOES-PROFISSIONAIS'
          ]?.['ATUACAO-PROFISSIONAL'] ?? [];

        const projetos = get_projetos_from_instituicao(instituicoes);
        const projectDict = { projetos: [] };
        if (projetos) {
          if (projetos['PARTICIPACAO-EM-PROJETO'].length > 0) {
            sub_val = projetos['PARTICIPACAO-EM-PROJETO'];
            for (var p in sub_val) {
              if (sub_val[p]['PROJETO-DE-PESQUISA'].length > 0) {
                for (var o in sub_val[p]['PROJETO-DE-PESQUISA']) {
                  const project = get_projectDict(
                    sub_val[p]['PROJETO-DE-PESQUISA'][o],
                    nomeCompleto,
                    userDict['lattesId'],
                  );
                  projectDict['projetos'].push(project);
                }
              } else {
                const project = get_projectDict(
                  sub_val[p]['PROJETO-DE-PESQUISA'],
                  nomeCompleto,
                  userDict['lattesId'],
                );
                projectDict['projetos'].push(project);
              }
            }
          } else {
            const project = get_projectDict(
              sub_val['PROJETO-DE-PESQUISA'],
              nomeCompleto,
              userDict['lattesId'],
            );
            projectDict['projetos'].push(project);
          }
        }

        const orientacaoDict = { orientacoes: [] };
        const orientacoesAndamento =
          xmlText['CURRICULO-VITAE']['DADOS-COMPLEMENTARES'][
            'ORIENTACOES-EM-ANDAMENTO'
          ];
        if (orientacoesAndamento) {
          for (var tipo in orientacoesAndamento) {
            var t = 0;
            switch (tipo) {
              case 'ORIENTACAO-EM-ANDAMENTO-DE-DOUTORADO':
                t = 3;
                break;

              case 'ORIENTACAO-EM-ANDAMENTO-DE-MESTRADO':
                t = 2;
                break;

              default:
                t = 1;
                break;
            }
            if (orientacoesAndamento[tipo].length > 0) {
              for (var i in orientacoesAndamento[tipo]) {
                const orientacao = get_guidenceDict(
                  orientacoesAndamento[tipo][i],
                );
                orientacao['tipo'] = t;
                orientacao['status'] = 1;
                orientacaoDict['orientacoes'].push(orientacao);
              }
            } else {
              const orientacao = get_guidenceDict(orientacoesAndamento[tipo]);
              orientacao['tipo'] = t;
              orientacao['status'] = 1;
              orientacaoDict['orientacoes'].push(orientacao);
            }
          }
        }
        const orientacoesConcluida = xmlText['CURRICULO-VITAE'][
          'OUTRA-PRODUCAO'
        ]
          ? xmlText['CURRICULO-VITAE']['OUTRA-PRODUCAO'][
              'ORIENTACOES-CONCLUIDAS'
            ]
          : null;
        if (orientacoesConcluida) {
          for (var tipo in orientacoesConcluida) {
            var t = 0;
            switch (tipo) {
              case 'ORIENTACOES-CONCLUIDAS-PARA-DOUTORADO':
                t = 3;
                break;

              case 'ORIENTACOES-CONCLUIDAS-PARA-MESTRADO':
                t = 2;
                break;

              default:
                t = 1;
                break;
            }
            if (orientacoesConcluida[tipo].length > 0) {
              for (var i in orientacoesConcluida[tipo]) {
                const orientacao = get_guidenceDict(
                  orientacoesConcluida[tipo][i],
                );
                orientacao['tipo'] = t;
                orientacao['status'] = 0;
                orientacaoDict['orientacoes'].push(orientacao);
              }
            } else {
              const orientacao = get_guidenceDict(orientacoesConcluida[tipo]);
              orientacao['tipo'] = t;
              orientacao['status'] = 0;
              orientacaoDict['orientacoes'].push(orientacao);
            }
          }
        }
        const premios =
          xmlText['CURRICULO-VITAE']['DADOS-GERAIS']['PREMIOS-TITULOS'] ==
          undefined
            ? null
            : xmlText['CURRICULO-VITAE']['DADOS-GERAIS']['PREMIOS-TITULOS'][
                'PREMIO-TITULO'
              ];
        let premiosArr = [];
        if (premios) {
          if (premios.length > 0) {
            for (var i in premios) {
              const titulo = premios[i]['_NOME-DO-PREMIO-OU-TITULO'];
              const ano = premios[i]['_ANO-DA-PREMIACAO'];
              const entidade = premios[i]['_NOME-DA-ENTIDADE-PROMOTORA'];
              premiosArr.push({
                titulo,
                ano,
                entidade,
              });
            }
          } else {
            const titulo = premios['_NOME-DO-PREMIO-OU-TITULO'];
            const ano = premios['_ANO-DA-PREMIACAO'];
            const entidade = premios['_NOME-DA-ENTIDADE-PROMOTORA'];
            premiosArr.push({
              titulo,
              ano,
              entidade,
            });
          }
        }
        data.append('orientacoes', JSON.stringify(orientacaoDict));
        data.append('projetos', JSON.stringify(projectDict));
        data.append('premios', JSON.stringify({ premios: premiosArr }));
        data.append('publicacoes', JSON.stringify(publicDict));
        data.append('info', JSON.stringify(userDict));
        publicCallback(data);
      } catch (error) {
        errorCallback(error);
      }
    },
    false,
  );

  reader.readAsText(file, 'ISO-8859-1');
}
