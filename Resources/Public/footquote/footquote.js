// Footquote will be the glue that holds the UI and the editing together.
import FootquoteEditing from '@libeo/lbo_footnote/footquote-plugin-editing.js';
import FootquoteUI from '@libeo/lbo_footnote/footquote-plugin-ui.js';
import * as Core from '@ckeditor/ckeditor5-core';
import { GeneralHtmlSupport } from '@ckeditor/ckeditor5-html-support';

export default class Footquote extends Core.Plugin {
  static get requires() {
    return [ FootquoteEditing, FootquoteUI, GeneralHtmlSupport ];
  }

  // Add footnote as allow element to RTE (save tt_content)
  init() {

    // Extend schema with custom HTML elements.
     const dataFilter = this.editor.plugins.get( 'DataFilter' );
     const dataSchema = this.editor.plugins.get( 'DataSchema' );

    // Inline element
     dataSchema.registerInlineElement( {
       view: 'footquote',
       model: 'footquote'
     });

     // Custom elements need to be registered using direct API instead of config.
    dataFilter.allowElement( 'footquote' );
    dataFilter.allowAttributes({
      name: 'footquote',
      attributes: {
        'content' : /^.*$/
      }
    })

  }
}
