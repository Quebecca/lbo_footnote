/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

// import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
// import { InlineEditor} from "@ckeditor/ckeditor5-editor-inline";
import {InlineEditor as Editor} from "./Resources/Public/footquote/Editors"
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { List } from '@ckeditor/ckeditor5-list';
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';

import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

import Footquote from './Resources/Public/footquote/footquote';
import editors from "./Resources/Public/footquote/Editors";

Editor
    .create( document.querySelector( '#editor' ), {
		plugins: [ Essentials, Bold, Italic, Heading, List, Paragraph, Footquote ],
		toolbar: [ 'heading', '|', 'bold', 'italic', 'numberedList', 'bulletedList', '|', 'footquote' ]
    } )
    .then( editor => {
        console.log( 'Editor was initialized', editor );
        CKEditorInspector.attach( editor );
    } )
    .catch( error => {
        console.error( error.stack );
    } );
    