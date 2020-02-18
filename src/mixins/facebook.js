/*global FB*/
import config from '../config/config';

export default {
    mounted () {
      let _this = this;
      this.$nextTick(() => {
        window.fbAsyncInit = function () {
          FB.init({
            appId: config.APP_ID,
            xfbml: true,
            version: 'v5.0'
          });
          FB.AppEvents.logPageView();
          _this.FB = FB;
          _this.fbLoaded = true;
        };
        (function (d, s, id) {
          let js, fjs = d.getElementsByTagName(s)[0]
          if (d.getElementById(id)) { return }
          js = d.createElement(s); js.id = id
          js.src = '//connect.facebook.net/en_US/sdk.js'
          fjs.parentNode.insertBefore(js, fjs)
        }(document, 'script', 'facebook-jssdk'));
      })
    },
    data () {
      return {
        FB: {},
        fbLoaded: false,
      }
    },
  }