import { useState } from 'react'; /* useState is a react hook(basically a function) we will use to deal with the state of the user input*/
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Search from './components/Search';

const UNSPLASH_KEY = process.env.REACT_APP_UNSPLASH_KEY;

/* Arrow function instead of using the keyword function */
const App = () => {
  const [word, setWord] =
    useState(
      ''
    ); /* word hold data and setWord function updates word. useState returns two elements in an array so we destruct it here*/

  const [images, setImages] = useState([]);

  console.log(images);

  /* This handles the submission of the search button in the search component*/
  /* below e.target[0].value retrieves the value for the text in the search bar */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log(word);
    /* Use fetch to make the api call. Like request in python. Use ${} to use local variables instead
       of using the + to concat to the string like in python. Mouse over the fetch keyword to see what
       it returns. It returns a Promise, which is a response */
    fetch(
      `https://api.unsplash.com/photos/random/?query=${word}&client_id=${UNSPLASH_KEY}`
    )
      .then((result) => result.json())
      .then((data) => {
        setImages([data, ...images]) /* the ... is a javascript spread opperator to pull data from another array. data is the current images searched for*/
      })
      .catch((err) => {
        console.log(err);
      });
    setWord(''); //set the input box on the search to empty or default. clears it
  };

  return (
    <div>
      <Header title="Images Gallery" />
      <Search word={word} setWord={setWord} handleSubmit={handleSearchSubmit} />
    </div>
  );
};

export default App;
