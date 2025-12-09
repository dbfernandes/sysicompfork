import ColorContextPadProvider from './ColorContextPadProvider.js';
import ColorPopupProvider from './ColorPopupProvider.js';

export default {
  __init__: ['colorContextPadProvider', 'colorPopupProvider'],
  colorContextPadProvider: ['type', ColorContextPadProvider],
  colorPopupProvider: ['type', ColorPopupProvider],
};
