import { handleApiError } from '@/lib/config/api'
import { getPreEnrollments } from '@/services/pre-enrollments'
import { useToast } from '@/components/ui/toast'

export function usePreEnrollments() {
  const [data, setData] = useState<PaginatedResponse<PreEnrollmentListItem> | null>(null)
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const fetchPreEnrollments = async () => {
    setLoading(true)
    try {
      const response = await getPreEnrollments()
      setData(response)
    } catch (error) {
      const apiError = handleApiError(error)

      toast.error(apiError.message)

      // opcional: guardar error
      // setError(apiError)
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    fetchPreEnrollments,
  }
}
