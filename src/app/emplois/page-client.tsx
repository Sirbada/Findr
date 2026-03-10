'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Search, MapPin, Briefcase, Clock, Building, 
  Heart, CheckCircle, ChevronDown, Grid, List
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { getListings, Listing } from '@/lib/supabase/queries'
import { useTranslation } from '@/lib/i18n/context'

function formatSalary(salary: number): string {
  return new Intl.NumberFormat('fr-FR').format(salary)
}

export function EmploisPageClient() {
  const { t, lang } = useTranslation()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'grid' | 'list'>('list')
  
  // Filters
  const [selectedCity, setSelectedCity] = useState('all')
  const [selectedContractType, setSelectedContractType] = useState('all')
  const [selectedSector, setSelectedSector] = useState('all')
  const [selectedSalary, setSelectedSalary] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const content = {
    cities: [
      { value: 'all', label: lang === 'fr' ? 'Toutes les villes' : 'All cities' },
      { value: 'Douala', label: 'Douala' },
      { value: 'Yaoundé', label: 'Yaoundé' },
      { value: 'Bafoussam', label: 'Bafoussam' },
      { value: 'Bamenda', label: 'Bamenda' },
      { value: 'Limbe', label: 'Limbe' },
    ],
    contractTypes: lang === 'fr' ? [
      { value: 'all', label: 'Tous les types' },
      { value: 'CDI', label: 'CDI' },
      { value: 'CDD', label: 'CDD' },
      { value: 'Stage', label: 'Stage' },
      { value: 'Freelance', label: 'Freelance' },
      { value: 'Temps partiel', label: 'Temps partiel' },
    ] : [
      { value: 'all', label: 'All types' },
      { value: 'CDI', label: 'Full-time' },
      { value: 'CDD', label: 'Fixed-term' },
      { value: 'Stage', label: 'Internship' },
      { value: 'Freelance', label: 'Freelance' },
      { value: 'Temps partiel', label: 'Part-time' },
    ],
    sectors: lang === 'fr' ? [
      { value: 'all', label: 'Tous les secteurs' },
      { value: 'Informatique', label: 'Informatique' },
      { value: 'Commerce', label: 'Commerce' },
      { value: 'Santé', label: 'Santé' },
      { value: 'Éducation', label: 'Éducation' },
      { value: 'Construction', label: 'Construction' },
      { value: 'Transport', label: 'Transport' },
      { value: 'Finance', label: 'Finance' },
    ] : [
      { value: 'all', label: 'All sectors' },
      { value: 'Informatique', label: 'IT' },
      { value: 'Commerce', label: 'Commerce' },
      { value: 'Santé', label: 'Healthcare' },
      { value: 'Éducation', label: 'Education' },
      { value: 'Construction', label: 'Construction' },
      { value: 'Transport', label: 'Transport' },
      { value: 'Finance', label: 'Finance' },
    ],
    salaryRanges: lang === 'fr' ? [
      { value: 'all', label: 'Tous les salaires' },
      { value: '0-100000', label: 'Moins de 100 000 XAF' },
      { value: '100000-200000', label: '100 000 - 200 000 XAF' },
      { value: '200000-500000', label: '200 000 - 500 000 XAF' },
      { value: '500000-1000000', label: '500 000 - 1 000 000 XAF' },
      { value: '1000000+', label: 'Plus de 1 000 000 XAF' },
    ] : [
      { value: 'all', label: 'All salaries' },
      { value: '0-100000', label: 'Under 100,000 XAF' },
      { value: '100000-200000', label: '100,000 - 200,000 XAF' },
      { value: '200000-500000', label: '200,000 - 500,000 XAF' },
      { value: '500000-1000000', label: '500,000 - 1,000,000 XAF' },
      { value: '1000000+', label: 'Over 1,000,000 XAF' },
    ],
    heroTitle: lang === 'fr' ? 'Votre carrière commence ici' : 'Your career starts here',
    heroSubtitle: lang === 'fr' ? 'Découvrez des milliers d\'opportunités professionnelles au Cameroun' : 'Discover thousands of job opportunities in Cameroon',
    search: lang === 'fr' ? 'Rechercher' : 'Search',
    city: lang === 'fr' ? 'Ville' : 'City',
    contractType: lang === 'fr' ? 'Type de contrat' : 'Contract type',
    sector: lang === 'fr' ? 'Secteur' : 'Sector',
    salary: lang === 'fr' ? 'Salaire' : 'Salary',
    resultsFound: (count: number) => lang === 'fr' 
      ? `${count} emploi${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''}`
      : `${count} ${count === 1 ? 'job' : 'jobs'} found`,
    allCameroon: lang === 'fr' ? 'Tout le Cameroun' : 'All Cameroon',
    remote: lang === 'fr' ? 'Télétravail' : 'Remote',
    noResults: lang === 'fr' ? 'Aucun emploi trouvé' : 'No jobs found',
    tryDifferent: lang === 'fr' ? 'Essayez de modifier vos critères de recherche' : 'Try adjusting your search criteria',
  }

  useEffect(() => {
    async function fetchListings() {
      const data = await getListings({ category: 'jobs' })
      setListings(data)
      setLoading(false)
    }
    fetchListings()
  }, [])

  // Filter and sort listings
  const filteredAndSortedListings = (() => {
    let filtered = listings.filter(listing => {
      if (selectedCity !== 'all' && listing.city !== selectedCity) return false
      if (searchQuery && !listing.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !listing.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false
      
      return true
    })

    switch (sortBy) {
      case 'salary-high':
        return filtered.sort((a, b) => b.price - a.price)
      case 'salary-low':
        return filtered.sort((a, b) => a.price - b.price)
      case 'newest':
      default:
        return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
  })()

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <Header />
      
      {/* Hero Search */}
      <div className="bg-gradient-to-r from-[#1A1A2E] to-[#E8630A] py-16 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {content.heroTitle}
          </h1>
          <p className="text-xl text-white/70 mb-12 max-w-2xl">
            {content.heroSubtitle}
          </p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poste ou entreprise
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: Développeur, comptable..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#E8630A] focus:border-[#E8630A]/30 transition-all duration-300 bg-gray-50 hover:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{content.city}</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#E8630A] focus:border-[#E8630A]/30 transition-all duration-300 bg-gray-50 hover:bg-white"
                >
                  {content.cities.map(city => (
                    <option key={city.value} value={city.value}>{city.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{content.contractType}</label>
                <select
                  value={selectedContractType}
                  onChange={(e) => setSelectedContractType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#E8630A] focus:border-[#E8630A]/30 transition-all duration-300 bg-gray-50 hover:bg-white"
                >
                  {content.contractTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <Button size="lg" className="w-full bg-[#E8630A] hover:bg-[#1A1A2E] rounded-lg py-3 font-medium">
                  <Search className="w-5 h-5 mr-3" />
                  {content.search}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {content.resultsFound(filteredAndSortedListings.length)}
              </h2>
              <p className="text-sm text-gray-500">
                {selectedCity !== 'all' ? selectedCity : content.allCameroon}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#E8630A] focus:border-transparent appearance-none"
              >
                <option value="newest">Plus récent</option>
                <option value="salary-high">Salaire décroissant</option>
                <option value="salary-low">Salaire croissant</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Listings */}
          {loading ? (
            <div className="space-y-4">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="animate-pulse bg-white rounded-xl p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedListings.map((listing) => (
                <Link 
                  key={listing.id} 
                  href={`/emplois/${listing.id}`}
                  className="group block"
                >
                  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 border border-[#E5E7EB]">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#E8630A] transition-colors mb-1">
                          {listing.title}
                        </h3>
                        <p className="text-gray-600 mb-2 flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          Entreprise
                        </p>
                        <div className="flex items-center text-gray-500 text-sm mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          {listing.city}
                          <span className="mx-2">•</span>
                          <Clock className="w-4 h-4 mr-1" />
                          CDI
                          <span className="mx-2">•</span>
                          <Briefcase className="w-4 h-4 mr-1" />
                          Sur site
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#E8630A] mb-1">
                          {listing.price ? `${formatSalary(listing.price)} XAF` : 'À négocier'}
                        </div>
                        <div className="text-sm text-gray-500">par mois</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {listing.description || 'Description de l\'emploi...'}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {listing.is_featured && (
                          <span className="bg-emerald-600 text-white text-xs font-medium px-2 py-1 rounded">
                            En vedette
                          </span>
                        )}
                        {listing.is_verified && (
                          <span className="bg-[#FFF4EC] text-[#E8630A] text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Vérifié
                          </span>
                        )}
                      </div>
                      
                      <button className="text-gray-400 hover:text-[#E8630A] transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredAndSortedListings.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-8 bg-[#FFF4EC] rounded-full flex items-center justify-center">
                <Briefcase className="w-12 h-12 text-[#E8630A]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {content.noResults}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {content.tryDifferent}
              </p>
              <Link href="/dashboard/new">
                <Button size="lg" className="bg-[#E8630A] hover:bg-[#1A1A2E] px-8">
                  Publier une offre d'emploi
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}