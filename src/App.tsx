import { useState, ReactNode } from 'react'
import { PageNames } from './consts/consts'
import { LoginPage } from './page/LoginPage'
import styles from './App.module.scss'
import { SearchPage } from './page/SearchPage';

interface PageWrapperProps {
  children: ReactNode;
}
const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return <div className={styles.appContainer}>{children}</div>;
};

const App: React.FC = () => {
  // using this state as a router since it's just a simple app
  const [page, setPage] = useState<PageNames>(PageNames.Search)

  const handleLoginSuccess = () => {
    setPage(PageNames.Search)
  }

  const handleApiFail = () => {
    setPage(PageNames.Login)
  }

  switch (page) {
    case PageNames.Search:
      return <PageWrapper><SearchPage handleApiFail={handleApiFail}/></PageWrapper>
    case PageNames.Login:
    default:
      return <PageWrapper><LoginPage handleLoginSuccess={handleLoginSuccess} /></PageWrapper>
  }

}

export default App
