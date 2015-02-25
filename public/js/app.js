var app = angular.module('sandrApp', ['ngMaterial', 'ui.codemirror']);

app.value('ui.config', {
    codemirror: {
        mode: 'text/x-cassandra',
        lineNumbers: false,
        matchBrackets: true
    }
});
