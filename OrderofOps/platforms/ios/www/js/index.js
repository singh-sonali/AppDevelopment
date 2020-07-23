//OMH: Sonali Singh
//This is the version WITH order of operations. It is my main submission... I believe it should work. Another version without order of ops has also been submitted.
//Source: https://www.sitepoint.com/generating-random-color-values/

$(document).ready(function(){
//--------------------
//BEGIN JQUERY STUFF!
//--------------------
screen.orientation.lock('portrait');
// set initial variables
previous_num = false //indicates whether a number key has previously been pressed; if true, then the user can enter multi-digit numbers
previous_op = false //indicates whether an op has already been inputted by the user, and if the result should display
switch_sign = false //indicates whether the plusminus button has been pressed
numbers = [] //stores inputted numbers 
entered = 0; //stores number to be displayed on screen
decimal = false //stores whether a decimal has already been pressed
sqrt = false //stores whether the sqrt button has been pressed
ops = []
op_clicked = false //makes sure that if user presses multiple operators (provided they are of same function... such as add vs subtract, then the program will retain the most recent operator)


//if a number button is pressed... this happens
$('div.number').click(function(){
    op_clicked = false
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
        entered = entered.toFixed(4)
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
        if (op_clicked == true){
            ops.pop()
            ops.push(($(this).get(0).id))
        }
        else{
        op = ($(this).get(0).id)
        ops.push(op)
        }
        previous_num = false;
        previous_op = true;

    }

    //if a previous operator has been pressed, and another one is pressed, then the program will check to see if it should perform order of operations, and subsequently do so.
    else {
        console.log("here")
        if (previous_num == true){
            numbers.push(entered)
            if (op_clicked == true){
                ops.pop()
                op = op = ($(this).get(0).id)
                ops.push(op)
            }
            else{
            op = ($(this).get(0).id)
            ops.push(op)
            }

            if (op == "add" || op == "subtract"){
                OrderofOps(numbers, ops, entered)
            }
            }
            if (op_clicked == true){
                ops.pop()
                op = op = ($(this).get(0).id)
                ops.push(op)
            }
            previous_num = false
        }
        op_clicked = true
})

//This function completes order of ops.
function OrderofOps(numbers,ops, entered){
    //if there is more than one op in the list, it will perform operations until there is only one left.
    while (ops.length >1){
        n = numbers.length
        o = ops.length
        current_op = ops[o-2]
        previous_op = ops[o-3]

        //each time an operation is performed, the new value is stored in the numbers list and the operation that was performed is removed from the ops list
        if (current_op == "add"){
        numbers[n-2] = Number(numbers[n-2]) + Number(numbers[n-1])
            numbers.pop()
            ops.splice(o-2,1)
            entered = numbers[n-2]
        }
        else if (current_op == "subtract"){
            numbers[n-2] = Number(numbers[n-2]) - Number(numbers[n-1])
            numbers.pop()
            ops.splice(o-2,1)
            entered = numbers[n-2]
        }
        else if (current_op == "multiply" && previous_op !="divide"){
            numbers[n-2] = Number(numbers[n-2]) * Number(numbers[n-1])
            numbers.pop()
            ops.splice(o-2,1)
            entered = numbers[n-2]

        }
        else if (current_op == "divide" && previous_op != "multiply"){
            numbers[n-2]= Number(numbers[n-2])/Number(numbers[n-1])
            numbers.pop()
            ops.splice(o-2,1)
            entered = numbers[n-2]
        }
        else if (current_op == "multiply" && previous_op == "divide"){
            numbers[n-3]=numbers[n-3]/numbers[n-2]
            numbers.splice(n-2,1)
            ops.splice(o-3,1)
        }
        else if (current_op == "divide" && previous_op == "multiply"){
            numbers[n-3]=numbers[n-3]*numbers[n-2]
            numbers.splice(n-2,1)
            ops.splice(o-3,1)
        }
        
        document.getElementById("result").innerHTML = entered;

    }
}
//when the equals button is pressed, the same operations occur as in the "Order of Operations" function, to display the final answer of the inputted operation with the inputted numbers
$('#equals').click(function(){
    entered = Number(entered)
    numbers.push(entered)
    //if there are still multiple ops to be performed, equals is appended to the ops list so that all of the operations can be performed
    if (ops.length>1){
        ops.push("equals")
        OrderofOps(numbers, ops, entered)
    }
    //if there's only one operation to be performed, it is performed and returned. 
    else{
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
    }
    //variables are resest
    numbers.length = 0;
    ops.length = 0;
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
    ops.length = 0;
    switch_sign = false;
    sqrt = false;
    op_clicked = false;

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
window.screen.orientation.lock('portrait-primary');
                  

    
//------------------
//END CORDOVA STUFF!
//------------------

 }); //end JQuery
