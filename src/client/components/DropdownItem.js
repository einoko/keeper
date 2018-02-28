import React, { Component } from "react";
import {
  Item,
  Label,
  Dropdown,
  Modal,
  Form,
  Checkbox,
  Button
} from "semantic-ui-react";
import copy from "copy-to-clipboard";

export default class DropdownItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      id: this.props.bookmark.id,
      url: this.props.bookmark.url,
      title: this.props.bookmark.title,
      tags: this.props.bookmark.tags.map(tag => tag.name).join(","),
      archived: this.props.bookmark.type === "archive"
    };
  }

  handleOpen = () => this.setState({ modalOpen: true });
  handleClose = () => this.setState({ modalOpen: false });
  handleURLChange = e => this.setState({ url: e.target.value });
  handleTitleChange = e => this.setState({ title: e.target.value });
  handleTagsChange = e => this.setState({ tags: e.target.value });
  handleTypeChange = () => this.setState({ archived: !this.state.archived });

  exportClose = () => {
    return () => {
      this.handleClose();
    };
  };

  handleClick = (e, { name }) => {
    switch (name) {
      case "copy":
        copy(this.props.bookmark.url);
        break;
      case "edit":
        this.handleOpen();
        break;
      case "delete":
        this.initDelete();
        break;
    }
  };

  editBookmark = event => {
    event.preventDefault();

    const bookmarkObject = {
      id: this.state.id,
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

    this.props.editBookmark(bookmarkObject, this.exportClose());
  };

  initDelete = () => {
    this.props.deleteBookmark(this.state.id);
  };

  render() {
    const { modalOpen, url, title, tags, archived } = this.state;

    return (
      <Dropdown icon="ellipsis vertical">
        <Dropdown.Menu>
          <Dropdown.Item
            icon="copy"
            name="copy"
            text="Copy URL"
            onClick={this.handleClick}
          />
          <Dropdown.Item
            icon="edit"
            name="edit"
            text="Edit"
            onClick={this.handleClick}
          />

          <Modal open={modalOpen} onClose={this.handleClose}>
            <Modal.Header>
              Edit bookmark “{this.props.bookmark.title}”
            </Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Form onSubmit={this.editBookmark}>
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
                    <input
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
                      id="editType"
                      label="Archive"
                      checked={archived}
                      onClick={this.handleTypeChange}
                    />
                  </Form.Field>
                  <div className="formButtonsWrapper">
                    <Button floated="left" primary type="submit">
                      Update
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

          <Dropdown.Item
            icon="delete"
            name="delete"
            text="Delete"
            onClick={this.handleClick}
          />
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
