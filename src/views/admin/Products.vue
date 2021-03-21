<template>
  <div class="products">
    <div>
      <b-nav tabs align="right">
        <b-nav-item ><b-button variant="danger" @click="logOut">Logout</b-button></b-nav-item>
      </b-nav>
      <b-modal
      id="product-mod"
      ref="modal"
      title="Add New Product"
      @hidden="resetModal"
      @ok="handleOk"
      >
        <form ref="form" @submit.stop.prevent="handleSubmit" >
          <b-form-group
            label="Title"
            label-for="title-input"
          >
            <b-form-input
              id="title-input"
              v-model="product.title"
              required
              type="text"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label="Description"
            label-for="description-input"
          >
            <b-form-textarea
              id="textarea"
              v-model="product.description"
              placeholder="Enter something..."
              rows="3"
              max-rows="6"
            ></b-form-textarea>
          </b-form-group>
          <b-form-group
            label="Price"
            label-for="price-input"
          >
            <b-form-input
              id="price-input"
              v-model="product.price"
              required
              type="number"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label="Image"
            label-for="image-input"
          >
          <div v-if="!product.image">
            <b-form-file 
              type="file"
              @change="handleFiles"
            ></b-form-file>
          </div>
          <div v-else>
              <img :src="product.image" />
              <button @click="removeImage">Remove image</button>
          </div>
          </b-form-group>
        </form>
        <template #modal-footer="{ ok, cancel }">
        <!-- Emulate built in modal footer ok and cancel button actions -->
        <b-button size="sm" variant="secondary" @click="cancel()">
          Cancel
        </b-button>
        <b-button size="sm" variant="success" @click="ok()">
          Submit
        </b-button>
      </template>
      </b-modal>
      <b-modal @hidden="resetModal" id="delete-modal" hide-backdrop content-class="shadow" title="Delete">
        <p class="my-2">
          are you sure you want to permanently remove this item?
        </p>
        <template #modal-footer="{ ok, cancel}">
        <b-button size="sm" variant="secondary" @click="cancel()">
          Cancel
        </b-button>
        <b-button size="sm" variant="success" @click="deleteProduct(product.id)">
          Submit
        </b-button>
      </template>
      </b-modal>
    </div>
    <div>
    <h1>Product List</h1>
    <b-button variant="outline-primary" v-b-modal.product-mod>New Product</b-button>
        <b-table small :fields="fields" :items="products" responsive="sm">
          <template #cell(image)="data">
            <img :src="base_url+data.item.image"/>
          </template>
           <!-- A virtual column -->
          <template #cell(edit)="data">
            <b-button variant="outline-primary" v-b-modal.product-mod @click="editProduct(data.item)">Edit</b-button>
          </template>
          <template #cell(delete)="data">
            <b-button v-b-modal.delete-modal @click="product.id = data.item.id">Delete</b-button>
          </template>
        </b-table>
      </div>
  </div>
</template>
<script>
  import {mapActions} from 'vuex'
  export default {
    data() {
      return {
        base_url: process.env.VUE_APP_BACKEND_ROOT_URL,
        product: {
          id:null,
          title: null,
          description: null,
          price: null,
          image: '',
        },
        fields: [
          'id',
          'title',
          { key: 'image', label: 'Image' },
          'edit',
          'delete'
        ],
        products:[]
      }
    },
    mounted() {
      this.productList();
    },
    methods: {
      deleteProduct(id){
        axios.delete(`/products/${id}`)
        .then(res=>{
        this.$nextTick(() => {
          this.$bvModal.hide('delete-modal')
        })
        this.$toaster.success(res.data)
        this.productList();
        })
      },
      productList(){
        axios.get('/products')
        .then(res=>{
        this.products = res.data
        })
      },
      editProduct(product){
        this.product.id= product.id;
        this.product.title= product.title;
        this.product.description = product.description;
        this.product.price = product.price;
        this.product.image = this.base_url+product.image;
      },
      handleFiles(e) {
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length)
          return;
        this.createImage(files[0]);
      },
      createImage(file) {
        var reader = new FileReader();
        var vm = this;

        reader.onload = (e) => {
          vm.product.image = e.target.result;
        };
        if(typeof file === 'object' && file !== null)
        reader.readAsDataURL(file);

      },
      removeImage: function (e) {
        this.product.image = '';
      },
      resetModal() {
        this.product.id= null,
        this.product.title= null,
        this.product.description = null,
        this.product.price = null,
        this.product.image = null
      },
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handleSubmit()
      },
      async handleSubmit() {
        var _this = this;
        const url= _this.product.id ? `/products/${_this.product.id}` : '/products'
        const method = _this.product.id ? 'put' : 'post'
        await axios.[method](url, {
              'title': _this.product.title,
              'description': _this.product.description,
              'price': _this.product.price,
              'image': _this.product.image,
            })
            .then(res => {
              this.$nextTick(() => {
                this.$bvModal.hide('product-mod')
              })
              this.$toaster.success(res.data)
              this.productList();
            })
            .catch(err => {
              this.$toaster.error(Object.values(err.response.data.errors)[0][0])
            });
      },
      async logOut() {
        await this.logout()
        .then(res=>{
          this.$router.push({ name: 'Login' } || '/')
        })
        .catch(err=>{
          alert(JSON.stringify(err))
        })
      },
      ...mapActions({
        logout: 'auth/logout'
      })
    }
       
  }
</script>
<style scoped>
#product-mod img {
  width: 200px;
  display: block;
}
img {
  width:50px;
}
</style>