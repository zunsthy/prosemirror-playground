import type { NodeSpec } from "prosemirror-model";

const spec: NodeSpec = {
  inline: true,
  group: 'inline',
  attrs: {
    inner: { default: '' },
  },
  toDOM: (node) => {
    const dom = document.createElement('span');
    dom.setAttribute('data-style', '');
    dom.innerHTML = node.attrs.inner as string;
    return dom;
  },
  parseDOM: [
    {
      priority: 100,
      tag: 'span[data-style]',
      getAttrs: (dom) => {
        return {
          inner: dom.innerHTML,
        };
      },
    },
  ],
};

export const anyblockSpec = spec;
