-- ================================================
-- Findr Demo Data Seed Script
-- Run this in Supabase SQL Editor after running migrations
-- Creates realistic listings for Cameroon marketplace demo
-- ================================================

-- Clear existing demo data (optional)
-- DELETE FROM public.listings WHERE title LIKE '%[DEMO]%';

-- Insert realistic housing listings
INSERT INTO public.listings (
  title, description, category, price, currency, city, neighborhood,
  housing_type, rental_period, rooms, bathrooms, surface_m2, furnished, amenities,
  images, whatsapp_number, is_active, is_featured, created_at
) VALUES

-- Douala Housing
('[DEMO] Appartement 3 pièces meublé - Bonanjo', 
'Magnifique appartement de 3 pièces entièrement meublé situé au cœur de Bonanjo. Cuisine équipée, salon spacieux, 2 chambres avec climatisation. Proche des banques et commerces. Parking sécurisé, gardien 24h/24.',
'housing', 180000, 'XAF', 'Douala', 'Bonanjo',
'apartment', 'monthly', 3, 2, 75, true, 
ARRAY['wifi', 'ac', 'parking', 'security', 'furnished'],
ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop'],
'+237 699 123 456', true, true, NOW() - INTERVAL '2 days'),

('[DEMO] Studio moderne - Akwa Nord',
'Studio moderne de 35m² dans résidence sécurisée à Akwa Nord. Entièrement équipé avec kitchenette, salle de bain moderne, balcon avec vue. Idéal pour étudiant ou jeune professionnel. Internet fibre inclus.',
'housing', 85000, 'XAF', 'Douala', 'Akwa',
'studio', 'monthly', 1, 1, 35, true,
ARRAY['wifi', 'ac', 'security', 'furnished'],
ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop'],
'+237 677 234 567', true, false, NOW() - INTERVAL '1 day'),

('[DEMO] Villa 5 chambres avec piscine - Bonapriso',
'Superbe villa de standing avec 5 chambres, 4 salles de bain, salon double, cuisine équipée, piscine et jardin tropical. Quartier résidentiel calme et sécurisé. Parfait pour famille expatriée.',
'housing', 750000, 'XAF', 'Douala', 'Bonapriso',
'villa', 'monthly', 5, 4, 300, true,
ARRAY['pool', 'garden', 'parking', 'security', 'wifi', 'ac', 'furnished'],
ARRAY['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600563438938-a42d180ac2b5?w=800&h=600&fit=crop'],
'+237 698 345 678', true, true, NOW() - INTERVAL '3 days'),

('[DEMO] Maison 4 pièces - New Bell',
'Maison familiale de 4 pièces dans quartier calme de New Bell. 3 chambres, salon, cuisine, 2 WC, cour pavée. Proche écoles et marché. Idéal pour famille camerounaise. Eau et électricité disponibles.',
'housing', 120000, 'XAF', 'Douala', 'New Bell',
'house', 'monthly', 4, 2, 120, false,
ARRAY['parking', 'garden'],
ARRAY['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop'],
'+237 655 456 789', true, false, NOW() - INTERVAL '5 days'),

-- Yaoundé Housing
('[DEMO] Appartement standing - Bastos',
'Appartement de grand standing à Bastos, 3 chambres, 2 salles de bain, salon moderne, cuisine équipée. Résidence avec ascenseur, groupe électrogène, parking privé. Quartier diplomatique sécurisé.',
'housing', 250000, 'XAF', 'Yaoundé', 'Bastos',
'apartment', 'monthly', 3, 2, 90, true,
ARRAY['wifi', 'ac', 'parking', 'security', 'generator', 'furnished'],
ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&h=600&fit=crop'],
'+237 699 567 890', true, true, NOW() - INTERVAL '1 day'),

('[DEMO] Studio étudiant - Ngoa-Ékélé',
'Studio parfait pour étudiant près de l''Université de Yaoundé I. 25m², meublé, cuisine équipée, internet WiFi. Transport en commun à 5 min. Loyer abordable, charges comprises.',
'housing', 45000, 'XAF', 'Yaoundé', 'Ngoa-Ékélé',
'studio', 'monthly', 1, 1, 25, true,
ARRAY['wifi', 'furnished'],
ARRAY['https://images.unsplash.com/photo-1631049421450-348de7eabada?w=800&h=600&fit=crop'],
'+237 677 678 901', true, false, NOW() - INTERVAL '4 days'),

