<template>
  <div id="wrapper">
    <router-link to="/">> Home</router-link>
    <h1>Selfback Search</h1>
    <main>
      <div>
        <el-form :inline="true">
          <el-form-item label="">
            <el-input id="keyword"
                      v-model="keyword" required
                      placeholder="...keyword">
            </el-input>
          </el-form-item>
          <el-button type="primary" @click="onSubmit" :loading="loading">Search</el-button>
        </el-form>
        <div>
          <h2 v-if="items.hapitas.length > 0">ハピタス</h2>
          <ul>
            <li v-for="item in items.hapitas" :key="item.id">
              <div>
                {{item.message}}
                <a href="#" v-on:click="open(item.url)">[{{item.site}}]: {{ item.title }}</a>
                <span>{{item.price}}</span>
              </div>
            </li>
          </ul>
        </div>
        
        <ul>
          <h2 v-if="items.a8Sb.length > 0">A8 セルフバック</h2>
          <li v-for="item in items.a8Sb" :key="item.id">
            <div>
              {{item.message}}
              <a href="#" v-on:click="open(item.url)">[{{item.site}}]: {{ item.title }}</a>
              <span>{{item.price}}</span>
            </div>
          </li>
        </ul>
        <ul>
          <h2 v-if="items.valuecommerceSb.length > 0">バリュコマ セルフバック</h2>
          <li v-for="item in items.valuecommerceSb" :key="item.id">
            <div>
              {{item.message}}
              <a href="#" v-on:click="open(item.url)">[{{item.site}}]: {{ item.title }}</a>
              <span>{{item.price}}</span>
            </div>
          </li>
        </ul>
        <ul>
          <h2 v-if="items.epos.length > 0">たまるマーケット</h2>
          <li v-for="item in items.epos" :key="item.id">
            <div>
              {{item.message}}
              <a href="#" v-on:click="open(item.url)">[{{item.site}}]: {{ item.title }}</a>
              <span>{{item.price}}</span>
            </div>
          </li>
        </ul>
        <ul>
          <h2 v-if="items.accesstradeSb.length > 0">アクセストレード セルフバック</h2>
          <li v-for="item in items.accesstradeSb" :key="item.id">
            <div>
              {{item.message}}
              <a href="#" v-on:click="open(item.url)">[{{item.site}}]: {{ item.title }}</a>
              <span>{{item.price}}</span>
            </div>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'

  export default {
    name: 'selfback-page',
    mounted () {
      // ipc render
      ipcRenderer.on('affisearch-a8sb-reply', (event, arg) => {
        console.dir(arg)
        if (Array.isArray(arg)) {
          arg.map(item => { this.items.a8Sb.push(item) })
        }
      })

      ipcRenderer.on('affisearch-valsb-reply', (event, arg) => {
        console.dir(arg)
        if (Array.isArray(arg)) {
          arg.map(item => { this.items.valuecommerceSb.push(item) })
        }
      })

      ipcRenderer.on('affisearch-epos-reply', (event, arg) => {
        console.dir(arg)
        if (Array.isArray(arg)) {
          arg.map(item => { this.items.epos.push(item) })
        }
      })

      ipcRenderer.on('affisearch-hapitas-reply', (event, arg) => {
        console.dir(arg)
        if (Array.isArray(arg)) {
          arg.map(item => { this.items.hapitas.push(item) })
        }
      })
    },
    data () {
      return {
        items: {
          hapitas: [],
          a8Sb: [],
          valuecommerceSb: [],
          epos: [],
          accesstradeSb: []
        },
        keyword: '',
        loading: false
      }
    },
    methods: {
      sendMessage () {
        ipcRenderer.send('affisearch-a8', {site: 'a8'})
      },
      search () {
        this.loading = true
        this.items = {
          hapitas: [],
          a8Sb: [],
          valuecommerceSb: [],
          epos: [],
          accesstradeSb: []
        }
        ipcRenderer.send('affisearch-a8sb', {keyword: this.keyword})
        ipcRenderer.send('affisearch-epos', {keyword: this.keyword})
        ipcRenderer.send('affisearch-hapitas', {keyword: this.keyword})
        ipcRenderer.send('affisearch-valsb', {keyword: this.keyword})
      },
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      onSubmit (event) {
        event.preventDefault()
        this.search()
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { 
    background:
      radial-gradient(
      ellipse at top left,
      rgba(255, 255, 255, 1) 40%,
      rgba(229, 229, 229, .9) 100%
    );
    font-family: 'Source Sans Pro', sans-serif;
  }

  #wrapper {
    height: 100%;
    padding: 60px 80px;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 100%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }
  
  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }
</style>
