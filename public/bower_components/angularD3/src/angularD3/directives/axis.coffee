angular.module('ad3').directive 'd3Axis', ->
  defaults = ->
    orientation: 'bottom'
    ticks: '5'
    extent: false

  priority: 1

  restrict: 'E'

  require: '^d3Chart'

  link: ($scope, $el, $attrs, chartController) ->
    options = angular.extend(defaults(), $attrs)

    range = ->
      if options.orientation is 'top' or options.orientation is 'bottom'
        if options.reverse?
          [chartController.innerWidth(), 0]
        else
          [0 ,chartController.innerWidth()]
      else
        if options.reverse?
          [0, chartController.innerHeight()]
        else
          [chartController.innerHeight(), 0]

    translation = ->
      if options.orientation is 'bottom'
        "translate(0, #{chartController.innerHeight()})"
      else if options.orientation is 'top'
        "translate(0, 0)"
      else if options.orientation is 'left'
        "translate(0, 0)"
      else if options.orientation is 'right'
        "translate(#{chartController.innerWidth()}, 0)"

    scale = d3.scale.linear()

    getAxis = ->
      axis = d3.svg.axis().scale(scale).orient(options.orientation)
      if options.ticks
        axis.ticks(options.ticks)
      if options.tickValues
        axis.tickValues($scope.$eval(options.tickValues))
      if options.format?
        format = d3.format(options.format)
        axis.tickFormat(format)
      if options.timeFormat?
        format = d3.time.format(options.timeFormat)
        axis.tickFormat((value) -> format(new Date(value)))
      axis

    positionLabel = (label) ->
      if options.orientation is 'bottom'
        label.attr("x", "#{chartController.innerWidth() / 2}")
          .attr("dy", "#{chartController.margin.bottom}")
          .attr("style", "text-anchor: middle;")
      else if options.orientation is 'top'
        label.attr("x", "#{chartController.innerWidth() / 2}")
          .attr("dy", "#{-chartController.margin.top}")
          .attr("style", "text-anchor: middle;")
      else if options.orientation is 'left'
        label.attr("x", "-#{chartController.innerHeight() / 2}")
          .attr("y", "#{-chartController.margin.left + 18}")
          .attr("style", "text-anchor: middle;")
          .attr("transform", "rotate(-90)")
      else if options.orientation is 'right'
        label.attr("x", "#{chartController.innerHeight() / 2}")
          .attr("dy", "#{-chartController.margin.right + 18}")
          .attr("style", "text-anchor: middle;")
          .attr("transform", "rotate(90)")

    drawGrid = (grid) ->
      if options.orientation is 'bottom'
        grid.call(getAxis().tickSize(chartController.innerHeight(), 0, 0)
          .tickFormat('')
        )
      else if options.orientation is 'top'
        grid.attr("transform", "translate(0, #{chartController.innerHeight()})")
          .call(getAxis().tickSize(chartController.innerHeight(), 0, 0)
          .tickFormat('')
        )
      else if options.orientation is 'left'
        grid.attr("transform", "translate(#{chartController.innerWidth()}, 0)")
          .call(getAxis().tickSize(chartController.innerWidth(), 0, 0)
          .tickFormat('')
        )
      else if options.orientation is 'right'
        grid.call(getAxis().tickSize(chartController.innerWidth(), 0, 0)
          .tickFormat('')
        )

    # Append x-axis to chart
    axisElement = chartController.getChart().append("g")
      .attr("class", "axis axis-#{options.orientation} axis-#{options.name}")
      .attr("transform", translation())

    if options.label
      label = axisElement.append("text").attr("class", "axis-label").text(options.label)

    if options.grid
      grid = chartController.getChart().append("g")
        .attr("class", "axis-grid axis-grid-#{options.name}")

    redraw = (data) ->
      return unless data? and data.length isnt 0
      scale.range(range())
      positionLabel(label.transition().duration(500)) if label
      if options.filter
        domainValues = $scope.$eval("#{options.filter}(data)", { data: data })
      else
        domainValues = (datum[options.name] for datum in data)
      if options.extent
        scale.domain d3.extent domainValues
      else if options.domain
        scale.domain [0, d3.max domainValues]
      else
        scale.domain [0, d3.max domainValues]
      axisElement.transition().duration(500)
        .attr("transform", translation())
        .call(getAxis())
      drawGrid(grid.transition().duration(500)) if grid?

    chartController.addScale(options.name, { scale: scale, redraw: redraw })
    $scope.$watch options.tickValues, chartController.redraw, true if options.tickValues?
