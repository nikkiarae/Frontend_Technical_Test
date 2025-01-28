import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import podNames from 'ember-component-css/pod-names';
import { service } from '@ember/service';

export default class AddMovieForm extends Component {
  styleNamespace = podNames['add-movie-form'];

  @service firebase;

  @tracked rating;

  @tracked errorMessage;

  get movie() {
    return this.args.movie;
  }

  get isEditMode() {
    return this.args.editMode;
  }

  @action
  updateRating(event) {
    const value = event.target.value;
    this.rating = parseFloat(value);
    this.movie.rating = parseFloat(value);
  }

  @action
  async addMovie(event) {
    event.preventDefault();

    this.errorMessage = undefined;

    try {
      await this.firebase.addMovie(this.movie);

      this.args.reset();

      this.args.loadMovies();
    } catch (error) {
      this.errorMessage = error?.message;
    }
  }

  @action
  async updateMovie(event) {
    event.preventDefault();

    this.errorMessage = undefined;

    try {
      const { description, title, rating, id } = this.movie;


      await this.firebase.updateMovie(id, { title, description, rating });

      this.args.reset();

      this.args.loadMovies();
    } catch (error) {
      this.errorMessage = error?.message;
    }
  }

  @action
  async deleteMovie(event) {
    event.preventDefault();

    this.errorMessage = undefined;

    try {
      await this.firebase.deleteMovie(this.movie.id);

      this.args.reset();

      this.args.loadMovies();
    } catch (error) {
      this.errorMessage = error?.message;
    }
  }

  @action
  exitForm() {
    this.rating = 0;
    this.errorMessage = undefined;
    this.args.reset();
  }
}
