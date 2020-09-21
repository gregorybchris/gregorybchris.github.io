import Post from './Post';
import PostRecord from '../models/PostRecord';
import React from 'react';
import SearchBar from './SearchBar';
import './Blog.css';

import posts from '../data/posts.json';

export interface BlogProps { }

export interface BlogState {
  posts: PostRecord[],
  searchText: string
}

class Blog extends React.Component<BlogProps, BlogState> {
  state = {
    posts: posts,
    searchText: ""
  }

  onClearSearch = () => {
    this.setState({ searchText: "" })
  }

  onUpdateSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchText: event.target.value });
  }

  onClickTag = (tag: string) => {
    this.setState({ searchText: tag })
  }

  isPostEnabled = (post: PostRecord) => {
    const searchText = this.state.searchText

    if (post.deleted)
      return false

    if (searchText.length === 0)
      return true

    if (post.title.toLowerCase().includes(searchText.toLowerCase()))
      return true

    if (post.series && post.series.toLowerCase().includes(searchText.toLowerCase()))
      return true

    for (const tag of post.tags) {
      if (searchText.startsWith('#') && searchText.substring(1) === tag)
        return true

      if (tag.includes(searchText))
        return true
    }
    return false
  }

  createPost = (post: PostRecord) => {
    if (this.isPostEnabled(post))
      return (
        <Post key={post.post_id}
          post={post}
          onClickTag={this.onClickTag}
        />
      )
  }

  render() {
    return (
      <div className="Blog">
        <div className="Blog-header">
          <div className="Blog-title">Link Blog</div>
        </div>
        <div className="Blog-search">
          <SearchBar onClearSearch={this.onClearSearch}
            onUpdateSearch={this.onUpdateSearch}
            searchText={this.state.searchText}
          />
        </div>
        <div className="Blog-posts">
          {this.state.posts.reverse().map(post => this.createPost(post))}
        </div>
      </div>
    );
  }
}

export default Blog;
