/* ==========================================================================
   1. CONSTANTS & CONFIGURATION
   ========================================================================== */
const RESTAURANT = {
  name: 'IPL Dhaba',
  phone: '+91-9876543210',
  address: 'Tirupati Highway, Tirupati, Andhra Pradesh',
  lat: 13.6288,
  lng: 79.4192,
  deliveryFee: 30,
  minOrder: 100,
};

// Backend API base URL — override via window.APP_CONFIG or edit directly
// Development: http://localhost:3001
// Production:  https://your-app.railway.app
const API_BASE = (window.APP_CONFIG && window.APP_CONFIG.apiBase) || 'http://localhost:3001';

// Supabase config for Realtime subscriptions (browser-safe anon key)
const SUPABASE_URL  = (window.APP_CONFIG && window.APP_CONFIG.supabaseUrl)  || '';
const SUPABASE_ANON = (window.APP_CONFIG && window.APP_CONFIG.supabaseAnon) || '';

// Fallback admin credentials (demo mode — when backend is offline)
const ADMIN_USERS = [
  { email: 'admin@ipldhaba.com', password: 'ipl2024', name: 'Admin Manager', role: 'admin' },
  { email: 'delivery@ipldhaba.com', password: 'deliver1', name: 'Ravi (Delivery)', role: 'delivery' }
];

// Runtime flags
let BACKEND_ONLINE = false;
let supabaseClient = null;

const STATUS_ORDER = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '🍽️' },
  { id: 'veg-curries', label: 'Veg Curries', emoji: '🥘' },
  { id: 'egg-curries', label: 'Egg Curries', emoji: '🍳' },
  { id: 'fish-prawns', label: 'Fish & Prawns', emoji: '🦐' },
  { id: 'mutton', label: 'Mutton', emoji: '🍖' },
  { id: 'nonveg-starters', label: 'Non-Veg Starters', emoji: '🍗' },
  { id: 'nonveg-curries', label: 'Non-Veg Curries', emoji: '🍛' },
  { id: 'biryani-rice', label: 'Biryani & Rice', emoji: '🍚' }
];

/* ==========================================================================
   2. MENU DATA (75 ITEMS MAPPED ACCURATELY)
   ========================================================================== */
