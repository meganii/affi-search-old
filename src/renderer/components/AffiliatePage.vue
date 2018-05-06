<template>
  <div id="wrapper">
    <router-link to="/">Home</router-link>
    <h1>Affiliate Search</h1>
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
        <ul>
          <h2 v-if="items.a8.length > 0">A8.net</h2>
          <li v-for="item in items.a8" :key="item.id">
            <div>
              {{item.message}}
              <a href="#" v-on:click="open(item.url)">[{{item.site}}]: {{ item.title }}</a>
              <span>{{item.price}}</span>
            </div>
          </li>
        </ul>
        <ul>
          <h2 v-if="items.valuecommerce.length > 0">valuecommerce</h2>
          <li v-for="item in items.valuecommerce" :key="item.id">
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
    name: 'affliate-page',
    mounted () {
      // ipc render
      ipcRenderer.on('affisearch-a8-reply', (event, arg) => {
        if (Array.isArray(arg)) {
          arg.map(item => {
            this.items.a8.push(item)
          })
        }
      })

      ipcRenderer.on('affisearch-val-reply', (event, arg) => {
        if (Array.isArray(arg)) {
          arg.map(item => {
            this.items.valuecommerce.push(item)
          })
        }
      })
    },
    data () {
      return {
        items: {
          a8: [],
          valuecommerce: []
        },
        keyword: '',
        loading: false
      }
    },
    methods: {
      search () {
        this.loading = true
        this.items = {
          a8: [],
          valuecommerce: []
        }
        ipcRenderer.send('affisearch-a8', {keyword: this.keyword})
        ipcRenderer.send('affisearch-val', {keyword: this.keyword})
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
