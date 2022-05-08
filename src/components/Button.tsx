import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

interface Props {
    result: number;
    result2:number;
    function: () => void
  }

const Button: NextPage<Props> = (props) => {
  //ここに関数を書く
  const hogehoge = async () => {
    props.result+1
  }


  return (
    <div className={styles.container}>
      <button onClick={props.function}></button>


    </div>
  )
}
export default Button
