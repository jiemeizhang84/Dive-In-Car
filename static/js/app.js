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
    
    var trace1 = {
        x: [0,1,2,3,4,5],
        y: priceList,
        mode: 'lines',
        line: {
            width: 3
        },
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
    Plotly.addTraces(lineChart, {
        y: priceList,
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
    Plotly.plot(barChart, data, layout);
};

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