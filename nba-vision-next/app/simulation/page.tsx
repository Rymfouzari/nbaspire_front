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
    console.log("🔥 BOUTON CLIQUÉ !")
    console.log("📋 État du formulaire:", playerStats)
    console.log("✅ Formulaire valide ?", isFormValid())

    if (!playerStats.age || !playerStats.experience || !playerStats.position) {
      console.log("❌ Formulaire invalide - champs manquants")
      setError("Veuillez remplir tous les champs obligatoires (âge, expérience, poste)")
      return
    }

    console.log("🚀 Démarrage de la prédiction...")
    setIsLoading(true)
    setError(null)
    setPrediction(null)

    try {
      // Préparer les données pour l'API backend
      const requestData = {
        age: Number(playerStats.age),
        pos: playerStats.position,
        experience: Number(playerStats.experience),
        height_wo_shoes: Number(playerStats.heightWithoutShoes) || 0,
        height_w_shoes: Number(playerStats.heightWithShoes) || 0,
        weight: Number(playerStats.weight) || 0,
        wingspan: Number(playerStats.wingspan) || 0,
        standing_reach: Number(playerStats.verticalReach) || 0,
        body_fat_pct: Number(playerStats.bodyFatPercentage) || 0,
        hand_length: Number(playerStats.handLength) || 0,
        hand_width: Number(playerStats.handWidth) || 0,
      }

      console.log("Envoi des données:", requestData)

      // Appel à l'API backend avec plus de détails d'erreur
      const response = await fetch(`https://o13guuit0k.execute-api.eu-west-1.amazonaws.com/dev/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)

      if (!response.ok) {
        let errorMessage = `Erreur HTTP: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          // Si on ne peut pas parser le JSON d'erreur
          const errorText = await response.text()
          errorMessage = errorText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const predictionData = await response.json()
      console.log("Réponse de l'API:", predictionData)

      // Utiliser directement les données de l'API
      setPrediction(predictionData)
    } catch (err) {
      console.error("Erreur détaillée:", err)

      // Messages d'erreur plus spécifiques
      let errorMessage = "Une erreur est survenue lors de la prédiction"

      if (err instanceof TypeError && err.message.includes("fetch")) {
        errorMessage = "Impossible de se connecter au serveur. Vérifiez votre connexion internet."
      } else if (err instanceof Error) {
        errorMessage = err.message
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = () => {
    const valid = playerStats.age && playerStats.experience && playerStats.position
    console.log("🔍 Validation:", {
      age: playerStats.age,
      experience: playerStats.experience,
      position: playerStats.position,
      valid: valid,
    })
    return valid
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
                  onClick={() => {
                    console.log("🖱️ Clic sur le bouton détecté")
                    handlePredict()
                  }}
                  disabled={!isFormValid() || isLoading}
                  className="w-full shadow-xl border-2 border-orange-400 text-lg px-8 py-4 scale-hover-css"
                  style={{
                    background:
                      isFormValid() && !isLoading
                        ? "linear-gradient(to right, #ea580c, #c2410c)"
                        : "linear-gradient(to right, #9ca3af, #6b7280)",
                    color: "white",
                    cursor: isFormValid() && !isLoading ? "pointer" : "not-allowed",
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
                      {isFormValid() ? "Lancer la Prédiction" : "Remplir les champs obligatoires"}
                    </>
                  )}
                </Button>

                <p className="text-sm text-orange-600 text-center">* Champs obligatoires pour lancer la prédiction</p>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div>
            {error ? (
              <Card
                className="shadow-xl"
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(12px)",
                  border: "2px solid #ef4444",
                }}
              >
                <CardContent className="text-center py-16">
                  <AlertCircle
                    style={{ width: "5rem", height: "5rem", margin: "0 auto", color: "#ef4444" }}
                    className="mb-6"
                  />
                  <h3 className="text-3xl font-bold text-red-900 mb-4">Erreur de Prédiction</h3>
                  <p className="text-xl text-red-700 mb-6 font-medium">{error}</p>
                  <div className="text-lg text-red-600 font-medium">Veuillez vérifier vos données et réessayer.</div>
                </CardContent>
              </Card>
            ) : prediction ? (
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
                          <Award className="w-6 h-6 text-yellow-600" />🏆 Score Global
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-yellow-600 mb-3">{prediction.overall_score}</div>
                        <Progress value={prediction.overall_score} className="h-4 mb-3" />
                        <p className="text-yellow-700 font-medium">Évaluation globale du potentiel</p>
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
                          <Target className="w-6 h-6 text-blue-600" />⭐ Prédictions Détaillées
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-blue-600 mb-3">{prediction.detailed_predictions}</div>
                        <Progress value={prediction.detailed_predictions} className="h-4 mb-3" />
                        <p className="text-blue-700 font-medium">Analyse approfondie des capacités</p>
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
                          Points Forts
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-green-600 mb-3">{prediction.strengths}</div>
                        <Progress value={prediction.strengths} className="h-4 mb-3" />
                        <p className="text-green-700 font-medium">Identification des atouts majeurs</p>
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
                      {(() => {
                        const factors = [
                          {
                            name: "Score global",
                            impact: prediction.overall_score,
                            positive: prediction.overall_score > 50,
                          },
                          {
                            name: "Prédictions détaillées",
                            impact: prediction.detailed_predictions,
                            positive: prediction.detailed_predictions > 50,
                          },
                          { name: "Points forts", impact: prediction.strengths, positive: prediction.strengths > 50 },
                        ]
                        return factors.map((factor: any, index: number) => (
                          <div key={index} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-lg text-orange-900">{factor.name}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-xl font-bold text-orange-600">{factor.impact}</span>
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
                        ))
                      })()}
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
