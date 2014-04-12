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

($, mandelbrot) <- define <[ jquery ./mandelbrot ]>

const zoom-default = 2.6
const gray-palette = 2
render-id = 0
stopping = false

render = (canvas, ctx, img, options, pre-cb, post-cb) !->
  stopping := false
  [r-range, i-range] = get-range options
  
  compute = mandelbrot.calculator options.palette, options.escape, options.depth, options.continuous

  dr = (r-range.1 - r-range.0) / (canvas.width - 0.5)
  di = (i-range.1 - i-range.0) / (canvas.height - 0.5)

  update-info options, r-range, i-range
  render-id++

  draw-line = (cr-start, ci, offset = 0) !->
    cr = cr-start
    for from 0 to canvas.width
      color = compute cr, ci

      img.data[offset++] = color.0
      img.data[offset++] = color.1
      img.data[offset++] = color.2
      img.data[offset++] = 255

      cr += dr

  draw-supersampled-line = (cr-start, ci, offset = 0) !->
    cr = cr-start
    for from 0 to canvas.width
      color = [0, 0, 0, 255]
      for from 0 to options.supersamples
        rx = Math.random! * dr
        ry = Math.random! * di
        add-rgb color, compute cr - rx / 2, ci - ry / 2
      div-rgb color, options.supersamples

      img.data[offset++] = color.0
      img.data[offset++] = color.1
      img.data[offset++] = color.2
      img.data[offset++] = 255

      cr += dr

  draw-solid-line = (i, color) !->
    offset = i * canvas.width
    for from 0 to canvas.width
      img.data[offset++] = color.0
      img.data[offset++] = color.1
      img.data[offset++] = color.2
      img.data[offset++] = color.3

  draw-lines = !->
    start = Date.now!
    last-update = start

    pixels = 0
    ci = i-range.0
    line = 0
    id = render-id

    draw-fn = if options.supersamples > 1 then draw-supersampled-line else draw-line

    $ \#size .text "#{canvas.width} x #{canvas.height}"

    render-line = !->
      return if id isnt render-id
      if stopping
        post-cb!
        return

      draw-fn r-range.0, ci
      ci += di
      pixels += canvas.width
      ctx.put-image-data img, 0, line

      now = Date.now!

      if line++ < canvas.height
        if (now - last-update) >= options.update
          draw-solid-line 0, [255, 59, 3, 255]
          ctx.put-image-data img, 0, line

          elapsed-time = now - start
          $ \#render-time .text (elapsed-time / 1000.0).to-fixed 1

          speed = 1000 * pixels / elapsed-time
          if ((metricize speed) .substr 0, 3) is \NaN
            speed = Math.floor 60.0 * pixels / elapsed-time
            $ \#render-unit .text \min
          else
            $ \#render-unit .text \s
          $ \#render-speed .text metricize speed

          $ \#pixels .text "#{metricize pixels}px"

          last-update := now
          set-timeout render-line, 0
        else
          render-line!
      else
        $ \#pixels .text metricize pixels
        post-cb!

    render-line!

  pre-cb!
  draw-lines!

adjust-aspect-ratio = (zoom) !->
  range-ratio = zoom.0 / zoom.1
  screen-ratio = window.inner-width / window.inner-height
  if screen-ratio > range-ratio then zoom.0 *= screen-ratio / range-ratio
  else zoom.1 *= range-ratio / screen-ratio

update-info = (options, re-range, im-range) !->
  [rmin, rmax] = re-range
  [imin, imax] = im-range
  horiz = exponentize Math.abs rmax - rmin
  vert = exponentize Math.abs imax - imin
  $ '#domain span' .html "d<sub>Re</sub> = #horiz | d<sub>Im</sub> = #vert"

add-rgb = (v, w) !->
  v.0 += w.0
  v.1 += w.1
  v.2 += w.2
  v.3 += w.3

div-rgb = (v, d) !->
  v.0 /= d
  v.1 /= d
  v.2 /= d
  v.3 /= d

metricize = (number, precision = 3) ->
  unit = [ "", \k, \M, \G, \T, \P, \E ]
  magnitude = Math.floor (Math.floor (Math.log number) / Math.LN10) / 3
  formatted = (number / 10 ^ (3 * magnitude)).to-precision precision
  "#formatted #{unit[magnitude]}"

exponentize = (number, places = -1) ->
  return (if places == -1 then number.to-precision! else number.to-precision places) if (Math.abs number) >= 1
  n = if places is -1 then number.to-exponential! else number.to-exponential places
  [mantissa, exponent] = n.split /e/
  "#mantissa &times; 10<sup>#exponent</sup>"

get-range = (options) ->
  zoom = [ zoom-default / options.zoom, zoom-default / options.zoom ]
  adjust-aspect-ratio zoom
  [[ options.re - zoom.0 / 2, options.re + zoom.0 / 2 ],
   [ options.im + zoom.1 / 2, options.im - zoom.1 / 2 ]]

stop = !-> stopping := true

{ render, stop, get-range }
