import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | AddMovieForm', function (hooks) {
  setupRenderingTest(hooks);

  test('it contains the right elements', async function (assert) {
    await render(hbs`<AddMovieForm />`);

    // Assert the total number of labels (title, description, and rating)
    assert.dom('label').exists({ count: 3 }, 'The form contains three labels');

    // Assert individual labels
    assert.dom('[data-test-title-label]').exists().containsText('Title');
    assert
      .dom('[data-test-description-label]')
      .exists()
      .containsText('Description');
    assert.dom('[data-test-rating-label]').exists().containsText('Rating');

    // Assert input elements
    assert
      .dom('input[type="text"]')
      .exists(
        { count: 2 },
        'There are two text inputs (title and description)',
      );
    assert
      .dom('input[type="range"]')
      .exists({ count: 1 }, 'There is one range input for rating');

    // Assert buttons
    assert
      .dom('button')
      .exists({ count: 1 }, 'There is one button by default (Add Movie)');
    assert
      .dom('button')
      .hasText('Add Movie', 'The button is labeled correctly');

    // Assert no error message initially
    assert
      .dom('.error-message')
      .doesNotExist('No error message is displayed initially');
  });

  test('it adds a movie and clears the input fields on successful submission', async function (assert) {
    const firebaseService = this.owner.lookup('service:firebase');

    this.set('loadMovies', () => {
      assert.ok(true, 'loadMovies was called');
    });

    this.set('reset', () => {
      this.set('movie', {
        title: '',
        description: '',
        rating: 0,
      });
    });

    this.set('movie', {
      title: '',
      description: '',
      rating: 0,
    });

    firebaseService.addMovie = async (movie) => {
      assert.deepEqual(
        movie,
        {
          title: 'Inception',
          description: 'A mind-bending thriller',
          rating: 4.5,
        },
        'addMovie was called with the correct movie object',
      );
    };

    await render(
      hbs`<AddMovieForm @movie={{this.movie}} @loadMovies={{this.loadMovies}} @reset={{this.reset}} />`,
    );

    // Fill in the inputs
    await fillIn('.form-title', 'Inception');
    await fillIn('.form-description', 'A mind-bending thriller');
    await fillIn('.slider', '4.5');

    // Click the add button
    await click('.add-button');

    // Assert inputs are cleared after submission
    assert
      .dom('.form-title')
      .hasValue('', 'Title input is cleared after submission');
    assert
      .dom('.form-description')
      .hasValue('', 'Description input is cleared after submission');
    assert
      .dom('.slider')
      .hasValue('0', 'Rating input is reset after submission');
    assert.dom('.error-message').doesNotExist('No error message is displayed');
  });

  test('it updates a movie and keeps input fields populated on successful submission', async function (assert) {
    const firebaseService = this.owner.lookup('service:firebase');

    this.set('loadMovies', () => {
      assert.ok(true, 'loadMovies was called');
    });

    this.set('reset', () => {
      assert.ok(true, 'reset was called');
    });

    // Mock a movie object
    this.set('movie', {
      id: '123',
      title: 'Original Title',
      description: 'Original Description',
      rating: 3.0,
    });

    firebaseService.updateMovie = async (id, movie) => {
      assert.strictEqual(
        id,
        '123',
        'updateMovie was called with the correct movie ID',
      );
      assert.deepEqual(
        movie,
        {
          title: 'Updated Title',
          description: 'Updated Description',
          rating: 4.0,
        },
        'updateMovie was called with the correct movie data',
      );
    };

    await render(
      hbs`<AddMovieForm 
        @movie={{this.movie}} 
        @loadMovies={{this.loadMovies}} 
        @reset={{this.reset}} 
        @editMode={{true}} 
      />`,
    );

    // Fill in updated inputs
    await fillIn('.form-title', 'Updated Title');
    await fillIn('.form-description', 'Updated Description');
    await fillIn('.slider', '4');

    // Click the update button
    await click('.update-button');

    // Assert that inputs remain populated after submission
    assert
      .dom('.form-title')
      .hasValue('Updated Title', 'Title input remains populated');
    assert
      .dom('.form-description')
      .hasValue('Updated Description', 'Description input remains populated');
    assert
      .dom('.slider')
      .hasValue('4', 'Rating input remains populated as a number'); // Adjusted to check for `4` instead of `4.0`
    assert.dom('.error-message').doesNotExist('No error message is displayed');
  });

  test('it deletes a movie and resets the form', async function (assert) {
    const firebaseService = this.owner.lookup('service:firebase');

    this.set('loadMovies', () => {
      assert.ok(true, 'loadMovies was called');
    });

    this.set('reset', () => {
      this.set('movie', {
        title: '',
        description: '',
        rating: 0,
      });
    });

    // Mock a movie object
    this.set('movie', {
      id: '123',
      title: 'Original Title',
      description: 'Original Description',
      rating: 3.0,
    });

    firebaseService.deleteMovie = async (id) => {
      assert.strictEqual(
        id,
        '123',
        'deleteMovie was called with the correct movie ID',
      );
    };

    await render(
      hbs`<AddMovieForm 
        @movie={{this.movie}} 
        @loadMovies={{this.loadMovies}} 
        @reset={{this.reset}} 
        @editMode={{true}} 
      />`,
    );

    // Click the delete button
    await click('.delete-button');

    // Assert that inputs are cleared after deletion
    assert
      .dom('.form-title')
      .hasValue('', 'Title input is cleared after deletion');
    assert
      .dom('.form-description')
      .hasValue('', 'Description input is cleared after deletion');
    assert.dom('.slider').hasValue('0', 'Rating input is reset after deletion');

    // Assert no error message
    assert.dom('.error-message').doesNotExist('No error message is displayed');
  });

  test('it displays an error message on failed submission', async function (assert) {
    const firebaseService = this.owner.lookup('service:firebase');

    this.set('loadMovies', () => {
      assert.ok(true, 'loadMovies was called');
    });

    // Mock a movie object
    this.set('movie', {
      title: '',
      description: '',
      rating: 0,
    });

    firebaseService.addMovie = async () => {
      throw new Error('Failed to add movie');
    };

    await render(
      hbs`<AddMovieForm 
        @loadMovies={{this.loadMovies}} 
        @movie={{this.movie}} 
      />`,
    );

    // Fill in the inputs
    await fillIn('.form-title', 'Inception');
    await fillIn('.form-description', 'A mind-bending thriller');
    await fillIn('.slider', '4.5');

    // Click the add button
    await click('.add-button');

    // Assert that the error message is displayed
    assert.dom('.error-message').exists();
    assert
      .dom('.error-message')
      .hasText('Failed to add movie', 'Displays the correct error message');
  });
});
