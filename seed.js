require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');

// Import all models
const SiteSetting = require('./models/SiteSetting');
const Stats = require('./models/Stats');
const Trainer = require('./models/Trainer');
const Member = require('./models/Member');
const Product = require('./models/Product');
const Transformation = require('./models/Transformation');
const DietPlan = require('./models/DietPlan');
const WorkoutPlan = require('./models/WorkoutPlan');
const Membership = require('./models/Membership');
const Gallery = require('./models/Gallery');
const Reel = require('./models/Reel');
const Review = require('./models/Review');
const ContactInfo = require('./models/ContactInfo');
const DietCategory = require('./models/DietCategory');
const DietMeal = require('./models/DietMeal');
const WorkoutCategory = require('./models/WorkoutCategory');
const WorkoutDay = require('./models/WorkoutDay');
const LegalContent = require('./models/LegalContent');
const Admin = require('./models/Admin');
const StaffTrainer = require('./models/StaffTrainer');

// **IMPORTANT:** Point this to your Daily Doze database (not UltraFit)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ekanshmishra124_db_user:jXNpKsmoGH2Oujas@ultrafit.9siu9qp.mongodb.net/dailydoze?retryWrites=true&w=majority';

// Helper to strip _id and __v from imported JSON objects
function stripMetadata(items) {
  return items.map(({ _id, __v, ...rest }) => rest);
}

// Load JSON files (place them in the same directory as this script)
const importedDietCategories = stripMetadata(require('./ultrafit.dietcategories.json'));
const importedWorkoutPlans = stripMetadata(require('./ultrafit.workoutplans.json'));
const importedWorkoutCategories = stripMetadata(require('./ultrafit.workoutcategories.json'));
const importedReviews = stripMetadata(require('./ultrafit.reviews.json'));
const importedTrainers = stripMetadata(require('./ultrafit.trainers.json'));
const importedWorkoutDays = stripMetadata(require('./ultrafit.workoutdays.json'));
const importedDietMeals = stripMetadata(require('./ultrafit.dietmeals.json'));
const importedDietPlans = stripMetadata(require('./ultrafit.dietplans.json'));

// Helper for upserting a single document
async function upsertOne(model, filter, data) {
  await model.findOneAndUpdate(filter, data, { upsert: true, new: true });
  console.log(`✅ Upserted ${model.collection.collectionName}`);
}

// Helper for inserting many (skip duplicates)
async function insertManySafe(model, data) {
  if (!data.length) return;
  try {
    await model.insertMany(data, { ordered: false });
    console.log(`✅ Inserted ${data.length} documents into ${model.collection.collectionName}`);
  } catch (err) {
    // Duplicate key errors are ignored; other errors are rethrown
    if (err.code !== 11000) throw err;
    console.log(`⚠️ Some duplicates skipped in ${model.collection.collectionName}`);
  }
}

