// Footquote Editing will enable the footquote attribute in the model and introduce a proper model ←→ view conversion.
import * as Core from '@ckeditor/ckeditor5-core';

export default class Footquoteediting extends Core.Plugin {
  init() {
    // model’s schema
    this._defineSchema();
    // how to transform the view to the model AND how to render the model to the view
    this._defineConverters();
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    // Extend the text node's schema to accept the footquote attribute.
    schema.extend( '$text', {
      allowAttributes: [ 'footnote' ]
    } );

  }


  _defineConverters() {
    const conversion = this.editor.conversion;

    // Conversion from a model attribute to a view element.
    conversion.for( 'downcast' ).attributeToElement( {
      model: 'footnote',
      name: 'footnote',
      // Callback function provides access to the model attribute value
      // and the DowncastWriter.
      view: ( modelAttributeValue, conversionApi ) => {
        const { writer } = conversionApi;
        return writer.createAttributeElement( 'footquote', {
          "content": modelAttributeValue
        } );
      }
    } );


    // Conversion from a view element to a model footquote.
    conversion.for( 'upcast' ).elementToAttribute( {
      view: {
        name: 'footquote',
        attributes: [ 'content' ]
      },
      model: {
        key: 'footnote',
        // Callback function provides access to the view element.
        value: viewElement => {
          const content = viewElement.getAttribute( 'content' );
          return content;
        }
      }
    } );

  }

}
