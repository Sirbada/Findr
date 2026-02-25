'use client'

import { Smartphone, Download, Globe, Wifi, Bell, Star } from 'lucide-react'

export default function AppDownload() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-emerald-100 opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Content Side */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium mb-6">
              <Smartphone className="w-5 h-5" />
              Disponible partout
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <span className="block">Findr dans</span>
              <span className="block text-yellow-400">ta poche</span>
            </h2>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Accède à toutes tes annonces, reçois les notifications en temps réel, 
              et reste connecté avec tes acheteurs, même sans connexion.
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Wifi className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg">Fonctionne hors-ligne (PWA)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F59E0B' }}>
                  <Bell className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg">Notifications instantanées</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg">Interface optimisée mobile</span>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="space-y-4">
              
              {/* PWA Install */}
              <button className="w-full md:w-auto bg-white text-blue-700 px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl">
                <Download className="w-6 h-6" />
                Installer l'app (PWA)
              </button>

              {/* Coming Soon Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-black text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-3 opacity-60 cursor-not-allowed">
                  <div className="w-6 h-6 bg-white rounded text-black flex items-center justify-center text-xs font-bold">
                    📱
                  </div>
                  App Store (Bientôt)
                </button>
                <button className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-3 opacity-60 cursor-not-allowed">
                  <div className="w-6 h-6 bg-white rounded text-green-600 flex items-center justify-center text-xs font-bold">
                    ▶
                  </div>
                  Google Play (Bientôt)
                </button>
              </div>
              
              <p className="text-sm text-blue-200">
                💡 En attendant, ajoute findr.cm à ton écran d'accueil pour une expérience app native
              </p>
            </div>
          </div>

          {/* Phone Mockup Side */}
          <div className="relative">
            
            {/* Main Phone */}
            <div className="relative mx-auto w-80 h-160">
              
              {/* Phone Frame */}
              <div className="absolute inset-0 bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-black rounded-[2.5rem] p-1">
                  
                  {/* Screen */}
                  <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative">
                    
                    {/* Status Bar */}
                    <div className="bg-blue-600 px-6 py-3 flex justify-between items-center text-white text-sm">
                      <span className="font-medium">9:41</span>
                      <span>🔋 87%</span>
                    </div>

                    {/* App Content */}
                    <div className="p-4 space-y-4">
                      
                      {/* Header */}
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900">Findr</h3>
                        <p className="text-sm text-gray-600">Tes annonces</p>
                      </div>

                      {/* Listing Cards */}
                      <div className="space-y-3">
                        {[
                          { title: 'Toyota Camry 2020', price: '18.5M', status: '3 messages', color: 'bg-green-100 text-green-800' },
                          { title: 'iPhone 14 Pro Max', price: '850K', status: '1 message', color: 'bg-blue-100 text-blue-800' },
                          { title: 'Appartement T3', price: '120M', status: '7 messages', color: 'bg-yellow-100 text-yellow-800' }
                        ].map((item, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                                <div className="text-blue-600 font-bold text-sm">{item.price} FCFA</div>
                              </div>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${item.color}`}>
                                {item.status}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Bottom Navigation */}
                      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                        <div className="flex justify-around">
                          <div className="text-blue-600 text-xs text-center">
                            <div className="w-6 h-6 mx-auto mb-1 bg-blue-600 rounded"></div>
                            Accueil
                          </div>
                          <div className="text-gray-400 text-xs text-center">
                            <div className="w-6 h-6 mx-auto mb-1 bg-gray-300 rounded"></div>
                            Recherche
                          </div>
                          <div className="text-gray-400 text-xs text-center">
                            <div className="w-6 h-6 mx-auto mb-1 bg-gray-300 rounded"></div>
                            Messages
                          </div>
                          <div className="text-gray-400 text-xs text-center">
                            <div className="w-6 h-6 mx-auto mb-1 bg-gray-300 rounded"></div>
                            Profil
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Bubble */}
              <div className="absolute -top-4 -right-4 bg-red-500 text-white p-3 rounded-2xl shadow-lg animate-bounce">
                <div className="text-xs font-medium mb-1">Nouveau message!</div>
                <div className="text-xs opacity-90">"Je suis intéressé"</div>
              </div>

              {/* Wi-Fi Indicator */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                <Wifi className="w-3 h-3 inline mr-1" />
                Connecté
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '📱', title: 'Responsive', desc: 'Sur tous les écrans' },
            { icon: '⚡', title: 'Ultra-rapide', desc: 'Chargement < 2s' },
            { icon: '🔔', title: 'Notifications', desc: 'Temps réel' },
            { icon: '📶', title: 'Mode hors-ligne', desc: 'Même sans réseau' }
          ].map((feature, index) => (
            <div key={index} className="text-center text-white">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <div className="font-semibold mb-1">{feature.title}</div>
              <div className="text-sm text-blue-200">{feature.desc}</div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            📈 Performance de l'app
          </h3>
          <div className="grid grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-2">98%</div>
              <div className="text-sm text-blue-200">Satisfaction utilisateurs</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-green-400 mb-2">1.8s</div>
              <div className="text-sm text-blue-200">Temps de chargement</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#F59E0B' }}>24/7</div>
              <div className="text-sm text-blue-200">Disponibilité</div>
            </div>
          </div>
        </div>

        {/* How to Install PWA */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-2xl p-6">
          <h4 className="text-xl font-bold text-white mb-4">📋 Comment installer l'app:</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-yellow-400 mb-3">📱 Sur iPhone/iPad:</h5>
              <ol className="text-sm text-blue-100 space-y-2">
                <li>1. Ouvre findr.cm dans Safari</li>
                <li>2. Appuie sur le bouton de partage</li>
                <li>3. Sélectionne "Ajouter à l'écran d'accueil"</li>
                <li>4. Confirme l'installation</li>
              </ol>
            </div>
            <div>
              <h5 className="font-semibold text-green-400 mb-3">🤖 Sur Android:</h5>
              <ol className="text-sm text-blue-100 space-y-2">
                <li>1. Visite findr.cm dans Chrome</li>
                <li>2. Appuie sur "Ajouter à l'écran d'accueil"</li>
                <li>3. Ou va dans Menu → "Installer l'app"</li>
                <li>4. Confirme l'installation</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}