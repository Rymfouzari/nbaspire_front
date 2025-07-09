"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Filter, TrendingUp, Award, BarChart3, ChevronUp, X } from "lucide-react"
import Link from "next/link"

export default function JoueursPage() {
  const [players, setPlayers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("all")
  const [selectedPosition, setSelectedPosition] = useState("all")
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch("https://xdlamc8612.execute-api.eu-west-1.amazonaws.com/api/players")
        const data = await res.json()
        const formatted = data.data.map((p: any, index: number) => ({
          id: p.player_id || index,
          name: p.player || "Nom inconnu",
          age: p.age || "N/A",
          team: p.tm || "N/A",
          position: p.position || p.pos || "N/A",
          points: p.pts_per_game ? Number.parseFloat(p.pts_per_game).toFixed(1) : "0.0",
          image: "/placeholder.svg?height=100&width=100",
          fullData: p,
        }))
        const uniquePlayers = Array.from(
          new Map(formatted.map((p) => [`${p.name}-${p.team}-${p.fullData.season}`, p])).values(),
        )
        setPlayers(uniquePlayers)
      } catch (error) {
        console.error("Erreur fetch:", error)
      }
    }
    fetchPlayers()
  }, [])

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTeam = selectedTeam === "all" || player.team === selectedTeam
    const matchesPosition = selectedPosition === "all" || player.position === selectedPosition
    return matchesSearch && matchesTeam && matchesPosition
  })

  const toggleExpanded = (playerId: string) => {
    setExpandedPlayer(expandedPlayer === playerId ? null : playerId)
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(to bottom right, #ffedd5, #fff7ed, #fffbeb)" }}
    >
      {/* Basketball Court Background */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="court-lines" x="0" y="0" width="300" height="200" patternUnits="userSpaceOnUse">
              <rect width="300" height="200" fill="none" stroke="#d97706" strokeWidth="1" />
              <circle cx="150" cy="100" r="60" fill="none" stroke="#d97706" strokeWidth="2" />
              <circle cx="150" cy="100" r="20" fill="none" stroke="#d97706" strokeWidth="1" />
              <line x1="0" y1="100" x2="300" y2="100" stroke="#d97706" strokeWidth="1" />
              <rect x="0" y="60" width="50" height="80" fill="none" stroke="#d97706" strokeWidth="1" />
              <rect x="250" y="60" width="50" height="80" fill="none" stroke="#d97706" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#court-lines)" />
        </svg>
      </div>

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
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 basketball-texture rounded-full flex items-center justify-center shadow-lg relative">
                <div className="absolute border border-orange-300 rounded-full" style={{ inset: "4px" }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1 bg-orange-300 rounded-full" style={{ height: "1.5rem" }}></div>
                  <div className="h-1 bg-orange-300 rounded-full absolute" style={{ width: "1.5rem" }}></div>
                </div>
                <BarChart3 className="w-5 h-5 text-white relative z-10" />
              </div>
              <span className="text-2xl font-bold text-white drop-shadow-lg">🏀 NBAspire</span>
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-orange-200 nav-link hover:text-white">
                Accueil
              </Link>
              <Link href="/joueurs" className="text-white font-medium nav-link">
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

      {/* Floating Basketballs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute opacity-10 float-css"
          style={{
            top: "8rem",
            left: "4rem",
            fontSize: "3rem",
            animationDelay: "0s",
            animationDuration: "4s",
          }}
        >
          🏀
        </div>
        <div
          className="absolute opacity-10 float-css"
          style={{
            top: "16rem",
            right: "6rem",
            fontSize: "2rem",
            animationDelay: "2s",
            animationDuration: "5s",
          }}
        >
          🏀
        </div>
        <div
          className="absolute opacity-10 float-css"
          style={{
            bottom: "12rem",
            left: "33%",
            fontSize: "4rem",
            animationDelay: "1s",
            animationDuration: "3s",
          }}
        >
          🏀
        </div>
      </div>

      <div className="relative z-10 p-6" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-5xl font-bold mb-4 text-orange-900 drop-shadow-lg">🏀 Hall of Fame NBA</h1>
          <div
            className="w-24 h-1 mx-auto mb-4 rounded-full"
            style={{ background: "linear-gradient(to right, #f97316, #f59e0b)" }}
          ></div>
          <p className="text-orange-800 text-xl font-medium">Découvrez les légendes et futures stars de la NBA ! 🏆</p>
        </div>
        {/* Filters */}
        <div
          className="p-6 border rounded-2xl"
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(12px)",
            borderColor: "#fed7aa",
          }}
        >
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute text-gray-400"
                  style={{
                    left: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "1rem",
                    height: "1rem",
                  }}
                />
                <Input
                  placeholder="Rechercher un joueur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: "2.5rem" }}
                />
              </div>
            </div>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger style={{ width: "12rem" }}>
                <SelectValue placeholder="Équipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les équipes</SelectItem>
                {[...new Set(players.map((p) => p.team))].map((tm, i) => (
                  <SelectItem key={i} value={tm}>
                    {tm}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger style={{ width: "12rem" }}>
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les positions</SelectItem>
                {[...new Set(players.map((p) => p.position))].map((pos, i) => (
                  <SelectItem key={i} value={pos}>
                    {pos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Players Grid */}
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {filteredPlayers.map((player, index) => {
            const playerId = `${player.name}-${player.team}-${player.fullData.season}-${index}`
            const isExpanded = expandedPlayer === playerId

            return (
              <Card
                key={playerId}
                className="card-hover relative overflow-hidden transition-all duration-500"
                style={{
                  background: isExpanded
                    ? "linear-gradient(to bottom right, #fff7ed, #ffedd5)"
                    : "linear-gradient(to bottom right, white, #fff7ed)",
                  border: isExpanded ? "3px solid #f97316" : "2px solid #fed7aa",
                  transform: isExpanded ? "scale(1.02)" : "scale(1)",
                }}
              >
                {/* Basketball pattern overlay */}
                <div className="absolute opacity-5" style={{ top: 0, right: 0, width: "5rem", height: "5rem" }}>
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#d97706" strokeWidth="2" />
                    <line x1="10" y1="50" x2="90" y2="50" stroke="#d97706" strokeWidth="2" />
                    <path d="M50 10 Q70 50 50 90 Q30 50 50 10" fill="none" stroke="#d97706" strokeWidth="2" />
                  </svg>
                </div>

                <CardHeader className="text-center relative z-10">
                  <div
                    className="mx-auto mb-4 rounded-full basketball-texture flex items-center justify-center text-white font-bold shadow-lg relative"
                    style={{ width: "5rem", height: "5rem", fontSize: "1.5rem" }}
                  >
                    <div className="absolute border-2 border-orange-300 rounded-full" style={{ inset: "4px" }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1 bg-orange-300 rounded-full" style={{ height: "3rem" }}></div>
                      <div className="h-1 bg-orange-300 rounded-full absolute" style={{ width: "3rem" }}></div>
                    </div>
                    <span className="relative z-10">
                      {player.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <CardTitle className="text-xl text-orange-900">{player.name}</CardTitle>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Badge style={{ background: "#f97316", color: "white", border: "1px solid #fed7aa" }}>
                      {player.team}
                    </Badge>
                    <Badge variant="outline" style={{ borderColor: "#fb923c", color: "#c2410c" }}>
                      {player.position}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10">
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-700 font-medium" style={{ fontSize: "0.875rem" }}>
                        🎂 Âge
                      </span>
                      <span className="font-bold text-orange-600 text-lg">{player.age}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 font-medium" style={{ fontSize: "0.875rem" }}>
                        🏟️ Équipe
                      </span>
                      <span className="font-bold text-blue-600 text-lg">{player.team}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-700 font-medium" style={{ fontSize: "0.875rem" }}>
                        🎯 Position
                      </span>
                      <span className="font-bold text-green-600 text-lg">{player.position}</span>
                    </div>
                    <div
                      className="flex justify-between items-center border-orange-200"
                      style={{ paddingTop: "0.5rem", borderTop: "1px solid #fed7aa" }}
                    >
                      <span className="font-bold text-purple-700" style={{ fontSize: "0.875rem" }}>
                        🏀 PTS/Match
                      </span>
                      <span className="font-bold text-purple-600 text-xl">{player.points}</span>
                    </div>
                  </div>

                  {/* Section détaillée qui s'expand */}
                  {isExpanded && (
                    <div
                      className="mt-6 p-4 rounded-lg border-2 fade-in-css"
                      style={{
                        background: "rgba(255, 255, 255, 0.9)",
                        borderColor: "#fed7aa",
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-orange-900 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />📊 Stats Détaillées
                        </h4>
                        <Button
                          onClick={() => setExpandedPlayer(null)}
                          size="sm"
                          variant="ghost"
                          className="text-orange-600 hover:text-orange-800"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-orange-700">📏 Taille</span>
                          <span className="font-bold text-orange-600">
                            {player.fullData.height_wo_shoes_ft_in ?? "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-blue-700">⚖️ Poids</span>
                          <span className="font-bold text-blue-600">
                            {player.fullData.weight_kg ? player.fullData.weight_kg + " kg" : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-green-700">🦅 Envergure</span>
                          <span className="font-bold text-green-600">{player.fullData.wingspan_ft_in ?? "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-purple-700">⏱️ Minutes/match</span>
                          <span className="font-bold text-purple-600">{player.fullData.mp_per_game ?? "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-indigo-700">🎯 % Réussite tirs</span>
                          <span className="font-bold text-indigo-600">
                            {player.fullData.fg_percent != null && !isNaN(Number(player.fullData.fg_percent))? Number(player.fullData.fg_percent).toFixed(1) + "%": "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-pink-700">🤲 Rebonds/match</span>
                          <span className="font-bold text-pink-600">{player.fullData.trb_per_game ?? "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-cyan-700">🎯 Passes/match</span>
                          <span className="font-bold text-cyan-600">{player.fullData.ast_per_game ?? "N/A"}</span>
                        </div>
                      </div>

                      <div
                        className="mt-4 p-3 rounded text-center"
                        style={{
                          background: "linear-gradient(to right, #fff7ed, #fef3c7)",
                          border: "1px solid #fed7aa",
                        }}
                      >
                        <Award className="w-5 h-4 mx-auto text-orange-600 mb-1" />
                        <p className="text-orange-800 text-sm font-medium">
                          🌟 Saison {player.fullData.season || "actuelle"} - Données NBA officielles 🏆
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Bouton pour expand/collapse */}
                  <Button
                    onClick={() => toggleExpanded(playerId)}
                    className="w-full shadow-lg transition-all duration-300"
                    style={{
                      marginTop: "1rem",
                      background: isExpanded
                        ? "linear-gradient(to right, #dc2626, #b91c1c)"
                        : "linear-gradient(to right, #ea580c, #c2410c)",
                      color: "white",
                      border: "1px solid #fb923c",
                    }}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Masquer détails
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Afficher détails
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredPlayers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter style={{ width: "4rem", height: "4rem", margin: "0 auto" }} />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun joueur trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  )
}
