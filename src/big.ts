import type { NodeSpec } from "prosemirror-model";

const b1png = 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="%23aaa"/></svg>';

const spec: NodeSpec = {
  inline: true,
  group: 'inline',
  attrs: {},
  toDOM: () => {
    const dom = document.createElement('span')
    dom.innerHTML = `<img src="${b1png}" width="100" height="100">`
    dom.setAttribute('data-big', '');
    return ['span', {
      'data-big': '',
      style: 'margin-right: 5px'
    }, ['img', {
      width: 100,
      height: 100,
      src: b1png
    }]]
  },
  parseDOM: [
    {
      tag: 'span[data-big]'
    }
  ]
}

export const bigSpec = spec
