import Api from '@/services/Api'

export default {
  getCommentByVideoId(id) {
    return Api().get(`comments/videos`, {
      params: {
        video_id: id
      }
    })
  },
  createComment(data) {
    return Api().post('comments', data)
  },
  deleteById(id) {
    return Api().delete(`comments/${id}`)
  },
  getBySinger(params) {
    return Api().get(`comments/singer`, {
      params
    })
  }
}
