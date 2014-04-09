(function(){
  requirejs.config({
    baseUrl: 'js',
    paths: {
      jquery: 'lib/jquery'
    }
  });
  require(['jquery', './ui'], function($, ui){
    $(function(){
      ui.init();
    });
  });
}).call(this);
