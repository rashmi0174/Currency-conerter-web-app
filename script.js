// Selecting different controls
var search = document.querySelector(".searchBox");
var convert = document.querySelector(".convert");
var fromCurrency = document.querySelector(".from");
var toCurrency = document.querySelector(".to");
var dateInput = document.querySelector("#date");
var finalValue = document.querySelector(".finalValue");
var finalAmount = document.getElementById("finalAmount");
var resultFrom;
var resultTo;
var searchValue;
var selectedDate;

// Event when currency is changed
fromCurrency.addEventListener('change', (event) => {
    resultFrom = event.target.value;
});

toCurrency.addEventListener('change', (event) => {
    resultTo = event.target.value;
});

dateInput.addEventListener('change', (event) => {
    if (!isValidDateFormat(event.target.value)) {
        alert("Invalid date format. Please enter a date in the format YYYY-MM-DD.");
    }else{
        selectedDate = event.target.value;

    }
});

search.addEventListener('input', updateValue);

function updateValue(e) {
    searchValue = e.target.value;
}

convert.addEventListener("click", getResults);

function getResults() {
    if (!resultFrom || !resultTo) {
        alert("Please select both 'From' and 'To' currencies.");
        return; // Exit the function since currencies are not selected
    }
    if (isNaN(searchValue) || parseFloat(searchValue) <= 0) {
        finalValue.innerHTML = "Please enter a valid amount";
        finalAmount.style.display = "block";
        return; // Exit the function since the amount is invalid
    }

    var apiUrl;

    // Check if selected date is today's date
    if (dateInput.value === formattedDate) {
        // Use different API link for today's date
        apiUrl = "https://api.exchangerate-api.com/v4/latest/EUR";
    } else {
        // Use API link with selected date
        apiUrl = "http://api.exchangeratesapi.io/v1/" + dateInput.value + "?access_key=d9846a6bb95e827676fd0c1a0f88b245&base=EUR";
    }

    // Fetch data from API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayResults(data.rates);
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}
function displayResults(currency) {
    let fromRate = currency[resultFrom];
    let toRate = currency[resultTo];

    if (!fromRate || !toRate) {
        finalValue.innerHTML = "Exchange rate data not available for selected date or currency.";
        finalAmount.style.display = "block";
        return;
    }

    finalValue.innerHTML = ((toRate / fromRate) * searchValue).toFixed(2);
    finalAmount.style.display = "block";
}

function clearVal() { 
    window.location.reload(); 
    document.getElementsByClassName("finalValue").innerHTML = "";
};
// Select the date input element
var dateInput = document.getElementById('date');

// Get today's date
var today = new Date();

// Format the date to YYYY-MM-DD
var yyyy = today.getFullYear();
var mm = String(today.getMonth() + 1).padStart(2, '0');
var dd = String(today.getDate()).padStart(2, '0');
var formattedDate = yyyy + '-' + mm + '-' + dd;

// Set the default value of the date input to today's date
dateInput.value = formattedDate;
function isValidDateFormat(dateString) {
    // Regular expression for YYYY-MM-DD format
    var dateFormat = /^\d{4}-\d{2}-\d{2}$/;
    // Check if the entered date matches the format
    if (!dateFormat.test(dateString)) {
        return false; // Invalid format
    }

    // Extract month from the dateString
    var month = parseInt(dateString.substring(5, 7), 10);
    
    // Check if the month value is within the valid range (1 to 12)
    if (month < 1 || month > 12) {
        return false; // Invalid month
    }

    return true; // Valid format and month
}
