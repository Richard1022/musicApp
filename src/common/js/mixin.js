import { mapGetters } from 'vuex';
export const myMixin = {
    computed: {
        ...mapGetters([
            'playList',
        ])
    },
    watch: {
        playList(newVal) {
            this.handlePlayList(this.playList);
        }
    },
    mounted() {
        this.handlePlayList(this.playList);
    },
    activated() {
        this.handlePlayList(this.playList);
    },
    methods: {
        handlePlayList() {
            throw new Error('component must have handlePlayList');
        }
    }
}