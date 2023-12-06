// Footquote will be the glue that holds the UI and the editing together.
import FootquoteEditing from '@libeo/lbo_footnote/footquote-plugin-editing.js';
import FootquoteUI from '@libeo/lbo_footnote/footquote-plugin-ui.js';
import * as Core from '@ckeditor/ckeditor5-core';

export default class Footquote extends Core.Plugin {
  static get requires() {
    return [ FootquoteEditing, FootquoteUI ];
  }
}