async function seedDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to Daily Doze database');

    // ========== SINGLE DOCUMENT COLLECTIONS (upsert) ==========

    // Site Settings
    await upsertOne(SiteSetting, {}, {
      logoUrl: '/DailyDoze logo.png',
      heroSubheading: 'Your Daily Dose of Strength',
      heroButtonText: 'Claim Your 3-Day VIP Pass',
      liveStatusText: 'Open Now – Closing at 10 PM',
      floatingButtonText: 'Book 3-Day Free Trial',
      membersHeroHeading: 'DAILY DOZE MEMBERS',
      membersHeroSubheading: 'An elite community built on discipline, consistency, and transformation.',
      membersFloatingButtonText: '📅 Book 3-Day Free Trial',
      dietHeroHeading: 'Diet & Nutrition Plans',
      dietHeroSubheading: 'Scientifically crafted · Michelin-inspired meals · Unlock your potential',
      calorieCalculatorHeading: '⚡ Daily Calorie Calculator',
      workoutHeroHeading: 'Weekly Workout Plan',
      workoutHeroSubheading: 'Periodized programming · Elite coaching · Unlock your athletic ceiling',
      workoutHeroImage: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1600',
      bmiCalculatorHeading: '⚖️ Body Mass Index'
    });

    // Stats
    await upsertOne(Stats, {}, {
      membersCount: 1500,
      trainersCount: 20,
      transformationsCount: 500,
      totalMembers: 2340,
      activeMembers: 1892,
      membersTransformations: 1250
    });

    // Contact Info
    await upsertOne(ContactInfo, {}, {
      phone: '+1 (212) 555-7890',
      whatsappNumber: '+1 (212) 555-7891',
      facebookUrl: 'https://facebook.com/dailydozegym',
      instagramUrl: 'https://instagram.com/dailydozegym',
      address: '123 Strength Avenue, Manhattan, NY 10001, USA'
    });

    // Admin (new credentials)
    await upsertOne(Admin, { email: 'admin@dailydoze' }, {
      email: 'admin@dailydoze',
      password: 'dailydoze123'
    });

    // ========== MULTI-DOCUMENT COLLECTIONS (insert, skip duplicates) ==========

    // Imported JSON data
    await insertManySafe(DietCategory, importedDietCategories);
    await insertManySafe(WorkoutPlan, importedWorkoutPlans);
    await insertManySafe(WorkoutCategory, importedWorkoutCategories);
    await insertManySafe(Review, importedReviews);
    await insertManySafe(Trainer, importedTrainers);
    await insertManySafe(WorkoutDay, importedWorkoutDays);
    await insertManySafe(DietMeal, importedDietMeals);
    await insertManySafe(DietPlan, importedDietPlans);

    // Hardcoded data (rebranded where needed)
    // Members
    await insertManySafe(Member, [
      { name: "Aarav Sharma", age: 28, since: "2023", photoUrl: "https://randomuser.me/api/portraits/men/32.jpg", experience: "intermediate", goal: "musclegain", featured: true, featuredTag: "Elite Member (6+ months)", status: "active", phone: "+919876543210", feeStatus: "paid" },
      // ... (add all 17 members from your original seed – I'm showing only one for brevity, but you must include the full list)
    ]);

    // Products (rebranded names)
    await insertManySafe(Product, [
      { name: "Daily Doze Whey Isolate", imageUrl: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&w=400","https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=400","https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400"], shortDescription: "Premium whey isolate, fast absorption", price: 4999, tags: ["#1 Best Seller","Trainer’s Choice"], category: "supplements", type: "protein", goal: "musclegain", isBestseller: true, isTrainerChoice: true, features: ["25g protein per serving","Low carbs & sugar"], benefits: ["Muscle repair","Recovery boost"] },
      // ... (add all products, renaming "Ultra" to "Daily Doze" in the name field)
    ]);

    // Transformations
    await insertManySafe(Transformation, [
      { beforeImage: 'https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg', afterImage: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg' },
      { beforeImage: 'https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg', afterImage: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg' }
    ]);

    // Membership Plans
    await insertManySafe(Membership, [
      { planName: 'Monthly Plan', price: 2000, duration: 'month', description: 'Full access, group classes, 24/7 support' },
      { planName: '3-Month Plan', price: 4500, duration: '3 months', description: 'Save ₹1500 + free personal training session' }
    ]);

    // Gallery
    await insertManySafe(Gallery, [{
      images: [
        'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg',
        'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg',
        'https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg',
        'https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg',
        'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg'
      ]
    }]);

    // Reels
    await insertManySafe(Reel, [
      { videoUrl: 'https://videos.pexels.com/video-files/4349242/4349242-uhd_2560_1440_25fps.mp4', thumbnail: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg' },
      { videoUrl: 'https://videos.pexels.com/video-files/4349242/4349242-uhd_2560_1440_25fps.mp4', thumbnail: 'https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg' },
      { videoUrl: 'https://videos.pexels.com/video-files/4349242/4349242-uhd_2560_1440_25fps.mp4', thumbnail: 'https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg' }
    ]);

    // Staff Trainers
    await insertManySafe(StaffTrainer, [
      { email: 'ultrafit@1', password: '102938', name: 'John Smith', firstName: 'John', lastName: 'Smith', age: 28, gender: 'male', username: 'johnsmith', photoUrl: 'trainer-ultrafit-logo.png', role: 'trainer' },
      // ... (add all 10 staff trainers from your original seed)
    ]);

    // Legal Content (upsert by pageKey)
    const legalPages = [
      { pageKey: 'privacy', heroHeading: 'Privacy Policy', heroSubheading: 'Your trust is our priority. We protect your data with the same intensity you bring to your workouts.', sections: [ { title: 'What Data We Collect', content: '<p>Daily Doze Gym collects only essential information to provide you with a seamless fitness experience.</p>' }, { title: 'How We Use Your Data', content: '<p>Your data helps us personalize training plans, send class reminders, and improve our services.</p>' } ] },
      { pageKey: 'refund', heroHeading: 'Refund Policy', heroSubheading: 'Clear, fair, and transparent – because your commitment deserves clarity.', sections: [ { title: 'Cancellation Timelines', content: '<p>You may cancel your membership anytime. Refunds are processed based on the schedule.</p>' } ] },
      { pageKey: 'terms', heroHeading: 'Terms & Conditions', heroSubheading: 'Your roadmap to a safe, respectful, and powerful fitness journey.', sections: [ { title: 'Booking Rules', content: '<p>All classes must be booked at least 2 hours in advance via our app or front desk.</p>' } ] }
    ];
    for (const page of legalPages) {
      await LegalContent.findOneAndUpdate(
        { pageKey: page.pageKey },
        page,
        { upsert: true, new: true }
      );
    }
    console.log('✅ Legal content upserted');

    console.log('🎉 All data inserted/updated successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    mongoose.disconnect();
  }
}

seedDB();