const MENU_DATA = [
  // --- VEG CURRIES ---
  {
    id: 'paneer-butter-masala',
    name: 'Paneer Butter Masala',
    category: 'veg-curries',
    price: 220,
    foodType: 'veg',
    image: './IPL DHABA ITEMS/paneer butter masala.jpg',
    description: 'Soft cubes of paneer cooked in a rich, buttery, and mildly sweet tomato gravy.'
  },
  {
    id: 'dal-tomato',
    name: 'Dal Tomato',
    category: 'veg-curries',
    price: 120,
    foodType: 'veg',
    image: './IPL DHABA ITEMS/dal tomato curry.jpg',
    description: 'Yellow lentils cooked with fresh tomatoes, tempered with mustard seeds and curry leaves.'
  },
  {
    id: 'chana-masala',
    name: 'Chana Masala',
    category: 'veg-curries',
    price: 120,
    foodType: 'veg',
    image: './IPL DHABA ITEMS/chana masala curry.jpg',
    description: 'Chickpeas simmered in a spiced onion-tomato gravy with fragrant Indian herbs.'
  },
  {
    id: 'methi-chamman',
    name: 'Methi Chamman',
    category: 'veg-curries',
    price: 250,
    foodType: 'veg',
    image: './IPL DHABA ITEMS/methi chaman curry.jpg',
    description: 'A Kashmiri specialty featuring grated paneer and fresh fenugreek leaves in a creamy spinach base.'
  },
  {
    id: 'kaju-curry',
    name: 'Kaju Curry',
    category: 'veg-curries',
    price: 250,
    foodType: 'veg',
    image: './IPL DHABA ITEMS/kaju curry.jpg',
    description: 'Roasted cashew nuts simmered in a rich, creamy, and heavily spiced cashew-paste gravy.'
  },
  {
    id: 'kaju-mushroom',
    name: 'Kaju Mushroom',
    category: 'veg-curries',
    price: 250,
    foodType: 'veg',
    image: './IPL DHABA ITEMS/kaju mushroom curry.jpg',
    description: 'Fresh mushrooms and roasted cashews cooked together in a spiced aromatic sauce.'
  },
  {
    id: 'kadai-paneer',
    name: 'Kadai Paneer',
    category: 'veg-curries',
    price: 280,
    foodType: 'veg',
    image: './IPL DHABA ITEMS/kadai panner curry.jpg',
    description: 'Paneer cubes tossed with bell peppers and onions in a freshly ground kadai spice masala.'
  },
  {
    id: 'mushroom-curry',
    name: 'Mushroom Curry',
    category: 'veg-curries',
    price: 220,
    foodType: 'veg',
    image: './IPL DHABA ITEMS/mushroom curry.jpg',
    description: 'Button mushrooms simmered in a thick onion-tomato gravy with warm spices.'
  },
  {
    id: 'jaipur-special-curry',
    name: 'Jaipur Special Curry',
    category: 'veg-curries',
    price: 230,
    foodType: 'veg',
    image: './IPL DHABA ITEMS/jaipur special curry.jpg',
    description: 'Chef\'s signature mixed vegetable curry cooked with local Rajasthani spices and cream.'
  },
  {
    id: 'palak-paneer',
    name: 'Palak Paneer',
    category: 'veg-curries',
    price: 180,
    foodType: 'veg',
    image: './IPL DHABA ITEMS/palak panner curry.jpg',
    description: 'Soft paneer cubes in a smooth, vibrant, and mildly spiced spinach puree.'
  },
  {
    id: 'dal-thadka',
    name: 'Dal Thadka',
    category: 'veg-curries',
    price: 100,
    foodType: 'veg',
    image: './IPL DHABA ITEMS/dal thadaka curry.jpg',
    description: 'Classic yellow dal tempered with ghee, garlic, red chillies, and cumin seeds.'
  },
  {
    id: 'plain-palak',
    name: 'Plain Palak',
    category: 'veg-curries',
    price: 100,
    foodType: 'veg',
    image: './IPL DHABA ITEMS/plain palak curry.jpg',
    description: 'Smooth and nutritious pureed spinach tempered with garlic and cumin.'
  },
  {
    id: 'tomato-curry',
    name: 'Tomato Curry',
    category: 'veg-curries',
    price: 100,
    foodType: 'veg',
    image: './IPL DHABA ITEMS/tomato curry.jpg',
    description: 'Tangy and spicy Andhra style tomato gravy, best enjoyed with Pulka.'
  },

  // --- EGG CURRIES ---
  {
    id: 'egg-curry',
    name: 'Egg Curry',
    category: 'egg-curries',
    price: 120,
    foodType: 'egg',
    image: './IPL DHABA ITEMS/egg curry.jpg',
    description: 'Boiled eggs simmered in a classic, home-style onion-tomato gravy.'
  },
  {
    id: 'egg-keema',
    name: 'Egg Keema',
    category: 'egg-curries',
    price: 100,
    foodType: 'egg',
    image: './IPL DHABA ITEMS/egg keema.jpg',
    description: 'Finely chopped boiled eggs cooked with onions, tomatoes, and ground spices.'
  },
  {
    id: 'egg-burji',
    name: 'Egg Burji',
    category: 'egg-curries',
    price: 100,
    foodType: 'egg',
    image: './IPL DHABA ITEMS/egg burji curry.jpg',
    description: 'Scrambled eggs stir-fried with onions, green chillies, and fresh coriander leaves.'
  },
  {
    id: 'egg-fry',
    name: 'Egg Fry',
    category: 'egg-curries',
    price: 150,
    foodType: 'egg',
    image: './IPL DHABA ITEMS/egg fry curry.jpg',
    description: 'Pan-fried boiled eggs coated in local spices, curry leaves, and black pepper.'
  },
  {
    id: 'egg-tadka',
    name: 'Egg Tadka',
    category: 'egg-curries',
    price: 130,
    foodType: 'egg',
    image: './IPL DHABA ITEMS/Egg Tadka curry.jpg',
    description: 'Dhaba style scrambled egg curry cooked with red lentils and hot spices.'
  },
  {
    id: 'egg-palak',
    name: 'Egg Palak',
    category: 'egg-curries',
    price: 130,
    foodType: 'egg',
    image: './IPL DHABA ITEMS/egg palak curry.jpg',
    description: 'Boiled eggs cooked in a nourishing, garlic-tempered pureed spinach gravy.'
  },

  // --- FISH & PRAWNS ---
  {
    id: 'prawns-curry',
    name: 'Prawns Curry',
    category: 'fish-prawns',
    price: 300,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/prawan curry.jpg',
    description: 'Fresh prawns simmered in a tangy coconut-tomato gravy with local spices.'
  },
  {
    id: 'prawns-fry',
    name: 'Prawns Fry',
    category: 'fish-prawns',
    price: 300,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/prawans fry.jpg',
    description: 'Spicy pan-fried prawns tossed with onions, green chillies, and curry leaves.'
  },
  {
    id: 'prawns-chilli',
    name: 'Prawns Chilli',
    category: 'fish-prawns',
    price: 300,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/prawans chilli.jpg',
    description: 'Indo-Chinese style prawns stir-fried with bell peppers, onions, and spicy red chili sauce.'
  },
  {
    id: 'prawns-roast',
    name: 'Prawns Roast',
    category: 'fish-prawns',
    price: 300,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/prawans roast.jpg',
    description: 'Dry roasted prawns cooked with caramelized onions, ginger-garlic paste, and crushed spices.'
  },
  {
    id: 'prawns-65',
    name: 'Prawns 65',
    category: 'fish-prawns',
    price: 300,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/prawans 65.jpg',
    description: 'Crispy, deep-fried prawns marinated in yoghurt, curry leaves, and red hot spices.'
  },
  {
    id: 'apollo-fish-roast',
    name: 'Apollo Fish Roast',
    category: 'fish-prawns',
    price: 300,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/apollo fish roast.jpg',
    description: 'Boneless fish pieces tossed in a dry spicy mix of onion, garlic, and curry leaves.'
  },
  {
    id: 'apollo-fish-fry',
    name: 'Apollo Fish Fry',
    category: 'fish-prawns',
    price: 300,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/apollo fish fry.jpg',
    description: 'Popular Andhra starter: Crispy, battered fish fillets fried and spiced with green chillies.'
  },

  // --- MUTTON ---
  {
    id: 'mutton-curry',
    name: 'Mutton Curry',
    category: 'mutton',
    price: 350,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/mutton curry.jpg',
    description: 'Tender mutton pieces slow-cooked in a classic, spicy Indian gravy with local spices.'
  },
  {
    id: 'mutton-fry',
    name: 'Mutton Fry',
    category: 'mutton',
    price: 350,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/mutton fry.jpg',
    description: 'Andhra style dry mutton fry cooked with black pepper, red chilies, and onions.'
  },
  {
    id: 'mutton-biryani',
    name: 'Mutton Biryani',
    category: 'mutton',
    price: 300,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/mutton biryani.jpg',
    description: 'Layers of long-grain basmati rice and slow-cooked mutton, steamed with saffron.'
  },

  // --- NON-VEG STARTERS ---
  {
    id: 'chilli-chicken',
    name: 'Chilli Chicken',
    category: 'nonveg-starters',
    price: 250,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/chilli chicken starter.jpg',
    description: 'Crispy chicken chunks tossed in spicy soy-chili sauce with garlic and bell peppers.'
  },
  {
    id: 'chicken-65',
    name: 'Chicken 65',
    category: 'nonveg-starters',
    price: 250,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/chicken 65 starter.jpg',
    description: 'Deep-fried chicken pieces marinated in red chili, ginger, and curry leaf paste.'
  },
  {
    id: 'chicken-85',
    name: 'Chicken 85',
    category: 'nonveg-starters',
    price: 280,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/chicken 65 starter.jpg',
    isFallback: true,
    description: 'Specialty dry-roasted chicken starter cooked with red chillies and lemon juice.'
  },
  {
    id: 'kaju-chicken-fry',
    name: 'Kaju Chicken Fry',
    category: 'nonveg-starters',
    price: 280,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/kaju chicken fry starter.jpg',
    description: 'Crispy fried chicken pieces tossed with roasted cashew nuts and southern spices.'
  },
  {
    id: 'star-chicken',
    name: 'Star Chicken',
    category: 'nonveg-starters',
    price: 300,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/star chicken starter.jpeg',
    description: 'IPL Dhaba\'s signature fried chicken starter, extra crispy and beautifully spiced.'
  },
  {
    id: 'ginger-chicken',
    name: 'Ginger Chicken',
    category: 'nonveg-starters',
    price: 280,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/ginger chicken.jpg',
    description: 'Stir-fried chicken loaded with thin ginger juliennes and basic spices.'
  },
  {
    id: 'chicken-vada',
    name: 'Chicken Vada',
    category: 'nonveg-starters',
    price: 300,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/chicken vada starter.jpg',
    description: 'Unique savory donuts made of minced chicken, green chilies, and coriander, deep fried.'
  },
  {
    id: 'lemon-chicken',
    name: 'Lemon Chicken',
    category: 'nonveg-starters',
    price: 280,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/lemon chicken starter.jpg',
    description: 'Tender chicken stir-fried with tangy lemon juice, green chilies, and black pepper.'
  },
  {
    id: 'chicken-fry-bone',
    name: 'Chicken Fry (Bone)',
    category: 'nonveg-starters',
    price: 220,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/chicken fry bone starter.jpg',
    description: 'Traditional bone-in chicken deep-fried and coated with aromatic spices.'
  },
  {
    id: 'chicken-fry-boneless',
    name: 'Chicken Fry (B Less)',
    category: 'nonveg-starters',
    price: 250,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/chicken fry boneless starter.jpg',
    description: 'Boneless chicken cubes fried crispy and seasoned with southern masala.'
  },
  {
    id: 'magestic-chicken',
    name: 'Magestic Chicken',
    category: 'nonveg-starters',
    price: 300,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/magestic chicken starter.jpg',
    description: 'Strips of fried chicken tossed in a creamy, spicy yoghurt-based sauce with curry leaves.'
  },
  {
    id: 'punjabi-chicken-starter',
    name: 'Punjabi Chicken Starter',
    category: 'nonveg-starters',
    price: 280,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/punjabi chicken curry.jpg',
    isFallback: true,
    description: 'Robust north-Indian styled roasted chicken strips tossed in garam masala.'
  },
  {
    id: 'rr-chicken',
    name: 'R.R. Chicken',
    category: 'nonveg-starters',
    price: 300,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/rr chicken starter.jpg',
    description: 'A spicy red chicken fry tossed with crushed green chilies and cashew nuts.'
  },
  {
    id: 'lollipop-fry',
    name: 'Lollipop Fry',
    category: 'nonveg-starters',
    price: 250,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/lollipop fry chicken.jpg',
    description: 'Crispy deep-fried chicken lollipops served with hot schezwan sauce.'
  },
  {
    id: 'leg-piece-roast',
    name: 'Leg Peace Roast',
    category: 'nonveg-starters',
    price: 250,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/leg peace roast starter.jpg',
    description: 'Whole chicken drumsticks marinated and roasted on a flat pan with spices.'
  },
  {
    id: 'lollipop-roast',
    name: 'Lollipop Roast',
    category: 'nonveg-starters',
    price: 200,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/lollipop roast starter.jpg',
    description: 'Chicken lollipops pan-roasted in a sticky, sweet-and-spicy masala mix.'
  },
  {
    id: 'pepper-chicken',
    name: 'Pepper Chicken',
    category: 'nonveg-starters',
    price: 280,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/pepper chicken starter.jpg',
    description: 'Deep-fried chicken pieces stir-fried with crushed black pepper and onions.'
  },
  {
    id: 'dragon-chicken',
    name: 'Dragon Chicken',
    category: 'nonveg-starters',
    price: 280,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/dragon chicken starter.jpg',
    description: 'Indo-Chinese dry starter featuring chicken strips, cashew nuts, and bell peppers in chili sauce.'
  },
  {
    id: 'tiger-chicken',
    name: 'Tiger Chicken',
    category: 'nonveg-starters',
    price: 280,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/chicken fry bone starter.jpg',
    isFallback: true,
    description: 'Spicy shredded chicken starter with red and green chilies, deep fried.'
  },
  {
    id: 'hyderabad-chicken',
    name: 'Hydrabad Chicken',
    category: 'nonveg-starters',
    price: 280,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/hydrabad spicy chicken curry.jpg',
    isFallback: true,
    description: 'Spicy dry chicken starter tossed in Hyderabadi curd and curry leaf masala.'
  },
  {
    id: 'ipl-grilled-chicken',
    name: 'IPL Grilled Chicken',
    category: 'nonveg-starters',
    price: 300,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/chicken fry bone starter.jpg',
    isFallback: true,
    description: 'House special whole chicken pieces grilled with fire and butter.'
  },
  {
    id: 'bone-roast-chicken',
    name: 'Bone Roast Chicken',
    category: 'nonveg-starters',
    price: 250,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/boneless roast chicken curry.jpg',
    isFallback: true,
    description: 'Bone-in chicken drumsticks slow-roasted in a heavy cast iron pan.'
  },

  // --- NON-VEG CURRIES ---
  {
    id: 'ipl-special-chicken',
    name: 'IPL Special Chicken',
    category: 'nonveg-curries',
    price: 300,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/andhra chicken curry.jpg',
    isFallback: true,
    description: 'Our signature spicy chicken curry, cooked with ground home spices and cashew paste.'
  },
  {
    id: 'bullet-chicken',
    name: 'Bullet Chicken',
    category: 'nonveg-curries',
    price: 300,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/andhra chicken curry.jpg',
    isFallback: true,
    description: 'Extra hot chicken curry cooked with bullet green chilies and dark spices.'
  },
  {
    id: 'punjabi-chicken-curry',
    name: 'Panjabi Chicken',
    category: 'nonveg-curries',
    price: 280,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/punjabi chicken curry.jpg',
    description: 'Robust chicken curry cooked in an onion-tomato base with Punjabi spices.'
  },
  {
    id: 'chicken-555',
    name: 'Chicken 555',
    category: 'nonveg-curries',
    price: 300,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/chicken 555 curry.jpg',
    description: 'Creamy and spicy chicken curry cooked with yoghurt, capsicum, and cashew paste.'
  },
  {
    id: 'mogalai-chicken',
    name: 'Mogalai Chicken',
    category: 'nonveg-curries',
    price: 250,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/mogalai chicken curry.jpg',
    description: 'Rich and mild chicken curry cooked with egg whites, cashew cream, and saffron.'
  },
  {
    id: 'butter-chicken',
    name: 'Butter Chicken',
    category: 'nonveg-curries',
    price: 250,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/butter chicken curry.jpg',
    description: 'Tender chicken pieces cooked in a creamy, sweet, and buttery tomato gravy.'
  },
  {
    id: 'indian-chicken',
    name: 'Indian Chicken',
    category: 'nonveg-curries',
    price: 270,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/indian chicken curry.jpg',
    description: 'Home-style Indian chicken curry, mildly spiced and garnished with fresh coriander.'
  },
  {
    id: 'hyderabad-spicy',
    name: 'Hydarabad Spicy',
    category: 'nonveg-curries',
    price: 300,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/hydrabad spicy chicken curry.jpg',
    description: 'Fiery chicken curry cooked with local red chilies, tamarind, and coconut paste.'
  },
  {
    id: 'ramba-chicken',
    name: 'Ramba Chicken',
    category: 'nonveg-curries',
    price: 250,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/rambha chicken curry.jpg',
    description: 'Chef\'s special green chicken curry cooked with mint, coriander, and spinach paste.'
  },
  {
    id: 'bone-kadai',
    name: 'Bone Kadai',
    category: 'nonveg-curries',
    price: 280,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/kadai chicken curry.jpg',
    description: 'Bone-in chicken tossed with bell peppers and whole spices in a kadai masala.'
  },
  {
    id: 'boneless-kadai',
    name: 'Boneless Kadai',
    category: 'nonveg-curries',
    price: 280,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/boneless kadai chicken curry.jpg',
    description: 'Boneless chicken cubes cooked with capsicum, onion, and fresh kadai masala.'
  },
  {
    id: 'nellore-chicken',
    name: 'Nellore Chicken',
    category: 'nonveg-curries',
    price: 300,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/nellore chicken curry.jpg',
    description: 'Traditional spicy coastal Andhra chicken curry flavored with local tamarind and spices.'
  },
  {
    id: 'andhra-chicken',
    name: 'Andhra Chicken',
    category: 'nonveg-curries',
    price: 250,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/andhra chicken curry.jpg',
    description: 'Classic hot and spicy chicken curry cooked in Andhra style with dry coconut.'
  },
  {
    id: 'boneless-roast-chicken',
    name: 'Boneless Roast Chicken',
    category: 'nonveg-curries',
    price: 250,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/boneless roast chicken curry.jpg',
    description: 'Boneless chicken chunks pan-roasted with spicy thick gravy until dry.'
  },

  // --- BIRIYANI & RICE ITEMS ---
  {
    id: 'biryani-boneless',
    name: 'Biriyani (Boneless)',
    category: 'biryani-rice',
    price: 250,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/biryani boneless.jpg',
    description: 'Aromatic basmati rice cooked with boneless chicken pieces, served with raita.'
  },
  {
    id: 'biryani-bone',
    name: 'Biriyani (Bone)',
    category: 'biryani-rice',
    price: 220,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/chicken bone.jpg',
    description: 'Traditional basmati rice layered with bone-in chicken curry, steamed slow.'
  },
  {
    id: 'plavu-rice',
    name: 'Plavu Rice',
    category: 'biryani-rice',
    price: 120,
    foodType: 'veg',
    image: './IPL DHABA ITEMS/plavu rice.jpg',
    description: 'Fragrant ghee-rice cooked with mild spices, bay leaves, and green peas.'
  },
  {
    id: 'egg-rice',
    name: 'Egg Rice',
    category: 'biryani-rice',
    price: 100,
    foodType: 'egg',
    image: './IPL DHABA ITEMS/egg rice.jpg',
    description: 'Fluffy rice stir-fried with eggs, vegetables, pepper, and soy sauce.'
  },
  {
    id: 'chicken-rice',
    name: 'Chicken Rice',
    category: 'biryani-rice',
    price: 150,
    foodType: 'non_veg',
    image: './IPL DHABA ITEMS/chicken fried rice.jpg',
    description: 'Indo-Chinese chicken fried rice tossed with egg, vegetables, and chicken bits.'
  },
  {
    id: 'zeera-rice',
    name: 'Zeera Rice',
    category: 'biryani-rice',
    price: 130,
    foodType: 'veg',
    image: './IPL DHABA ITEMS/jeera rice.jpg',
    description: 'Basmati rice cooked with ghee and heavily tempered with cumin seeds.'
  },
  {
    id: 'cashew-rice',
    name: 'Cashew Rice',
    category: 'biryani-rice',
    price: 200,
    foodType: 'veg',
    image: './IPL DHABA ITEMS/cashew rice.jpg',
    description: 'Mildly sweet rich rice loaded with golden pan-fried cashew nuts.'
  },
  {
    id: 'vegetable-rice',
    name: 'Vegetable Rice',
    category: 'biryani-rice',
    price: 160,
    foodType: 'veg',
    image: './IPL DHABA ITEMS/vegetable rice.jpg',
    description: 'Rice stir-fried with fresh farm vegetables and basic seasonings.'
  },
  {
    id: 'pulka',
    name: 'Pulka',
    category: 'biryani-rice',
    price: 10,
    foodType: 'veg',
    image: './IPL DHABA ITEMS/pulka.jpg',
    description: 'Soft, oil-free whole wheat Indian flatbread cooked on direct flame.'
  },
  {
    id: 'roti',
    name: 'Roti',
    category: 'biryani-rice',
    price: 10,
    foodType: 'veg',
    image: './IPL DHABA ITEMS/pulka.jpg',
    description: 'Soft, traditional whole wheat flatbread baked fresh.'
  }
];

