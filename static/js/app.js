var counter = 0;

function getOptions() {


    var selector_make = document.getElementById('make-list-comparison');


    Plotly.d3.json('/makeComparison', function(error, make) {

        console.log(make);

        
        for (var i = 0; i < make.length;  i++) {
            var currentOption = document.createElement('option');
            currentOption.text = make[i];
            currentOption.value = make[i]
            selector_make.appendChild(currentOption);
        }

    })

    var selector_year_comparison = document.getElementById('year-list-comparison');

    Plotly.d3.json('/yearComparison', function(error, years) {

        
        for (var i = 0; i < years.length;  i++) {
            var currentOption = document.createElement('option');
            currentOption.text = years[i];
            currentOption.value = years[i]
            selector_year_comparison.appendChild(currentOption);
        }

    })

    var selector_price = document.getElementById('price-list');


    Plotly.d3.json('/price_bin', function(error, price_bin) {
        

        
        for (var i = 0; i < price_bin.length;  i++) {
            var currentOption = document.createElement('option');
            currentOption.text = price_bin[i];
            currentOption.value = price_bin[i]
            selector_price.appendChild(currentOption);
        }

    })

    var selector_mileage = document.getElementById('mileage-list');

    Plotly.d3.json('/mileage_bin', function(error, mileage_bin) {

        
        for (var i = 0; i < mileage_bin.length;  i++) {
            var currentOption = document.createElement('option');
            currentOption.text = mileage_bin[i];
            currentOption.value = mileage_bin[i]
            selector_mileage.appendChild(currentOption);
        }

    })

    var selector_year = document.getElementById('year-list');

    Plotly.d3.json('/years', function(error, years) {

        
        for (var i = 0; i < years.length;  i++) {
            var currentOption = document.createElement('option');
            currentOption.text = years[i];
            currentOption.value = years[i]
            selector_year.appendChild(currentOption);
        }

    })
}

function updateModel() {

    make = document.getElementById('make-selected').value;
    console.log(make);

    var selector_model = document.getElementById('model-list-comparison');
    selector_model.innerHTML = '';

    // Use the list of sample names to populate the select options
    Plotly.d3.json(`/${make}/modelComparison`, function(error, model) {

        console.log(model);
        
        for (var i = 0; i < model.length;  i++) {
            var currentOption = document.createElement('option');
            currentOption.text = model[i];
            currentOption.value = model[i]
            selector_model.appendChild(currentOption);
        }
    })
}

