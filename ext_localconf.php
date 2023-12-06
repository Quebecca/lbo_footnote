<?php

$GLOBALS['TYPO3_CONF_VARS']['SYS']['htmlSanitizer']['default'] = Libeo\LboFootnote\Sanitizer\FootquoteHtmlSanitizer::class;

$GLOBALS['TYPO3_CONF_VARS']['BE']['stylesheets']['lbo_footnote']
    = 'EXT:lbo_footnote/Resources/Public/footquote/footquotestyle.css';


