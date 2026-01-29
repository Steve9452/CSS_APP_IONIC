<template>
    <ion-content :fullscreen="true">
        <div v-if="fetching" class="flex-center my-1">
            <ion-progress-bar type="indeterminate"></ion-progress-bar>
        </div>
        <div class="container">
            <div class="row justify-content-center align-items-center" style="min-height: 100vh;">
                <div class="col-md-12 my-5" v-if="!processCompleted">
                    <div style="width:80vw; height:auto; margin: auto; margin-bottom: 1em;">
                        <div class="flex-center" style="width:100%; height:auto">
                            <logotype></logotype>
                        </div>
                    </div>

                    <div class="form-group">
                        <ion-router-link class="d-block text-center" href="/login" color="medium">
                            ¿Ya tienes cuenta?
                        </ion-router-link>
                    </div>

                    <div class="form-group">
                        <label class="text-muted"><i class="far fa-id-card"></i>&nbsp;Carnet</label>
                        <input v-model="user.carnet" type="text" class="form-control custom-form"
                            placeholder="Ingrese su carnet">
                        <div class="text-danger">{{ validation.firstError('user.carnet') }}</div>
                    </div>

                    <div class="form-group">
                        <label class="text-muted"><i class="fas fa-align-center"></i>&nbsp;Nombres</label>
                        <input v-model="user.fname" type="text" class="form-control custom-form"
                            placeholder="Ingrese sus nombres">
                        <div class="text-danger">{{ validation.firstError('user.fname') }}</div>
                    </div>

                    <div class="form-group">
                        <label class="text-muted"><i class="fas fa-align-center"></i>&nbsp;Apellidos</label>
                        <input v-model="user.lname" type="text" class="form-control custom-form"
                            placeholder="Ingrese sus apellidos">
                        <div class="text-danger">{{ validation.firstError('user.lname') }}</div>
                    </div>

                    <div class="form-group">
                        <label class="text-muted"><i class="fas fa-female"></i><i
                                class="fas fa-male"></i>&nbsp;Género</label>
                        <ion-select placeholder="Seleccionar" v-model="user.gender">
                            <ion-select-option value="F">Femenino</ion-select-option>
                            <ion-select-option value="M">Masculino</ion-select-option>
                            <ion-select-option value="O">Otro</ion-select-option>
                        </ion-select>
                        <div class="text-danger">{{ validation.firstError('user.gender') }}</div>
                    </div>

                    <div class="form-group">
                        <label class="text-muted"><i class="fas fa-university"></i>&nbsp;Facultad</label>
                        <ion-select v-model="user.faculty" placeholder="Seleccionar" cancel-text="Cancelar">
                            <ion-select-option v-for="item in faculties" :key="item.idFacultad"
                                :value="item.idFacultad">
                                {{ item.nombre }}
                            </ion-select-option>
                        </ion-select>
                        <div class="text-danger">{{ validation.firstError('user.faculty') }}</div>
                    </div>

                    <div class="form-group">
                        <label class="text-muted"><i class="fas fa-graduation-cap"></i>&nbsp;Carrera</label>
                        <ion-select placeholder="Seleccionar" v-model="user.collegeCareer"
                            :disabled="isCollegeCareersDisabled" cancel-text="Cancelar">
                            <ion-select-option v-for="item in collegeCareers" :key="item.idCarrera"
                                :value="item.idCarrera">
                                {{ item.nombre }}
                            </ion-select-option>
                        </ion-select>
                        <div class="text-danger">{{ validation.firstError('user.collegeCareer') }}</div>
                    </div>

                    <div class="form-group">
                        <label class="text-muted"><i class="fas fa-graduation-cap"></i>&nbsp;Año de carrera</label>
                        <ion-select placeholder="Seleccionar" v-model="user.profile"
                            :disabled="isCollegeCareersDisabled" cancel-text="Cancelar">
                            <ion-select-option :key="1" :value="1">
                                Primer Año
                            </ion-select-option>
                            <ion-select-option :key="2" :value="2">
                                Segundo Año
                            </ion-select-option>
                            <ion-select-option :key="3" :value="3">
                                Tercer Año
                            </ion-select-option>
                            <ion-select-option :key="4" :value="4">
                                Cuarto Año
                            </ion-select-option>
                            <ion-select-option :key="5" :value="5">
                                Quinto Año
                            </ion-select-option>
                            <ion-select-option :key="6" :value="6">
                                Egresado Año
                            </ion-select-option>
                        </ion-select>
                        <div class="text-danger">{{ validation.firstError('user.profile') }}</div>
                    </div>

                    <div class="form-group mt-4">
                        <ion-button mode="ios" expand="block" :disabled="fetching" @click="Register()">
                            Crear cuenta
                        </ion-button>
                        <br>
                        <ion-router-link class="d-block text-center" href="/forgot-password" color="medium">
                            ¿Olvidaste tu contraseña?
                        </ion-router-link>
                    </div>
                </div>
                <div class="col-md-12 mx-4" v-else>
                    <!-- <img src="/assets/img/success.svg" class="img-fluid"> -->
                    <h1 class="mb-4 text-primary text-center font-weight-bolder">
                        Bienvenido Al Centro de Servicio Social
                    </h1>
                    <p class="confirm-text">
                        Se envió un correo a tu bandeja de entrada, favor verifica tu cuenta y completa el proceso de
                        registro ahí.
                    </p>
                    <ion-button mode="ios" expand="block" href="/login">
                        Regresar
                    </ion-button>
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
            processCompleted: false,
            user: {
                carnet: '',
                fname: '',
                lname: '',
                gender: '',
                faculty: '',
                collegeCareer: '',
                profile: '',
            },
            fetching: true,
            faculties: [],
            collegeCareers: []
        };
    },
    async created() {
        this.getAllFaculties();
    },
    validators: {
        'user.carnet': function (value) {
            return Validator.value(value).required('El carnet es obligatorio.');
        },
        'user.fname': function (value) {
            return Validator.value(value)
                .required('El nombre es obligatorio.')
                .maxLength(150, 'El nombre no debe contener más de 150 caracteres.');
        },
        'user.lname': function (value) {
            return Validator.value(value)
                .required('El apellido es obligatorio.')
                .maxLength(150, 'El apellido no debe contener más de 150 caracteres.');
        },
        'user.gender': function (value) {
            return Validator.value(value).required('El sexo/género es obligatorio.');
        },
        'user.faculty': function (value) {
            return Validator.value(value).required('La facultad es obligatoria.');
        },
        'user.collegeCareer': function (value) {
            return Validator.value(value).required('El carrera es obligatoria.');
        },
        'user.profile': function (value) {
            return Validator.value(value).required('El año de carrera es obligatorio.');
        },
    },
    methods: {
        async Register() {
            const validation = await this.$validate();
            if (validation) {
                this.fetching = true;
                let correo = this.user.carnet;
                if (!correo.includes('@')) {
                    correo = correo + '@uca.edu.sv';
                }
                try {
                    const API_ENDOINT = this.getAPIEndpoint();
                    const request = await fetch(API_ENDOINT + '/registro', {
                        method: "POST",
                        body: JSON.stringify({
                            correo: correo,
                            nombres: this.user.fname,
                            apellidos: this.user.lname,
                            genero: this.user.gender,
                            carrera: this.user.collegeCareer,
                            perfil: this.user.profile,
                        }),
                        headers: { "Content-type": "application/json; charset=UTF-8" }
                    })
                    const data = await request.json()

                    if (request.status === 200) {
                        this.processCompleted = true;
                    }
                    else if (request.status === 400 && data.correo != undefined) {
                        this.showErrorToast('El carnet ya está registrado');
                    }
                    else {
                        localStorage.removeItem('user');
                        this.showErrorToast('Ups! Algo salió mal.');
                    }
                    this.fetching = false;
                } catch (e) {
                    this.showErrorToast('Revisa tu conexión e intenta despues.');
                    this.fetching = false;
                }

            } else {
                this.FormValidationFailed();
            }

        },
        async getAllFaculties() {
            this.fetching = true
            const API_ENDOINT = this.getAPIEndpoint();
            const request = await fetch(API_ENDOINT + `/getFacultades`);
            const data = await request.json();

            if (request.status === 200) {
                this.faculties = data;
            } else {
                this.showErrorToast('Algo salio mal al cargar las facultades.');
            }
            this.fetching = false
        },


    },
    computed: {
        isCollegeCareersDisabled: function () {
            return this.collegeCareers.length > 0 ? false : true;
        }
    },
    watch: {
        'user.faculty': async function () {
            if (this.user.faculty != null && this.user.faculty != '') {
                this.fetching = true
                const API_ENDOINT = this.getAPIEndpoint();
                const request = await fetch(API_ENDOINT + `/getCarrerasPorFacultad/${this.user.faculty}`);
                const data = await request.json();

                if (request.status === 200) {
                    this.collegeCareers = data;
                } else {
                    this.showErrorToast('Algo salio mal al obtener las carreras.');
                }
                this.fetching = false
            } else {
                this.collegeCareers = [];
            }
        }
    },
}
</script>
<style lang="css" scoped>
    .confirm-text {
        font-size: 1.4em;
        padding-top: 1em;
        padding-bottom: 0.5em;
    }
</style>
