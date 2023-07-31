import Api from '@/services/Api'

export default {
  createOwnPlaylist(data) {
    return Api().post('own_playlists', data)
  },
  getOwnPlaylists(params) {
    return Api().get('own_playlists', { params: params })
  },
  checkVideoPlaylist(params) {
    return Api().get('own_playlists/check_video', { params: params })
  },
  addVideoToPlaylist(data) { 
    return Api().post('own_playlist_videos/add_video', data)
  },
  removeVideoFromPlaylist(data) {
    return Api().post('own_playlist_videos/remove_video', data)
  },
  getPlaylistVideoById(id) {
    return Api().get(`own_playlists/${id}`)
  },
  getMixPlaylist(params) {
    return Api().get('own_playlists/mix_playlist', { params: params })
  },
  deleteById(id) {
    return Api().delete(`own_playlists/${id}`)
  }
}
