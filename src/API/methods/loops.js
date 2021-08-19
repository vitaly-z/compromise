const forEach = function (cb) {
  let ptrs = this.fullPointer
  ptrs.forEach((ptr, i) => {
    let view = this.update([ptr])
    cb(view, i)
  })
  return this
}

const map = function (cb) {
  let ptrs = this.fullPointer
  let res = ptrs.map((ptr, i) => {
    let view = this.update([ptr])
    return cb(view, i)
  })
  // return an array?
  if (!res[0] || typeof res[0] !== 'object' || !res[0].isView) {
    return res
  }
  // return a View object
  let all = []
  res.forEach(ptr => {
    all = all.concat(ptr.fullPointer)
  })
  return this.update(all)
}

const filter = function (cb) {
  let ptrs = this.fullPointer
  ptrs = ptrs.filter((ptr, i) => {
    let view = this.update([ptr])
    return cb(view, i)
  })
  return this.update(ptrs)
}

const find = function (cb) {
  let ptrs = this.fullPointer
  let found = ptrs.find((ptr, i) => {
    let view = this.update([ptr])
    return cb(view, i)
  })
  return this.update([found])
}

const some = function (cb) {
  let ptrs = this.fullPointer
  return ptrs.some((ptr, i) => {
    let view = this.update([ptr])
    return cb(view, i)
  })
}

const random = function (n = 1) {
  let ptrs = this.fullPointer
  let r = Math.floor(Math.random() * ptrs.length)
  //prevent it from going over the end
  if (r + n > this.length) {
    r = this.length - n
    r = r < 0 ? 0 : r
  }
  ptrs = ptrs.slice(r, r + n)
  return this.update(ptrs)
}
export default { forEach, map, filter, find, some, random }
