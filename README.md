# Mataroa Sync

This is a plugin to upload directly to a blog hosted on https://mataroa.blog. 

It provides most of the functionality in the Mataroa API, including:
- Uploading/updating a post (unpublished by default)
- Deleting a post
- Publishing a post
- Overwriting the current doc with a remote post

This plugin assumes that there is a 1-1 mapping between your post title and its slug (e.g. https://sample.mataroa.blog/blog/foo-bar should always correspond to a single file named Foo Bar/Foo-Bar/foo-bar etc.).

To use this plugin, you just need a Mataroa blog account and its corresponding API key.
