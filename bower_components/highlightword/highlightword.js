(function(angular) {

    'use strict';

    angular.module('highlightword', [])

    .controller('highlightTextCtrl', ['$scope', '$element', '$attrs',
            function($scope, $element, $attrs) {
                var modalWindowClickListener, highlightedText, clearHighlightListener, originalWrapperContent;
                var skipTagNames = $scope.skipTags ? $scope.skipTags.split(',') : '';
                $scope.clearInterval = $scope.clearInterval ? $scope.clearInterval : 10 * 1000;
                /* double click and single click selection will handle here */
                $scope.handleHighlightClick = function(event) {
                    if (skipTagNames.indexOf(event.target.tagName) == -1) {
                        var windowSelection = window.getSelection();
                        var windowSelectionRange = windowSelection.getRangeAt(0);
                        if (windowSelectionRange.startOffset != windowSelectionRange.endOffset) {
                            _highlight();
                        }
                    }
                };
                /* highlight function will begin from here */
                function _highlight() {
                    var wrappedContent = $element.find('div').children()[0];
                    originalWrapperContent = angular.copy(wrappedContent.innerHTML);
                    clearHighlightListener = setTimeout(_clearHighlight, parseInt($scope.clearInterval));
                    highlightedText = _createHighlightSelection()
                    if ($scope.emitSelection) {
                        _emitClaimSearch(highlightedText);
                    }
                };
                /* clear selection only when scope.clearInterval > 0 */
                function _clearHighlight() {
                    var wrappedContent = $element.find('div').children()[0];
                    wrappedContent.innerHTML = originalWrapperContent
                };
                /* emit selection text only when scope.emitSelection == true */
                function _emitClaimSearch(searchText) {
                    $scope.$emit($scope.eventName, searchText);
                };
                /* return selected node index */
                function _getSelectedNodeIndex(selectedNode) {
                    var result = -1;
                    for (var i = 0; i < selectedNode.parentNode.childNodes.length; i++) {
                        if (selectedNode.parentNode.childNodes[i] == selectedNode) {
                            result = i;
                            break;
                        }
                    }
                    return result;
                };
                /**
                 * creat complete word selection based on user selection
                 **/
                function _createHighlightSelection() {
                    var selectionObject = _getStartAndEndPoint();
                    var selectdNode = window.getSelection().baseNode;
                    var datas = selectdNode.data;
                    var firstBlock = datas.substr(0, selectionObject.start);
                    var selectionBlock = datas.substr(selectionObject.start,
                        selectionObject.length);
                    var lastBlock = datas.substr(selectionObject.end);

                    var spanEle = document.createElement('span');
                    spanEle.style.backgroundColor = '#DFDCDC';
                    spanEle.textContent = selectionBlock;

                    var firstTextNode = document.createTextNode(firstBlock);
                    var lastTextNode = document.createTextNode(lastBlock);

                    var parentNode = window.getSelection().baseNode.parentNode;

                    parentNode.replaceChild(spanEle, parentNode.childNodes[_getSelectedNodeIndex(selectdNode)]);
                    parentNode.insertBefore(firstTextNode, spanEle);
                    parentNode.insertBefore(lastTextNode, spanEle.nextSibling);

                    return selectionBlock;
                };
                /*
                    based on selected text, it will compute the full selection
                    ex: software developer. if selected text is 'ware deve' it will compute the
                    complete selection as 'software developer' and return the selection object.
                    selectionObj {
                        start: computed first selection index
                        length: computed selection length
                        end: computed last selection index
                    }
                 */
                function _getStartAndEndPoint() {
                    var selectionObj = window.getSelection();
                    var range = selectionObj.getRangeAt(0);
                    var data = selectionObj.baseNode.data;
                    var selectionText = selectionObj.toString();
                    var patternStartPoint = range.startOffset;
                    var textUptoSelection = data.substr(0, patternStartPoint);
                    var textAfterSelection = data.substr(patternStartPoint +
                        selectionText.length);
                    var spaceIndexBeforeSelection = textUptoSelection.search(/ [^ ]*$/);
                    var spaceIndexAfterSelection = textAfterSelection.search(" ");
                    var startIndex = spaceIndexBeforeSelection + 1;
                    var selectionLength = ((patternStartPoint -
                            spaceIndexBeforeSelection) + selectionText.length +
                        (spaceIndexAfterSelection - 1));
                    var endIndex = textUptoSelection.length + selectionText.length +
                        spaceIndexAfterSelection;
                    return {
                        start: startIndex,
                        length: selectionLength,
                        end: endIndex
                    };
                };

            }
        ])
        /*
            Directive for complete word selection and Highlight. when user select half of the text it will compute and
            select full word and highlight.
            example: software application engineer
            if user select 'ware appli'. then this directive will select the complete word 'software application' and highlight

            you can double click and the complete word also but double is additional feature.

            All Params are optional
            @ emitSelection(Boolean, emitSelection and eventName are dependent) = to angular.$emit selected text
            @ eventName(String, emitSelection and eventName are dependent) = Event name to emit after highligting text
            @ clearInterval(Int, default 10 seconds) =  to clear the selection after given interval
            @ skipTags =  to skip specific tags like <a or <span
        */
        .directive('highlightText', function() {
            return {
                restrict: 'A',
                transclude: true,
                scope: {
                    emitSelection: '@',
                    eventName: '@',
                    clearInterval: '@',
                    skipTags: '@'
                },
                controller: 'highlightTextCtrl',
                template: '<div ng-click="handleHighlightClick($event)" highlight-identifier ng-transclude></div>'

            };
        });

}(window.angular));
