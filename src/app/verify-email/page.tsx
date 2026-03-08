'use client'

import Link from 'next/link'
import { Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-blue-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Vérifiez votre email
          </h1>
          <p className="text-gray-600 mb-6">
            Nous vous avons envoyé un lien de confirmation. Cliquez dessus pour activer votre compte.
          </p>

          <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-blue-800">
              <strong>📧 Vérifiez votre boîte de réception</strong><br />
              Si vous ne trouvez pas l'email, regardez dans vos spams.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/login">
              <Button className="w-full" size="lg">
                Aller à la connexion
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full" size="sm">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
