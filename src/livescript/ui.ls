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
    renderer.render canvas, ctx, img, options

  $ window .on \hashchange !->
    fill-options-from-url!
    renderer.render canvas, ctx, img, options

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

    renderer.render canvas, ctx, img, options

  $ \#control .click !->
    $this = $ @
    $ \#settings .toggle 500
    $ \#render .toggle 500
    $ \#domain .toggle 500
    $this.text (if $this.text! is 'Hide Panels' then 'Show Panels' else 'Hide Panels')

  $ \#draw-action .click !->
    fill-options-from-settings!
    renderer.render canvas, ctx, img, options

  $ \#stop-action .click !->
    renderer.stop!

  $ \#reset-action .click !->
    options := ^^defaults
    renderer.render canvas, ctx, img, options

  $ \#export-action .click !->
    features = "width=#{canvas.width},height=#{canvas.height},location=no"
    window.open (canvas.to-data-URL \image/png), "Mandelbrot Set Export", features 

  check-disabled = !->
    $ \#depth .prop \disabled, ($ @ .is \:checked)

  $ \#auto-depth .change check-disabled
  check-disabled!

  init-canvas!
  fill-options-from-url!
  renderer.render canvas, ctx, img, options

init-canvas = !->
  canvas.width = window.inner-width
  canvas.height = window.inner-height
  ctx := canvas.get-context \2d
  img := ctx.create-image-data canvas.width, 1

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

{ init }
