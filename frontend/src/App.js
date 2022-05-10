import { useState } from 'react'; /* useState is a react hook(basically a function) we will use to deal with the state of the user input*/
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Search from './components/Search';

/* Arrow function instead of using the keyword function */
const App = () => {
  const [word, setWord] = useState('') /* word hold data and setWord function updates word. useState returns two elements in an array so we destruct it here*/

  /* This handles the submission of the search button in the search component*/
  /* below e.target[0].value retrieves the value for the text in the search bar */
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    console.log(word)
  };

  return (
    <div>
      <Header title="Images Gallery"/>
      <Search word={word} setWord={setWord} handleSubmit={handleSearchSubmit}/> 
    </div>
  );
}

export default App;

