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
            var cellText = document.createTextNode(i);
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
        } else {
            updateScatterPlot(results[0]);
        }

        

        
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
        type: 'scatter'
    }; 
    
    var data = [trace1];
    var scatter = document.getElementById('myChart');
    Plotly.plot(scatter, data);
};

function updateScatterPlot(carData) {
    var scatter = document.getElementById('myChart');
    Plotly.addTraces(scatter, {
        x: [parseInt(carData['cash_price'])],
        y: [parseInt(carData['owning_cost'])]});
}

function init() {
    getOptions();
};

// Initialize the dashboard
init();





// chart moves to top when clicking the side bar nav
$("#navigation li a").click(function(e) {
    e.preventDefault();
    var targetElement = $(this).attr("href");
    var targetPosition = $(targetElement).offset().top;
    $("html, body").animate({ scrollTop: targetPosition - 50 },"slow");

});