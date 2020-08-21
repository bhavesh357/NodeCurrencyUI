//setting the dropdown size
document.getElementById('fromOptions').style.width=document.getElementById('fromDropdown').clientWidth+1+'px';
document.getElementById('toOptions').style.width=document.getElementById('toDropdown').clientWidth+1+'px';

//adding dropdown toggle code
let fromDropdown= $("#fromOptions");
$("#fromDropdown").on("click", () => {
    toDropdown.hide();
    $('#toDropdown').removeClass('green-border');
    fromDropdown.toggle(500);
    $('#fromDropdown').toggleClass('green-border');
});

let toDropdown= $("#toOptions");
$("#toDropdown").on("click", () => {
    fromDropdown.hide();
    $('#fromDropdown').removeClass('green-border');
    toDropdown.toggle(500);
    $('#toDropdown').toggleClass('green-border');
});

// currency-list
let currencyArray;
let currentFormula;

$(document).ready( () => {
    
    const currencyUrl='http://localhost:3000/currency/';
    $.ajax({
        url: currencyUrl,
        type: 'GET',
        success: (result) => {
            currencyArray=result;
            loadDropdowns();
        },
        error: (error) => {
            console.log(error);
        } 
    });
});


function getNewMultiplier(from,to){
    console.log("in multiplier");
    const converterUrl='http://localhost:3000/currency/convert';
    let convertData={
        'currencyOne': from,
        'currencyTwo': to,
    }
    const otherParams={
        headers:{
            "content-type":"application/json; charset=UTF-8"
        },
        body: JSON.stringify(convertData),
        method: "POST"
    };
    fetch(converterUrl,otherParams)
    .then(data => {return data.json()})
    .then(res => {
        console.log(res);
        currentFormula = res.value;
        $('#currencyRate').html(res.value);
        let change= Number((currentFormula-res.previousValue).toFixed(4));
        let currencyChange=$('#currencyChange');
        if(change<0){
            currencyChange.html("<img class='change-icon' src='assets/icons/triangle-down.svg' />"+change*-1);
            currencyChange.addClass('change-negative')
            currencyChange.removeClass('change-positive');
        }else{
            currencyChange.html("<img class='change-icon' src='assets/icons/triangle-up.svg' />"+change);
            currencyChange.addClass('change-positive')
            currencyChange.removeClass('change-negative');
        }
        
    })
    .catch(err => {
        return err
    });
    
}

function loadDropdowns(){
    let dropdown = "";
    for(let i=0;i<currencyArray.length;i++){
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
    let fromDropdown = $('#fromOptions');
    let toDropdown= $('#toOptions');
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
    toSelected.html(toValue+getSelectedHtml(currencyArray[1]));
    loadNewValues();
}

function getSelectedHtml(currency){
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
        $('#fromDropdown').removeClass('green-border');
    }else{
        toSelected.html(toValue+getSelectedHtml(currency));
        $('#toDropdown').removeClass('green-border');
    }
    $("#"+$(el).parent()[0].id).toggle();
    loadNewValues();
}

function findCurrency(name){
    for( let i = 0 ;i<currencyArray.length; i++){
        if(currencyArray[i].shortName===name){
            return currencyArray[i];
        }
    }
}

function loadNewValues(){
    let fromSelectedValue=$(fromSelected.children()[1].children[0]).html().substring(0,3) ;
    let toSelectedValue= $(toSelected.children()[1].children[0]).html().substring(0,3) ;
    getNewMultiplier(fromSelectedValue,toSelectedValue);
}

$('#fromInput').on('input' , () => {
    let value = $('#fromInput').val()*currentFormula;
    if(value>0){
        $('#toInput').val(Number((value).toFixed(4)));
    }else{
        $('#fromInput').val("");
    }
});

$('#toInput').on('input' , () => {
    let value = $('#toInput').val()/currentFormula;
    if(value>0){
        $('#fromInput').val(Number((value).toFixed(4)));
    }else{
        $('#toInput').val("");
    }
});
