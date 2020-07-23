$(document).ready(function(){
//beginning of jQuery


$('.Edit').click(function(){
$('.contact').hide();
$('.specific_contacts').hide();
$('.Edit').hide();
$('form').show();
$('.submit').show();
})



$('.submit').click(function(){
    $('.contact').show();
    $('.specific_contacts').show();
    $('.Edit').show();
    $('form').hide();
    $('.submit').hide();
    var first = $("#first").val();
    var second = $("#second").val();
    var third = $("#third").val();
    var fourth = $("#fourth").val();
    var fifth = $("#fifth").val();
    var sixth = $("#sixth").val();
    var seventh = $("#seventh").val();
    var eighth = $("#eighth").val();
    var ninth = $("#ninth").val();
    var tenth = $("#tenth").val();
    var eleventh = $("#eleventh").val();
    var twelveth = $("#twelveth").val();
    $(".contact1").text(first+" "+second);
    $(".contact2").text(fourth+" "+fifth);
    $(".contact3").text(seventh+" "+eighth);
    $(".contact4").text(tenth+" "+eleventh);
    $(".phone1").text(third);
    $(".phone2").text(sixth);
    $(".phone3").text(ninth);
    $(".phone4").text(twelveth);

});






//end of jQuery
})

//module for database functions
var medDB = (function(){
    var mDB = {};
    var datastore = null;
    //responsible for opening new connection to database
    mDB.open = function(callback){
        //open a connection to the database where 1st parameter is the database and second is the version
        var request = indexedDB.open('medinfo', 3);

        //if something has been modified in structure of database, this is called
        request.onupgradeneeded = function(event){
            //get a reference to the database from the event data and store it in db
            var db = event.target.result;
            event.target.transaction.onerror = mDB.onerror;
            //if the object store exists, delete it
            if (db.objectStoreNames.contains('personal')){
                db.deleteObjectStore('personal');
            }
            //create a new object store called food
            var store = db.createObjectStore('personal',{keyPath: 'timestamp'});
            if (db.objectStoreNames.contains('medical')){
                db.deleteObjectStore('medical');
            }
            //create another new object store called water
            var store2 = db.createObjectStore('medical',{keyPath: 'timestamp'});
        };
        //gets a reference to the database from the event data and uses this to set the datastore value, then executes callback function
        request.onsuccess = function(event){
            datastore = event.target.result;
            callback();
        };
        request.onerror = mDB.onerror;

        //get the foods in the database
        mDB.fetchPersonals = function(callback){
            //set db to the datastore initialized earlier
            var db = datastore;
            //transaction handles interaction with database
            var transaction = db.transaction(['personal'], 'readwrite');

            //get a reference to the food object store and save this reference in ObjStore
            var objStore = transaction.objectStore('personal');

            //specifies the range of items in the object store that you want to retrieve
            var keyRange = IDBKeyRange.lowerBound(0);
            //creates cursor that will be used to cycle through all of the food items in the database
            var cursorRequest = objStore.openCursor(keyRange);

            //array will store food items once fetched from database
            var personalitemlist = [];


            //executes callback functions once all food items have been fetched, passing array as a parameter
            transaction.oncomplete = function(event){
                //execute callback function
                callback(personalitemlist);
            };

            //triggered for each item returned from the database
            cursorRequest.onsuccess = function(event){
                var result = event.target.result;
                //check to see if result contains a food item and if it does, add that to the foods array
                if (!!result == false){
                    return;
                }
                personalitemlist.push(result.value);
                //cursor moves to next item in the database
                result.continue();
            };
            cursorRequest.onerror = mDB.onerror;
        };

        //get the water entries in the database with almost identical code as above
        mDB.fetchMedicals = function(callback){
            var db = datastore;
            var transaction = db.transaction(['medical'],'readwrite');
            var objStore = transaction.objectStore('medical');
            var keyRange = IDBKeyRange.lowerBound(0);
            var cursorRequest = objStore.openCursor(keyRange);
            var medicalitemlist = [];

            transaction.oncomplete = function(event){
                callback(medicalitemlist);
            };
            cursorRequest.onsuccess = function(event){
                var result = event.target.result;
                if (!!result == false){
                    return;
                }
                medicalitemlist.push(result.value);
                result.continue();
            };
            cursorRequest.onerror = mDB.onerror;
        };
    };
    
    //create a new food entry in the database
    mDB.createPersonal = function(name, dob, sex, address, portrait, callback){
        //get a reference to db
        var db = datastore;
        var transaction = db.transaction(['personal'],'readwrite');
        //get the datastore
        var objStore = transaction.objectStore('personal');
        var timestamp = (new Date().toLocaleString());

        //create an object for the food items with all relevant properties
        var personal = {
            'name': name,
            'dob': dob,
            'sex': sex,
            'address': address,
            'portrait': portrait,
            'timestamp': timestamp

        };

        //create the datastore request
        var request = objStore.put(personal);

        request.onsuccess = function(event){
            callback(personal);
            // location.href = "foodlog.html";
        };
        request.onerror = mDB.onerror;
    };

    //create a new water item
    mDB.createMedical = function(blood, conditions, medications, extraneous, callback){
        var db = datastore;
        var transaction = db.transaction(['medical'],'readwrite');
        //get the datastore
        var objStore = transaction.objectStore('medical');

        var timestamp = new Date().toLocaleString();

        //create an object for the water items
        var medical = {
            'blood': blood,
            'conditions': conditions,
            'medications': medications,
            'extraneous': extraneous,
            'timestamp': timestamp
        }
        var request = objStore.put(medical);

        request.onsuccess = function(event){
            callback(medical);
            //location.href = "waterlog.html";
        };
        request.onerror = mDB.onerror;

    };

    
    //takes an id for the item that is to be deleted and a callback function that will be executed if request is successful. id in this case is the timestamp
    mDB.deletePersonal = function(id, callback){
        var db = datastore;
        var transaction = db.transaction(['personal'], 'readwrite');
        var objStore = transaction.objectStore('personal');

        //remove food item from database
        var request = objStore.delete(id);
        request.onsuccess = function(event){
            callback();
        }
        requestonerror = function(event){
            console.log(event);
        }
    };
    //same as above, but for water.
    mDB.deleteMedical = function(id, callback){
        var db = datastore;
        var transaction = db.transaction(['medical'], 'readwrite');
        var objStore = transaction.objectStore('medical');

        var request = objStore.delete(id);
        request.onsuccess = function(event){
            callback();
        }
        requestonerror = function(event){
            console.log(event)
        }
    };
    return mDB;
}());

