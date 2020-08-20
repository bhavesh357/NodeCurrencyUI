//setting the dropdown size
console.log(document.getElementById('fromDropdown').clientWidth);
document.getElementById('fromOptions').style.width=document.getElementById('fromDropdown').clientWidth+1+'px';
document.getElementById('toOptions').style.width=document.getElementById('toDropdown').clientWidth+1+'px';

//adding dropdown toggle code
let fromDropdown= $("#fromOptions");
$("#fromDropdown").on("click", () => {
    toDropdown.hide();
    fromDropdown.toggle(500);
});

let toDropdown= $("#toOptions");
$("#toDropdown").on("click", () => {
    fromDropdown.hide();
    toDropdown.toggle(500);
});

// currency-list
let currencyArray;

$(document).ready( () => {
    
    const currencyUrl='http://localhost:3000/currency/';
    $.ajax({
        url: currencyUrl,
        type: 'GET',
        success: (result) => {
            currencyArray=result;
            console.log(currencyArray);
            loadDropdowns();
        },
        error: (error) => {
            console.log(error);
        } 
    })
});

function loadDropdowns(){
    let dropdown = "";
    for(let i=0;i<currencyArray.length;i++){
        console.log(currencyArray[i].shortName);
        let option = "<div class=\"currency-dropdown-option\" onclick=\"selectOption('"+currencyArray[i].shortName+"', this)\" >"+
        "<div class=\"detail\">"+
        "<img src=\"./assets/"+currencyArray[i].shortName+".png\" class=\"currency-image\"></img>"+
        "<div class=\"long-name\">"+currencyArray[i].longName+"</div>"+
        "</div>"+
        "<div class=\"short\">"+
        "<div class=\"short-name\">"+currencyArray[i].shortName+"</div>"+
        "</div>"+
        "</div>";
        dropdown+=option;
    }
    console.log(dropdown);
    let fromDropdown = $('#fromOptions');
    let toDropdown= $('#toOptions');
    console.log(fromDropdown);
    fromDropdown.html(dropdown);
    toDropdown.html(dropdown);
    loadSelectedCurrency();
}

let fromValue ="<div class=\"currency-direction\">From</div>";
let toValue ="<div class=\"currency-direction\">To</div>";
let fromSelected= $('#fromDropdown');
let toSelected= $('#toDropdown');

function loadSelectedCurrency(){
    fromSelected.html(fromValue+getSelectedHtml(currencyArray[0]));
    console.log(getSelectedHtml(currencyArray[0]));
    toSelected.html(toValue+getSelectedHtml(currencyArray[1]));
}

function getSelectedHtml(currency){
    console.log(currency);
    let selectedData="<div class=\"currency-detail\">"+
    "<div class=\"currency-name\">"+currency.shortName+" - "+currency.longName+"</div>"+
    "<div class=\"currency-asset\">"+
    "<img src=\"./assets/"+currency.shortName+".png\" class=\"currency-image\"></img>"+
    "<div class=\"currency-dropdown-arrow\"></div>"+
    "</div></div></div>";
    return selectedData;
}

function selectOption(name, el){
    console.log(name);
    console.log($(el).parent()[0].id);
    let currency = findCurrency(name);
    if($(el).parent()[0].id==='fromOptions'){
        fromSelected.html(fromValue+getSelectedHtml(currency));
    }else{
        toSelected.html(toValue+getSelectedHtml(currency));
    }
    $("#"+$(el).parent()[0].id).toggle();
}

function findCurrency(name){
    for( let i = 0 ;i<currencyArray.length; i++){
        if(currencyArray[i].shortName===name){
            return currencyArray[i];
        }
    }
}

