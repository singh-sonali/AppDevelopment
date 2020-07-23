// connect to a database using indexedDB
// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
var db;
var request = window.indexedDB.open("MyTestDatabase");
request.oneerror = function(event){
    alert("Database error: " + event.target.errorCode);
};
request.onsuccess = function(event){
    alert("yay");
    db = event.target.result;
};

function lockScreen(){
    screen.orientation.lock('portrait')
}


let cameraTasks = {
    init: function() {
        document.getElementById('btn').addEventListener('click', cameraTasks.takePhoto);
    },
    takePhoto: function() {
        let opts = {
            quality: 80,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            mediaType: Camera.MediaType.PICTURE,
            encodingType: Camera.EncodingType.JPEG,
            cameraDirection: Camera.Direction.BACK,
            targetWidth: 300,
            targetHeight: 400
        };
        navigator.camera.getPicture(cameraTasks.ftw, cameraTasks.wtf, opts);
    },
    ftw: function(imgURI) {
        document.getElementById('msg').textContent = imgURI;
        document.getElementById('photo').src = imgURI;
    }, 
    wtf: function(msg) {
        document.getElementById('msg').textContent = msg;
    }
};

document.addEventListener("deviceready", lockScreen, false)
document.addEventListener("deviceready", cameraTasks.init)



// /*
//  * Licensed to the Apache Software Foundation (ASF) under one
//  * or more contributor license agreements.  See the NOTICE file
//  * distributed with this work for additional information
//  * regarding copyright ownership.  The ASF licenses this file
//  * to you under the Apache License, Version 2.0 (the
//  * "License"); you may not use this file except in compliance
//  * with the License.  You may obtain a copy of the License at
//  *
//  * http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing,
//  * software distributed under the License is distributed on an
//  * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
//  * KIND, either express or implied.  See the License for the
//  * specific language governing permissions and limitations
//  * under the License.
//  */

// //***JQUERY STUFF
// $(document).ready(function(){
//     $('#submitfood').click(function(){
//         var mood = $('input[name="mood"]:checked').val();
//         var fooddescription = $('#fooddescription').val();
//         $('#foodresult').html(fooddescription)
//         console.log(fooddescription)
//         console.log(mood)
        
        
//     })
//     var myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db",location:'default'});
//     myDB.transaction(function(transaction){
//         transaction.executeSql('CREATE TABLE IF NOT EXISTS foodlog (id integer primary key, picture text, mood text, descr text', [],
//             function(tx, result){
//                 alert("Table created successfully");
//             },
//             function(error){
//                 alert("error occurred while creating the table.");
//             });
// });
// });


// let screenTasks = {
//     init: function() {
//         screen.orientation.lock('portrait');
//     }
// };


// var app = {
//     // Application Constructor
//     initialize: function() {
//         document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
//         document.addEventListener('deviceready', screenTasks.init);
//     },

//     // deviceready Event Handler
//     //
//     // Bind any cordova events here. Common events are:
//     // 'pause', 'resume', etc.
//     onDeviceReady: function() {
//         this.receivedEvent('deviceready');
//     },

//     // Update DOM on a Received Event
//     receivedEvent: function(id) {
//         var parentElement = document.getElementById(id);
//         var listeningElement = parentElement.querySelector('.listening');
//         var receivedElement = parentElement.querySelector('.received');

//         listeningElement.setAttribute('style', 'display:none;');
//         receivedElement.setAttribute('style', 'display:block;');

//         console.log('Received Event: ' + id);
//     }
// };

// app.initialize();