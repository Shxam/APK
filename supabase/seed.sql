-- =============================================================================
-- IPL Dhaba — Seed Data
-- Run AFTER 001_schema.sql and 002_rls.sql
-- Seeds all 8 categories and 75 menu items
-- =============================================================================

-- ── CATEGORIES ────────────────────────────────────────────────────────────────
INSERT INTO categories (id, name, emoji, sort_order, is_active) VALUES
  ('11111111-0001-0001-0001-000000000001', 'Veg Curries',      '🥘', 1, true),
  ('11111111-0001-0001-0001-000000000002', 'Egg Curries',      '🍳', 2, true),
  ('11111111-0001-0001-0001-000000000003', 'Fish & Prawns',    '🦐', 3, true),
  ('11111111-0001-0001-0001-000000000004', 'Mutton',           '🍖', 4, true),
  ('11111111-0001-0001-0001-000000000005', 'Non-Veg Starters', '🍗', 5, true),
  ('11111111-0001-0001-0001-000000000006', 'Non-Veg Curries',  '🍛', 6, true),
  ('11111111-0001-0001-0001-000000000007', 'Biryani & Rice',   '🍚', 7, true),
  ('11111111-0001-0001-0001-000000000008', 'Breads',           '🫓', 8, true)
ON CONFLICT (id) DO NOTHING;

-- ── MENU ITEMS ────────────────────────────────────────────────────────────────

-- VEG CURRIES
INSERT INTO menu_items (category_id, name, description, price, image_url, food_type, sort_order) VALUES
('11111111-0001-0001-0001-000000000001', 'Paneer Butter Masala',  'Soft cubes of paneer cooked in a rich, buttery, and mildly sweet tomato gravy.',                          220, './IPL DHABA ITEMS/paneer butter masala.jpg', 'veg', 1),
('11111111-0001-0001-0001-000000000001', 'Dal Tomato',            'Yellow lentils cooked with fresh tomatoes, tempered with mustard seeds and curry leaves.',               120, './IPL DHABA ITEMS/dal tomato curry.jpg',      'veg', 2),
('11111111-0001-0001-0001-000000000001', 'Chana Masala',          'Chickpeas simmered in a spiced onion-tomato gravy with fragrant Indian herbs.',                          120, './IPL DHABA ITEMS/chana masala curry.jpg',    'veg', 3),
('11111111-0001-0001-0001-000000000001', 'Methi Chamman',         'A Kashmiri specialty featuring grated paneer and fresh fenugreek leaves in a creamy spinach base.',      250, './IPL DHABA ITEMS/methi chaman curry.jpg',   'veg', 4),
('11111111-0001-0001-0001-000000000001', 'Kaju Curry',            'Roasted cashew nuts simmered in a rich, creamy, and heavily spiced cashew-paste gravy.',                 250, './IPL DHABA ITEMS/kaju curry.jpg',            'veg', 5),
('11111111-0001-0001-0001-000000000001', 'Kaju Mushroom',         'Fresh mushrooms and roasted cashews cooked together in a spiced aromatic sauce.',                         250, './IPL DHABA ITEMS/kaju mushroom curry.jpg',  'veg', 6),
('11111111-0001-0001-0001-000000000001', 'Kadai Paneer',          'Paneer cubes tossed with bell peppers and onions in a freshly ground kadai spice masala.',               280, './IPL DHABA ITEMS/kadai panner curry.jpg',   'veg', 7),
('11111111-0001-0001-0001-000000000001', 'Mushroom Curry',        'Button mushrooms simmered in a thick onion-tomato gravy with warm spices.',                               220, './IPL DHABA ITEMS/mushroom curry.jpg',        'veg', 8),
('11111111-0001-0001-0001-000000000001', 'Jaipur Special Curry',  'Chef''s signature mixed vegetable curry cooked with local Rajasthani spices and cream.',                 230, './IPL DHABA ITEMS/jaipur special curry.jpg',  'veg', 9),
('11111111-0001-0001-0001-000000000001', 'Palak Paneer',          'Soft paneer cubes in a smooth, vibrant, and mildly spiced spinach puree.',                               180, './IPL DHABA ITEMS/palak panner curry.jpg',   'veg', 10),
('11111111-0001-0001-0001-000000000001', 'Dal Thadka',            'Classic yellow dal tempered with ghee, garlic, red chillies, and cumin seeds.',                          100, './IPL DHABA ITEMS/dal thadaka curry.jpg',    'veg', 11),
('11111111-0001-0001-0001-000000000001', 'Plain Palak',           'Smooth and nutritious pureed spinach tempered with garlic and cumin.',                                    100, './IPL DHABA ITEMS/plain palak curry.jpg',    'veg', 12),
('11111111-0001-0001-0001-000000000001', 'Tomato Curry',          'Tangy and spicy Andhra style tomato gravy, best enjoyed with Pulka.',                                    100, './IPL DHABA ITEMS/tomato curry.jpg',          'veg', 13);

