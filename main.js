"use strict";


let list = document.querySelector('#todo-list'),
form = document.querySelector('#submit-form'),
input = document.querySelector('#input');


readContent();
let hei;



//read and render items to the list
function readContent() { 
  let req = new XMLHttpRequest(); 
  req.onreadystatechange = () => { 
    if (req.readyState == 4 && req.status == 200 ) { 
      hei = JSON.parse(req.responseText); 

        let output = "";
        for (let index = 0; index < hei.length; index++) {
          output += `<li class="item" onclick="selectItemBox(${index})">${hei[index]}<a id="mobile" href="#" onclick="openMenu(${index})"></a><i id="delete${index}" class="delete fas fa-trash" onclick="deleteItem(${index})"></i><i id="edit${index}" class="edit fas fa-user-edit" onclick="editItem(${index})"></i><i id="info${index}"class="info fas fa-info-circle" onclick="infoItem(${index})"></i></li>`;
        }
        list.innerHTML = output;
    } 
  }; 

  req.open("GET", "https://api.jsonbin.io/b/5e5fba7cbaf60366f0e2b400", true); 
  req.setRequestHeader("secret-key", "$2b$10$jsY90PTMAEGKy6aofWRnAOyZLEFC632Eyna6FZHB4Hc3jYGFTajV6"); 
  req.send(); 
} 


//add new item to the form, then send it to the server
form.addEventListener("submit", addNewItem, false);
  function addNewItem(e) {
    e.preventDefault();
    let arr = [];
    arr.push(input.value);
    let newArray = [...hei, ...arr];
    

    let formatNewArray = JSON.stringify(newArray);

  let req = new XMLHttpRequest(); 
 req.onreadystatechange = () => { 
   if (req.readyState == XMLHttpRequest.DONE) { 
     input.value = "";
     readContent();
   } 
 }; 

 req.open("PUT", "https://api.jsonbin.io/b/5e5fba7cbaf60366f0e2b400", true); 
 req.setRequestHeader("Content-type", "application/json"); 
 req.setRequestHeader("versioning", "false"); 
 req.setRequestHeader("secret-key", "$2b$10$jsY90PTMAEGKy6aofWRnAOyZLEFC632Eyna6FZHB4Hc3jYGFTajV6"); 
 req.send(formatNewArray); 
}

function deleteItem(index) {
  preventListFunction(index);

  let deletePopup = document.getElementById("delete-popup");
  let yes = document.getElementById("yes");
  let no = document.getElementById("no");

  deletePopup.style.display = "block";

  if(hei.length < 2 && hei[0] === "sample"){
    deletePopup.querySelector("p").innerHTML = "This is sample, please add more before delete.";
    yes.style.display = "none";
    no.innerHTML = "exit";
    no.style.marginLeft = "35%";
    no.addEventListener("click", function() {
      deletePopup.style.display = "none";
      window.location.reload();
    });
  }

  yes.addEventListener("click", function() {
    hei.splice(index,1);
    let uusiArr;
    hei.length === 0 ? uusiArr = JSON.stringify(["Sample"]) : uusiArr = JSON.stringify(hei);
    sendNewBin(uusiArr);
  });
 
  no.addEventListener("click", function() {
    deletePopup.style.display = "none";
  });
}

function editItem(index) {
  preventListFunction(index);
  let editPopup = document.getElementById("edit-popup");
  let oldItem = document.getElementById("old-item");
  let change = document.getElementById("change");
  let cancel = document.getElementById("cancel");

  editPopup.style.display = "block";
  oldItem.value = hei[index];

  change.addEventListener("click", getNewContent);

  function getNewContent() {
    let newContent;
    let newArray;
    newContent = oldItem.value;
    hei[index] = newContent;
    newArray = JSON.stringify(hei);
    sendNewBin(newArray);
  }
  
  cancel.addEventListener("click", function(){
    editPopup.style.display = "none";
    window.location.reload();
  });
}


function infoItem(index) {
  preventListFunction(index);
  let infoPopup = document.getElementById("info-popup");
  let content = document.getElementById("content");
  let createdDate = document.getElementById("created-date");
  let modifidedDate = document.getElementById("modifited-date");
  let exit = document.getElementById("exit");

  content.innerHTML = hei[index];

  infoPopup.style.display = "block";
  exit.addEventListener("click",function(){
    infoPopup.style.display = "none";
  });

}

function sendNewBin(ItemD) {
  console.log(ItemD);
  let req = new XMLHttpRequest(); 
  req.onreadystatechange = () => { 
    if (req.readyState == XMLHttpRequest.DONE) { 
      console.log(req.responseText); 
      readContent();
      window.location.reload();
    } 
  }; 
  
  req.open("PUT", "https://api.jsonbin.io/b/5e5fba7cbaf60366f0e2b400", true); 
  req.setRequestHeader("Content-type", "application/json"); 
  req.setRequestHeader("versioning", "false"); 
  req.setRequestHeader("secret-key", "$2b$10$jsY90PTMAEGKy6aofWRnAOyZLEFC632Eyna6FZHB4Hc3jYGFTajV6"); 
  req.send(ItemD); 
}

















