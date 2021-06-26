import { FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'

import { database } from '../services/firebase'

import { Button } from '../components/Button'
import { ToggleButton } from '../components/ToggleButton'
import { useAuth } from '../hooks/useAuth'

import '../styles/auth.scss'
import toast from 'react-hot-toast'
import { useTheme } from '../hooks/useTheme'

export function Home() {
  const history = useHistory();
  const { user, singInWithGoogle } = useAuth()
  const [roomCode, setRoomCode] = useState('')

  async function handleCreateRoom() {
    if (!user) {
      await singInWithGoogle();
    }

    history.push('/rooms/new')
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === ''){
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if(!roomRef.exists()) {
      toast.error("Invalid room code");
      return;
    }

    if (roomRef.val().endedAt) {
      toast.error("Room already closed");
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  const {theme} = useTheme()

  return (
    <>
    <div id="page-auth" className={theme}>
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <div>
          <strong>Toda pergunta tem uma resposta.</strong>
          <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
        </div>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google 
          </button>
          <div className="separator">Ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
          <input 
          type="text"
          placeholder="Digite o código da sala"
          onChange={event => setRoomCode(event.target.value)}
          value={roomCode}
          />
          <Button type='submit'>
            Entrar na sala
          </Button>
          </form>
        </div>
      </main>
      <footer>
        <ToggleButton />
      </footer>
    </div>
    </>
  )
}