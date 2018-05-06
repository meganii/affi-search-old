<template>
  <div>
    <main>
      <router-link to="/">Home</router-link>
      <h2>Settings Page</h2>
      <el-form ref="form" :model="form" label-width="120px">
        
        <el-form-item>A8.net</el-form-item>
        <el-form-item label="User ID">
          <el-input v-model="form.a8.id"></el-input>
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="form.a8.pw"></el-input>
        </el-form-item>

        <el-form-item>Valuecommerce</el-form-item>
        <el-form-item label="User ID">
          <el-input v-model="form.valuecommerce.id"></el-input>
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="form.valuecommerce.pw"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">Save</el-button>
          <el-button type="primary" @click="readCredential">Read</el-button>
          <el-button>Cancel</el-button>
        </el-form-item>
      </el-form>
    </main>
  </div>
</template>

<script>
  const keytar = require('keytar')

  const SERVICE_NAME = 'com.meganii.apps.affi-search'

  const hasIdAndPw = (secret) => {
    if (secret.id === '' || secret.pw === '') {
      return false
    } else {
      return true
    }
  }

  export default {
    name: 'settings-page',
    data () {
      return {
        form: {
          a8: { id: '', pw: '' },
          valuecommerce: { id: '', pw: '' }
        }
      }
    },
    methods: {
      onSubmit (event) {
        event.preventDefault()
        this.saveCredential()
      },
      async readCredential () {
        if (!hasIdAndPw(this.form.a8)) {
          const secret = await keytar.findCredentials(`${SERVICE_NAME}.a8`)
          this.form.a8.id = secret[0].account
          this.form.a8.pw = secret[0].password
        }

        if (!hasIdAndPw(this.form.valuecommerce)) {
          const secret = await keytar.findCredentials(`${SERVICE_NAME}.valuecommerce`)
          this.form.valuecommerce.id = secret[0].account
          this.form.valuecommerce.pw = secret[0].password
        }
      },
      saveCredential () {
        if (hasIdAndPw(this.form.a8)) {
          keytar.setPassword(`${SERVICE_NAME}.a8`, this.form.a8.id, this.form.a8.pw)
        }
        if (hasIdAndPw(this.form.valuecommerce)) {
          keytar.setPassword(`${SERVICE_NAME}.valuecommerce`, this.form.valuecommerce.id, this.form.valuecommerce.pw)
        }
      }
    }
  }
</script>

<style>

</style>
