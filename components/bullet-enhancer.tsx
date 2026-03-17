"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Sparkles, Copy, Check, Briefcase, Target, Zap } from "lucide-react"

interface Improvements {
  standard: string
  achievementFocused: string
  concise: string
}

export function BulletEnhancer() {
  const [bullet, setBullet] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [tone, setTone] = useState("Professional")
  const [isLoading, setIsLoading] = useState(false)
  const [improvements, setImprovements] = useState<Improvements | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!bullet.trim()) return

    setIsLoading(true)
    setImprovements(null)

    try {
      const response = await fetch("/api/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bullet, jobTitle, tone }),
      })

      const data = await response.json()
      setImprovements(data.improvements)
    } catch (error) {
      console.error("Failed to improve bullet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const resultCards = [
    {
      key: "standard",
      title: "Standard Improved",
      description: "Professional and polished version",
      icon: Briefcase,
      content: improvements?.standard,
    },
    {
      key: "achievementFocused",
      title: "Achievement-Focused",
      description: "Emphasis on measurable outcomes",
      icon: Target,
      content: improvements?.achievementFocused,
    },
    {
      key: "concise",
      title: "Concise Version",
      description: "Shorter but impactful",
      icon: Zap,
      content: improvements?.concise,
    },
  ]

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Input Section */}
      <div className="space-y-6">
        <div className="space-y-3">
          <label
            htmlFor="bullet"
            className="text-sm font-medium text-muted-foreground"
          >
            Original Resume Bullet
          </label>
          <Textarea
            id="bullet"
            placeholder="Paste your resume bullet here, e.g., 'Responsible for managing team projects and meeting deadlines...'"
            value={bullet}
            onChange={(e) => setBullet(e.target.value)}
            className="min-h-[120px] bg-input border-border text-foreground placeholder:text-muted-foreground resize-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label
              htmlFor="jobTitle"
              className="text-sm font-medium text-muted-foreground"
            >
              Target Job Title{" "}
              <span className="text-muted-foreground/60">(optional)</span>
            </label>
            <Input
              id="jobTitle"
              placeholder="e.g., Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="space-y-3">
            <label
              htmlFor="tone"
              className="text-sm font-medium text-muted-foreground"
            >
              Tone
            </label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="bg-input border-border text-foreground focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="Professional">Professional</SelectItem>
                <SelectItem value="Stronger">Stronger</SelectItem>
                <SelectItem value="Concise">Concise</SelectItem>
                <SelectItem value="Achievement-focused">
                  Achievement-focused
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!bullet.trim() || isLoading}
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 font-medium"
        >
          {isLoading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Enhancing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Improve Bullet
            </>
          )}
        </Button>
      </div>

      {/* Results Section */}
      {improvements && (
        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-semibold text-foreground">
            Enhanced Versions
          </h2>
          <div className="grid gap-4">
            {resultCards.map((card) => (
              <Card
                key={card.key}
                className="bg-card border-border shadow-lg shadow-black/20 transition-all duration-200 hover:shadow-xl hover:shadow-black/30"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-secondary">
                        <card.icon className="h-4 w-4 text-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold text-foreground">
                          {card.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {card.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        copyToClipboard(card.content || "", card.key)
                      }
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
                    >
                      {copiedField === card.key ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      <span className="sr-only">Copy {card.title}</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">
                    {card.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
