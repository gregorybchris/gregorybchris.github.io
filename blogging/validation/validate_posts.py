import argparse
import json

from post import Post
from post_properties import PostProperties


POSTS_FILEPATH = '../posts.json'

MIN_POST_TAGS = 5
MIN_SUMMARY_LENGTH = 100
MAX_SUMMARY_LENGTH = 1000


class PostValidationError(ValueError):
    pass


def validate(filepath):
    with open(filepath, 'r') as f:
        post_records = json.load(f)
    posts = [Post.from_record(record) for record in post_records]
    n_posts = len(posts)

    validate_unique(posts)
    validate_areas(posts)
    validate_content_types(posts)
    validate_dates(posts)
    validate_fields(posts)
    validate_series(posts)
    validate_sources(posts)
    validate_summaries(posts)
    validate_tags(posts)

    print(f"Successfully validated {n_posts} posts")


def validate_unique(posts):
    titles = set()
    links = set()
    for post in posts:
        if post.title in titles:
            raise PostValidationError(f"Duplicate title {post.title}")
        titles.add(post.title)

        if post.link in links:
            raise PostValidationError(f"Duplicate link {post.link}")
        links.add(post.link)


def validate_areas(posts):
    for post in posts:
        if len(post.areas) > 0:
            for area in post.areas:
                if area not in PostProperties.AREAS:
                    raise PostValidationError(f"Unknown area {area} for {post.title}")


def validate_content_types(posts):
    for post in posts:
        if post.content_type is not None and post.content_type not in PostProperties.CONTENT_TYPES:
            raise PostValidationError(f"Unknown content type {post.content_type} for {post.title}")


def validate_dates(posts):
    for post in posts:
        if post.date is None:
            raise PostValidationError(f"Post {post.title} is missing the required 'date' field")


def validate_fields(posts):
    for post in posts:
        for field in PostProperties.FIELDS:
            if not hasattr(post, field):
                raise PostValidationError(f"Post {post.title} is missing field {field}")


def validate_series(posts):
    for post in posts:
        if post.series is not None and post.series not in PostProperties.SERIES:
            raise PostValidationError(f"Unknown series {post.series} for {post.title}")


def validate_sources(posts):
    for post in posts:
        if post.source is not None and post.source not in PostProperties.SOURCES:
            raise PostValidationError(f"Unknown source {post.source} for {post.title}")


def validate_summaries(posts):
    for post in posts:
        if post.summary is not None:
            if len(post.summary) < MIN_SUMMARY_LENGTH or len(post.summary) > MAX_SUMMARY_LENGTH:
                raise PostValidationError(f"Summary length {len(post.summary)} out of range for {post.title}")


def validate_tags(posts):
    for post in posts:
        if len(post.tags) < MIN_POST_TAGS:
            raise PostValidationError(f"Number of post tags for \"{post.title}\" was less than {MIN_POST_TAGS}")


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--filepath', default=POSTS_FILEPATH)
    args = parser.parse_args()
    return args


if __name__ == '__main__':
    args = parse_args()
    validate(args.filepath)
