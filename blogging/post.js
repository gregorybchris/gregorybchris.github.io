Vue.component('post', {
    props: {
        postContent: Object,
        filterText: String
    },
    computed: {
        thumbnailSrc: function() {
            const link = this.postContent.link
            const youtubePrefix = 'https://www.youtube.com/watch'
            if (link.includes(youtubePrefix)) {
                const query = link.replace(youtubePrefix, '')
                const urlParams = new URLSearchParams(query)
                const idParam = urlParams.get('v')
                const imageUrl = `https://img.youtube.com/vi/${idParam}/0.jpg`
                return imageUrl
            }

            return null
        },
        enabled: function() {
            const filterText = this.filterText
            const postContent = this.postContent

            if (postContent.deleted)
                return false

            if (filterText.length == 0)
                return true

            if (postContent.title.toLowerCase().includes(filterText.toLowerCase()))
                return true

            if (postContent.series && postContent.series.toLowerCase().includes(filterText.toLowerCase()))
                return true

            for (const tag of postContent.tags) {
                if (filterText.startsWith('#') && filterText.substring(1) == tag)
                    return true

                if (tag.includes(filterText))
                    return true
            }
            return false
        },
        formattedDate: function() {
            let date = new Date(this.postContent.date)
            const year = date.getFullYear()
            const month = date.getMonth() + 1
            const day = date.getDate()
            return `${month}-${day}-${year}`
        }
    },
    methods: {
        onClickTag: function(tag) {
            this.$emit("tag-clicked", tag)
        },
    },
    template: `
        <div class="blog-post" v-if="enabled">
            <div class="blog-post-title-wrap">
                <span class="blog-post-title">
                    <a class="blog-post-link" v-bind:href="postContent.link">{{ postContent.title }}</a>
                </span>
                <span class="blog-post-series">{{ postContent.series }}</span>
                <span class="blog-post-date">{{ formattedDate }}</span>
            </div>

            <div class="blog-post-thumbnail-wrap">
                <a class="blog-post-link" v-bind:href="postContent.link">
                    <img class="blog-post-thumbnail" v-bind:src="thumbnailSrc">
                </a>
            </div>

            <div class="blog-post-tags-wrap">
                <tag v-for="tag in postContent.tags" v-on:tag-clicked="onClickTag" v-bind:tag="tag"></post>
            </div>
        </div>
    `
})
