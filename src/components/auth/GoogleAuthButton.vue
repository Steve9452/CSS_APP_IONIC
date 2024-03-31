<template>
  <ion-button :disabled="trying" expand="block" mode="ios" class="submit-button" color="light" @click="authenticateWithGoogle">
    <span v-if="!trying"> <img style="width: 1em; height: auto;" class="mr-3" src="/assets/img/google-ico.svg"/> </span>
    <span v-if="!trying"> Iniciar con Google </span> 
    <pulse-loader v-else :loading="true" :color="'var(--ion-background-color, #000000)'" :size="'0.5em'" />
  </ion-button>

</template>
<script>
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'

export default {
  data: function () {
    return {
      trying: false
    }
  },
  methods: {
    googleHandler(res) {
      console.log(res)
    },
    async Login(userData) {
      try {
        const API_ENDOINT = this.getAPIEndpoint();
        const request = await fetch(API_ENDOINT + '/googleauth', {
          method: "POST",
          body: JSON.stringify({
            credential: userData.token,
          }),
          headers: { "Content-type": "application/json; charset=UTF-8" }
        })

        const data = await request.json();
        console.log(data)

        if (request.status === 200) {
          await this.setAuthenticatedUser(data.user);

          const user = await this.getAuthenticatedUser();
          await this.showSuccessToast(`Bienvenido, ${user.nombres}`);
          
          this.authStateChanged()
          this.$router.push('/home');
        } else if(request.status == 201){
          /** NO ENTIENDO PORQUE NO FUNCIONA CON ROUTER PUSH XD */
          //this.$router.push({name: 'googleRegister', query: {correo: data.carnet, nombres: data.nombres, apellidos: data.apellidos, userId: data.userId}});
          location.href = `/register-google?correo=${data.carnet}&nombres=${data.nombres}&apellidos=${data.apellidos}&userId=${data.userId}`
        } else {
          this.signout();
          this.authStateChanged()
        }
      } catch (e) {
        console.log(e)
        this.showErrorToast('Revisa tu conexion a internet e intenta despues.');
      }


    },
    async authenticateWithGoogle() {

      this.authStateChanged()
      try {

        const userResponse = await GoogleAuth.signIn()
        const userData = {
          fullName: userResponse.givenName + " " + userResponse.familyName,
          email: userResponse.email,
          token: userResponse.idToken,
        }
        
        await this.Login(userData)

      } catch (error) {
        console.error(error)
        this.authStateChanged()

      }
    },

    async logout() {
      try {
        await GoogleAuth.logout()
      } catch (error) {
        console.error(error)
      }
    },
    
    authStateChanged(){
      this.$emit('doingAuth');
      this.trying = !this.trying;
    }
    
  },
  mounted() {
    GoogleAuth.initialize({
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_id: process.env.VUE_APP_OAUTH_CLIENT_ID_WEB,
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    });
  }
}
</script>