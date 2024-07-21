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

                    <div class="form-group mt-3">
                        <label class="text-muted"><i class="far fa-id-card"></i>&nbsp;Carnet</label>
                        <input v-model="user.carnet" type="text" class="form-control custom-form"
                            placeholder="Ingrese su carnet">
                        <div class="text-danger">{{ validation.firstError('user.carnet') }}</div>
                    </div>

                    <div class="form-group mt-3">
                        <ion-button mode="ios" expand="block" :disabled="fetching" @click="ForgotPassword()">
                            Restaurar Clave
                        </ion-button>
                    </div>

                    <div class="form-group mt-3">
                        <ion-button mode="ios" color="dark" expand="block" href="/login">
                            Regresar
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
            fetching: false,
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
                    const request = await fetch(API_ENDOINT + '/forgottenPassword', {
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