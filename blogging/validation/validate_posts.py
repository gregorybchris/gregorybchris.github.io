import argparse
import json
import re

from post import Post
from post_properties import PostProperties


POSTS_FILEPATH = '../posts.json'

MIN_POST_TAGS = 5
MIN_SUMMARY_LENGTH = 100
MAX_SUMMARY_LENGTH = 1200


class ValidationResults:
    def __init__(self, n_posts):
        self._n_posts = n_posts
        self._errors = list()
        self._completed = dict()

    def add(self, message):
        self._errors.append(message)

    def add_completed(self, field, count=1):
        if field not in self._completed:
            self._completed[field] = 0
        self._completed[field] += count

    def print(self):
        n_errors = len(self._errors)
        if n_errors == 0:
            print(f"Successfully validated {self._n_posts} posts:")
            for field, count in self._completed.items():
                print(f"- Completed {field}: {count}")
        else:
            print(f"Found {n_errors} errors while validating:")
            for error in self._errors:
                print(f"- {error}")

    def has_errors(self):
        return len(self.errors) > 0

    def get_errors(self):
        return self.errors


def validate(posts):
    n_posts = len(posts)
    results = ValidationResults(n_posts)

    seen_areas = set()
    seen_content_types = set()
    seen_links = set()
    seen_series = set()
    seen_sources = set()
    seen_titles = set()
    for post in posts:
        if not re.fullmatch(r'[a-z0-9-]{36}', post.post_id):
            results.add(f"Invalid post_id format \"{post.post_id}\"")

        if post.title in seen_titles:
            results.add(f"Duplicate title \"{post.title}\"")
        seen_titles.add(post.title)

        if post.link in seen_links:
            results.add(f"Duplicate link \"{post.link}\"")
        seen_links.add(post.link)

        if len(post.areas) > 0:
            for area in post.areas:
                if area not in PostProperties.AREAS:
                    results.add(f"Unknown area \"{area}\" for \"{post.title}\"")
                seen_areas.add(area)
            results.add_completed('areas')

        if post.content_type is not None:
            if post.content_type not in PostProperties.CONTENT_TYPES:
                results.add(f"Unknown content type \"{post.content_type}\" for \"{post.title}\"")
            seen_content_types.add(post.content_type)

        if post.date is None:
            results.add(f"Post \"{post.title}\" is missing the required 'date' field")

        if post.length is not None:
            results.add_completed('lengths')

        for field in PostProperties.FIELDS:
            if not hasattr(post, field):
                results.add(f"Post \"{post.title}\" is missing field \"{field}\"")

        if post.series is not None:
            if post.series not in PostProperties.SERIES:
                results.add(f"Unknown series \"{post.series}\" for \"{post.title}\"")
            seen_series.add(post.series)

        if post.source is not None:
            if post.source not in PostProperties.SOURCES:
                results.add(f"Unknown source \"{post.source}\" for \"{post.title}\"")
            seen_sources.add(post.source)

        if post.summary is not None:
            summary_length = len(post.summary)
            if summary_length < MIN_SUMMARY_LENGTH:
                results.add(f"Summary length ({summary_length}) for \"{post.title}\" "
                            f"is less than {MIN_SUMMARY_LENGTH}")

            if summary_length > MAX_SUMMARY_LENGTH:
                results.add(f"Summary length ({summary_length}) for \"{post.title}\" "
                            f"is more than {MAX_SUMMARY_LENGTH}")

            results.add_completed('summaries')

        n_tags = len(post.tags)
        if n_tags < MIN_POST_TAGS:
            results.add(f"Number of tags ({n_tags}) for \"{post.title}\" is less than {MIN_POST_TAGS}")

    # Validate unused

    seen_known_map = [
        ('area', seen_areas, PostProperties.AREAS),
        ('content type', seen_content_types, PostProperties.CONTENT_TYPES),
        ('series', seen_series, PostProperties.SERIES),
        ('source', seen_sources, PostProperties.SOURCES),
    ]

    for field, seen_set, known_set in seen_known_map:
        for value in known_set:
            if value not in seen_set:
                results.add(f"Unused {field} \"{value}\"")

    # Validate formatting

    for area in PostProperties.AREAS:
        if not re.fullmatch(r'[a-z]+', area):
            results.add(f"Invalid area format \"{area}\"")

    for content_type in PostProperties.CONTENT_TYPES:
        if not re.fullmatch(r'[a-z]+', content_type):
            results.add(f"Invalid content type format \"{content_type}\"")

    return results


def get_posts_from_file(filepath):
    with open(filepath, 'r') as f:
        post_records = json.load(f)
    posts = [Post.from_record(record) for record in post_records]
    return posts


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--filepath', default=POSTS_FILEPATH)
    args = parser.parse_args()
    return args


if __name__ == '__main__':
    args = parse_args()
    posts = get_posts_from_file(args.filepath)
    results = validate(posts)

    results.print()
