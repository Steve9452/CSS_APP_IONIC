<template>
    <ion-content :fullscreen="true">
        <div class="container">
            <div class="row justify-content-center align-items-center" style="min-height: 100vh;">
                <div class="col">
                    <div class="flex-center">

                        <img src="/assets/img/uca.png" style="width: 5em;">
                        <p style="margin-left: 20px; margin-bottom: 10px;  font-size: 2em; "> Centro de Servicio Social
                        </p>

                    </div>

                    <div class="form-group mt-3">
                        <label class="text-muted"><i class="far fa-id-card"></i>&nbsp;Carnet</label>
                        <input v-model="user.carnet" type="text" class="form-control custom-form"
                            placeholder="Ingrese su carnet">
                        <div class="text-danger">{{ validation.firstError('user.carnet') }}</div>
                    </div>

                    <div class="form-group mt-3">
                        <ion-button expand="block" @click="ForgotPassword()">
                            RESTAURAR CLAVE
                        </ion-button>
                    </div>

                    <div class="form-group mt-3">
                        <ion-button color="dark" expand="block" href="/login">
                            REGRESAR
                        </ion-button>
                    </div>
                </div>
            </div>
        </div>
    </ion-content>
</template>


<script>
import SimpleVueValidator from 'simple-vue-validator';
const Validator = SimpleVueValidator.Validator;

export default {
    mixins: [SimpleVueValidator.mixin],
    data: function () {
        return {
            user: {
                carnet: null
            }
        };
    },
    validators: {
        'user.carnet': function (value) {
            return Validator.value(value)
                .required('El carnet es obligatorio.')
                .maxLength(100, 'El carnet no debe contener más de 100 caracteres.');
        }
    },
    methods: {
        async ForgotPassword() {
            const validation = await this.$validate();
            if (validation) {
                this.fetching = true;
                try {

                    const API_ENDOINT = this.getAPIEndpoint();
                    let correo = this.user.carnet.trim();
                    if (!correo.includes('@')) {
                        correo = correo + '@uca.edu.sv';
                    }
                    const request = await fetch(API_ENDOINT + '/olvide-clave', {
                        method: "POST",
                        body: JSON.stringify({
                            correo: correo
                        }),
                        headers: { "Content-type": "application/json; charset=UTF-8" }
                    })

                    if (request.status === 200) {
                        window.location = '/reset-password';
                    }else if(request.status === 400){
                        
                        this.showErrorToast('Carnet no registrado.');
                    }
                    else {
                        this.showErrorToast('Ups! Algo salió mal.');
                    }
                    this.fetching = false;
                } catch (e) {
                    this.showErrorToast('Revisa tu conexión a internet e intenta despues');
                    this.fetching = false;
                }
            } else {
                this.FormValidationFailed();
            }
        }
    },
}
</script>