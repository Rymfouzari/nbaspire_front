"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, Loader2, AlertCircle } from "lucide-react"
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
  const API_BASE_URL = "https://o13guuit0k.execute-api.eu-west-1.amazonaws.com/dev"
  const uniquePlayers = Array.from(new Map(players.map((p) => [p.player_id, p])).values())

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
          data.data.map((p: any) => [
            p.player_id,
            {
              player_id: p.player_id.toString(),
              name: p.player || "Nom inconnu",
              team: p.tm || "Aucune équipe",
            },
          ]),
        ).values(),
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
      console.log("Comparaison :", playerId1, playerId2)
      const id1 = Number.parseInt(playerId1).toString()
      const id2 = Number.parseInt(playerId2).toString()
      console.log("Envoi de la comparaison :", id1, id2)
      const response = await fetch(`${API_BASE_URL}/compare/${id1}/${id2}`)
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

  // Calculer le nombre de victoires par joueur
  // const getPlayerWins = () => {
  //   if (!comparisonData) return { player1Wins: 0, player2Wins: 0 }

  //   const stats = [
  //     comparisonData.player1.points > comparisonData.player2.points,
  //     comparisonData.player1.rebounds > comparisonData.player2.rebounds,
  //     comparisonData.player1.assists > comparisonData.player2.assists,
  //     comparisonData.player1.field_goal_percentage > comparisonData.player2.field_goal_percentage,
  //     comparisonData.player1.three_point_percentage > comparisonData.player2.three_point_percentage,
  //     comparisonData.player1.efficiency > comparisonData.player2.efficiency,
  //   ]

  //   const player1Wins = stats.filter(Boolean).length
  //   const player2Wins = 6 - player1Wins

  //   return { player1Wins, player2Wins }
  // }

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
            Comparez les performances statistiques des joueurs NBA et analysez leurs forces !
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
                        <SelectItem key={player.player_id} value={player.player_id}>
                          #{player.player_id} – {player.name} ({player.team})
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
                            #{player.player_id} – {player.name || "Nom inconnu"} ({player.team || "Aucune équipe"})
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

                {/* Detailed Stats Comparison */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {/* Points */}
                  <Card
                    className="shadow-lg"
                    style={{
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "2px solid #fed7aa",
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                            <span className="text-2xl">🏀</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-orange-900">Points par match</h3>
                            <p className="text-orange-700">Capacité offensive</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-orange-600">
                            Différence:{" "}
                            {Math.abs(comparisonData.player1.points - comparisonData.player2.points).toFixed(1)} pts
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div
                          className="p-4 rounded-lg text-center"
                          style={{
                            background:
                              comparisonData.player1.points > comparisonData.player2.points
                                ? "linear-gradient(to bottom, #10b981, #059669)"
                                : comparisonData.player1.points === comparisonData.player2.points
                                  ? "linear-gradient(to bottom, #f59e0b, #d97706)"
                                  : "linear-gradient(to bottom, #ef4444, #dc2626)",
                            color: "white",
                          }}
                        >
                          <div className="text-3xl font-bold mb-2">{comparisonData.player1.points}</div>
                          <div className="text-lg font-medium">{comparisonData.player1.name}</div>
                        </div>

                        <div
                          className="p-4 rounded-lg text-center"
                          style={{
                            background:
                              comparisonData.player2.points > comparisonData.player1.points
                                ? "linear-gradient(to bottom, #10b981, #059669)"
                                : comparisonData.player2.points === comparisonData.player1.points
                                  ? "linear-gradient(to bottom, #f59e0b, #d97706)"
                                  : "linear-gradient(to bottom, #ef4444, #dc2626)",
                            color: "white",
                          }}
                        >
                          <div className="text-3xl font-bold mb-2">{comparisonData.player2.points}</div>
                          <div className="text-lg font-medium">{comparisonData.player2.name}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Rebounds */}
                  <Card
                    className="shadow-lg"
                    style={{
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "2px solid #bfdbfe",
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-2xl">🤲</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-blue-900">Rebonds par match</h3>
                            <p className="text-blue-700">Domination sous les panneaux</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            Différence:{" "}
                            {Math.abs(comparisonData.player1.rebounds - comparisonData.player2.rebounds).toFixed(1)} reb
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div
                          className="p-4 rounded-lg text-center"
                          style={{
                            background:
                              comparisonData.player1.rebounds > comparisonData.player2.rebounds
                                ? "linear-gradient(to bottom, #10b981, #059669)"
                                : comparisonData.player1.rebounds === comparisonData.player2.rebounds
                                  ? "linear-gradient(to bottom, #f59e0b, #d97706)"
                                  : "linear-gradient(to bottom, #ef4444, #dc2626)",
                            color: "white",
                          }}
                        >
                          <div className="text-3xl font-bold mb-2">{comparisonData.player1.rebounds}</div>
                          <div className="text-lg font-medium">{comparisonData.player1.name}</div>
                        </div>

                        <div
                          className="p-4 rounded-lg text-center"
                          style={{
                            background:
                              comparisonData.player2.rebounds > comparisonData.player1.rebounds
                                ? "linear-gradient(to bottom, #10b981, #059669)"
                                : comparisonData.player2.rebounds === comparisonData.player1.rebounds
                                  ? "linear-gradient(to bottom, #f59e0b, #d97706)"
                                  : "linear-gradient(to bottom, #ef4444, #dc2626)",
                            color: "white",
                          }}
                        >
                          <div className="text-3xl font-bold mb-2">{comparisonData.player2.rebounds}</div>
                          <div className="text-lg font-medium">{comparisonData.player2.name}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Assists */}
                  <Card
                    className="shadow-lg"
                    style={{
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "2px solid #bbf7d0",
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-2xl">🎯</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-green-900">Passes par match</h3>
                            <p className="text-green-700">Vision de jeu et leadership</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            Différence:{" "}
                            {Math.abs(comparisonData.player1.assists - comparisonData.player2.assists).toFixed(1)} ast
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div
                          className="p-4 rounded-lg text-center"
                          style={{
                            background:
                              comparisonData.player1.assists > comparisonData.player2.assists
                                ? "linear-gradient(to bottom, #10b981, #059669)"
                                : comparisonData.player1.assists === comparisonData.player2.assists
                                  ? "linear-gradient(to bottom, #f59e0b, #d97706)"
                                  : "linear-gradient(to bottom, #ef4444, #dc2626)",
                            color: "white",
                          }}
                        >
                          <div className="text-3xl font-bold mb-2">{comparisonData.player1.assists}</div>
                          <div className="text-lg font-medium">{comparisonData.player1.name}</div>
                        </div>

                        <div
                          className="p-4 rounded-lg text-center"
                          style={{
                            background:
                              comparisonData.player2.assists > comparisonData.player1.assists
                                ? "linear-gradient(to bottom, #10b981, #059669)"
                                : comparisonData.player2.assists === comparisonData.player1.assists
                                  ? "linear-gradient(to bottom, #f59e0b, #d97706)"
                                  : "linear-gradient(to bottom, #ef4444, #dc2626)",
                            color: "white",
                          }}
                        >
                          <div className="text-3xl font-bold mb-2">{comparisonData.player2.assists}</div>
                          <div className="text-lg font-medium">{comparisonData.player2.name}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Field Goal % */}
                  <Card
                    className="shadow-lg"
                    style={{
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "2px solid #d8b4fe",
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-2xl">🎪</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-purple-900">% Réussite au tir</h3>
                            <p className="text-purple-700">Efficacité offensive</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-purple-600">
                            Différence:{" "}
                            {Math.abs(
                              comparisonData.player1.field_goal_percentage -
                                comparisonData.player2.field_goal_percentage,
                            ).toFixed(1)}
                            %
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div
                          className="p-4 rounded-lg text-center"
                          style={{
                            background:
                              comparisonData.player1.field_goal_percentage >
                              comparisonData.player2.field_goal_percentage
                                ? "linear-gradient(to bottom, #10b981, #059669)"
                                : comparisonData.player1.field_goal_percentage ===
                                    comparisonData.player2.field_goal_percentage
                                  ? "linear-gradient(to bottom, #f59e0b, #d97706)"
                                  : "linear-gradient(to bottom, #ef4444, #dc2626)",
                            color: "white",
                          }}
                        >
                          <div className="text-3xl font-bold mb-2">{comparisonData.player1.field_goal_percentage}%</div>
                          <div className="text-lg font-medium">{comparisonData.player1.name}</div>
                        </div>

                        <div
                          className="p-4 rounded-lg text-center"
                          style={{
                            background:
                              comparisonData.player2.field_goal_percentage >
                              comparisonData.player1.field_goal_percentage
                                ? "linear-gradient(to bottom, #10b981, #059669)"
                                : comparisonData.player2.field_goal_percentage ===
                                    comparisonData.player1.field_goal_percentage
                                  ? "linear-gradient(to bottom, #f59e0b, #d97706)"
                                  : "linear-gradient(to bottom, #ef4444, #dc2626)",
                            color: "white",
                          }}
                        >
                          <div className="text-3xl font-bold mb-2">{comparisonData.player2.field_goal_percentage}%</div>
                          <div className="text-lg font-medium">{comparisonData.player2.name}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Three Point % */}
                  <Card
                    className="shadow-lg"
                    style={{
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "2px solid #fde047",
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                            <span className="text-2xl">🏹</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-yellow-900">% Réussite à 3 points</h3>
                            <p className="text-yellow-700">Précision longue distance</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-yellow-600">
                            Différence:{" "}
                            {Math.abs(
                              comparisonData.player1.three_point_percentage -
                                comparisonData.player2.three_point_percentage,
                            ).toFixed(1)}
                            %
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div
                          className="p-4 rounded-lg text-center"
                          style={{
                            background:
                              comparisonData.player1.three_point_percentage >
                              comparisonData.player2.three_point_percentage
                                ? "linear-gradient(to bottom, #10b981, #059669)"
                                : comparisonData.player1.three_point_percentage ===
                                    comparisonData.player2.three_point_percentage
                                  ? "linear-gradient(to bottom, #f59e0b, #d97706)"
                                  : "linear-gradient(to bottom, #ef4444, #dc2626)",
                            color: "white",
                          }}
                        >
                          <div className="text-3xl font-bold mb-2">
                            {comparisonData.player1.three_point_percentage}%
                          </div>
                          <div className="text-lg font-medium">{comparisonData.player1.name}</div>
                        </div>

                        <div
                          className="p-4 rounded-lg text-center"
                          style={{
                            background:
                              comparisonData.player2.three_point_percentage >
                              comparisonData.player1.three_point_percentage
                                ? "linear-gradient(to bottom, #10b981, #059669)"
                                : comparisonData.player2.three_point_percentage ===
                                    comparisonData.player1.three_point_percentage
                                  ? "linear-gradient(to bottom, #f59e0b, #d97706)"
                                  : "linear-gradient(to bottom, #ef4444, #dc2626)",
                            color: "white",
                          }}
                        >
                          <div className="text-3xl font-bold mb-2">
                            {comparisonData.player2.three_point_percentage}%
                          </div>
                          <div className="text-lg font-medium">{comparisonData.player2.name}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Efficiency */}
                  <Card
                    className="shadow-lg"
                    style={{
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "2px solid #fda4af",
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                            <span className="text-2xl">⚡</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-pink-900">Efficacité globale</h3>
                            <p className="text-pink-700">Performance générale</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-pink-600">
                            Différence:{" "}
                            {Math.abs(comparisonData.player1.efficiency - comparisonData.player2.efficiency).toFixed(1)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div
                          className="p-4 rounded-lg text-center"
                          style={{
                            background:
                              comparisonData.player1.efficiency > comparisonData.player2.efficiency
                                ? "linear-gradient(to bottom, #10b981, #059669)"
                                : comparisonData.player1.efficiency === comparisonData.player2.efficiency
                                  ? "linear-gradient(to bottom, #f59e0b, #d97706)"
                                  : "linear-gradient(to bottom, #ef4444, #dc2626)",
                            color: "white",
                          }}
                        >
                          <div className="text-3xl font-bold mb-2">{comparisonData.player1.efficiency}</div>
                          <div className="text-lg font-medium">{comparisonData.player1.name}</div>
                        </div>

                        <div
                          className="p-4 rounded-lg text-center"
                          style={{
                            background:
                              comparisonData.player2.efficiency > comparisonData.player1.efficiency
                                ? "linear-gradient(to bottom, #10b981, #059669)"
                                : comparisonData.player2.efficiency === comparisonData.player1.efficiency
                                  ? "linear-gradient(to bottom, #f59e0b, #d97706)"
                                  : "linear-gradient(to bottom, #ef4444, #dc2626)",
                            color: "white",
                          }}
                        >
                          <div className="text-3xl font-bold mb-2">{comparisonData.player2.efficiency}</div>
                          <div className="text-lg font-medium">{comparisonData.player2.name}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
