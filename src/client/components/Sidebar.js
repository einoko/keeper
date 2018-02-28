import React, { Component } from "react";
import { Input, Container, Divider, Dropdown } from "semantic-ui-react";
import TagView from './TagView';

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      searchType: "titles",
    };
  }

  handleClick = (e, {value}) => {
    this.setState({searchType: value});
  };

  handleSearch = (e, { value }) => {
    this.props.performSearch(e, this.state.searchType);
    this.setState({ search: value });
  };

  render() {
    const { search } = this.state;

    const searchOptions = [
      { key: "titles", text: "Titles", value: "titles", onClick: this.handleClick },
      { key: "tags", text: "Tags", value: "tags", onClick: this.handleClick },
      { key: "URLs", text: "URLs", value: "URLs", onClick: this.handleClick }
    ];

    return (
      <div className="sidebar">
        <Container>
          <Divider horizontal>search</Divider>
          <Input
            action={
              <Dropdown
                button
                basic
                floating
                options={searchOptions}
                value={this.state.searchType} />
            }
            value={search}
            onChange={this.handleSearch}
            icon="search"
            iconPosition="left"
            placeholder="Search in..."
          />
        </Container>
        <Container>
          <div className="tagviewWrapper">
            <Divider horizontal>tags</Divider>
            <TagView tags={this.props.tags} />
          </div>
        </Container>
      </div>
    );
  }
}