('[DEMO] Duplex moderne - Odza',
'Magnifique duplex de 4 chambres à Odza, quartier en plein essor. Construction récente, finitions de qualité, terrasse, garage double. Proche de l''aéroport et centres commerciaux.',
'housing', 180000, 'XAF', 'Yaoundé', 'Odza',
'house', 'monthly', 4, 3, 150, false,
ARRAY['parking', 'security'],
ARRAY['https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1613977257259-4871e5fcd7c4?w=800&h=600&fit=crop'],
'+237 698 789 012', true, false, NOW() - INTERVAL '2 days'),

-- Kribi Housing  
('[DEMO] Villa bord de mer - Centre Kribi',
'Villa exceptionnelle face à l''océan à Kribi. 3 chambres, terrasse panoramique, accès direct plage. Parfait pour vacances ou investissement locatif. Vue imprenable sur l''océan Atlantique.',
'housing', 200000, 'XAF', 'Kribi', 'Centre',
'villa', 'monthly', 3, 2, 100, true,
ARRAY['wifi', 'furnished', 'garden'],
ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1605276373954-0c4a0dac5cc0?w=800&h=600&fit=crop'],
'+237 699 890 123', true, true, NOW() - INTERVAL '3 days'),

('[DEMO] Bungalow familial - Lolabé',
'Charmant bungalow de 2 chambres dans le quartier calme de Lolabé à Kribi. Jardin tropical, terrasse couverte, proche du port de pêche. Idéal pour séjour authentique au bord de mer.',
'housing', 80000, 'XAF', 'Kribi', 'Lolabé',
'house', 'monthly', 2, 1, 80, false,
ARRAY['garden'],
ARRAY['https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&h=600&fit=crop'],
'+237 677 901 234', true, false, NOW() - INTERVAL '6 days'),

-- Bafoussam Housing
('[DEMO] Maison traditionnelle rénovée - Centre Bafoussam',
'Belle maison traditionnelle entièrement rénovée au centre de Bafoussam. 4 chambres, salon spacieux, cuisine moderne, cour intérieure. Architecture locale préservée avec confort moderne.',
'housing', 95000, 'XAF', 'Bafoussam', 'Centre',
'house', 'monthly', 4, 2, 110, false,
ARRAY['parking', 'garden'],
ARRAY['https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800&h=600&fit=crop'],
'+237 655 012 345', true, false, NOW() - INTERVAL '7 days');

-- Insert vehicle listings
INSERT INTO public.listings (
  title, description, category, price, currency, city, neighborhood,
  car_brand, car_model, car_year, fuel_type, transmission, seats, price_per_day,
  images, whatsapp_number, is_active, is_featured, created_at
) VALUES

('[DEMO] Toyota Corolla 2022 - Location',
'Toyota Corolla 2022 en excellent état pour location. Véhicule fiable, économique en carburant, parfait pour vos déplacements en ville ou interurbains. Assurance et entretien inclus. Disponible immédiatement.',
'cars', 0, 'XAF', 'Douala', 'Akwa',
'Toyota', 'Corolla', 2022, 'essence', 'automatic', 5, 25000,
ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&h=600&fit=crop'],
'+237 699 234 567', true, true, NOW() - INTERVAL '1 day'),

('[DEMO] Mercedes Classe C 2020 - Vente',
'Mercedes Classe C 2020, 45 000 km, état impeccable. Cuir beige, climatisation automatique, système audio premium. Entretien Mercedes officiel. Véhicule de direction, non accidenté.',
'cars', 18500000, 'XAF', 'Yaoundé', 'Bastos',
'Mercedes', 'Classe C', 2020, 'diesel', 'automatic', 5, NULL,
ARRAY['https://images.unsplash.com/photo-1563694983011-6f4d90358083?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop'],
'+237 698 345 678', true, true, NOW() - INTERVAL '2 days'),

