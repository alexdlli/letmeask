import { FormEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import illustrationImg from '../assets/images/illustration.svg'

import { Button } from '../components/Button'
import { ToggleButton } from '../components/ToggleButton'
import { database } from '../services/firebase'
import { useAuth } from '../hooks/useAuth'

import '../styles/auth.scss'
import toast from 'react-hot-toast'
import { useTheme } from '../hooks/useTheme'

export function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();
  const [newRoom, setNewRoom] = useState('')
  
 
  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if(newRoom.trim() === ''){
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
     title: newRoom,
     authorId: user?.id,
    })

    toast.success(`"${newRoom}" room created successfully`)
    
    history.push(`/admin/rooms/${firebaseRoom.key}`)
    
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
          <h2>Criar uma nova room</h2>
          <div className="separator">Ou entre em uma sala</div>
          <form onSubmit={handleCreateRoom}>
          <input 
          type="text"
          placeholder="Nome da sala"
          onChange={event => setNewRoom(event.target.value)}
          value={newRoom}
          />
          <Button type="submit">
            Criar Sala
          </Button>
          </form>
          <p>
          Quer entrar em uma sala já existente? <Link to="/">Clique aqui</Link> 
          </p>
        </div>
      </main>
      <footer>
        <ToggleButton />
      </footer>
    </div>
        
  </>
  )
}