/*!
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Thomas J. Otterson
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function(){
  var split$ = ''.split;
  define(['jquery', './renderer'], function($, renderer){
    var defaults, canvas, options, ctx, img, init, initCanvas, setRenderButtons, setStopButtons, disableDepth, render, fillOptionsFromUrl, fillOptionsFromSettings, fillUrlFromOptions, fillSettingsFromOptions, computeAutoDepth;
    defaults = {
      re: -0.7,
      im: 0.0,
      zoom: 1.0,
      escape: 2.0,
      supersamples: 0,
      depth: 50,
      autoDepth: true,
      palette: 0,
      cycles: 10,
      rotation: 0,
      update: 100,
      continuous: true
    };
    canvas = $('#mandelbrot').get(0);
    options = clone$(defaults);
    init = function(){
      $(window).resize(function(){
        initCanvas();
        render();
      });
      $(window).on('hashchange', function(){
        fillOptionsFromUrl();
        render();
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
        render();
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
        render();
      });
      $('#stop-action').click(function(){
        renderer.stop();
      });
      $('#reset-action').click(function(){
        options = clone$(defaults);
        render();
      });
      $('#export-action').click(function(){
        var features;
        features = "width=" + canvas.width + ",height=" + canvas.height + ",location=no";
        window.open(canvas.toDataURL('image/png'), "Mandelbrot Set Export", features);
      });
      $('#auto-depth').change(disableDepth);
      initCanvas();
      fillOptionsFromUrl();
      disableDepth();
      render();
    };
    initCanvas = function(){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx = canvas.getContext('2d');
      img = ctx.createImageData(canvas.width, 1);
    };
    setRenderButtons = function(){
      $('#draw-action').prop('disabled', false);
      $('#stop-action').prop('disabled', true);
      $('#reset-action').prop('disabled', false);
      $('#export-action').prop('disabled', false);
    };
    setStopButtons = function(){
      $('#draw-action').prop('disabled', true);
      $('#stop-action').prop('disabled', false);
      $('#reset-action').prop('disabled', true);
      $('#export-action').prop('disabled', true);
    };
    disableDepth = function(){
      $('#depth').prop('disabled', $('#auto-depth').is(':checked'));
    };
    render = function(){
      fillSettingsFromOptions();
      fillUrlFromOptions();
      disableDepth();
      renderer.render(canvas, ctx, img, options, setStopButtons, setRenderButtons);
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
        case 'y':
          options.cycles = parseInt(value);
          break;
        case 'o':
          options.rotation = parseInt(value);
          break;
        case 'u':
          options.update = parseInt(value);
          break;
        case 'c':
          options.continuous = value === '1';
        }
      }
      computeAutoDepth();
      fillSettingsFromOptions();
    };
    fillOptionsFromSettings = function(){
      var re, im, zoom, escape, supersamples, depth, autoDepth, palette, cycles, rotation, update, continuous;
      re = $.trim($('#re').val());
      im = $.trim($('#im').val());
      zoom = $.trim($('#zoom').val());
      escape = $.trim($('#escape').val());
      supersamples = parseInt($('#supersamples').val());
      depth = $.trim($('#depth').val());
      autoDepth = $('#auto-depth').is(':checked');
      palette = parseInt($('#palette').val());
      cycles = $.trim($('#cycles').val());
      rotation = $.trim($('#rotation').val());
      update = $.trim($('#update').val());
      continuous = $('#continuous').is(':checked');
      if (re != null) {
        options.re = parseFloat(re);
      }
      if (im != null) {
        options.im = parseFloat(im);
      }
      if (zoom != null) {
        options.zoom = parseFloat(zoom);
      }
      if (escape != null) {
        options.escape = parseFloat(escape);
      }
      options.supersamples = supersamples;
      if (depth != null) {
        options.depth = parseInt(depth);
      }
      options.autoDepth = autoDepth;
      options.palette = palette;
      if (cycles != null) {
        options.cycles = parseInt(cycles);
      }
      if (rotation != null) {
        options.rotation = parseInt(rotation);
      }
      if (update != null) {
        options.update = parseInt(update);
      }
      options.continuous = continuous;
      computeAutoDepth();
      fillUrlFromOptions();
    };
    fillUrlFromOptions = function(){
      var re, im, zoom, escape, depth, autoDepth, supersamples, palette, cycles, rotation, update, continuous;
      re = options.re, im = options.im, zoom = options.zoom, escape = options.escape, depth = options.depth, autoDepth = options.autoDepth, supersamples = options.supersamples, palette = options.palette, cycles = options.cycles, rotation = options.rotation, update = options.update, continuous = options.continuous;
      autoDepth = autoDepth ? 1 : 0;
      continuous = continuous ? 1 : 0;
      window.location.hash = "r=" + re + "&i=" + im + "&z=" + zoom + "&e=" + escape + "&d=" + depth + "&a=" + autoDepth + "&s=" + supersamples + "&p=" + palette + "&y=" + cycles + "&o=" + rotation + "&u=" + update + "&c=" + continuous;
    };
    fillSettingsFromOptions = function(){
      var re, im, zoom, escape, depth, autoDepth, supersamples, palette, cycles, rotation, update, continuous;
      re = options.re, im = options.im, zoom = options.zoom, escape = options.escape, depth = options.depth, autoDepth = options.autoDepth, supersamples = options.supersamples, palette = options.palette, cycles = options.cycles, rotation = options.rotation, update = options.update, continuous = options.continuous;
      $('#re').val(re);
      $('#im').val(im);
      $('#zoom').val(zoom);
      $('#escape').val(escape);
      $('#depth').val(depth);
      $('#update').val(update);
      $('#palette').val(palette);
      $('#cycles').val(cycles);
      $('#rotation').val(rotation);
      $('#supersamples').val(supersamples);
      $('#auto-depth').prop('checked', autoDepth);
      $('#continuous').prop('checked', continuous);
    };
    computeAutoDepth = function(){
      var ref$, rRange, iRange, factor;
      if (options.autoDepth) {
        ref$ = renderer.getRange(options), rRange = ref$[0], iRange = ref$[1];
        factor = Math.sqrt(0.001 + 2.0 * Math.min(Math.abs(rRange[0] - rRange[1]), Math.abs(iRange[0] - iRange[1])));
        options.depth = Math.floor(223.0 / factor);
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
