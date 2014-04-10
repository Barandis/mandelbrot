($, algorithm) <- define <[ jquery ./algorithm ]>

const zoom-default = 2.6
render-id = 0
stopping = false

render = (canvas, ctx, img, options) !->
  stopping := false
  palette = algorithm.palettes[options.palette]
  [r-range, i-range] = get-range options

  if options.auto-depth
    factor = Math.sqrt 0.001 + 2.0 * Math.min (Math.abs r-range.0 - r-range.1), (Math.abs i-range.0 - i-range.1)
    options.depth = Math.floor 223.0 / factor

  dr = (r-range.1 - r-range.0) / (canvas.width - 0.5)
  di = (i-range.1 - i-range.0) / (canvas.height - 0.5)

  update-url options
  update-info options, r-range, i-range
  render-id++

  draw-line = (cr-start, ci, offset = 0) !->
    cr = cr-start
    { escape, depth, continuous } = options
    for from 0 to canvas.width
      p = algorithm.mandelbrot cr, ci, escape, depth
      color = palette depth, p.0, p.1, p.2, continuous

      img.data[offset++] = color.0
      img.data[offset++] = color.1
      img.data[offset++] = color.2
      img.data[offset++] = 255

      cr += dr

  draw-supersampled-line = (cr-start, ci, offset = 0) !->
    cr = cr-start
    { escape, depth, supersamples, continuous } = options
    for from 0 to canvas.width
      color = [0, 0, 0, 255]
      for from 0 to supersamples
        rx = Math.random! * dr
        ry = Math.random! * di
        p = algorithm.mandelbrot cr - rx / 2, ci - ry / 2, escape, depth
        add-rgb color, palette(depth, p.0, p.1, p.2, continuous)
      div-rgb color, supersamples

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
    start-height = canvas.height
    start-width = canvas.width
    last-update = start
    pixels = 0
    ci = i-range.0
    si = 0
    draw-fn = if options.supersamples > 1 then draw-supersampled-line else draw-line
    id = render-id

    $ \#size .text "#{canvas.width} x #{canvas.height}"

    render-line = !->
      return if stopping or id isnt render-id or start-height isnt canvas.height or start-width isnt canvas.width
      
      draw-fn r-range.0, ci
      ci += di
      pixels += canvas.width
      ctx.put-image-data img, 0, si

      now = Date.now!

      if si++ < canvas.height
        if (now - last-update) >= options.update
          draw-solid-line 0, [255, 59, 3, 255]
          ctx.put-image-data img, 0, si

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

    render-line!

  draw-lines!

adjust-aspect-ratio = (zoom) !->
  range-ratio = zoom.0 / zoom.1
  screen-ratio = window.inner-width / window.inner-height
  if screen-ratio > range-ratio then zoom.0 *= screen-ratio / range-ratio
  else zoom.1 *= range-ratio / screen-ratio

update-url = (options) !->
  { re, im, zoom, escape, depth, auto-depth, supersamples, palette, update, continuous } = options
  ad = if auto-depth then 1 else 0
  cn = if continuous then 1 else 0
  window.location.hash = "r=#re&i=#im&z=#zoom&e=#escape&d=#depth&a=#ad
                          &s=#supersamples&p=#palette&u=#update&c=#cn"

update-info = (options, re-range, im-range) !->
  { re, im, zoom, escape, depth, auto-depth, supersamples, palette, update, continuous } = options
  $ \#re .val re
  $ \#im .val im
  $ \#zoom .val zoom
  $ \#escape .val escape
  $ \#depth .val depth
  $ \#update .val update
  $ \#palette .val palette
  $ \#supersamples .val supersamples

  $ \#auto-depth .prop \checked, auto-depth
  $ \#continuous .prop \checked, continuous

  [rmin, rmax] = re-range
  [imin, imax] = im-range
  horiz = Math.abs rmin - rmax
  vert = Math.abs imin - imax
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

metricize = (number, places = 2) ->
  unit = [ "", \k, \M, \G, \T, \P, \E ]
  magnitude = Math.floor (Math.floor (Math.log number) / Math.LN10) / 3
  formatted = (number / 10 ^ (3 * magnitude)).to-fixed places
  "#formatted #{unit[magnitude]}"

get-range = (options) ->
  zoom = [ zoom-default / options.zoom, zoom-default / options.zoom ]
  adjust-aspect-ratio zoom
  [[ options.re - zoom.0 / 2, options.re + zoom.0 / 2 ],
   [ options.im + zoom.1 / 2, options.im - zoom.1 / 2 ]]

stop = !-> stopping := true

{ render, stop, get-range }
