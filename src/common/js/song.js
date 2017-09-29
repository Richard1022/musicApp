import { getLyric } from 'api/song'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64' //!export default 时 {}区分大小写,键值对应

export default class Song {
    constructor({ id, mid, singer, name, album, duration, image, url }) {
        this.id = id;
        this.mid = mid;
        this.singer = singer;
        this.name = name;
        this.album = album;
        this.duration = duration;
        this.image = image;
        this.url = url;
    }
    getLyric() {
        if (this.lyric) {
            return Promise.resolve(this.lyric)
        }
        return new Promise((resolve, reject) => {
            getLyric(this.mid).then((res) => {
                if (res.retcode === ERR_OK) {
                    this.lyric = Base64.decode(res.lyric)
                    resolve(this.lyric)
                } else {
                    reject('no lyric')
                }
            })
        })

    }
};

export function createSong(musicData) {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: singerFilter(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
    });
};
function singerFilter(singerArr) {  //将歌手信息过滤成需要的str,  合唱/拼接
    let ret = [];
    if (!singerArr) {
        return
    };
    singerArr.forEach((item, index, slef) => {
        ret.push(item.name);//将歌手名称 push进数组  ,若两个及以上歌手,/拼接
    });
    return ret.join('/');
}