('[DEMO] Toyota Hilux 4x4 2021 - Vente',
'Toyota Hilux double cabine 4x4, parfait pour terrain difficile. 25 000 km, garantie constructeur valide. Idéal pour entreprises ou aventuriers. Benne couverte, attelage inclus.',
'cars', 22000000, 'XAF', 'Douala', 'Bonapriso',
'Toyota', 'Hilux', 2021, 'diesel', 'manual', 5, NULL,
ARRAY['https://images.unsplash.com/photo-1551830820-330a71b2dac0?w=800&h=600&fit=crop'],
'+237 677 456 789', true, false, NOW() - INTERVAL '3 days'),

('[DEMO] Honda Civic 2019 - Location journalière',
'Honda Civic 2019 pour location à la journée. Véhicule confortable, climatisé, GPS intégré. Parfait pour tourisme ou déplacements professionnels. Tarif dégressif pour location longue durée.',
'cars', 0, 'XAF', 'Yaoundé', 'Centre',
'Honda', 'Civic', 2019, 'essence', 'automatic', 5, 30000,
ARRAY['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop'],
'+237 699 567 890', true, false, NOW() - INTERVAL '4 days'),

('[DEMO] Nissan Patrol 2018 - Vente',
'Nissan Patrol 7 places, parfait pour grandes familles. Véhicule spacieux, robuste, bien entretenu. Climatisation arrière, système audio complet. 65 000 km, révisions à jour.',
'cars', 16500000, 'XAF', 'Bafoussam', 'Centre',
'Nissan', 'Patrol', 2018, 'diesel', 'automatic', 7, NULL,
ARRAY['https://images.unsplash.com/photo-1549399392-e2df624af4b9?w=800&h=600&fit=crop'],
'+237 655 678 901', true, false, NOW() - INTERVAL '5 days');

-- Insert job listings
INSERT INTO public.listings (
  title, description, category, price, currency, city, neighborhood,
  job_type, company_name, salary_min, salary_max,
  images, whatsapp_number, is_active, created_at
) VALUES

('[DEMO] Développeur Full Stack - Remote/Douala',
'Startup tech camerounaise recherche développeur Full Stack expérimenté. React, Node.js, PostgreSQL. Travail hybride possible, équipe jeune et dynamique. Projets innovants pour le marché africain.',
'jobs', 450000, 'XAF', 'Douala', 'Bonanjo',
'tech', 'TechCam Solutions', 400000, 600000,
ARRAY['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop'],
'+237 699 111 222', true, NOW() - INTERVAL '1 day'),

('[DEMO] Comptable Expérimenté - Cabinet CPA',
'Cabinet comptable recherche comptable senior. Minimum 5 ans d''expérience, maîtrise Sage, Excel avancé. Gestion clientèle PME, déclarations fiscales. Poste stable avec évolution possible.',
'jobs', 250000, 'XAF', 'Yaoundé', 'Centre',
'finance', 'Cabinet Expertise Plus', 200000, 300000,
ARRAY['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop'],
'+237 698 222 333', true, NOW() - INTERVAL '2 days'),

('[DEMO] Chauffeur Professionnel - Entreprise Transport',
'Société de transport recherche chauffeurs expérimentés. Permis B et D obligatoires, expérience minimum 3 ans. Conduite défensive, ponctualité, présentation soignée exigées.',
'jobs', 150000, 'XAF', 'Douala', 'Akwa',
'transport', 'Trans-Cam Express', 120000, 180000,
ARRAY['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop'],
'+237 677 333 444', true, NOW() - INTERVAL '3 days'),

('[DEMO] Enseignant Mathématiques - Lycée Privé',
'Lycée privé bilingue recherche professeur de mathématiques. Niveau terminale C et D, programme camerounais et international. Expérience pédagogique requise, maîtrise anglais/français.',
'jobs', 180000, 'XAF', 'Yaoundé', 'Bastos',
'education', 'Lycée Excellence', 150000, 220000,
ARRAY['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop'],
'+237 699 444 555', true, NOW() - INTERVAL '4 days'),

('[DEMO] Chef de Cuisine - Restaurant Gastronomique',
'Restaurant haut de gamme recrute chef de cuisine créatif. Cuisine française et africaine, gestion équipe, approvisionnement. Formation hôtellerie souhaitée, expérience 5+ ans exigée.',
'jobs', 300000, 'XAF', 'Douala', 'Bonapriso',
'hospitality', 'Restaurant Le Wouri', 250000, 350000,
ARRAY['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop'],
'+237 698 555 666', true, NOW() - INTERVAL '5 days');

