import find from './find.js'
const findVerbs = function (View) {
  class Verbs extends View {
    constructor(document, pointer, groups) {
      super(document, pointer, groups)
      this.viewType = 'Verbs'
    }
  }

  View.prototype.verbs = function (n) {
    let m = find(this)
    if (typeof n === 'number') {
      m = m.get(n)
    }
    return new Verbs(this.document, m.pointer)
  }
}
export default findVerbs
