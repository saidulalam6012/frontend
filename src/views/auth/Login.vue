<template>

  <b-container fluid="sm">
    <b-row align-h="center">
    <b-col cols="5">
    <h1>This is Login Page</h1>
        <b-form @submit.prevent="onSubmit" v-if="show">
        <b-form-group
            id="input-group-1"
            label="Email address:"
            label-for="input-1"
        >
            <b-form-input
            id="input-1"
            v-model="form.email"
            type="email"
            placeholder="Enter email"
            ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Your password:" label-for="input-2">
            <b-form-input
             type="password"
            id="input-2"
            v-model="form.password"
            placeholder="Enter password"
            ></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
        </b-form>
      Go to <router-link to="/register">Registration</router-link>
    </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import {mapActions} from 'vuex'
  export default {
    data() {
      return {
        form: {
          email: '',
          password: ''
        },
        show: true
      }
    },
    methods: {
      async onSubmit() {
        await this.login(this.form)
        .then(res=>{
          this.$router.push({ name: 'Products' } || '/')
        })
        .catch(err=>{
          alert(JSON.stringify(err))
        })
      },
      ...mapActions({
        login: 'auth/login'
      })
    }
  }
</script>