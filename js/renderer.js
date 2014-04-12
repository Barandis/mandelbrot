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
  define(['jquery', './mandelbrot'], function($, mandelbrot){
    var zoomDefault, grayPalette, renderId, stopping, render, adjustAspectRatio, updateInfo, addRgb, divRgb, metricize, exponentize, getRange, stop;
    zoomDefault = 2.6;
    grayPalette = 2;
    renderId = 0;
    stopping = false;
    render = function(canvas, ctx, img, options, preCb, postCb){
      var ref$, rRange, iRange, compute, dr, di, drawLine, drawSupersampledLine, drawSolidLine, drawLines;
      stopping = false;
      ref$ = getRange(options), rRange = ref$[0], iRange = ref$[1];
      compute = mandelbrot.calculator(options.palette, options.escape, options.depth, options.continuous);
      dr = (rRange[1] - rRange[0]) / (canvas.width - 0.5);
      di = (iRange[1] - iRange[0]) / (canvas.height - 0.5);
      updateInfo(options, rRange, iRange);
      renderId++;
      drawLine = function(crStart, ci, offset){
        var cr, i$, to$, color;
        offset == null && (offset = 0);
        cr = crStart;
        for (i$ = 0, to$ = canvas.width; i$ <= to$; ++i$) {
          color = compute(cr, ci);
          img.data[offset++] = color[0];
          img.data[offset++] = color[1];
          img.data[offset++] = color[2];
          img.data[offset++] = 255;
          cr += dr;
        }
      };
      drawSupersampledLine = function(crStart, ci, offset){
        var cr, i$, to$, color, j$, to1$, rx, ry;
        offset == null && (offset = 0);
        cr = crStart;
        for (i$ = 0, to$ = canvas.width; i$ <= to$; ++i$) {
          color = [0, 0, 0, 255];
          for (j$ = 0, to1$ = options.supersamples; j$ <= to1$; ++j$) {
            rx = Math.random() * dr;
            ry = Math.random() * di;
            addRgb(color, compute(cr - rx / 2, ci - ry / 2));
          }
          divRgb(color, options.supersamples);
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
        var start, lastUpdate, pixels, ci, line, id, drawFn, renderLine;
        start = Date.now();
        lastUpdate = start;
        pixels = 0;
        ci = iRange[0];
        line = 0;
        id = renderId;
        drawFn = options.supersamples > 1 ? drawSupersampledLine : drawLine;
        $('#size').text(canvas.width + " x " + canvas.height);
        renderLine = function(){
          var now, elapsedTime, speed;
          if (id !== renderId) {
            return;
          }
          if (stopping) {
            postCb();
            return;
          }
          drawFn(rRange[0], ci);
          ci += di;
          pixels += canvas.width;
          ctx.putImageData(img, 0, line);
          now = Date.now();
          if (line++ < canvas.height) {
            if (now - lastUpdate >= options.update) {
              drawSolidLine(0, [255, 59, 3, 255]);
              ctx.putImageData(img, 0, line);
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
            postCb();
          }
        };
        renderLine();
      };
      preCb();
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
    updateInfo = function(options, reRange, imRange){
      var rmin, rmax, imin, imax, horiz, vert;
      rmin = reRange[0], rmax = reRange[1];
      imin = imRange[0], imax = imRange[1];
      horiz = exponentize(Math.abs(rmax - rmin));
      vert = exponentize(Math.abs(imax - imin));
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
    metricize = function(number, precision){
      var unit, magnitude, formatted;
      precision == null && (precision = 3);
      unit = ["", 'k', 'M', 'G', 'T', 'P', 'E'];
      magnitude = Math.floor(Math.floor(Math.log(number) / Math.LN10) / 3);
      formatted = (number / Math.pow(10, 3 * magnitude)).toPrecision(precision);
      return formatted + " " + unit[magnitude];
    };
    exponentize = function(number, places){
      var n, ref$, mantissa, exponent;
      places == null && (places = -1);
      if (Math.abs(number) >= 1) {
        return places === -1
          ? number.toPrecision()
          : number.toPrecision(places);
      }
      n = places === -1
        ? number.toExponential()
        : number.toExponential(places);
      ref$ = n.split(/e/), mantissa = ref$[0], exponent = ref$[1];
      return mantissa + " &times; 10<sup>" + exponent + "</sup>";
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
