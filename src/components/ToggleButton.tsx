import '../styles/togglebutton.scss'

import { useTheme } from '../hooks/useTheme'
import { useState } from 'react';
import { useEffect } from 'react';

export const ToggleButton = () => {

  const { theme ,toggleTheme } = useTheme();
  const [checkedIsTrue, setCheckedIsTrue] = useState(false)
  
  useEffect(() =>{
    function darkModeOn() {
  setCheckedIsTrue(true)
  }
  
    if(theme === 'dark'){
      darkModeOn()
    } else {
      setCheckedIsTrue(false)
    }

    console.log(checkedIsTrue)
  },[checkedIsTrue, theme])

  
  return (
      <>
        <button className='toggle-button' onClick={toggleTheme} >  
        <input type="checkbox" 
         name="Button toggle to darkmode"
         onChange={toggleTheme}
         checked={checkedIsTrue}
        /> 
        </button>
      </>
    )    
}