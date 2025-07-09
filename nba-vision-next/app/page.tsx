import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, GitCompare, Brain, TrendingUp, Award, Target } from "lucide-react"
import { BasketballLoader } from "@/components/basketball-loader"
import { FloatingBasketballs } from "@/components/floating-basketballs"
import { CourtLines } from "@/components/court-lines"
import { SpotlightEffect } from "@/components/spotlight-effect"

export default function HomePage() {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(to bottom right, #ffedd5, #fff7ed, #fffbeb)" }}
    >
      {/* Dynamic Court Background */}
      <CourtLines />

      {/* Animated Basketballs */}
      <FloatingBasketballs count={8} />

      {/* Spotlight Effect */}
      <SpotlightEffect />

      {/* Navigation */}
      <nav
        className="sticky z-50 border"
        style={{
          background: "linear-gradient(to right, rgba(124, 45, 18, 0.9), rgba(120, 53, 15, 0.9))",
          backdropFilter: "blur(12px)",
          borderColor: "#fed7aa",
          top: 0,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 basketball-texture rounded-full flex items-center justify-center shadow-lg relative">
                <div className="absolute border border-orange-300 rounded-full" style={{ inset: "4px" }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1 bg-orange-300 rounded-full" style={{ height: "1.5rem" }}></div>
                  <div className="h-1 bg-orange-300 rounded-full absolute" style={{ width: "1.5rem" }}></div>
                </div>
                <BarChart3 className="w-5 h-5 text-white relative z-10" />
              </div>
              <span className="text-2xl font-bold text-white drop-shadow-lg">🏀 NBAspire</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-white font-medium nav-link">
                Accueil
              </Link>
              <Link href="/joueurs" className="text-orange-200 nav-link hover:text-white">
                Joueurs
              </Link>
              <Link href="/comparaison" className="text-orange-200 nav-link hover:text-white">
                Comparaison
              </Link>
              <Link href="/simulation" className="text-orange-200 nav-link hover:text-white">
                Simulation
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <div className="text-8xl mb-4 basketball-bounce-css">🏀</div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-orange-900 drop-shadow-lg">NBAspire</h1>
            <div
              className="w-32 h-1 mx-auto mb-6 rounded-full animate-pulse"
              style={{ background: "linear-gradient(to right, #f97316, #f59e0b)" }}
            ></div>
          </div>
          <p className="text-xl text-orange-800 mb-8 max-w-3xl mx-auto font-medium">
            Plongez dans l'univers des statistiques NBA avec notre plateforme interactive ! Analysez, comparez et
            prédisez les performances des joueurs comme un vrai coach !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/joueurs" className="btn-primary">
              <Users className="w-5 h-5 mr-2" />
              Explorer les Joueurs
            </Link>
            <Link href="/comparaison" className="btn-outline">
              <GitCompare className="w-5 h-5 mr-2" />
              Comparer les Stats
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold text-center mb-4 text-orange-900">Fonctionnalités All-Star</h2>
          <div
            className="w-24 h-1 mx-auto mb-12 rounded-full"
            style={{ background: "linear-gradient(to right, #f97316, #f59e0b)" }}
          ></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
              className="card-hover"
              style={{
                background: "linear-gradient(to bottom right, white, #fff7ed)",
                border: "2px solid #fed7aa",
              }}
            >
              <CardHeader className="text-center">
                <Users className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <CardTitle className="text-orange-900">Profils Joueurs</CardTitle>
                <CardDescription>Consultez les stats détaillées de tous les joueurs NBA</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/joueurs"
                  className="w-full text-orange-700 hover:bg-orange-100 p-2 rounded text-center block transition-colors"
                >
                  Découvrir →
                </Link>
              </CardContent>
            </Card>

            <Card
              className="card-hover"
              style={{
                background: "linear-gradient(to bottom right, white, #eff6ff)",
                border: "2px solid #bfdbfe",
              }}
            >
              <CardHeader className="text-center">
                <GitCompare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-blue-900">Comparaison</CardTitle>
                <CardDescription>Face-à-face entre joueurs</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/comparaison"
                  className="w-full text-blue-700 hover:bg-blue-100 p-2 rounded text-center block transition-colors"
                >
                  Comparer →
                </Link>
              </CardContent>
            </Card>

            <Card
              className="card-hover"
              style={{
                background: "linear-gradient(to bottom right, white, #faf5ff)",
                border: "2px solid #d8b4fe",
              }}
            >
              <CardHeader className="text-center">
                <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-purple-900">Simulation ML</CardTitle>
                <CardDescription>IA de prédiction précise</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/simulation"
                  className="w-full text-purple-700 hover:bg-purple-100 p-2 rounded text-center block transition-colors"
                >
                  Simuler →
                </Link>
              </CardContent>
            </Card>

            <Card
              className="card-hover"
              style={{
                background: "linear-gradient(to bottom right, white, #f0fdf4)",
                border: "2px solid #bbf7d0",
              }}
            >
              <CardHeader className="text-center">
                <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-green-900">Analyses</CardTitle>
                <CardDescription>Données fraîches du terrain</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700 text-center font-medium">📊 Kaggle & APIs officielles</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="py-16 px-4 sm:px-6 lg:px-8 relative"
        style={{
          background: "linear-gradient(to right, rgba(124, 45, 18, 0.1), rgba(120, 53, 15, 0.1))",
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(249, 115, 22, 0.05), rgba(245, 158, 11, 0.05))" }}
        ></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="stat-card">
              <div className="text-5xl font-bold text-orange-600 mb-2">
                <span className="counter" data-target="500">
                  500
                </span>
                +
              </div>
              <div className="text-orange-800 font-semibold">Joueurs Analysés</div>
              <div className="progress-bar">
                <div className="progress-fill orange"></div>
              </div>
            </div>
            <div className="stat-card">
              <div className="text-5xl font-bold text-blue-600 mb-2">
                <span className="counter" data-target="30">
                  30
                </span>
              </div>
              <div className="text-blue-800 font-semibold">Équipes NBA</div>
              <div className="progress-bar">
                <div className="progress-fill blue"></div>
              </div>
            </div>
            <div className="stat-card">
              <div className="text-5xl font-bold text-purple-600 mb-2">
                <span className="counter" data-target="95">
                  95
                </span>
                %
              </div>
              <div className="text-purple-800 font-semibold">Précision des Prédictions</div>
              <div className="progress-bar">
                <div className="progress-fill purple"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 text-orange-900">Prêt à Dominer les Stats NBA ?</h2>
          <div
            className="w-32 h-1 mx-auto mb-8 rounded-full"
            style={{ background: "linear-gradient(to right, #f97316, #f59e0b)" }}
          ></div>
          <p className="text-lg text-orange-800 mb-8 font-medium">
            Rejoins l'élite des analystes NBA et découvre les secrets des champions !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/joueurs" className="btn-primary" style={{ padding: "1rem 2rem" }}>
              <Award className="w-5 h-5 mr-2" />
              Commencer l'Analyse
            </Link>
            <Link href="/simulation" className="btn-outline" style={{ padding: "1rem 2rem" }}>
              <Target className="w-5 h-5 mr-2" />
              Tester les Prédictions
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-12 px-4 sm:px-6 lg:px-8 relative text-white"
        style={{
          background: "linear-gradient(to right, #7c2d12, #78350f)",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="basketballs" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="20" fill="none" stroke="white" strokeWidth="1" />
                <line x1="30" y1="50" x2="70" y2="50" stroke="white" strokeWidth="1" />
                <path d="M50 30 Q60 50 50 70 Q40 50 50 30" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#basketballs)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 basketball-texture rounded-full flex items-center justify-center shadow-lg relative">
              <div className="absolute border border-orange-300 rounded-full" style={{ inset: "4px" }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1 bg-orange-300 rounded-full" style={{ height: "1.5rem" }}></div>
                <div className="h-1 bg-orange-300 rounded-full absolute" style={{ width: "1.5rem" }}></div>
              </div>
              <BarChart3 className="w-5 h-5 text-white relative z-10" />
            </div>
            <span className="text-2xl font-bold">🏀 NBAspire</span>
          </div>
          <p className="text-orange-200 mb-6 text-lg">La plateforme d'analyse NBA qui fait la différence !</p>
          <div className="flex justify-center space-x-8 text-lg">
            <Link href="/" className="text-orange-200 hover:text-white transition-colors font-medium nav-link">
              Accueil
            </Link>
            <Link href="/joueurs" className="text-orange-200 hover:text-white transition-colors font-medium nav-link">
              Joueurs
            </Link>
            <Link
              href="/comparaison"
              className="text-orange-200 hover:text-white transition-colors font-medium nav-link"
            >
              Comparaison
            </Link>
            <Link
              href="/simulation"
              className="text-orange-200 hover:text-white transition-colors font-medium nav-link"
            >
              Simulation
            </Link>
          </div>
        </div>
      </footer>

      {/* Loading Animation */}
      <BasketballLoader />
    </div>
  )
}
