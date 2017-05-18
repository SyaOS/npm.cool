/* global Vue, superagent */

/* eslint-disable no-new */
new Vue({
  el: 'main',
  data: {
    query: 'cool',
    submit: '',
    results: []
  },
  watch: {
    submit (submit) {
      if (submit === '') return
      this.results = []
      this.exists(submit).then(exists => {
        if (submit !== this.submit) return
        this.results.push({ name: submit, available: !exists })
        if (!exists) return
        this.recommends(submit).then(names => {
          if (submit !== this.submit) return
          names.forEach(name => this.exists(name).then(exists => {
            if (submit !== this.submit) return
            this.results.push({ name, available: !exists })
          }))
        })
      })
    }
  },
  created () {
    const hash = this.getHash()
    if (hash.length) this.query = this.submit = hash
  },
  mounted () {
    window.addEventListener('hashchange', this.hashchange)
  },
  beforeDestroy () {
    window.removeEventListener('hashchange', this.hashchange)
  },
  methods: {
    setHash (hash) {
      window.location.hash = hash
    },
    getHash () {
      return window.location.hash.replace(/^#/, '')
    },
    hashchange () {
      this.submit = this.query = this.getHash()
    },
    exists (name) {
      return superagent.get(`/exists/${name}`).then(() => true, () => false)
    },
    recommends (name) {
      return superagent.get(`/recommends/${name}`).then(response => response.body)
    }
  }
})
