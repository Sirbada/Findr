import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Seed demo data — requires SUPABASE_SERVICE_ROLE_KEY
 * POST /api/seed?key=YOUR_SECRET
 * 
 * This is a one-time setup endpoint. Remove or protect in production.
 */

const DEMO_LISTINGS = [
  // === HOUSING - DOUALA ===
  {
    title: "Appartement 3 pièces Bonanjo",
    description: "Bel appartement meublé avec vue sur le port. Eau chaude, climatisation, parking inclus. Quartier calme et sécurisé, proche des commerces et restaurants.",
    category: "housing", housing_type: "apartment", price: 150000,
    city: "Douala", neighborhood: "Bonanjo", rooms: 3, bathrooms: 2,
    surface_m2: 85, furnished: true, rental_period: "monthly",
    amenities: ["climatisation", "parking", "eau chaude", "gardien", "wifi"],
    images: [], status: "active", is_active: true, is_featured: true, is_verified: true, views: 142,
  },
  {
    title: "Studio meublé Akwa - proche marché",
    description: "Studio moderne entièrement meublé et équipé. Idéal pour jeune professionnel ou étudiant. Eau et électricité inclus.",
    category: "housing", housing_type: "studio", price: 65000,
    city: "Douala", neighborhood: "Akwa", rooms: 1, bathrooms: 1,
    surface_m2: 30, furnished: true, rental_period: "monthly",
    amenities: ["meublé", "eau incluse", "électricité incluse"],
    images: [], status: "active", is_active: true, is_featured: false, is_verified: true, views: 89,
  },
  {
    title: "Villa 5 pièces avec piscine - Bonapriso",
    description: "Magnifique villa dans le quartier résidentiel de Bonapriso. Piscine, jardin, 2 garages, dépendances pour personnel. Idéal pour famille ou diplomate.",
    category: "housing", housing_type: "house", price: 800000,
    city: "Douala", neighborhood: "Bonapriso", rooms: 5, bathrooms: 3,
    surface_m2: 280, furnished: false, rental_period: "monthly",
    amenities: ["piscine", "jardin", "garage", "gardien", "dépendance"],
    images: [], status: "active", is_active: true, is_featured: true, is_verified: true, views: 215,
  },
  {
    title: "Chambre moderne Deido",
    description: "Chambre propre avec douche interne et toilettes. Quartier vivant, transports faciles. Idéal étudiant.",
    category: "housing", housing_type: "room", price: 25000,
    city: "Douala", neighborhood: "Deido", rooms: 1, bathrooms: 1,
    surface_m2: 16, furnished: true, rental_period: "monthly",
    amenities: ["douche interne", "meublé"],
    images: [], status: "active", is_active: true, is_featured: false, is_verified: false, views: 34,
  },
  {
    title: "Appartement 2 pièces Makepe",
    description: "Appartement neuf dans un immeuble récent. Carrelage, peinture fraîche, balcon. Proche université de Douala.",
    category: "housing", housing_type: "apartment", price: 75000,
    city: "Douala", neighborhood: "Makepe", rooms: 2, bathrooms: 1,
    surface_m2: 55, furnished: false, rental_period: "monthly",
    amenities: ["balcon", "carrelage", "neuf"],
    images: [], status: "active", is_active: true, is_featured: false, is_verified: true, views: 67,
  },
  // === HOUSING - YAOUNDÉ ===
  {
    title: "Appartement standing Bastos",
    description: "Grand appartement de standing dans le quartier diplomatique de Bastos. Gardiennage 24h, groupe électrogène, parking souterrain.",
    category: "housing", housing_type: "apartment", price: 350000,
    city: "Yaoundé", neighborhood: "Bastos", rooms: 4, bathrooms: 2,
    surface_m2: 150, furnished: true, rental_period: "monthly",
    amenities: ["gardien 24h", "groupe électrogène", "parking souterrain", "climatisation"],
    images: [], status: "active", is_active: true, is_featured: true, is_verified: true, views: 178,
  },
  {
    title: "Studio Omnisport - entrée indépendante",
    description: "Joli studio avec entrée indépendante, cuisine équipée, douche moderne. Quartier calme près du stade Omnisport.",
    category: "housing", housing_type: "studio", price: 55000,
    city: "Yaoundé", neighborhood: "Omnisport", rooms: 1, bathrooms: 1,
    surface_m2: 28, furnished: true, rental_period: "monthly",
    amenities: ["entrée indépendante", "cuisine équipée"],
    images: [], status: "active", is_active: true, is_featured: false, is_verified: true, views: 52,
  },
  {
    title: "Maison 4 pièces Mvan",
    description: "Maison familiale avec cour clôturée. 4 chambres, salon, cuisine, 2 douches. Quartier résidentiel.",
    category: "housing", housing_type: "house", price: 120000,
    city: "Yaoundé", neighborhood: "Mvan", rooms: 4, bathrooms: 2,
    surface_m2: 100, furnished: false, rental_period: "monthly",
    amenities: ["cour clôturée", "cuisine séparée"],
    images: [], status: "active", is_active: true, is_featured: false, is_verified: false, views: 41,
  },
  // === HOUSING - KRIBI ===
  {
    title: "Bungalow vue mer - Plage de Kribi",
    description: "Magnifique bungalow face à l'océan. 2 chambres climatisées, terrasse privée, accès direct plage. Parfait pour vacances ou week-end.",
    category: "housing", housing_type: "house", price: 45000,
    city: "Kribi", neighborhood: "Plage", rooms: 2, bathrooms: 1,
    surface_m2: 60, furnished: true, rental_period: "daily",
    amenities: ["vue mer", "terrasse", "climatisation", "accès plage"],
    images: [], status: "active", is_active: true, is_featured: true, is_verified: true, views: 320,
  },
  // === CARS ===
  {
    title: "Toyota Corolla 2019 - très bon état",
    description: "Toyota Corolla 2019, 45,000 km, climatisation, boîte automatique. Véhicule bien entretenu, carnet d'entretien disponible.",
    category: "cars", price: 8500000, city: "Douala", neighborhood: "Akwa",
    car_brand: "Toyota", car_model: "Corolla", car_year: 2019,
    fuel_type: "essence", transmission: "automatic", seats: 5,
    images: [], status: "active", is_active: true, is_featured: true, is_verified: true, views: 156,
  },
  {
    title: "Mercedes Classe C 2017",
    description: "Mercedes C200 2017, intérieur cuir, GPS, caméra de recul. Import Allemagne, dédouanée.",
    category: "cars", price: 12000000, city: "Douala", neighborhood: "Bonapriso",
    car_brand: "Mercedes", car_model: "Classe C", car_year: 2017,
    fuel_type: "diesel", transmission: "automatic", seats: 5,
    images: [], status: "active", is_active: true, is_featured: true, is_verified: true, views: 234,
  },
  {
    title: "Moto TVS Apache 160 - neuve",
    description: "Moto TVS Apache RTR 160, neuve avec garantie constructeur. Idéale pour la ville.",
    category: "cars", price: 950000, city: "Yaoundé", neighborhood: "Mokolo",
    car_brand: "TVS", car_model: "Apache 160", car_year: 2025,
    fuel_type: "essence", transmission: "manual", seats: 2,
    images: [], status: "active", is_active: true, is_featured: false, is_verified: true, views: 87,
  },
  {
    title: "Toyota Hilux Pick-up 2020",
    description: "Hilux double cabine, 4x4, diesel, 60,000 km. Parfait pour entreprise ou usage personnel.",
    category: "cars", price: 18000000, city: "Douala", neighborhood: "Bonabéri",
    car_brand: "Toyota", car_model: "Hilux", car_year: 2020,
    fuel_type: "diesel", transmission: "manual", seats: 5,
    images: [], status: "active", is_active: true, is_featured: false, is_verified: true, views: 112,
  },
  {
    title: "Location Toyota Fortuner - journée/semaine",
    description: "SUV 7 places avec chauffeur disponible. Idéal pour déplacements professionnels ou familiaux.",
    category: "cars", price: 50000, price_per_day: 50000, city: "Douala", neighborhood: "Bonanjo",
    car_brand: "Toyota", car_model: "Fortuner", car_year: 2021,
    fuel_type: "diesel", transmission: "automatic", seats: 7,
    images: [], status: "active", is_active: true, is_featured: true, is_verified: true, views: 198,
  },
  // === TERRAIN ===
  {
    title: "Terrain 500m² titré - Logbessou",
    description: "Terrain plat, titré, borné, dans un quartier en plein développement. Route bitumée, eau et électricité disponibles.",
    category: "terrain", price: 5000000, city: "Douala", neighborhood: "Logbessou",
    terrain_type: "residential", surface_m2: 500, title_deed: true, zoning: "residential",
    images: [], status: "active", is_active: true, is_featured: true, is_verified: true, views: 89,
  },
  {
    title: "Parcelle 1000m² Nsimalen - proche aéroport",
    description: "Grande parcelle à Nsimalen, 5 min de l'aéroport international. Titre foncier en cours. Idéal investissement.",
    category: "terrain", price: 8000000, city: "Yaoundé", neighborhood: "Nsimalen",
    terrain_type: "commercial", surface_m2: 1000, title_deed: false, zoning: "mixed",
    images: [], status: "active", is_active: true, is_featured: false, is_verified: false, views: 45,
  },
  {
    title: "Terrain agricole 2 hectares - Moungo",
    description: "Terrain fertile dans la région du Moungo. Idéal pour plantation de cacao, palmier à huile ou agriculture vivrière.",
    category: "terrain", price: 3000000, city: "Nkongsamba", neighborhood: "Moungo",
    terrain_type: "agricultural", surface_m2: 20000, title_deed: true, zoning: "agricultural",
    images: [], status: "active", is_active: true, is_featured: false, is_verified: true, views: 23,
  },
  {
    title: "Lot de terrain Kribi bord de mer",
    description: "Terrain de 300m² en bord de mer à Kribi. Vue imprenable, accès plage privé. Parfait pour résidence secondaire ou hôtel.",
    category: "terrain", price: 15000000, city: "Kribi", neighborhood: "Plage",
    terrain_type: "residential", surface_m2: 300, title_deed: true, zoning: "residential",
    images: [], status: "active", is_active: true, is_featured: true, is_verified: true, views: 167,
  },
]

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')
  
  // Simple protection
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    return NextResponse.json({ 
      error: 'SUPABASE_SERVICE_ROLE_KEY not configured. Add it to .env.local' 
    }, { status: 500 })
  }
  
  if (key !== 'findr-seed-2026') {
    return NextResponse.json({ error: 'Invalid key' }, { status: 403 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey
  )

  const results = { inserted: 0, errors: 0, details: [] as string[] }

  for (const listing of DEMO_LISTINGS) {
    const { data, error } = await supabase
      .from('listings')
      .insert([{
        ...listing,
        user_id: '00000000-0000-0000-0000-000000000001', // placeholder
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select('id, title')
      .single()

    if (error) {
      results.errors++
      results.details.push(`❌ ${listing.title}: ${error.message}`)
    } else {
      results.inserted++
      results.details.push(`✅ ${listing.title} (${data.id})`)
    }
  }

  return NextResponse.json({
    success: results.errors === 0,
    total: DEMO_LISTINGS.length,
    ...results,
  })
}

export async function GET() {
  return NextResponse.json({ 
    info: 'POST /api/seed?key=findr-seed-2026 to seed demo data',
    listings: DEMO_LISTINGS.length,
    requires: 'SUPABASE_SERVICE_ROLE_KEY in .env.local'
  })
}
