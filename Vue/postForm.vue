<template>
  <div class="becomePartnerForm">
      <div class="formBox__container"> 
        <div class="grid">
          <div class="col-6_sm-12">
            <form-input v-on:enter="submit" v-model="input.businessName" :required="true" :validate="'required'" name="businessName" :indicator-success="false"></form-input>
          </div>
          <div class="col-6_sm-12">
            <form-input v-on:enter="submit" v-model="input.TIN" :required="true" :validate="'required'" name="TIN" :indicator-success="false"></form-input>
          </div>
          <div class="col-6_sm-12">
            <form-input v-on:enter="submit" v-model="input.city" :required="true" :validate="'required'" name="city" :indicator-success="false"></form-input>
          </div>
          <div class="col-6_sm-12">
            <form-input v-on:enter="submit" v-model="input.company_contact" :required="true" :validate="'required'" name="company_contact" :indicator-success="false"></form-input>
          </div>
          <div class="col-6_sm-12">
            <form-input v-on:enter="submit" v-model="input.phone" :required="true" :validate="'required'" name="phone" :indicator-success="false"></form-input>
          </div>
          <div class="col-6_sm-12">
            <form-input v-on:enter="submit" v-model="input.email" :required="true" :validate="'required|email'" name="email" type="email" :indicator-success="false"></form-input>
          </div>
          <div class="col-12">
            <div class="becomePartnerForm__textarea">
              <label class="formControl__label" for="company_message">Your message:</label>
              <textarea v-model="input.company_message" name="company_message" rows="10"></textarea>
            </div>
          </div>
        </div>
      </div>

      <div class="formBox__container">
        <div class="becomePartnerForm__checkboxes">
          <label class="formControl__label">Your business:</label>
          <div class="checkboxRow">
            <form-checkbox v-model="input.company_businessStore" name="company_business_store">
              Store
            </form-checkbox>
            <form-checkbox v-model="input.company_businessWholesale" name="company_business_wholesale">
              Wholesale
            </form-checkbox>
            <form-checkbox v-model="input.company_businessEshop" name="company_business_eshop">
              E-shop
            </form-checkbox>
          </div>
        </div>

        <button type="submit" class="button -spacy becomePartnerForm__button" @click="submit" :class="{'-iconRight': loading || submitted}" :disabled="submitted || loading">
          <template v-if="!submitted && !loading">
            Send
          </template>
          <template v-if="loading">
            Sending <i class="flaticon-reload -rotate"></i>
          </template>
          <template v-if="submitted">
            Sent <i class="flaticon-success"></i>
          </template>
        </button>
      </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import formInput from 'patterns/forms/input/input.vue'
  import formCheckbox from 'patterns/forms/checkbox/checkbox.vue'
  import { notification } from 'assets/js/notification'

  export default Vue.extend({
    data: () => {
      return {
        loading: false,
        submitted: false,
        input: {
          businessName: '',
          TIN: '',
          city: '',
          company_contact: '',
          phone: '',
          email: '',
          company_message: '',
          company_businessStore: false,
          company_businessWholesale: false,
          company_businessEshop: false,
        },
        routes: window.pageData.routes,
      }
    },
    provide () {
      return { parentValidator: this.$validator }
    },
    methods: {
      submit: function() {
        if (!this.loading) {
          this.$validator.validateAll().then((result) => {
            if (result) {
              this.loading = true;
              axios.post('/api/v1/partners', {
                "businessName": this.input.businessName,
                "TIN": this.input.TIN,
                "city": this.input.city,
                "company_contact": this.input.company_contact,
                "phone": this.input.phone,
                "email": this.input.email,
                "company_message": this.input.company_message,
                "company_businessStore": this.input.company_businessStore,
                "company_businessWholesale": this.input.company_businessWholesale,
                "company_businessEshop": this.input.company_businessEshop,
              }).then((response) => {
                this.loading = false
                this.submitted = true
                window.location.replace(response.data.meta.custom.redirectUrl)
              }, (error) => {
                this.loading = false;
                notification.danger({
                  title: error.response.data.errors[0].title
                })
              })
            }
          });
        }
      }
    },
    components: {
      formInput,
      formCheckbox,
    },
  })
</script>