//"APP.JS CODE"
//this runs when the app is loaded
window.onload = function(){
    console.log(window.location.href)
    //should only get and show food entries when user is adding or seeing food entries
    if (window.location.href.endsWith("personalinfo.html?")||window.location.href.endsWith("personalinfo.html")){
        medDB.open(refreshPersonals);
        
    };
    if(window.location.href.endsWith("medicalinfo.html?")||window.location.href.endsWith("medicalinfo.html")){
        medDB.open(refreshMedicals);
    };


    //setting variables so when food form is submitted, new food entry object can be created in createFood()
    var newPersonalForm = document.getElementById('personalinfoform');
    var nameinput = document.getElementById('fullname');
    console.log(name, name.value)
    var dobinput = document.getElementById('dob');
    var sexinput = document.getElementById('sex');
    var addressinput = document.getElementById('address');
    var portraitinput = document.getElementById('portrait');
    if(window.location.href.endsWith("personalinfo.html?")||window.location.href.endsWith("personalinfo.html")){
    newPersonalForm.onsubmit = function(){
        var name = nameinput.value;
        var dob = dobinput.value;
        var sex = sexinput.value;
        var address = addressinput.value;
        var portrait = portraitinput.value;
        $('#personalinfoform').hide()
        // var msg = document.getElementById('msg').textContent
        // var emptyTest = $('#msg').is(':empty')
        // if (emptyTest == true){
        //     var photoloc = " ";
        // }
        // else{
        //     var photoloc = msg;
        // }

    //check to make sure text is not just blank
    // if (text.replace(/ /g,'') !=''){
        medDB.createPersonal(name, dob, sex, address, portrait, function(personal){
            refreshPersonals();
        });
    // }
    return false;

    
    }
    };
    
    // same code as above, but for water entries on waterlog page
    var newMedicalForm = document.getElementById('medicalinfoform');
    var bloodinput = document.getElementById('bloodtype');
    var conditionsinput = document.getElementById('conditions');
    var medicationsinput = document.getElementById('medications');
    var extraneousinput = document.getElementById('extraneous');
    if(window.location.href.endsWith("medicalinfo.html?")||window.location.href.endsWith("medicalinfo.html")){
        newMedicalForm.onsubmit = function(){
            console.log("submitted")
        var blood = bloodinput.value;
        var conditions = conditionsinput.value;
        var medications = medicationsinput.value;
        var extraneous = extraneousinput.value;
        $('#medicalinfoform').hide()
        
        medDB.createMedical(blood, conditions, medications, extraneous, function(medical){
            refreshMedicals();
        
        });
        return false;

    }
    };

//updates database with created items
function refreshPersonals(){
    medDB.fetchPersonals(function(personalitemlist){
        var personalList = document.getElementById("personal-items");
        
        personalList.innerHTML = '';

        for(var i=0; i<personalitemlist.length; i++){
            //read the food items backwards
            var personal = personalitemlist[(personalitemlist.length -1 -i)];

            //create the html elements used to show food entry and set their values

            //entries show up in list
            var li = document.createElement('li');
            // li.setAttribute('class', 'fooditem');

            //each list item is in the form of a div
            var div = document.createElement('div');
            // div.setAttribute('class','foodlogdisplay')

            //each list item has a checkbox that when clicked, deletes list item from database and screen
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox"
            // checkbox.className = "food-checkbox";
            checkbox.setAttribute("data-id", personal.timestamp)
            div.appendChild(checkbox);


            //event listener for checkbox, when checked, deletes element
            checkbox.addEventListener('click', function(event){
                var id = event.target.getAttribute('data-id');
                medDB.deletePersonal(id, refreshPersonals);
            })
            //description holds "food description"
            var name = document.createElement('p');
            name.innerHTML = "Name: " + personal.name
            var dob = document.createElement('p');
            dob.innerHTML = "Date of Birth: " + personal.dob
            var sex = document.createElement('p');
            sex.innerHTML = "Sex: " + personal.sex
            var address = document.createElement('p');
            address.innerHTML = "Address: " + personal.address
            
            div.appendChild(name)
            div.appendChild(dob)
            div.appendChild(sex)
            div.appendChild(address)


            //aTag holds photo data for photo taken by user
            var aTag = document.createElement('img');
            console.log(personal.portrait)
            aTag.setAttribute('src', personal.portrait)
            aTag.setAttribute('alt', 'No Photo Selected')
            div.appendChild(aTag)

            //all elements are added to list and added to div which displays the list
            li.appendChild(div);
            personalList.appendChild(li);
        }
    });
}
//same code as above, but to display water entries
function refreshMedicals(){
    medDB.fetchMedicals(function(medicalitemlist){
        var medicalList = document.getElementById("medical-items");
        
        medicalList.innerHTML = '';

        for(var i=0; i<medicalitemlist.length; i++){
            //read the food items backwards
            var medical = medicalitemlist[(medicalitemlist.length -1 -i)];

            //create the html elements used to show food entry and set their values

            //entries show up in list
            var li = document.createElement('li');
            // li.setAttribute('class', 'fooditem');

            //each list item is in the form of a div
            var div = document.createElement('div');
            // div.setAttribute('class','foodlogdisplay')

            //each list item has a checkbox that when clicked, deletes list item from database and screen
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox"
            // checkbox.className = "food-checkbox";
            checkbox.setAttribute("data-id", medical.timestamp)
            div.appendChild(checkbox);


            //event listener for checkbox, when checked, deletes element
            checkbox.addEventListener('click', function(event){
                var id = event.target.getAttribute('data-id');
                medDB.deleteMedical(id, refreshMedicals);
            })
            //description holds "food description"
            var blood = document.createElement('p');
            blood.innerHTML = "Blood Type: " + medical.blood
            var conditions = document.createElement('p');
            conditions.innerHTML = "Pre-Existing Conditions: " + medical.conditions
            var medications = document.createElement('p');
            medications.innerHTML = "Medications: " + medical.medications
            var extraneous = document.createElement('p');
            extraneous.innerHTML = "Extraneous: " + medical.extraneous
            
            div.appendChild(blood)
            div.appendChild(conditions)
            div.appendChild(medications)
            div.appendChild(extraneous)


            //aTag holds photo data for photo taken by user
            // var aTag = document.createElement('img');
            // console.log(personal.portrait)
            // aTag.setAttribute('src', personal.portrait)
            // aTag.setAttribute('alt', 'No Photo Selected')
            // div.appendChild(aTag)

            //all elements are added to list and added to div which displays the list
            li.appendChild(div);
            medicalList.appendChild(li);
        }
    });
}
//END NEW
$('#editpersonalinfo').click(function(){
    $('#personalinfoform').show()
})
$('#editmedicalinfo').click(function(){
    $('#medicalinfoform').show()
})
};




