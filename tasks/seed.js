const User = require("../server/models/user");
const Software = require("../server/models/software");
const bcrypt = require("bcrypt-nodejs");
const mongoose = require("mongoose");
var dbConfig = require("../server/config/config.js");
var fakeData = require('./data');

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async function () {
    await Software.remove({});
    await User.remove({});
    console.log("All existing data dropped");

    for (item in fakeData.users) {
        var user = getUser(fakeData.users[item]);
        await user.save();
    }
    console.log('users created')

    for (item in fakeData.vendors) {
        var user = getUser(fakeData.vendors[item]);
        await user.save();
    }
    console.log("vendors created")

    for (item in fakeData.softwares) {
        var software = getSoftware(fakeData.softwares[item]);
        await software.save();
    }

    console.log("softwares created")
    console.log("Bye!!!")
    process.exit(0);
}).catch((err) => console.log(err));


function getUser(data, index) {
    var user = new User(data);
    user.local.password = bcrypt.hashSync(data.local.password,
        bcrypt.genSaltSync(8), null);

    return user;
}

function getSoftware(data, index) {
    var software = new Software(data);
    software.details = "This is best software for " + data.category

    return software;
}