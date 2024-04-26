// FootquoteUI will be responsible for the UI – the toolbar button.
import * as Core from '@ckeditor/ckeditor5-core';
import {
  ButtonView,
  ContextualBalloon,
  clickOutsideHandler
} from '@ckeditor/ckeditor5-ui';
import {
  ClickObserver
} from '@ckeditor/ckeditor5-engine';
import FormView from './footquoteview';

export default class Footquoteui extends Core.Plugin {

  static get requires() {
    return [ ContextualBalloon ];
  }

  init() {
    const editor = this.editor;
    const view = editor.editing.view;
    const viewDocument = view.document;
    let modelElement = "";
    let lastValue = "";

    // Create the balloon and the form view.
    this._balloon = this.editor.plugins.get( ContextualBalloon );
    this.formView = this._createFormView(lastValue);

    editor.ui.componentFactory.add( 'footquote', () => {
      const button = new ButtonView();

      // Button configuration
      button.set( {
        label: 'Insérer une note de bas de page',
        tooltip: true,
        icon: '<?xml version="1.0" encoding="UTF-8"?><svg id="Calque_2" data-name="Calque 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><defs><style>  .cls-1 {  opacity: .4;}  .cls-1, .cls-2, .cls-3 {  stroke-width: 0px;} .cls-1, .cls-3 {   fill: #1d1d1b;}</style></defs><path class="cls-3" d="m14.79,15.19H-.07V-.05h14.87v15.24Zm-14.12-.75h13.37V.7H.68v13.74Z"/><g><rect class="cls-1" x="1.59" y="2.2" width="10.93" height="1.01"/><rect class="cls-1" x="1.59" y="4.51" width="10.93" height="1.01"/><rect class="cls-1" x="1.6" y="6.83" width="10.93" height="1.01"/><rect class="cls-1" x="1.6" y="9.14" width="10.93" height="1.01"/></g><rect class="cls-2" x="1.6" y="11.61" width="11.64" height="1.95"/></svg>',
        withText: false
      } );

      // After the user clicks the button
      this.listenTo( button, 'execute', () => {
        this._showUI();
      } );

      return button;
    } );

    // listener (click on the RTE)
    view.addObserver( ClickObserver );
    // After the user clicks on the text in RTE
    editor.listenTo( viewDocument, 'click', (evt, data) => {
      modelElement = data.target;
      this.formView.saveButtonView.class = "ck-button-save";
      if ( modelElement.name == 'footquote' ) {
        this._showUIUpdate(data);
      }
    });

  }

  // Create formView from footquoteview
  _createFormView(descValueBeforeSubmit) {
    const editor = this.editor;
    const formView = new FormView( editor.locale );

    // On the submit of form
    this.listenTo( formView, 'submit', () => {
      const foot = formView.footInputView.fieldView.element.value || "note";
      const desc = formView.descInputView.element.value;
      let submitClass = formView.saveButtonView.class;

      // Update a footquote tag
      if( submitClass == "ck-button-save updateFields" ){

        // Get the block element of the current footquote (paragraph)
        const selectedBlocks = Array.from(
          editor.model.document.selection.getSelectedBlocks()
        );
        const firstBlock = selectedBlocks[ 0 ];
        const lastBlock = selectedBlocks[ selectedBlocks.length - 1 ];
        const itemsToRemove = [];

        editor.model.change( writer => {
          const range = writer.createRange(
            writer.createPositionAt( firstBlock, 0 ),
            writer.createPositionAt( lastBlock, 'end' )
          );

          // validates all elements of the block element
          let cpt=0;
          for ( const value of range.getWalker() ) {
            // Find the footnote tag
            if(value.item.textNode._attrs.get("footnote") === descValueBeforeSubmit){
              // Can't delete here because it's an iterator.
              itemsToRemove.push( value.item );
            }
          }
          // Make a second FOR to delete the element.
          for ( const item of itemsToRemove ) {
            writer.remove( item ); // remove all of the items.
          }

        } );
      }

      // Add a new footnote tag in RTE
        editor.model.change( writer => {
          editor.model.insertContent(
            writer.createText( foot, { footnote: desc } ),
            editor.model.document.selection
          );
        });

      // Hide the form view after submit.
      this._hideUI();

    } );

    // Hide the form view after clicking the "Cancel" button.
    this.listenTo( formView, 'cancel', () => {
      this._hideUI();
    } );

    // Hide the form view when clicking outside the balloon.
    clickOutsideHandler( {
      emitter: formView,
      activator: () => this._balloon.visibleView === formView,
      contextElements: [ this._balloon.view.element ],
      callback: () => this._hideUI()
    } );

    return formView;
  }

  // Place the open form view on RTE
  _getBalloonPositionData() {
    const view = this.editor.editing.view;
    const viewDocument = view.document;
    let target = null;
    // Set a target position by converting view selection range to DOM.
    target = () => view.domConverter.viewRangeToDom(
      viewDocument.selection.getFirstRange()
    );

    return {
      target
    };
  }

  // Function to display the balloon with the clicked footquote tag in RTE (View form)
  _showUIUpdate(data) {

    // values from RTE
    const footValue = data.target._children[0]._textData;
    const descValue = data.target._attrs.get('content');

    // Create the form and the balloon
    this.formView = this._createFormView(descValue);
    this._showUI();

    // Set the input value in form
    this.formView.footInputView.fieldView.element.value = footValue;
    this.formView.descInputView.element.value = descValue;

    // Set the values so that they are not empty (placeholder will not change place)
    this.formView.footInputView.fieldView.isEmpty = false;
    this.formView.descInputView.isEmpty = false;

    // New class to detect update on submit
    this.formView.saveButtonView.class = "ck-button-save updateFields"

  }

  // Function to show the balloon (form View)
  _showUI() {
    this._balloon.add( {
      view: this.formView,
      position: this._getBalloonPositionData()
    } );
    this.formView.focus();
  }

  // Function to hide the balloon (form View)
  _hideUI() {
    this.formView.footInputView.fieldView.value = '';
    this.formView.descInputView.value = '';
    this.formView.element.reset();
    this._balloon.remove( this.formView );
    // Focus the editing view after closing the form view.
    this.editor.editing.view.focus();
  }

}
