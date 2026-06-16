const mongoose = require('mongoose');

const siteSettingSchema = new mongoose.Schema({
  // Existing homepage settings
  logoUrl: { type: String, default: '/UltraFit logo.png' },
  heroSubheading: { type: String, default: 'The Standard of Strength' },
  heroButtonText: { type: String, default: 'Claim Your 3-Day VIP Pass' },
  liveStatusText: { type: String, default: 'Open Now – Closing at 10 PM' },
  floatingButtonText: { type: String, default: 'Book 3-Day Free Trial' },

  // Members page settings
  membersHeroHeading: { type: String, default: 'ULTRAFIT MEMBERS' },
  membersHeroSubheading: { type: String, default: 'An elite community built on discipline, consistency, and transformation.' },
  membersFloatingButtonText: { type: String, default: '📅 Book 3-Day Free Trial' },

  // Diet Plan page settings
  dietHeroHeading: { type: String, default: 'Diet & Nutrition Plans' },
  dietHeroSubheading: { type: String, default: 'Scientifically crafted · Michelin-inspired meals · Unlock your potential' },
  calorieCalculatorHeading: { type: String, default: '⚡ Daily Calorie Calculator' },
  dietHeroImage: { type: String, default: '' },  // NEW: separate hero image for diet page

  // Workout Plan page settings
  workoutHeroHeading: { type: String, default: 'Weekly Workout Plan' },
  workoutHeroSubheading: { type: String, default: 'Periodized programming · Elite coaching · Unlock your athletic ceiling' },
  workoutHeroImage: { type: String, default: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1600' },
  bmiCalculatorHeading: { type: String, default: '⚖️ Body Mass Index' },

  // ========== NEW SECTION HEADINGS FOR HOMEPAGE ==========
  trainersHeading: { type: String, default: 'Gym Trainers' },
  transformationsHeading: { type: String, default: 'Transformations' },
  membersHeading: { type: String, default: 'Gym Members' },
  dietHeading: { type: String, default: 'Diet Plans' },
  workoutHeading: { type: String, default: 'Workout Plan' },
  membershipHeading: { type: String, default: 'Gym Membership' },
  shopHeading: { type: String, default: 'ULTRAFIT Shop' },
  galleryHeading: { type: String, default: 'UltraFit Gallery' },
  reelsHeading: { type: String, default: 'UltraFit Reels' },
  reviewsHeading: { type: String, default: 'Reviews' },

  // ========== HERO BACKGROUND IMAGES FOR EACH PAGE ==========
  heroBackgroundImage: { type: String, default: '' },     // for homepage
  membersHeroImage: { type: String, default: '' },       // for members.html
  shopHeroImage: { type: String, default: '' },          // for shop.html

  // Optional: separate subheading/button text for each page (if needed)
  dietHeroSubheading: { type: String, default: '' },
  dietHeroButtonText: { type: String, default: '' },
  membersHeroSubheading: { type: String, default: '' },
  membersHeroButtonText: { type: String, default: '' },
  shopHeroSubheading: { type: String, default: '' },
  shopHeroButtonText: { type: String, default: '' },
});

module.exports = mongoose.model('SiteSetting', siteSettingSchema);