/* ==========================================================================
   3. STATE MANAGEMENT
   ========================================================================== */
const STATE = {
  // Auth
  currentUser: null,           // null | { name, role, token? }

  // Menu Filters
  categories: CATEGORIES,
  menuItems: MENU_DATA,
  activeCategory: 'all',
  searchQuery: '',

  // Cart
  cart: [],

  // Orders (in-memory cache; populated from API or demo mode)
  orders: [],
  currentOrderId: null,

  // Admin Filter
  adminOrderFilter: 'active'
};

// Global references for Leaflet Map
let activeMap = null;
let activeDeliveryMarker = null;

/* ==========================================================================
   3.5. API & REALTIME HELPERS
   ========================================================================== */

async function apiCall(path, options) {
  options = options || {};
  const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
  if (STATE.currentUser && STATE.currentUser.token) {
    headers['Authorization'] = 'Bearer ' + STATE.currentUser.token;
  }
  const res = await fetch(API_BASE + path, Object.assign({}, options, { headers }));
  if (!res.ok) {
    const err = await res.json().catch(function() { return { error: res.statusText }; });
    throw new Error(err.error || ('API error ' + res.status));
  }
  return res.json();
}

async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const tid = setTimeout(function() { controller.abort(); }, 3000);
    const res = await fetch(API_BASE + '/health', { signal: controller.signal });
    clearTimeout(tid);
    BACKEND_ONLINE = res.ok;
    if (BACKEND_ONLINE) console.log('[API] Backend connected:', API_BASE);
  } catch (e) {
    BACKEND_ONLINE = false;
    console.warn('[API] Backend offline — demo mode active.');
  }
}

