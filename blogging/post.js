Vue.component('post', {
    props: {
        postContent: Object,
        filterText: String
    },
    computed: {
        thumbnailSrc: function() {
            if (!this.postContent.link)
                console.log("FAILED", this.postContent)
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
            if (this.filterText.length == 0)
                return true

            for (const tag of this.postContent.tags)
                if (tag.includes(this.filterText))
                    return true
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
    template: `
        <div class="blog-post" v-if="enabled">
            <div class="blog-post-title-wrap">
                <span class="blog-post-title">
                    <a class="blog-post-link" v-bind:href="postContent.link" target="_blank">{{ postContent.title }}</a>
                </span>
                <span class="blog-post-date">{{ formattedDate }}</span>
            </div>

            <div class="blog-post-thumbnail-wrap">
                <img class="blog-post-thumbnail" v-bind:src="thumbnailSrc">
            </div>

            <div class="blog-post-tags-wrap">
                <tag v-for="tag in postContent.tags" v-bind:tag="tag"></post>
            </div>
        </div>
    `
})