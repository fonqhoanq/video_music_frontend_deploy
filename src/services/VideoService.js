import Api from '@/services/Api'

export default {
  getAll(data, params) {
    return Api().get(`videos/${data}`, {
      params
    })
  },
  getVideosAfterWatchingCurrentVideo(params) {
    return Api().get(`videos/recommend_after_watching`, {
      params
    })
  },
  getNewReleaseVideo() {
    return Api().get('videos/new_release')
  },
  getBySingerId(data, params) {
    return Api().get(`videos/singer/${data}`, {
      params
    })
  },
  getBySinger(params) {
    return Api().get(`videos/singer`, {
      params
    })
  },
  getRecommendVideosForPlaylist(params) {
    return Api().get('videos/recommend_for_playlist', {
      params
    })
  },
  getTrendingVideo(params) {
    return Api().get('videos/trending', {
      params
    })
  },
  getWatchedVideos(params) {
    return Api().get('videos/watched', {
      params
    })
  },
  getById(id) {
    return Api().get(`videos/${id}`)
  },
  uploadVideo(data, optional) {
    return Api().post('videos', data, optional)
  },
  updateVideo(id, data) {
    return Api().put(`videos/${id}`, data)
  },
  updateViews(id, data) {
    return Api().put(`videos/${id}/views`, data)
  },
  uploadThumbnail(id, data) {
    return Api().put(`videos/${id}/thumbnails`, data)
  },
  deleteById(id) {
    return Api().delete(`videos/${id}`)
  },
  getByCategory(params) {
    return Api().get('videos/category', {
      params
    })
  }
}
