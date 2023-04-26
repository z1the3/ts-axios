// 读取cookie逻辑
const cookie = {
  read(name: string): string | null {
    // 因为动态生成，所以得用new RegExp
    //   xxx  =xxx;  xxx=xxx
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))

    return match ? decodeURIComponent(match[3]) : null
  }
}

export default cookie
