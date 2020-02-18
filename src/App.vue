<template>
  <div id="app">
    <template v-if="fbLoaded">
      <div>
        <button class="button" @click="handleLogin">{{loginButtonLabel}}</button>
      </div>
    </template>
    <template v-if="showAdAccounts">
      <div>
        <h3>Choose account</h3>
        <div v-for="(acct, i) in adAccounts" :key=i>
            <p>{{acct.name}}:</p>
          <button class="button" @click="handleSelectAdAccount(acct.id)">
            {{acct.account_id}}
          </button>
        </div>
      </div>
    </template>
    <template v-if="showCustomAudience">
      <div class="form">
        <label for="name">Name</label>
        <input type="text" id="name" v-model="customAudience.name"/>
      </div>
      <div class="form">
        <label for="description">Description</label>
        <input type="text" id="description" v-model="customAudience.description"/>
      </div>
      <button class="button" @click="handleCreateCustomAudience" :disabled="!customAudienceHasName">Create Custom Audience</button>
    </template>
    <template v-if="showLastStep">
      <div>
        <h3>Custom Audience ID</h3>
        <p>{{customAudience.id}}</p>
      </div>
      <button class="button" @click="handleSubmitCustomAudience">Submit</button>
    </template>
  </div>
</template>

<script>
import {
  FB_SCOPE_LOGIN,
  AD_ACCOUNTS_PARAMS,
  CUSTOM_AUDIENCE_PARAMS,
  SUBMIT_CUSTOM_AUDIENCE_PARAMS
  } from './config/facebook';
import facebookMixin from './mixins/facebook';

export default {
  name: 'app',
  mixins: [facebookMixin],
  data() {
    return {
      accessToken: '',
      fbUserId: 0,
      fbAdAccountId: 0,
      adAccounts: [],
      showAdAccounts: false,
      showCustomAudience: false,
      showLastStep: false,
      customAudience: {
        id: '',
        name: '',
        description: '',
      },
      loginButtonLabel: 'Login',
    };
  },
  computed: {
    customAudienceHasName() {
      return this.customAudience.name.trim() !== '';
    },
  },
  watch: {
    fbLoaded(val) {
      if (val) {
        this.FB.getLoginStatus(resp => {
          if (resp.status === 'connected') {
            this.FB.logout();
          }
        });
      }
    }
  },
  methods: {
    handleLogin() {
      this.FB.getLoginStatus(resp => {
        if (resp.status === 'unknown') {
          return this.login();
        } else {
          this.loginButtonLabel = 'Login';
          this.clearState();
          return this.FB.logout();
        }
      });
    },
    login() {
      this.FB.login(resp => {
        if (resp.status === 'connected') {
          this.loginButtonLabel = 'Logout';
          this.fbUserId = resp.authResponse.userID;
          this.accessToken = resp.authResponse.accessToken;
          this.getAdAccounts(this.fbUserId);
        }
      }, FB_SCOPE_LOGIN);
    },
    getAdAccounts(fbUserId) {
      this.FB.api(`/${fbUserId}/adaccounts`, AD_ACCOUNTS_PARAMS, resp => {
        if (resp.data) {
          this.adAccounts = resp.data;
          this.showAdAccounts = true;
        } else {
          alert("There was an error retrieving ad accounts");
        }
      });
    },
    handleSelectAdAccount(acctId){
      this.fbAdAccountId = acctId;
      this.showAdAccounts = false;
      this.showCustomAudience = true;
    },
    handleCreateCustomAudience() {
      this.showCustomAudience = false;
      const params = {
        ...CUSTOM_AUDIENCE_PARAMS,
        name: this.customAudience.name,
        description: this.customAudience.description,
      };
      this.FB.api(`/${this.fbAdAccountId}/customaudiences`, 'post', params, resp => {
        if (resp.id) {
          this.customAudience.id = resp.id;
          this.showLastStep = true;
        } else {
          alert('There was an error creating the custom audience');
        }
      });
    },
    handleSubmitCustomAudience() {
      this.FB.api(`/${this.customAudience.id}/users`, 'post', SUBMIT_CUSTOM_AUDIENCE_PARAMS, resp => {
        if (resp.audience_id) {
          this.clearState();
          this.showAdAccounts = true;
          alert("Custom audience filled with data successfully!!");
        } else {
          alert("There was an error adding data to the custom audience");
        }
      });
    },
    clearState() {
      this.showLastStep = false;
      this.showAdAccounts = false;
      this.showCustomAudience = false;
      this.fbAdAccountId = 0;
      this.customAudience = {
        id: '',
        name: '',
        description: '',
      }
    },
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
button {
  background-color: #3271a8;
  min-width: 15%;
  padding: 10px;
  color: white;
  font-size: 14px;
  font-weight: bold;
  border-radius: 5px;
  z-index: 10px;
  &:disabled {
    background-color: #2c3e50;
    color: gray;
  }
}
div {
  margin: 15px 0;
  &.form {
    display: flex;
    padding-right: 33%;
    label {
      flex: 1 1 50%;
      text-align: right;
      padding-right: 15px;
    }
    input {
      flex: 1 1 25%;
      border: none;
      border-bottom: 1px solid #3271a8;
      margin: 10px 0;
      margin-left: 5px;
      font-size: 14px;
    }
  }
}
</style>