function updateRealtimeIndicator(isRealtime) {
  var dot  = document.querySelector('.ad-dot');
  var text = document.getElementById('admin-indicator-text');
  if (!dot || !text) return;
  dot.style.background = isRealtime ? 'var(--green)' : 'var(--status-preparing)';
  text.textContent = isRealtime ? 'Realtime' : 'Polling 4s';
}

function initSupabaseRealtime(onOrderChange) {
  if (!SUPABASE_URL || !SUPABASE_ANON) return null;
  if (typeof window.supabase === 'undefined') { console.warn('[Realtime] Supabase SDK not loaded.'); return null; }
  try {
    var client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    supabaseClient = client;
    var channel = client
      .channel('admin-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, onOrderChange)
      .subscribe(function(status) {
        updateRealtimeIndicator(status === 'SUBSCRIBED');
        if (status === 'SUBSCRIBED') console.log('[Realtime] Connected.');
      });
    return channel;
  } catch (e) { console.error('[Realtime]', e.message); return null; }
}

var adminPollInterval = null;
var realtimeChannel   = null;

function startAdminRealtimeOrPolling() {
  if (SUPABASE_URL && SUPABASE_ANON) {
    realtimeChannel = initSupabaseRealtime(async function() {
      if (!BACKEND_ONLINE) return;
      try {
        var data = await apiCall('/api/admin/orders?status=' + STATE.adminOrderFilter);
        mergeAPIOrders(data.orders || []);
        renderAdminDashboard();
      } catch (e) { console.error('[Realtime] reload failed:', e.message); }
    });
    if (realtimeChannel) return;
  }
  updateRealtimeIndicator(false);
  adminPollInterval = setInterval(async function() {
    if (document.body.getAttribute('data-view') !== 'admin') return;
    if (!BACKEND_ONLINE) return;
    try {
      var data = await apiCall('/api/admin/orders?status=' + STATE.adminOrderFilter);
      mergeAPIOrders(data.orders || []);
      renderAdminDashboard();
    } catch (e) { console.warn('[Polling] failed:', e.message); }
  }, 4000);
}

function stopAdminPolling() {
  if (adminPollInterval) { clearInterval(adminPollInterval); adminPollInterval = null; }
  if (realtimeChannel)   { realtimeChannel.unsubscribe(); realtimeChannel = null; }
}

var autoScrollInterval = null;

function renderIPLSpecials() {
  const track = document.getElementById('specials-carousel-track');
  if (!track) return;

  const specialsIds = ['star-chicken', 'ipl-grilled-chicken', 'ipl-special-chicken', 'roti'];
  const specials = MENU_DATA.filter(item => specialsIds.includes(item.id));

  track.innerHTML = specials.map(item => {
    const cartItem = STATE.cart.find(c => c.itemId === item.id);
    const qty = cartItem ? cartItem.qty : 0;
    
    const buttonHtml = qty > 0 
      ? `<div class="mc-stepper">
          <button class="mc-step-btn" data-action="qty-change" data-id="${item.id}" data-delta="-1">−</button>
          <span class="mc-step-qty">${qty}</span>
          <button class="mc-step-btn" data-action="qty-change" data-id="${item.id}" data-delta="1">+</button>
         </div>`
      : `<button class="mc-add-btn" data-action="add-to-cart" data-id="${item.id}">+ Add</button>`;

    return `
      <article class="specials-card">
        <div class="specials-badge">IPL Special</div>
        <div class="mc-img-wrap" data-action="open-details" data-id="${item.id}">
          <img class="mc-img" src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='./placeholder.jpg'; this.onerror=null;">
        </div>
        <div class="mc-info">
          <h3 class="mc-title" data-action="open-details" data-id="${item.id}" style="cursor:pointer;">${item.name}</h3>
          <p class="mc-desc">${item.description}</p>
          <div class="mc-footer">
            <span class="mc-price">₹${item.price}</span>
            ${buttonHtml}
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function initIPLSpecialsCarousel() {
  const prevBtn = document.getElementById('specials-prev-btn');
  const nextBtn = document.getElementById('specials-next-btn');
  const container = document.getElementById('specials-carousel-container');
  if (!container) return;

  if (prevBtn && nextBtn) {
    prevBtn.onclick = () => {
      stopAutoScrollSpecials();
      const card = container.querySelector('.specials-card');
      if (card) {
        const scrollAmount = card.offsetWidth + 16;
        container.scrollLeft -= scrollAmount;
      }
      startAutoScrollSpecials();
    };

    nextBtn.onclick = () => {
      stopAutoScrollSpecials();
      const card = container.querySelector('.specials-card');
      if (card) {
        const scrollAmount = card.offsetWidth + 16;
        if (container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += scrollAmount;
        }
      }
      startAutoScrollSpecials();
    };
  }

  // Auto-scroll logic
  startAutoScrollSpecials();

  // Pause auto-scroll on hover or touch
  container.addEventListener('mouseenter', stopAutoScrollSpecials);
  container.addEventListener('mouseleave', startAutoScrollSpecials);
  container.addEventListener('touchstart', stopAutoScrollSpecials);
  container.addEventListener('touchend', startAutoScrollSpecials);
}

function startAutoScrollSpecials() {
  if (autoScrollInterval) return;
  const container = document.getElementById('specials-carousel-container');
  if (!container) return;

  autoScrollInterval = setInterval(() => {
    const card = container.querySelector('.specials-card');
    if (card) {
      const scrollAmount = card.offsetWidth + 16;
      if (container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += scrollAmount;
      }
    }
  }, 4000);
}

function stopAutoScrollSpecials() {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval);
    autoScrollInterval = null;
  }
}

function mergeAPIOrders(apiOrders) {
  apiOrders.forEach(function(apiOrder) {
    var existing = STATE.orders.find(function(o) { return o.id === apiOrder.id; });
    var mapped = {
      id:           apiOrder.id,
      orderNumber:  apiOrder.order_number,
      customerName: apiOrder.customer_name,
      phone:        apiOrder.phone,
      address:      (apiOrder.delivery_address && apiOrder.delivery_address.address_line) || '',
      instructions: apiOrder.delivery_instructions || '',
      items: (apiOrder.order_items || []).map(function(i) {
        return { itemId: i.menu_item_id, name: i.name, price: i.unit_price, qty: i.quantity };
      }),
      subtotal:    parseFloat(apiOrder.subtotal),
      deliveryFee: parseFloat(apiOrder.delivery_fee),
      total:       parseFloat(apiOrder.total_amount),
      status:      apiOrder.status,
      placedAt:    new Date(apiOrder.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      history:     { placed: new Date(apiOrder.created_at).toLocaleTimeString() },
      deliveryStep: existing ? existing.deliveryStep : 0,
      currentLat:   existing ? existing.currentLat  : RESTAURANT.lat,
      currentLng:   existing ? existing.currentLng  : RESTAURANT.lng,
      _fromAPI:     true
    };
    if (existing) { Object.assign(existing, mapped); } else { STATE.orders.push(mapped); }
  });
}

/* ==========================================================================
   4. UTILITY HELPERS
   ========================================================================== */
function generateOrderId() {
  return 'IPL-' + Math.floor(1000 + Math.random() * 9000);
}

function getSubtotal() {
  return STATE.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function getCartCount() {
  return STATE.cart.reduce((sum, item) => sum + item.qty, 0);
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Get FSSAI badge SVG based on foodType
function getFssaiBadgeSvg(foodType) {
  if (foodType === 'veg') {
    return `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="18" height="18" rx="2" stroke="#1A6B3A" stroke-width="2" fill="#FFFFFF"/>
      <circle cx="10" cy="10" r="5" fill="#1A6B3A"/>
    </svg>`;
  } else if (foodType === 'egg') {
    return `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="18" height="18" rx="2" stroke="#F59E0B" stroke-width="2" fill="#FFFFFF"/>
      <circle cx="10" cy="10" r="5" fill="#F59E0B"/>
    </svg>`;
  } else {
    return `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="18" height="18" rx="2" stroke="#8B5CF6" stroke-width="2" fill="#FFFFFF"/>
      <circle cx="10" cy="10" r="5" fill="#8B5CF6"/>
    </svg>`;
  }
}

/* ==========================================================================
   5. STATE MUTATORS
   ========================================================================== */
function addToCart(itemId) {
  const menuItem = MENU_DATA.find(i => i.id === itemId);
  if (!menuItem) return;

  const existing = STATE.cart.find(c => c.itemId === itemId);
  if (existing) {
    existing.qty++;
  } else {
    STATE.cart.push({
      itemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      qty: 1,
      foodType: menuItem.foodType
    });
  }
  updateCartUI();
}

function updateQty(itemId, delta) {
  const existing = STATE.cart.find(c => c.itemId === itemId);
  if (!existing) return;

  existing.qty += delta;
  if (existing.qty <= 0) {
    STATE.cart = STATE.cart.filter(c => c.itemId !== itemId);
  }
  updateCartUI();
}

function updateCartUI() {
  const count = getCartCount();
  const total = getSubtotal();

  // Update Floating FAB
  const fab = document.getElementById('cart-fab');
  const countSpan = document.getElementById('cart-count');
  const totalSpan = document.getElementById('cart-total');

  if (count > 0) {
    fab.classList.remove('hidden');
    countSpan.textContent = count;
    totalSpan.textContent = total;
  } else {
    fab.classList.add('hidden');
  }

  // Update Drawer Summary totals
  const subtotal = total;
  const delivery = count > 0 ? RESTAURANT.deliveryFee : 0;
  const totalAmount = subtotal + delivery;

  document.getElementById('cart-subtotal').textContent = subtotal;
  document.getElementById('cart-delivery-fee').textContent = delivery;
  document.getElementById('cart-total-amount').textContent = totalAmount;

  // Min Order logic check
  const warning = document.getElementById('cart-warning');
  const placeBtn = document.getElementById('place-order-btn');

  if (count > 0 && subtotal < RESTAURANT.minOrder) {
    const diff = RESTAURANT.minOrder - subtotal;
    warning.style.display = 'block';
    warning.innerHTML = `⚠️ Add <strong>₹${diff}</strong> more to place your order (Subtotal must be min. ₹${RESTAURANT.minOrder})`;
    placeBtn.disabled = true;
  } else {
    warning.style.display = 'none';
    placeBtn.disabled = count === 0;
  }

  // Render items inside drawer
  const itemsContainer = document.getElementById('cart-items');
  if (count === 0) {
    itemsContainer.innerHTML = `<div style="text-align: center; padding: var(--sp-lg) 0; color: var(--muted); font-size: 0.9rem;">Your cart is empty. Add items from the menu to start!</div>`;
  } else {
    itemsContainer.innerHTML = STATE.cart.map(item => {
      const originalItem = MENU_DATA.find(i => i.id === item.itemId);
      const isVegBadge = getFssaiBadgeSvg(item.foodType);

      return `
        <div class="cd-item">
          <div class="cd-item-name-wrap">
            <span class="mc-badge" style="position: static; box-shadow: none; padding: 0;">${isVegBadge}</span>
            <span class="cd-item-name">${item.name}</span>
          </div>
          <div class="cd-item-meta">
            <div class="mc-stepper">
              <button class="mc-step-btn" data-action="qty-change" data-id="${item.itemId}" data-delta="-1">−</button>
              <span class="mc-step-qty">${item.qty}</span>
              <button class="mc-step-btn" data-action="qty-change" data-id="${item.itemId}" data-delta="1">+</button>
            </div>
            <span class="cd-item-price">₹${item.price * item.qty}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Re-render menu grid to update stepper numbers
  renderMenuGrid();
}

function toggleCartDrawer(isOpen) {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (isOpen) {
    drawer.classList.add('open');
    overlay.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
  } else {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
  }
}

async function handlePlaceOrder() {
  const name         = document.getElementById('cust-name').value.trim();
  const phone        = document.getElementById('cust-phone').value.trim();
  const address      = document.getElementById('cust-address').value.trim();
  const instructions = document.getElementById('cust-instructions').value.trim();

  if (!name || !phone || !address) { alert('Please fill all required fields marked with *'); return; }
  if (!/^\d{10}$/.test(phone)) { alert('Please enter a valid 10-digit mobile number'); return; }

  const sub  = getSubtotal();
  const total = sub + RESTAURANT.deliveryFee;
  const btn  = document.getElementById('place-order-btn');
  btn.disabled = true;
  btn.textContent = 'Placing Order...';

  try {
    let orderId;

    if (BACKEND_ONLINE) {
      // ── Real API ───────────────────────────────────────────────────────────
      const data = await apiCall('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          customer_name: name, phone,
          delivery_address: { address_line: address },
          delivery_instructions: instructions || null,
          items: STATE.cart.map(function(c) {
            return { menu_item_id: c.itemId, name: c.name, unit_price: c.price, quantity: c.qty };
          }),
          subtotal: sub, delivery_fee: RESTAURANT.deliveryFee, total_amount: total
        })
      });
      orderId = data.order.id;
      STATE.orders.push({
        id: orderId, orderNumber: data.order.order_number,
        customerName: name, phone, address, instructions,
        items: STATE.cart.slice(), subtotal: sub, deliveryFee: RESTAURANT.deliveryFee, total,
        status: 'placed',
        placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        history: { placed: formatTime(new Date()) },
        deliveryStep: 0, currentLat: RESTAURANT.lat, currentLng: RESTAURANT.lng, _fromAPI: true
      });
    } else {
      // ── Demo mode ─────────────────────────────────────────────────────────
      orderId = generateOrderId();
      STATE.orders.push({
        id: orderId, customerName: name, phone, address, instructions,
        items: STATE.cart.slice(), subtotal: sub, deliveryFee: RESTAURANT.deliveryFee, total,
        status: 'placed',
        placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        history: { placed: formatTime(new Date()) },
        deliveryStep: 0, currentLat: RESTAURANT.lat, currentLng: RESTAURANT.lng
      });
    }

    STATE.cart = [];
    updateCartUI();
    toggleCartDrawer(false);
    document.getElementById('checkout-form').reset();
    location.hash = '#/orders/' + orderId + '/success';

  } catch (err) {
    console.error('[Order] Place failed:', err.message);
    alert('Failed to place order: ' + err.message + '\n\nPlease try again or call ' + RESTAURANT.phone);
    btn.disabled = false;
    btn.textContent = 'Place Order — Cash on Delivery';
  }
}

