// Footquote will be the glue that holds the UI and the editing together.
import FootquoteEditing from '@libeo-footquote/footquoteediting';
import FootquoteUI from '@libeo-footquote/footquoteui';
import * as Core from '@ckeditor/ckeditor5-core';
import { GeneralHtmlSupport } from '@ckeditor/ckeditor5-html-support';

export default class Footquote extends Core.Plugin {
  static get requires() {
    return [ FootquoteEditing, FootquoteUI
      , GeneralHtmlSupport
    ];
  }

  // Add footnote as allow element to RTE (save tt_content)
  init() {
    console.log("Config", this.editor.config)
    // Clean code
    // this.editor.model.document.once( 'change:data', () => {
    //   this.cleanFootnoteLink();
    // } );

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

  // function to clean the code before saving it
  cleanFootnoteLink(){
    let content = this.editor.getData();
    let paternFootquote = /<footquote content=/g;
    let results = content.matchAll(paternFootquote);

    for (const result of results) {

      let patternContentValue = /content="[^\"]+">/g;
      let valueContent = patternContentValue.exec(content.substring(result.index));
      let newValueContent = "";
      let patternLink = /href=/g;

      if(patternLink.test(valueContent[0])){
        newValueContent = valueContent[0].replaceAll('<', '&amp;lt;');
        newValueContent = newValueContent.replaceAll( '>','&amp;gt;');
        newValueContent = newValueContent.replaceAll( '"&amp;gt;','">');

        content = content.replaceAll(valueContent[0] , newValueContent);
      }

      this.editor.setData(content);
    }
  }

}
