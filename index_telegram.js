const storagePath = `StorageOfAllPpl\\`; // `C:\\saketdesktop\\PrivateTutering.blog\\StorageOfAllPpl\\`;
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const request = require("request");
const axios = require("axios");
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(storagePath));
const port = 4040;
var token = [];
token[0] = "5232088474:AAHHrA2KbFkHH5VhrOn68QR-rDwxdECLU3o";
const apiUrl = `https://api.telegram.org/bot${token[0]}`;

const myServerUrl = `https://7500-188-247-16-198.ngrok-free.app/`;

const webHook = `${myServerUrl}webhook`;
///////////////////////////////////////////////////////////////////////////////////////////////////
class StorageInfo {
  userName = "";
  telegramId = 0;
  teacherOrNot = false;
  registeringStep = 0;
  searchingStep = 0;
}
class SubjectsAndClasses {
  subject = "";
  classes = "";
}
class TeachersInfo {
  firstName = "";
  lastName = "";
  phoneNumber = "";
  gender = "";
  priceList = [];
  locations = "";
  subjectsAndClasses = [];
  preferencesGenderLocation = ["any", "any"];
  img = "";
  imgId = "";
  telegramId = "";
}
class SearingBox {
  studentGender = "";
  teacherGender = "";
  decidedPlace = "";
  subject = "";
  classes = "";
}
//////////////////////////////////////////////////////////////////////////////////////////////////
app.post("/webhook", async (req, res) => {
  const { message } = req.body;

  fs.readFile(`${storagePath}AllPpl.json`, "utf8", (err, data) => {
    storageInfo = JSON.parse(data);

    pushIfNew(message);

    var userIndex = getUserIndex(message.from.id);

    if (storageInfo[userIndex].registeringStep != 0)
      enteringTeachersInfo(message, userIndex);
    else if (storageInfo[userIndex].searchingStep != 0)
      searchingForListOfTeachers(message, userIndex);
    else randomChat(message, userIndex);

    if (message.from.id == "1140717341") sendMsg(`from m7md : ${message.text}`);
    res.sendStatus(200);
  });
});
app.post("/sendFromSecretWindow", async (req, res) => {
  sendMsg("secret msg sent successfully");
  const receivedFromSecretWindowMsg = req.body;
  console.log(receivedFromSecretWindowMsg);
  sendMsg(receivedFromSecretWindowMsg.text, receivedFromSecretWindowMsg.id);
  res.sendStatus(200);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function searchingForListOfTeachers(message, userIndex) {
  var userSearchingStep = storageInfo[userIndex].searchingStep;
  if (userSearchingStep == 1) {
    if (message.text == "ذكر") {
      fs.readFile(
        `${storagePath}search${message.from.id}.json`,
        "utf8",
        (err, data) => {
          searchingBox = JSON.parse(data);
          searchingBox.studentGender = "M";
          writeFile(searchingBox, `search${message.from.id}`);
        }
      );

      teacherGenderSelecting(message);
      storageInfo[userIndex].searchingStep = 2;
      writeFile(storageInfo, `AllPpl`);
    } else if (message.text == "انثى") {
      fs.readFile(
        `${storagePath}search${message.from.id}.json`,
        "utf8",
        (err, data) => {
          teacherInfoSlot = JSON.parse(data);
          searchingBox.studentGender = "F";
          writeFile(searchingBox, `search${message.from.id}`);
        }
      );

      teacherGenderSelecting(message);
      storageInfo[userIndex].searchingStep = 2;
      writeFile(storageInfo, `AllPpl`);
    } else {
      showButtonMAndF(message);
    }
  } else if (userSearchingStep == 2) {
    if (message.text == "مدرس") {
      fs.readFile(
        `${storagePath}search${message.from.id}.json`,
        "utf8",
        (err, data) => {
          searchingBox = JSON.parse(data);
          searchingBox.teacherGender = "M";
          writeFile(searchingBox, `search${message.from.id}`);
        }
      );

      chooseSubject(message, "اختر المادة");
      storageInfo[userIndex].searchingStep = 3;
      writeFile(storageInfo, `AllPpl`);
    } else if (message.text == "مدرسة") {
      fs.readFile(
        `${storagePath}search${message.from.id}.json`,
        "utf8",
        (err, data) => {
          teacherInfoSlot = JSON.parse(data);
          searchingBox.teacherGender = "F";
          writeFile(searchingBox, `search${message.from.id}`);
        }
      );

      chooseSubject(message, "اختر المادة");
      storageInfo[userIndex].searchingStep = 3;
      writeFile(storageInfo, `AllPpl`);
    } else if (message.text == "لا يهم") {
      fs.readFile(
        `${storagePath}search${message.from.id}.json`,
        "utf8",
        (err, data) => {
          teacherInfoSlot = JSON.parse(data);
          searchingBox.teacherGender = "any";
          writeFile(searchingBox, `search${message.from.id}`);
        }
      );

      chooseSubject(message, "اختر المادة");
      storageInfo[userIndex].searchingStep = 3;
      writeFile(storageInfo, `AllPpl`);
    } else {
      teacherGenderSelecting(message);
    }
  } else if (userSearchingStep == 3) {
    fs.readFile(`${storagePath}Subjects.json`, "utf8", (err, data) => {
      subjectList = JSON.parse(data);
      if (subjectList.includes(message.text)) {
        fs.readFile(
          `${storagePath}search${message.from.id}.json`,
          "utf8",
          (err, data) => {
            searchingBox = JSON.parse(data);
            searchingBox.subject = message.text;
            writeFile(searchingBox, `search${message.from.id}`);
          }
        );
        chooseClasses(message);
        storageInfo[userIndex].searchingStep = 4;
        writeFile(storageInfo, `AllPpl`);
      } else {
        chooseSubject(message, "ادخل احد المواد التالية");
      }
    });
  } else if (userSearchingStep == 4) {
    fs.readFile(`${storagePath}Classes.json`, "utf8", (err, data) => {
      ClassesList = JSON.parse(data);
      if (ClassesList.includes(message.text)) {
        fs.readFile(
          `${storagePath}search${message.from.id}.json`,
          "utf8",
          (err, data) => {
            searchingBox = JSON.parse(data);
            searchingBox.classes = message.text;
            writeFile(searchingBox, `search${message.from.id}`);
          }
        );
        sendMsg("اختر المنطقة", message.from.id);
        storageInfo[userIndex].searchingStep = 5;
        writeFile(storageInfo, `AllPpl`);
      } else {
        chooseClasses(message);
      }
    });
  } else if (userSearchingStep == 5) {
    if (message.text == "الغاء البحث") {
      resetSearching(message,"تم الغاء البحث بنجاح",userIndex);
    } else {
      
      fs.readFile(
        `${storagePath}search${message.from.id}.json`,
        "utf8",
        (err, data) => {
          searchingBox = JSON.parse(data);
          searchingBox.decidedPlace = message.text;
          writeFile(searchingBox, `search${message.from.id}`);
          postTeachers(message,userIndex,searchingBox);
        }
      );
    }
  } else {
    resetSearching(message,"حدث خطأ حاول البحث مجدداً",userIndex)
  }
}
async function enteringTeachersInfo(message, userIndex) {
  var userStep = storageInfo[userIndex].registeringStep;
  if (userStep == 2) {
    if (message.text == "نعم") {
      sendMsg("ما هو لقبك (الكنية)", message.from.id);
      storageInfo[userIndex].registeringStep = 3;
      writeFile(storageInfo, `AllPpl`);
    } else if (message.text == "لا اريد التغيير") {
      sendMsg("ما هو اسمك", message.from.id);
    } else {
      fs.readFile(
        `${storagePath}${message.from.id}.json`,
        "utf8",
        (err, data) => {
          teacherInfoSlot = JSON.parse(data);

          teacherInfoSlot.firstName = message.text; // here

          writeFile(teacherInfoSlot, `${message.from.id}`);
        }
      );

      const replyKeyboard = {
        keyboard: [[{ text: "لا اريد التغيير" }, { text: "نعم" }]],
        resize_keyboard: true,
      };
      await replyToButtonPressed(`هل انت متأكد ؟`, message, replyKeyboard);
    }
  } else if (userStep == 3) {
    if (message.text == "نعم") {
      sendMsg("ما هو رقم الهاتف ؟", message.from.id);
      storageInfo[userIndex].registeringStep = 4;
      writeFile(storageInfo, `AllPpl`);
    } else if (message.text == "لا اريد التغيير") {
      sendMsg("ما هو لقبك", message.from.id);
    } else {
      fs.readFile(
        `${storagePath}${message.from.id}.json`,
        "utf8",
        (err, data) => {
          teacherInfoSlot = JSON.parse(data);

          teacherInfoSlot.lastName = message.text; // here

          writeFile(teacherInfoSlot, `${message.from.id}`);
        }
      );

      const replyKeyboard = {
        keyboard: [[{ text: "لا اريد التغيير" }, { text: "نعم" }]],
        resize_keyboard: true,
      };
      await replyToButtonPressed(`هل انت متأكد ؟`, message, replyKeyboard);
    }
  } else if (userStep == 4) {
    if (message.text == "نعم") {
      showButtonMAndF(message); //hon ymkn error
      storageInfo[userIndex].registeringStep = 5;
      writeFile(storageInfo, `AllPpl`);
    } else if (message.text == "لا اريد التغيير") {
      sendMsg("ما هو رقم الهاتف", message.from.id);
    } else {
      fs.readFile(
        `${storagePath}${message.from.id}.json`,
        "utf8",
        (err, data) => {
          teacherInfoSlot = JSON.parse(data);

          teacherInfoSlot.phoneNumber = message.text; // here

          writeFile(teacherInfoSlot, `${message.from.id}`);
        }
      );

      const replyKeyboard = {
        keyboard: [[{ text: "لا اريد التغيير" }, { text: "نعم" }]],
        resize_keyboard: true,
      };
      await replyToButtonPressed(`هل انت متأكد ؟`, message, replyKeyboard);
    }
  } else if (userStep == 5) {
    if (message.text == "ذكر") {
      fs.readFile(
        `${storagePath}${message.from.id}.json`,
        "utf8",
        (err, data) => {
          teacherInfoSlot = JSON.parse(data);

          teacherInfoSlot.gender = "M"; // here

          writeFile(teacherInfoSlot, `${message.from.id}`);
        }
      );

      sendMsg(
        "ما هو اقل مرتب في الساعة من الممكن ان تأخذه في الساعة",
        message.from.id
      );
      storageInfo[userIndex].registeringStep = 6;
      writeFile(storageInfo, `AllPpl`);
    } else if (message.text == "انثى") {
      fs.readFile(
        `${storagePath}${message.from.id}.json`,
        "utf8",
        (err, data) => {
          teacherInfoSlot = JSON.parse(data);

          teacherInfoSlot.gender = "F"; // here

          writeFile(teacherInfoSlot, `${message.from.id}`);
        }
      );

      sendMsg(
        "ما هو اقل مرتب في الساعة من الممكن ان تأخذه في الساعة",
        message.from.id
      );
      storageInfo[userIndex].registeringStep = 6;
      writeFile(storageInfo, `AllPpl`);
    } else {
      showButtonMAndF(message);
    }
  } else if (userStep == 6) {
    fs.readFile(
      `${storagePath}${message.from.id}.json`,
      "utf8",
      (err, data) => {
        teacherInfoSlot = JSON.parse(data);

        teacherInfoSlot.priceList[0] = message.text;

        writeFile(teacherInfoSlot, `${message.from.id}`);
      }
    );

    storageInfo[userIndex].registeringStep = 7;
    writeFile(storageInfo, `AllPpl`);
    sendMsg(
      "ما هو اعلى مرتب في الساعة من الممكن ان تأخذه في الساعة",
      message.from.id
    );
  } else if (userStep == 7) {
    fs.readFile(
      `${storagePath}${message.from.id}.json`,
      "utf8",
      (err, data) => {
        teacherInfoSlot = JSON.parse(data);

        teacherInfoSlot.priceList[1] = message.text;

        writeFile(teacherInfoSlot, `${message.from.id}`);
      }
    );

    storageInfo[userIndex].registeringStep = 8;
    writeFile(storageInfo, `AllPpl`);
    whoToTeach(message);
  } else if (userStep == 8) {
    if (message.text == "ذكور فقط") {
      fs.readFile(
        `${storagePath}${message.from.id}.json`,
        "utf8",
        (err, data) => {
          teacherInfoSlot = JSON.parse(data);

          teacherInfoSlot.preferencesGenderLocation[0] = "M";

          writeFile(teacherInfoSlot, `${message.from.id}`);
        }
      );

      whereGonnaTeach(message);
      storageInfo[userIndex].registeringStep = 9;
      writeFile(storageInfo, `AllPpl`);
    } else if (message.text == "اناث فقط") {
      fs.readFile(
        `${storagePath}${message.from.id}.json`,
        "utf8",
        (err, data) => {
          teacherInfoSlot = JSON.parse(data);

          teacherInfoSlot.preferencesGenderLocation[0] = "F";

          writeFile(teacherInfoSlot, `${message.from.id}`);
        }
      );

      whereGonnaTeach(message);
      storageInfo[userIndex].registeringStep = 9;
      writeFile(storageInfo, `AllPpl`);
    } else if (message.text == "لا يهم") {
      fs.readFile(
        `${storagePath}${message.from.id}.json`,
        "utf8",
        (err, data) => {
          teacherInfoSlot = JSON.parse(data);

          teacherInfoSlot.preferencesGenderLocation[0] = "any";

          writeFile(teacherInfoSlot, `${message.from.id}`);
        }
      );

      whereGonnaTeach(message);
      storageInfo[userIndex].registeringStep = 9;
      writeFile(storageInfo, `AllPpl`);
    } else {
      whoToTeach(message);
    }
  } else if (userStep == 9) {
    if (message.text == "في منزلي فقط") {
      fs.readFile(
        `${storagePath}${message.from.id}.json`,
        "utf8",
        (err, data) => {
          teacherInfoSlot = JSON.parse(data);

          teacherInfoSlot.preferencesGenderLocation[1] = "my place";

          writeFile(teacherInfoSlot, `${message.from.id}`);
        }
      );

      sendMsg("اين مكان تواجدك", message.from.id);
      storageInfo[userIndex].registeringStep = 10;
      writeFile(storageInfo, `AllPpl`);
    } else if (message.text == "في منزلهم فقط") {
      fs.readFile(
        `${storagePath}${message.from.id}.json`,
        "utf8",
        (err, data) => {
          teacherInfoSlot = JSON.parse(data);

          teacherInfoSlot.preferencesGenderLocation[1] = "their place";

          writeFile(teacherInfoSlot, `${message.from.id}`);
        }
      );

      sendMsg("اين مكان تواجدك", message.from.id);
      storageInfo[userIndex].registeringStep = 10;
      writeFile(storageInfo, `AllPpl`);
    } else if (message.text == "لا يهم") {
      fs.readFile(
        `${storagePath}${message.from.id}.json`,
        "utf8",
        (err, data) => {
          teacherInfoSlot = JSON.parse(data);

          teacherInfoSlot.preferencesGenderLocation[1] = "any";

          writeFile(teacherInfoSlot, `${message.from.id}`);
        }
      );

      sendMsg("اين مكان تواجدك", message.from.id);
      storageInfo[userIndex].registeringStep = 10;
      writeFile(storageInfo, `AllPpl`);
    } else {
      whereGonnaTeach(message);
    }
  } else if (userStep == 10) {
    if (message.text == "نعم") {
      sendMsg("ادخل اسم المنطقة", message.from.id);
    } else if (message.text == "لا") {
      chooseSubject(message, "اختر المادة التي تقوم بتدريسها");
      storageInfo[userIndex].registeringStep = 11;
      writeFile(storageInfo, `AllPpl`);
    } else {
      fs.readFile(
        `${storagePath}${message.from.id}.json`,
        "utf8",
        (err, data) => {
          teacherInfoSlot = JSON.parse(data);

          teacherInfoSlot.locations += message.text + " , ";

          writeFile(teacherInfoSlot, `${message.from.id}`);
        }
      );

      const replyKeyboard = {
        keyboard: [[{ text: "لا" }]],
        resize_keyboard: true,
      };
      await replyToButtonPressed(
        "هل تريد اضافة اماكن اخرى",
        message,
        replyKeyboard
      );
    }
  } else if (userStep == 11) {
    fs.readFile(`${storagePath}Subjects.json`, "utf8", (err, data) => {
      subjectList = JSON.parse(data);

      if (subjectList.includes(message.text) == false) {
        chooseSubject(message, "اختر المادة التي تقوم بتدريسها");
      } else {
        fs.readFile(
          `${storagePath}${message.from.id}.json`,
          "utf8",
          (err, data) => {
            teacherInfoSlot = JSON.parse(data);

            subjectSlot = new SubjectsAndClasses();
            subjectSlot.subject = message.text;
            teacherInfoSlot.subjectsAndClasses.push(subjectSlot);

            writeFile(teacherInfoSlot, `${message.from.id}`);
          }
        );

        storageInfo[userIndex].registeringStep = 12;
        writeFile(storageInfo, `AllPpl`);
        chooseClasses(message);
      }
    });
  } else if (userStep == 12) {
    fs.readFile(`${storagePath}Classes.json`, "utf8", (err, data) => {
      classesList = JSON.parse(data);

      if (classesList.includes(message.text) == false) {
        chooseClasses(message);
      } else {
        fs.readFile(
          `${storagePath}${message.from.id}.json`,
          "utf8",
          (err, data) => {
            teacherInfoSlot = JSON.parse(data);

            teacherInfoSlot.subjectsAndClasses[
              teacherInfoSlot.subjectsAndClasses.length - 1
            ].classes = message.text;

            writeFile(teacherInfoSlot, `${message.from.id}`);
          }
        );

        storageInfo[userIndex].registeringStep = 13;
        writeFile(storageInfo, `AllPpl`);
        addNewSubject(message);
      }
    });
  } else if (userStep == 13) {
    if (message.text == "نعم") {
      chooseSubject(message, "اختر المادة التي تقوم بتدريسها");
      storageInfo[userIndex].registeringStep = 11;
      writeFile(storageInfo, `AllPpl`);
    } else if (message.text == "لا") {
      sendMsg("ارسل صورتك الشخصية", message.from.id);

      storageInfo[userIndex].registeringStep = 14;
      storageInfo[userIndex].teacherOrNot = true;

      writeFile(storageInfo, `AllPpl`);
    } else {
      sendMsg("هل تريد اضافة مادة اخرى", message.from.id);
    }
  } else if (userStep == 14) {
    if (message.photo) {
      saveImage(message);

      sendMsg("تم تسجيل حسابك بنجاح", message.from.id);

      storageInfo[userIndex].registeringStep = 0;

      fs.readFile(
        `${storagePath}${message.from.id}.json`,
        "utf8",
        (err, data) => {
          teacherInfoSlot = JSON.parse(data);

          teacherInfoSlot.img = `Photos/Img${message.from.id}.jpg`;
          teacherInfoSlot.telegramId = message.from.id;

          writeFile(teacherInfoSlot, `${message.from.id}`);
        }
      );

      writeFile(storageInfo, `AllPpl`);
    } else {
      sendMsg("اعد ادخال الصورة على انها صورة وليست كملف", message.from.id);
    }
  } else {
    storageInfo[userIndex].registeringStep = 0;
    writeFile(storageInfo, `AllPpl`);
    sendMsg("حدث خطأ حاول مرة ثانية", message.from.id);
  }
}
async function randomChat(message, userIndex) {
  let whoIsYourFriedJoke = false;

  fs.readFile(`${storagePath}AllPpl.json`, "utf8", async (err, data) => {
    storageInfo = JSON.parse(data);

    if (message.text == "/command1") {
      const replyKeyboard = {
        keyboard: [
          [{ text: "ابحث عن مدرس" }, { text: "انا استاذ" }],
          [{ text: "قل لي من تصاحب اقل لك من انت" }],
        ],
        resize_keyboard: true,
      };
      await replyToButtonPressed("من انت ؟", message, replyKeyboard);
    } else if (message.text == "قل لي من تصاحب اقل لك من انت") {
      sendMsg("من تصاحب", message.from.id);
      whoIsYourFriedJoke = true;
    } else if (
      (message.text == "من انت" || message.text == "من انت ؟") &&
      whoIsYourFriedJoke == true
    ) {
      sendMsg("هاهاها", message.from.id);
      whoIsYourFriedJoke = false;
    } else if (message.text == "انا استاذ") {
      sendMsg("ما هو اسمك", message.from.id);
      storageInfo[userIndex].registeringStep = 2;
      writeFile(storageInfo, `AllPpl`);

      teacherInfoSlot = new TeachersInfo();
      writeFile(teacherInfoSlot, `${message.from.id}`);
    } else if (message.text == "ابحث عن مدرس") {
      storageInfo[userIndex].searchingStep = 1;
      showButtonMAndF(message);
      writeFile(storageInfo, `AllPpl`);

      searchingBox = new SearingBox();
      writeFile(searchingBox, `search${message.from.id}`);
    } else {
      console.log(
        message.text + " " + message.from.id + " " + message.from.first_name
      );
      sendMsg(`انت قلت لي : ${message.text}`, message.from.id);
    }
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
  res.sendFile(
    `C:\\saketdesktop\\PrivateTutering.blog\\PrivateTutoring.html`
  );
});
app.get("/SecretBotChatWindow", (req, res) => {
  res.sendFile(
    `C:\\saketdesktop\\PrivateTutering.blog\\SecretBotChatWindow.html`
  );
  sendMsg("Secret web page opened");
});
app.get("/getTeachers", async (req, res) => {
  sentTeachersFiles = [];
  storageInfo = await readFileAsync(`AllPpl`);
  for (let i = 0; i < storageInfo.length; i++) {
    if (storageInfo[i].teacherOrNot == true) {
      sentTeachersFile = await readFileAsync(`${storageInfo[i].telegramId}`);
      sentTeachersFiles.push(sentTeachersFile);
    }
  }
  sentTeachersFiles = JSON.stringify(sentTeachersFiles);
  res.send(sentTeachersFiles);
});
app.get("/sarob", (req, res) => {
  res.sendFile(`C:\\saketdesktop\\PrivateTutering.blog\\Sarob.html`);
});
///////////////////////////////////////////////////////////////////////////////////////////////
function resetSearching (message,botReply,userIndex) {
  storageInfo[userIndex].searchingStep = 0;
    writeFile(storageInfo, `AllPpl`);
    deleteJsonFile(`search${message.from.id}`);
    sendMsg(botReply, message.from.id);
}
function saveImage(message) {
  const fileId = message.photo[message.photo.length - 1].file_id;
  request(
    {
      url: `https://api.telegram.org/bot${token[0]}/getFile?file_id=${fileId}`,
      method: "GET",
    },
    (error, response, body) => {
      if (error) {
        console.error(error);
      } else {
        const fileData = JSON.parse(body).result;
        const fileUrl = `https://api.telegram.org/file/bot${token[0]}/${fileData.file_path}`;
        request(fileUrl)
          .pipe(fs.createWriteStream(`Photos/Img${message.from.id}.jpg`)) // Save the photo in a specific folder with the file ID as the name
          .on("close", () => {
            console.log("Photo saved successfully!");
          });
      }
    }
  );
}
function A(number) {
  console.log(`${number}`);
}
function readFileAsync(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${storagePath}${fileName}.json`, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (err) {
          reject(err);
        }
      }
    });
  });
}
async function writeFile(varName, fileName) {
  varNameJson = JSON.stringify(varName);
  fs.writeFile(
    `${storagePath}${fileName}.json`,
    varNameJson,
    "utf8",
    (err) => {}
  );
}
function getUserIndex(telegramIdToIp) {
  for (let i = 0; i < storageInfo.length; i++) {
    if (storageInfo[i].telegramId == telegramIdToIp) {
      return i;
    }
  }
  return 0;
}
function sendMsg(Msg, Id) {
  if (Id == null) Id = "1422228851";
  axios.post(`${apiUrl}/sendMessage`, { chat_id: Id, text: Msg });
}
function setWebhook() {
  axios
    .post(`${apiUrl}/setWebhook?url=${webHook}`)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}
async function showButtonMAndF(message) {
  const replyKeyboard = {
    keyboard: [[{ text: "انثى" }, { text: "ذكر" }]],
    resize_keyboard: true,
  };
  await replyToButtonPressed("هل انت ذكر ام انثى ؟", message, replyKeyboard);
}
async function whoToTeach(message) {
  const replyKeyboard = {
    keyboard: [
      [{ text: "اناث فقط" }, { text: "ذكور فقط" }],
      [{ text: "لا يهم" }],
    ],
    resize_keyboard: true,
  };
  await replyToButtonPressed(
    "هل ترغب بتدريس ذكور فقط ام اناث فقط ام لا يهم",
    message,
    replyKeyboard
  );
}
async function teacherGenderSelecting(message) {
  const replyKeyboard = {
    keyboard: [[{ text: "مدرسة" }, { text: "مدرس" }], [{ text: "لا يهم" }]],
    resize_keyboard: true,
  };
  await replyToButtonPressed("هل تريد مدرس ام مدرسة", message, replyKeyboard);
}
async function whereGonnaTeach(message) {
  const replyKeyboard = {
    keyboard: [
      [{ text: "في منزلهم فقط" }, { text: "في منزلي فقط" }],
      [{ text: "لا يهم" }],
    ],
    resize_keyboard: true,
  };
  await replyToButtonPressed(
    "اين ترغب بتدريس الطالب/ة",
    message,
    replyKeyboard
  );
}
async function chooseSubject(message, textStep) {
  fs.readFile(`${storagePath}Subjects.json`, "utf8", async (err, data) => {
    subjectList = JSON.parse(data);
    var KeyBoardRow = [];
    var keyBoard = [];
    for (let j = 0; j < subjectList.length; j++) {
      if (j % 3 == 0) {
        keyBoard.push(KeyBoardRow);
        KeyBoardRow = [];
      }
      KeyBoardRow.push({ text: `${subjectList[j]}` });
    }
    if (KeyBoardRow != []) {
      keyBoard.push(KeyBoardRow);
      KeyBoardRow = [];
    }
    const replyKeyboard = {
      keyboard: keyBoard,
      resize_keyboard: true,
    };
    await replyToButtonPressed(textStep, message, replyKeyboard); // 'اختر المادة التي تقوم بتدريسها'
  });
}
async function chooseClasses(message) {
  fs.readFile(`${storagePath}Classes.json`, "utf8", async (err, data) => {
    classesList = JSON.parse(data);

    var KeyBoardRow = [];
    var keyBoard = [];
    for (let j = 0; j < classesList.length; j++) {
      if (j % 3 == 0) {
        keyBoard.push(KeyBoardRow);
        KeyBoardRow = [];
      }
      KeyBoardRow.push({ text: `${classesList[j]}` });
    }
    if (KeyBoardRow != []) {
      keyBoard.push(KeyBoardRow);
      KeyBoardRow = [];
    }

    const replyKeyboard = {
      keyboard: keyBoard,
      resize_keyboard: true,
    };
    await replyToButtonPressed("اختر المرحلة الدراسية", message, replyKeyboard);
  });
}
async function addNewSubject(message) {
  let subjectCheckerIfNotExist = true;
  for (let i = 0; i < teacherInfoSlot.subjectsAndClasses.length; i++) {
    if (teacherInfoSlot.subjectsAndClasses == subjectSlot) {
      subjectCheckerIfNotExist = false;
    }
  }
  if (subjectCheckerIfNotExist == true) {
    teacherInfoSlot.subjectsAndClasses.push(subjectSlot);
    subjectSlot = new SubjectsAndClasses();
  } else {
    subjectSlot = new SubjectsAndClasses();
    subjectCheckerIfNotExist = true;
  }

  const replyKeyboard = {
    keyboard: [[{ text: "لا" }, { text: "نعم" }]],
    resize_keyboard: true,
  };
  await replyToButtonPressed("هل تريد اضافة مادة اخرى", message, replyKeyboard);
}
function pushIfNew(message) {
  let pplChecker = true;
  for (let i = 0; i < storageInfo.length; i++) {
    if (storageInfo[i].telegramId == message.from.id) {
      pplChecker = false;
    }
  }
  if (pplChecker == true) {
    newOne = new StorageInfo();
    newOne.userName = message.chat.username;
    newOne.telegramId = message.from.id;
    storageInfo.push(newOne);
    updatePplJsonFile();
  } else {
    pplChecker = true;
  }
}
function updatePplJsonFile() {
  var storageInfoJson = JSON.stringify(storageInfo);
  fs.writeFile(
    `${storagePath}AllPpl.json`,
    storageInfoJson,
    "utf8",
    (err) => {}
  );
}
function replyToButtonPressed(messageReplyed, message, replyKeyboard) {
  axios.post(`${apiUrl}/sendMessage`, {
    chat_id: message.chat.id,
    text: `${messageReplyed}`,
    reply_markup: JSON.stringify(replyKeyboard),
  });
}
function deleteJsonFile(filePath) {
  fs.unlink(`${storagePath}${filePath}.json`, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}
function postTeachers(message,userIndex,searchingBox) {
  
      for (let i = 0; i < storageInfo.length; i++) {
        
        if (storageInfo[i].teacherOrNot == true) {
          fs.readFile(
            `${storagePath}${storageInfo[i].telegramId}.json`,
            "utf8",
            (err, data) => {
              teacherInfoSlot = JSON.parse(data);
              
              if (
                searchingBox.studentGender ==
                  teacherInfoSlot.preferencesGenderLocation[0] ||
                teacherInfoSlot.preferencesGenderLocation[0] == "any"
              ) {
                
                if (
                  searchingBox.teacherGender == teacherInfoSlot.gender ||
                  searchingBox.teacherGender == "any"
                ) {
                  
                  if (
                    teacherInfoSlot.locations.includes(
                      searchingBox.decidedPlace
                    ) == true
                  ) { 
                    
                    if (
                      getSubjectVerification(searchingBox, teacherInfoSlot) ==
                      true
                    ) {
                      
                      sendMsg(
                        `@${storageInfo[i].userName} ${teacherInfoSlot.phoneNumber} ${teacherInfoSlot.firstName} ${teacherInfoSlot.lastName} , ${teacherInfoSlot.priceList[0]} - ${teacherInfoSlot.priceList[1]} ليرة سورية`,
                        message.from.id
                      );
                      sendMsg(``, message.from.id);                 
                      storageInfo[userIndex].searchingStep = 0;
                      writeFile(storageInfo, `AllPpl`);
                    }
                  }
                }
              } 
              if (i == storageInfo.length - 1) {
                
                if (storageInfo[userIndex].searchingStep == 5) {
                  sendMsg("لا توجد نتائج للبحث اكتب اسم منطقة اخرى",message.from.id);
                } else {
                  
                  resetSearching(message,'شكرا لاستخدامكم بوت الدروس الخصوصية',userIndex);
                }
              }
            }
          );
        }
      }
}
function getSubjectVerification(studentJson, teacherJson) {
  for (let i = 0; i < teacherJson.subjectsAndClasses.length; i++) {
    if (teacherJson.subjectsAndClasses[i].subject == studentJson.subject) {
      if (teacherJson.subjectsAndClasses[i].classes == studentJson.classes) {
        return true;
      }
    }
  }
  return false;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  sendMsg("Starting");
  setWebhook();
  writeFile(myServerUrl, `myServerUrl`);
});