-- EGG CURRIES
INSERT INTO menu_items (category_id, name, description, price, image_url, food_type, sort_order) VALUES
('11111111-0001-0001-0001-000000000002', 'Egg Curry',   'Boiled eggs simmered in a classic, home-style onion-tomato gravy.',                                   120, './IPL DHABA ITEMS/egg curry.jpg',       'egg', 1),
('11111111-0001-0001-0001-000000000002', 'Egg Keema',   'Finely chopped boiled eggs cooked with onions, tomatoes, and ground spices.',                        100, './IPL DHABA ITEMS/egg keema.jpg',       'egg', 2),
('11111111-0001-0001-0001-000000000002', 'Egg Burji',   'Scrambled eggs stir-fried with onions, green chillies, and fresh coriander leaves.',                100, './IPL DHABA ITEMS/egg burji curry.jpg', 'egg', 3),
('11111111-0001-0001-0001-000000000002', 'Egg Fry',     'Pan-fried boiled eggs coated in local spices, curry leaves, and black pepper.',                     150, './IPL DHABA ITEMS/egg fry curry.jpg',   'egg', 4),
('11111111-0001-0001-0001-000000000002', 'Egg Tadka',   'Dhaba style scrambled egg curry cooked with red lentils and hot spices.',                           130, './IPL DHABA ITEMS/Egg Tadka curry.jpg', 'egg', 5),
('11111111-0001-0001-0001-000000000002', 'Egg Palak',   'Boiled eggs cooked in a nourishing, garlic-tempered pureed spinach gravy.',                         130, './IPL DHABA ITEMS/egg palak curry.jpg', 'egg', 6);

-- FISH & PRAWNS
INSERT INTO menu_items (category_id, name, description, price, image_url, food_type, sort_order) VALUES
('11111111-0001-0001-0001-000000000003', 'Prawns Curry',       'Fresh prawns simmered in a tangy coconut-tomato gravy with local spices.',                           300, './IPL DHABA ITEMS/prawan curry.jpg',      'non_veg', 1),
('11111111-0001-0001-0001-000000000003', 'Prawns Fry',         'Spicy pan-fried prawns tossed with onions, green chillies, and curry leaves.',                      300, './IPL DHABA ITEMS/prawans fry.jpg',       'non_veg', 2),
('11111111-0001-0001-0001-000000000003', 'Prawns Chilli',      'Indo-Chinese style prawns stir-fried with bell peppers, onions, and spicy red chili sauce.',        300, './IPL DHABA ITEMS/prawans chilli.jpg',    'non_veg', 3),
('11111111-0001-0001-0001-000000000003', 'Prawns Roast',       'Dry roasted prawns cooked with caramelized onions, ginger-garlic paste, and crushed spices.',       300, './IPL DHABA ITEMS/prawans roast.jpg',     'non_veg', 4),
('11111111-0001-0001-0001-000000000003', 'Prawns 65',          'Crispy, deep-fried prawns marinated in yoghurt, curry leaves, and red hot spices.',                 300, './IPL DHABA ITEMS/prawans 65.jpg',        'non_veg', 5),
('11111111-0001-0001-0001-000000000003', 'Apollo Fish Roast',  'Boneless fish pieces tossed in a dry spicy mix of onion, garlic, and curry leaves.',               300, './IPL DHABA ITEMS/apollo fish roast.jpg', 'non_veg', 6),
('11111111-0001-0001-0001-000000000003', 'Apollo Fish Fry',    'Popular Andhra starter: Crispy, battered fish fillets fried and spiced with green chillies.',      300, './IPL DHABA ITEMS/apollo fish fry.jpg',   'non_veg', 7);

-- MUTTON
INSERT INTO menu_items (category_id, name, description, price, image_url, food_type, sort_order) VALUES
('11111111-0001-0001-0001-000000000004', 'Mutton Curry',   'Tender mutton pieces slow-cooked in a classic, spicy Indian gravy with local spices.',         350, './IPL DHABA ITEMS/mutton curry.jpg',   'non_veg', 1),
('11111111-0001-0001-0001-000000000004', 'Mutton Fry',     'Andhra style dry mutton fry cooked with black pepper, red chilies, and onions.',                350, './IPL DHABA ITEMS/mutton fry.jpg',     'non_veg', 2),
('11111111-0001-0001-0001-000000000004', 'Mutton Biryani', 'Layers of long-grain basmati rice and slow-cooked mutton, steamed with saffron.',              300, './IPL DHABA ITEMS/mutton biryani.jpg', 'non_veg', 3);

