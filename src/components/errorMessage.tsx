import {NextPage} from 'next'
import styles from '../styles/ErrorMessage.module.css'

interface Props {
  message: string
  visible: boolean
}
const ErrorMessage: NextPage<Props> = (props) => {
  return (
    <div className={styles.error_text}>
      {props.visible && <p>{props.message}</p>}
    </div>
  )
}

export default ErrorMessage
