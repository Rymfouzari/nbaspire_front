"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Brain, TrendingUp, Target, Award, AlertCircle } from "lucide-react"
import { FloatingBasketballs } from "@/components/floating-basketballs"
import { CourtLines } from "@/components/court-lines"
import { SpotlightEffect } from "@/components/spotlight-effect"

export default function SimulationPage() {
  const [playerStats, setPlayerStats] = useState({
    age: "",
    experience: "",
    heightWithoutShoes: "",
    heightWithShoes: "",
    weight: "",
    wingspan: "",
    verticalReach: "",
    bodyFatPercentage: "",
    handLength: "",
    handWidth: "",
    position: "",
  })
  const [prediction, setPrediction] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const positions = [
    { value: "PG", label: "PG - Point Guard (Meneur)" },
    { value: "SG", label: "SG - Shooting Guard (Arrière)" },
    { value: "SF", label: "SF - Small Forward (Ailier)" },
    { value: "PF", label: "PF - Power Forward (Ailier Fort)" },
    { value: "C", label: "C - Center (Pivot)" },
  ]

  const handlePredict = async () => {
    if (!playerStats.age || !playerStats.experience || !playerStats.position) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Préparer les données pour l'API backend
      const requestData = {
        age: Number.parseInt(playerStats.age),
        experience: Number.parseInt(playerStats.experience),
        heightWithoutShoes: Number.parseFloat(playerStats.heightWithoutShoes) || 0,
        heightWithShoes: Number.parseFloat(playerStats.heightWithShoes) || 0,
        weight: Number.parseFloat(playerStats.weight) || 0,
        wingspan: Number.parseFloat(playerStats.wingspan) || 0,
        verticalReach: Number.parseFloat(playerStats.verticalReach) || 0,
        bodyFatPercentage: Number.parseFloat(playerStats.bodyFatPercentage) || 0,
        handLength: Number.parseFloat(playerStats.handLength) || 0,
        handWidth: Number.parseFloat(playerStats.handWidth) || 0,
        position: playerStats.position,
      }

      // Appel à l'API backend
      const response = await fetch(`https://o13guuit0k.execute-api.eu-west-1.amazonaws.com/dev/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erreur lors de la prédiction")
      }

      const predictionData = await response.json()
      setPrediction(predictionData)
    } catch (err) {
      console.error("Erreur lors de la prédiction:", err)
      setError(err instanceof Error ? err.message : "Une erreur est survenue")

      // Fallback avec données simulées en cas d'erreur
      const mockPrediction = {
        mvpProbability: Math.random() * 100,
        allStarProbability: Math.random() * 100,
        playoffSuccess: Math.random() * 100,
        nextSeasonPoints: 15 + Math.random() * 20,
        confidence: 85 + Math.random() * 10,
        factors: [
          { name: "Attributs physiques", impact: 85, positive: true },
          { name: "Expérience", impact: 72, positive: true },
          { name: "Poste adapté", impact: 68, positive: false },
          { name: "Potentiel athlétique", impact: 91, positive: true },
        ],
      }
      setPrediction(mockPrediction)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = () => {
    return playerStats.age && playerStats.experience && playerStats.position
  }

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
              <Link href="/" className="text-orange-200 nav-link hover:text-white">
                Accueil
              </Link>
              <Link href="/joueurs" className="text-orange-200 nav-link hover:text-white">
                Joueurs
              </Link>
              <Link href="/comparaison" className="text-orange-200 nav-link hover:text-white">
                Comparaison
              </Link>
              <Link href="/simulation" className="text-white font-medium nav-link hover:text-orange-200">
                Simulation
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-orange-900 drop-shadow-lg">
            Simulation & Prédictions ML
          </h1>
          <div
            className="w-32 h-1 mx-auto mb-6 rounded-full"
            style={{ background: "linear-gradient(to right, #f97316, #f59e0b)" }}
          ></div>
          <p className="text-xl text-orange-800 mb-8 max-w-3xl mx-auto font-medium">
            Testez nos modèles d'intelligence artificielle pour prédire les performances des joueurs NBA !
          </p>
        </div>

        <div className="grid gap-8" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {/* Configuration Panel */}
          <div>
            {/* Player Physical Stats Input */}
            <Card
              className="card-hover"
              style={{
                background: "linear-gradient(to bottom right, white, #fff7ed)",
                border: "2px solid #fed7aa",
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-orange-900">
                  <Target className="w-6 h-6" />
                  Caractéristiques du Joueur
                </CardTitle>
                <CardDescription className="text-orange-700 font-medium">
                  Entrez les données physiques et techniques pour la prédiction
                </CardDescription>
              </CardHeader>
              <CardContent style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Affichage d'erreur */}
                {error && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <p className="text-sm">⚠️ {error}</p>
                    <p className="text-xs mt-1">Utilisation des données simulées en attendant.</p>
                  </div>
                )}

                {/* Age et Expérience */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age" className="text-lg font-bold text-orange-900">
                      Âge *
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={playerStats.age}
                      onChange={(e) => setPlayerStats({ ...playerStats, age: e.target.value })}
                      className="h-12 text-lg"
                      style={{
                        background: "#fff7ed",
                        border: "2px solid #fdba74",
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience" className="text-lg font-bold text-orange-900">
                      Années d'expérience *
                    </Label>
                    <Input
                      id="experience"
                      type="number"
                      placeholder="5"
                      value={playerStats.experience}
                      onChange={(e) => setPlayerStats({ ...playerStats, experience: e.target.value })}
                      className="h-12 text-lg"
                      style={{
                        background: "#fff7ed",
                        border: "2px solid #fdba74",
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Tailles */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="heightWithoutShoes" className="text-lg font-bold text-orange-900">
                      Taille sans chaussures (cm)
                    </Label>
                    <Input
                      id="heightWithoutShoes"
                      type="number"
                      placeholder="198"
                      value={playerStats.heightWithoutShoes}
                      onChange={(e) => setPlayerStats({ ...playerStats, heightWithoutShoes: e.target.value })}
                      className="h-12 text-lg"
                      style={{
                        background: "#fff7ed",
                        border: "2px solid #fdba74",
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="heightWithShoes" className="text-lg font-bold text-orange-900">
                      Taille avec chaussures (cm)
                    </Label>
                    <Input
                      id="heightWithShoes"
                      type="number"
                      placeholder="201"
                      value={playerStats.heightWithShoes}
                      onChange={(e) => setPlayerStats({ ...playerStats, heightWithShoes: e.target.value })}
                      className="h-12 text-lg"
                      style={{
                        background: "#fff7ed",
                        border: "2px solid #fdba74",
                      }}
                    />
                  </div>
                </div>

                {/* Poids et Envergure */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight" className="text-lg font-bold text-orange-900">
                      Poids (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="95"
                      value={playerStats.weight}
                      onChange={(e) => setPlayerStats({ ...playerStats, weight: e.target.value })}
                      className="h-12 text-lg"
                      style={{
                        background: "#fff7ed",
                        border: "2px solid #fdba74",
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="wingspan" className="text-lg font-bold text-orange-900">
                      Envergure (cm)
                    </Label>
                    <Input
                      id="wingspan"
                      type="number"
                      placeholder="210"
                      value={playerStats.wingspan}
                      onChange={(e) => setPlayerStats({ ...playerStats, wingspan: e.target.value })}
                      className="h-12 text-lg"
                      style={{
                        background: "#fff7ed",
                        border: "2px solid #fdba74",
                      }}
                    />
                  </div>
                </div>

                {/* Portée verticale et Masse graisseuse */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="verticalReach" className="text-lg font-bold text-orange-900">
                      Portée verticale (cm)
                    </Label>
                    <Input
                      id="verticalReach"
                      type="number"
                      placeholder="270"
                      value={playerStats.verticalReach}
                      onChange={(e) => setPlayerStats({ ...playerStats, verticalReach: e.target.value })}
                      className="h-12 text-lg"
                      style={{
                        background: "#fff7ed",
                        border: "2px solid #fdba74",
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bodyFatPercentage" className="text-lg font-bold text-orange-900">
                      % Masse graisseuse
                    </Label>
                    <Input
                      id="bodyFatPercentage"
                      type="number"
                      placeholder="8.5"
                      step="0.1"
                      value={playerStats.bodyFatPercentage}
                      onChange={(e) => setPlayerStats({ ...playerStats, bodyFatPercentage: e.target.value })}
                      className="h-12 text-lg"
                      style={{
                        background: "#fff7ed",
                        border: "2px solid #fdba74",
                      }}
                    />
                  </div>
                </div>

                {/* Dimensions des mains */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="handLength" className="text-lg font-bold text-orange-900">
                      Longueur de la main (cm)
                    </Label>
                    <Input
                      id="handLength"
                      type="number"
                      placeholder="22.5"
                      step="0.1"
                      value={playerStats.handLength}
                      onChange={(e) => setPlayerStats({ ...playerStats, handLength: e.target.value })}
                      className="h-12 text-lg"
                      style={{
                        background: "#fff7ed",
                        border: "2px solid #fdba74",
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="handWidth" className="text-lg font-bold text-orange-900">
                      Largeur de la main (cm)
                    </Label>
                    <Input
                      id="handWidth"
                      type="number"
                      placeholder="25.0"
                      step="0.1"
                      value={playerStats.handWidth}
                      onChange={(e) => setPlayerStats({ ...playerStats, handWidth: e.target.value })}
                      className="h-12 text-lg"
                      style={{
                        background: "#fff7ed",
                        border: "2px solid #fdba74",
                      }}
                    />
                  </div>
                </div>

                {/* Poste */}
                <div>
                  <Label htmlFor="position" className="text-lg font-bold text-orange-900">
                    Poste *
                  </Label>
                  <Select
                    value={playerStats.position}
                    onValueChange={(value) => setPlayerStats({ ...playerStats, position: value })}
                  >
                    <SelectTrigger
                      className="h-12 text-lg"
                      style={{
                        background: "#fff7ed",
                        border: "2px solid #fdba74",
                      }}
                    >
                      <SelectValue placeholder="Sélectionner un poste" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((position) => (
                        <SelectItem key={position.value} value={position.value}>
                          {position.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handlePredict}
                  disabled={!isFormValid() || isLoading}
                  className="w-full shadow-xl border-2 border-orange-400 text-lg px-8 py-4 scale-hover-css"
                  style={{
                    background: "linear-gradient(to right, #ea580c, #c2410c)",
                    color: "white",
                  }}
                >
                  {isLoading ? (
                    <>
                      <Brain className="w-5 h-5 mr-2 animate-spin" />
                      Calcul en cours...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Lancer la Prédiction
                    </>
                  )}
                </Button>

                <p className="text-sm text-orange-600 text-center">* Champs obligatoires pour lancer la prédiction</p>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div>
            {prediction ? (
              <Tabs defaultValue="predictions" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <TabsList
                  className="grid grid-cols-2 p-1 rounded-lg"
                  style={{
                    width: "100%",
                    background: "rgba(249, 115, 22, 0.8)",
                  }}
                >
                  <TabsTrigger
                    value="predictions"
                    className="rounded-md text-white font-bold"
                    style={{
                      background: "transparent",
                    }}
                  >
                    🏆 Prédictions
                  </TabsTrigger>
                  <TabsTrigger
                    value="analysis"
                    className="rounded-md text-white font-bold"
                    style={{
                      background: "transparent",
                    }}
                  >
                    📊 Analyse
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="predictions" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {/* Main Predictions */}
                  <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1fr" }}>
                    <Card
                      className="card-hover"
                      style={{
                        background: "linear-gradient(to bottom right, white, #fefce8)",
                        border: "2px solid #fde047",
                      }}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl text-yellow-900">
                          <Award className="w-6 h-6 text-yellow-600" />🏆 Probabilité MVP
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-yellow-600 mb-3">
                          {prediction.mvpProbability.toFixed(1)}%
                        </div>
                        <Progress value={prediction.mvpProbability} className="h-4 mb-3" />
                        <p className="text-yellow-700 font-medium">Basé sur les caractéristiques physiques</p>
                      </CardContent>
                    </Card>

                    <Card
                      className="card-hover"
                      style={{
                        background: "linear-gradient(to bottom right, white, #eff6ff)",
                        border: "2px solid #bfdbfe",
                      }}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl text-blue-900">
                          <Target className="w-6 h-6 text-blue-600" />⭐ Sélection All-Star
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-blue-600 mb-3">
                          {prediction.allStarProbability.toFixed(1)}%
                        </div>
                        <Progress value={prediction.allStarProbability} className="h-4 mb-3" />
                        <p className="text-blue-700 font-medium">Probabilité de sélection cette saison</p>
                      </CardContent>
                    </Card>

                    <Card
                      className="card-hover"
                      style={{
                        background: "linear-gradient(to bottom right, white, #f0fdf4)",
                        border: "2px solid #bbf7d0",
                      }}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl text-green-900">
                          <TrendingUp className="w-6 h-6 text-green-600" />
                          Succès en Playoffs
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-green-600 mb-3">
                          {prediction.playoffSuccess.toFixed(1)}%
                        </div>
                        <Progress value={prediction.playoffSuccess} className="h-4 mb-3" />
                        <p className="text-green-700 font-medium">Impact sur le succès de l'équipe</p>
                      </CardContent>
                    </Card>

                    <Card
                      className="card-hover"
                      style={{
                        background: "linear-gradient(to bottom right, white, #faf5ff)",
                        border: "2px solid #d8b4fe",
                      }}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl text-purple-900">
                          <BarChart3 className="w-6 h-6 text-purple-600" />📊 Points Prédits
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-purple-600 mb-3">
                          {prediction.nextSeasonPoints.toFixed(1)}
                        </div>
                        <p className="text-purple-700 font-medium mb-3">Points par match saison prochaine</p>
                        <div className="flex items-center gap-2">
                          <Badge className="text-white text-lg px-3 py-1" style={{ background: "#8b5cf6" }}>
                            Confiance: {prediction.confidence.toFixed(0)}%
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="analysis" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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
                        <AlertCircle className="w-8 h-8" />
                        Facteurs d'Impact
                      </CardTitle>
                      <CardDescription className="text-lg text-orange-700 font-medium">
                        Analyse des éléments influençant les prédictions
                      </CardDescription>
                    </CardHeader>
                    <CardContent style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      {prediction.factors.map((factor: any, index: number) => (
                        <div key={index} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-lg text-orange-900">{factor.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-xl font-bold text-orange-600">{factor.impact}%</span>
                              <Badge
                                className="text-white"
                                style={{ background: factor.positive ? "#10b981" : "#ef4444" }}
                              >
                                {factor.positive ? "Positif" : "Négatif"}
                              </Badge>
                            </div>
                          </div>
                          <Progress
                            value={factor.impact}
                            className="h-4"
                            style={{
                              background: factor.positive ? "#dcfce7" : "#fee2e2",
                            }}
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card
                    className="shadow-xl card-hover"
                    style={{
                      background: "rgba(255, 255, 255, 0.8)",
                      backdropFilter: "blur(12px)",
                      border: "2px solid #bfdbfe",
                    }}
                  >
                    <CardHeader>
                      <CardTitle className="text-2xl text-blue-900">Recommandations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div className="flex items-start gap-4">
                          <div
                            className="rounded-full"
                            style={{
                              width: "0.75rem",
                              height: "0.75rem",
                              background: "#10b981",
                              marginTop: "0.5rem",
                            }}
                          ></div>
                          <p className="text-lg font-medium text-green-800">
                            <strong>Optimiser la condition physique:</strong> Maintenir un pourcentage de masse
                            graisseuse optimal pour le poste
                          </p>
                        </div>
                        <div className="flex items-start gap-4">
                          <div
                            className="rounded-full"
                            style={{
                              width: "0.75rem",
                              height: "0.75rem",
                              background: "#3b82f6",
                              marginTop: "0.5rem",
                            }}
                          ></div>
                          <p className="text-lg font-medium text-blue-800">
                            <strong>Développer les compétences techniques:</strong> Exploiter les avantages physiques
                            naturels
                          </p>
                        </div>
                        <div className="flex items-start gap-4">
                          <div
                            className="rounded-full"
                            style={{
                              width: "0.75rem",
                              height: "0.75rem",
                              background: "#f97316",
                              marginTop: "0.5rem",
                            }}
                          ></div>
                          <p className="text-lg font-medium text-orange-800">
                            <strong>Adaptation au poste:</strong> Maximiser l'efficacité selon les caractéristiques
                            physiques
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
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
                  <Brain
                    style={{ width: "5rem", height: "5rem", margin: "0 auto", color: "#fb923c" }}
                    className="mb-6"
                  />
                  <h3 className="text-3xl font-bold text-orange-900 mb-4">Prêt pour la Simulation !</h3>
                  <p className="text-xl text-orange-700 mb-6 font-medium">
                    Entrez les caractéristiques physiques pour commencer la prédiction
                  </p>
                  <div className="text-lg text-orange-600 font-medium">
                    Nos modèles d'IA analysent les données anthropométriques pour des prédictions précises !
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