-- NON-VEG STARTERS
INSERT INTO menu_items (category_id, name, description, price, image_url, food_type, is_featured, sort_order) VALUES
('11111111-0001-0001-0001-000000000005', 'Star Chicken',         'IPL Dhaba''s signature fried chicken starter, extra crispy and beautifully spiced.',              300, './IPL DHABA ITEMS/star chicken starter.jpeg',     'non_veg', true,  1),
('11111111-0001-0001-0001-000000000005', 'Chilli Chicken',       'Crispy chicken chunks tossed in spicy soy-chili sauce with garlic and bell peppers.',           250, './IPL DHABA ITEMS/chilli chicken starter.jpg',    'non_veg', false, 2),
('11111111-0001-0001-0001-000000000005', 'Chicken 65',           'Deep-fried chicken pieces marinated in red chili, ginger, and curry leaf paste.',               250, './IPL DHABA ITEMS/chicken 65 starter.jpg',        'non_veg', false, 3),
('11111111-0001-0001-0001-000000000005', 'Chicken 85',           'Specialty dry-roasted chicken starter cooked with red chillies and lemon juice.',               280, './IPL DHABA ITEMS/chicken 65 starter.jpg',        'non_veg', false, 4),
('11111111-0001-0001-0001-000000000005', 'Kaju Chicken Fry',     'Crispy fried chicken pieces tossed with roasted cashew nuts and southern spices.',              280, './IPL DHABA ITEMS/kaju chicken fry starter.jpg',  'non_veg', false, 5),
('11111111-0001-0001-0001-000000000005', 'Ginger Chicken',       'Stir-fried chicken loaded with thin ginger juliennes and basic spices.',                        280, './IPL DHABA ITEMS/ginger chicken.jpg',             'non_veg', false, 6),
('11111111-0001-0001-0001-000000000005', 'Chicken Vada',         'Unique savory donuts made of minced chicken, green chilies, and coriander, deep fried.',        300, './IPL DHABA ITEMS/chicken vada starter.jpg',      'non_veg', false, 7),
('11111111-0001-0001-0001-000000000005', 'Lemon Chicken',        'Tender chicken stir-fried with tangy lemon juice, green chilies, and black pepper.',            280, './IPL DHABA ITEMS/lemon chicken starter.jpg',     'non_veg', false, 8),
('11111111-0001-0001-0001-000000000005', 'Chicken Fry (Bone)',   'Traditional bone-in chicken deep-fried and coated with aromatic spices.',                       220, './IPL DHABA ITEMS/chicken fry bone starter.jpg',  'non_veg', false, 9),
('11111111-0001-0001-0001-000000000005', 'Chicken Fry (B Less)', 'Boneless chicken cubes fried crispy and seasoned with southern masala.',                        250, './IPL DHABA ITEMS/chicken fry boneless starter.jpg','non_veg', false, 10),
('11111111-0001-0001-0001-000000000005', 'Magestic Chicken',     'Strips of fried chicken tossed in a creamy, spicy yoghurt-based sauce with curry leaves.',      300, './IPL DHABA ITEMS/magestic chicken starter.jpg',  'non_veg', false, 11),
('11111111-0001-0001-0001-000000000005', 'R.R. Chicken',         'A spicy red chicken fry tossed with crushed green chilies and cashew nuts.',                    300, './IPL DHABA ITEMS/rr chicken starter.jpg',         'non_veg', false, 12),
('11111111-0001-0001-0001-000000000005', 'Lollipop Fry',         'Crispy deep-fried chicken lollipops served with hot schezwan sauce.',                           250, './IPL DHABA ITEMS/lollipop fry chicken.jpg',      'non_veg', false, 13),
('11111111-0001-0001-0001-000000000005', 'Leg Peace Roast',      'Whole chicken drumsticks marinated and roasted on a flat pan with spices.',                     250, './IPL DHABA ITEMS/leg peace roast starter.jpg',   'non_veg', false, 14),
('11111111-0001-0001-0001-000000000005', 'Lollipop Roast',       'Chicken lollipops pan-roasted in a sticky, sweet-and-spicy masala mix.',                       200, './IPL DHABA ITEMS/lollipop roast starter.jpg',    'non_veg', false, 15),
('11111111-0001-0001-0001-000000000005', 'Pepper Chicken',       'Deep-fried chicken pieces stir-fried with crushed black pepper and onions.',                    280, './IPL DHABA ITEMS/pepper chicken starter.jpg',    'non_veg', false, 16),
('11111111-0001-0001-0001-000000000005', 'Dragon Chicken',       'Indo-Chinese dry starter featuring chicken strips, cashew nuts, and bell peppers in chili sauce.',280,'./IPL DHABA ITEMS/dragon chicken starter.jpg',   'non_veg', false, 17),
('11111111-0001-0001-0001-000000000005', 'Tiger Chicken',        'Spicy shredded chicken starter with red and green chilies, deep fried.',                        280, './IPL DHABA ITEMS/chicken fry bone starter.jpg',  'non_veg', false, 18),
('11111111-0001-0001-0001-000000000005', 'Hydrabad Chicken',     'Spicy dry chicken starter tossed in Hyderabadi curd and curry leaf masala.',                   280, './IPL DHABA ITEMS/hydrabad spicy chicken curry.jpg','non_veg', false, 19),
('11111111-0001-0001-0001-000000000005', 'IPL Grilled Chicken',  'House special whole chicken pieces grilled with fire and butter.',                              300, './IPL DHABA ITEMS/chicken fry bone starter.jpg',  'non_veg', false, 20),
('11111111-0001-0001-0001-000000000005', 'Bone Roast Chicken',   'Bone-in chicken drumsticks slow-roasted in a heavy cast iron pan.',                            250, './IPL DHABA ITEMS/boneless roast chicken curry.jpg','non_veg', false, 21),
('11111111-0001-0001-0001-000000000005', 'Punjabi Chicken Starter','Robust north-Indian styled roasted chicken strips tossed in garam masala.',                  280, './IPL DHABA ITEMS/punjabi chicken curry.jpg',     'non_veg', false, 22);

