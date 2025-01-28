import {
  addDoc,
  collection,
  getFirestore,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import config from 'ember-quickstart/config/environment';
import Service from '@ember/service';

export default class FirebaseService extends Service {
  db = config.environment === 'test' ? undefined : getFirestore();

  /**
   * Add a new movie to the 'movies' collection
   * @param {string} title - Movie title
   * @param {string} description - Movie description
   * @param {number} rating - Movie rating
   * @returns {Promise<void>}
   */
  async addMovie(movie) {
    await addDoc(collection(this.db, 'movies'), movie);
  }

  /**
   * Update an existing movie in the 'movies' collection
   * @param {string} id - Movie ID
   * @param {Object} movie - Updated movie data
   * @returns {Promise<void>}
   */
  async updateMovie(id, movie) {
    const movieRef = doc(this.db, 'movies', id);
    await updateDoc(movieRef, movie);
  }

  /**
   * Delete a movie from the 'movies' collection
   * @param {string} id - Movie ID
   * @returns {Promise<void>}
   */
  async deleteMovie(id) {
    const movieRef = doc(this.db, 'movies', id);
    await deleteDoc(movieRef);
  }
}
