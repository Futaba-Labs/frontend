import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Title.module.css'
import {Text} from '@nextui-org/react'
import {Button} from '@nextui-org/react'
import {Link} from '@nextui-org/react'


const Title: NextPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.absolute}>
        <>
          <Text
            h1
            size={60}
            css={{
              textGradient: '45deg, $blue500 -20%, $pink500 50%',
            }}
            weight="bold"
          >
        いつもの通貨で
          </Text>
          <Text
            h1
            size={60}
            css={{
              textGradient: '45deg, $purple500 -20%, $pink500 100%',
            }}
            weight="bold"
          >
        いつもと違う体験。
          </Text>
          <Text size={18} className={styles.subtitle}>話題のNFTだけど、価格や決済手段がわかり辛い。<br></br>
      なら、いつも使っている日本円ステーブルコインで決済可能。<br></br>
      お気に入りのNFTを、いつでもどこでも。</Text>

          <div className={styles.buttons}>
            <Button shadow color="gradient" auto>
          早速始める
            </Button>
            <Link className={styles.library_link} href="#">
            ライブラリを見る
            </Link>
          </div>
        </>
      </div>
    </div>
  )
}
export default Title
