POSTS_FILE = 'blogging/posts.json'

new Vue({
    el: '#blog-app',
    data: {
        posts: [],
        filterText: ""
    },
    methods: {
        loadPosts: async function() {
            return fetch(POSTS_FILE).then(response => response.json())
        },
        onClickTag: function(tag) {
            this.filterText = tag
        },
        clearFilter: function() {
            this.filterText = ""
        }
    },
    created: async function() {
        this.posts = await this.loadPosts()
        this.posts.reverse()
    }
})