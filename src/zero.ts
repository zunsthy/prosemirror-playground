import type { EditorState} from "prosemirror-state";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

function createDecorations(state: EditorState): DecorationSet {
  const zero = '\u200B';
  const target = ['paragraph', 'heading'];

  const sel = state.selection;
  const cur = sel.anchor;
  const decos: Decoration[] = [];

  if (sel?.empty) {
    const $cur = state.doc.resolve(cur);
    const parent = $cur.parent;
    if (
      !parent.isText &&
      !parent.isAtom &&
      target.includes(parent.type.name)
    ) {
      const isStart = !$cur.nodeBefore;
      const isEnd = !$cur.nodeAfter;
      const hasBeforeBlock = $cur.nodeBefore && !$cur.nodeBefore.isText;
      const hasAfterBlock = $cur.nodeAfter && !$cur.nodeAfter.isText;
      if (
        (isStart && hasAfterBlock) ||
        (isEnd && hasBeforeBlock) ||
        (hasAfterBlock && hasBeforeBlock)
      ) {
        decos.push(
          Decoration.widget(cur, () => {
            const text = document.createTextNode(zero);
            return text;
          }, {
            side: hasAfterBlock ? 1 : -1
          })
        )
      }
    }
  }

  return DecorationSet.create(state.doc, decos)
}

export const autoAddZeroPlugin = new Plugin({
  key: new PluginKey('auto-add-zero'),
  props: {
    decorations: (state) => createDecorations(state)
  }
})
