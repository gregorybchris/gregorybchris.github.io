import Tag from "./Tag";
import PostRecord from "../models/PostRecord";
import React from "react";
import "./Post.css";
import linkImage from "../images/link.svg";
import { formatDate } from "../controllers/DateTimeUtilities";
import { makeURL } from "../controllers/RequestUtilities";

export interface PostProps {
  post: PostRecord;
  onClickTag: (tag: string) => void;
}

export interface PostState {
  thumbnailUrl: string;
}

class Post extends React.Component<PostProps, PostState> {
  state = {
    thumbnailUrl: "",
  };

  componentDidMount() {
    if (!this.state.thumbnailUrl) {
      const link = this.props.post.link;
      if (this.props.post.source === "YouTube") {
        const query = link.replace("https://www.youtube.com/watch", "");
        const urlParams = new URLSearchParams(query);
        const idParam = urlParams.get("v");
        this.setState({
          thumbnailUrl: `https://img.youtube.com/vi/${idParam}/maxresdefault.jpg`,
        });
      }
    }
  }

  onThumbnailLoad = (event: any) => {
    const img = event.target;
    if (img.naturalHeight < 100) {
      const newSrc = img.src.replace("maxresdefault", "0");
      this.setState({ thumbnailUrl: newSrc });
    }
  };

  getThumbnailElement() {
    if (this.state.thumbnailUrl)
      return (
        <a
          className="Post-thumbnail-link"
          href={this.props.post.link}
          title={this.getSummary()}
        >
          <img
            className="Post-thumbnail"
            src={this.state.thumbnailUrl}
            alt="Post thumbnail"
            onLoad={this.onThumbnailLoad}
          ></img>
        </a>
      );
  }

  createTag = (tag: string) => {
    return <Tag key={tag} text={tag} onClickTag={this.props.onClickTag} />;
  };

  getSeriesInfo = () => {
    let elements = [];
    if (this.props.post.series !== null)
      elements.push(
        <div className="Post-series-info" key="series">
          {this.props.post.series}
        </div>
      );
    if (this.props.post.episode_number)
      elements.push(
        <div className="Post-series-info" key="episode">
          &nbsp;{`(#${this.props.post.episode_number})`}
        </div>
      );
    return elements;
  };

  getTitleInfo = () => {
    let elements = [];
    if (this.props.post.speaker !== null)
      elements.push(
        <div className="Post-title" key="speaker">
          {`${this.props.post.speaker}: `}&nbsp;
        </div>
      );
    elements.push(
      <div className="Post-title" key="title">
        {this.props.post.title}
      </div>
    );
    return elements;
  };

  getSummary = () => {
    const summary = this.props.post.summary;
    if (summary) return summary;
    else return "";
  };

  render() {
    return (
      <div className="Post" id={this.props.post.post_id}>
        <div className="Post-text">
          <a
            className="Post-title-link"
            href={this.props.post.link}
            title={this.getSummary()}
          >
            {this.getTitleInfo()}
          </a>
          {this.getSeriesInfo()}
          <div className="Post-date">
            {formatDate(this.props.post.date_posted)}
          </div>
        </div>
        {this.getThumbnailElement()}
        <div className="Post-tags">
          {this.props.post.tags.map((tag) => this.createTag(tag))}
        </div>

        <a
          className="Post-page-link"
          href={makeURL({ postid: this.props.post.post_id })}
        >
          <img className="Post-page-link-image" src={linkImage} alt=""></img>
        </a>
      </div>
    );
  }
}

export default Post;
