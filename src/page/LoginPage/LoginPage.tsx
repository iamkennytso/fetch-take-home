import { useState } from 'react';
import { Button, TextInput } from '../../components';
import styles from './LoginPage.module.scss';
import { isValidEmail } from '../../utils/isValidEmail';
import { useDogApi } from '../../hooks/useDogApi';

type LoginPageProps = {
  handleLoginSuccess: () => void
}



const LoginPage: React.FC<LoginPageProps> = ({handleLoginSuccess}) =>{
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [subtitle, setSubtitle] = useState<string>('Please login!')
  const [loading, setLoading] = useState<boolean>(false)
  const { userLogin } = useDogApi()

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const userLoginSuccess = await userLogin(name, email)
      if (userLoginSuccess) {
        handleLoginSuccess()
      } else {
        throw new Error
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
        <form className={styles.inputsContainer} onSubmit={handleSubmit}>        
          <TextInput value={name} onChange={val => setName(val)} label='Name' className={styles.input} />
          <TextInput value={email} onChange={val => setEmail(val)} label='E-mail' type='email' className={styles.input} />
          <div className={styles.buttonContainer}>
            <Button label='Login' onClick={handleSubmit} isDisabled={!isFormValid || loading} />
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage