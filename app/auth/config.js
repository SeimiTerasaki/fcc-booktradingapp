var ids = {
  github: {
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_KEY,
    callbackURL: "https://booktrading-club-sterasaki.c9users.io/auth/github/callback"
  },
  facebook: {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "https://booktrading-club-sterasaki.c9users.io/auth/github/callback"
  },
};

module.exports = ids;