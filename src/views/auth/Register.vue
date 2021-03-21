<template>

  <b-container fluid="sm">
    <b-row align-h="center">
    <b-col cols="5">
    <h1>This is Signup Page</h1>
        <b-form @submit.prevent="onSubmitRegister" v-if="show">
          <b-form-group 
          id="input-group-1" 
          label="Your Name:" 
          label-for="input-1">
            <b-form-input
            id="input-1"
            type="text"
            v-model="form.name"
            placeholder="Enter name"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="input-group-2"
            label="Email address:"
            label-for="input-2"
          >
            <b-form-input
            id="input-2"
            v-model="form.email"
            type="email"
            placeholder="Enter email"
            ></b-form-input>
          </b-form-group>

          <b-form-group 
          id="input-group-3" 
          label="Password:" 
          label-for="input-3">
            <b-form-input
            id="input-3"
            type="password"
            v-model="form.password"
            placeholder="Enter password"
            ></b-form-input>
          </b-form-group>
          <b-form-group 
          id="input-group-4" 
          label="Confirm Password:" 
          label-for="input-4">
            <b-form-input
            id="input-4"
            type="password"
            v-model="form.confirmed"
            placeholder="Enter confirmed password"
            ></b-form-input>
          </b-form-group>
          <b-button type="submit" variant="primary">Submit</b-button>
        </b-form>
      Go to <router-link to="/login">Login</router-link>
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
          name: '',
          password: '',
          confirmed: ''

        },
        show: true
      }
    },
    methods: {
      async onSubmitRegister() {
        await this.register(this.form)
        .then(res=>{
          this.$router.push({ name: 'Products' } || '/')
        })
        .catch(err=>{
          alert(JSON.stringify(err))
        })
      },
      ...mapActions({
        register: 'auth/register'
      })
    }
  }
</script>