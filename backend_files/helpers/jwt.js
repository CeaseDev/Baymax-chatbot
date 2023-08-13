require("dotenv/config");
const expressJwt = require("express-jwt");
const api = process.env.API_URL;
function authJwt() {
  const secret = process.env.secret;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      //USER CAN SEE QUESTIONS & USER CAN GET REGISTERED WITHOUT LOGGING IN INTO ADMIN PANEL
      { url: /questions(.*)/, methods: ["GET"] },
      // `adminpanel/login`,
      { url: /admin(.*)/ },
      { url: /users(.*)/, methods: ["POST"] },
    ],
  });
}

//USED TO CHECK ADMIN PREVILAGE
async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  }

  done();
}

module.exports = authJwt;
