import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | AddMovieForm', function (hooks) {
  setupRenderingTest(hooks);

  /**
   * ✅ Test: Ensures that the form contains the correct elements.
   *
   * **Scenario:**
   * 1. Renders the `AddMovieForm` component.
   * 2. Asserts that all labels (Title, Description, Rating) are present.
   * 3. Checks that there are text inputs for title and description.
   * 4. Ensures a rating slider exists.
   * 5. Verifies that the "Add Movie" button is rendered.
   * 6. Confirms that no error messages appear initially.
   */
  test('it contains the right elements', async function (assert) {
    await render(hbs`<AddMovieForm />`);

    assert.dom('label').exists({ count: 3 }, 'The form contains three labels');
    assert.dom('[data-test-title-label]').exists().containsText('Title');
    assert
      .dom('[data-test-description-label]')
      .exists()
      .containsText('Description');
    assert.dom('[data-test-rating-label]').exists().containsText('Rating');
    assert
      .dom('input[type="text"]')
      .exists({ count: 2 }, 'There are two text inputs');
    assert
      .dom('input[type="range"]')
      .exists({ count: 1 }, 'There is one rating slider');
    assert.dom('button').hasText('Add Movie', 'Button is labeled correctly');
    assert
      .dom('.error-message')
      .doesNotExist('No error message is displayed initially');
  });

  /**
   * ✅ Test: Adds a movie and clears the input fields upon successful submission.
   *
   * **Scenario:**
   * 1. Mocks the `addMovie` function from Firebase.
   * 2. Renders the `AddMovieForm` with empty fields.
   * 3. Inputs a title, description, and rating.
   * 4. Clicks "Add Movie".
   * 5. Ensures the form resets (inputs are cleared).
   */
  test('it adds a movie and clears the input fields on successful submission', async function (assert) {
    const firebaseService = this.owner.lookup('service:firebase');

    this.set('loadMovies', () => {
      assert.ok(true, 'loadMovies was called');
    });

    this.set('reset', () => {
      this.set('movie', { title: '', description: '', rating: 0 });
    });

    this.set('movie', { title: '', description: '', rating: 0 });

    firebaseService.addMovie = async (movie) => {
      assert.deepEqual(
        movie,
        {
          title: 'Inception',
          description: 'A mind-bending thriller',
          rating: 4.5,
        },
        'addMovie was called with the correct data',
      );
    };

    await render(
      hbs`<AddMovieForm @movie={{this.movie}} @loadMovies={{this.loadMovies}} @reset={{this.reset}} />`,
    );

    await fillIn('.form-title', 'Inception');
    await fillIn('.form-description', 'A mind-bending thriller');
    await fillIn('.slider', '4.5');
    await click('.add-button');

    assert.dom('.form-title').hasValue('', 'Title input is cleared');
    assert
      .dom('.form-description')
      .hasValue('', 'Description input is cleared');
    assert.dom('.slider').hasValue('0', 'Rating input is reset');
  });

  /**
   * ✅ Test: Updates an existing movie and keeps the input fields populated.
   *
   * **Scenario:**
   * 1. Sets an existing movie in `editMode`.
   * 2. Updates the title, description, and rating.
   * 3. Clicks "Update Movie".
   * 4. Ensures the updated values persist.
   */
  test('it updates a movie and keeps input fields populated on successful submission', async function (assert) {
    const firebaseService = this.owner.lookup('service:firebase');

    this.set('loadMovies', () => assert.ok(true, 'loadMovies was called'));

    this.set('reset', () => assert.ok(true, 'reset was called'));

    this.set('movie', {
      id: '123',
      title: 'Original Title',
      description: 'Original Description',
      rating: 3.0,
    });

    firebaseService.updateMovie = async (id, movie) => {
      assert.strictEqual(id, '123', 'updateMovie was called with correct ID');
      assert.deepEqual(
        movie,
        {
          title: 'Updated Title',
          description: 'Updated Description',
          rating: 4.0,
        },
        'updateMovie was called with updated data',
      );
    };

    await render(
      hbs`<AddMovieForm @movie={{this.movie}} @loadMovies={{this.loadMovies}} @reset={{this.reset}} @editMode={{true}} />`,
    );

    await fillIn('.form-title', 'Updated Title');
    await fillIn('.form-description', 'Updated Description');
    await fillIn('.slider', '4');
    await click('.update-button');

    assert
      .dom('.form-title')
      .hasValue('Updated Title', 'Title remains populated');
    assert
      .dom('.form-description')
      .hasValue('Updated Description', 'Description remains populated');
    assert.dom('.slider').hasValue('4', 'Rating remains populated');
  });

  /**
   * ✅ Test: Deletes a movie and resets the form.
   *
   * **Scenario:**
   * 1. Sets an existing movie in `editMode`.
   * 2. Clicks "Delete Movie".
   * 3. Ensures all input fields are reset.
   */
  test('it deletes a movie and resets the form', async function (assert) {
    const firebaseService = this.owner.lookup('service:firebase');

    this.set('loadMovies', () => assert.ok(true, 'loadMovies was called'));

    this.set('reset', () => {
      this.set('movie', { title: '', description: '', rating: 0 });
    });

    this.set('movie', {
      id: '123',
      title: 'Original Title',
      description: 'Original Description',
      rating: 3.0,
    });

    firebaseService.deleteMovie = async (id) => {
      assert.strictEqual(id, '123', 'deleteMovie was called with correct ID');
    };

    await render(
      hbs`<AddMovieForm @movie={{this.movie}} @loadMovies={{this.loadMovies}} @reset={{this.reset}} @editMode={{true}} />`,
    );

    await click('.delete-button');

    assert.dom('.form-title').hasValue('', 'Title is cleared');
    assert.dom('.form-description').hasValue('', 'Description is cleared');
    assert.dom('.slider').hasValue('0', 'Rating is reset');
  });

  /**
   * ✅ Test: Displays an error message when movie submission fails.
   *
   * **Scenario:**
   * 1. Mocks `addMovie` to throw an error.
   * 2. Fills in a movie title, description, and rating.
   * 3. Clicks "Add Movie".
   * 4. Ensures the error message is displayed.
   */
  test('it displays an error message on failed submission', async function (assert) {
    const firebaseService = this.owner.lookup('service:firebase');

    this.set('loadMovies', () => assert.ok(true, 'loadMovies was called'));

    this.set('movie', { title: '', description: '', rating: 0 });

    firebaseService.addMovie = async () => {
      throw new Error('Failed to add movie');
    };

    await render(
      hbs`<AddMovieForm @loadMovies={{this.loadMovies}} @movie={{this.movie}} />`,
    );

    await fillIn('.form-title', 'Inception');
    await fillIn('.form-description', 'A mind-bending thriller');
    await fillIn('.slider', '4.5');
    await click('.add-button');

    assert.dom('.error-message').exists();
    assert
      .dom('.error-message')
      .hasText('Failed to add movie', 'Displays the correct error message');
  });
});
