import {
  SlatePlugin,
  getVoidTypes,
  getSlatePluginTypes,
  getRenderElement,
} from '@udecode/slate-plugins';

export const ELEMENT_QUOTE = 'quote';
export function createQuotePlugin(): SlatePlugin {
  return {
    pluginKeys: ELEMENT_QUOTE,
    inlineTypes: getSlatePluginTypes(ELEMENT_QUOTE),
    voidTypes: getSlatePluginTypes(ELEMENT_QUOTE),
    renderElement: getRenderElement(ELEMENT_QUOTE),
  };
}