-- NON-VEG CURRIES
INSERT INTO menu_items (category_id, name, description, price, image_url, food_type, sort_order) VALUES
('11111111-0001-0001-0001-000000000006', 'IPL Special Chicken',    'Our signature spicy chicken curry, cooked with ground home spices and cashew paste.',       300, './IPL DHABA ITEMS/andhra chicken curry.jpg',          'non_veg', 1),
('11111111-0001-0001-0001-000000000006', 'Bullet Chicken',         'Extra hot chicken curry cooked with bullet green chilies and dark spices.',                  300, './IPL DHABA ITEMS/andhra chicken curry.jpg',          'non_veg', 2),
('11111111-0001-0001-0001-000000000006', 'Panjabi Chicken',        'Robust chicken curry cooked in an onion-tomato base with Punjabi spices.',                   280, './IPL DHABA ITEMS/punjabi chicken curry.jpg',         'non_veg', 3),
('11111111-0001-0001-0001-000000000006', 'Chicken 555',            'Creamy and spicy chicken curry cooked with yoghurt, capsicum, and cashew paste.',            300, './IPL DHABA ITEMS/chicken 555 curry.jpg',             'non_veg', 4),
('11111111-0001-0001-0001-000000000006', 'Mogalai Chicken',        'Rich and mild chicken curry cooked with egg whites, cashew cream, and saffron.',             250, './IPL DHABA ITEMS/mogalai chicken curry.jpg',         'non_veg', 5),
('11111111-0001-0001-0001-000000000006', 'Butter Chicken',         'Tender chicken pieces cooked in a creamy, sweet, and buttery tomato gravy.',                 250, './IPL DHABA ITEMS/butter chicken curry.jpg',          'non_veg', 6),
('11111111-0001-0001-0001-000000000006', 'Indian Chicken',         'Home-style Indian chicken curry, mildly spiced and garnished with fresh coriander.',         270, './IPL DHABA ITEMS/indian chicken curry.jpg',          'non_veg', 7),
('11111111-0001-0001-0001-000000000006', 'Hydarabad Spicy',        'Fiery chicken curry cooked with local red chilies, tamarind, and coconut paste.',            300, './IPL DHABA ITEMS/hydrabad spicy chicken curry.jpg',  'non_veg', 8),
('11111111-0001-0001-0001-000000000006', 'Ramba Chicken',          'Chef''s special green chicken curry cooked with mint, coriander, and spinach paste.',       250, './IPL DHABA ITEMS/rambha chicken curry.jpg',          'non_veg', 9),
('11111111-0001-0001-0001-000000000006', 'Bone Kadai',             'Bone-in chicken tossed with bell peppers and whole spices in a kadai masala.',               280, './IPL DHABA ITEMS/kadai chicken curry.jpg',           'non_veg', 10),
('11111111-0001-0001-0001-000000000006', 'Boneless Kadai',         'Boneless chicken cubes cooked with capsicum, onion, and fresh kadai masala.',                280, './IPL DHABA ITEMS/boneless kadai chicken curry.jpg',  'non_veg', 11),
('11111111-0001-0001-0001-000000000006', 'Nellore Chicken',        'Traditional spicy coastal Andhra chicken curry flavored with local tamarind and spices.',    300, './IPL DHABA ITEMS/nellore chicken curry.jpg',         'non_veg', 12),
('11111111-0001-0001-0001-000000000006', 'Andhra Chicken',         'Classic hot and spicy chicken curry cooked in Andhra style with dry coconut.',               250, './IPL DHABA ITEMS/andhra chicken curry.jpg',          'non_veg', 13),
('11111111-0001-0001-0001-000000000006', 'Boneless Roast Chicken', 'Boneless chicken chunks pan-roasted with spicy thick gravy until dry.',                      250, './IPL DHABA ITEMS/boneless roast chicken curry.jpg',  'non_veg', 14);

