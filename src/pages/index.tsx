import Button from '@/components/Button'
import type {NextPage} from 'next'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Menu from '@/components/menu'
import SwapCard from '@/components/swapCard'
import {Container} from '@nextui-org/react'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import StatusDialog from '@/components/statusDialog'
import {useState} from 'react'
import {useWeb3} from '@/hooks/useWeb3'


const Home: NextPage = () => {
  const {provider, transactionStatuses, visible, setVisible} = useWeb3()

  const closeHandler = () => {
    setVisible(false)
  }
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.absolute_menu}><Menu /></div>
      </header>
      <div className={styles.relative}>
      </div>
      <SwapCard />
      <StatusDialog visible={visible} onClose={closeHandler} transactionStatuses={transactionStatuses}/>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        position={'bottom-right'}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default Home
