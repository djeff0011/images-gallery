import { useState, useEffect } from 'react'; /* useState is a react hook(basically a function) we will use to deal with the state of the user input*/
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Search from './components/Search';
import ImageCard from './components/ImageCard';
import Welcome from './components/Welcome';
import Spinner from './components/Spinner';
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
  const [loading, setLoading] = useState(true);
  
  // Get saved images from the db and load it into the frontend
  const getSavedImages = async () => {
    try {
      const res = await axios.get(`${API_URL}/images`);
      setImages(res.data || []);
      setLoading(false);
      toast.success('Saved images downloaded');
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  // Here i did not use the () when calling the func. it crashes the server
  // The second argument, the empty list of dependencies makes it so that it loads only once
  useEffect(() => getSavedImages, []);  

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
      toast.info(`New image ${word.toUpperCase()} was found`)
    } catch (error) {
      console.log(error)    //not good to have console logs in code. can do a popup msg or something to warn about errors
      toast.error(error.message);
    }
    setWord(''); //set the input box on the search to empty or default. clears it
  };
  const handleDeleteImage = async (id) => {
    
    try {
      const res = await axios.delete(`${API_URL}/images/${id}`)
    if (res.data?.deleted_id){
      toast.warn(`Image ${images.find((i) => i.id === id).title.toUpperCase()} was deleted`)
      setImages(images.filter((image) => image.id !== id)); //filter here removes the id if it matches the one we want to delete. Filter returns new array
    }
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    }
  };

  const handleSaveImage = async (id) => {
    const imageToBeSaved = images.find((image) => image.id === id);
    imageToBeSaved.saved = true;

    try {
      const res = await axios.post(`${API_URL}/images`, imageToBeSaved);
      if (res.data?.inserted_id) {
        setImages(images.map((image) => image.id === id ? {...image, saved: true} : image));
        toast.info(`Image ${imageToBeSaved.title.toUpperCase()} was saved`);
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    }
  }

  //below we have the image property that will be used in the imageCard component
  // {!!images.length && <ImageCard image={images[0]} />}  changed this to
  // {images.map((image, i) => (<ImageCard key={i} image={image} />))}
  return (
    <div>
      <Header title="Images Gallery" />
      {loading ? (<Spinner />) : (<><Search word={word} setWord={setWord} handleSubmit={handleSearchSubmit} />
      <Container className="mt-4">
        {images.length ? (
          <Row xs={1} md={2} lg={3}>
            {images.map((image, i) => (
              <Col key={i} className="bp-3">
                <ImageCard image={image} deleteImage={handleDeleteImage} saveImage={handleSaveImage} />
              </Col>
            ))}
          </Row>
        ) : (
          <Welcome />
        )}
      </Container></>)}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default App;
