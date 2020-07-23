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
        var request = indexedDB.open('foods', 3);


        request.onupgradeneeded = function(event){
            //get a reference to the database from the event data and store it in db
            var db = event.target.result;
            event.target.transaction.onerror = fDB.onerror;
            //if the object store exists, delete it
            if (db.objectStoreNames.contains('food')){
                db.deleteObjectStore('food');
            }
            //create a new object store called food
            var store = db.createObjectStore('food',{autoIncrement:true
            });
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
    };
    //create a new food item
    fDB.createFood = function(text, mood, photoloc, callback){
        //get a reference to db
        var db = datastore;
        var transaction = db.transaction(['food'],'readwrite');
        //get the datastore
        var objStore = transaction.objectStore('food');

        //create an object for the food items
        var food = {
            'text': text,
            'mood': mood,
            'photoloc': photoloc
        };

        //create the datastore request
        var request = objStore.put(food);

        request.onsuccess = function(event){
            callback(food);
        };
        request.onerror = fDB.onerror;
    };

    //takes an id for the item that is to be deleted and a callback function that will be executed if request is successful
    fDB.deleteFood = function(id, callback){
        var db = dtastore;
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
    return fDB;
}());

//"APP.JS CODE"
window.onload = function(){

    foodDB.open(refreshFoods);
    var newFoodForm = document.getElementById('new-food-form');
    var newFoodInput = document.getElementById('enterfood');

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


};

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
            foodList.appendChild(li);
        }
    });
}
};

var newFoodForm = document.getElementById('new-food-form');
console.log("hello")
$('#new-food-form').click(function(){
    var moodSelected = $("input[name='mood']:checked").val()
    console.log(moodSelected)


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
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
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
        document.getElementById('photo').src = imgURI;
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