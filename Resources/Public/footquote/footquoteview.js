// FootquoteView : Creating a form view template
import {
  View,
  LabeledFieldView,
  createLabeledInputText,
  ButtonView,
  submitHandler
}from '@ckeditor/ckeditor5-ui';


export default class FormView extends View {
  constructor( locale ) {
    super( locale );
    // Icons buttons
    var iconsCheck ='<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6.972 16.615a.997.997 0 0 1-.744-.292l-4.596-4.596a1 1 0 1 1 1.414-1.414l3.926 3.926 9.937-9.937a1 1 0 0 1 1.414 1.415L7.717 16.323a.997.997 0 0 1-.745.292z"/></svg>';
    var iconsCancel = '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="m11.591 10.177 4.243 4.242a1 1 0 0 1-1.415 1.415l-4.242-4.243-4.243 4.243a1 1 0 0 1-1.414-1.415l4.243-4.242L4.52 5.934A1 1 0 0 1 5.934 4.52l4.243 4.243 4.242-4.243a1 1 0 1 1 1.415 1.414l-4.243 4.243z"/></svg>';

    // Create all inputs
    this.footInputView = this._createInput( 'Note de bas de page' );
    this.descInputView = this._createInput( 'Description' );

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
