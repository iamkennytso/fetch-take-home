import { useState } from 'react';
import { Button, TextInput } from '../../components';
import styles from './LoginPage.module.scss';
import axios from 'axios';
import { API_URL } from '../../consts/consts';
import { isValidEmail } from '../../utils/isValidEmail';

type LoginPageProps = {
  handleLoginSuccess: () => void
}

type LoginRequestBody = {
  email: string;
  name: string;
};

type LoginRequestConfig = {
  withCredentials: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({handleLoginSuccess}) =>{
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subtitle, setSubtitle] = useState('Please login!')
  const [loading, setLoading] = useState(false)

  const handleOnClick = async () => {
    try {
      setLoading(true)
      const requestBody: LoginRequestBody = { name, email }
      const requestConfig: LoginRequestConfig = { withCredentials: true }
      const loginResponse = await axios.post(`${API_URL}/auth/login`, requestBody, requestConfig)
      if (loginResponse?.status === 200) {
        handleLoginSuccess
      }
    } catch (e) {
      console.error(e)
      setSubtitle('Please try again!')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = !!name.trim() && isValidEmail(email)

  return (
    <div className={styles.page}>
      <div className={styles.contentContainer}>
        <h1>Welcome to "We Love Dogs"!</h1>
        <h2>{subtitle}</h2>
        <div className={styles.inputsContainer}>        
          <TextInput value={name} onChange={val => setName(val)} label='Name' />
          <TextInput value={email} onChange={val => setEmail(val)} label='E-mail' type='email' />
          <div className={styles.buttonContainer}>
            <Button label='Login' onClick={handleOnClick} isDisabled={!isFormValid || loading} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage