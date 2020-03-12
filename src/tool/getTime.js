import moment from 'moment'
export function getTime () {
  let time = new Date()
  let ms = time.getMilliseconds()
  return moment(time).format(`YYYY-MM-DD HH:mm:SS`) + '.' + ms
}
