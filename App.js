import React, { useEffect } from 'react'
import StackNavigation from './src/navigation/stackNavigation'
import { apicall } from './src/api/OpenAI'

const App = () => {

  // useEffect(()=>{
  //   apicall("Create an Image with dog?")
  // },[])

  return (
    <StackNavigation/>
  )
}

export default App