function addCar() {

    counter = counter + 1;
    make = document.getElementById('make-selected').value;
    model = document.getElementById('model-selected').value;
    year = document.getElementById('year-selected-comparison').value;

    console.log(make);
    console.log(model);
    console.log(year);

    

    Plotly.d3.json(`/car_by_comparison/${make}/${model}/${year}`, function(error, results) {

        console.log(results);
        var tblBody = document.getElementsByTagName("tbody")[0];

        
        for (var i = 0; i < results.length;  i++) {
            var result = results[i];

            var row = document.createElement('tr');

            var cell = document.createElement("td");
            var cellText = document.createTextNode(counter);
            cell.appendChild(cellText);
            row.appendChild(cell);

            var col_name = ["brand","model","year","cash_price","owning_cost"];

            for (var j =0; j < col_name.length; j++) {
                var cell = document.createElement("td");
                var cellText = document.createTextNode(result[col_name[j]]);
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            tblBody.appendChild(row);
       
        }
        console.log(results[0]);

        if (counter==1) {
            scatterPlot(results[0]);
            linePlot(results[0]);
            barPlot(results[0]);
        } else {
            updateScatterPlot(results[0]);
            updateLinePlot(results[0]);
        };

        

        document.getElementById('make-selected').value = '';
        document.getElementById('model-selected').value = '';
        document.getElementById('year-selected-comparison').value = '';
 
    });


};


function updateSearch() {
    price = document.getElementById('price-selected').value;
    mileage = document.getElementById('mileage-selected').value;
    year = document.getElementById('year-selected').value;

    console.log(price);
    console.log(mileage);
    console.log(year);

    d3.select("#treeChart").selectAll("*").remove();
    treePlot(price, mileage, year);
 
    d3.select("#criteriaScatterChart").selectAll("*").remove();
    criteriaScatterPlot(price, mileage, year);

    Plotly.d3.json(`/car_by_criteria/${price}/${mileage}/${year}`, function(error, results) {

        console.log(results);
        var tblBody = document.getElementsByTagName("tbody")[0];

        var col_name = ["make","model","trim","type","year","mileage","price"];

        
        tblBody.innerHTML = '';

        if (results.length == 0) {
            for (var j =0; j < col_name.length+1; j++) {
                var row = document.createElement('tr');
                var cell = document.createElement("td");
                var cellText = document.createTextNode('no result');
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            tblBody.appendChild(row);
        } else {
            for (var i = 0; i < results.length;  i++) {
                var result = results[i];
    
                var row = document.createElement('tr');
    
                var cell = document.createElement("td");
                var cellText = document.createTextNode(i+1);
                cell.appendChild(cellText);
                row.appendChild(cell);
    
                for (var j =0; j < col_name.length; j++) {
                    var cell = document.createElement("td");
                    var cellText = document.createTextNode(result[col_name[j]]);
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                }
                tblBody.appendChild(row);       
            }

        }

    })

};

function scatterPlot(carData) {
    console.log(carData['cash_price']);
    var trace1 = {
        x: [parseInt(carData['cash_price'])],
        y: [parseInt(carData['owning_cost'])],       
        mode: 'markers',
        type: 'scatter',
        name: carData['year'] + ' ' + carData['brand'] + ' ' + carData['model']
    }; 
    
    var data = [trace1];
    var layout = {
        
        xaxis: {
          title: 'Cash Price',
          titlefont: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        },
        yaxis: {
          title: 'True Cost to Own in 5 years',
          titlefont: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        }
      };
    var scatter = document.getElementById('scatter');
    Plotly.plot(scatter, data, layout);

    scatter.on('plotly_click', function(scatterData) {
        console.log(scatterData);
        
        var trace = scatterData.points[0].data;
        var pointName = trace.name.split(' ');
        var year = pointName[0];
        var make = pointName[1];
        var model = pointName[2];
        console.log(pointName);

        
        updateBarPlot(year,make,model);
        


    });
};

function updateScatterPlot(carData) {
    var scatter = document.getElementById('scatter');
    Plotly.addTraces(scatter, {
        x: [parseInt(carData['cash_price'])],
        y: [parseInt(carData['owning_cost'])],
        name: carData['year'] + ' ' + carData['brand'] + ' ' +  carData['model']
    });
};

function linePlot(carData) {

    var priceList = [];
    var currentPrice = carData['cash_price'];
    priceList.push(currentPrice);
    for (i=0;i<(carData['depreciation'].length-1);i++) {
        currentPrice = currentPrice - carData['depreciation'][i];
        priceList.push(currentPrice);

    }

    var textList = ['0'];
    var depreciationPrice = 0;
    for (i=0;i<(carData['depreciation'].length-1);i++) {
        depreciationPrice += parseInt(carData['depreciation'][i]);
        textList.push((-depreciationPrice/carData['cash_price']*100).toFixed(2).toString()+"%");

    }

    // carData['depreciation'].map(price=>textList.push((-price/carData['cash_price']*100).toFixed(2).toString()+"%"))
    
    
    var trace1 = {
        x: [0,1,2,3,4,5],
        y: priceList,
        mode: 'lines',
        line: {
            width: 3
        },
        text: textList,
        textposition: 'bottom',
        name: carData['year'] + ' ' + carData['brand'] + ' ' + carData['model']
    }; 
    
    var data = [trace1];
    var layout = {
        
        xaxis: {
          title: 'In Years',
          titlefont: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        },
        yaxis: {
          title: 'Car Price after Depreciation ($)',
          titlefont: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        }
      };
    var lineChart = document.getElementById('lineChart');
    Plotly.plot(lineChart, data, layout);
};

function updateLinePlot(carData) {
    var lineChart = document.getElementById('lineChart');
    var priceList = [];
    var currentPrice = carData['cash_price'];
    priceList.push(currentPrice);
    for (i=0;i<(carData['depreciation'].length-1);i++) {
        currentPrice = currentPrice - carData['depreciation'][i];
        priceList.push(currentPrice);

    }
    var textList = ['0'];
    var depreciationPrice = 0;
    for (i=0;i<(carData['depreciation'].length-1);i++) {
        depreciationPrice += parseInt(carData['depreciation'][i]);
        console.log(depreciationPrice);
        textList.push((-depreciationPrice/carData['cash_price']*100).toFixed(2).toString()+"%");

    }
    Plotly.addTraces(lineChart, {
        y: priceList,
        text: textList,
        textposition: 'bottom',
        name: carData['year'] + ' ' + carData['brand'] + ' ' +  carData['model']
    });
};


function barPlot(carData) {
    var trace1 = {
        x: [1,2,3,4,5],
        y: carData['depreciation'].slice(0,5),       
        type: 'bar',
        name: 'depreciation'
    }; 

    var trace2 = {
        x: [1,2,3,4,5],
        y: carData['taxes'].slice(0,5),       
        type: 'bar',
        name: 'taxes'
    }; 

    var trace3 = {
        x: [1,2,3,4,5],
        y: carData['financing'].slice(0,5),       
        type: 'bar',
        name: 'financing'
    }; 

    var trace4 = {
        x: [1,2,3,4,5],
        y: carData['fuel'].slice(0,5),       
        type: 'bar',
        name: 'fuel'
    }; 

    var trace5 = {
        x: [1,2,3,4,5],
        y: carData['insurance'].slice(0,5),       
        type: 'bar',
        name: 'insurance'
    }; 

    var trace6 = {
        x: [1,2,3,4,5],
        y: carData['maintenance'].slice(0,5),       
        type: 'bar',
        name: 'maintenance'
    }; 

    var trace7 = {
        x: [1,2,3,4,5],
        y: carData['repairs'].slice(0,5),       
        type: 'bar',
        name: 'repairs'
    }; 
    
    var data = [trace1, trace2, trace3, trace4, trace5, trace6, trace7];
    var layout = {
        barmode: 'stack',
        title: carData['year'] + ' ' + carData['brand'] + ' ' +  carData['model'],
        xaxis: {
          title: 'In Years',
          titlefont: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        },
        yaxis: {
          title: 'True Cost to Own ($)',
          titlefont: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        }
      };
    var barChart = document.getElementById('barChart');
    Plotly.newPlot(barChart, data, layout);
};

function updateBarPlot(year,make,model) {
    Plotly.d3.json(`/car_by_comparison/${make}/${model}/${year}`, function(error, results) {

        console.log(results[0]);
        var carData = results[0];
            
        var targetPosition = $("#tco").offset().top;
        $("html, body").animate({ scrollTop: targetPosition - 50 },"slow");
      
        barPlot(carData);

    });

};

function treePlot(price, mileage, year) {
        // Set the dimensions and margins of the diagram
    var margin = {top: 20, right: 90, bottom: 30, left: 90},
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#treeChart").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate("
        + margin.left + "," + margin.top + ")");

    var i = 0,
    duration = 750,
    root;

    // declares a tree layout and assigns the size
    var treemap = d3.tree().size([height, width]);

    d3.json(`car_by_criteria_tree/${price}/${mileage}/${year}`,function(error,data){
    if (error) throw error;
    root = d3.hierarchy(data, function(d) { return d.children; });
    root.x0 = height / 2;
    root.y0 = 0;

    function collapse(d) {
        if(d.children) {
            d._children = d.children
            d._children.forEach(collapse)
            d.children = null
        }
    }
    root.children.forEach(collapse);

    update(root);

    })


    function update(source) {

    // Assigns the x and y position for the nodes
    var data = treemap(root);

    // Compute the new tree layout.
    var nodes = data.descendants(),
    links = data.descendants().slice(1);

    // Normalize for fixed-depth.
    nodes.forEach(function(d){ d.y = d.depth * 180});

    // ****************** Nodes section ***************************

    // Update the nodes...
    var node = svg.selectAll('g.node')
    .data(nodes, function(d) {return d.id || (d.id = ++i); });

    // Enter any new modes at the parent's previous position.
    var nodeEnter = node.enter().append('g')
    .attr('class', 'node')
    .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .on('click', click);

    // Add Circle for the nodes
    nodeEnter.append('circle')
    .attr('class', 'node')
    .attr('r', 1e-6)
    .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "#fff";
    });

    // Add labels for the nodes
    nodeEnter.append('text')
    .attr("dy", ".35em")
    .attr("x", function(d) {
        return d.children || d._children ? -13 : 13;
    })
    .attr("text-anchor", function(d) {
        return d.children || d._children ? "end" : "start";
    })
    .text(function(d) { return d.data.name; });

    // UPDATE
    var nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate.transition()
    .duration(duration)
    .attr("transform", function(d) { 
        return "translate(" + d.y + "," + d.x + ")";
    });

    // Update the node attributes and style
    nodeUpdate.select('circle.node')
    .attr('r', 10)
    .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "#fff";
    })
    .attr('cursor', 'pointer');


    // Remove any exiting nodes
    var nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", function(d) {
        return "translate(" + source.y + "," + source.x + ")";
    })
    .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('circle')
    .attr('r', 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select('text')
    .style('fill-opacity', 1e-6);

    // ****************** links section ***************************

    // Update the links...
    var link = svg.selectAll('path.link')
    .data(links, function(d) { return d.id; });

    // Enter any new links at the parent's previous position.
    var linkEnter = link.enter().insert('path', "g")
    .attr("class", "link")
    .attr('d', function(d){
        var o = {x: source.x0, y: source.y0}
        return diagonal(o, o)
    });

    // UPDATE
    var linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate.transition()
    .duration(duration)
    .attr('d', function(d){ return diagonal(d, d.parent) });

    // Remove any exiting links
    var linkExit = link.exit().transition()
    .duration(duration)
    .attr('d', function(d) {
        var o = {x: source.x, y: source.y}
        return diagonal(o, o)
    })
    .remove();

    // Store the old positions for transition.
    nodes.forEach(function(d){
    d.x0 = d.x;
    d.y0 = d.y;
    });

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {

    path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
            ${(s.y + d.y) / 2} ${d.x},
            ${d.y} ${d.x}`

    return path
    }

    // Toggle children on click.
    function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update(d);
    }
    }
}

function criteriaScatterPlot(price, mileage, year) {
    d3.json(`car_by_criteria_scatter/${price}/${mileage}/${year}`,function(error,carData){
        if (error) throw error;
         console.log(carData);
    
    
    
      var chartmargin = { top: 80, right:100, bottom: 50, left:50 };
      chartwidth = 900 - chartmargin.left - chartmargin.right,
      chartheight = 500 - chartmargin.top - chartmargin.bottom;
    
      var tooltip = d3.select("#criteriaScatterChart").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);
    
      var xCar = "Car Price",
          yCar = "TCTO",
          colorCar="car",
          brand = "Model";
    
      var color = d3.scaleOrdinal(d3.schemeCategory10);
    //   var color = d3.scaleOrdinal(["#784a1c", "#007070", "#c70076", "#8f62cc", "#45bdbd", "#e996c8","#7fc97f","#beaed4","#fdc086","#FF6D00","#386cb0","#f0027f","#bf5b17"]);
            
    
      var tool_tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
        return brand + ": " + d.car + "<br>" + xCar + ": $" + d.cash_price + "<br>" + yCar + ": $" + d.true_cost;
        });
    
      var x = d3.scaleLinear()          
            .range([0, chartwidth])
            .nice();
    
    
      var y = d3.scaleLinear()
          .range([chartheight, 0]);
    
      var xAxis = d3.axisBottom(x).ticks(12),
          yAxis = d3.axisLeft(y).ticks(12 * chartheight / chartwidth);
    
      var brush = d3.brush().extent([[0, 0], [chartwidth, chartheight]]).on("end", brushended),
          idleTimeout,
          idleDelay = 750;
    
      var svg = d3.select("#criteriaScatterChart").append("svg")
                  .attr("width", chartwidth + chartmargin.left + chartmargin.right)
                  .attr("height", chartheight + chartmargin.top + chartmargin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + chartmargin.left + "," + chartmargin.top + ")");
                
      
    
      var clip = svg.append("defs").append("svg:clipPath")
          .attr("id", "clip")
          .append("svg:rect")
          .attr("width", chartwidth )
          .attr("height", chartheight )
          .attr("x", 0) 
          .attr("y", 0); 
    
      var xExtent = d3.extent(carData, function (d) { return d.Hicash; });
      var yExtent = d3.extent(carData, function (d) { return d.Hicost; });
      x.domain([-1,1]).nice();
      y.domain([-1,1]).nice();
    
      var scatter = svg.append("g")
          .attr("id", "scatterplot")
          .attr("clip-path", "url(#clip)");
        scatter.append("g")
          .attr("class", "brush")
          .call(brush);
    
      scatter.call(tool_tip);
      var xy= scatter.selectAll(".dot")
          .data(carData)
        .enter().append("circle")
          .attr("class", "dot")
          .attr("r", 4)
          .attr("cx", function (d) { return x(d.Hicash); })
          .attr("cy", function (d) { return y(d.Hicost); })
          .style("fill", function(d) { return color(d[colorCar]); })
          .on("mouseover", tool_tip.show)
          .on("mouseout", tool_tip.hide);
    
      // x axis
      svg.append("g")
        .attr("class", "x_axis")
        .attr('id', "axis--x")
        .attr("transform", "translate(0," + chartheight/2 + ")")
        .call(xAxis);
    
      svg.append("text")
      .style("text-anchor", "end")
          .attr("x", chartwidth)
          .attr("y", chartheight - 8)
      .text("Cash Price");
    
      var legend= svg.selectAll(".legend")
              .data(color.domain())
              .enter().append("g")
              .classed("legend", true)
              .attr("transform", function(d, i) { return "translate(0," + i * 30 + ")"; });
    
          legend.append("circle")
              .attr("r", 3.5)
              .attr("cx", chartwidth + 10)
              .attr("fill", color);
    
          legend.append("text")
              .attr("x", chartwidth + 16)
              .attr("dy", ".35em")
              .attr("font-family", "sans-serif")
               .attr("font-size", 9.5)
              .text(function(d) { return d; });
      // x axis gridlines
      function make_x_gridlines() {   
              return d3.axisBottom(x)
                  .ticks(10)
      }
    

      svg.append("g")
          .attr("class", "y_axis")
          .attr('id', "axis--y")
          .attr("transform", "translate("+chartwidth/2 + ",0)")
          .call(yAxis);
    
      svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "1em")
          .style("text-anchor", "end")
          .text("TCTO");
    
      
    
      function brushended() {
    
          var s = d3.event.selection;
          if (!s) {
              if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
              svg.select("#axis--x").attr("transform", "translate(0," +chartheight/2 + ")");
              svg.select("#axis--y").attr("transform", "translate("+chartwidth/2 + ",0)"); 
              x.domain([-1,1]).nice();
              y.domain([-1,1]).nice();
              
    
          } else {
              
              x.domain([s[0][0], s[1][0]].map(x.invert, x));
              y.domain([s[1][1], s[0][1]].map(y.invert, y));
              if((s[0][0]>(chartwidth/2)) & (s[0][1]<(chartheight/2))){
              svg.select("#axis--x").attr("transform", "translate(0," +chartheight + ")");
              svg.select("#axis--y").attr("transform", "translate("-chartwidth + ",0)");
              }
              else if ((s[0][0]>(chartwidth/2)) & (s[0][1]>(chartheight/2))) {
                  svg.select("#axis--x").attr("transform", "translate(0," -chartheight + ")");
                  svg.select("#axis--y").attr("transform", "translate("-chartwidth + ",0)");
              }
              else if ((s[0][0]<(chartwidth/2)) & (s[0][1]>(chartheight/2))) {
                  svg.select("#axis--x").attr("transform", "translate(0," -chartheight + ")");
                  svg.select("#axis--y").attr("transform", "translate("+chartwidth + ",0)");
              }
              else{
                  svg.select("#axis--x").attr("transform", "translate(0," +chartheight + ")");
                  svg.select("#axis--y").attr("transform", "translate("+chartwidth + ",0)");
              }
            
              scatter.select(".brush").call(brush.move, null);
          }
          
          zoom();
      }
    
      function idled() {
          idleTimeout = null;
      }
    
      function zoom() {
    
          var t = scatter.transition().duration(300);
          svg.select("#axis--x").transition(t).call(xAxis);
          svg.select("#axis--y").transition(t).call(yAxis);
          
          scatter.selectAll("circle").transition(t)
          .attr("cx", function (d) { return x(d.Hicash); })
          .attr("cy", function (d) { return y(d.Hicost); })
          ;
          
          
    
      }
    
    
      });
}


function init() {
    getOptions();
};

// Initialize the dashboard
init();

var x = document.cookie;
console.log(x);





// chart moves to top when clicking the side bar nav
$("#navigation li a").click(function(e) {
    e.preventDefault();
    var targetElement = $(this).attr("href");
    var targetPosition = $(targetElement).offset().top;
    $("html, body").animate({ scrollTop: targetPosition - 50 },"slow");

});