async function handleStatusChange(orderId, nextStatus) {
  // Optimistic local update
  const order = STATE.orders.find(function(o) { return o.id === orderId; });
  const prevStatus = order ? order.status : null;
  if (order) {
    order.status = nextStatus;
    order.history[nextStatus] = formatTime(new Date());
    if (nextStatus === 'out_for_delivery') simulateDeliveryPath(orderId);
    if (nextStatus === 'delivered') order.deliveredAt = formatTime(new Date());
  }

  // Persist to backend
  if (BACKEND_ONLINE) {
    try {
      await apiCall('/api/orders/' + orderId + '/status', {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus })
      });
    } catch (err) {
      console.error('[Admin] Status update failed:', err.message);
      // Revert optimistic update
      if (order && prevStatus) { order.status = prevStatus; }
      alert('Status update failed: ' + err.message);
    }
  }

  render();
}

/* ==========================================================================
   6. RENDER CUSTOMER VIEWS
   ========================================================================== */
function renderCustomer() {
  // Hide success and tracking views initially
  document.getElementById('order-success').hidden = true;
  document.getElementById('order-tracking').hidden = true;
  document.getElementById('hero').style.display = 'flex';
  document.getElementById('search-bar-wrap').style.display = 'block';
  document.getElementById('category-bar').style.display = 'block';
  document.getElementById('menu-grid').style.display = 'grid';

  // Category Pills
  const catList = document.getElementById('category-list');
  catList.innerHTML = STATE.categories.map(cat => {
    const activeClass = STATE.activeCategory === cat.id ? 'active' : '';
    return `<button class="cb-pill ${activeClass}" data-action="filter-category" data-category="${cat.id}">
      <span>${cat.emoji}</span> ${cat.label}
    </button>`;
  }).join('');

  renderMenuGrid();
}

