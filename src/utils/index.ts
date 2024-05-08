import type { AxiosError } from 'axios'
import axios from 'axios'

export const handleApiError = (error: any) => {
  let messageError = ''
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError // Type assertion
    if (axiosError.response) {
      // AxiosError with response
      messageError = axiosError.response.data?.message
    } else if (axiosError.request) {
      // AxiosError without response
      messageError = 'Request made but no response received'
    } else {
      // Other AxiosError
      messageError = 'Error in making request'
    }
  } else {
    // Non-Axios error
    messageError = 'An error occurred'
  }

  return messageError
}
