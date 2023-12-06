// FootquoteUI will be responsible for the UI – the toolbar button.
import * as Core from '@ckeditor/ckeditor5-core';
import {
  ButtonView,
  ContextualBalloon,
  clickOutsideHandler
} from '@ckeditor/ckeditor5-ui';
import FormView from '@libeo/lbo_footnote/footquote-plugin-view.js';

export default class Footquoteui extends Core.Plugin {

  static get requires() {
    return [ ContextualBalloon ];
  }

  init() {
    const editor = this.editor;

    // Create the balloon and the form view.
    this._balloon = this.editor.plugins.get( ContextualBalloon );
    this.formView = this._createFormView();

    editor.ui.componentFactory.add( 'footquote', () => {
      const button = new ButtonView();

      // Button configuration
      button.set( {
        label: 'Insérer une note de bas de page',
        tooltip: true,
        icon: '<?xml version="1.0" encoding="UTF-8"?><svg id="Calque_2" data-name="Calque 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><defs><style>  .cls-1 {  opacity: .4;}  .cls-1, .cls-2, .cls-3 {  stroke-width: 0px;} .cls-1, .cls-3 {   fill: #1d1d1b;}</style></defs><path class="cls-3" d="m14.79,15.19H-.07V-.05h14.87v15.24Zm-14.12-.75h13.37V.7H.68v13.74Z"/><g><rect class="cls-1" x="1.59" y="2.2" width="10.93" height="1.01"/><rect class="cls-1" x="1.59" y="4.51" width="10.93" height="1.01"/><rect class="cls-1" x="1.6" y="6.83" width="10.93" height="1.01"/><rect class="cls-1" x="1.6" y="9.14" width="10.93" height="1.01"/></g><rect class="cls-2" x="1.6" y="11.61" width="11.64" height="1.95"/></svg>',
        withText: false
      } );

      // After the user clicks it
      this.listenTo( button, 'execute', () => {
        this._showUI();
      } );

      return button;
    } );
  }

  // Create formView from footquoteview
  _createFormView() {
    const editor = this.editor;
    const formView = new FormView( editor.locale );

    // On the submit of form
    this.listenTo( formView, 'submit', () => {
      const foot = formView.footInputView.fieldView.element.value;
      const desc = formView.descInputView.fieldView.element.value;

      // Add values from form view to RTE
      editor.model.change( writer => {
        editor.model.insertContent(
          writer.createText( foot, { content: desc } )
        );
      } );
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
    this.formView.descInputView.fieldView.value = '';
    this.formView.element.reset();
    this._balloon.remove( this.formView );
    // Focus the editing view after closing the form view.
    this.editor.editing.view.focus();
  }

}
