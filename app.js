const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static('public'));

app.get("/", (req, res, next) => {
  res.render("events/index", {
      title: "Reunion",
      time: "April 5th 2022 10am",
      place: "Metro Concordia",
      description: "Reunion for our friend group. There will be multiple activities prepared.",
      price: "0$",
      place: "Metro Concordia",
      imageFile: ""
  }
      // 더미 인포 보내고, events 페이지 ejs 파일 만들고 (카드들). 빨리빨리 하자. 시간 너무 없다.
  );
});

app.listen(3000);
