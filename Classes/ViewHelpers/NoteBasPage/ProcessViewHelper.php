<?php

namespace Libeo\LboFootnote\ViewHelpers\NoteBasPage;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3Fluid\Fluid\Core\ViewHelper\Traits\CompileWithRenderStatic;

class ProcessViewHelper extends AbstractViewHelper
{
    use CompileWithRenderStatic;

    /**
     * @var boolean
     */
    protected $escapeOutput = false;

    public function initializeArguments()
    {
        $this->registerArgument('noteBasTableau', 'bool', 'Si les notes de bas de tableau sont affichées sous leur tableaux respectifs', false);
    }

    /**
     * @param array $arguments
     * @param \Closure $renderChildrenClosure
     * @param RenderingContextInterface $renderingContext
     * @return mixed
     */
    public static function renderStatic(
        array $arguments,
        \Closure $renderChildrenClosure,
        RenderingContextInterface $renderingContext
    ) {
        $content = $renderChildrenClosure();

        // Check if it exist for performance reason
        if (strstr($content, 'footquote') === false) {
            return $content;
        }

        // Process note bas tableau
        if ($arguments['noteBasTableau']) {
            $pattern = '/\<table.*?\>(.*?)\<\/table\>/im';
            preg_match_all($pattern, $content, $matchesTable);
            if (isset($matchesTable[0])) {
                foreach ($matchesTable[0] as $indexTable => $wholeTable) {
                    $wholeTableNewContent = $wholeTable;
                    $arrayListIndexFootquote = [];
                    $pattern = '/\<footquote content=\"([^"]*)\"\>(.*?)<\/footquote\>/im';
                    preg_match_all($pattern, $wholeTable, $matchesFootquote);

                    if (isset($matchesFootquote[0])) {
                        foreach ($matchesFootquote[0] as $indexFootquote => $wholeFootquote) {
                            $footquote = $matchesFootquote[2][$indexFootquote];
                            if ($footquote === 'note') {
                                $footquote = '';
                            }
                            $arrayListIndexFootquote[] = $matchesFootquote[1][$indexFootquote];
                            $linkToNote = TemplateUtility::getLinkToNote($footquote, $indexFootquote + 1, 'table-' . $indexTable . '-');
                            $wholeTableNewContent = str_replace($wholeFootquote, $linkToNote, $wholeTableNewContent);
                        }
                    }

                    $wholeTableNewContent .= TemplateUtility::displayNotes($arrayListIndexFootquote, 'table-' . $indexTable . '-');

                    $content = str_replace($wholeTable, $wholeTableNewContent, $content);
                }
            }
        }

        $pattern = '/\<footquote content=\"([^"]*)\"\>(.*?)<\/footquote\>/im';
        // cf https://www.php.net/manual/en/function.html-entity-decode.php#117876
        $content = html_entity_decode($content, ENT_QUOTES | ENT_XML1, 'UTF-8');
        preg_match_all($pattern, $content, $matchesFootquote);
        /** @var NoteBasPageRepository $noteBasPageRepository */
        $noteBasPageRepository = GeneralUtility::makeInstance(NoteBasPageRepository::class);

        if (isset($matchesFootquote[0])) {
            foreach ($matchesFootquote[0] as $index => $wholeFootquote) {
                $footquote = $matchesFootquote[2][$index];
                $description = $matchesFootquote[1][$index];

                $noteBasPageRepository->addNote(html_entity_decode($description));

                $index = $noteBasPageRepository->getCurrentIndex();

                if ($footquote === 'note') {
                    $footquote = '';
                }
                $linkToNote = TemplateUtility::getLinkToNote($footquote, $index);

                $content = str_replace($wholeFootquote, $linkToNote, $content);
            }
        }

        return $content;
    }


}
