// 将image转换为base64
export function getBase64Image(image, width, height) { // width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
  const canvas = document.createElement('canvas')
  canvas.width = width !== undefined ? width : image.width
  canvas.height = height !== undefined ? height : image.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  const ext = image.src.substring(image.src.lastIndexOf('.') + 1).toLowerCase()
  const dataURL = canvas.toDataURL('image/' + ext)
  return dataURL
}

// base64转file
export function dataURLtoFile (dataurl, filename) {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}
