require('dotenv').config();
const mongoose = require('mongoose');

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

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ekanshmishra124_db_user:jXNpKsmoGH2Oujas@ultrafit.9siu9qp.mongodb.net/ultrafit?retryWrites=true&w=majority';

async function seedDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (order matters to avoid foreign key issues)
    await SiteSetting.deleteMany();
    await Stats.deleteMany();
    await Trainer.deleteMany();
    await Member.deleteMany();
    await Product.deleteMany();
    await Transformation.deleteMany();
    await DietPlan.deleteMany();
    await WorkoutPlan.deleteMany();
    await Membership.deleteMany();
    await Gallery.deleteMany();
    await Reel.deleteMany();
    await Review.deleteMany();
    await ContactInfo.deleteMany();
    await DietCategory.deleteMany();
    await DietMeal.deleteMany();
    await WorkoutCategory.deleteMany();
    await WorkoutDay.deleteMany();
    await Admin.deleteMany();
    await StaffTrainer.deleteMany();

    console.log('🗑️ Old data cleared');

    // ========== SITE SETTINGS ==========
    await SiteSetting.create({
      logoUrl: '/UltraFit logo.png',
      heroSubheading: 'The Standard of Strength',
      heroButtonText: 'Claim Your 3-Day VIP Pass',
      liveStatusText: 'Open Now – Closing at 10 PM',
      floatingButtonText: 'Book 3-Day Free Trial',
      membersHeroHeading: 'ULTRAFIT MEMBERS',
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
    console.log('✅ Site settings created');

    // ========== STATS ==========
    await Stats.create({
      membersCount: 1500,
      trainersCount: 20,
      transformationsCount: 500,
      totalMembers: 2340,
      activeMembers: 1892,
      membersTransformations: 1250
    });
    console.log('✅ Stats created');

    // ========== TRAINERS (public facing) ==========
    await Trainer.insertMany([
      { name: 'Marcus Vane', position: 'Founder & CEO', photoUrl: 'https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg', bio: '20+ years in fitness industry, former athlete and business leader.', whatsappNumber: '1234567890', instagramUrl: 'https://instagram.com/ultrafitgym' },
      { name: 'Elena Cross', position: 'Head of Performance', photoUrl: 'https://images.pexels.com/photos/841128/pexels-photo-841128.jpeg', bio: 'Specialist in athletic performance and functional training.', whatsappNumber: '1234567890', instagramUrl: 'https://instagram.com/ultrafitgym' },
      { name: 'David Okafor', position: 'Nutrition Director', photoUrl: 'https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg', bio: 'Certified nutritionist helping members achieve body composition goals.', whatsappNumber: '1234567890', instagramUrl: 'https://instagram.com/ultrafitgym' },
      { name: 'Isabella Cruz', position: 'Strength & Conditioning', photoUrl: '/Trainer.jpg', bio: 'Expert in powerlifting and injury prevention.', whatsappNumber: '1234567890', instagramUrl: 'https://instagram.com/ultrafitgym' }
    ]);
    console.log('✅ Public trainers created');

    // ========== MEMBERS (17 members) ==========
    await Member.insertMany([
      { name: "Aarav Sharma", age: 28, since: "2023", photoUrl: "https://randomuser.me/api/portraits/men/32.jpg", experience: "intermediate", goal: "musclegain", featured: true, featuredTag: "Elite Member (6+ months)", status: "active", phone: "+919876543210", feeStatus: "paid" },
      { name: "Ishita Verma", age: 24, since: "2024", photoUrl: "https://randomuser.me/api/portraits/women/68.jpg", experience: "beginner", goal: "fatloss", featured: false, status: "active", phone: "+919876543211", feeStatus: "paid" },
      { name: "Rohan Mehta", age: 31, since: "2022", photoUrl: "https://randomuser.me/api/portraits/men/45.jpg", experience: "expert", goal: "musclegain", featured: true, featuredTag: "Content Creator", status: "active", phone: "+919876543212", feeStatus: "paid" },
      { name: "Priya Kaur", age: 26, since: "2023", photoUrl: "https://randomuser.me/api/portraits/women/33.jpg", experience: "intermediate", goal: "fatloss", featured: false, status: "inactive", phone: "+919876543213", feeStatus: "unpaid" },
      { name: "Vikram Singh", age: 35, since: "2021", photoUrl: "https://randomuser.me/api/portraits/men/22.jpg", experience: "expert", goal: "musclegain", featured: true, featuredTag: "VIP", status: "active", phone: "+919876543214", feeStatus: "paid" },
      { name: "Neha Gupta", age: 22, since: "2024", photoUrl: "https://randomuser.me/api/portraits/women/89.jpg", experience: "beginner", goal: "fatloss", featured: false, status: "active", phone: "+919876543215", feeStatus: "unpaid" },
      { name: "Kunal Desai", age: 29, since: "2022", photoUrl: "https://randomuser.me/api/portraits/men/52.jpg", experience: "intermediate", goal: "musclegain", featured: false, status: "active", phone: "+919876543216", feeStatus: "paid" },
      { name: "Simran Kaur", age: 27, since: "2023", photoUrl: "https://randomuser.me/api/portraits/women/44.jpg", experience: "intermediate", goal: "fatloss", featured: true, featuredTag: "Elite Member (6+ months)", status: "active", phone: "+919876543217", feeStatus: "paid" },
      { name: "Aditya Raj", age: 33, since: "2021", photoUrl: "https://randomuser.me/api/portraits/men/41.jpg", experience: "expert", goal: "musclegain", featured: false, status: "active", phone: "+919876543218", feeStatus: "paid" },
      { name: "Riya Bhatia", age: 23, since: "2024", photoUrl: "https://randomuser.me/api/portraits/women/55.jpg", experience: "beginner", goal: "fatloss", featured: false, status: "inactive", phone: "+919876543219", feeStatus: "unpaid" },
      { name: "Arjun Nair", age: 30, since: "2022", photoUrl: "https://randomuser.me/api/portraits/men/36.jpg", experience: "intermediate", goal: "musclegain", featured: false, status: "active", phone: "+919876543220", feeStatus: "paid" },
      { name: "Zara Khan", age: 26, since: "2023", photoUrl: "https://randomuser.me/api/portraits/women/17.jpg", experience: "expert", goal: "fatloss", featured: false, status: "active", phone: "+919876543221", feeStatus: "paid" },
      { name: "Dhruv Patel", age: 34, since: "2021", photoUrl: "https://randomuser.me/api/portraits/men/64.jpg", experience: "expert", goal: "musclegain", featured: true, featuredTag: "Content Creator", status: "active", phone: "+919876543222", feeStatus: "unpaid" },
      { name: "Anjali Mishra", age: 25, since: "2024", photoUrl: "https://randomuser.me/api/portraits/women/28.jpg", experience: "beginner", goal: "fatloss", featured: false, status: "active", phone: "+919876543223", feeStatus: "paid" },
      { name: "Rahul Joshi", age: 32, since: "2022", photoUrl: "https://randomuser.me/api/portraits/men/12.jpg", experience: "intermediate", goal: "musclegain", featured: false, status: "active", phone: "+919876543224", feeStatus: "paid" },
      { name: "Meera Iyer", age: 29, since: "2023", photoUrl: "https://randomuser.me/api/portraits/women/62.jpg", experience: "intermediate", goal: "fatloss", featured: false, status: "active", phone: "+919876543225", feeStatus: "unpaid" },
      { name: "Kabir Singh", age: 27, since: "2023", photoUrl: "https://randomuser.me/api/portraits/men/85.jpg", experience: "beginner", goal: "musclegain", featured: false, status: "inactive", phone: "+919876543226", feeStatus: "unpaid" }
    ]);
    console.log('✅ Members created');

    // ========== PRODUCTS ==========
    await Product.insertMany([
      { name: "Ultra Whey Isolate", imageUrl: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&w=400","https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=400","https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400"], shortDescription: "Premium whey isolate, fast absorption", price: 4999, tags: ["#1 Best Seller","Trainer’s Choice"], category: "supplements", type: "protein", goal: "musclegain", isBestseller: true, isTrainerChoice: true, features: ["25g protein per serving","Low carbs & sugar"], benefits: ["Muscle repair","Recovery boost"] },
      { name: "Ultra Creatine Monohydrate", imageUrl: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400","https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400","https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400"], shortDescription: "Micronized creatine for strength", price: 2299, tags: ["Trainer’s Choice"], category: "supplements", type: "creatine", goal: "musclegain", isTrainerChoice: true, features: ["5g per serving","High purity"], benefits: ["Strength increase","ATP production"] },
      { name: "Ultra Pre-Workout", imageUrl: "https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg?auto=compress&w=400","https://images.pexels.com/photos/841131/pexels-photo-841131.jpeg?auto=compress&w=400","https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400"], shortDescription: "Explosive energy & focus", price: 3499, tags: ["Limited Stock","Best Seller"], category: "supplements", type: "preworkout", goal: "musclegain", isBestseller: true, features: ["300mg caffeine","Beta alanine"], benefits: ["Endurance","Pumps"] },
      { name: "Ultra Fat Burner", imageUrl: "https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400","https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400","https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400"], shortDescription: "Thermogenic support", price: 3199, tags: ["New Arrival"], category: "supplements", type: "fatloss", goal: "fatloss", features: ["Green tea extract","Cayenne"], benefits: ["Metabolism boost","Fat oxidation"] },
      { name: "Ultra Shaker Bottle", imageUrl: "https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=400","https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&w=400","https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400"], shortDescription: "Premium leak-proof shaker", price: 799, tags: [], category: "accessories", type: "accessories", goal: "general", features: ["BPA-free","700ml"], benefits: ["Easy mix","Durable"] },
      { name: "Ultra Gym Bag", imageUrl: "https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400","https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400","https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400"], shortDescription: "Duffel with shoe compartment", price: 2999, tags: ["Trainer’s Choice"], category: "accessories", type: "accessories", goal: "general", isTrainerChoice: true, features: ["Water-resistant","Ventilated pocket"], benefits: ["Organized storage"] },
      { name: "Ultra Lifting Straps", imageUrl: "https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400","https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg?auto=compress&w=400","https://images.pexels.com/photos/841131/pexels-photo-841131.jpeg?auto=compress&w=400"], shortDescription: "Leather wrist support", price: 1299, tags: [], category: "accessories", type: "accessories", goal: "musclegain", features: ["Neoprene padding"], benefits: ["Grip strength","Injury prevention"] },
      { name: "Ultra BCAA+ Electrolytes", imageUrl: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400","https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400","https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400"], shortDescription: "Hydration & recovery", price: 2499, tags: ["Best Seller"], category: "supplements", type: "bcaa", goal: "musclegain", isBestseller: true, features: ["2:1:1 ratio","Electrolytes"], benefits: ["Reduce fatigue","Muscle preservation"] },
      { name: "Ultra Plant Protein", imageUrl: "https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=400","https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&w=400","https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400"], shortDescription: "Vegan pea & rice protein", price: 4499, tags: ["New Arrival"], category: "supplements", type: "protein", goal: "musclegain", features: ["24g protein","Dairy-free"], benefits: ["Vegan friendly","Digestion"] },
      { name: "Ultra Resistance Bands", imageUrl: "https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400","https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400","https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400"], shortDescription: "Set of 5 bands", price: 1999, tags: [], category: "accessories", type: "accessories", goal: "fatloss", features: ["5 resistance levels"], benefits: ["Versatile","Home workouts"] },
      { name: "Ultra Omega-3", imageUrl: "https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg?auto=compress&w=400","https://images.pexels.com/photos/841131/pexels-photo-841131.jpeg?auto=compress&w=400","https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400"], shortDescription: "High potency fish oil", price: 1899, tags: ["Trainer’s Choice"], category: "supplements", type: "wellness", goal: "general", isTrainerChoice: true, features: ["1000mg EPA/DHA"], benefits: ["Joint health","Heart support"] },
      { name: "Ultra Hoodie", imageUrl: "https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400","https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400","https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400"], shortDescription: "Premium athletic hoodie", price: 3499, tags: ["Limited Stock"], category: "accessories", type: "apparel", goal: "general", features: ["Cotton blend","Gold embroidery"], benefits: ["Comfort","Style"] },
      { name: "Ultra Mass Gainer", imageUrl: "https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&w=400","https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&w=400","https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400"], shortDescription: "High calorie weight gainer", price: 5499, tags: ["Best Seller"], category: "supplements", type: "massgainer", goal: "musclegain", isBestseller: true, features: ["50g protein","1200 cal"], benefits: ["Weight gain","Recovery"] },
      { name: "Ultra Knee Sleeves", imageUrl: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400","https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&w=400","https://images.pexels.com/photos/1121132/pexels-photo-1121132.jpeg?auto=compress&w=400"], shortDescription: "Compression support", price: 2299, tags: [], category: "accessories", type: "accessories", goal: "general", features: ["Neoprene 7mm"], benefits: ["Stability","Warmth"] },
      { name: "Ultra Glutamine", imageUrl: "https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg?auto=compress&w=400", images: ["https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg?auto=compress&w=400","https://images.pexels.com/photos/841131/pexels-photo-841131.jpeg?auto=compress&w=400","https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&w=400"], shortDescription: "Immune & recovery support", price: 2199, tags: ["Trainer’s Choice"], category: "supplements", type: "recovery", goal: "musclegain", isTrainerChoice: true, features: ["5g L-Glutamine"], benefits: ["Gut health","Muscle repair"] }
    ]);
    console.log('✅ Products created');

    // ========== TRANSFORMATIONS ==========
    await Transformation.insertMany([
      { beforeImage: 'https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg', afterImage: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg' },
      { beforeImage: 'https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg', afterImage: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg' }
    ]);
    console.log('✅ Transformations created');

    // ========== DIET PLANS ==========
    await DietPlan.insertMany([
      { title: 'Veg', imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', shortDescription: 'Plant-based nutrition for sustained energy.', targets: ['Weight Loss', 'Balanced'] },
      { title: 'Egg', imageUrl: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', shortDescription: 'High-quality protein for muscle repair.', targets: ['Muscle Gain', 'Performance'] },
      { title: 'Non-Veg', imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg', shortDescription: 'Complete protein for strength development.', targets: ['Mass Building', 'Strength'] }
    ]);
    console.log('✅ Diet plans created');

    // ========== WORKOUT PLANS ==========
    await WorkoutPlan.insertMany([
      { title: 'Cardio Training', imageUrl: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg', shortDescription: 'HIIT to boost metabolic rate.', targets: ['Fat Burn', 'Endurance'] },
      { title: 'Muscle Training', imageUrl: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg', shortDescription: 'Strength-focused for lean mass.', targets: ['Strength', 'Hypertrophy'] }
    ]);
    console.log('✅ Workout plans created');

    // ========== MEMBERSHIP PLANS ==========
    await Membership.insertMany([
      { planName: 'Monthly Plan', price: 2000, duration: 'month', description: 'Full access, group classes, 24/7 support' },
      { planName: '3-Month Plan', price: 4500, duration: '3 months', description: 'Save ₹1500 + free personal training session' }
    ]);
    console.log('✅ Membership plans created');

    // ========== GALLERY ==========
    await Gallery.create({ images: [
      'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg',
      'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg',
      'https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg',
      'https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg',
      'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg'
    ] });
    console.log('✅ Gallery created');

    // ========== REELS ==========
    await Reel.insertMany([
      { videoUrl: 'https://videos.pexels.com/video-files/4349242/4349242-uhd_2560_1440_25fps.mp4', thumbnail: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg' },
      { videoUrl: 'https://videos.pexels.com/video-files/4349242/4349242-uhd_2560_1440_25fps.mp4', thumbnail: 'https://images.pexels.com/photos/1552102/pexels-photo-1552102.jpeg' },
      { videoUrl: 'https://videos.pexels.com/video-files/4349242/4349242-uhd_2560_1440_25fps.mp4', thumbnail: 'https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg' }
    ]);
    console.log('✅ Reels created');

    // ========== REVIEWS ==========
    await Review.insertMany([
      { name: 'Sarah Johnson', photoUrl: 'https://randomuser.me/api/portraits/women/68.jpg', review: 'The best gym I have ever joined. Trainers really care.', rating: 5 },
      { name: 'Mike Lee', photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg', review: 'Amazing atmosphere and top-notch equipment.', rating: 5 },
      { name: 'Priya Patel', photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg', review: 'Great community and supportive staff!', rating: 4 }
    ]);
    console.log('✅ Reviews created');

    // ========== CONTACT INFO ==========
    await ContactInfo.create({
      phone: '+1 (212) 555-7890',
      whatsappNumber: '+1 (212) 555-7891',
      facebookUrl: 'https://facebook.com/ultrafitgym',
      instagramUrl: 'https://instagram.com/ultrafitgym',
      address: '123 Strength Avenue, Manhattan, NY 10001, USA'
    });
    console.log('✅ Contact info created');

    // ========== DIET CATEGORIES ==========
    await DietCategory.insertMany([
      { key: 'veg', displayName: '🌱 Vegetarian Diet', order: 1 },
      { key: 'egg', displayName: '🥚 Eggetarian Diet', order: 2 },
      { key: 'nonveg', displayName: '🍗 Non-Vegetarian Diet', order: 3 }
    ]);
    console.log('✅ Diet categories created');

    // ========== WORKOUT CATEGORIES ==========
    await WorkoutCategory.insertMany([
      { key: 'beginner', displayName: 'Beginner', subheading: 'Foundation – 1 to 6 Months', order: 1 },
      { key: 'intermediate', displayName: 'Intermediate', subheading: 'Strength Building – 1 to 2 Years', order: 2 },
      { key: 'expert', displayName: 'Expert', subheading: 'Advanced Performance – 3+ Years', order: 3 }
    ]);
    console.log('✅ Workout categories created');

    // ========== STAFF TRAINERS (10 staff members with full details) ==========
    const staffCredentials = [
      { email: 'ultrafit@1', password: '102938', name: 'John Smith', firstName: 'John', lastName: 'Smith', age: 28, gender: 'male', username: 'johnsmith' },
      { email: 'ultrafit@2', password: '475639', name: 'Emma Wilson', firstName: 'Emma', lastName: 'Wilson', age: 25, gender: 'female', username: 'emmawilson' },
      { email: 'ultrafit@3', password: '882910', name: 'Michael Brown', firstName: 'Michael', lastName: 'Brown', age: 32, gender: 'male', username: 'michaelbrown' },
      { email: 'ultrafit@4', password: '334455', name: 'Sophia Davis', firstName: 'Sophia', lastName: 'Davis', age: 26, gender: 'female', username: 'sophiadavis' },
      { email: 'ultrafit@5', password: '918273', name: 'James Miller', firstName: 'James', lastName: 'Miller', age: 30, gender: 'male', username: 'jamesmiller' },
      { email: 'ultrafit@6', password: '564738', name: 'Olivia Garcia', firstName: 'Olivia', lastName: 'Garcia', age: 27, gender: 'female', username: 'oliviagarcia' },
      { email: 'ultrafit@7', password: '203948', name: 'William Rodriguez', firstName: 'William', lastName: 'Rodriguez', age: 35, gender: 'male', username: 'williamrod' },
      { email: 'ultrafit@8', password: '776655', name: 'Isabella Martinez', firstName: 'Isabella', lastName: 'Martinez', age: 24, gender: 'female', username: 'isabellam' },
      { email: 'ultrafit@9', password: '112233', name: 'David Lee', firstName: 'David', lastName: 'Lee', age: 29, gender: 'male', username: 'davidlee' },
      { email: 'ultrafit@10', password: '990011', name: 'Charlotte White', firstName: 'Charlotte', lastName: 'White', age: 31, gender: 'female', username: 'charlottew' }
    ];

    const staffTrainers = staffCredentials.map((cred, idx) => ({
      name: cred.name,
      firstName: cred.firstName,
      lastName: cred.lastName,
      email: cred.email,
      password: cred.password,
      username: cred.username,
      age: cred.age,
      gender: cred.gender,
      photoUrl: 'trainer-ultrafit-logo.png',
      role: 'trainer'
    }));

    await StaffTrainer.insertMany(staffTrainers);
    console.log('✅ 10 staff trainers inserted with full details');

    // ========== ADMIN USER ==========
    await Admin.create({
      email: 'ultrafit',
      password: '99350'
    });
    console.log('✅ Admin user created');

    // ========== LEGAL CONTENT ==========
    await LegalContent.insertMany([
      {
        pageKey: 'privacy',
        heroHeading: 'Privacy Policy',
        heroSubheading: 'Your trust is our priority. We protect your data with the same intensity you bring to your workouts.',
        sections: [
          { title: 'What Data We Collect', content: '<p>UltraFit Gym collects only essential information to provide you with a seamless fitness experience.</p>' },
          { title: 'How We Use Your Data', content: '<p>Your data helps us personalize training plans, send class reminders, and improve our services.</p>' }
        ]
      },
      {
        pageKey: 'refund',
        heroHeading: 'Refund Policy',
        heroSubheading: 'Clear, fair, and transparent – because your commitment deserves clarity.',
        sections: [
          { title: 'Cancellation Timelines', content: '<p>You may cancel your membership anytime. Refunds are processed based on the schedule.</p>' }
        ]
      },
      {
        pageKey: 'terms',
        heroHeading: 'Terms & Conditions',
        heroSubheading: 'Your roadmap to a safe, respectful, and powerful fitness journey.',
        sections: [
          { title: 'Booking Rules', content: '<p>All classes must be booked at least 2 hours in advance via our app or front desk.</p>' }
        ]
      }
    ]);
    console.log('✅ Legal content created');

    console.log('🎉 All data inserted successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    mongoose.disconnect();
  }
}

seedDB();