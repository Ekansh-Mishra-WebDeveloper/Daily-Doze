// save as add-headings.js and run with node
require('dotenv').config();
const mongoose = require('mongoose');
const SiteSetting = require('./models/SiteSetting');

const MONGODB_URI = process.env.MONGODB_URI;

const update = async () => {
  await mongoose.connect(MONGODB_URI);
  await SiteSetting.updateOne({}, {
    $set: {
      trainersHeading: 'Gym Trainers',
      transformationsHeading: 'Transformations',
      membersHeading: 'Gym Members',
      dietHeading: 'Diet Plans',
      workoutHeading: 'Workout Plan',
      membershipHeading: 'Gym Membership',
      shopHeading: 'ULTRAFIT Shop',
      galleryHeading: 'UltraFit Gallery',
      reelsHeading: 'UltraFit Reels',
      reviewsHeading: 'Reviews'
    }
  }, { upsert: true });
  console.log('Updated site settings with new headings');
  process.exit();
};
update();