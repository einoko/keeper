import React, { Component } from "react";
import { Button, Modal, Menu, Form, Checkbox, Input } from "semantic-ui-react";
import isUrl from "is-url-superb";
import bookmarkService from "../services/Bookmarks";

export default class NewBookmark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      url: "",
      title: "",
      tags: [],
      archived: false
    };
  }

  fetchTitle = url => {
    const input = document.getElementById("siteTitleField");

    if (isUrl(url)) {
      input.placeholder = "Fetching title...";
      bookmarkService
        .getURL({ url: url })
        .then(response => {
          if (response.title !== "Error") {
            input.value = response.title;
            this.setState({ title: response.title });
          } else {
            input.placeholder = "Could not fetch URL title";
          }
        })
        .catch(() => {
          input.placeholder = "Could not fetch URL title";
        });
    } else {
      input.placeholder = "Not a valid URL";
    }
  };

  handleURLChange = e => {
    this.setState({ url: e.target.value });
    this.fetchTitle(e.target.value);
  };

  handleTitleChange = e => this.setState({ title: e.target.value });
  handleTagsChange = e => this.setState({ tags: e.target.value });
  handleTypeChange = () => this.setState({ archived: !this.state.archived });
  handleOpen = () => this.setState({ modalOpen: true });
  handleClose = () => this.setState({ modalOpen: false });

  exportClose = () => {
    return () => {
      this.handleClose();
    };
  };

  emptyStates = () => {
    return () => {
      this.setState({
        url: "",
        title: "",
        tags: [],
        archived: false
      });
    };
  };

  addBookmark = event => {
    event.preventDefault();

    const bookmarkObject = {
      url: this.state.url,
      title: this.state.title,
      tags:
        this.state.tags.length > 0
          ? this.state.tags.split(",").map(tag => {
              return { name: tag.trim() };
            })
          : [],
      type: this.state.archived ? "archive" : "bookmark"
    };

    if (this.state.archived) {
      document.getElementById("newBookmarkSubmit").innerText = "Archiving...";
    }

    this.props.newBookmark(
      bookmarkObject,
      this.exportClose(),
      this.emptyStates()
    );
  };

  render() {
    const { modalOpen, url, title, tags, archived } = this.state;

    return (
      <Modal
        trigger={<Menu.Item onClick={this.handleOpen}>New Bookmark</Menu.Item>}
        open={modalOpen}
        onClose={this.handleClose}
      >
        <Modal.Header>Create a new bookmark</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form onSubmit={this.addBookmark}>
              <Form.Field>
                <label>URL</label>
                <input
                  placeholder="Site URL"
                  value={url}
                  onChange={this.handleURLChange}
                />
              </Form.Field>
              <Form.Field>
                <label>Bookmark title</label>
                <Input
                  id="siteTitleField"
                  placeholder="Bookmark title"
                  value={title}
                  onChange={this.handleTitleChange}
                />
              </Form.Field>
              <Form.Field>
                <label>Tags</label>
                <input
                  placeholder="Enter tags separated by a comma"
                  value={tags}
                  onChange={this.handleTagsChange}
                />
              </Form.Field>
              <Form.Field>
                <Checkbox
                  label="Archive"
                  checked={archived}
                  onClick={this.handleTypeChange}
                />
              </Form.Field>
              <div className="formButtonsWrapper">
                <Button
                  floated="left"
                  primary
                  id="newBookmarkSubmit"
                  type="submit"
                >
                  Create
                </Button>
                <Button
                  floated="right"
                  secondary
                  type="button"
                  onClick={this.handleClose}
                >
                  Close
                </Button>
              </div>
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}
