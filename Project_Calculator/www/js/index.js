//Source: https://www.sitepoint.com/generating-random-color-values/

$(document).ready(function(){
//--------------------
//BEGIN JQUERY STUFF!
//--------------------
// set initial variables
previous_num = false //indicates whether a number key has previously been pressed; if true, then the user can enter multi-digit numbers
previous_op = false //indicates whether an op has already been inputted by the user, and if the result should display
switch_sign = false //indicates whether the plusminus button has been pressed
numbers = [] //stores inputted numbers 
op = "other" //stores specific operations
entered = 0; //stores number to be displayed on screen
decimal = false //stores whether a decimal has already been pressed
sqrt = false //stores whether the sqrt button has been pressed

//if a number button is pressed... this happens
$('div.number').click(function(){
    //if no previous number has been pressed, then the number pressed displays on the screen
    if (previous_num == false){
        entered = $(this).html();
        previous_num = true
        }

    //if a number key has previously been pressed, then the key the user clicks on will input the next digit of the number on the screen (ex; 2 --> 23)
    else if (previous_num == true){
        entered+=$(this).html();
    }

    //if the plusminus key has previously been pressed, the number on the screen changes sign
    if (switch_sign== true){
        entered = -1*entered
        switch_sign = false
    }

    //if the sqrt button has previously been pressed, the screen will display 0, and allow the user to enter a number, upon which another operator is pressed, will display the sqrt of that number
    if (sqrt == true){
        entered = Math.sqrt(entered)
        entered = entered.toFix(4)
        sqrt = false
    }
    //displays value on screen
    document.getElementById("result").innerHTML = entered;
});

//if an operator button is pressed... this happens
$('div.operator').click(function(){
    //if an operator is pressed, the user may enter decimals again
    decimal = false

    //if no previous operation has occurred, the pressed operation and the first number will be stored and the user may enter another number
    if (previous_op == false) {
        numbers.push(entered)
        previous_num = false;
        previous_op = true;
    }
    //if a previous operator has been pressed, and another one is pressed, then the answer to the previous operation will be computed in "Answer" and displayed
    else {
        if (previous_num == true){
        Answer(numbers, entered, op)
        }
    }

    //sets op variable based on the operator that was pressed
    if ($(this).get(0).id == 'add'){
        op = "add" 
        }
    else if ($(this).get(0).id == 'subtract'){
        op = "subtract"
        }
    else if ($(this).get(0).id == 'multiply'){
        op = "multiply" 
        }
    else if ($(this).get(0).id == 'divide'){
        op = "divide" 
        }
    else{
        op = "other"
    }
    
})

//computes the answer of the previous operation when the next operation has been pressed
function Answer(numbers, entered, op){
    numbers.push(entered)
    //computes answer based on the previous op "op"
    if (op=="add"){
        entered = Number(numbers[0]) + Number(numbers[1])
        }
    else if (op=="subtract"){
        entered = Number(numbers[0]) - Number(numbers[1])
        }
    else if (op=="multiply"){
        entered = Number(numbers[0]) * Number(numbers[1])
        }
    else if (op=="divide"){
        entered = Number(numbers[0]) / Number(numbers[1])
        }
    document.getElementById("result").innerHTML = entered;

    //after answer is computed, list with numbers is emptied and the answer is added as the only value in the list for future calculation
    numbers.length = 0
    numbers.push(entered)
    previous_num = false
    previous_op = true
}

//when the equals button is pressed, the same operations occur as in the "Answer" function, to display the final answer of the inputted operation with the inputted numbers
$('#equals').click(function(){
    entered = Number(entered)
    numbers.push(entered)

    if (op == "add"){
        entered = Number(numbers[0]) + Number(numbers[1])
        }
    else if (op == "subtract"){
        entered = Number(numbers[0]) - Number(numbers[1])
        }
    else if (op == "multiply"){
        entered = Number(numbers[0]) * Number(numbers[1])
        }
    else if (op == "divide"){
        entered = Number(numbers[0]) / Number(numbers[1])
        }
    document.getElementById("result").innerHTML = entered;
    numbers.length = 0;
    op = "other"
    previous_num = false;
    previous_op = false;
})

//when the all clear (AC) button is pressed, all of the variables are reset and the list with the stored numbers inputted by the user is cleared
$('#clear').click(function(){
    document.getElementById("result").innerHTML=0;
    document.getElementById("result").style.color = '#FFFFFF'
    previous_num = false;
    previous_op = false;
    entered = 0;

    numbers.length = 0;
    switch_sign = false;
    op = "other"
    sqrt = false;

});

//if the user clicks the percent button, the number on the screen is divided by 100
$('#percent').click(function(){
    entered = entered/100
    document.getElementById("result").innerHTML = entered;
})

//if the user clicks the plusminus button, the program will either allow you to enter a negative number, or switch the sign of the number already inputted and displayed
$('#plusminus').click(function(){
    if (entered == 0 || previous_op == true && previous_num == false){
        entered = "-";
        switch_sign = true;
    }
    else {
        entered = -1 * entered
    }
    document.getElementById("result").innerHTML = entered;
})

//the sqrt function can be applied before a number is entered, or immediately applied upon a number already entered
$('#sqrt').click(function(){
    if (entered>0){
        entered = Math.sqrt(entered)
        entered = entered.toFixed(4);
        document.getElementById("result").innerHTML = entered;
    }
    if (entered == 0){
        sqrt= true
    }
})

//the log function takes the log (base 10) of the given number on the screen, provided it's greater than 0
$('#log').click(function(){
    if(entered>0){
        entered = Math.log(entered)
        entered = entered.toFixed(4)
        document.getElementById("result").innerHTML = entered;
    }
})

//the e^x function returns e raised to the power of the entered number
$('#ex').click(function(){
    entered = Math.exp(entered)
    entered = entered.toFixed(4)
    document.getElementById("result").innerHTML = entered;
})

//the change color button randomly changes the color of the value shown on the screen. if the all clear button is pressed, the number shown on the screen reverts to the color white.
$('#changecolor').click(function(){
    color = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';

    document.getElementById("result").style.color = color
})

//if the decimal button is clic and a previous decimal has not been entered, the program will add a decimal to the displayed number on the screen, or insert a 0. to create a new number. this button will not do anything if a decimal has already been inserted into the displayed number.
$('#decimal').click(function(){
    if (previous_num == true && decimal == false){
    entered += "."
    decimal = true
        }
    else if (decimal == false) {
        entered = "0."
        decimal = true
        previous_num = true
    }
    document.getElementById("result").innerHTML = entered;
})


//--------------------
//END JQUERY STUFF!
//--------------------

//--------------------
//BEGIN CORDOVA STUFF!
//--------------------
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        screen.orientation.lock('portrait');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
//------------------
//END CORDOVA STUFF!
//------------------

 }); //end JQuery