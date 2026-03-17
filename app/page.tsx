import { BulletEnhancer } from "@/components/bullet-enhancer"
import { FileText } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-secondary">
              <FileText className="h-8 w-8 text-foreground" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight text-balance">
            Resume Bullet Enhancer
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto text-pretty">
            Transform weak resume bullets into powerful, achievement-focused
            statements that stand out to recruiters.
          </p>
        </div>

        {/* Enhancer Form */}
        <BulletEnhancer />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Powered by AI to help you land your dream job
          </p>
        </footer>
      </div>
    </main>
  )
}
