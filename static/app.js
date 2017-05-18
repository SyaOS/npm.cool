/* global Vue, superagent */

/* eslint-disable no-new */
new Vue({
  el: 'main',
  data: {
    query: 'cool',
    submit: '',
    results: []
  },
  computed: {
    hash: {
      get () { return window.location.hash.replace(/^#/, '') },
      set (hash) { this.submit = window.location.hash = hash }
    }
  },
  watch: {
    submit (submit) {
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
  mounted () {
    const hash = this.hash
    if (hash.length) this.submit = hash
  },
  methods: {
    exists (name) {
      return superagent.get(`/exists/${name}`).then(() => true, () => false)
    },
    recommends (name) {
      return superagent.get(`/recommends/${name}`).then(response => response.body)
    }
  }
})
