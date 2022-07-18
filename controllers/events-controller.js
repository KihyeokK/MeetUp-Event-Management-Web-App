exports.getEvents = (req, res, next) => {
    res.render("events/index", {
        title: "Reunion",
        time: "April 5th 2022 10am",
        place: "Metro Concordia",
        description: "Reunion for our friend group. There will be multiple activities prepared.",
        price: "0$",
        place: "Metro Concordia",
        imageFile: ""
    });
  }