function renderMenuGrid() {
  const grid = document.getElementById('menu-grid');
  
  // Show/Hide Specials section based on search/category filters
  const specialsSec = document.getElementById('ipl-specials-section');
  if (specialsSec) {
    if (STATE.activeCategory === 'all' && STATE.searchQuery.trim() === '') {
      specialsSec.style.display = 'block';
      renderIPLSpecials();
      if (!autoScrollInterval) {
        initIPLSpecialsCarousel();
      }
    } else {
      specialsSec.style.display = 'none';
      stopAutoScrollSpecials();
    }
  }
  
  // Filter logic
  let items = MENU_DATA;
  if (STATE.activeCategory !== 'all') {
    items = items.filter(i => i.category === STATE.activeCategory);
  }
  if (STATE.searchQuery.trim() !== '') {
    const q = STATE.searchQuery.toLowerCase();
    items = items.filter(i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
  }

  if (items.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: var(--sp-xl) var(--sp-md); color: var(--muted);">
      No dishes found. Try a different category or search term!
    </div>`;
    return;
  }

  grid.innerHTML = items.map(item => {
    const cartItem = STATE.cart.find(c => c.itemId === item.id);
    const qty = cartItem ? cartItem.qty : 0;
    const badgeSvg = getFssaiBadgeSvg(item.foodType);

    const buttonHtml = qty > 0 
      ? `<div class="mc-stepper">
          <button class="mc-step-btn" data-action="qty-change" data-id="${item.id}" data-delta="-1">−</button>
          <span class="mc-step-qty">${qty}</span>
          <button class="mc-step-btn" data-action="qty-change" data-id="${item.id}" data-delta="1">+</button>
         </div>`
      : `<button class="mc-add-btn" data-action="add-to-cart" data-id="${item.id}">+ Add</button>`;

    return `
      <article class="mc-card">
        <div class="mc-img-wrap" data-action="open-details" data-id="${item.id}">
          <div class="mc-badge">${badgeSvg}</div>
          <img class="mc-img" src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='./placeholder.jpg'; this.onerror=null;">
        </div>
        <div class="mc-info">
          <h3 class="mc-title" data-action="open-details" data-id="${item.id}" style="cursor:pointer;">${item.name}</h3>
          <p class="mc-desc">${item.description}</p>
          <div class="mc-footer">
            <span class="mc-price">₹${item.price}</span>
            ${buttonHtml}
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function renderItemDetailsModal(itemId) {
  const item = MENU_DATA.find(i => i.id === itemId);
  if (!item) return;

  const cartItem = STATE.cart.find(c => c.itemId === item.id);
  const qty = cartItem ? cartItem.qty : 0;
  const badgeSvg = getFssaiBadgeSvg(item.foodType);

  const buttonHtml = qty > 0 
    ? `<div class="mc-stepper" style="margin-left:auto;">
        <button class="mc-step-btn" data-action="qty-change" data-id="${item.id}" data-delta="-1">−</button>
        <span class="mc-step-qty">${qty}</span>
        <button class="mc-step-btn" data-action="qty-change" data-id="${item.id}" data-delta="1">+</button>
       </div>`
    : `<button class="mc-add-btn" data-action="add-to-cart" data-id="${item.id}" style="margin-left:auto;">+ Add to Cart</button>`;

  const modal = document.getElementById('detail-modal');
  const overlay = document.getElementById('detail-modal-overlay');

  modal.innerHTML = `
    <div class="cd-header">
      <h2 class="cd-title">Dish Details</h2>
      <button class="cd-close" id="close-detail-modal">&times;</button>
    </div>
    <div class="cd-body" style="padding:0;">
      <div class="mc-img-wrap" style="aspect-ratio:16/9; border-radius:0;">
        <div class="mc-badge">${badgeSvg}</div>
        <img class="mc-img" src="${item.image}" alt="${item.name}" onerror="this.src='./placeholder.jpg'; this.onerror=null;">
      </div>
      <div style="padding: var(--sp-md);">
        <h3 class="success-title" style="text-align:left; font-size:1.4rem; margin-bottom:var(--sp-xs);">${item.name}</h3>
        <p style="color:var(--muted); font-size:0.9rem; margin-bottom:var(--sp-md);">${item.description}</p>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top: 1.5px solid var(--border); padding-top:var(--sp-md);">
          <span style="font-size:1.3rem; font-weight:700;">₹${item.price}</span>
          ${buttonHtml}
        </div>
      </div>
    </div>
  `;

  modal.classList.add('open');
  overlay.classList.add('open');

  document.getElementById('close-detail-modal').onclick = closeDetailModal;
  overlay.onclick = closeDetailModal;
}

function closeDetailModal() {
  document.getElementById('detail-modal').classList.remove('open');
  document.getElementById('detail-modal-overlay').classList.remove('open');
}

function renderOrderSuccess(orderId) {
  // Hide other subviews
  document.getElementById('hero').style.display = 'none';
  document.getElementById('search-bar-wrap').style.display = 'none';
  document.getElementById('category-bar').style.display = 'none';
  document.getElementById('menu-grid').style.display = 'none';
  document.getElementById('cart-fab').classList.add('hidden');

  const specialsSec = document.getElementById('ipl-specials-section');
  if (specialsSec) {
    specialsSec.style.display = 'none';
    stopAutoScrollSpecials();
  }

  const order = STATE.orders.find(o => o.id === orderId);
  const container = document.getElementById('order-success');
  container.hidden = false;

  if (!order) {
    container.innerHTML = `
      <div class="success-card">
        <h2 class="success-title">Order Not Found</h2>
        <p class="success-note">We couldn't locate this order in our session records.</p>
        <a href="#/" class="btn-primary">Return to Menu</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="success-card">
      <div class="success-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <h2 class="success-title">Order Placed!</h2>
      <div class="success-number">Order ID: #${order.id}</div>
      <p class="success-note">
        Thank you, <strong>${order.customerName}</strong>! Your order is being confirmed.<br>
        📧 Check your email for your digital receipt.
      </p>
      <div style="background:var(--cream); padding:var(--sp-md); border-radius:var(--r-md); text-align:left; margin-bottom:var(--sp-lg); border:1.5px solid var(--border);">
        <h4 style="margin-bottom:var(--sp-xs); font-size:0.95rem;">Delivery Summary</h4>
        <p style="font-size:0.85rem; color:var(--muted); line-height:1.4;">
          <strong>Address:</strong> ${order.address}<br>
          <strong>Total Amount:</strong> ₹${order.total} (Cash on Delivery)<br>
          <strong>Est. Delivery Time:</strong> 30 - 45 mins
        </p>
      </div>
      <div class="success-btns">
        <a href="#/orders/${order.id}" class="btn-primary">Track Order Realtime</a>
        <a href="#/" class="btn-secondary">New Order</a>
      </div>
    </div>
  `;
}

function renderTracking(orderId) {
  // Hide other subviews
  document.getElementById('hero').style.display = 'none';
  document.getElementById('search-bar-wrap').style.display = 'none';
  document.getElementById('category-bar').style.display = 'none';
  document.getElementById('menu-grid').style.display = 'none';
  document.getElementById('cart-fab').classList.add('hidden');

  const specialsSec = document.getElementById('ipl-specials-section');
  if (specialsSec) {
    specialsSec.style.display = 'none';
    stopAutoScrollSpecials();
  }

  const order = STATE.orders.find(o => o.id === orderId);
  const container = document.getElementById('order-tracking');
  container.hidden = false;

  if (!order) {
    container.innerHTML = `
      <div class="success-card">
        <h2 class="success-title">Order Not Found</h2>
        <p class="success-note">We couldn't find order ID #${orderId}.</p>
        <a href="#/" class="btn-primary">Go to Home</a>
      </div>
    `;
    return;
  }

  // Determine timeline steps
  const steps = [
    { key: 'placed', label: 'Order Placed', sub: order.placedAt },
    { key: 'confirmed', label: 'Order Confirmed', sub: order.history.confirmed || 'Awaiting confirmation' },
    { key: 'preparing', label: 'Kitchen Preparing', sub: order.history.preparing || 'Coming up next' },
    { key: 'out_for_delivery', label: 'Out for Delivery', sub: order.history.out_for_delivery || 'Out for dispatch' },
    { key: 'delivered', label: 'Delivered', sub: order.deliveredAt || 'Fresh & Hot' }
  ];

  if (order.status === 'cancelled') {
    steps.push({ key: 'cancelled', label: 'Order Cancelled', sub: order.history.cancelled || 'Reason: Kitchen Closed' });
  }

  const currentStatusIdx = STATUS_ORDER.indexOf(order.status);

  let timelineHtml = steps.map((step, idx) => {
    let stepClass = '';
    
    if (order.status === 'cancelled') {
      if (step.key === 'cancelled') {
        stepClass = 'active';
      } else {
        stepClass = 'completed';
      }
    } else {
      if (idx < currentStatusIdx) {
        stepClass = 'completed';
      } else if (idx === currentStatusIdx) {
        stepClass = 'active';
      }
    }

    return `
      <div class="timeline-step ${stepClass}">
        <div class="timeline-dot"></div>
        <div class="timeline-label">${step.label}</div>
        <div class="timeline-sub">${step.sub}</div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="tracking-card">
      <div class="tracking-header">
        <h2 class="tracking-title">Track Order #${order.id}</h2>
        <span class="tracking-time">Status: <strong>${order.status.replace('_', ' ').toUpperCase()}</strong></span>
      </div>

      <!-- Timeline -->
      <div class="timeline">
        ${timelineHtml}
      </div>

      <!-- Map Display Container -->
      <div class="map-wrap" id="map-wrap-container">
        <!-- Leaflet map canvas container -->
        <div id="tracking-map"></div>
      </div>

      <!-- Restaurant details -->
      <div class="track-rest-card">
        <div>
          <div class="track-rest-name">${RESTAURANT.name}</div>
          <div class="track-rest-phone">📞 Help Desk: ${RESTAURANT.phone}</div>
        </div>
        <a href="tel:${RESTAURANT.phone}" class="track-call-btn">
          Call Restaurant
        </a>
      </div>
      
      <div style="text-align: center; margin-top: var(--sp-lg);">
        <a href="#/" class="btn-secondary">&larr; Back to Menu</a>
      </div>
    </div>
  `;

  // Initialize Map
  setTimeout(() => initMap(order), 50);
}

/* ==========================================================================
   7. LEAFLET MAP & SIMULATION
   ========================================================================== */
function initMap(order) {
  const mapElement = document.getElementById('tracking-map');
  if (!mapElement) return;

  // Clear map container if map is already active to prevent errors
  if (activeMap) {
    try {
      activeMap.remove();
    } catch(e) {}
    activeMap = null;
    activeDeliveryMarker = null;
  }

  // Check if Leaflet is loaded
  if (typeof L === 'undefined') {
    renderMapFallback();
    return;
  }

  try {
    // Setup Map centered on restaurant
    activeMap = L.map('tracking-map', {
      zoomControl: false,
      scrollWheelZoom: false
    }).setView([RESTAURANT.lat, RESTAURANT.lng], 14);

    // Load OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(activeMap);

    // Custom Icon for Restaurant
    const restIcon = L.divIcon({
      html: `<div style="background:var(--saffron); width:12px; height:12px; border-radius:50%; border:2px solid #fff; box-shadow:0 0 10px rgba(255,107,0,0.5);"></div>`,
      className: 'custom-leaflet-icon'
    });

    // Add Restaurant Pin
    L.marker([RESTAURANT.lat, RESTAURANT.lng], { icon: restIcon })
      .addTo(activeMap)
      .bindPopup(`<strong>${RESTAURANT.name}</strong><br>Where cooking hits a six!`)
      .openPopup();

    // If order is out for delivery, show the driver marker
    if (order.status === 'out_for_delivery') {
      const driverIcon = L.divIcon({
        html: `<div style="background:var(--status-out_for_delivery); width:16px; height:16px; border-radius:50%; border:3px solid #fff; box-shadow:0 0 10px rgba(139,92,246,0.6); animation:pulseDot 1s infinite;"></div>`,
        className: 'custom-leaflet-icon'
      });

      activeDeliveryMarker = L.marker([order.currentLat, order.currentLng], { icon: driverIcon }).addTo(activeMap);
      activeMap.setView([order.currentLat, order.currentLng], 15);
    } else if (order.status === 'delivered') {
      // Show delivered pin at end location
      const destIcon = L.divIcon({
        html: `<div style="background:var(--green); width:12px; height:12px; border-radius:50%; border:2px solid #fff;"></div>`,
        className: 'custom-leaflet-icon'
      });
      const endLat = RESTAURANT.lat + 0.0062;
      const endLng = RESTAURANT.lng + 0.0088;
      L.marker([endLat, endLng], { icon: destIcon }).addTo(activeMap);
      activeMap.setView([endLat, endLng], 14);
    }
  } catch (error) {
    console.error("Map initialization failed:", error);
    renderMapFallback();
  }
}

function renderMapFallback() {
  const container = document.getElementById('map-wrap-container');
  if (container) {
    container.innerHTML = `
      <div class="map-offline">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
        <strong>Simulated Live Map Offline</strong>
        <p style="font-size:0.75rem; margin-top:2px;">Check your connection. Delivery timeline status above is still active.</p>
      </div>
    `;
  }
}

function simulateDeliveryPath(orderId) {
  const order = STATE.orders.find(o => o.id === orderId);
  if (!order || order.status !== 'out_for_delivery') return;

  if (order.simulationIntervalId) return; // already active

  const startLat = RESTAURANT.lat;
  const startLng = RESTAURANT.lng;
  const endLat = startLat + 0.0062; // roughly 1.5km
  const endLng = startLng + 0.0088;

  order.deliveryStep = order.deliveryStep || 0;

  order.simulationIntervalId = setInterval(() => {
    order.deliveryStep++;

    const fraction = order.deliveryStep / 8;
    const currentLat = startLat + (endLat - startLat) * fraction;
    const currentLng = startLng + (endLng - startLng) * fraction;

    order.currentLat = currentLat;
    order.currentLng = currentLng;

    // Update marker directly if user is viewing this tracking screen
    if (location.hash === `#/orders/${orderId}` && activeMap && activeDeliveryMarker) {
      activeDeliveryMarker.setLatLng([currentLat, currentLng]);
      activeMap.panTo([currentLat, currentLng]);
    }

    if (order.deliveryStep >= 8) {
      clearInterval(order.simulationIntervalId);
      order.simulationIntervalId = null;
      order.status = 'delivered';
      order.deliveredAt = formatTime(new Date());
      order.history.delivered = order.deliveredAt;

      // Force render if viewing order tracking, admin, or delivery
      if (
        location.hash === `#/orders/${orderId}` || 
        location.hash === '#/admin' || 
        location.hash === '#/delivery'
      ) {
        render();
      }
    }
  }, 11000); // 8 steps over 88-90s
}

/* ==========================================================================
   8. RENDER ADMIN VIEWS
   ========================================================================== */
function renderAdminDashboard() {
  // Update header info
  document.getElementById('admin-user-name').textContent = STATE.currentUser.name;

  // Calculate stats
  const totalOrders = STATE.orders.length;
  const totalRev = STATE.orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = STATE.orders
    .filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;
  const completedOrders = STATE.orders
    .filter(o => o.status === 'delivered').length;

  const statsContainer = document.getElementById('ad-stats-container');
  statsContainer.innerHTML = `
    <div class="ad-stat-card orders">
      <div class="ad-stat-label">Total Orders</div>
      <div class="ad-stat-value">${totalOrders}</div>
    </div>
    <div class="ad-stat-card revenue">
      <div class="ad-stat-label">Total Revenue</div>
      <div class="ad-stat-value">₹${totalRev}</div>
    </div>
    <div class="ad-stat-card pending">
      <div class="ad-stat-label">Pending Orders</div>
      <div class="ad-stat-value">${pendingOrders}</div>
    </div>
    <div class="ad-stat-card done">
      <div class="ad-stat-label">Delivered Today</div>
      <div class="ad-stat-value">${completedOrders}</div>
    </div>
  `;

  // Set active tab styling
  document.querySelectorAll('#order-tabs .ad-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === STATE.adminOrderFilter);
  });

  // Filter orders
  let filtered = STATE.orders;
  if (STATE.adminOrderFilter === 'active') {
    filtered = STATE.orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  } else if (STATE.adminOrderFilter === 'completed') {
    filtered = STATE.orders.filter(o => o.status === 'delivered');
  } else if (STATE.adminOrderFilter === 'cancelled') {
    filtered = STATE.orders.filter(o => o.status === 'cancelled');
  }

  const listContainer = document.getElementById('admin-order-list');
  if (filtered.length === 0) {
    listContainer.innerHTML = `<div style="text-align:center; padding:var(--sp-xl); border:1.5px solid var(--border); border-radius:var(--r-md); background:#fff; color:var(--muted);">No orders found under this tab.</div>`;
    return;
  }

  // Render cards sorted descending by time (newest first)
  listContainer.innerHTML = [...filtered].reverse().map(order => {
    const itemsListHtml = order.items.map(item => `
      <div class="oc-item-row">
        <span><span class="oc-item-qty">${item.qty}x</span> ${item.name}</span>
        <span>₹${item.price * item.qty}</span>
      </div>
    `).join('');

    // Status options dropdown
    const optionsHtml = STATUS_ORDER.map(status => {
      const selected = order.status === status ? 'selected' : '';
      const displayStatus = status.replace('_', ' ').toUpperCase();
      return `<option value="${status}" ${selected}>${displayStatus}</option>`;
    }).join('') + `<option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>CANCELLED</option>`;

    return `
      <div class="oc-card">
        <div class="oc-header">
          <div>
            <span class="oc-number">#${order.id}</span>
            <span class="oc-time">placed at ${order.placedAt}</span>
          </div>
          <span class="cb-pill active badge-${order.status}" style="font-size:0.75rem; padding: 4px 10px; border:none; box-shadow:none;">
            ${order.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <div class="oc-meta">
          Customer: <strong>${order.customerName}</strong> | Phone: <strong>${order.phone}</strong>
        </div>
        <div class="oc-address">
          📍 Address: ${order.address}
          ${order.instructions ? `<br><small style="color:var(--muted)">Instructions: ${order.instructions}</small>` : ''}
        </div>
        <div class="oc-items-list">
          ${itemsListHtml}
        </div>
        <div class="oc-footer">
          <div class="oc-total">Total: ₹${order.total}</div>
          <div class="oc-status-wrap">
            <span style="font-size:0.75rem; color:var(--muted); font-weight:600;">Update:</span>
            <select class="oc-status-select" data-order-id="${order.id}">
              ${optionsHtml}
            </select>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach status change events directly to select dropdowns
  document.querySelectorAll('.oc-status-select').forEach(select => {
    select.onchange = (e) => {
      const orderId = e.target.dataset.orderId;
      const nextStatus = e.target.value;
      handleStatusChange(orderId, nextStatus);
    };
  });
}

/* ==========================================================================
   9. RENDER DELIVERY STAFF VIEW
   ========================================================================== */
function renderDelivery() {
  document.getElementById('delivery-user-name').textContent = STATE.currentUser.name;

  // Filter orders out for delivery
  const assigned = STATE.orders.filter(o => o.status === 'out_for_delivery');

  const container = document.getElementById('delivery-order-list');
  if (assigned.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:var(--sp-xl); border:1.5px solid var(--border); border-radius:var(--r-md); background:#fff; color:var(--muted);">No active deliveries assigned to you right now.</div>`;
    return;
  }

  container.innerHTML = assigned.map(order => {
    return `
      <div class="dl-order-card">
        <div class="dl-order-title">Delivery #${order.id}</div>
        <div class="dl-field">Customer: <strong>${order.customerName}</strong></div>
        <div class="dl-field">Phone: <strong><a href="tel:${order.phone}" style="color:var(--saffron); text-decoration:underline;">${order.phone}</a></strong></div>
        <div class="dl-address-box">
          📍 Address:<br><strong>${order.address}</strong>
          ${order.instructions ? `<br><small style="color:var(--muted); font-weight:500;">Instructions: ${order.instructions}</small>` : ''}
        </div>
        <div class="dl-field" style="margin-bottom:var(--sp-sm)">Total Amount (Collect cash): <strong style="font-size:1rem; color:var(--green);">₹${order.total}</strong></div>
        <button class="dl-btn-advance" data-action="delivery-advance" data-order-id="${order.id}">
          Mark Delivered (Cash Collected)
        </button>
      </div>
    `;
  }).join('');
}

/* ==========================================================================
   10. ROUTER
   ========================================================================== */
function router() {
  const hash = location.hash;

  // Hide success and tracking blocks from general view
  document.getElementById('order-success').hidden = true;
  document.getElementById('order-tracking').hidden = true;

  // Views references
  const views = {
    customer: document.getElementById('view-customer'),
    login: document.getElementById('view-admin-login'),
    admin: document.getElementById('view-admin'),
    delivery: document.getElementById('view-delivery')
  };

  // Close modals when navigating
  closeDetailModal();
  toggleCartDrawer(false);

  // Guards & routing logic
  if (hash === '' || hash === '#/') {
    document.body.setAttribute('data-view', 'customer');
    renderCustomer();
  } else if (hash.startsWith('#/orders/') && hash.endsWith('/success')) {
    const parts = hash.split('/');
    const orderId = parts[2];
    document.body.setAttribute('data-view', 'customer');
    renderOrderSuccess(orderId);
  } else if (hash.startsWith('#/orders/')) {
    const parts = hash.split('/');
    const orderId = parts[2];
    document.body.setAttribute('data-view', 'customer');
    renderTracking(orderId);
  } else if (hash === '#/admin/login') {
    if (STATE.currentUser) {
      location.hash = STATE.currentUser.role === 'admin' ? '#/admin' : '#/delivery';
      return;
    }
    document.body.setAttribute('data-view', 'admin-login');
  } else if (hash === '#/admin') {
    // Admin Guard
    if (!STATE.currentUser || STATE.currentUser.role !== 'admin') {
      location.hash = '#/admin/login';
      return;
    }
    document.body.setAttribute('data-view', 'admin');
    renderAdminDashboard();
  } else if (hash === '#/delivery') {
    // Delivery Guard
    if (!STATE.currentUser || STATE.currentUser.role !== 'delivery') {
      location.hash = '#/admin/login';
      return;
    }
    document.body.setAttribute('data-view', 'delivery');
    renderDelivery();
  } else {
    // Redirect 404 to customer home
    location.hash = '#/';
  }
}

// Master Render trigger
function render() {
  router();
}

/* ==========================================================================
   11. EVENT DELEGATION
   ========================================================================== */
function init() {
  // Hash listener
  window.addEventListener('hashchange', router);

  // Click delegator
  document.addEventListener('click', e => {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;

    const action = actionEl.dataset.action;
    const id = actionEl.dataset.id;

    if (action === 'add-to-cart') {
      addToCart(id);
    } else if (action === 'qty-change') {
      const delta = parseInt(actionEl.dataset.delta, 10);
      updateQty(id, delta);
    } else if (action === 'open-cart') {
      toggleCartDrawer(true);
    } else if (action === 'close-cart') {
      toggleCartDrawer(false);
    } else if (action === 'open-details') {
      renderItemDetailsModal(id);
    } else if (action === 'filter-category') {
      STATE.activeCategory = actionEl.dataset.category;
      renderCustomer();
    } else if (action === 'filter-tab') {
      STATE.adminOrderFilter = actionEl.dataset.tab;
      renderAdminDashboard();
    } else if (action === 'delivery-advance') {
      const orderId = actionEl.dataset.orderId;
      handleStatusChange(orderId, 'delivered');
    } else if (action === 'logout') {
      STATE.currentUser = null;
      location.hash = '#/admin/login';
    }
  });

  // Search input change
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    // Simple 150ms debounce
    let debounceTimer;
    searchInput.addEventListener('input', e => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        STATE.searchQuery = e.target.value;
        renderMenuGrid();
      }, 150);
    });
  }

  // Checkout Form Submission
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', e => {
      e.preventDefault();
      handlePlaceOrder();
    });
  }

  // Login Form Submission
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const email     = document.getElementById('login-email').value.trim();
      const pass      = document.getElementById('login-password').value;
      const errorDiv  = document.getElementById('login-error');
      const submitBtn = loginForm.querySelector('button[type=submit]');

      submitBtn.disabled = true;
      submitBtn.textContent = 'Logging in...';
      errorDiv.style.display = 'none';

      // Try Supabase Auth if client is available
      if (supabaseClient) {
        try {
          const result = await supabaseClient.auth.signInWithPassword({ email, password: pass });
          if (result.error) throw result.error;
          const role = (result.data.user.app_metadata && result.data.user.app_metadata.role)
            || (result.data.user.user_metadata && result.data.user.user_metadata.role)
            || 'admin';
          STATE.currentUser = {
            name: email.split('@')[0], email, role,
            token: result.data.session.access_token
          };
          startAdminRealtimeOrPolling();
          location.hash = role === 'admin' ? '#/admin' : '#/delivery';
          return;
        } catch (err) {
          console.warn('[Auth] Supabase login failed, trying local fallback:', err.message);
        }
      }

      // Fallback: hardcoded demo credentials
      const user = ADMIN_USERS.find(function(u) { return u.email === email && u.password === pass; });
      if (user) {
        STATE.currentUser = user;
        startAdminRealtimeOrPolling();
        location.hash = user.role === 'admin' ? '#/admin' : '#/delivery';
      } else {
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Invalid email or password. Please try again.';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
      }
    });
  }

  // Initial trigger
  router();

  // Check backend availability on startup
  checkBackendHealth();
}

// Kickstart when DOM is loaded
window.addEventListener('DOMContentLoaded', init);
