let requestBtn = $('#request'),
    offerBtn   = $('#offer'),
    imgField   = $('#imageUrl')


imgFieldToggle();

function imgFieldToggle(){
    hideField();
    showField();
}
function hideField(){
    requestBtn.on('click', () =>{
        imgField.val("");
        imgField.css('display', 'none');
    });
}

function showField(){
    offerBtn.on('click', () =>{
        imgField.css('display', 'block');
    });
}