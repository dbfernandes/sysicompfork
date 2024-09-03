import { Content } from 'pdfmake/interfaces';

export const headerDoc: Content = {
  margin: [40, 20, 40, 20],
  layout: {
    hLineColor: function (i, node) {
      return '#9da6a0';
    },
    hLineWidth: function (i, node) {
      return 4;
    },
  },
  table: {
    widths: ['auto', '*', 'auto'],
    body: [
      [
        {
          border: [false, false, false, true],
          image: 'public/img/brasao.png',
          fit: [65, 65],
          width: 65,
          marginBottom: 10,
        },
        {
          border: [false, false, false, true],
          stack: [
            { text: 'PODER EXECUTIVO', style: 'header' },
            { text: 'UNIVERSIDADE FEDERAL DO AMAZONAS', style: 'header' },
            { text: 'INSTITUTO DE COMPUTAÇÃO', style: 'header' },
            {
              text: 'PROGRAMA DE PÓS-GRADUAÇÃO EM INFORMÁTICA',
              style: 'header',
            },
          ],
          alignment: 'center',
          width: '*',
          marginBottom: 10,
          marginTop: 10,
        },
        {
          border: [false, false, false, true],

          image: 'public/img/logoUfam.png',
          fit: [65, 65],
          width: 65,
          marginBottom: 10,
        },
      ],
    ],
  },
};

export const footerDoc: Content = {
  margin: [20, 0, 20, 70],
  table: {
    widths: ['*', '*', '*'],
    body: [
      [
        {
          text: 'Av. Rodrigo Otávio, 6.200 - Campus Universitário Senador Arthur Virgílio Filho - CEP 69077-000 - Manaus, AM, Brasil',
          colSpan: 3,
          alignment: 'center',
          style: 'footer',
          border: [false, false, false, false],
        },
        {},
        {},
      ],
      [
        {
          text: 'Tel. (092) 3305-1193/2808/2809',
          style: 'footer',
          border: [false, false, false, false],
        },
        {
          text: 'E-mail: secretaria@icomp.ufam.edu.br',
          style: 'footer',
          border: [false, false, false, false],
        },
        {
          link: 'http://www.icomp.ufam.edu.br',
          text: 'http://www.icomp.ufam.edu.br',
          style: 'footer',
          border: [false, false, false, false],
        },
      ],
    ],
  },
};
