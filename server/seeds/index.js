const db = require('../config/database');
const {
    addonData,
    attributeData,
    optionData,
    userData,
    contentData
} = require('./data');
const {
    User,
    Commission,
    Option,
    Addon,
    Attribute,
    AboutContent
} = require('../models');

db.once('open', async function () {
    const collections = await db.listCollections();
    for (const collection of collections) {
        await db.dropCollection(collection.name);
    }

    await AboutContent.create(contentData);

    // Initialise sample addons and options
    const addonSet = await Addon.insertMany(addonData);
    const optionSet = await Option.insertMany(optionData);

    // Create sample attributes by filtering options to those that match what we're after, then mapping their IDs
    for (const attribute of attributeData) {
        const optionRefs = optionSet
            .filter(opt => attribute.options.includes(opt.name))
            .map(opt => opt._id);

        await Attribute.create({
            name: attribute.name,
            options: optionRefs
        });
    }

    // Create sample users
    for (const tempUser of userData) {
        await User.create(tempUser);
    }

    const commUser = await User.findOne({
        email: userData[userData.length - 1].email
    });

    const commAddons = addonSet.map(add => {
        if (add.hasQuantity) {
            return {...add, quantity: 1};
        }
        return add;
    });

    // Create a commission under our commissionerUser
    await Commission.create({
        title: "Sample Commission",
        description: "This is a simple commission to test the system. I would like you to draw me a cat. Any cat will do.",
        commissioner: commUser.id,
        options: optionSet.filter(opt => opt.name === "Sketch"),
        addons: commAddons,
        anonymous: false
    });

    console.log("Seeding complete");
    process.exit(0);
});