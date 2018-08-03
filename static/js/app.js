var counter = 0;

function getOptions() {


    var selector_make = document.getElementById('make-list-comparison');

    // Use the list of sample names to populate the select options
    Plotly.d3.json('/makeComparison', function(error, make) {

        console.log(make);

        
        for (var i = 0; i < make.length;  i++) {
            var currentOption = document.createElement('option');
            currentOption.text = make[i];
            currentOption.value = make[i]
            selector_make.appendChild(currentOption);
        }

        // getData(sampleNames[0], buildCharts);
    })

    var selector_year_comparison = document.getElementById('year-list-comparison');

    Plotly.d3.json('/yearComparison', function(error, years) {

        
        for (var i = 0; i < years.length;  i++) {
            var currentOption = document.createElement('option');
            currentOption.text = years[i];
            currentOption.value = years[i]
            selector_year_comparison.appendChild(currentOption);
        }

        // getData(sampleNames[0], buildCharts);
    })

    


    // Grab a reference to the dropdown select element
    var selector_price = document.getElementById('price-list');

    // Use the list of sample names to populate the select options
    Plotly.d3.json('/price_bin', function(error, price_bin) {
        

        
        for (var i = 0; i < price_bin.length;  i++) {
            var currentOption = document.createElement('option');
            currentOption.text = price_bin[i];
            currentOption.value = price_bin[i]
            selector_price.appendChild(currentOption);
        }

        // getData(sampleNames[0], buildCharts);
    })

    var selector_mileage = document.getElementById('mileage-list');

    Plotly.d3.json('/mileage_bin', function(error, mileage_bin) {

        
        for (var i = 0; i < mileage_bin.length;  i++) {
            var currentOption = document.createElement('option');
            currentOption.text = mileage_bin[i];
            currentOption.value = mileage_bin[i]
            selector_mileage.appendChild(currentOption);
        }

        // getData(sampleNames[0], buildCharts);
    })

    var selector_year = document.getElementById('year-list');

    Plotly.d3.json('/years', function(error, years) {

        
        for (var i = 0; i < years.length;  i++) {
            var currentOption = document.createElement('option');
            currentOption.text = years[i];
            currentOption.value = years[i]
            selector_year.appendChild(currentOption);
        }

        // getData(sampleNames[0], buildCharts);
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

        // getData(sampleNames[0], buildCharts);
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
        } else {
            updateScatterPlot(results[0]);
            updateLinePlot(results[0]);
        }

        document.getElementById('make-selected').value = '';
        document.getElementById('model-selected').value = '';
        document.getElementById('year-selected-comparison').value = '';
        document.getElementById('make-list-comparison').reset();

        

        
    })

    

    // return price;
}


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

        
        tblBody.innerHTML = '';

        
        for (var i = 0; i < results.length;  i++) {
            var result = results[i];

            var row = document.createElement('tr');

            var cell = document.createElement("td");
            var cellText = document.createTextNode(i);
            cell.appendChild(cellText);
            row.appendChild(cell);

            var col_name = ["make","model","trim","type","year","mileage","price"];

            for (var j =0; j < col_name.length; j++) {
                var cell = document.createElement("td");
                var cellText = document.createTextNode(result[col_name[j]]);
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            tblBody.appendChild(row);
       
        }

        



        // getData(sampleNames[0], buildCharts);
    })

    // return price;
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