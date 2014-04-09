requirejs.config do
  baseUrl: 'js'
  paths: jquery: 'lib/jquery'

($, ui) <-! require <[ jquery ./ui ]>

<-! $

ui.init!
