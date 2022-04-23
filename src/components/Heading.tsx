import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Heading.module.css'
import {Text} from '@nextui-org/react'

interface Props {
    content: string;
  }

const Heading: NextPage<Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.padding_80px}></div>
      <div className={styles.content}>
        <Text
          h1
          size={48}
          css={{
            textGradient: '45deg, $blue500 -20%, $pink500 50%',

          }}
          weight="bold"
        >
          {props.content}
        </Text>
        <div className={styles.padding_80px}></div>
      </div>

    </div>
  )
}
export default Heading
