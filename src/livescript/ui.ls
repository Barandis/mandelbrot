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

($, renderer) <- define <[ jquery ./renderer ]>

const defaults =
  re: -0.7
  im: 0.0
  zoom: 1.0
  escape: 2.0
  supersamples: 0
  depth: 50
  auto-depth: true
  palette: 0
  update: 100
  continuous: true

canvas = $ \#mandelbrot .get 0
options = ^^defaults
var ctx, img

init = !->

  # Initialize event handlers
  $ window .resize !-> 
    init-canvas!
    render!

  $ window .on \hashchange !->
    fill-options-from-url!
    render!

  $ \#mandelbrot .click (event) !->
    x = event.client-x
    y = event.client-y
    [r, i] = renderer.get-range options

    dx = (r.1 - r.0) / canvas.width 
    dy = (i.1 - i.0) / canvas.height

    options.re = r.0 + x * dx
    options.im = i.0 + y * dy
    if event.shift-key then options.zoom /= 2
    else if not event.ctrl-key then options.zoom *= 2

    render!

  $ \#control .click !->
    $this = $ @
    $ \#settings .toggle 500
    $ \#render .toggle 500
    $ \#domain .toggle 500
    $this.text (if $this.text! is 'Hide Panels' then 'Show Panels' else 'Hide Panels')

  $ \#draw-action .click !->
    fill-options-from-settings!
    render!

  $ \#stop-action .click !->
    renderer.stop!

  $ \#reset-action .click !->
    options := ^^defaults
    render!

  $ \#export-action .click !->
    features = "width=#{canvas.width},height=#{canvas.height},location=no"
    window.open (canvas.to-data-URL \image/png), "Mandelbrot Set Export", features 

  $ \#auto-depth .change disable-depth

  init-canvas!
  fill-options-from-url!
  disable-depth!
  render!

init-canvas = !->
  canvas.width = window.inner-width
  canvas.height = window.inner-height
  ctx := canvas.get-context \2d
  img := ctx.create-image-data canvas.width, 1

set-render-buttons = !->
  $ \#draw-action .prop \disabled false
  $ \#stop-action .prop \disabled true
  $ \#reset-action .prop \disabled false
  $ \#export-action .prop \disabled false

set-stop-buttons = !->
  $ \#draw-action .prop \disabled true
  $ \#stop-action .prop \disabled false
  $ \#reset-action .prop \disabled true
  $ \#export-action .prop \disabled true

disable-depth = !-> $ \#depth .prop \disabled, ($ \#auto-depth .is \:checked)

render = !->
  fill-settings-from-options!
  fill-url-from-options!
  disable-depth!
  renderer.render canvas, ctx, img, options, set-stop-buttons, set-render-buttons

fill-options-from-url = !->
  params = (window.location.hash.substring 1) / '&'
  for param in params
    [key, value] = param / '='

    switch key
    | \r            => options.re = parse-float value
    | \i            => options.im = parse-float value
    | \z            => options.zoom = parse-float value
    | \e            => options.escape = parse-float value
    | \s            => options.supersamples = parse-int value
    | \d            => options.depth = parse-int value
    | \a            => options.auto-depth = value is \1
    | \p            => options.palette = parse-int value
    | \u            => options.update = parse-int value
    | \c            => options.continuous = value is \1

  compute-auto-depth!
  fill-settings-from-options!

fill-options-from-settings = !->
  re                  = $.trim ($ \#re .val!)
  im                  = $.trim ($ \#im .val!)
  zoom                = $.trim ($ \#zoom .val!)
  escape              = $.trim ($ \#escape .val!)
  supersamples        = parse-int ($ \#supersamples .val!)
  depth               = $.trim ($ \#depth .val!)
  auto-depth          = $ \#auto-depth .is \:checked
  palette             = parse-int ($ \#palette .val!)
  update              = $.trim ($ \#update .val!)
  continuous          = $ \#continuous .is \:checked

  options.re = parse-float re if re
  options.im = parse-float im if im
  options.zoom = parse-float zoom if zoom
  options.escape = parse-float escape if escape
  options.supersamples = supersamples
  options.depth = parse-int depth if depth
  options.auto-depth = auto-depth
  options.palette = palette
  options.update = parse-int update if update
  options.continuous = continuous

  compute-auto-depth!
  fill-url-from-options!

fill-url-from-options = !->
  { re, im, zoom, escape, depth, auto-depth, supersamples, palette, update, continuous } = options
  auto-depth = if auto-depth then 1 else 0
  continuous = if continuous then 1 else 0
  window.location.hash = "r=#re&i=#im&z=#zoom&e=#escape&d=#depth&a=#auto-depth
                          &s=#supersamples&p=#palette&u=#update&c=#continuous"

fill-settings-from-options = !->
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

compute-auto-depth = !->
  if options.auto-depth
    [r-range, i-range] = renderer.get-range options
    factor = Math.sqrt 0.001 + 2.0 * Math.min (Math.abs r-range.0 - r-range.1), (Math.abs i-range.0 - i-range.1)
    options.depth = Math.floor 223.0 / factor

{ init }
