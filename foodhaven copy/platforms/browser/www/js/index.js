// $(document).ready(function(){ 
// connect to a database using indexedDB
// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
//foodid, photoloc, mood, description

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//FROM https://blog.teamtreehouse.com/create-your-own-to-do-app-with-html5-and-indexeddb
//"DATABASE MODULE"
var foodDB = (function(){
    var fDB = {};
    var datastore = null;
    //responsible for opening new connection to database
    fDB.open = function(callback){
        //open a connection to the database where 1st paramter is the database and second is the version
        var request = indexedDB.open('foods', 6);


        request.onupgradeneeded = function(event){
            //get a reference to the database from the event data and store it in db
            var db = event.target.result;
            event.target.transaction.onerror = fDB.onerror;
            //if the object store exists, delete it
            if (db.objectStoreNames.contains('food')){
                db.deleteObjectStore('food');
            }
            //create a new object store called food
            var store = db.createObjectStore('food',{keyPath: 'timestamp'});
            //NEW
            if (db.objectStoreNames.contains('water')){
                db.deleteObjectStore('water');
            }

            var store2 = db.createObjectStore('water',{keyPath: 'timestamp'});
            //END NEW
        };
        //gets a reference to the database from the event data and uses this to set the datastore value, then executes callback function
        request.onsuccess = function(event){
            datastore = event.target.result;
            callback();
        };
        request.onerror = fDB.onerror;

        fDB.fetchFoods = function(callback){
            //set db to the datastore initialized earlier
            var db = datastore;
            //transaction handles interaction with database
            var transaction = db.transaction(['food'], 'readwrite');

            //get a reference to the food object store and save this reference in ObjStore
            var objStore = transaction.objectStore('food');

            //specifies the range of items in the object store that you want to retrieve
            var keyRange = IDBKeyRange.lowerBound(0);
            //creates cursor that will be used to cycle through all of the food items in the database
            var cursorRequest = objStore.openCursor(keyRange);

            //array will store food items once fetched from database
            var fooditemlist = [];


            //executes callback functions once all food items have been fetched, passing array as a parameter
            transaction.oncomplete = function(event){
                //execute callback function
                callback(fooditemlist);
            };

            //triggered for each item returned from the database
            cursorRequest.onsuccess = function(event){
                var result = event.target.result;
                //check to see if result contains a food item and if it does, add that to the foods array
                if (!!result == false){
                    return;
                }
                fooditemlist.push(result.value);
                //cursor moves to next item in the database
                result.continue();
            };
            cursorRequest.onerror = fDB.onerror;
        };

        fDB.fetchWaters = function(callback){
            var db = datastore;
            var transaction = db.transaction(['water'],'readwrite');
            var objStore = transaction.objectStore('water');
            var keyRange = IDBKeyRange.lowerBound(0);
            var cursorRequest = objStore.openCursor(keyRange);
            var wateritemlist = [];

            transaction.oncomplete = function(event){
                callback(wateritemlist);
            };
            cursorRequest.onsuccess = function(event){
                var result = event.target.result;
                if (!!result == false){
                    return;
                }
                wateritemlist.push(result.value);
                result.continue();
            };
            cursorRequest.onerror = fDB.onerror;
        };
    };
    

    fDB.createFood = function(text, mood, photoloc, callback){
        //get a reference to db
        var db = datastore;
        var transaction = db.transaction(['food'],'readwrite');
        //get the datastore
        var objStore = transaction.objectStore('food');
        var timestamp = (new Date().toLocaleString());

        //create an object for the food items
        var food = {
            'text': text,
            'mood': mood,
            'photoloc': photoloc,
            'timestamp': timestamp

        };

        //create the datastore request
        var request = objStore.put(food);

        request.onsuccess = function(event){
            callback(food);
        };
        request.onerror = fDB.onerror;
    };

    //create a new water item
    fDB.createWater = function(text, callback){
        var db = datastore;
        var transaction = db.transaction(['water'],'readwrite');
        //get the datastore
        var objStore = transaction.objectStore('water');

        var timestamp = new Date().toLocaleString();

        //create an object for the water items
        var water = {
            'text': text,
            'timestamp': timestamp
        };
        var request = objStore.put(water);

        request.onsuccess = function(event){
            callback(water);
        };
        request.onerror = fDB.onerror;

    };

    
    //takes an id for the item that is to be deleted and a callback function that will be executed if request is successful
    fDB.deleteFood = function(id, callback){
        var db = datastore;
        var transaction = db.transaction(['food'], 'readwrite');
        var objStore = transaction.objectStore('food');

        //remove food item from database
        var request = objStore.delete(id);
        request.onsuccess = function(event){
            callback();
        }
        requestonerror = function(event){
            console.log(event);
        }
    };

    fDB.deleteWater = function(id, callback){
        var db = datastore;
        var transaction = db.transaction(['water'], 'readwrite');
        var objStore = transaction.objectStore('water');

        var request = objStore.delete(id);
        request.onsuccess = function(event){
            callback();
        }
        requestonerror = function(event){
            console.log(event)
        }
    };
    return fDB;
}());

