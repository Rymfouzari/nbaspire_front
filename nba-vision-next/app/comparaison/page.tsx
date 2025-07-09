"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, GitCompare, Users, Loader2, AlertCircle, Trophy } from "lucide-react"
import { FloatingBasketballs } from "@/components/floating-basketballs"
import { CourtLines } from "@/components/court-lines"
import { SpotlightEffect } from "@/components/spotlight-effect"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Types pour les données de l'API
interface Player {
  player_id: string
  name: string
  team: string
}

interface PlayerStats {
  player_id: string
  name: string
  team: string
  position: string
  points: number
  rebounds: number
  assists: number
  field_goal_percentage: number
  three_point_percentage: number
  free_throw_percentage: number
  efficiency: number
}

interface ComparisonResult {
  player1: PlayerStats
  player2: PlayerStats
  global_score: {
    player1_score: number
    player2_score: number
  }
  win_contribution_difference: number // Différence en victoires (positif = player1 meilleur)
}

export default function ComparaisonPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loadingPlayers, setLoadingPlayers] = useState(true)
  const [loadingComparison, setLoadingComparison] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [player1Id, setPlayer1Id] = useState<string>("")
  const [player2Id, setPlayer2Id] = useState<string>("")
  const [comparisonData, setComparisonData] = useState<ComparisonResult | null>(null)

  // URL API Chalice
  const API_BASE_URL = "https://ljrpfvbp26.execute-api.eu-west-1.amazonaws.com/api/"
  const uniquePlayers = Array.from(
  new Map(players.map(p => [p.player_id, p])).values()
)
  // Charger la liste des joueurs
  // Charger la liste des joueurs
  const fetchPlayers = async () => {
      try {
        setLoadingPlayers(true)
        setError(null)
        const response = await fetch(`${API_BASE_URL}/players`)
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`)
        }
        const data = await response.json()

        // Normalisation des IDs en string et suppression des doublons
        const deduplicated: Player[] = Array.from(
        new Map(
          data.data.map((p: Player) => [p.player_id, { ...p, player_id: p.player_id.toString() }])
        ).values()
        )

        setPlayers(deduplicated)
      } catch (err) {
        console.error("Erreur lors du chargement des joueurs:", err)
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des joueurs")
      } finally {
        setLoadingPlayers(false)
      }
  }


  // Comparer deux joueurs
  const fetchComparison = async (playerId1: string, playerId2: string) => {
    try {
      setLoadingComparison(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/compare/${playerId1}/${playerId2}`)
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }
      const data = await response.json()
      setComparisonData(data)
    } catch (err) {
      console.error("Erreur lors de la comparaison:", err)
      setError(err instanceof Error ? err.message : "Erreur lors de la comparaison")
      setComparisonData(null)
    } finally {
      setLoadingComparison(false)
    }
  }

  // Initialiser
  useEffect(() => {
    fetchPlayers()
  }, [])


  // Lancer comparaison quand 2 joueurs sont choisis
  useEffect(() => {
    if (player1Id && player2Id && player1Id !== player2Id) {
      fetchComparison(player1Id, player2Id)
    } else {
      setComparisonData(null)
    }
  }, [player1Id, player2Id])


  const getComparisonColor = (value1: number, value2: number, isPlayer1: boolean) => {
    if (Math.abs(value1 - value2) < 0.1) return "#9ca3af"
    return (isPlayer1 ? value1 > value2 : value2 > value1) ? "#10b981" : "#ef4444"
  }

  const getProgressValue = (value: number, max: number) => {
    return Math.min((value / max) * 100, 100)
  }

  const getWinContributionBadge = () => {
    if (!comparisonData) return null
    const diff = comparisonData.win_contribution_difference
    const absDiff = Math.abs(diff)
    if (absDiff < 0.1) {
      return (
        <Badge variant="outline" className="text-gray-600 border-gray-400">
          🤝 Contribution équivalente
        </Badge>
      )
    }
    return diff > 0 ? (
      <Badge className="bg-green-600 text-white">✅ {absDiff.toFixed(1)} victoires de plus</Badge>
    ) : (
      <Badge className="bg-red-600 text-white">❌ {absDiff.toFixed(1)} victoires de moins</Badge>
    )
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(to bottom right, #ffedd5, #fff7ed, #fffbeb)" }}
    >
      {/* Dynamic Court Background */}
      <CourtLines />
      <FloatingBasketballs count={8} />
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
              <Link href="/" className="text-orange-200 nav-link hover:text-white">
                Accueil
              </Link>
              <Link href="/joueurs" className="text-orange-200 nav-link hover:text-white">
                Joueurs
              </Link>
              <Link href="/comparaison" className="text-white font-medium nav-link hover:text-orange-200">
                Comparaison
              </Link>
              <Link href="/simulation" className="text-orange-200 nav-link hover:text-white">
                Simulation
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-orange-900 drop-shadow-lg">Comparaison de Joueurs</h1>
          <div
            className="w-32 h-1 mx-auto mb-6 rounded-full"
            style={{ background: "linear-gradient(to right, #f97316, #f59e0b)" }}
          ></div>
          <p className="text-xl text-orange-800 mb-8 max-w-3xl mx-auto font-medium">
            Face-à-face entre les légendes NBA ! Comparez les performances statistiques et découvrez qui domine !
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State for Players */}
        {loadingPlayers ? (
          <Card
            className="shadow-xl mb-8"
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(12px)",
              border: "2px solid #fdba74",
            }}
          >
            <CardContent className="text-center py-16">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-orange-600" />
              <h3 className="text-2xl font-bold text-orange-900 mb-2">Chargement des joueurs...</h3>
              <p className="text-lg text-orange-700">Récupération des données depuis l'API</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Player Selection */}
            <div
              className="mb-8 p-8 border-2 shadow-xl rounded-2xl"
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(12px)",
                borderColor: "#fed7aa",
              }}
            >
              <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div>
                  <label className="block text-lg font-bold text-orange-900 mb-3">Joueur 1</label>
                  <Select value={player1Id} onValueChange={setPlayer1Id}>
                    <SelectTrigger
                      className="h-12 text-lg"
                      style={{
                        background: "#fff7ed",
                        border: "2px solid #fdba74",
                      }}
                    >
                      <SelectValue placeholder="Sélectionner un joueur" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniquePlayers.map((player) => (
                        <SelectItem key={`${player.player_id || "unknown"}-${player.team || "no-team"}-${player.name || "no-name"}`}
                        value={player.player_id}
                        >
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-lg font-bold text-orange-900 mb-3">Joueur 2</label>
                  <Select value={player2Id} onValueChange={setPlayer2Id}>
                    <SelectTrigger
                      className="h-12 text-lg"
                      style={{
                        background: "#fff7ed",
                        border: "2px solid #fdba74",
                      }}
                    >
                      <SelectValue placeholder="Sélectionner un joueur" />
                    </SelectTrigger>
                    <SelectContent>
                      {players
                        .filter((player) => player.player_id !== player1Id)
                        .map((player) => (
                          <SelectItem key={player.player_id} value={player.player_id}>
                            {player.name} - {player.team}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Loading State for Comparison */}
            {loadingComparison && (
              <Card
                className="shadow-xl mb-8"
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(12px)",
                  border: "2px solid #fdba74",
                }}
              >
                <CardContent className="text-center py-16">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-orange-600" />
                  <h3 className="text-2xl font-bold text-orange-900 mb-2">Comparaison en cours...</h3>
                  <p className="text-lg text-orange-700">Analyse des performances</p>
                </CardContent>
              </Card>
            )}

            {/* Comparison Results */}
            {comparisonData && !loadingComparison ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {/* Global Scores */}
                <Card
                  className="shadow-xl"
                  style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(12px)",
                    border: "2px solid #fdba74",
                  }}
                >
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-3 text-2xl text-orange-900">
                      <Trophy className="w-8 h-8" />
                      Score Global
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-8 text-center">
                      <div>
                        <h3 className="text-xl font-bold text-orange-900 mb-2">{comparisonData.player1.name}</h3>
                        <div className="text-4xl font-bold text-orange-600 mb-2">
                          {comparisonData.global_score.player1_score.toFixed(1)}
                        </div>
                        {getWinContributionBadge()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-orange-900 mb-2">{comparisonData.player2.name}</h3>
                        <div className="text-4xl font-bold text-blue-600 mb-2">
                          {comparisonData.global_score.player2_score.toFixed(1)}
                        </div>
                        <Badge variant="outline" className="text-gray-600 border-gray-400">
                          Référence
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Player Cards */}
                <div className="grid gap-8" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <Card
                    className="card-hover"
                    style={{
                      background: "linear-gradient(to bottom right, white, #fff7ed)",
                      border: "2px solid #fed7aa",
                    }}
                  >
                    <CardHeader className="text-center">
                      <div
                        className="mx-auto mb-4 basketball-texture rounded-full flex items-center justify-center text-white font-bold shadow-xl relative"
                        style={{ width: "6rem", height: "6rem", fontSize: "1.5rem" }}
                      >
                        <div
                          className="absolute border-2 border-orange-300 rounded-full"
                          style={{ inset: "4px" }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-1 bg-orange-300 rounded-full" style={{ height: "4rem" }}></div>
                          <div className="h-1 bg-orange-300 rounded-full absolute" style={{ width: "4rem" }}></div>
                        </div>
                        <span className="relative z-10">
                          {comparisonData.player1.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <CardTitle className="text-2xl text-orange-900">{comparisonData.player1.name}</CardTitle>
                      <CardDescription className="flex items-center justify-center gap-3">
                        <Badge className="text-white text-lg px-4 py-2" style={{ background: "#f97316" }}>
                          {comparisonData.player1.team}
                        </Badge>
                        <Badge variant="outline" className="border-orange-400 text-orange-700 text-lg px-4 py-2">
                          {comparisonData.player1.position}
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card
                    className="card-hover"
                    style={{
                      background: "linear-gradient(to bottom right, white, #eff6ff)",
                      border: "2px solid #bfdbfe",
                    }}
                  >
                    <CardHeader className="text-center">
                      <div
                        className="mx-auto mb-4 basketball-texture rounded-full flex items-center justify-center text-white font-bold shadow-xl relative"
                        style={{ width: "6rem", height: "6rem", fontSize: "1.5rem" }}
                      >
                        <div
                          className="absolute border-2 border-orange-300 rounded-full"
                          style={{ inset: "4px" }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-1 bg-orange-300 rounded-full" style={{ height: "4rem" }}></div>
                          <div className="h-1 bg-orange-300 rounded-full absolute" style={{ width: "4rem" }}></div>
                        </div>
                        <span className="relative z-10">
                          {comparisonData.player2.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <CardTitle className="text-2xl text-orange-900">{comparisonData.player2.name}</CardTitle>
                      <CardDescription className="flex items-center justify-center gap-3">
                        <Badge className="text-white text-lg px-4 py-2" style={{ background: "#3b82f6" }}>
                          {comparisonData.player2.team}
                        </Badge>
                        <Badge variant="outline" className="border-blue-400 text-blue-700 text-lg px-4 py-2">
                          {comparisonData.player2.position}
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>

                {/* Stats Comparison */}
                <Card
                  className="shadow-xl card-hover"
                  style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(12px)",
                    border: "2px solid #fdba74",
                  }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl text-orange-900">
                      <GitCompare className="w-8 h-8" />
                      Comparaison Statistique
                    </CardTitle>
                    <CardDescription className="text-lg text-orange-700">
                      Les barres vertes indiquent le joueur avec la meilleure performance dans chaque catégorie 🏆
                    </CardDescription>
                  </CardHeader>
                  <CardContent style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    {/* Points */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-lg text-orange-900">Points par match</span>
                        <div className="flex gap-8">
                          <span className="text-xl font-bold text-orange-600">{comparisonData.player1.points}</span>
                          <span className="text-xl font-bold text-blue-600">{comparisonData.player2.points}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Progress
                          value={getProgressValue(comparisonData.player1.points, 40)}
                          style={{
                            height: "1rem",
                            background: getComparisonColor(
                              comparisonData.player1.points,
                              comparisonData.player2.points,
                              true,
                            ),
                          }}
                        />
                        <Progress
                          value={getProgressValue(comparisonData.player2.points, 40)}
                          style={{
                            height: "1rem",
                            background: getComparisonColor(
                              comparisonData.player1.points,
                              comparisonData.player2.points,
                              false,
                            ),
                          }}
                        />
                      </div>
                    </div>

                    {/* Rebounds */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-lg text-orange-900">Rebonds par match</span>
                        <div className="flex gap-8">
                          <span className="text-xl font-bold text-orange-600">{comparisonData.player1.rebounds}</span>
                          <span className="text-xl font-bold text-blue-600">{comparisonData.player2.rebounds}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Progress
                          value={getProgressValue(comparisonData.player1.rebounds, 15)}
                          style={{
                            height: "1rem",
                            background: getComparisonColor(
                              comparisonData.player1.rebounds,
                              comparisonData.player2.rebounds,
                              true,
                            ),
                          }}
                        />
                        <Progress
                          value={getProgressValue(comparisonData.player2.rebounds, 15)}
                          style={{
                            height: "1rem",
                            background: getComparisonColor(
                              comparisonData.player1.rebounds,
                              comparisonData.player2.rebounds,
                              false,
                            ),
                          }}
                        />
                      </div>
                    </div>

                    {/* Assists */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-lg text-orange-900">Passes par match</span>
                        <div className="flex gap-8">
                          <span className="text-xl font-bold text-orange-600">{comparisonData.player1.assists}</span>
                          <span className="text-xl font-bold text-blue-600">{comparisonData.player2.assists}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Progress
                          value={getProgressValue(comparisonData.player1.assists, 12)}
                          style={{
                            height: "1rem",
                            background: getComparisonColor(
                              comparisonData.player1.assists,
                              comparisonData.player2.assists,
                              true,
                            ),
                          }}
                        />
                        <Progress
                          value={getProgressValue(comparisonData.player2.assists, 12)}
                          style={{
                            height: "1rem",
                            background: getComparisonColor(
                              comparisonData.player1.assists,
                              comparisonData.player2.assists,
                              false,
                            ),
                          }}
                        />
                      </div>
                    </div>

                    {/* Field Goal % */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-lg text-orange-900">% Réussite au tir</span>
                        <div className="flex gap-8">
                          <span className="text-xl font-bold text-orange-600">
                            {comparisonData.player1.field_goal_percentage}%
                          </span>
                          <span className="text-xl font-bold text-blue-600">
                            {comparisonData.player2.field_goal_percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Progress
                          value={comparisonData.player1.field_goal_percentage}
                          style={{
                            height: "1rem",
                            background: getComparisonColor(
                              comparisonData.player1.field_goal_percentage,
                              comparisonData.player2.field_goal_percentage,
                              true,
                            ),
                          }}
                        />
                        <Progress
                          value={comparisonData.player2.field_goal_percentage}
                          style={{
                            height: "1rem",
                            background: getComparisonColor(
                              comparisonData.player1.field_goal_percentage,
                              comparisonData.player2.field_goal_percentage,
                              false,
                            ),
                          }}
                        />
                      </div>
                    </div>

                    {/* Three Point % */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-lg text-orange-900">% Réussite à 3 points</span>
                        <div className="flex gap-8">
                          <span className="text-xl font-bold text-orange-600">
                            {comparisonData.player1.three_point_percentage}%
                          </span>
                          <span className="text-xl font-bold text-blue-600">
                            {comparisonData.player2.three_point_percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Progress
                          value={comparisonData.player1.three_point_percentage}
                          style={{
                            height: "1rem",
                            background: getComparisonColor(
                              comparisonData.player1.three_point_percentage,
                              comparisonData.player2.three_point_percentage,
                              true,
                            ),
                          }}
                        />
                        <Progress
                          value={comparisonData.player2.three_point_percentage}
                          style={{
                            height: "1rem",
                            background: getComparisonColor(
                              comparisonData.player1.three_point_percentage,
                              comparisonData.player2.three_point_percentage,
                              false,
                            ),
                          }}
                        />
                      </div>
                    </div>

                    {/* Efficiency */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-lg text-orange-900">Efficacité</span>
                        <div className="flex gap-8">
                          <span className="text-xl font-bold text-orange-600">{comparisonData.player1.efficiency}</span>
                          <span className="text-xl font-bold text-blue-600">{comparisonData.player2.efficiency}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Progress
                          value={getProgressValue(comparisonData.player1.efficiency, 40)}
                          style={{
                            height: "1rem",
                            background: getComparisonColor(
                              comparisonData.player1.efficiency,
                              comparisonData.player2.efficiency,
                              true,
                            ),
                          }}
                        />
                        <Progress
                          value={getProgressValue(comparisonData.player2.efficiency, 40)}
                          style={{
                            height: "1rem",
                            background: getComparisonColor(
                              comparisonData.player1.efficiency,
                              comparisonData.player2.efficiency,
                              false,
                            ),
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : !loadingComparison && player1Id && player2Id ? (
              <Card
                className="shadow-xl"
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(12px)",
                  border: "2px solid #fdba74",
                }}
              >
                <CardContent className="text-center py-16">
                  <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                  <h3 className="text-2xl font-bold text-orange-900 mb-2">Erreur de comparaison</h3>
                  <p className="text-lg text-orange-700">Impossible de comparer ces joueurs. Veuillez réessayer.</p>
                </CardContent>
              </Card>
            ) : (
              <Card
                className="shadow-xl"
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(12px)",
                  border: "2px solid #fdba74",
                }}
              >
                <CardContent className="text-center py-16">
                  <Users
                    style={{ width: "5rem", height: "5rem", margin: "0 auto", color: "#fb923c" }}
                    className="mb-6"
                  />
                  <h3 className="text-3xl font-bold text-orange-900 mb-4">Prêt pour le Face-à-Face ?</h3>
                  <p className="text-xl text-orange-700 font-medium">
                    Sélectionnez deux joueurs dans les menus ci-dessus pour voir leur comparaison !
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
