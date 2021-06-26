import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"

import toast from "react-hot-toast"

import { database } from "../services/firebase"
import { useAuth } from "./useAuth"

type QuestionProps = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likes: Record<string, {
    authorId: string;
  }>
}>

interface databaseRoomProps {
  questions?: FirebaseQuestions;
  title: string;
  endedAt?: string;
}

export function useRoom(roomId: string) {
  const { user } = useAuth();

  const history = useHistory();

  const [questions, setQuestions] = useState<QuestionProps[]>([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

      roomRef.on('value', room => {
      const databaseRoom  = room.val() as databaseRoomProps
       
      if (!databaseRoom){
        toast.error(`You foi kicked`)
        
        history.replace('/')
        return;
      }

      if (databaseRoom?.endedAt) {
        toast.error(`This room is closed`)
        
        history.replace('/')
        return;
      }

      const firebaseQuestions: FirebaseQuestions = databaseRoom?.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId  === user?.id)?.[0],
        }
      })

      const questionSorted = parsedQuestions.sort((b, a) => a.likeCount - b.likeCount)

      setTitle(databaseRoom.title);
      setQuestions(questionSorted);
    })

    return () => {
      roomRef.off('value');
    }
  }, [roomId, history, user?.id]);

  return { questions, title }
}