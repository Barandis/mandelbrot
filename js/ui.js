(function(){
  var split$ = ''.split;
  define(['jquery', './renderer'], function($, renderer){
    var defaults, canvas, options, ctx, img, init, initCanvas, fillOptionsFromUrl, fillOptionsFromSettings;
    defaults = {
      re: -0.7,
      im: 0.0,
      zoom: 1.0,
      escape: 2.0,
      supersamples: 0,
      depth: 50,
      autoDepth: true,
      palette: 1,
      update: 100
    };
    canvas = $('#mandelbrot').get(0);
    options = clone$(defaults);
    init = function(){
      var checkDisabled;
      $(window).resize(function(){
        initCanvas();
        renderer.render(canvas, ctx, img, options);
      });
      $(window).on('hashchange', function(){
        fillOptionsFromUrl();
        renderer.render(canvas, ctx, img, options);
      });
      $('#mandelbrot').click(function(event){
        var x, y, ref$, r, i, dx, dy;
        x = event.clientX;
        y = event.clientY;
        ref$ = renderer.getRange(options), r = ref$[0], i = ref$[1];
        dx = (r[1] - r[0]) / canvas.width;
        dy = (i[1] - i[0]) / canvas.height;
        options.re = r[0] + x * dx;
        options.im = i[0] + y * dy;
        if (event.shiftKey) {
          options.zoom /= 2;
        } else if (!event.ctrlKey) {
          options.zoom *= 2;
        }
        renderer.render(canvas, ctx, img, options);
      });
      $('#control').click(function(){
        var $this;
        $this = $(this);
        $('#settings').toggle(500);
        $('#render').toggle(500);
        $('#domain').toggle(500);
        $this.text($this.text() === 'Hide Panels' ? 'Show Panels' : 'Hide Panels');
      });
      $('#draw-action').click(function(){
        fillOptionsFromSettings();
        renderer.render(canvas, ctx, img, options);
      });
      $('#stop-action').click(function(){
        renderer.stop();
      });
      $('#reset-action').click(function(){
        options = clone$(defaults);
        renderer.render(canvas, ctx, img, options);
      });
      $('#export-action').click(function(){
        var features;
        features = "width=" + canvas.width + ",height=" + canvas.height + ",location=no";
        window.open(canvas.toDataURL('image/png'), "Mandelbrot Set Export", features);
      });
      checkDisabled = function(){
        $('#depth').prop('disabled', $(this).is(':checked'));
      };
      $('#auto-depth').change(checkDisabled);
      checkDisabled();
      initCanvas();
      fillOptionsFromUrl();
      renderer.render(canvas, ctx, img, options);
    };
    initCanvas = function(){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx = canvas.getContext('2d');
      img = ctx.createImageData(canvas.width, 1);
    };
    fillOptionsFromUrl = function(){
      var params, i$, len$, param, ref$, key, value;
      params = split$.call(window.location.hash.substring(1), '&');
      for (i$ = 0, len$ = params.length; i$ < len$; ++i$) {
        param = params[i$];
        ref$ = split$.call(param, '='), key = ref$[0], value = ref$[1];
        switch (key) {
        case 'r':
          options.re = parseFloat(value);
          break;
        case 'i':
          options.im = parseFloat(value);
          break;
        case 'z':
          options.zoom = parseFloat(value);
          break;
        case 'e':
          options.escape = parseFloat(value);
          break;
        case 's':
          options.supersamples = parseInt(value);
          break;
        case 'd':
          options.depth = parseInt(value);
          break;
        case 'a':
          options.autoDepth = value === '1';
          break;
        case 'p':
          options.palette = parseInt(value);
          break;
        case 'u':
          options.update = parseInt(value);
        }
      }
    };
    fillOptionsFromSettings = function(){
      var re, im, zoom, escape, supersamples, depth, autoDepth, palette, update;
      re = $.trim($('#re').val());
      im = $.trim($('#im').val());
      zoom = $.trim($('#zoom').val());
      escape = $.trim($('#escape').val());
      supersamples = parseInt($('#supersamples').val());
      depth = $.trim($('#depth').val());
      autoDepth = $('#auto-depth').is(':checked');
      palette = parseInt($('#palette').val());
      update = $.trim($('#update').val());
      if (re) {
        options.re = parseFloat(re);
      }
      if (im) {
        options.im = parseFloat(im);
      }
      if (zoom) {
        options.zoom = parseFloat(zoom);
      }
      if (escape) {
        options.escape = parseFloat(escape);
      }
      options.supersamples = supersamples;
      if (depth) {
        options.depth = parseInt(depth);
      }
      options.autoDepth = autoDepth;
      options.palette = palette;
      if (update) {
        options.update = parseInt(update);
      }
    };
    return {
      init: init
    };
  });
  function clone$(it){
    function fun(){} fun.prototype = it;
    return new fun;
  }
}).call(this);
