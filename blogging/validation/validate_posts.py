import argparse
import json

from post import Post
from post_properties import PostProperties


POSTS_FILEPATH = '../posts.json'
MIN_POST_TAGS = 5


class ValidationError(ValueError):
    pass


def validate(filepath):
    with open(filepath, 'r') as f:
        post_records = json.load(f)
    posts = [Post.from_record(record) for record in post_records]

    validate_unique(posts)
    validate_areas(posts)
    validate_content_types(posts)
    validate_dates(posts)
    validate_fields(posts)
    validate_sources(posts)
    validate_series(posts)
    validate_tags(posts)

    print("Validation successful")


def validate_unique(posts):
    titles = set()
    links = set()
    for post in posts:
        if post.title in titles:
            raise ValidationError(f"Duplicate title {post.title}")
        titles.add(post.title)

        if post.link in links:
            raise ValidationError(f"Duplicate link {post.link}")
        links.add(post.link)


def validate_areas(posts):
    for post in posts:
        if len(post.areas) > 0:
            for area in post.areas:
                if area not in PostProperties.AREAS:
                    raise ValidationError(f"Unknown area {area}")


def validate_content_types(posts):
    for post in posts:
        if post.content_type is not None and post.content_type not in PostProperties.CONTENT_TYPES:
            raise ValidationError(f"Unknown content type {post.content_type}")


def validate_dates(posts):
    for post in posts:
        if post.date is None:
            raise ValidationError(f"Post {post.title} is missing the required 'date' field")


def validate_fields(posts):
    for post in posts:
        for field in PostProperties.FIELDS:
            if not hasattr(post, field):
                raise ValidationError(f"Post {post.title} is missing field {field}")


def validate_series(posts):
    for post in posts:
        if post.series is not None and post.series not in PostProperties.SERIES:
            raise ValidationError(f"Unknown series {post.series}")


def validate_sources(posts):
    for post in posts:
        if post.source is not None and post.source not in PostProperties.SOURCES:
            raise ValidationError(f"Unknown source {post.source}")


def validate_tags(posts):
    for post in posts:
        if len(post.tags) < MIN_POST_TAGS:
            raise ValidationError(f"Number of post tags for \"{post.title}\" was less than {MIN_POST_TAGS}")


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--filepath', default=POSTS_FILEPATH)
    args = parser.parse_args()
    return args


if __name__ == '__main__':
    args = parse_args()
    validate(args.filepath)
