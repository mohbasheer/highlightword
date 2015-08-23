# highlightword

Directive for complete word selection and Highlight. when user select half of the text it will compute and select full word and highlight.

example: software application engineer

if user select 'ware appli'. this directive will select the complete word 'software application' and highlight

you can double click and select the word too.


### Install
`bower install highlightword`

### Usage

```javascript
	var app = angular.module('yourApp',['highlightword'])
```


```html
	<div>
		<div highlight-text event-name="highlight" emit-selection="true" clear-interval="1000">
		  Try selecting letters from middle of the word. this component will select the complete word and highlight for you.
		</div>
		you selected {{word}}
	</div>
```


```javascript
	.controller('MainCtrl', function ($scope) {
	  	$scope.$on('highlight',function(eve, data){
	  		$scope.word = data;
	  	});
	  });
```

