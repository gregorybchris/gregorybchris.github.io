Vue.component('tag', {
    props: {
        tag: String
    },
    template: `
        <div class="blog-post-tag" v-on:click="$emit('tag-clicked', '#' + tag)">
            #{{ tag }}
        </div>
    `
})