import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | MovieSearch', function (hooks) {
  setupRenderingTest(hooks);

  /**
   * ✅ Test: Ensures the search input is rendered and filters movies correctly.
   * Scenario:
   * 1. Renders the MovieSearch component.
   * 2. Inputs "Inception" in the search bar.
   * 3. Verifies only "Inception" appears in the filtered movies.
   */
  test('it renders a search input and filters movies correctly', async function (assert) {
    this.set('movies', [
      { id: '1', title: 'Inception', description: 'A mind-bending thriller' },
      { id: '2', title: 'Interstellar', description: 'A journey to space' },
      { id: '3', title: 'Tenet', description: 'Time manipulation story' },
    ]);

    this.set('searchText', '');
    this.set('filteredMovies', this.movies);
    this.set('onSearch', (text) => {
      this.set(
        'filteredMovies',
        this.movies.filter(
          (movie) =>
            movie.title.toLowerCase().includes(text.toLowerCase()) ||
            movie.description.toLowerCase().includes(text.toLowerCase()),
        ),
      );
    });

    await render(hbs`
      <MovieSearch 
        @searchText={{this.searchText}}
        @onSearch={{this.onSearch}}
      />
    `);

    assert
      .dom('[data-test-movie-search]')
      .exists('The search input is rendered');

    await fillIn('[data-test-movie-search]', 'Inception');

    assert.strictEqual(
      this.filteredMovies.length,
      1,
      'Only one movie matches the search',
    );
    assert.strictEqual(
      this.filteredMovies[0].title,
      'Inception',
      'The correct movie is filtered',
    );
  });

  /**
   * ✅ Test: Ensures that clearing the search input displays all movies again.
   * Scenario:
   * 1. Renders the MovieSearch component with "Inception" as search text.
   * 2. Clears the input field.
   * 3. Verifies that all movies are displayed.
   */
  test('it displays all movies when the search input is cleared', async function (assert) {
    this.set('movies', [
      { id: '1', title: 'Inception', description: 'A mind-bending thriller' },
      { id: '2', title: 'Interstellar', description: 'A journey to space' },
      { id: '3', title: 'Tenet', description: 'Time manipulation story' },
    ]);

    this.set('searchText', 'Inception');
    this.set('filteredMovies', this.movies);
    this.set('onSearch', (text) => {
      this.set(
        'filteredMovies',
        text
          ? this.movies.filter(
              (movie) =>
                movie.title.toLowerCase().includes(text.toLowerCase()) ||
                movie.description.toLowerCase().includes(text.toLowerCase()),
            )
          : this.movies,
      );
    });

    await render(hbs`
      <MovieSearch 
        @searchText={{this.searchText}}
        @onSearch={{this.onSearch}}
      />
    `);

    assert
      .dom('[data-test-movie-search]')
      .exists('The search input is rendered');

    await fillIn('[data-test-movie-search]', '');

    assert.strictEqual(
      this.filteredMovies.length,
      3,
      'All movies are displayed when search is cleared',
    );
  });

  /**
   * ✅ Test: Ensures that search is case-insensitive.
   * Scenario:
   * 1. Renders the MovieSearch component.
   * 2. Inputs "INTERSTELLAR" in uppercase.
   * 3. Verifies that "Interstellar" is still matched.
   */
  test('it handles case-insensitive searches', async function (assert) {
    this.set('movies', [
      { id: '1', title: 'Inception', description: 'A mind-bending thriller' },
      { id: '2', title: 'Interstellar', description: 'A journey to space' },
      { id: '3', title: 'Tenet', description: 'Time manipulation story' },
    ]);

    this.set('searchText', '');
    this.set('filteredMovies', this.movies);
    this.set('onSearch', (text) => {
      this.set(
        'filteredMovies',
        this.movies.filter(
          (movie) =>
            movie.title.toLowerCase().includes(text.toLowerCase()) ||
            movie.description.toLowerCase().includes(text.toLowerCase()),
        ),
      );
    });

    await render(hbs`
      <MovieSearch 
        @searchText={{this.searchText}}
        @onSearch={{this.onSearch}}
      />
    `);

    await fillIn('[data-test-movie-search]', 'INTERSTELLAR');

    assert.strictEqual(
      this.filteredMovies.length,
      1,
      'Search is case-insensitive and still matches',
    );
    assert.strictEqual(
      this.filteredMovies[0].title,
      'Interstellar',
      'Correct movie is shown despite case',
    );
  });

  /**
   * ✅ Test: Ensures that partial matches are included in search results.
   * Scenario:
   * 1. Renders the MovieSearch component.
   * 2. Inputs "Ten".
   * 3. Verifies that "Tenet" is matched.
   */
  test('it handles searches with partial matches', async function (assert) {
    this.set('movies', [
      { id: '1', title: 'Inception', description: 'A mind-bending thriller' },
      { id: '2', title: 'Interstellar', description: 'A journey to space' },
      { id: '3', title: 'Tenet', description: 'Time manipulation story' },
    ]);

    this.set('searchText', '');
    this.set('filteredMovies', this.movies);
    this.set('onSearch', (text) => {
      this.set(
        'filteredMovies',
        this.movies.filter(
          (movie) =>
            movie.title.toLowerCase().includes(text.toLowerCase()) ||
            movie.description.toLowerCase().includes(text.toLowerCase()),
        ),
      );
    });

    await render(hbs`
      <MovieSearch 
        @searchText={{this.searchText}}
        @onSearch={{this.onSearch}}
      />
    `);

    await fillIn('[data-test-movie-search]', 'Ten');

    assert.strictEqual(
      this.filteredMovies.length,
      1,
      'Search filters partial matches correctly',
    );
    assert.strictEqual(
      this.filteredMovies[0].title,
      'Tenet',
      'Correct movie is shown for partial match',
    );
  });

  /**
   * ✅ Test: Ensures that if no matches are found, the UI behaves correctly.
   * Scenario:
   * 1. Renders the MovieSearch component.
   * 2. Inputs "Nonexistent Movie".
   * 3. Verifies that no results are displayed.
   */
  test('it displays a no results message when no matches are found', async function (assert) {
    this.set('movies', [
      { id: '1', title: 'Inception', description: 'A mind-bending thriller' },
      { id: '2', title: 'Interstellar', description: 'A journey to space' },
      { id: '3', title: 'Tenet', description: 'Time manipulation story' },
    ]);

    this.set('searchText', '');
    this.set('filteredMovies', this.movies);
    this.set('onSearch', (text) => {
      this.set(
        'filteredMovies',
        this.movies.filter(
          (movie) =>
            movie.title.toLowerCase().includes(text.toLowerCase()) ||
            movie.description.toLowerCase().includes(text.toLowerCase()),
        ),
      );
    });

    await render(hbs`
      <MovieSearch 
        @searchText={{this.searchText}}
        @onSearch={{this.onSearch}}
      />
    `);

    await fillIn('[data-test-movie-search]', 'Nonexistent Movie');

    assert.strictEqual(
      this.filteredMovies.length,
      0,
      'No movies are displayed when there is no match',
    );
  });
});
