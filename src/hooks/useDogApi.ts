import axios from "axios";

export const API_URL: string = 'https://frontend-take-home-service.fetch.com'

interface LoginRequestBody {
  email: string;
  name: string;
};

interface LoginRequestConfig {
  withCredentials: boolean;
}

export interface SearchDogsParams {
  breeds?: string[],
  zipCodes?: number[],
  ageMin?: number,
  ageMax?: number,
  size?: number,
  from?: number,
  sort?: string
}

interface GetDogsIdSearchResponse {
  resultIds: string[],
  next: string,
  total: number
}

interface GetDogsSearchResponse {
  dogs: Dog[],
  total: number;
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

  const searchDogs = async(params: SearchDogsParams): Promise<GetDogsSearchResponse> => {
    try {
      const getDogIdsResponse = await axios.get<GetDogsIdSearchResponse>(`${API_URL}/dogs/search`, {
        ...requestConfig,
        params,
      })
      const { resultIds, total } = getDogIdsResponse.data
      const getDogsResponse = await axios.post<Dog[]>(`${API_URL}/dogs`, [
        ...resultIds
      ], {
        ...requestConfig,
      })
      return {
        dogs: getDogsResponse.data,
        total,
      }
    } catch (e) {
      console.error('Error searching dogs', e)
      return {
        dogs: [],
        total: 0
      }
    }
  }

  return { userLogin, userLogout, getBreeds, searchDogs }
}
