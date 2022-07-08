#!/usr/bin/env node

import fs from 'fs'
const log = console.log

let dat = []
let u = {
  µs: 1,
  ns: 0.001,
  ms: 1000,
  s: 1000000
}

fs.readFileSync('./timexx', 'utf-8')
  .split('\n')
  .forEach(l => {
    let n = l.match(/End:/)

    if (!n) return

    let na = l.slice(n.index)
    // log(na)
    let du = /[0-9]+.[0-9]+(ms|µs|ns|s)$/.exec(na)
    // log(du)

    na = na.slice(9, du.index).replace(/\./g, '')
    du = parseFloat(du[0]) * u[du[1]]
    let i = n.index

    let d = { i, na, du, sub: [] }
    // log(d)

    let cur = dat
    let tail = dat[dat.length - 1]
    if (tail) {
      if (i < tail.i) {
        let _d
        do {
          _d = dat.pop()
          if (!_d || _d.i != tail.i) break
          d.sub.unshift(_d)
        } while (1)
        if (_d) dat.push(_d)
      }
    }

    cur.push(d)

    // log('>>', l)
  })

function print (d, lvl) {
  let l = ''
  for (let i = 0; i < lvl * 2; i++) l += ' '
  l += '|- '
  log(l, d.na, d.du)
  if (d.sub.length > 0) d.sub.forEach(x => print(x, lvl + 1))
}

dat.forEach(x => print(x, 0))

// log(JSON.stringify(dat, null, 2))
