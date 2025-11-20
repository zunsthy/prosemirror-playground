import './style.css'
import 'prosemirror-view/style/prosemirror.css'
import 'prosemirror-tables/style/tables.css'

import { buildMenuItems, exampleSetup } from 'prosemirror-example-setup'
import type { MenuElement } from 'prosemirror-menu'
import { DOMParser, Schema } from 'prosemirror-model'
import { schema as basicSchema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'
import { EditorState, type Plugin } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

import { anyblockSpec } from './anyblock'

function createSchema() {
  const marks = basicSchema.spec.marks
  let nodes = basicSchema.spec.nodes

  // Mix the nodes from prosemirror-schema-list into the basic schema to
  // create a schema with list support.
  nodes = addListNodes(nodes, 'paragraph block*', 'block')

  nodes = nodes.append({ 'anyblock': anyblockSpec })

  console.log('nodes', nodes);

  return new Schema({
    nodes,
    marks,
  })
}

function createMenuContent(schema: Schema): MenuElement[][] {
  const { fullMenu } = buildMenuItems(schema)
  return fullMenu
}

function createPlugins(schema: Schema) {
  const menuContent = createMenuContent(schema)
  return [
    ...exampleSetup({ schema, menuContent }),
  ].filter((x) => !!x)
}

function createView(schema: Schema, plugins: Plugin[]) {
  return new EditorView(document.querySelector('#editor'), {
    state: EditorState.create({
      doc: DOMParser.fromSchema(schema).parse(
        document.querySelector('#content')!,
      ),
      plugins,
    }),
  })
}

function main() {
  const schema = createSchema()
  const plugins = createPlugins(schema)
  const view = createView(schema, plugins)
  window.view = view
}

main()

declare global {
  interface Window {
    view?: EditorView
  }
}
