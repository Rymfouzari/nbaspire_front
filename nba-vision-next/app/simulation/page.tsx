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
  const [selectedModel, setSelectedModel] = useState("")
  const [playerStats, setPlayerStats] = useState({
    points: "",
    rebounds: "",
    assists: "",
    fieldGoal: "",
    threePoint: "",
    freeThrow: "",
  })
  const [prediction, setPrediction] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const models = [
    {
      id: "linear_regression",
      name: "Régression Linéaire",
      description: "Modèle simple basé sur les corrélations linéaires",
      accuracy: 78,
      complexity: "Faible",
    },
    {
      id: "random_forest",
      name: "Random Forest",
      description: "Ensemble d'arbres de décision pour plus de précision",
      accuracy: 85,
      complexity: "Moyenne",
    },
    {
      id: "neural_network",
      name: "Réseau de Neurones",
      description: "Deep learning pour capturer les patterns complexes",
      accuracy: 92,
      complexity: "Élevée",
    },
    {
      id: "xgboost",
      name: "XGBoost",
      description: "Gradient boosting optimisé pour les performances",
      accuracy: 89,
      complexity: "Élevée",
    },
  ]

  const handlePredict = async () => {
    if (!selectedModel || !playerStats.points || !playerStats.rebounds || !playerStats.assists) {
      return
    }

    setIsLoading(true)

    // Simulation d'une prédiction (en réalité, cela ferait appel à votre API ML)
    setTimeout(() => {
      const mockPrediction = {
        mvpProbability: Math.random() * 100,
        allStarProbability: Math.random() * 100,
        playoffSuccess: Math.random() * 100,
        nextSeasonPoints: Number.parseFloat(playerStats.points) + (Math.random() - 0.5) * 5,
        confidence: 85 + Math.random() * 10,
        factors: [
          { name: "Performance offensive", impact: 85, positive: true },
          { name: "Efficacité au tir", impact: 72, positive: true },
          { name: "Contribution défensive", impact: 68, positive: false },
          { name: "Leadership", impact: 91, positive: true },
        ],
      }
      setPrediction(mockPrediction)
      setIsLoading(false)
    }, 2000)
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

        <div className="grid gap-8" style={{ gridTemplateColumns: "1fr 2fr" }}>
          {/* Configuration Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Model Selection */}
            <Card
              className="card-hover"
              style={{
                background: "linear-gradient(to bottom right, white, #faf5ff)",
                border: "2px solid #d8b4fe",
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-purple-900">
                  <Brain className="w-6 h-6" />
                  Sélection du Modèle
                </CardTitle>
                <CardDescription className="text-purple-700 font-medium">
                  Choisissez le modèle d'IA à utiliser pour la prédiction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger
                    className="h-12 text-lg"
                    style={{
                      background: "#faf5ff",
                      border: "2px solid #d8b4fe",
                    }}
                  >
                    <SelectValue placeholder="Choisir un modèle" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedModel && (
                  <div
                    className="p-4 rounded-lg border-2 mt-6"
                    style={{
                      background: "#faf5ff",
                      borderColor: "#d8b4fe",
                    }}
                  >
                    {(() => {
                      const model = models.find((m) => m.id === selectedModel)
                      return model ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                          <h4 className="font-bold text-purple-900 text-lg">{model.name}</h4>
                          <p className="text-purple-700 font-medium">{model.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-purple-800">Précision:</span>
                            <Badge className="text-white text-lg px-3 py-1" style={{ background: "#10b981" }}>
                              {model.accuracy}%
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-purple-800">Complexité:</span>
                            <Badge variant="outline" className="border-purple-400 text-purple-700 text-lg px-3 py-1">
                              {model.complexity}
                            </Badge>
                          </div>
                        </div>
                      ) : null
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Player Stats Input */}
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
                  Statistiques du Joueur
                </CardTitle>
                <CardDescription className="text-orange-700 font-medium">
                  Entrez les statistiques pour la prédiction
                </CardDescription>
              </CardHeader>
              <CardContent style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <Label htmlFor="points" className="text-lg font-bold text-orange-900">
                    Points par match
                  </Label>
                  <Input
                    id="points"
                    type="number"
                    placeholder="25.5"
                    value={playerStats.points}
                    onChange={(e) => setPlayerStats({ ...playerStats, points: e.target.value })}
                    className="h-12 text-lg"
                    style={{
                      background: "#fff7ed",
                      border: "2px solid #fdba74",
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="rebounds" className="text-lg font-bold text-orange-900">
                    Rebonds par match
                  </Label>
                  <Input
                    id="rebounds"
                    type="number"
                    placeholder="8.2"
                    value={playerStats.rebounds}
                    onChange={(e) => setPlayerStats({ ...playerStats, rebounds: e.target.value })}
                    className="h-12 text-lg"
                    style={{
                      background: "#fff7ed",
                      border: "2px solid #fdba74",
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="assists" className="text-lg font-bold text-orange-900">
                    Passes par match
                  </Label>
                  <Input
                    id="assists"
                    type="number"
                    placeholder="6.1"
                    value={playerStats.assists}
                    onChange={(e) => setPlayerStats({ ...playerStats, assists: e.target.value })}
                    className="h-12 text-lg"
                    style={{
                      background: "#fff7ed",
                      border: "2px solid #fdba74",
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="fieldGoal" className="text-lg font-bold text-orange-900">
                    % Réussite au tir
                  </Label>
                  <Input
                    id="fieldGoal"
                    type="number"
                    placeholder="48.5"
                    value={playerStats.fieldGoal}
                    onChange={(e) => setPlayerStats({ ...playerStats, fieldGoal: e.target.value })}
                    className="h-12 text-lg"
                    style={{
                      background: "#fff7ed",
                      border: "2px solid #fdba74",
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="threePoint" className="text-lg font-bold text-orange-900">
                    % Réussite à 3pts
                  </Label>
                  <Input
                    id="threePoint"
                    type="number"
                    placeholder="35.2"
                    value={playerStats.threePoint}
                    onChange={(e) => setPlayerStats({ ...playerStats, threePoint: e.target.value })}
                    className="h-12 text-lg"
                    style={{
                      background: "#fff7ed",
                      border: "2px solid #fdba74",
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="freeThrow" className="text-lg font-bold text-orange-900">
                    % Lancers francs
                  </Label>
                  <Input
                    id="freeThrow"
                    type="number"
                    placeholder="82.1"
                    value={playerStats.freeThrow}
                    onChange={(e) => setPlayerStats({ ...playerStats, freeThrow: e.target.value })}
                    className="h-12 text-lg"
                    style={{
                      background: "#fff7ed",
                      border: "2px solid #fdba74",
                    }}
                  />
                </div>

                <Button
                  onClick={handlePredict}
                  disabled={
                    !selectedModel || !playerStats.points || !playerStats.rebounds || !playerStats.assists || isLoading
                  }
                  className="w-full shadow-xl border-2 border-orange-400 text-lg px-8 py-4 scale-hover-css"
                  style={{
                    background: "linear-gradient(to right, #ea580c, #c2410c)",
                    color: "white",
                  }}
                >
                  {isLoading ? (
                    <>
                      <Brain className="w-5 h-5 mr-2 spin-slow-css" />
                      Calcul en cours...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Lancer la Prédiction
                    </>
                  )}
                </Button>
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
                        <p className="text-yellow-700 font-medium">Basé sur les performances actuelles</p>
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
                            <strong>Améliorer la défense:</strong> Augmenter les interceptions et les contres pour un
                            impact plus complet
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
                            <strong>Consistance offensive:</strong> Maintenir un pourcentage de tir élevé sur la durée
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
                            <strong>Leadership:</strong> Développer les aspects de mentorat et de leadership d'équipe
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
                    Sélectionnez un modèle et entrez les statistiques pour commencer la prédiction
                  </p>
                  <div className="text-lg text-orange-600 font-medium">
                    Nos modèles d'IA analysent plus de 50 variables pour des prédictions précises !
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
