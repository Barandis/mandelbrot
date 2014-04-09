(function(){
  define(function(){
    var logBase, logHalf, mandelbrot, toRgb, smoothColor, setColor, orangePalette, redPalette, bluePalette, grayPalette, redscalePalette, greenscalePalette, bluescalePalette;
    logBase = 1.0 / Math.log(2.0);
    logHalf = logBase * Math.log(0.5);
    mandelbrot = function(cr, ci, escape, depth, hist){
      var zr, zi, tr, ti, n, d, i$;
      hist == null && (hist = null);
      zr = zi = tr = ti = n = 0;
      d = escape * escape;
      while (n < depth && tr + ti <= d) {
        zi = 2 * zr * zi + ci;
        zr = tr - ti + cr;
        tr = zr * zr;
        ti = zi * zi;
        ++n;
      }
      for (i$ = 1; i$ <= 4; ++i$) {
        zi = 2 * zr * zi + ci;
        zr = tr - ti + cr;
        tr = zr * zr;
        ti = zi * zi;
      }
      return [n, tr, ti];
    };
    toRgb = function(h, s, v){
      var c, x, m, rgb;
      if (v > 1.0) {
        v = 1.0;
      }
      c = v * s;
      x = c * (1 - Math.abs((h / 60) % 2 - 1));
      m = v - c;
      rgb = [0, 0, 0];
      if (0 <= h && h < 60) {
        rgb = [c, x, 0];
      }
      if (60 <= h && h < 120) {
        rgb = [x, c, 0];
      }
      if (120 <= h && h < 180) {
        rgb = [0, c, x];
      }
      if (180 <= h && h < 240) {
        rgb = [0, x, c];
      }
      if (240 <= h && h < 300) {
        rgb = [x, 0, c];
      }
      if (300 <= h && h < 360) {
        rgb = [c, 0, x];
      }
      rgb[0] += m;
      rgb[1] += m;
      rgb[2] += m;
      rgb[0] *= 255;
      rgb[1] *= 255;
      rgb[2] *= 255;
      return rgb;
    };
    smoothColor = function(depth, n, tr, ti){
      return 1 + n - logHalf - logBase * Math.log(Math.log(tr + ti));
    };
    setColor = [0, 0, 0, 255];
    orangePalette = function(depth, n, tr, ti){
      var v, c;
      if (depth === n) {
        return setColor;
      } else {
        v = smoothColor(depth, n, tr, ti);
        c = toRgb(360.0 * v / depth, 1.0, 1.0);
        c.push(255);
        return c;
      }
    };
    redPalette = function(depth, n, tr, ti){
      var v, c;
      if (depth === n) {
        return setColor;
      } else {
        v = smoothColor(depth, n, tr, ti);
        c = toRgb(360.0 * v / depth, 1.0, 10.0 * v / depth);
        c.push(255);
        return c;
      }
    };
    bluePalette = function(depth, n, tr, ti){
      var v, c, t;
      if (depth === n) {
        return setColor;
      } else {
        v = smoothColor(depth, n, tr, ti);
        c = toRgb(360.0 * v / depth, 1.0, 10.0 * v / depth);
        t = c[0];
        c[0] = c[2];
        c[2] = t;
        c.push(255);
        return c;
      }
    };
    grayPalette = function(depth, n, tr, ti){
      var v;
      if (depth === n) {
        return setColor;
      } else {
        v = smoothColor(depth, n, tr, ti);
        v = Math.floor(512.0 * v / depth);
        if (v > 255) {
          v = 255;
        }
        return [v, v, v, 255];
      }
    };
    redscalePalette = function(depth, n, tr, ti){
      var v;
      if (depth === n) {
        return setColor;
      } else {
        v = smoothColor(depth, n, tr, ti);
        v = Math.floor(512.0 * v / depth);
        if (v > 255) {
          v = 255;
        }
        return [v, 0, 0, 255];
      }
    };
    greenscalePalette = function(depth, n, tr, ti){
      var v;
      if (depth === n) {
        return setColor;
      } else {
        v = smoothColor(depth, n, tr, ti);
        v = Math.floor(512.0 * v / depth);
        if (v > 255) {
          v = 255;
        }
        return [0, v, 0, 255];
      }
    };
    bluescalePalette = function(depth, n, tr, ti){
      var v;
      if (depth === n) {
        return setColor;
      } else {
        v = smoothColor(depth, n, tr, ti);
        v = Math.floor(512.0 * v / depth);
        if (v > 255) {
          v = 255;
        }
        return [0, 0, v, 255];
      }
    };
    return {
      mandelbrot: mandelbrot,
      palettes: [orangePalette, redPalette, bluePalette, grayPalette, redscalePalette, greenscalePalette, bluescalePalette]
    };
  });
}).call(this);
