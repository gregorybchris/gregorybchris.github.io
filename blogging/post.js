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
                <div class="blog-post-heading">
                    <a class="blog-post-link" v-bind:href="postContent.link">
                        <span class="blog-post-speaker" v-if="postContent.speaker !== null">{{ postContent.speaker }}:</span>
                        <span class="blog-post-title">{{ postContent.title }}</span>
                    </a>
                </div>
                <span class="blog-post-series" v-if="postContent.series !== null">{{ postContent.series }}</span>
                <span class="blog-post-episode-number" v-if="postContent.episode_number !== null">(#{{ postContent.episode_number }})</span>
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
