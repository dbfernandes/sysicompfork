import path from 'path';
import {
  Content,
  ContentColumns,
  ContentTable,
  ContentText,
  TableCell,
  TableCellProperties,
} from 'pdfmake/interfaces';
import pdfmake from 'pdfmake';

export interface Option {
  label: string;
  value: string;
}

const fonts = {
  Roboto: {
    normal: path.join(
      __dirname,
      '../..',
      'public/fonts/Roboto/Roboto-Regular.ttf',
    ),
    bold: path.join(__dirname, '../..', 'public/fonts/Roboto/Roboto-Bold.ttf'),
    italics: path.join(
      __dirname,
      '../..',
      'public/fonts/Roboto/Roboto-Italic.ttf',
    ),
    bolditalics: path.join(
      __dirname,
      '../..',
      'public/fonts/Roboto/Roboto-BoldItalic.ttf',
    ),
  },
  Courier: {
    normal: path.join(
      __dirname,
      '../..',
      'public/fonts/Courier/courier-regular.ttf',
    ),
    bold: path.join(
      __dirname,
      '../..',
      'public/fonts/Courier/courier-bold.ttf',
    ),
    italics: path.join(
      __dirname,
      '../..',
      'public/fonts/Courier/courier-italic.ttf',
    ),
    bolditalics: path.join(
      __dirname,
      '../..',
      'public/fonts/Courier/courier-bold-italic.ttf',
    ),
  },
};

export const printer = new pdfmake(fonts);

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

export function renderOptions(
  options: Option[][],
  titleBold?: boolean,
): Content {
  return options.map((line) => {
    if (line.length === 1) {
      return lineOptions({
        title: line[0].label,
        info: line[0].value,
        titleBold,
      });
    }
    const options = line.map((option) => {
      return lineOptions({
        title: option.label,
        info: option.value,
        titleBold,
      });
    });
    return stackLine(options);
  });
}

export function titleSection(text: string): ContentText {
  return {
    text,
    style: 'sectionTitle',
    marginBottom: 8,
    marginTop: 16,
  };
}

export function stackLine(content: Content[]): ContentColumns {
  return {
    columns: [...content],
    columnGap: 10,
  };
}
interface LineOption {
  title: string;
  info?: string;
  titleBold?: boolean;
}
export function lineOptions({
  title,
  info,
  titleBold,
}: LineOption): ContentText {
  return {
    text: [
      {
        text: title,
        bold: titleBold,
      },
      {
        text: info || '-',
      },
    ],
    marginBottom: 4,
  };
}

export function columnOptions({
  title,
  info,
  titleBold,
  ...rest
}: LineOption & TableCellProperties): TableCell {
  return {
    ...lineOptions({ title, info, titleBold }),
    ...rest,
  };
}
export function tableInfo(body: TableCell[][]): ContentTable {
  return {
    layout: {
      hLineWidth: () => 0,
      vLineWidth: () => 0,
    },
    table: {
      widths: ['*', '*'],
      body,
    },
  };
}

export function headerSection(text: string, borderTop: boolean): ContentTable {
  return {
    table: {
      widths: ['*'],
      body: [
        [
          {
            text,
            style: 'sectionHeader',
            border: [false, borderTop, false, true],
            marginBottom: 8,
            marginTop: 8,
          },
        ],
      ],
    },
  };
}

export function titlePage(text: string): ContentTable {
  return {
    pageBreak: 'before',
    table: {
      widths: ['*'],
      body: [
        [
          {
            text,
            style: 'titlePage',
            border: [false, false, false, false],
            marginBottom: 24,
            marginTop: 4,
          },
        ],
      ],
    },
  };
}

export function listItems(text: string[]): ContentTable {
  return {
    table: {
      dontBreakRows: true,
      widths: ['*'],
      body: [
        ...text.map((item, index) => [
          {
            marginTop: 8,
            marginBottom: 8,
            text: item,
            style: 'tableItem',
            border: [false, true, false, index === text.length - 1],
          },
        ]),
      ],
    },
  };
}