-- Insert service listings
INSERT INTO public.listings (
  title, description, category, price, currency, city, neighborhood,
  images, whatsapp_number, is_active, created_at
) VALUES

('[DEMO] Plombier Professionnel - Dépannage 24h/24',
'Plombier qualifié pour tous vos travaux : réparations, installations, débouchage canalisations. Intervention rapide, tarifs transparents, garantie travaux. Devis gratuit, paiement mobile money accepté.',
'services', 15000, 'XAF', 'Douala', 'Toute la ville',
ARRAY['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop'],
'+237 699 123 789', true, NOW() - INTERVAL '1 day'),

('[DEMO] Électricien Agréé - Installation/Réparation',
'Électricien professionnel pour installation électrique, dépannage, mise aux normes. Expérience 10 ans, travail soigné, respect délais. Résidentiel et commercial. Certificat conformité fourni.',
'services', 20000, 'XAF', 'Yaoundé', 'Tous quartiers',
ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'],
'+237 677 234 890', true, NOW() - INTERVAL '2 days'),

('[DEMO] Ménage à Domicile - Service Premium',
'Service de ménage professionnel à domicile. Équipe formée, produits écologiques fournis. Nettoyage approfondi, repassage inclus. Formule hebdomadaire ou ponctuelle. Satisfaction garantie.',
'services', 25000, 'XAF', 'Douala', 'Bonapriso, Bonanjo',
ARRAY['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop'],
'+237 698 345 901', true, NOW() - INTERVAL '3 days'),

('[DEMO] Réparation Smartphone/Ordinateur',
'Technicien spécialisé réparation smartphones, tablettes, ordinateurs. Diagnostic gratuit, pièces originales, intervention rapide. iPhone, Samsung, Huawei. Récupération données possible.',
'services', 12000, 'XAF', 'Yaoundé', 'Centre, Bastos',
ARRAY['https://images.unsplash.com/photo-1516131206008-dd041a9764fd?w=800&h=600&fit=crop'],
'+237 655 456 012', true, NOW() - INTERVAL '4 days'),

('[DEMO] Cours Particuliers - Mathématiques/Sciences',
'Professeur expérimenté donne cours particuliers math, physique, chimie. Tous niveaux : 6ème à Terminale. Préparation examens officiels, soutien scolaire. Pédagogie adaptée, résultats garantis.',
'services', 8000, 'XAF', 'Yaoundé', 'Ngoa-Ékélé, Bastos',
ARRAY['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop'],
'+237 677 567 123', true, NOW() - INTERVAL '5 days');

-- Add some terrain/land listings
INSERT INTO public.listings (
  title, description, category, price, currency, city, neighborhood,
  housing_type, surface_m2,
  images, whatsapp_number, is_active, is_featured, created_at
) VALUES

('[DEMO] Terrain Titre Foncier - Douala Bassa',
'Terrain de 500m² avec titre foncier définitif à Douala Bassa. Bien situé, accès facile, eau et électricité disponibles en bordure. Parfait pour construction villa familiale ou petit immeuble.',
'housing', 15000000, 'XAF', 'Douala', 'Bassa',
'land', 500,
ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'],
'+237 699 321 654', true, true, NOW() - INTERVAL '3 days'),

('[DEMO] Terrain 1000m² - Yaoundé Nkolbisson',
'Grand terrain de 1000m² à Nkolbisson, quartier résidentiel en développement. Légèrement en pente, vue dégagée, titre foncier en cours. Accès route bitumée, transport en commun proche.',
'housing', 8500000, 'XAF', 'Yaoundé', 'Nkolbisson',
'land', 1000,
ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop'],
'+237 698 654 987', true, false, NOW() - INTERVAL '5 days'),

('[DEMO] Terrain Commercial - Centre Bafoussam',
'Terrain de 300m² en plein centre de Bafoussam, zone commerciale. Parfait pour commerce, bureaux ou petit immeuble. Très bonne visibilité, passage important. Titre foncier sécurisé.',
'housing', 12000000, 'XAF', 'Bafoussam', 'Centre',
'land', 300,
ARRAY['https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?w=800&h=600&fit=crop'],
'+237 655 987 321', true, false, NOW() - INTERVAL '6 days');

-- ================================================
-- Demo data inserted successfully!
-- Total: ~30 realistic listings across all categories
-- ================================================