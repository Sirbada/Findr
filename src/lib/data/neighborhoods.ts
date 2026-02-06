// Quartiers/Neighborhoods data for Cameroon's major cities

export interface Neighborhood {
  value: string
  label: string
  city: string
}

export const NEIGHBORHOODS: Record<string, Neighborhood[]> = {
  Douala: [
    { value: 'akwa', label: 'Akwa', city: 'Douala' },
    { value: 'bonanjo', label: 'Bonanjo', city: 'Douala' },
    { value: 'bonapriso', label: 'Bonapriso', city: 'Douala' },
    { value: 'bonamoussadi', label: 'Bonamoussadi', city: 'Douala' },
    { value: 'makepe', label: 'Makepe', city: 'Douala' },
    { value: 'kotto', label: 'Kotto', city: 'Douala' },
    { value: 'logpom', label: 'Logpom', city: 'Douala' },
    { value: 'logbessou', label: 'Logbessou', city: 'Douala' },
    { value: 'ndogbong', label: 'Ndogbong', city: 'Douala' },
    { value: 'ndokotti', label: 'Ndokotti', city: 'Douala' },
    { value: 'bepanda', label: 'Bepanda', city: 'Douala' },
    { value: 'deido', label: 'Deido', city: 'Douala' },
    { value: 'new-bell', label: 'New Bell', city: 'Douala' },
    { value: 'cite-sic', label: 'Cité SIC', city: 'Douala' },
    { value: 'pk8', label: 'PK8', city: 'Douala' },
    { value: 'pk10', label: 'PK10', city: 'Douala' },
    { value: 'pk12', label: 'PK12', city: 'Douala' },
    { value: 'pk14', label: 'PK14', city: 'Douala' },
    { value: 'yassa', label: 'Yassa', city: 'Douala' },
    { value: 'village', label: 'Village', city: 'Douala' },
    { value: 'bonaberi', label: 'Bonabéri', city: 'Douala' },
    { value: 'sodiko', label: 'Sodiko', city: 'Douala' },
  ],
  Yaoundé: [
    { value: 'bastos', label: 'Bastos', city: 'Yaoundé' },
    { value: 'nlongkak', label: 'Nlongkak', city: 'Yaoundé' },
    { value: 'omnisport', label: 'Omnisport', city: 'Yaoundé' },
    { value: 'essos', label: 'Essos', city: 'Yaoundé' },
    { value: 'mvan', label: 'Mvan', city: 'Yaoundé' },
    { value: 'biyem-assi', label: 'Biyem-Assi', city: 'Yaoundé' },
    { value: 'mendong', label: 'Mendong', city: 'Yaoundé' },
    { value: 'mimboman', label: 'Mimboman', city: 'Yaoundé' },
    { value: 'mokolo', label: 'Mokolo', city: 'Yaoundé' },
    { value: 'mvog-mbi', label: 'Mvog-Mbi', city: 'Yaoundé' },
    { value: 'mvog-ada', label: 'Mvog-Ada', city: 'Yaoundé' },
    { value: 'nkoldongo', label: 'Nkoldongo', city: 'Yaoundé' },
    { value: 'nsimeyong', label: 'Nsimeyong', city: 'Yaoundé' },
    { value: 'etoudi', label: 'Etoudi', city: 'Yaoundé' },
    { value: 'emana', label: 'Emana', city: 'Yaoundé' },
    { value: 'simbock', label: 'Simbock', city: 'Yaoundé' },
    { value: 'odza', label: 'Odza', city: 'Yaoundé' },
    { value: 'tongolo', label: 'Tongolo', city: 'Yaoundé' },
    { value: 'nkolbisson', label: 'Nkolbisson', city: 'Yaoundé' },
    { value: 'santa-barbara', label: 'Santa Barbara', city: 'Yaoundé' },
  ],
  Kribi: [
    { value: 'centre-ville', label: 'Centre Ville', city: 'Kribi' },
    { value: 'ngoye', label: 'Ngoye', city: 'Kribi' },
    { value: 'talla', label: 'Talla', city: 'Kribi' },
    { value: 'mokolo', label: 'Mokolo', city: 'Kribi' },
    { value: 'afan-mabe', label: 'Afan Mabé', city: 'Kribi' },
  ],
  Bafoussam: [
    { value: 'centre-ville', label: 'Centre Ville', city: 'Bafoussam' },
    { value: 'djeleng', label: 'Djeleng', city: 'Bafoussam' },
    { value: 'kamkop', label: 'Kamkop', city: 'Bafoussam' },
    { value: 'banengo', label: 'Banengo', city: 'Bafoussam' },
    { value: 'tougang', label: 'Tougang', city: 'Bafoussam' },
    { value: 'king-place', label: 'King Place', city: 'Bafoussam' },
  ],
  Bamenda: [
    { value: 'up-station', label: 'Up Station', city: 'Bamenda' },
    { value: 'commercial-avenue', label: 'Commercial Avenue', city: 'Bamenda' },
    { value: 'nkwen', label: 'Nkwen', city: 'Bamenda' },
    { value: 'mile-4', label: 'Mile 4', city: 'Bamenda' },
    { value: 'mile-2', label: 'Mile 2', city: 'Bamenda' },
    { value: 'ntarinkon', label: 'Ntarinkon', city: 'Bamenda' },
  ],
  Limbe: [
    { value: 'down-beach', label: 'Down Beach', city: 'Limbe' },
    { value: 'mile-4', label: 'Mile 4', city: 'Limbe' },
    { value: 'bota', label: 'Bota', city: 'Limbe' },
    { value: 'molyko', label: 'Molyko', city: 'Limbe' },
    { value: 'garden', label: 'Garden', city: 'Limbe' },
  ],
}

// Get all neighborhoods for a city
export function getNeighborhoodsByCity(city: string): Neighborhood[] {
  return NEIGHBORHOODS[city] || []
}

// Get all neighborhoods (flat list)
export function getAllNeighborhoods(): Neighborhood[] {
  return Object.values(NEIGHBORHOODS).flat()
}

// Search neighborhoods
export function searchNeighborhoods(query: string, city?: string): Neighborhood[] {
  const neighborhoods = city ? getNeighborhoodsByCity(city) : getAllNeighborhoods()
  const lowerQuery = query.toLowerCase()
  return neighborhoods.filter(n => 
    n.label.toLowerCase().includes(lowerQuery) ||
    n.value.toLowerCase().includes(lowerQuery)
  )
}
