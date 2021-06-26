import { ReactNode } from 'react'
import cx from 'classnames'

import { useTheme } from '../hooks/useTheme'

import '../styles/question.scss'

type QuestionsProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
}

export function Question({
  content,
  author,
  children,
  isAnswered = false,
  isHighlighted = false,
}: QuestionsProps){

  const { theme } = useTheme()

  return(
    <div className={cx(
      'question',
      {dark: theme === 'dark' },
      { answered: isAnswered },
      { highlighted: isHighlighted && !isAnswered},
      )}>
      <p className={theme}>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  )
}