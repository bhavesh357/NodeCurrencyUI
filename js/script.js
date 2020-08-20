//setting the dropdown size
console.log(document.getElementById('fromDropdown').clientWidth);
document.getElementById('fromOptions').style.width=document.getElementById('fromDropdown').clientWidth+1+'px';
document.getElementById('toOptions').style.width=document.getElementById('toDropdown').clientWidth+1+'px';

//adding dropdown toggle code
let fromDropdown= $("#fromOptions");
$("#fromDropdown").on("click", () => {
    fromDropdown.toggle(500);
});

let toDropdown= $("#toOptions");
$("#toDropdown").on("click", () => {
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
        let option = "<div class=\"currency-dropdown-option\">"+
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
}