-- BIRYANI & RICE
INSERT INTO menu_items (category_id, name, description, price, image_url, food_type, is_featured, sort_order) VALUES
('11111111-0001-0001-0001-000000000007', 'Biriyani (Boneless)', 'Aromatic basmati rice cooked with boneless chicken pieces, served with raita.',          250, './IPL DHABA ITEMS/biryani boneless.jpg',           'non_veg', true,  1),
('11111111-0001-0001-0001-000000000007', 'Biriyani (Bone)',     'Traditional basmati rice layered with bone-in chicken curry, steamed slow.',             220, './IPL DHABA ITEMS/chicken bone.jpg',               'non_veg', false, 2),
('11111111-0001-0001-0001-000000000007', 'Mutton Biryani',      'Layers of long-grain basmati rice and slow-cooked mutton, steamed with saffron.',        300, './IPL DHABA ITEMS/mutton biryani.jpg',             'non_veg', false, 3),
('11111111-0001-0001-0001-000000000007', 'Plavu Rice',          'Fragrant ghee-rice cooked with mild spices, bay leaves, and green peas.',               120, './IPL DHABA ITEMS/plavu rice.jpg',                 'veg',     false, 4),
('11111111-0001-0001-0001-000000000007', 'Egg Rice',            'Fluffy rice stir-fried with eggs, vegetables, pepper, and soy sauce.',                  100, './IPL DHABA ITEMS/egg rice.jpg',                   'egg',     false, 5),
('11111111-0001-0001-0001-000000000007', 'Chicken Rice',        'Indo-Chinese chicken fried rice tossed with egg, vegetables, and chicken bits.',         150, './IPL DHABA ITEMS/chicken fried rice.jpg',         'non_veg', false, 6),
('11111111-0001-0001-0001-000000000007', 'Zeera Rice',          'Basmati rice cooked with ghee and heavily tempered with cumin seeds.',                   130, './IPL DHABA ITEMS/jeera rice.jpg',                 'veg',     false, 7),
('11111111-0001-0001-0001-000000000007', 'Cashew Rice',         'Mildly sweet rich rice loaded with golden pan-fried cashew nuts.',                       200, './IPL DHABA ITEMS/cashew rice.jpg',                'veg',     false, 8),
('11111111-0001-0001-0001-000000000007', 'Vegetable Rice',      'Rice stir-fried with fresh farm vegetables and basic seasonings.',                       160, './IPL DHABA ITEMS/vegetable rice.jpg',             'veg',     false, 9);

-- BREADS
INSERT INTO menu_items (category_id, name, description, price, image_url, food_type, sort_order) VALUES
('11111111-0001-0001-0001-000000000008', 'Pulka', 'Soft, oil-free whole wheat Indian flatbread cooked on direct flame.', 10, './IPL DHABA ITEMS/pulka.jpg', 'veg', 1);

INSERT INTO menu_items (category_id, name, description, price, image_url, food_type, is_featured, sort_order) VALUES
('11111111-0001-0001-0001-000000000008', 'Roti', 'Soft, traditional whole wheat flatbread baked fresh.', 10, './IPL DHABA ITEMS/pulka.jpg', 'veg', true, 2);

SELECT 'Seed data inserted: ' || count(*)::text || ' menu items' AS result FROM menu_items;
