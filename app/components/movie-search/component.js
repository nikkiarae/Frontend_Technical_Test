import Component from '@glimmer/component';
import podNames from 'ember-component-css/pod-names';
import { action } from '@ember/object';

export default class MovieSearch extends Component {
  styleNamespace = podNames['movie-search'];

  // Action: triggers onSearch when text changes
  @action
  handleSearch(event) {
    const searchText = event.target.value;
    this.args.onSearch(searchText);
  }
}
