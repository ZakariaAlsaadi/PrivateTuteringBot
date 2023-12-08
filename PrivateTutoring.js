var myUrl = window.location.href;

class TeachersList {
    name = "";
   
    phoneNumber = "";
}

var teachersList = [];
searchingLocation = "";
receivedTeachersList = [];


document.getElementById(`teachersPage`).innerHTML = `test`;




function renderingTeachers(receivedTeachers) {
    orderTeachers = " ";
    for (let i = 0; i < receivedTeachers.length; i++) {
        if (receivedTeachers[i].locations.toLowerCase().includes(searchingLocation) == true) {
            orderTeachers += `<div class="sonTeacher" onclick="openPhoneNumberWindow(${i+1})"><h2>` +
             receivedTeachers[i].firstName + 
            " " + receivedTeachers[i].lastName + "</h2>" + "<br>" +
            `<img class="teacherImg" src="${receivedTeachers[i].img}">` + "<br>" +
             `<p>` + receivedTeachers[i].priceList[0] + " - " +
              receivedTeachers[i].priceList[1] + " ليرة" + `</p></div>` ;
        }
    }
    document.getElementById('teachersPage').innerHTML = orderTeachers;
}


fetch(`${myUrl}getTeachers`)
.then(data => data.json())
.then(data => {
    receivedTeachersList = data ;
    renderingTeachers(receivedTeachersList);
                })
.catch(error => console.log(error));

            
























function closePhoneNumberWindow () {
    document.getElementById("phoneNumber").style.display = "none" ;
}

function openPhoneNumberWindow (numberOfProduct) {
    document.getElementById("phoneNumber").style.display = "block" ;
    document.getElementById("textingPhoneNUmber").innerHTML = `the Price is $${productsList[numberOfProduct].price}`
}

function toggleCategories () {
    if (document.getElementById("categoriesWindow").style.display == "none")
    document.getElementById("categoriesWindow").style.display = "block";
    else
    document.getElementById("categoriesWindow").style.display = "none";
}

















document.getElementById('searchBox').addEventListener("input" , function () {
   
    searchingLocation = document.getElementById('searchBox').value.toLowerCase() ;
    renderingTeachers(receivedTeachersList);
}
);