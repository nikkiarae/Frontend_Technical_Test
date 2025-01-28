import { action } from '@ember/object';
import { collection, getFirestore, getDocs } from 'firebase/firestore';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import podNames from 'ember-component-css/pod-names';
import { DEFAULT_MOVIE } from '../../utils/defaults';

export default class LandingPage extends Component {
  styleNamespace = podNames['landing-page'];

  // All movies fetched from Firebase
  @tracked movies = [];

  // Selected movie for editing
  @tracked selectedMovie = { ...DEFAULT_MOVIE };

  // Determines if the form is in edit mode
  @tracked isEditMode = false;

  // Action: Select a movie to edit
  @action
  selectMovie(movie) {
    this.isEditMode = true;
    this.selectedMovie = movie;
  }

  // Action: Reset the form to add a new movie
  @action
  reset() {
    this.isEditMode = false;
    this.selectedMovie = { ...DEFAULT_MOVIE };
  }
  }

  // Action: Load movies from Firebase and initialize the filtered list
  @action
  async loadMovies() {
    try {
      const db = getFirestore(); // Initialize Firestore
      const moviesRef = collection(db, 'movies'); // Reference the 'movies' collection
      const moviesSnapshot = await getDocs(moviesRef); // Fetch all documents
      const movies = [];

      // Loop through the documents and build the movies array
      moviesSnapshot.forEach((doc) => {
        movies.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Set the movies and initialize the filtered movies list
      this.movies = movies;
      this.filteredMovies = movies;
    } catch (error) {
      console.error('Error loading movies:', error);
    }
  }

  // Constructor: Load movies when the component is initialized
  constructor(owner, args) {
    super(owner, args);
    this.loadMovies(); // Load movies on component initialization
  }
}
