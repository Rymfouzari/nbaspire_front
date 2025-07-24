"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Filter, Award, BarChart3, ChevronUp, X, Trophy, Target, Zap, Activity } from "lucide-react"
import Link from "next/link"

export default function JoueursPage() {
  const [players, setPlayers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPosition, setSelectedPosition] = useState("all")
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch("https://hl0wiyllzi.execute-api.eu-west-1.amazonaws.com/dev/players")
        const data = await res.json()
        const formatted = data.data.map((p: any, index: number) => ({
          id: index,
          name: p.player || "Nom inconnu",
          age: p.age|| "N/A",
          position: p.pos || "N/A",
          height: p.hgt || "N/A",
          weight: p.wgt || "N/A",
          bmi: p.bmi || "N/A",
          wingspan: p.wngspn || "N/A",
          standingReach: p.stndrch || "N/A",
          sprint: p.sprint || "N/A",
          bench: p.bench || "N/A",
          per: p.per || "N/A",
          vorp: p.vorp || "N/A",
          bpm: p.bpm || "N/A",
          ws: p.ws || "N/A",
          pts_per_100: p.pts_per_100_poss || "N/A",
          ortg: p.o_rtg || "N/A",
          drtg: p.d_rtg || "N/A",
          mvp_pts: Number.parseFloat(p.total_pts_nba_mvp) || 0,
          mvp_share: Number.parseFloat(p.total_share_nba_mvp) || 0,
          mvp_votes: Number.parseInt(p.first_place_votes_nba_mvp) || 0,
          // Nouveaux champs de pourcentages - conversion en nombres
          orb_percent: Number.parseFloat(p.orb_percent) || 0,
          drb_percent: Number.parseFloat(p.drb_percent) || 0,
          trb_percent: Number.parseFloat(p.trb_percent) || 0,
          ast_percent: Number.parseFloat(p.ast_percent) || 0,
          stl_percent: Number.parseFloat(p.stl_percent) || 0,
          blk_percent: Number.parseFloat(p.blk_percent) || 0,
          tov_percent: Number.parseFloat(p.tov_percent) || 0,
          ts_percent: Number.parseFloat(p.ts_percent) || 0,
          fullData: p,
        }))

        // Filtrer les joueurs avec des noms valides et supprimer les doublons
        const validPlayers = formatted.filter((p) => p.name && p.name !== "Nom inconnu")
        const uniquePlayers = Array.from(new Map(validPlayers.map((p) => [p.name, p])).values())

        setPlayers(uniquePlayers)
      } catch (error) {
        console.error("Erreur fetch:", error)
      }
    }
    fetchPlayers()
  }, [])

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPosition = selectedPosition === "all" || player.position === selectedPosition
    return matchesSearch && matchesPosition
  })

  const toggleExpanded = (playerId: string) => {
    setExpandedPlayer(expandedPlayer === playerId ? null : playerId)
  }

  // Fonction pour déterminer la couleur selon la performance
  const getPerformanceColor = (value: any, thresholds: { excellent: number; good: number }) => {
    const num = Number.parseFloat(value)
    if (isNaN(num)) return "#6b7280"
    if (num >= thresholds.excellent) return "#10b981"
    if (num >= thresholds.good) return "#f59e0b"
    return "#ef4444"
  }

  // Fonction pour obtenir le niveau MVP
  const getMVPLevel = (mvpPts: number) => {
    if (mvpPts >= 100) return { level: "MVP Candidat", color: "#fbbf24", icon: "👑" }
    if (mvpPts >= 50) return { level: "All-Star", color: "#f97316", icon: "⭐" }
    if (mvpPts >= 10) return { level: "Solide", color: "#3b82f6", icon: "💪" }
    return { level: "Émergent", color: "#6b7280", icon: "🌱" }
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
          <h1 className="text-5xl font-bold mb-4 text-orange-900 drop-shadow-lg">🏀 Analytics NBA Pro</h1>
          <div
            className="w-24 h-1 mx-auto mb-4 rounded-full"
            style={{ background: "linear-gradient(to right, #f97316, #f59e0b)" }}
          ></div>
          <p className="text-orange-800 text-xl font-medium">
            Statistiques avancées et métriques de performance des joueurs NBA ! 📊
          </p>
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
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))" }}>
          {filteredPlayers.map((player, index) => {
            const playerId = `${player.name}-${index}`
            const isExpanded = expandedPlayer === playerId
            const mvpLevel = getMVPLevel(player.mvp_pts)

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
                    {player.age !== "N/A" && (
                      <Badge style={{ background: "#3b82f6", color: "white", border: "1px solid #bfdbfe" }}>
                        {player.age} ans
                      </Badge>
                    )}
                  </div>

                </CardHeader>

                <CardContent className="relative z-10">
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {/* Pourcentages principaux */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-orange-700 font-medium text-sm">🏀 Rebonds totaux</span>
                        <span className="font-bold text-orange-600">{(player.trb_percent || 0).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 font-medium text-sm">🎯 Passes décisives</span>
                        <span className="font-bold text-blue-600">{(player.ast_percent || 0).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-700 font-medium text-sm">🎪 Tir réel (TS%)</span>
                        <span className="font-bold text-green-600">{((player.ts_percent || 0) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-700 font-medium text-sm">⚠️ Balles perdues</span>
                        <span className="font-bold text-purple-600">{(player.tov_percent || 0).toFixed(1)}%</span>
                      </div>
                    </div>

                    {/* Métriques avancées principales */}
                    {/* Métriques avancées principales - seulement si valides */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t" style={{ borderColor: "#fed7aa" }}>
                      {player.per !== "N/A" && !isNaN(Number.parseFloat(player.per)) && (
                        <div className="flex justify-between items-center">
                          <span className="text-indigo-700 font-medium text-sm">⚡ PER</span>
                          <span
                            className="font-bold text-lg"
                            style={{ color: getPerformanceColor(player.per, { excellent: 20, good: 15 }) }}
                          >
                            {Number.parseFloat(player.per).toFixed(1)}
                          </span>
                        </div>
                      )}
                      {player.vorp !== "N/A" && !isNaN(Number.parseFloat(player.vorp)) && (
                        <div className="flex justify-between items-center">
                          <span className="text-pink-700 font-medium text-sm">🎯 VORP</span>
                          <span
                            className="font-bold text-lg"
                            style={{ color: getPerformanceColor(player.vorp, { excellent: 3, good: 1 }) }}
                          >
                            {Number.parseFloat(player.vorp).toFixed(1)}
                          </span>
                        </div>
                      )}
                      {player.bpm !== "N/A" && !isNaN(Number.parseFloat(player.bpm)) && (
                        <div className="flex justify-between items-center">
                          <span className="text-cyan-700 font-medium text-sm">📊 BPM</span>
                          <span
                            className="font-bold text-lg"
                            style={{ color: getPerformanceColor(player.bpm, { excellent: 5, good: 2 }) }}
                          >
                            {Number.parseFloat(player.bpm).toFixed(1)}
                          </span>
                        </div>
                      )}
                      {player.ws !== "N/A" && !isNaN(Number.parseFloat(player.ws)) && (
                        <div className="flex justify-between items-center">
                          <span className="text-amber-700 font-medium text-sm">🏆 WS</span>
                          <span
                            className="font-bold text-lg"
                            style={{ color: getPerformanceColor(player.ws, { excellent: 10, good: 5 }) }}
                          >
                            {Number.parseFloat(player.ws).toFixed(1)}
                          </span>
                        </div>
                      )}
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
                            <BarChart3 className="w-5 h-5" />📊 Analytics Avancées
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

                        {/* Pourcentages détaillés */}
                        <div className="mb-6">
                          <h5 className="text-md font-bold text-blue-900 mb-3 flex items-center gap-2">
                            <Target className="w-4 h-4" />📊 Pourcentages de Performance
                          </h5>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-orange-700">🔥 Rebonds offensifs</span>
                              <span className="font-bold text-orange-600">{(player.orb_percent || 0).toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-blue-700">🛡️ Rebonds défensifs</span>
                              <span className="font-bold text-blue-600">{(player.drb_percent || 0).toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-green-700">🤏 Interceptions</span>
                              <span className="font-bold text-green-600">{(player.stl_percent || 0).toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-purple-700">🚫 Contres</span>
                              <span className="font-bold text-purple-600">{(player.blk_percent || 0).toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Métriques physiques */}
                        {/* Métriques physiques - seulement si valides */}
                        <div className="mb-6">
                          <h5 className="text-md font-bold text-blue-900 mb-3 flex items-center gap-2">
                            <Activity className="w-4 h-4" />💪 Physique & Athlétisme
                          </h5>
                          <div className="grid grid-cols-2 gap-3">
                            {player.age !== "N/A" && !isNaN(Number.parseFloat(player.age)) && (
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-blue-700">🎂 Âge</span>
                                <span className="font-bold text-blue-600">{player.age} ans</span>
                              </div>
                            )}
                            {player.height !== "N/A" && !isNaN(Number.parseFloat(player.height)) && (
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-green-700">📏 Taille</span>
                                <span className="font-bold text-green-600">
                                  {Number.parseFloat(player.height).toFixed(1)}&quot;
                                </span>
                              </div>
                            )}
                            {player.weight !== "N/A" && !isNaN(Number.parseFloat(player.weight)) && (
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-purple-700">⚖️ Poids</span>
                                <span className="font-bold text-purple-600">
                                  {Number.parseFloat(player.weight).toFixed(0)} lbs
                                </span>
                              </div>
                            )}
                            {player.wingspan !== "N/A" && !isNaN(Number.parseFloat(player.wingspan)) && (
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-indigo-700">🦅 Envergure</span>
                                <span className="font-bold text-indigo-600">
                                  {Number.parseFloat(player.wingspan).toFixed(1)}&quot;
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Métriques offensives/défensives */}
                        {/* Métriques offensives/défensives - seulement si valides */}
                        <div className="mb-6">
                          <h5 className="text-md font-bold text-green-900 mb-3 flex items-center gap-2">
                            <Target className="w-4 h-4" />🎯 Performance Offensive/Défensive
                          </h5>
                          <div className="grid grid-cols-2 gap-3">
                            {player.pts_per_100 !== "N/A" && !isNaN(Number.parseFloat(player.pts_per_100)) && (
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-green-700">⚡ Pts/100</span>
                                <span className="font-bold text-green-600">
                                  {Number.parseFloat(player.pts_per_100).toFixed(1)}
                                </span>
                              </div>
                            )}
                            {player.ortg !== "N/A" && !isNaN(Number.parseFloat(player.ortg)) && (
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-blue-700">🎯 ORTG</span>
                                <span
                                  className="font-bold"
                                  style={{ color: getPerformanceColor(player.ortg, { excellent: 115, good: 110 }) }}
                                >
                                  {Number.parseFloat(player.ortg).toFixed(1)}
                                </span>
                              </div>
                            )}
                            {player.drtg !== "N/A" && !isNaN(Number.parseFloat(player.drtg)) && (
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-red-700">🛡️ DRTG</span>
                                <span
                                  className="font-bold"
                                  style={{
                                    color: getPerformanceColor(110 - Number.parseFloat(player.drtg || "110"), {
                                      excellent: 5,
                                      good: 0,
                                    }),
                                  }}
                                >
                                  {Number.parseFloat(player.drtg).toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* MVP Stats */}
                        {(player.mvp_pts > 0 || player.mvp_share > 0) && (
                          <div className="mb-4">
                            <h5 className="text-md font-bold text-yellow-900 mb-3 flex items-center gap-2">
                              <Trophy className="w-4 h-4" />👑 Reconnaissance MVP
                            </h5>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-yellow-700">🏆 Points MVP</span>
                                <span className="font-bold text-yellow-600">{player.mvp_pts}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-amber-700">📊 Share MVP</span>
                                <span className="font-bold text-amber-600">{(player.mvp_share * 100).toFixed(1)}%</span>
                              </div>
                              {player.mvp_votes > 0 && (
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-orange-700">🗳️ Votes 1er</span>
                                  <span className="font-bold text-orange-600">{player.mvp_votes}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div
                          className="mt-4 p-3 rounded text-center"
                          style={{
                            background: "linear-gradient(to right, #fff7ed, #fef3c7)",
                            border: "1px solid #fed7aa",
                          }}
                        >
                          <Award className="w-4 h-4 mx-auto text-orange-600 mb-1" />
                          <p className="text-orange-800 text-sm font-medium">
                            🌟 Analytics NBA Pro - Données officielles et métriques avancées 📈
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
                          Masquer Analytics
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Voir Analytics Pro
                        </>
                      )}
                    </Button>
                  </div>
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
