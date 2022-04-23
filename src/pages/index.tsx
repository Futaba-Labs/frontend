import Button from '@/components/Button'
import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import HomeBackGround from '../images/home_background.png'
import {height} from '@mui/system'
import Title from '@/components/Title'
import Heading from '@/components/Heading'
import NFTCard from '@/components/NFTCard'
import Menu from '@/components/menu'

const Home: NextPage = () => {
  const test = () => {}


  return (
    <div className={styles.container}>

      <div className={styles.relative}>
        <Image src={HomeBackGround} alt="" title="" />
        <div className={styles.absolute_menu}><Menu /></div>

        <a className={styles.absolute}>aa</a>
        <Title />
      </div>
      <Button result={2} result2={22} function={() => test()}/>

      <Heading content={'出品リスト'} />
      <NFTCard />
    </div>

  )
}

export default Home
