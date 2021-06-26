import toast from 'react-hot-toast';
import copyImg from '../assets/images/copy.svg'

import '../styles/room-code.scss'

type RoomCodeProps = {
  code: string;
} 

export function RoomCode(props: RoomCodeProps) {

  function copyRoomCodeToClipboard() {
      navigator.clipboard.writeText(props.code);

      toast.success('Copy success!')
  }

  return(
    <>
      <button className={'room-code'} onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={copyImg} alt="Copy room code" />
      </div>
      <span>ID: #${props.code}</span>
    </button>
    </>
    
  )
}