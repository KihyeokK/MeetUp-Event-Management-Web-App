exports.get404error = (req, res, next) => {
  res.status(404).render("errors/404error", {
    pageTitle: "404 error",
  });
};

exports.get500error = (req, res, next) => {
  res.status(500).render("errors/500error", {
    pageTitle: "500 error",
  });
};
