//Sonali Singh
//CALCULATOR WITH ORDER OF OPERATIONS

// I tried my best to get order of operations working. I must have worked upwards of 10 hours on this, but there always seemed to be one step missing. It's really disappointing not to be able to figure it out, but that's life – and timed deadlines – I guess. Here's the code with order of operations. Most of it works, but somethings won't.
$(document).ready(function(){
//--------------------
//BEGIN JQUERY STUFF!
//--------------------

//Setting variables
previous_num = false //keeps track of if a number has been entered
previous_op = false //keeps track of if an operation has already been performed
switch_sign = false //keeps track of what sign the entered number is
numbers = [] //stores the numbers entered by the user for calculations
op = "other" //stores the specific type of current op
entered = 0 //stores the number that is to be shown on the screen
decimal = false //stores whether or not a decimal has been entered yet
two_operators = false //stores whether or not order of operations must be performed
val_last_op = "none" //stores specific value of previous operation
val_next_op = "none" //stores specific value of next operation
prev_added = false //stores if two numbers have previously been added or subtracted

//if a number button is clicked on... this happens.
$('div.number').click(function(){
    //if a number hasn't been entered yet, then the number the user enters shows up on the screen
    if (previous_num == false){
        entered = $(this).html();
        previous_num = true
        }

    //if a number has been entered, the user can add more digits. such as make "2" --> "23"
    else if (previous_num == true){
        entered+=$(this).html();
    }

    //if the user has pressed the plusminus sign, the number that they enter will be the opposite sign.
    if (switch_sign== true){
        entered = -1*entered
        switch_sign = false
    }

    prev_added = false

    //every time the variable "entered" is updated, it should be shown on the screen
    document.getElementById("result").innerHTML = entered;
});

//if an operator is clicked... this happens.
$('div.operator').click(function(){
    //if an operator is clicked, the user may enter decimals again
    decimal = false

    //this statment sets the value for the next operator if order of operations must be performed
    if (two_operators == true){
        if ($(this).get(0).id == 'add'){
        val_next_op = "add" 
        }
        else if ($(this).get(0).id == 'subtract'){
        val_next_op = "subtract" 
        }
        else if ($(this).get(0).id == 'multiply'){
        val_next_op = "multiply" 
        }
        else if ($(this).get(0).id == 'divide'){
        val_next_op = "divide"
        }
        else{
        val_next_op = "other"
        }

        //calls upon the arithmetic function to perform an operation based on the operations that have been entered.
        OrderofOps(numbers, entered, op, val_last_op, val_next_op)

        two_operators = false
    }

    //if no operation has yet been entered, this adds the number on the screen to the list and sets the previous_op variable true.
    if (previous_op == false) {
        numbers.push(entered)
        previous_num = false;
        previous_op = true;
        val_last_op = op
    }

    //if the previous_op variable is true, then an operation has already been entered by the user, and should be performed according to order of operations.
    else {
        
        if (previous_num == true){ 
            val_last_op = op  
            if (val_last_op == "multiply" || val_last_op == "divide"){
                OrderofOps(numbers, entered, op, val_last_op, "none")

            }
            else {
            numbers.push(entered)

            if (($(this).get(0).id == 'add' || $(this).get(0).id == 'subtract') && (val_last_op == "add" || val_last_op == "subtract")){
            two_operators = false
            }
            else{
                two_operators = true
            }
            }

            previous_num = false
        }
    }
    if ($(this).get(0).id == 'add'){
        op = "add" //1 corresponds to add
        }
    else if ($(this).get(0).id == 'subtract'){
        op = "subtract" //2 corresponds to subtract
        }
    else if ($(this).get(0).id == 'multiply'){
        op = "multiply" //3 corresponds to multiply
        }
    else if ($(this).get(0).id == 'divide'){
        op = "divide" //4 corresponds to multiply
        }
    else{
        op = "other"
    }
    if ((op == "add" || op == "subtract") && (val_last_op == "add" || val_last_op == "subtract") && prev_added ==false && val_next_op !="add"){
        AddSubtract(numbers, entered, op, val_last_op)
    }

})

function OrderofOps(numbers, entered, op, val_last_op, val_next_op){
    numbers.push(entered)
    if (op=="multiply"  && (val_last_op == "add" || val_last_op == "subtract")){
        numbers[1] = Number(numbers[1]) * Number(numbers[2])
        numbers.length = 2
        entered = numbers[1]
        previous_op = false;
        }
    else if (op=="divide" && (val_last_op == "add" || val_last_op == "subtract")){
        numbers[1] = Number(numbers[1]) / Number(numbers[2])
        numbers.length = 2
        entered = numbers[1]
        previous_op = false;
        }

    if (val_next_op=="add" || val_next_op == "subtract"){
        if (val_last_op == "add"){
        entered = Number(numbers[0]) + Number(numbers[1])
            }
        if (val_last_op == "subtract"){
            entered = Number(numbers[0]) - Number(numbers[1])
        }
        numbers.length=0
        numbers.push(entered)
        two_operators = false
        previous_op = true
        }
    if (val_last_op == "multiply" || val_last_op == "divide"){
        if (val_last_op == "multiply"){
        entered = Number(numbers[0]) * Number(numbers[1])
            }
        if (val_last_op == "divide"){
        entered = Number(numbers[0]) / Number(numbers[1])
        }
        numbers.length = 0
        numbers.push(entered)
        previous_op = true
    }

    
    document.getElementById("result").innerHTML = entered;
    previous_num = false
    
}

function AddSubtract(numbers, entered, op, val_last_op, val_next_op){
    if ((op == "add" || op == "subtract") && (val_last_op == "add" || val_last_op == "subtract")){
        if (val_last_op == "add"){
            entered = Number(numbers[0])+ Number(numbers[1])
        }
        if (val_last_op == "subtract"){
            entered = Number(numbers[0]) - Number(numbers[1])
        }
        numbers.length = 0
        numbers.push(entered)
        previous_op = true;
        prev_added = true;
        }
        document.getElementById("result").innerHTML = entered;
        previous_num = false
}

$('#equals').click(function(){
    entered = Number(entered)
    numbers.push(entered)
    if ((op == "multiply" || op == "divide") && (val_last_op == "add" || val_last_op == "subtract")){
        if (op == "multiply"){
            numbers[1] = Number(numbers[1]) * Number(numbers[2])
        }
        else if (op == "divide"){
            numbers[1] = Number(numbers[1]) / Number(numbers[2])
        }
        if (val_last_op == "add"){
            entered = Number(numbers[0]) + numbers[1]
        }
        else if (val_last_op == "subtract"){
            entered = Number(numbers[0]) - numbers[1]
        }
    }

    if (op == "add"){
        entered = Number(numbers[0]) + Number(numbers[1])
        }
    else if (op == "subtract"){
        entered = Number(numbers[0]) - Number(numbers[1])
        }
    else if (op == "multiply" && (val_last_op != "add" && val_last_op != "subtract")){
        entered = Number(numbers[0]) * Number(numbers[1])
        }
    else if (op == "divide" && (val_last_op != "add" && val_last_op != "subtract")){
        entered = Number(numbers[0]) / Number(numbers[1])
        }
    document.getElementById("result").innerHTML = entered;
    numbers.length = 0;
    op = "other"
    previous_num = false;
    previous_op = false;
    two_operators = false;
})

$('#clear').click(function(){
    document.getElementById("result").innerHTML=0;
    previous_num = false;
    previous_op = false;
    entered = 0;
    numbers.length = 0;
    switch_sign = false;
    op = "other"
    decimal = false
});

$('#percent').click(function(){
    entered = entered/100
    document.getElementById("result").innerHTML = entered;
})

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
//------------------
//END CORDOVA STUFF!
//------------------

 }); //end JQuery