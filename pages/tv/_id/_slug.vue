<template>
    <div>
        <!-- JIKA TIDAK ADA TRAILER YT → PLAYER LAMA -->
<!-- PLAYER LAMA (SELALU ADA DI DOM) -->
<Player
  v-show="!youtubeTrailerId"
  :backdrop="backdrop"
  :title="item.name"
  :runtime="item.episode_run_time && item.episode_run_time[0]"
/>

<!-- YOUTUBE TRAILER -->
<div v-if="youtubeTrailerId" class="ratio ratio-16x9 mb-4">
  <iframe
    :src="`https://www.youtube.com/embed/${youtubeTrailerId}?rel=0&autoplay=0`"
    frameborder="0"
    allow="autoplay; encrypted-media"
    allowfullscreen>
  </iframe>
</div>



        <div class="container box-info">
            <div class="row justify-content-center">
                <div class="col-lg-11">
                    <div class="card">
                        <div class="card-body pt-5 p-lg-4">
                            <div class="row">
                                <div class="col-lg-3 d-none d-lg-block">
                                    <aside>
                                        <img :src="poster(item.poster_path)" :alt="item.title" class="img-fluid rounded mb-4">
                                        <div class="mb-3 d-flex justify-content-around">
                                            <div v-for="(item, index) in votes" :key="index" style="color: #f1c830">
                                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                            </div>
                                            <div v-for="(item, index) in unvotes" :key="'un'+index">
                                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                            </div>
                                        </div>
                                        
                                        <table class="table table-borderless">
                                            <tbody>
                                                <tr>
                                                    <td>{{ $t('Genres') }}</td>
                                                    <td class="text-muted small"><span v-for="(it, index) in item.genres" :key="index">{{ it.name }}, </span></td>
                                                </tr>
                                                <tr>
                                                    <td>{{ $t('Runtime') }}</td>
                                                    <td class="text-muted small">{{ this._.head(item.episode_run_time) }} min</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </aside>
                                </div>
                                <div class="col-lg-9">
                                    <div class="d-flex justify-content-center justify-content-md-between align-items-center mb-4 flex-column-reverse flex-md-row">
                                        <div class="title">
                                            <h1 class="text-light h3">{{ item.name }} <span class="text-muted fs-4">({{ year }})</span></h1>
                                        </div>
                                        <div class="dl mb-3 mb-md-0 text-center">
                                            <ButtonDownload />
                                        </div>
                                    </div>
                                    <p class="text-muted">{{ item.overview }}</p>
                                    <!-- ADSTERRA BANNER -->
                                    <div
                                      id="container-cd1096097e3fd55fe2a731d9cf31759e"
                                         class="my-4 text-center">
                                    </div>
   
                                    <Seasons :number="item.number_of_seasons" :seasons="item.seasons" :title="slug(item.name)" class="mb-4"  />
                                    <Episodes :tvId="$route.params.id" :seasonNumber="item.number_of_seasons" :episodeNumber="selectEpisode" />

                                    <Casts :id="$route.params.id" :type="'tv'" class="mb-4"  />
                                    <Recommendations :id="$route.params.id" :type="'tv'"  />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const mopie = require('~/mopie')

export default {
    name: 'tv-id-slug',

    data() {
        return {
            item: {},
            youtubeTrailerId: null
        }
    },

    mounted() {
        if (process.client) {
            this.$nextTick(() => {

                // ===== ADSTERRA BANNER =====
                const container = document.getElementById(
                    'container-cd1096097e3fd55fe2a731d9cf31759e'
                )

                if (container && !document.getElementById('adsterra-tv-script')) {
                    const s = document.createElement('script')
                    s.id = 'adsterra-tv-script'
                    s.async = true
                    s.setAttribute('data-cfasync', 'false')
                    s.src = 'https://pl27866130.effectivegatecpm.com/cd1096097e3fd55fe2a731d9cf31759e/invoke.js'
                    document.body.appendChild(s)
                }

                // ===== ADSTERRA POP-UNDER =====
                if (!window.__adsterraPopUnderLoaded) {
                    window.__adsterraPopUnderLoaded = true

                    const pop = document.createElement('script')
                    pop.async = true
                    pop.src = 'https://pl27866022.effectivegatecpm.com/4f/8c/ed/4f8cedfd3c7ebe8e5fc6a32e7a5c9e7d.js'
                    document.body.appendChild(pop)
                }

            })
        }
    },

    head() {
        return {
            title: this.item.name + ' - ' + this.$i18n.t('Stream Free Movies & TV Shows'),
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: this.item.name + ' - ' + this.$i18n.t('Stream Free Movies & TV Shows')
                }
            ]
        }
    },

    async fetch() {
        const params = {
            api_key: mopie.API_KEY,
            include_adult: false,
            language: this.$i18n.locale,
            append_to_response: 'videos'
        }

        // TV DETAIL (BENAR UNTUK FILE TV)
        this.item = await this.$axios.$get(
            `tv/${this.$route.params.id}`,
            { params }
        )

        // ===== CARI TRAILER YOUTUBE =====
        if (this.item.videos && this.item.videos.results) {
            const trailer = this.item.videos.results.find(
                v => v.site === 'YouTube' && v.type === 'Trailer'
            )

            if (trailer) {
                this.youtubeTrailerId = trailer.key
            }
        }
    }, // ⬅️ KOMA PENTING

    computed: {
        id() {
            return this.$route.params.id
        },
        backdrop() {
            return this.item.backdrop_path
                ? mopie.IMAGE_BACKDROP + this.item.backdrop_path
                : null
        },
        year() {
            return this.item.first_air_date
                ? this.item.first_air_date.split('-')[0]
                : ''
        },
        votes() {
            return this.item.vote_average
                ? Math.round(this.item.vote_average)
                : 0
        },
        unvotes() {
            return this.votes
                ? [...Array(10 - this.votes).keys()]
                : []
        }
    },

    methods: {
        poster(poster) {
            return poster
                ? mopie.IMAGE_POSTER + poster
                : '/images/no-poster.png'
        },
        slug(txt = '') {
            return txt
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
        }
    }
}
</script>
