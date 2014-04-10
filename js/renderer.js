(function(){
  define(['jquery', './algorithm'], function($, algorithm){
    var zoomDefault, renderId, stopping, render, adjustAspectRatio, updateUrl, updateInfo, addRgb, divRgb, metricize, getRange, stop;
    zoomDefault = 3.4;
    renderId = 0;
    stopping = false;
    render = function(canvas, ctx, img, options){
      var palette, ref$, rRange, iRange, factor, dr, di, drawLine, drawSupersampledLine, drawSolidLine, drawLines;
      stopping = false;
      palette = algorithm.palettes[options.palette];
      ref$ = getRange(options), rRange = ref$[0], iRange = ref$[1];
      if (options.autoDepth) {
        factor = Math.sqrt(0.001 + 2.0 * Math.min(Math.abs(rRange[0] - rRange[1]), Math.abs(iRange[0] - iRange[1])));
        options.depth = Math.floor(223.0 / factor);
      }
      dr = (rRange[1] - rRange[0]) / (canvas.width - 0.5);
      di = (iRange[1] - iRange[0]) / (canvas.height - 0.5);
      updateUrl(options);
      updateInfo(options, rRange, iRange);
      renderId++;
      drawLine = function(crStart, ci, offset){
        var cr, escape, depth, i$, to$, p, color;
        offset == null && (offset = 0);
        cr = crStart;
        escape = options.escape, depth = options.depth;
        for (i$ = 0, to$ = canvas.width; i$ <= to$; ++i$) {
          p = algorithm.mandelbrot(cr, ci, escape, depth);
          color = palette(depth, p[0], p[1], p[2]);
          img.data[offset++] = color[0];
          img.data[offset++] = color[1];
          img.data[offset++] = color[2];
          img.data[offset++] = 255;
          cr += dr;
        }
      };
      drawSupersampledLine = function(crStart, ci, offset){
        var cr, escape, depth, supersamples, i$, to$, color, j$, rx, ry, p;
        offset == null && (offset = 0);
        cr = crStart;
        escape = options.escape, depth = options.depth, supersamples = options.supersamples;
        for (i$ = 0, to$ = canvas.width; i$ <= to$; ++i$) {
          color = [0, 0, 0, 255];
          for (j$ = 0; j$ <= supersamples; ++j$) {
            rx = Math.random() * dr;
            ry = Math.random() * di;
            p = algorithm.mandelbrot(cr - rx / 2, ci - ry / 2, escape, depth);
            addRgb(color, palette(depth, p[0], p[1], p[2]));
          }
          divRgb(color, supersamples);
          img.data[offset++] = color[0];
          img.data[offset++] = color[1];
          img.data[offset++] = color[2];
          img.data[offset++] = 255;
          cr += dr;
        }
      };
      drawSolidLine = function(i, color){
        var offset, i$, to$;
        offset = i * canvas.width;
        for (i$ = 0, to$ = canvas.width; i$ <= to$; ++i$) {
          img.data[offset++] = color[0];
          img.data[offset++] = color[1];
          img.data[offset++] = color[2];
          img.data[offset++] = color[3];
        }
      };
      drawLines = function(){
        var start, startHeight, startWidth, lastUpdate, pixels, ci, si, drawFn, id, renderLine;
        start = Date.now();
        startHeight = canvas.height;
        startWidth = canvas.width;
        lastUpdate = start;
        pixels = 0;
        ci = iRange[0];
        si = 0;
        drawFn = options.supersamples > 1 ? drawSupersampledLine : drawLine;
        id = renderId;
        $('#size').text(canvas.width + " x " + canvas.height);
        renderLine = function(){
          var now, elapsedTime, speed;
          if (stopping || id !== renderId || startHeight !== canvas.height || startWidth !== canvas.width) {
            return;
          }
          drawFn(rRange[0], ci);
          ci += di;
          pixels += canvas.width;
          ctx.putImageData(img, 0, si);
          now = Date.now();
          if (si++ < canvas.height) {
            if (now - lastUpdate >= options.update) {
              drawSolidLine(0, [255, 59, 3, 255]);
              ctx.putImageData(img, 0, si);
              elapsedTime = now - start;
              $('#render-time').text((elapsedTime / 1000.0).toFixed(1));
              speed = 1000 * pixels / elapsedTime;
              if (metricize(speed).substr(0, 3) === 'NaN') {
                speed = Math.floor(60.0 * pixels / elapsedTime);
                $('#render-unit').text('min');
              } else {
                $('#render-unit').text('s');
              }
              $('#render-speed').text(metricize(speed));
              $('#pixels').text(metricize(pixels) + "px");
              lastUpdate = now;
              setTimeout(renderLine, 0);
            } else {
              renderLine();
            }
          } else {
            $('#pixels').text(metricize(pixels));
          }
        };
        renderLine();
      };
      drawLines();
    };
    adjustAspectRatio = function(zoom){
      var rangeRatio, screenRatio;
      rangeRatio = zoom[0] / zoom[1];
      screenRatio = window.innerWidth / window.innerHeight;
      if (screenRatio > rangeRatio) {
        zoom[0] *= screenRatio / rangeRatio;
      } else {
        zoom[1] *= rangeRatio / screenRatio;
      }
    };
    updateUrl = function(options){
      var re, im, zoom, escape, depth, autoDepth, supersamples, palette, update, ad;
      re = options.re, im = options.im, zoom = options.zoom, escape = options.escape, depth = options.depth, autoDepth = options.autoDepth, supersamples = options.supersamples, palette = options.palette, update = options.update;
      ad = autoDepth ? 1 : 0;
      window.location.hash = "r=" + re + "&i=" + im + "&z=" + zoom + "&e=" + escape + "&d=" + depth + "&a=" + ad + "&s=" + supersamples + "&p=" + palette + "&u=" + update;
    };
    updateInfo = function(options, reRange, imRange){
      var re, im, zoom, escape, depth, autoDepth, supersamples, palette, update, rmin, rmax, imin, imax, horiz, vert;
      re = options.re, im = options.im, zoom = options.zoom, escape = options.escape, depth = options.depth, autoDepth = options.autoDepth, supersamples = options.supersamples, palette = options.palette, update = options.update;
      $('#re').val(re);
      $('#im').val(im);
      $('#zoom').val(zoom);
      $('#escape').val(escape);
      $('#depth').val(depth);
      $('#update').val(update);
      $('#auto-depth').prop('checked', autoDepth);
      $('#palette').val(palette);
      $('#supersamples').val(supersamples);
      rmin = reRange[0], rmax = reRange[1];
      imin = imRange[0], imax = imRange[1];
      horiz = Math.abs(rmin - rmax);
      vert = Math.abs(imin - imax);
      $('#domain span').html("d<sub>Re</sub> = " + horiz + " | d<sub>Im</sub> = " + vert);
    };
    addRgb = function(v, w){
      v[0] += w[0];
      v[1] += w[1];
      v[2] += w[2];
      v[3] += w[3];
    };
    divRgb = function(v, d){
      v[0] /= d;
      v[1] /= d;
      v[2] /= d;
      v[3] /= d;
    };
    metricize = function(number, places){
      var unit, magnitude, formatted;
      places == null && (places = 2);
      unit = ["", 'k', 'M', 'G', 'T', 'P', 'E'];
      magnitude = Math.floor(Math.floor(Math.log(number) / Math.LN10) / 3);
      formatted = (number / Math.pow(10, 3 * magnitude)).toFixed(places);
      return formatted + " " + unit[magnitude];
    };
    getRange = function(options){
      var zoom;
      zoom = [zoomDefault / options.zoom, zoomDefault / options.zoom];
      adjustAspectRatio(zoom);
      return [[options.re - zoom[0] / 2, options.re + zoom[0] / 2], [options.im + zoom[1] / 2, options.im - zoom[1] / 2]];
    };
    stop = function(){
      stopping = true;
    };
    return {
      render: render,
      stop: stop,
      getRange: getRange
    };
  });
}).call(this);
