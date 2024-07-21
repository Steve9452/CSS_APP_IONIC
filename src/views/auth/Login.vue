<template>
    <ion-content :fullscreen="true">
        <div class="container">
            <div class="row justify-content-center align-items-center" style="min-height: 100vh;">
                <div class="col align-items-center flex-column">
                    <div style="width:80vw; height:auto; margin: auto; margin-bottom: 1em;">
                        <div class="flex-center" style="width:100%; height:auto">
                            <logotype></logotype>
                        </div>
                    </div>


                    <div class="form-group">
                        <label class="text-muted"><i class="far fa-id-card"></i>&nbsp;Carnet</label>
                        <input v-model="user.carnet" type="text" class="form-control custom-form"
                            placeholder="Ingrese su carnet">
                        <div class="text-danger">{{ validation.firstError('user.carnet') }}</div>
                    </div>

                    <div class="form-group mt-4">
                        <label class="text-muted"><i class="fas fa-unlock-alt"></i>&nbsp;Contraseña</label>
                        <input v-model="user.password" type="password" class="form-control custom-form"
                            placeholder="Ingrese su contraseña">
                        <div class="text-danger">{{ validation.firstError('user.password') }}</div>
                    </div>

                    <div style="gap: 0.5em" class="form-group d-flex flex-column gap-1 justify-content-between mt-4">
                        <ion-button @click="Login()" :disabled="logingIn || googleIn" mode="ios" expand="block">
                            <span v-if="!logingIn"> Iniciar sesion </span> 
                            <pulse-loader v-else :loading="true" :color="'var(--ion-color, white)'" :size="'0.5em'" />
                        </ion-button>
                        <div class="form-group">
                        <p class="d-block text-center">
                            
                            <span color="medium"> ¿Aún no tienes una cuenta? </span>
                            <ion-router-link style="color: var(--ion-color-primary-contrast)" class="d-block text-center" href="/register">
                                Registrate aquí
                            </ion-router-link>
                        </p>
                        <p class="d-block text-center">
                             o
                        </p>
                        </div>
                        <google-auth-button v-on:doingAuth="doingGoogleAuth"></google-auth-button>
                        <br>
                        <ion-router-link class="d-block text-center" href="/forgot-password" color="medium">
                            ¿Olvidaste tu contraseña?
                        </ion-router-link>
                    </div>
                </div>
            </div>
        </div>
    </ion-content>
</template>

<script>
import SimpleVueValidator from 'simple-vue-validator';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton.vue' 
const Validator = SimpleVueValidator.Validator;

export default {
    mixins: [SimpleVueValidator.mixin],
    components: {
        GoogleAuthButton,
    },
    data: function () {
        return {
            logingIn: false,
            googleIn: false,
            user: {
                carnet: null,
                password: null,
            },
            
        };
    },
    validators: {
        'user.carnet': function (value) {
            return Validator.value(value)
                .required('El carnet es obligatorio.')
                .maxLength(100, 'El carnet no debe contener más de 100 caracteres.');
        },
        'user.password': function (value) {
            return Validator.value(value)
                .required('El campo contraseña es obligatorio.')
                .minLength(8, 'La contraseña debe contener al menos 8 caracteres.');
        },
    },
    methods: {
        async Login() {
            const validation = await this.$validate();
            if (validation) {
                this.logingIn = true
                let correo = this.user.carnet;
                if (!correo.includes('@')) {
                    correo = correo + '@uca.edu.sv';
                }
                try {

                    const API_ENDOINT = this.getAPIEndpoint();
                    const request = await fetch(API_ENDOINT + '/login', {
                        method: "POST",
                        body: JSON.stringify({
                            correo: correo,
                            password: this.user.password
                        }),
                        headers: { "Content-type": "application/json; charset=UTF-8" }
                    })

                    const data = await request.json();

                    if (request.status === 200) {
                        //localStorage.setItem('user', JSON.stringify(data));
                        await this.setAuthenticatedUser(data.user);

                        this.$router.push('/home');
                        location.reload();
                    } else {
                        //localStorage.removeItem('user');
                        await this.signout();
                        this.showErrorToast('Correo o contraseña incorrecta.');
                    }
                    this.logingIn = false
                } catch (e) {
                    this.showErrorToast('Revisa tu conexion a internet e intenta despues.');
                    this.logingIn = false
                }
            } else {
                this.FormValidationFailed();
            }

        },
        doingGoogleAuth(){  
            this.googleIn = !this.googleIn

        }
    },
}
</script>

<style>
.flex-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>