//"APP.JS CODE"
window.onload = function(){
    
    

    if (window.location.href.endsWith("foodlog.html") || window.location.href.endsWith("addfood.html")){
        foodDB.open(refreshFoods);
    };
    if (window.location.href.endsWith("waterlog.html")|| window.location.href.endsWith("addwater.html")){
        foodDB.open(refreshWaters);
    };
    var newFoodForm = document.getElementById('new-food-form');
    var newFoodInput = document.getElementById('enterfood');

    if (window.location.href.endsWith("addfood.html")){
    newFoodForm.onsubmit = function(){
        var text = newFoodInput.value;
        var mood = $("input[name='mood']:checked").val();
        var msg = document.getElementById('msg').textContent
        var emptyTest = $('#msg').is(':empty')
        if (emptyTest == true){
            var photoloc = " ";
        }
        else{
            var photoloc = msg;
        }

    //check to make sure text is not just blank
    if (text.replace(/ /g,'') !=''){
        foodDB.createFood(text, mood, photoloc, function(food){
            refreshFoods();
        });
    }
    newFoodInput.value = '';
    return false;


    }
    };
    //NEW
    
    var newWaterForm = document.getElementById('new-water-form');
    var newWaterInput = document.getElementById('cups');
    if (window.location.href.endsWith("addwater.html")){
        newWaterForm.onsubmit = function(){
        var text = newWaterInput.value;
        if (text.replace(/ /g,'') !=''){
        foodDB.createWater(text, function(water){
            refreshWaters();
        });
    }
        newWaterInput.value = '';
        return false;
    }
    };
    //END NEW

function refreshFoods(){
    foodDB.fetchFoods(function(fooditemlist){
        var foodList = document.getElementById("food-items");
        foodList.innerHTML = '';

        for(var i=0; i<fooditemlist.length; i++){
            //read the food items backwards
            var food = fooditemlist[(fooditemlist.length -1 -i)];
            var li = document.createElement('li');
            li.setAttribute('class', 'fooditem');
            // li.id = 'food-'
            var div = document.createElement('div');
            div.setAttribute('class','foodlogdisplay')

            var aTag = document.createElement('img');
            aTag.setAttribute('src', food.photoloc)
            aTag.setAttribute('alt', 'No Photo Selected')

            var description = document.createElement('p');
            description.innerHTML = "Description: " + food.text
            description.setAttribute('class', 'foodlistdesc')
            div.appendChild(description)

            var chosenmood = document.createElement('p');
            
            chosenmood.setAttribute('class', '')
            chosenmood.innerHTML = "Mood: " + food.mood
            div.appendChild(chosenmood)
            div.appendChild(aTag)
            li.appendChild(div);

            var checkbox = document.createElement('input');
            checkbox.type = "checkbox"
            checkbox.className = "food-checkbox";
            checkbox.setAttribute("data-id", food.timestamp)
            li.appendChild(checkbox);

            foodList.appendChild(li);

            //event listener for checkbox
            checkbox.addEventListener('click', function(event){
                var id = event.target.getAttribute('data-id');
                foodDB.deleteFood(id, refreshFoods);
            })
        }
    });
}
//NEW
function refreshWaters(){
    foodDB.fetchWaters(function(wateritemlist){
        var waterList = document.getElementById("water-items");
        waterList.innerHTML = '';
        for(var i=0; i<wateritemlist.length; i++){
            //read the food items backwards
            var water = wateritemlist[(wateritemlist.length -1 -i)];
            var li = document.createElement('li');
            li.setAttribute('class', 'wateritem');
            // li.id = 'food-'

            var timestamp = document.createElement('p');
            timestamp.innerHTML = "Timestamp: "+ water.timestamp
            timestamp.setAttribute('class','timestamp')
            li.appendChild(timestamp)

            var description = document.createElement('p');
            description.innerHTML = "Cups: " + water.text
            description.setAttribute('class', 'cups')
            li.appendChild(description)


            var checkbox = document.createElement('input');
            checkbox.type = "checkbox"
            checkbox.className = "food-checkbox";
            checkbox.setAttribute("data-id", water.timestamp)
            li.appendChild(checkbox);

            waterList.appendChild(li);

            checkbox.addEventListener('click', function(event){
                var id = event.target.getAttribute('data-id');
                foodDB.deleteWater(id, refreshWaters);
            })

        }
    });
}
//END NEW
};

var newFoodForm = document.getElementById('new-food-form');
$('#new-food-form').click(function(){
    var moodSelected = $("input[name='mood']:checked").val()


});



//plugin code
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
            destinationType: Camera.DestinationType.NATIVE_URI,
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
        // path = imgURI.replace("assets-library://","cdvfile://localhost/assets-library/");
        document.getElementById('msg').textContent = imgURI;
        document.getElementById('photo').src = imgURI.toInternalURL();
    }, 
    wtf: function(msg) {
        document.getElementById('msg').textContent = msg;
    }
};

document.addEventListener("deviceready", lockScreen, false)
document.addEventListener("deviceready", cameraTasks.init)

$('#launch').click(function(){
    cordova.InAppBrowser.open('https://www.sagedining.com/sites/menu/menu.php?org=choate', '_blank', 'location=no');
})

// });