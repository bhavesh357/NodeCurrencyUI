


// currency-list
let currencyArray;
let currentFormula;

$(document).ready( () => {
    
    const currencyUrl='http://localhost:3000/currency/';
    $.ajax({
        url: currencyUrl,
        type: 'GET',
        success: (result) => {
            currencyArray=result.data;
            loadDropdowns();
        },
        error: (error) => {
            console.log(error);
        } 
    });
    
    
    
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
    
    //adding dropdown toggle code
    
    let fromDropdown= $("#fromOptions");
    $("#fromDropdown").on("click", () => {
        toDropdown.hide();
        $('#toDropdown').removeClass('green-border');
        fromDropdown.toggle(500);
        $('#fromDropdown').toggleClass('green-border');
        $('#fromArrow').toggleClass('rotated');
    });
    
    let toDropdown= $("#toOptions");
    $("#toDropdown").on("click", () => {
        fromDropdown.hide();
        $('#fromDropdown').removeClass('green-border');
        toDropdown.toggle(500);
        $('#toDropdown').toggleClass('green-border');
        $('#toArrow').toggleClass('rotated');
    });
});


function getNewMultiplier(from,to){
    const converterUrl='http://localhost:3000/currency/convert';
    let convertData={
        'fromCurrency': from,
        'toCurrency': to,
    }
    const otherParams={
        headers:{
            "content-type":"application/json; charset=UTF-8"
        },
        body: JSON.stringify(convertData),
        method: "POST"
    };
    fetch(converterUrl,otherParams)
    .then(data => {return data.json().data})
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

let fromSelected= $('#fromDropdown');
let toSelected= $('#toDropdown');

function loadSelectedCurrency(){
    fromSelected.html(getSelectedHtml(currencyArray[0],"from"));
    toSelected.html(getSelectedHtml(currencyArray[1],"to"));
    loadNewValues();
}

function getSelectedHtml(currency,side){
    let selectedData="<div class=\"currency-direction\">"+side.charAt(0).toUpperCase() + side.slice(1)+"</div>"+
    "<div class=\"currency-detail\">"+
    "<div class=\"currency-name\">"+currency.shortName+" - "+currency.longName+"</div>"+
    "<div class=\"currency-asset\">"+
    "<img src=\"./assets/"+currency.shortName+".png\" class=\"currency-image\"></img>"+
    "<img src=\"./assets/icons/dropdown-arrow.svg\" alt=\"dropdown\" id=\""+side+"Arrow\" class=\"dropdown-arrow\">"+
    "</div></div></div>";
    return selectedData;
}

function selectOption(name, el){
    console.log(name);
    console.log($(el).parent()[0].id);
    let currency = findCurrency(name);
    if($(el).parent()[0].id==='fromOptions'){
        fromSelected.html(getSelectedHtml(currency,"from"));
        $('#fromDropdown').removeClass('green-border');
        $('#fromArrow').removeClass('rotated');
    }else{
        toSelected.html(getSelectedHtml(currency,"to"));
        $('#toDropdown').removeClass('green-border');
        $('#toArrow').toggleClass('rotated');
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

