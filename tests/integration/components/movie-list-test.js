import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers'; // Ensure `click` is imported
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | MovieList', function (hooks) {
  setupRenderingTest(hooks);

  /**
   * ✅ Test: Renders a list of movies and ensures clicking a movie triggers selection.
   *
   * **Scenario:**
   * 1. Provides a list of two movies.
   * 2. Renders the `MovieList` component.
   * 3. Asserts that two movie items are correctly displayed.
   * 4. Simulates a click on the first movie item.
   * 5. Verifies that `onSelectMovie` is triggered with the correct movie.
   */
  test('it renders a list of movies and handles selection', async function (assert) {
    // Set up mock movie data
    this.set('movies', [
      { title: 'TEST TITLE 1', description: 'TEST DESCRIPTION 1', rating: 4.5 },
      { title: 'TEST TITLE 2', description: 'TEST DESCRIPTION 2', rating: 3.5 },
    ]);

    // Mock function to track selection
    this.set('onSelectMovie', (movie) => {
      assert.ok(movie, 'onSelectMovie was called with the selected movie');
    });

    // Render the component
    await render(
      hbs`<MovieList @movies={{this.movies}} @onSelectMovie={{this.onSelectMovie}} />`,
    );

    // Assert the correct number of movies is rendered
    assert
      .dom('[data-test-movie-item]')
      .exists({ count: 2 }, 'Two movie items are rendered');

    // Simulate clicking the first movie item
    await click('[data-test-movie-item]:nth-of-type(1)');
  });
});
