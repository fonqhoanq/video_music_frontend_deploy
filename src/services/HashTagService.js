import Api from '@/services/Api'

export default {
  getAll() {
    return Api().get(`hash_tags`)
  }
}
