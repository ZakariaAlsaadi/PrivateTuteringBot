textMsg = "" ;
IdMsg = "" ;

function sendMsgFromTheBot() {
    textMsg = document.getElementById('textMsg').value;
    IdMsg = document.getElementById('personId').value ;
    document.getElementById('UserID').innerHTML = IdMsg ;
    document.getElementById('textMsg').value = null;
            if (IdMsg == "")
            IdMsg = '1422228851'
        if (textMsg != null)
            tellBotToSend();
}

function tellBotToSend() {
    fetch('/sendFromSecretWindow',{
            method:"POST",

            headers: {
                'Content-Type': 'application/json',
              },

            body:JSON.stringify(
                {
                   text: `${textMsg}`,
                   id: `${IdMsg}`,
                }
            )
    })
            .then(res=>res.json())
            .then(json=>console.log(json))
}
    


document.getElementById('textMsg').addEventListener("keypress" , function (keyboardKey) {
            if (keyboardKey.code == "Enter") {
                sendMsgFromTheBot()
            }
}
);