function preventListFunction (index) {
  list.removeEventListener("click", chooseItem);
  list.querySelectorAll("li")[index].onclick = null;
}

function getCurrentDateTime () {
  let currentTime = new Date();
  return currentTime.toString();
}


//select all and delete

list.addEventListener('click', chooseItem ,false);
function chooseItem(e) {
  let t = e.target;
  if(t.classList.contains('checked')){
    t.classList.remove('checked');
  } else {
    t.classList.add('checked');
  }
}

let deleteArray = [];
let filtedArray = [];
let mangLucSau = [];

let selectedAllPersons = document.getElementById("delete-box");
let selectedAllStudents = document.getElementById("delete-all-item");
let counterDelete = document.getElementById("delete-counter");

selectedAllStudents.addEventListener("click", function() {
    deteteSelectedStudents();
});

function selectItemBox(index) {
  mangLucSau = [];
  deleteArray.indexOf(index) === -1 ? deleteArray[index] = index : deleteArray[index] = undefined;
  
  filtedArray = deleteArray.filter(item => typeof item === "number");
  
  filtedArray.length > 9 ? counterDelete.innerText = filtedArray.length : counterDelete.innerText = "0" + filtedArray.length;

  filtedArray.length < 1 ? selectedAllPersons.style.display = "none" : selectedAllPersons.style.display = "block";

  filtedArray.length < 1 ? document.getElementById("select-all").innerHTML = `Check all ${hei.length} items` : document.getElementById("select-all").innerHTML = `Checked ${filtedArray.length} items`;

  if(filtedArray.length < 1){
    document.getElementById("select-all").classList.remove('select-checked');
  }

  for (let i = 0; i < hei.length; i++) {
    if(typeof deleteArray[i] !== "number"){
      mangLucSau.push(hei[i]);
    }      
  }  
  console.log(mangLucSau);
}

function deteteSelectedStudents () {
  
  let newArray;
  mangLucSau.length === 0 ? newArray = JSON.stringify(["Sample"]) : newArray = JSON.stringify(mangLucSau);
  sendNewBin(newArray);
}


let selectAll = document.getElementById("select-all");
selectAll.addEventListener('click', chooseAll ,false);

function chooseAll() {

  document.getElementById("select-all").innerHTML = `Check all ${hei.length} items`;
 
  if(this.classList.contains('select-checked')){
    this.classList.remove('select-checked');
    this.innerHTML = `Check all ${hei.length} items`;
    for (let index = 0; index < hei.length; index++) {
      list.querySelectorAll("li")[index].classList.remove("checked");
    }
    
    deleteArray = [];
    deleteArray.length < 1 ? selectedAllPersons.style.display = "none" : selectedAllPersons.style.display = "block";


  } else {
    this.classList.add('select-checked');
    this.innerHTML = `Uncheck ${hei.length} items`;
    for (let index = 0; index < hei.length; index++) {
      list.querySelectorAll("li")[index].classList.add("checked");
      deleteArray[index] = index;
      deleteArray.length < 1 ? selectedAllPersons.style.display = "none" : selectedAllPersons.style.display = "block";
      deleteArray.length > 9 ? counterDelete.innerText = deleteArray.length : counterDelete.innerText = "0" + deleteArray.length;
      filtedArray = deleteArray;
  
    }
    
  }
}




//open 3 dots menu box


let mobile = document.getElementById("mobile");
let mobileMenu = document.getElementById("mobile-menu");
let exitBtn = mobileMenu.querySelector("#exit");
let saveBtn = mobileMenu.querySelector("#save");
let inputValues = document.getElementById("mobile-change-input");
let content = document.getElementById("mobile-content");
let createdDate = document.getElementById("mobile-created-date");
let modifidedDate = document.getElementById("mobile-modify-date");

function openMenu(index) {
  list.querySelectorAll("li")[index].onclick = null;
  mobileMenu.style.display = "block";

  content.innerHTML = todoList.data[index];
  createdDate.innerHTML = "Created date : " + dateTime.currentTime[index];

  typeof dateTime.modifiedTime[index] !== "string" ? modifidedDate.innerHTML = "Modifided date : not yet modify" : modifidedDate.innerHTML = "Modifided date : " + dateTime.modifiedTime[index];

  inputValues.value = todoList.data[index];

  saveBtn.addEventListener("click", function() {
    let newContent = inputValues.value;
    todoList.edit(index, newContent);
    todoList.save();
    let modifyedTime = getCurrentDateTime();
    dateTime.addM(index,modifyedTime);
    dateTime.saveM();
    window.location.reload();
  });
}

exitBtn.addEventListener("click", function() {
  mobileMenu.style.display = "none";
  window.location.reload();
});

