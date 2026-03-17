'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Clock, XCircle, Upload, ArrowLeft, Loader2 } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { createClient } from '@/lib/supabase/client'

type VerificationRequest = {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  document_type: string
  submitted_at: string
  admin_notes: string | null
}

const documentTypes = [
  { value: 'national_id', label: 'Carte Nationale d\'Identité (CNI)' },
  { value: 'passport', label: 'Passeport' },
  { value: 'drivers_license', label: 'Permis de conduire' },
]

export default function VerifyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [verificationRequest, setVerificationRequest] = useState<VerificationRequest | null>(null)
  const [documentType, setDocumentType] = useState('national_id')
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const authClient: any = (supabase as any).auth
      const userData = authClient.getUser
        ? await authClient.getUser()
        : await authClient.getSession()
      const user = userData?.data?.user || userData?.data?.session?.user

      if (!user) {
        router.replace('/login')
        return
      }

      // Fetch existing verification request
      const res = await fetch('/api/verify')
      if (res.ok) {
        const data = await res.json()
        setVerificationRequest(data.request || null)
      }

      setLoading(false)
    }
    init()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!documentFile) {
      setError('Veuillez sélectionner une photo de votre document.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const supabase = createClient()

      // Upload document
      const docExt = documentFile.name.split('.').pop()
      const docPath = `${Date.now()}-document.${docExt}`
      const { data: docUpload, error: docError } = await supabase.storage
        .from('verification-docs')
        .upload(docPath, documentFile, { upsert: false })

      if (docError) {
        setError('Erreur lors du téléchargement du document. Réessayez.')
        setSubmitting(false)
        return
      }

      const { data: docUrlData } = supabase.storage
        .from('verification-docs')
        .getPublicUrl(docUpload.path)
      const documentUrl = docUrlData.publicUrl

      // Upload selfie (optional)
      let selfieUrl: string | null = null
      if (selfieFile) {
        const selfieExt = selfieFile.name.split('.').pop()
        const selfiePath = `${Date.now()}-selfie.${selfieExt}`
        const { data: selfieUpload, error: selfieError } = await supabase.storage
          .from('verification-docs')
          .upload(selfiePath, selfieFile, { upsert: false })

        if (!selfieError && selfieUpload) {
          const { data: selfieUrlData } = supabase.storage
            .from('verification-docs')
            .getPublicUrl(selfieUpload.path)
          selfieUrl = selfieUrlData.publicUrl
        }
      }

      // Submit verification request
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_type: documentType,
          document_url: documentUrl,
          selfie_url: selfieUrl,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Une erreur est survenue. Réessayez.')
        setSubmitting(false)
        return
      }

      const data = await res.json()
      setVerificationRequest(data.request)
      setSuccess(true)
      setSubmitting(false)
    } catch {
      setError('Erreur réseau. Réessayez.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  const showForm =
    !verificationRequest ||
    verificationRequest.status === 'rejected'

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Back link */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Vérifier mon identité</h1>
            <p className="text-gray-500 mb-6">
              La vérification d'identité renforce la confiance entre les utilisateurs de Findr.
            </p>

            {/* Status Display */}
            {verificationRequest && (
              <div className="mb-6">
                {verificationRequest.status === 'pending' && (
                  <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-yellow-800">En attente de vérification</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Votre demande a été soumise le{' '}
                        {new Date(verificationRequest.submitted_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                        . Notre équipe l'examinera dans les 24-48 heures.
                      </p>
                    </div>
                  </div>
                )}

                {verificationRequest.status === 'approved' && (
                  <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-800">Vérifié ✓</p>
                      <p className="text-sm text-green-700 mt-1">
                        Votre identité a été vérifiée avec succès. Un badge de vérification est affiché sur votre profil.
                      </p>
                    </div>
                  </div>
                )}

                {verificationRequest.status === 'rejected' && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-800">Rejeté - Veuillez soumettre à nouveau</p>
                      {verificationRequest.admin_notes && (
                        <p className="text-sm text-red-700 mt-1">
                          Raison : {verificationRequest.admin_notes}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Upload Form */}
            {showForm && !success && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Document Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de document <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  >
                    {documentTypes.map((dt) => (
                      <option key={dt.value} value={dt.value}>
                        {dt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Document Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo du document <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="document-upload"
                    />
                    <label
                      htmlFor="document-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
                    >
                      {documentFile ? (
                        <div className="text-center">
                          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-1" />
                          <p className="text-sm text-green-700 font-medium">{documentFile.name}</p>
                          <p className="text-xs text-gray-500">Cliquez pour changer</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Cliquez pour télécharger</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG (max 10MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Selfie (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selfie avec le document{' '}
                    <span className="text-gray-400 font-normal">(optionnel, recommandé)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelfieFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="selfie-upload"
                    />
                    <label
                      htmlFor="selfie-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
                    >
                      {selfieFile ? (
                        <div className="text-center">
                          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-1" />
                          <p className="text-sm text-green-700 font-medium">{selfieFile.name}</p>
                          <p className="text-xs text-gray-500">Cliquez pour changer</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Selfie tenant votre document</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG (max 10MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting || !documentFile}
                  className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    'Soumettre ma demande'
                  )}
                </button>
              </form>
            )}

            {/* Success State */}
            {success && (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Demande envoyée!</h2>
                <p className="text-gray-500 mb-6">
                  Votre demande de vérification a été soumise avec succès. Notre équipe l'examinera dans les 24-48 heures.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Retour au tableau de bord
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
