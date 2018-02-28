import React, { Component } from "react";
import bookmarkService from "../services/Bookmarks";
import _ from "lodash";
import {
  Segment,
  Grid,
  Divider,
  Dropdown,
  Button,
  Icon
} from "semantic-ui-react";
import Menubar from "./Menubar";
import BookmarkView from "./BookmarkView";
import Sidebar from "./Sidebar";

const Controls = ({
  bookmarks,
  pageInfo,
  handleClick,
  handleButtonClick,
  currentPage,
  maxPage
}) => {
  const sortOptions = [
    {
      text: "Newest",
      value: "newest"
    },
    {
      text: "Oldest",
      value: "oldest"
    }
  ];

  const filterOptions = [
    {
      text: "All",
      value: "all"
    },
    {
      text: "Unread",
      value: "unread"
    },
    {
      text: "Archived only",
      value: "archivedOnly"
    },
    {
      text: "Bookmarked only",
      value: "bookmarkedOnly"
    },
    {
      text: "Without tags",
      value: "withoutTags"
    }
  ];

  this.handleButton = (e, { value }) => {
    switch (value) {
      case "previous":
        if (currentPage > 1) {
          handleButtonClick(value);
        }
        break;
      case "next":
        if (currentPage > 0 && currentPage < maxPage) {
          handleButtonClick(value);
        }
        break;
    }
  };

  return (
    <div>
      <Segment vertical>
        <div>
          <Dropdown
            onChange={handleClick}
            id="sortDropdown"
            placeholder="Sort by"
            selection
            options={sortOptions}
          />
          <Dropdown
            onChange={handleClick}
            id="filterDropdown"
            placeholder="Filter by"
            selection
            options={filterOptions}
          />
        </div>
        <div>
          <Segment vertical id="pageButtonsWrapper">
            <Button
              floated="left"
              value="previous"
              icon
              onClick={this.handleButton}
            >
              <Icon name="chevron left" />
            </Button>
            <Divider id="pageButtonDivider" vertical>
              {pageInfo}
            </Divider>
            <Button
              floated="right"
              value="next"
              icon
              onClick={this.handleButton}
            >
              <Icon name="chevron right" />
            </Button>
          </Segment>
        </div>
      </Segment>
      <Divider horizontal />
    </div>
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmarks: [],
      showAll: true,
      search: "",
      page: 1,
      filter: "",
      searchType: "titles",
      tags: [],
    };
  }

  tagClickHandler = tag => {
    return () => {
      console.log(tag);
      bookmarkService.getByTag(tag).then(response => {
        console.log(response);
        response = _.sortBy(response, [
          function(o) {
            return o.date;
          }
        ]).reverse();
        this.setState({ bookmarks: response });
      });
    };
  };

  componentDidMount() {
    bookmarkService.getAll().then(response => {
      response = _.sortBy(response, [
        function(o) {
          return o.date;
        }
      ]).reverse();
      let tags = [];
      response.forEach(bookmark => {
        bookmark.tags.forEach(tag => tags.push({ name: tag.name.trim() }));
      });
      tags = _.uniqBy(tags, "name");
      this.setState({
        bookmarks: response,
        tags: tags
      });
    });
  }

  newBookmark = (bookmarkObject, exportClose, emptyStates) => {
    bookmarkService
      .createBookmark(bookmarkObject)
      .then(newBookmark => {
        this.setState({
          bookmarks: _.sortBy(this.state.bookmarks.concat(newBookmark), [
            function(o) {
              return o.date;
            }
          ]).reverse()
        });
        emptyStates();
        exportClose();
      })
      .catch(error => console.log(error));
  };

  editBookmark = (bookmarkObject, exportClose) => {
    bookmarkService
      .editBookmark(bookmarkObject, bookmarkObject.id)
      .then(newBookmark => {
        const updatedBookmarks = this.state.bookmarks;
        updatedBookmarks.splice(
          _.findIndex(updatedBookmarks, { id: newBookmark.id }),
          1,
          newBookmark
        );

        this.setState({
          bookmarks: _.sortBy(updatedBookmarks, [
            function(o) {
              return o.date;
            }
          ]).reverse()
        });
        exportClose();
      })
      .catch(error => console.log(error));
  };

  deleteBookmark = id => {
    bookmarkService
      .deleteBookmark(id)
      .then(() => {
        const updatedBookmarks = this.state.bookmarks;
        _.remove(updatedBookmarks, { id: id });
        this.setState({
          bookmarks: updatedBookmarks
        });
      })
      .catch(error => console.log(error));
  };

  performSearch = (event, searchType) => {
    if (event.target.value.length > 0) {
      this.setState({
        search: event.target.value,
        searchType: searchType,
        showAll: false
      });
    } else {
      this.setState({
        search: "",
        showAll: true
      });
    }
  };

  handleClick = (event, { value }) => {
    const bookmarks = this.state.bookmarks;
    switch (value) {
      case "newest":
        this.setState({
          bookmarks: _.sortBy(bookmarks, [
            function(o) {
              return o.date;
            }
          ]).reverse()
        });
        break;
      case "oldest":
        this.setState({
          bookmarks: _.sortBy(bookmarks, [
            function(o) {
              return o.date;
            }
          ])
        });
        break;
      case "all":
        this.setState({ filter: "" });
        break;
      default:
        this.setState({ filter: value });
        break;
    }
  };

  handleButtonClick = (event, { value }) => {
    let page = this.state.page;
    switch (value) {
      case "previous":
        this.setState({ page: page - 1 });
        break;
      case "next":
        this.setState({ page: page + 1 });
        break;
    }
  };

  changeArticleToRead = bookmarkObject => {
    bookmarkObject.unread = false;
    bookmarkService
      .setToRead(bookmarkObject, bookmarkObject.id)
      .then(newBookmark => {
        const updatedBookmarks = this.state.bookmarks;
        updatedBookmarks.splice(
          _.findIndex(updatedBookmarks, { id: newBookmark.id }),
          1,
          newBookmark
        );

        this.setState({
          bookmarks: _.sortBy(updatedBookmarks, [
            function(o) {
              return o.date;
            }
          ]).reverse()
        });
      })
      .catch(error => console.log(error));
  };

  render() {
    const bookmarksPerPage = 10;
    const pageIndex = (this.state.page - 1) * bookmarksPerPage;

    // Filter based on search
    /*const bookmarksToSearch = this.state.showAll
      ? this.state.bookmarks
      : this.state.bookmarks.filter(bookmark =>
          bookmark.title.toLowerCase().includes(this.state.search.toLowerCase())
        );*/
    let bookmarksToSearch = this.state.bookmarks;

    // Apply search if needed
    if (!this.state.showAll) {
      switch (this.state.searchType) {
        case "titles":
          bookmarksToSearch = bookmarksToSearch.filter(bookmark =>
            bookmark.title
              .toLowerCase()
              .includes(this.state.search.toLowerCase())
          );
          break;
        case "tags":
          bookmarksToSearch = bookmarksToSearch.filter(bookmark =>
            _.some(
              bookmark.tags.map(tag =>
                tag.name.toLowerCase().includes(this.state.search.toLowerCase())
              )
            )
          );
          break;
        case "URLs":
          bookmarksToSearch = bookmarksToSearch.filter(bookmark =>
            bookmark.url.toLowerCase().includes(this.state.search.toLowerCase())
          );
          break;
      }
    }

    let bookmarksToShow = bookmarksToSearch;

    // Apply dropdown filtering
    const filter = this.state.filter;
    switch (filter) {
      case "":
        break;
      case "unread":
        bookmarksToShow = bookmarksToShow.filter(
          bookmark => bookmark.unread === true
        );
        break;
      case "archivedOnly":
        bookmarksToShow = bookmarksToShow.filter(
          bookmark => bookmark.type === "archive"
        );
        break;
      case "bookmarkedOnly":
        bookmarksToShow = bookmarksToShow.filter(
          bookmark => bookmark.type === "bookmark"
        );
        break;
      case "withoutTags":
        bookmarksToShow = bookmarksToShow.filter(
          bookmark => bookmark.tags.length === 0
        );
        break;
    }

    // calculate page info
    const currentPage = this.state.page;
    const maxPage = Math.ceil(bookmarksToShow.length / bookmarksPerPage);
    const pageInfo = `PAGE ${currentPage}/${maxPage > 0 ? maxPage : 1}`;

    bookmarksToShow = bookmarksToShow.slice(
      pageIndex,
      pageIndex + bookmarksPerPage
    );

    return (
      <div>
        <Menubar newBookmark={this.newBookmark} />
        <div className="contentWrapper">
          <Grid stackable>
            <Grid.Row>
              <Grid.Column width={11}>
                <Controls
                  bookmarks={bookmarksToShow}
                  pageInfo={pageInfo}
                  currentPage={currentPage}
                  maxPage={maxPage}
                  handleClick={this.handleClick}
                  handleButtonClick={this.handleButtonClick}
                />
                <BookmarkView
                  bookmarks={bookmarksToShow}
                  editBookmark={this.editBookmark}
                  changeArticleToRead={this.changeArticleToRead}
                  deleteBookmark={this.deleteBookmark}
                  tagClickHandler={this.tagClickHandler}
                />
              </Grid.Column>
              <Grid.Column width={5}>
                <Sidebar
                  performSearch={this.performSearch}
                  tags={this.state.tags}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default App;
