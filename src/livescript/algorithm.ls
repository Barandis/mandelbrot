<- define
  
log-base = 1.0 / Math.log 2.0
log-half = log-base * Math.log 0.5

# The main rendering equation.
#
# The algorithm used is an escape time algorithm. The Mandelbrot function
# is applied to a single point (whose real and imaginary coordinates are given
# by `cr` and `ci`) over and over, and during each iteration the value is 
# checked to see if it has exceeded some threshold distance from the origin 
# (`escape`). If so, then the point has 'escaped' and is known not to be a 
# member of the Mandelbrot set.
#
# If the point never escapes for the given number of iterations (`depth`), it 
# is said to be a member of the Mandelbrot set at that level of detail.
#
# The distance check does use Pythagoras' theorem, but since we're simply
# trying to determine whether a threshold has been exceeded rather than trying
# to get an absolute distance value, we use
#
#         d^2 = tr^2 + ti^2
#
# rather than
#
#         d = sqrt(tr^2 + ti^2)
#
# This is because d^2 needs to only be calculated once, since d is a provided
# parameter and remains constant over the course of the function call, while
# tr and ti (the real and imaginary components of the current value of the
# Mandelbrot function) take on new values every iteration, so the square root
# would have to be taken many times.
#
# This function returns an array. The first value of this array is the number
# of function iterations that were run on the point. If this value is the same
# as `depth`, then the point is part of the Mandelbrot set; otherwise, the
# value is the number of iterations that were necessary to determine that the
# point was not a member of the Mandelbrot set. This value can be used to
# determine the color of the point in a Mandelbrot visualization.
#
# The second and third values in the array are the squares of the real and
# imaginary portions of the value that were used to determine distance. These
# values can be used to refine the color of the point in a visualization,
# allowing color smoothing to be applied.
#
# See http://linas.org/art-gallery/escape/math.html for some good explanations
# of this escape time method (and, relatedly, of smooth coloring).
mandelbrot = (cr, ci, escape, depth, hist = null) ->
  zr = zi = tr = ti = n = 0
  d = escape * escape
  while n < depth and (tr + ti) <= d
    zi = 2 * zr * zi + ci
    zr = tr - ti + cr
    tr = zr * zr
    ti = zi * zi
    ++n
  # A few more iterations reduce the error term. The practical effect is that
  # there is a bit more contrast in the images, since the points that diverge
  # more quickly take on a 'darker' color.
  for from 1 to 4
    zi = 2 * zr * zi + ci
    zr = tr - ti + cr
    tr = zr * zr
    ti = zi * zi
  [n, tr, ti]

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

smooth-color = (depth, n, tr, ti) ->
  1 + n - log-half - log-base * Math.log Math.log tr + ti

const set-color = [0, 0, 0, 255]

orange-palette = (depth, n, tr, ti) ->
  if depth is n then set-color
  else
    v = smooth-color depth, n, tr, ti
    c = to-rgb 360.0 * v / depth, 1.0, 1.0
    c.push 255
    c

red-palette = (depth, n, tr, ti) ->
  if depth is n then set-color
  else
    v = smooth-color depth, n, tr, ti
    c = to-rgb 360.0 * v / depth, 1.0, 10.0 * v / depth
    c.push 255
    c

blue-palette = (depth, n, tr, ti) ->
  if depth is n then set-color
  else 
    v = smooth-color depth, n, tr, ti
    c = to-rgb 360.0 * v / depth, 1.0, 10.0 * v / depth
    t = c.0
    c.0 = c.2
    c.2 = t
    c.push 255
    c

gray-palette = (depth, n, tr, ti) ->
  if depth is n then set-color
  else 
    v = smooth-color depth, n, tr, ti
    v = Math.floor 512.0 * v / depth
    v = 255 if v > 255
    [v, v, v, 255]

redscale-palette = (depth, n, tr, ti) ->
  if depth is n then set-color
  else 
    v = smooth-color depth, n, tr, ti
    v = Math.floor 512.0 * v / depth
    v = 255 if v > 255
    [v, 0, 0, 255]

greenscale-palette = (depth, n, tr, ti) ->
  if depth is n then set-color
  else 
    v = smooth-color depth, n, tr, ti
    v = Math.floor 512.0 * v / depth
    v = 255 if v > 255
    [0, v, 0, 255]

bluescale-palette = (depth, n, tr, ti) ->
  if depth is n then set-color
  else 
    v = smooth-color depth, n, tr, ti
    v = Math.floor 512.0 * v / depth
    v = 255 if v > 255
    [0, 0, v, 255]

{
  mandelbrot: mandelbrot
  palettes:
    orange-palette
    red-palette
    blue-palette
    gray-palette
    redscale-palette
    greenscale-palette
    bluescale-palette
}