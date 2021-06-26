import { useHistory, useParams } from 'react-router-dom'
import cx from 'classnames'

import toast from 'react-hot-toast'

import logoImg from '../assets/images/logo.svg'
import altLogoImg from '../assets/images/logo-withe.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import emptyQuestions from '../assets/images/empty-questions.svg'

import { Button } from '../components/Button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'
import { ToggleButton } from '../components/ToggleButton'

import '../styles/adminroom.scss'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'
import { useTheme } from '../hooks/useTheme'

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const history = useHistory()
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const {theme} = useTheme()

  const { title, questions } = useRoom(roomId)

  async function handleEndRoom() {
    if (window.confirm('Tem certeza que você deseja remover esta sala?')){
      toast.success('Room ended')
      history.replace('/');
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })}    
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja remover essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();

      toast.success('Question successfully removed')
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
    isHighlighted: true
    });
  }
  
  return(
    <>
    <div id="page-room" className={theme}>
      <header className="content">
        <div className="header-logo" >
              { theme === 'light' && <img src={logoImg} className="image-logo" alt="Letmeask" />}
              { theme === 'dark' && <img src={altLogoImg} className="image-logo" alt="Letmeask" />}
              <RoomCode code={roomId}/>
        </div>
        <div className="header-buttons">
            <Button isOutlined onClick={handleEndRoom} >Encerrar sala</Button>
            <ToggleButton />
          </div>
      </header>

      <main>
        <div className={cx('room-title' ,{dark: theme === 'dark'})}> 
        
          <h1>{!title.toLowerCase().includes('sala') && 'Sala'} {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
        </div>

        <div className="question-list">
        {questions.map(question => {
          return (
            <Question
            key={question.id} 
            content={question.content}
            author={question.author}
            isAnswered={question.isAnswered}
            isHighlighted={question.isHighlighted}
             >

              {!question.isAnswered && (
                <>
                  <button
                  type='button'
                  onClick={() => handleCheckQuestionAsAnswered(question.id)}
                >
                  <img src={checkImg} alt="Marcar pergunta como respondida" />
                </button>

                  <button
                    type='button'
                    onClick={() => handleHighlightQuestion(question.id)}
                  >
                    <img src={answerImg} alt="Dar destaque à pergunta" />
                  </button>
                </>
              )}

              <button
                type='button'
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="Remover pergunta" />
              </button>
             </Question>
          )
        })}
        </div>
          { questions.length === 0 && <div>
              <img className="questions0" src={emptyQuestions} alt="Sem perguntas no momento" />
            </div> }
      </main>
    </div>
    </>
  );
}