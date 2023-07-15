import Api from '@/services/Api'

export default {
  createReply(data) {
    return Api().post('replies', data)
  },
  deleteById(id) {
    return Api().delete(`replies/${id}`)
  },
  createSingerReply(data) {
    return Api().post('singer_replies', data)
  }
}
