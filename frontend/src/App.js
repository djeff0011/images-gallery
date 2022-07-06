import { useState } from 'react'; /* useState is a react hook(basically a function) we will use to deal with the state of the user input*/
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Search from './components/Search';
import ImageCard from './components/ImageCard';
import Welcome from './components/Welcome';
import { Container, Row, Col } from 'react-bootstrap';

const UNSPLASH_KEY = process.env.REACT_APP_UNSPLASH_KEY;

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5050'

/* Arrow function instead of using the keyword function */
const App = () => {
  const [word, setWord] =
    useState(
      ''
    ); /* word hold data and setWord function updates word. useState returns two elements in an array so we destruct it here*/

  const [images, setImages] = useState([]);

  // console.log(images);

  /* This handles the submission of the search button in the search component*/
  /* below e.target[0].value retrieves the value for the text in the search bar */
  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    // fetch does not check if we succeeded in an operation before moving on, wo we use axios below
    /* Use fetch to make the api call. Like request in python. Use ${} to use local variables instead
       of using the + to concat to the string like in python. Mouse over the fetch keyword to see what
       it returns. It returns a Promise, which is a response */
    // fetch(
    //   `${API_URL}/new-image?query=${word}`
    // )
    //   .then((result) => result.json())
    //   .then((data) => {
    //     setImages([
    //       { ...data, title: word },
    //       ...images,
    //     ]); /* the ... is a javascript spread opperator to pull data from another array. data is the current images searched for*/
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    
    try {
      const res = await axios.get(`${API_URL}/new-image?query=${word}`)
      setImages([{ ...res.data, title: word }, ...images]);
    } catch (error) {
      console.log(error)    //not good to have console logs in code. can do a popup msg or something to warn about errors
    }
    setWord(''); //set the input box on the search to empty or default. clears it
  };
  const handleDeleteImage = (id) => {
    setImages(images.filter((image) => image.id !== id)); //filter here removes the id if it matches the one we want to delete. Filter returns new array
  };

  //below we have the image property that will be used in the imageCard component
  // {!!images.length && <ImageCard image={images[0]} />}  changed this to
  // {images.map((image, i) => (<ImageCard key={i} image={image} />))}
  return (
    <div>
      <Header title="Images Gallery" />
      <Search word={word} setWord={setWord} handleSubmit={handleSearchSubmit} />
      <Container className="mt-4">
        {images.length ? (
          <Row xs={1} md={2} lg={3}>
            {images.map((image, i) => (
              <Col key={i} className="bp-3">
                <ImageCard image={image} deleteImage={handleDeleteImage} />
              </Col>
            ))}
          </Row>
        ) : (
          <Welcome />
        )}
      </Container>
    </div>
  );
};

export default App;
