// FootquoteView : Creating a form view template
import {
  View,
  LabeledFieldView,
  TextareaView,
  createLabeledInputText,
  LabelView,
  ButtonView,
  submitHandler
}from '@ckeditor/ckeditor5-ui';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { GeneralHtmlSupport } from '@ckeditor/ckeditor5-html-support';
import {Typo3Link} from '@typo3/rte-ckeditor/plugin/typo3-link.js'

// import {ClassicEditor as Editor} from "@libeo-footquote/Editors";
import { ClassicEditor as Editor } from '@ckeditor/ckeditor5-editor-classic';



export default class FormView extends View {
  constructor( locale ) {
    super( locale );
    // Icons buttons
    var iconsCheck ='<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6.972 16.615a.997.997 0 0 1-.744-.292l-4.596-4.596a1 1 0 1 1 1.414-1.414l3.926 3.926 9.937-9.937a1 1 0 0 1 1.414 1.415L7.717 16.323a.997.997 0 0 1-.745.292z"/></svg>';
    var iconsCancel = '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="m11.591 10.177 4.243 4.242a1 1 0 0 1-1.415 1.415l-4.242-4.243-4.243 4.243a1 1 0 0 1-1.414-1.415l4.243-4.242L4.52 5.934A1 1 0 0 1 5.934 4.52l4.243 4.243 4.242-4.243a1 1 0 1 1 1.415 1.414l-4.243 4.243z"/></svg>';

    // Create all inputs
    this.footInputView = this._createInput( 'Note de bas de page' );
    let textareaId = "descriptionFootnote"
    this.labelTextArea = this._createLabelTextarea( 'Description',  textareaId);
    this.descInputView = this._createTextarea( 'Description', textareaId );

    // Create the save and cancel buttons.
    this.saveButtonView = this._createButton(
      'Save', iconsCheck,'ck-button-save'
    );
    // Set the type to 'submit', which will trigger
    // the submit event on entire form when clicked.
    this.saveButtonView.type = 'submit';

    this.cancelButtonView = this._createButton(
      'Cancel', iconsCancel, 'ck-button-cancel'
    );

    // Delegate ButtonView#execute to FormView#cancel.
    this.cancelButtonView.delegate( 'execute' ).to( this, 'cancel' );



    // Wrapping up the form view
    this.childViews = this.createCollection( [
      this.footInputView,
      this.labelTextArea,
      this.descInputView,
      this.saveButtonView,
      this.cancelButtonView
    ] );

    // Create the template of popup balloon
    this.setTemplate( {
      tag: 'form',
      attributes: {
        class: [ 'ck', 'ck-footquote-form' ],
        tabindex: '-1'
      },
      children: this.childViews
    } );

  }

  getEditor() {

    if (this.editor) {
      console.log("get existing editor")
      return  Promise.resolve(this.editor);
    }
    if (this.editorPromise) {
      return this.editorPromise
    }
    this.editorPromise =  Editor.create(this.descInputView.element, {
      plugins: [Paragraph, Essentials, Typo3Link,GeneralHtmlSupport ],
      typo3link: this.rootEditor?.config.get("typo3link") ?? {},
      paragraph: {
        forcedContent: false, // Désactive l'ajout automatique de balises <p>
        p: false, // Désactive la gestion des balises <p>,
        br: true
      },
      toolbar: [ 'link']
    }).then(editor => {
      console.log("get new editor")
      editor.ui.view.editable.element.parentNode.classList.add('ck-reset_all-excluded');
      console.log(editor.ui.view.editable.element)

      this.editor = editor
      return editor
    })
    return this.editorPromise;
  }


  render() {
    super.render();

    // Submit the form when the user clicked the save button
    // or pressed enter in the input.
    submitHandler( {
      view: this
    } );
  }

  // will focus on the first child of our footquote input view each time the form is added to the editor
  focus() {
    this.childViews.first.focus();
  }

// Function to create an input
  _createInput( label ) {
    const labeledInput = new LabeledFieldView( this.locale, createLabeledInputText );
    labeledInput.label = label;
    return labeledInput;
  }

  // Function to create a label for textarea
  _createLabelTextarea( label, idTextArea ){
    //Config label's TextArea
    const labelTextArea = new LabelView( this.locale );
    labelTextArea.for = idTextArea;
    labelTextArea.text = label;

    labelTextArea.render();
    labelTextArea.element.className = "ck ck-label label-textarea";

    return labelTextArea;
}


  // Function to create a textarea
  _createTextarea(  label, idTextArea ) {
    const textArea = new TextareaView( this.locale );
    console.log("creating textarea")
    textArea.minRows = 5;
    textArea.maxRows = 10;
    textArea.label = label;

    textArea.render();

    textArea.element.id = idTextArea;

    return textArea;
  }

  // Function to create form's button
  _createButton( label, icon, className ) {
    const button = new ButtonView();

    button.set( {
      label: label,
      icon: icon,
      tooltip: true,
      class: className
    } );

    return button;
  }
}
