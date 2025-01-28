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

  // Filtered movies based on search input
  @tracked filteredMovies = [];

  // Search text input from the user
  @tracked searchText = '';

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

  // Action: Filter movies based on search text
  @action
  filterMovies(searchText) {
    this.searchText = searchText;

    // If no search text, reset the filtered list
    if (!searchText) {
      this.filteredMovies = this.movies;
      return;
    }

    // Convert search text to lowercase for case-insensitive search
    const searchTextLower = searchText.toLowerCase();

    // Filter movies based on title or description
    this.filteredMovies = this.movies.filter((movie) => {
      const title = movie.title?.toLowerCase() || '';
      const description = movie.description?.toLowerCase() || '';
      return (
        title.includes(searchTextLower) || description.includes(searchTextLower)
      );
    });
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
