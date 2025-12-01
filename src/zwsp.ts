import type { EditorState} from "prosemirror-state";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

function createDecorations(state: EditorState): DecorationSet {
  const zero = '\u200B';
  const target = ['paragraph', 'heading'];

  const sel = state.selection;
  const cur = sel.head;
  const decos: Decoration[] = [];

  console.log('# exec deco creation #', sel.head, sel.anchor, sel.empty);

  if (sel.empty) {
      const $cur = state.doc.resolve(cur);
      const parent = $cur.parent;
      if (
        !parent.isText &&
        !parent.isAtom &&
        target?.includes(parent.type.name)
      ) {
        const isStart = !$cur.nodeBefore;
        const isEnd = !$cur.nodeAfter;
        const hasBeforeBlock = $cur.nodeBefore && !$cur.nodeBefore.isText;
        const hasAfterBlock = $cur.nodeAfter && !$cur.nodeAfter.isText;
        if (
          (isStart && hasAfterBlock) ||
          (isEnd && hasBeforeBlock) ||
          (hasAfterBlock && hasBeforeBlock) ||
          !sel.empty
        ) {
          decos.push(
            Decoration.widget(
              cur,
              () => {
                const span = document.createElement('span');
                const text = document.createTextNode(zero);
                span.appendChild(text);
                return span;
              },
              {
                key: 'zwsp',
                relaxedSide: true,
              },
            ),
          );
        }
      }
    }

  return DecorationSet.create(state.doc, decos)
}

export const autoAddZWSPPlugin = new Plugin({
  key: new PluginKey('auto-add-zwsp'),
  props: {
    decorations: (state) => createDecorations(state)
  }
})
