/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

$(document).ready(function(){
//--------------------
//BEGIN JQUERY STUFF!
//--------------------
previous_num = false
previous_op = false
switch_sign = false
numbers = []
op = "other"
entered = 0;
decimal = false


$('div.number').click(function(){
    console.log("number", entered)
    if (previous_num == false){
        entered = $(this).html();
        previous_num = true
        }
    else if (previous_num == true){
        entered+=$(this).html();
    }
    if (switch_sign== true){
        entered = -1*entered
        switch_sign = false
    }
    document.getElementById("result").innerHTML = entered;
});
$('div.operator').click(function(){
    decimal = false
    if (previous_op == false) {
        numbers.push(entered)
        previous_num = false;
        previous_op = true;
    }
    else {
        if (previous_num == true){
        Answer(numbers, entered, op)
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
    
})

function Answer(numbers, entered, op){
    numbers.push(entered)
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
    numbers.length = 0
    numbers.push(entered)
    previous_num = false
    previous_op = true
}

$('#equals').click(function(){
    entered = Number(entered)
    numbers.push(entered)
    console.log(numbers)

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
    console.log("this is",numbers)
})

$('#clear').click(function(){
    document.getElementById("result").innerHTML=0;
    previous_num = false;
    previous_op = false;
    entered = 0;
    numbers.length = 0;
    switch_sign = false;
    op = "other"
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
    console.log(entered)
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