import React, { Component } from "react";

export default class TagView extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return(
      <div>
        {this.props.tags.map((tag, i) => <p key={i}>{tag.name}</p>)}
      </div>
    )
  }
}