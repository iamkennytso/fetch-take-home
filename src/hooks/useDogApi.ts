import axios from "axios";

export const API_URL: string = 'https://frontend-take-home-service.fetch.com'

interface LoginRequestBody {
  email: string;
  name: string;
};

interface LoginRequestConfig {
  withCredentials: boolean;
}

interface SearchDogsParams {
  breeds?: string[],
  zipCodes?: number[],
  ageMin?: number,
  ageMax?: number,
  size?: number,
  from?: number,
  sort?: string
}

interface GetDogsSearchResponse {
  resultIds: string[],
  next: string,
  totla: number
}

export interface Dog {
  id: string
  img: string
  name: string
  age: number
  zip_code: string
  breed: string
}

const requestConfig: LoginRequestConfig = { withCredentials: true }

export const useDogApi = () => {
  const userLogin = async (name: string, email: string): Promise<boolean> => {
    try {
      const requestBody: LoginRequestBody = { name, email }
      
      const loginResponse = await axios.post(`${API_URL}/auth/login`, requestBody, requestConfig)
      if (loginResponse?.status === 200) {
        return true
      }
      return false
    } catch (e) {
      console.error('Error logging in', e)
      return false
    }
  }

  const userLogout = async(): Promise<void> => {
    try {
      await axios.post(`${API_URL}/auth/logout`)
    } catch (e) {
      console.error('Error logging out', e)
    }
    return
  }

  const getBreeds = async(): Promise<string[]> => {
    try {
      const response = await axios.get<string[]>(`${API_URL}/dogs/breeds`, requestConfig)
      return response.data
    } catch (e) {
      console.error('Error fetching breeds', e)
      return []
    }
  }

  const searchDogs = async(params: SearchDogsParams): Promise<Dog[]> => {
    try {
      const getDogIdsResponse = await axios.get<GetDogsSearchResponse>(`${API_URL}/dogs/search`, {
        ...requestConfig,
        ...params
      })
      const { resultIds } = getDogIdsResponse.data
      console.log(resultIds)
      const getDogsResponse = await axios.post<Dog[]>(`${API_URL}/dogs`, [
        ...resultIds
      ], {
        ...requestConfig,
      })
      console.log(getDogsResponse)
      return getDogsResponse.data
    } catch (e) {
      console.error('Error searching dogs', e)
      return []
    }
  }

  return { userLogin, userLogout, getBreeds, searchDogs }
}
