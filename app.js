require("dotenv").config();
const instagramPrivateAPI = require("instagram-private-api");
const IG = new instagramPrivateAPI.IgApiClient();
const accounts = require("./constants");

IG.state.generateDevice(process.env.USERNAME);

async function login() {
  console.log("Logging in");
  await IG.simulate.preLoginFlow();
  const loggedInUser = await IG.account.login(
    process.env.USERNAME,
    process.env.PASSWORD
  );
  console.log("User Logged in", loggedInUser);

}



function reFollow() {
  console.log("Refollowing");

  accounts.forEach(async account => {
    console.log("Account ", account);

    const userId = await IG.user.getIdByUsername(account);
    console.log("Account: UserId ", userId);

    await IG.friendship.destroy(userId);
    console.log("Account: Destroyed friendship ", userId);

    IG.friendship.create(userId);
    console.log("Account: Created friendship ", userId);

  });
}

login().then(() => {
  reFollow();
  setInterval(() => {
    reFollow();
  }, 3600000);
});
