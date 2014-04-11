(function(){
  define(function(){
    var logBase, logHalf, mandelbrot, toRgb, smooth, setColor, ufColors, palettes;
    logBase = 1.0 / Math.log(2.0);
    logHalf = logBase * Math.log(0.5);
    mandelbrot = function(cr, ci, escape, depth){
      var zr, zi, tr, ti, n, d, i$;
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
    smooth = function(n, tr, ti){
      return 1 + n - logHalf - logBase * Math.log(Math.log(tr + ti));
    };
    setColor = [0, 0, 0, 255];
    ufColors = [[66, 30, 15], [25, 7, 26], [9, 1, 47], [4, 4, 73], [0, 7, 100], [12, 44, 138], [24, 82, 177], [57, 125, 209], [134, 181, 229], [211, 236, 248], [241, 233, 191], [248, 201, 95], [255, 170, 0], [204, 128, 0], [153, 87, 0], [106, 52, 3]];
    palettes = [
      function(n, tr, ti, depth, continuous){
        var v, a, b, c1, c2;
        if (depth === n) {
          return setColor;
        } else {
          if (continuous) {
            v = 192.0 * smooth(n, tr, ti) / depth;
            if (v < 0.0) {
              v = 0.0;
            }
            a = Math.floor(v) % 16;
            b = v % 1;
            c1 = ufColors[a];
            c2 = ufColors[(a + 1) % 16];
            return [c1[0] + b * (c2[0] - c1[0]), c1[1] + b * (c2[1] - c1[1]), c1[2] + b * (c2[2] - c1[2])];
          } else {
            v = Math.floor(192.0 * n / depth);
            return ufColors[v % 16];
          }
        }
      }, function(n, tr, ti, depth, continuous){
        var v, c;
        if (depth === n) {
          return setColor;
        } else {
          v = continuous ? smooth(n, tr, ti) : n;
          c = toRgb(360.0 * v / depth, 1.0, 10.0 * v / depth);
          c.push(255);
          return c;
        }
      }, function(n, tr, ti, depth, continuous){
        var v;
        if (depth === n) {
          return setColor;
        } else {
          v = continuous ? smooth(n, tr, ti) : n;
          v = Math.floor(512.0 * v / depth);
          if (v > 255) {
            v = 255;
          }
          return [v, v, v, 255];
        }
      }
    ];
    return {
      mandelbrot: mandelbrot,
      palettes: palettes
    };
  });
}).call(this);
