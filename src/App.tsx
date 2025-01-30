import { useState, ReactNode } from 'react'
import { LOGIN_PAGE } from './consts/consts'
import { LoginPage } from './page/LoginPage'
import styles from './App.module.scss'

interface PageWrapperProps {
  children: ReactNode;
}
const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return <div className={styles.appContainer}>{children}</div>;
};

const App: React.FC = () => {
  const [page, setPage] = useState(LOGIN_PAGE)

  switch (page) {
    case LOGIN_PAGE:
    default:
      return <PageWrapper><LoginPage /></PageWrapper>
  }

}

export default App
