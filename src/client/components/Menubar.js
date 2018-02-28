import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import NewBookmark from "./NewBookmark";

export default class Menubar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: ""
    };
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <div className="menubarWrapper">
        <Menu className="contentWrapper" stackable secondary>
          <Menu.Menu position="left">
            <Menu.Item>
              <img id="keeperLogo" src="/public/assets/keeper_logo.svg" />
            </Menu.Item>
          </Menu.Menu>
          <Menu.Menu position="right">
            <NewBookmark newBookmark={this.props.newBookmark} />
            <Menu.Item
              name="Settings"
              active={activeItem === "messages"}
              onClick={this.handleItemClick}
            />
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}
