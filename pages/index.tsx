import styles from './home.module.scss'
import Head from 'next/head'
import { SubscribeButton } from '../src/components/SubscribeButton'
import { GetServerSideProps, GetStaticProps} from 'next';
import { stripe } from '../src/services/stripe'

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

// Client-side Comments
// Server-side Seo, dynamic data
// Static site generation Seo

export default function Home({ product }: HomeProps) {
  return (
      <>
        <Head>
          <title>Home | ig.news</title>
        </Head>

        <main className={styles.contentContainer}>
          <section className={styles.hero}>
            <span>👏 Hey, welcome</span>
            <h1>News about the <span>React</span> world.</h1>
            <p>
              Get access to all the publications <br />
              <span>for {product.amount} month</span>
            </p>
            <SubscribeButton priceId={product.priceId} />
          </section>
          <img src="/images/avatar.svg" alt="Girl Coding" />
        </main>
      </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1K4Z1OFZboC3tmVmxetcUaO0', {
    expand: ['product'],
  });

  const  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const product = {
    priceId: price.id,
    amount: formatter.format(price.unit_amount / 100),
  };

  return { 
    props: {
      product,
    },
    revalidate: 60 * 60 * 24 // 1 dia   
  }
}