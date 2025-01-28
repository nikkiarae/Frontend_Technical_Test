import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | MovieListItem', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the correct movie data', async function (assert) {
    this.movie = {
      title: 'Inception',
      description: 'A mind-bending thriller about dreams within dreams.',
      rating: 4.5,
    };

    this.onSelectMovie = () => {};

    await render(hbs`<MovieList::MovieListItem 
      @movie={{this.movie}} 
      @onSelectMovie={{this.onSelectMovie}} 
    />`);

    // Assert the root element exists
    assert.dom('[data-test-movie-item]').exists('The movie item is rendered');

    // Assert title
    assert
      .dom('[data-test-movie-title]')
      .hasText('Inception', 'The movie title is rendered correctly');

    // Assert rating
    assert
      .dom('[data-test-movie-rating]')
      .hasText('4.5 / 5', 'The movie rating is rendered correctly');

    // Assert description
    assert
      .dom('[data-test-movie-description]')
      .hasText(
        'A mind-bending thriller about dreams within dreams.',
        'The movie description is rendered correctly',
      );
  });
});
