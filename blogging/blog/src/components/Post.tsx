import Tag from './Tag';
import PostRecord from '../models/PostRecord';
import React from 'react';
import './Post.css';
import linkImage from '../images/link.svg';

export interface PostProps {
  post: PostRecord,
  onClickTag: (tag: string) => void
}

export interface PostState { }

class Post extends React.Component<PostProps, PostState> {
  getThumbnailLink = () => {
    const link = this.props.post.link
    const youtubePrefix = 'https://www.youtube.com/watch'
    if (link.includes(youtubePrefix)) {
      const query = link.replace(youtubePrefix, '')
      const urlParams = new URLSearchParams(query)
      const idParam = urlParams.get('v')
      return `https://img.youtube.com/vi/${idParam}/0.jpg`
    }
    return undefined
  }

  getThumbnailElement = () => {
    const link = this.getThumbnailLink()
    if (link)
      return (
        <a className="Post-thumbnail-link" href={this.props.post.link} title={this.getSummary()}>
          <img className="Post-thumbnail" src={link} alt=""></img>
        </a>
      )
  }

  getPostHash = () => {
    return `#${this.props.post.post_id}`
  }

  formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const yearNumber = date.getFullYear()
    const monthNumber = date.getMonth() + 1
    const dayNumber = date.getDate()
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const monthName = monthNames[monthNumber - 1]
    return `${monthName}. ${dayNumber}, ${yearNumber}`
  }

  createTag = (tag: string) => {
    return (
      <Tag key={tag}
        text={tag}
        onClickTag={this.props.onClickTag}
      />
    )
  }

  getSeriesInfo = () => {
    let elements = [];
    if (this.props.post.series !== null)
      elements.push(<div className="Post-series-info" key="series">{this.props.post.series}</div>)
    if (this.props.post.episode_number)
      elements.push(<div className="Post-series-info" key="episode">&nbsp;{`(#${this.props.post.episode_number})`}</div>)
    return elements;
  }

  getTitleInfo = () => {
    let elements = [];
    if (this.props.post.speaker !== null)
      elements.push(<div className="Post-title" key="speaker">{`${this.props.post.speaker}: `}&nbsp;</div>)
    elements.push(<div className="Post-title" key="title">{this.props.post.title}</div>)
    return elements
  }

  getSummary = () => {
    const summary = this.props.post.summary;
    if (summary)
      return summary;
    else
      return ""
  }

  render() {
    return (
      <div className="Post" id={this.props.post.post_id}>
        <div className="Post-text">
          <a className="Post-title-link" href={this.props.post.link} title={this.getSummary()}>
            {this.getTitleInfo()}
          </a>
          {this.getSeriesInfo()}
          <div className="Post-date">
            {this.formatDate(this.props.post.date_posted)}
          </div>
        </div>
        {this.getThumbnailElement()}
        <div className="Post-tags">
          {this.props.post.tags.map(tag => this.createTag(tag))}
        </div>

        <a className="Post-hash-link" href={this.getPostHash()}>
          <img className="Post-hash-image" src={linkImage} alt=""></img>
        </a>
      </div>
    );
  }
}

export default Post;
