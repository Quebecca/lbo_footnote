<?php

namespace Libeo\LboFootnote\Sanitizer;

use TYPO3\HtmlSanitizer\Behavior\Tag;
use TYPO3\HtmlSanitizer\Behavior\Attr;
use TYPO3\CMS\Core\Html\DefaultSanitizerBuilder;
use TYPO3\HtmlSanitizer\Behavior;

class FootquoteHtmlSanitizer extends DefaultSanitizerBuilder
{
    public function createBehavior(): Behavior
    {
        return parent::createBehavior()
            ->withName('common')
            ->withTags(
                (new Tag('footquote', Tag::ALLOW_CHILDREN))
                    ->addAttrs(new Attr('content'))
            );
    }
}