import { AppProps} from 'next/app'
import { Header } from '../src/components/Header'
import '../styles/global.scss'
import { SessionProvider } from 'next-auth/react';

// Tudo será recriado quando trocar de tela
function MyApp({ Component, pageProps: { session, ...pageProps} }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
