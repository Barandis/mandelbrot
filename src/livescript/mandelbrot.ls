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

<- define
  
log-base = 1.0 / Math.log 2.0
log-half = log-base * Math.log 0.5

# The main set membership calculation.
#
# This is an implementation of the equation
#
#       Z(n + 1) = Zn^2 + c
#
# where c is the complex number being tested for membership in the set. When
# the |Zn| exceeds the prescribed escape value, we know that the series will
# diverge, and therefore c is not a member of the Mandelbrot set. If we reach
# the iteration limit (the depth) before finding divergence, then we say that
# c is a member of the set, at least for the resolution that we calculated.
#
# The returned value is an array that consists of 1) the number of iterations
# that it took for the series on that point to escape (this will equal the
# depth if the series does not diverge) and the real and imaginary componnets
# of |Zn|. These last two determine how quickly the series diverged and can be
# used to choose color in a more fine-grained fashion ('smooth' or
# 'continuous' coloring).
# 
# See http://linas.org/art-gallery/escape/math.html for some good explanations
# of this escape time method (and, relatedly, of continuous coloring).
mandelbrot = (cr, ci, escape, depth) ->
  zr = zi = tr = ti = n = 0
  d = escape * escape
  while n < depth and (tr + ti) <= d
    zi = 2 * zr * zi + ci
    zr = tr - ti + cr
    tr = zr * zr
    ti = zi * zi
    ++n
  # A few more iterations reduce the error term. 
  for from 1 to 4
    zi = 2 * zr * zi + ci
    zr = tr - ti + cr
    tr = zr * zr
    ti = zi * zi
  [n, tr, ti]

const set-color = [0, 0, 0, 255]

const uf-colors =
  [  9   1  47]
  [  4   4  73]
  [  0   7 100]
  [ 12  44 138]
  [ 24  82 177]
  [ 57 125 209]
  [134 181 229]
  [211 236 248]
  [241 233 191]
  [248 201  95]
  [255 170   0]
  [204 128   0]
  [153  87   0]
  [106  52   3]
  [ 66  30  15]
  [ 25   7  26]

palettes = 
  (n, tr, ti, depth, cycles, rotation, cont) ->
    if depth is n then set-color
    else
      if cont
        v = 16.0 * cycles * (interpolate n, tr, ti) / depth
        v = 0.0 if v < 0.0
        a = ((Math.floor v) + rotation) % 16
        b = v % 1
        c1 = uf-colors[a]
        c2 = uf-colors[(a + 1) % 16]
        [c1.0 + b * (c2.0 - c1.0), c1.1 + b * (c2.1 - c1.1), c1.2 + b * (c2.2 - c1.2)]
      else
        v = Math.floor 16.0 * cycles * n / depth
        uf-colors[(v + rotation) % 16]

  (n, tr, ti, depth, cycles, rotation, cont) ->
    if depth is n then set-color
    else
      v = if cont then interpolate n, tr, ti else n
      c = to-rgb 360.0 * v / depth, 1.0, 10.0 * v / depth
      c.push 255
      c

  (n, tr, ti, depth, cycles, rotation, cont) ->
    if depth is n then set-color
    else 
      v = if cont then interpolate n, tr, ti else n
      v = Math.floor 512.0 * v / depth
      v = 255 if v > 255
      [v, v, v, 255]

# From http://www.rapidtables.com/convert/color/hsv-to-rgb.htm
# 0 <= h < 360, 0 <= s <= 1, 0 <= v <= 1
to-rgb = (h, s, v) ->
  v = 1.0 if v > 1.0

  c = v * s
  x = c * (1 - Math.abs (h / 60) % 2 - 1)
  m = v - c
  rgb = [0,0,0]

  # don't use switch here. It's 4-5 times slower.
  if 0   <= h < 60  then rgb = [c, x, 0]
  if 60  <= h < 120 then rgb = [x, c, 0]
  if 120 <= h < 180 then rgb = [0, c, x]
  if 180 <= h < 240 then rgb = [0, x, c]
  if 240 <= h < 300 then rgb = [x, 0, c]
  if 300 <= h < 360 then rgb = [c, 0, x]

  rgb.0 += m
  rgb.1 += m
  rgb.2 += m
  
  rgb.0 *= 255
  rgb.1 *= 255
  rgb.2 *= 255

  rgb

# A function to interpolate color based on the rapidity with which the
# series diverges. The original iteration value is passed along with the real
# and imaginary components of |Zn| at that point, and a more fine-grained
# iteration value (i.e., not an integer) is returned.
interpolate = (n, tr, ti) ->
  1 + n - log-half - log-base * Math.log Math.log tr + ti

calculator: (palette, escape, depth, cycles, rotation, cont) ->
  (cr, ci) ->
    p = mandelbrot cr, ci, escape, depth
    palettes[palette] p.0, p.1, p.2, depth, cycles, rotation, cont
