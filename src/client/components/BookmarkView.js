import React, { Component } from "react";
import { Item, Label, Icon, Popup } from "semantic-ui-react";
import DropdownItem from "./DropdownItem";
import extractDomain from "extract-domain";
import moment from "moment/moment";

const Tag = ({ tag }) => {
  return <Label size="small">{tag.name}</Label>;
};

const Tags = ({ tags }) => {
  return <span>{tags.map((tag, i) => <Tag key={i} tag={tag} />)}</span>;
};

const Bookmark = ({ bookmark, editBookmark, deleteBookmark, handleClick }) => {
  return (
    <Item>
      <Item.Content>
        <div className="ui right floated">
          <DropdownItem
            bookmark={bookmark}
            editBookmark={editBookmark}
            deleteBookmark={deleteBookmark}
          />
        </div>
        <Item.Header
          className="bookmarkLink"
          as="a"
          onClick={handleClick(bookmark)}
          value={bookmark.id}
          target="_blank"
          href={bookmark.path ? bookmark.path + "/index.html" : bookmark.url}
        >
          {bookmark.title}
        </Item.Header>
        <Item.Meta>
          <span className="bookmarkDate">
            {moment(bookmark.date).format("LL")}
          </span>
          {bookmark.unread && (
            <Popup
              trigger={<Icon name="book" />}
              content="Unread"
              size="mini"
            />
          )}
          {bookmark.type === 'archive' && (
            <Popup
              trigger={<Icon name="archive" />}
              content="Archived"
              size="mini"
            />
          )}
        </Item.Meta>
        <Item.Extra>
          <Tags tags={bookmark.tags} />
          <div className="ui right floated">
            <a
              href={"//" + extractDomain(bookmark.url)}
              target="_blank"
              className="bookmarkURL"
            >
              {extractDomain(bookmark.url)}
            </a>
          </div>
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};

export default class BookmarkView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick = bookmark => {
    return () => {
      if (bookmark.unread) {
        this.props.changeArticleToRead(bookmark);
      }
    };
  };

  render() {
    return (
      <div className="bookmarkView">
        <Item.Group divided>
          {this.props.bookmarks.length === 0 &&
          <h4 id='noBookmarks'>No bookmarks</h4>}
          {this.props.bookmarks.map(bookmark => (
            <Bookmark
              key={bookmark.id}
              bookmark={bookmark}
              handleClick={this.handleClick}
              editBookmark={this.props.editBookmark}
              deleteBookmark={this.props.deleteBookmark}
            />
          ))}
        </Item.Group>
      </div>
    );
  }
}
