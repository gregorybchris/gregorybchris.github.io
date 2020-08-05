Vue.component('tag', {
    props: {
        tag: String
    },
    template: `
        <div class="blog-post-tag">
            #{{ tag }}
        </div>
    `
})