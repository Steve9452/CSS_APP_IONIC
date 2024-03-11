<template>
<div class="ion-padding">
    <div class="form-group">
        <label class="text-muted font-weight-bold text-uppercase"><i class="fas fa-align-center"></i>&nbsp;Contraparte</label>
        <input v-model="project.counterpart" type="text" class="form-control custom-form" placeholder="Contraparte">
        <div class="text-danger">{{ validation.firstError('project.counterpart') }}</div>
    </div>

    <div class="form-group">
        <label class="text-muted font-weight-bold text-uppercase"><i class="fas fa-align-center"></i>&nbsp;Proyecto</label>
        <input v-model="project.name" type="text" class="form-control custom-form" placeholder="Nombre del Proyecto">
        <div class="text-danger">{{ validation.firstError('project.name') }}</div>
    </div>

    <div class="form-group">
        <label class="text-muted font-weight-bold text-uppercase"><i class="fas fa-align-center"></i>&nbsp;Perfil del estudiante</label>
        <textarea v-model="project.profile" class="form-control custom-form" placeholder="Perfil del estudiante"></textarea>
        <div class="text-danger">{{ validation.firstError('project.profile') }}</div>
    </div>

    <div class="form-group">
        <label class="text-muted font-weight-bold text-uppercase"><i class="far fa-user"></i>Encargado</label>
        <input v-model="project.owner" type="text" class="form-control custom-form" placeholder="Encargado del Proyecto">
        <div class="text-danger">{{ validation.firstError('project.owner') }}</div>
    </div>

    <div class="form-group">
        <label class="text-muted font-weight-bold text-uppercase"><i class="fas fa-envelope-open-text"></i>&nbsp;Correo</label>
        <input v-model="project.ownerEmail" type="text" class="form-control custom-form" placeholder="Correo del Encargado">
        <div class="text-danger">{{ validation.firstError('project.ownerEmail') }}</div>
    </div>

    <div class="form-group">
        <label class="text-muted font-weight-bold text-uppercase"><i class="fas fa-people-arrows"></i>&nbsp;Cupos</label>
        <input v-model="project.spaces" type="number" class="form-control custom-form" placeholder="Numero de cupos">
        <div class="text-danger">{{ validation.firstError('project.spaces') }}</div>
    </div>

    <div class="form-group">
        <label class="text-muted font-weight-bold text-uppercase"><i class="far fa-clock"></i>&nbsp;Tipo de Horas</label>
        <ion-select
            placeholder="Seleccionar"
            v-model="project.hoursType"
            cancel-text="Cancelar">
                <ion-select-option value="Internas">Internas</ion-select-option>
                <ion-select-option value="Externas">Externas</ion-select-option>
        </ion-select>
        <div class="text-danger">{{ validation.firstError('project.hoursType') }}</div>
    </div>

    <div class="form-group">
        <label class="text-muted font-weight-bold text-uppercase"><i class="far fa-clock"></i>&nbsp;Horario</label>
        <input v-model="project.schedule" type="text" class="form-control custom-form" placeholder="Horario">
        <div class="text-danger">{{ validation.firstError('project.schedule') }}</div>
    </div>

    <div class="form-group">
        <label class="text-muted font-weight-bold text-uppercase"><i class="fas fa-align-center"></i>&nbsp;Descripción Adicional</label>
        <textarea v-model="project.description" class="form-control custom-form" placeholder="Descripcion"></textarea>
        <div class="text-danger">{{ validation.firstError('project.description') }}</div>
    </div>

    <div class="form-group">
        <label class="text-muted font-weight-bold text-uppercase"><i class="far fa-calendar-alt"></i>&nbsp;Fecha de Inicio</label>
        <ion-datetime v-model="project.startDate" display-format="YYYY/MM/DD" picker-format="DD/MM/YYYY"></ion-datetime>
        <div class="text-danger">{{ validation.firstError('project.startDate') }}</div>
    </div>

    <div class="form-group">
        <label class="text-muted font-weight-bold text-uppercase"><i class="far fa-calendar-alt"></i>&nbsp;Fecha de Finalización</label>
        <ion-datetime v-model="project.endDate" display-format="YYYY/MM/DD" picker-format="DD/MM/YYYY"></ion-datetime>
        <div class="text-danger">{{ validation.firstError('project.endDate') }}</div>
    </div>

    <div class="form-group">
        <label class="text-muted font-weight-bold text-uppercase"><i class="fas fa-graduation-cap"></i>&nbsp;Carreras</label>
        <ion-select
            placeholder="Seleccionar"
            v-model="project.careers"
            cancel-text="Cancelar"
            multiple>
                <ion-select-option
                    v-for="item in collegeCareers"
                    :key="item.idCarrera"
                    :value="item.idCarrera">
                        {{ item.nombre }}
                </ion-select-option>
        </ion-select>
    </div>

    <div class="form-group">
        <label class="text-muted font-weight-bold text-uppercase"><i class="far fa-clock"></i>&nbsp;Desde</label>
        <ion-select
            placeholder="Seleccionar"
            v-model="project.desde"
            cancel-text="Cancelar">
                <ion-select-option value="1">Primer año</ion-select-option>
                <ion-select-option value="2">Segundo año</ion-select-option>
                <ion-select-option value="3">Tercer año</ion-select-option>
                <ion-select-option value="4">Cuarto año</ion-select-option>
                <ion-select-option value="5">Quinto año</ion-select-option>
                <ion-select-option value="6">Egresado</ion-select-option>

            </ion-select>
        <div class="text-danger">{{ validation.firstError('project.desde') }}</div>
    </div>
    <div class="form-group">
        <label class="text-muted font-weight-bold text-uppercase"><i class="far fa-clock"></i>&nbsp;Hasta</label>
        <ion-select
            placeholder="Seleccionar"
            v-model="project.hasta"
            cancel-text="Cancelar">
                <ion-select-option value="1">Primer año</ion-select-option>
                <ion-select-option value="2">Segundo año</ion-select-option>
                <ion-select-option value="3">Tercer año</ion-select-option>
                <ion-select-option value="4">Cuarto año</ion-select-option>
                <ion-select-option value="5">Quinto año</ion-select-option>
                <ion-select-option value="6">Egresado</ion-select-option>

            </ion-select>
        <div class="text-danger">{{ validation.firstError('project.hasta') }}</div>
    </div>
    <div class="form-group">
        <ion-button expand="block" color="primary" @click="StoreProject()">
            GUARDAR
        </ion-button>
    </div>
</div>
</template>

<script>
import SimpleVueValidator from 'simple-vue-validator';
const Validator = SimpleVueValidator.Validator;

export default {
    mixins: [SimpleVueValidator.mixin],
    data: function () {
        return {
            apiToken: '',
            collegeCareers: [],
            project: {
                name: '',
                status: '',
                counterpart: '',
                spaces: '',
                description: '',
                owner: '',
                startDate: '',
                endDate: '',
                schedule: '',
                hoursType: '',
                ownerEmail: '',
                careers: [],
                desde: '',
                hasta: '',
                profile: ''
            }
        };
    },
    async created() {
        this.apiToken = await this.getApiToken();
        this.getAllCollegeCareers();
    },
    validators: {
        'project.name': function (value) {
            return Validator.value(value).required('El nombre es obligatorio.');
        },
        'project.counterpart': function (value) {
            return Validator.value(value).required('El campo contraparte es obligatorio.');
        },
        'project.spaces': function (value) {
            return Validator.value(value).required('El campo cupos es obligatorio.');
        },
        'project.description': function (value) {
            return Validator.value(value);
        },
        'project.owner': function (value) {
            return Validator.value(value).required('El campo encargado es obligatorio.');
        },
        'project.startDate': function (value) {
            return Validator.value(value).required('El campo fecha de inicio es obligatorio.');
        },
        'project.endDate': function (value) {
            return Validator.value(value).required('El campo fecha de finalización es obligatorio.');
        },
        'project.schedule': function (value) {
            return Validator.value(value).required('El campo horario es obligatorio.');
        },
        'project.hoursType': function (value) {
            return Validator.value(value).required('El campo tipo de horas es obligatorio.');
        },
        'project.ownerEmail': function (value) {
            return Validator
                .value(value).required('El campo correo del encargado es obligatorio.')
                .maxLength(100, 'El correo no debe contener más 100 caracteres.')
                .email('Ingrese un correo valido.');
        },
        'project.desde': function (value) {
            return Validator.value(value).required('El campo desde es obligatorio.');
        },
        'project.hasta': function (value) {
            return Validator.value(value).required('El campo hasta es obligatorio.');
        },
        'project.profile': function (value) {
            return Validator.value(value).required('El campo perfil del estudiante es obligatorio.');
        }
    },
    methods: {
        async StoreProject() {
            const validation = await this.$validate();
            if(validation) {
                const API_ENDOINT = this.getAPIEndpoint();
                
                const selectedCareers = [];
                this.project.careers.forEach((element) => {
                    const career = [];
                        career[0] = element;
                        career[1] = parseInt(this.project.desde) ? parseInt(this.project.desde) : 0;
                        career[2] = parseInt(this.project.hasta) ? parseInt(this.project.hasta) : 0;
                    selectedCareers.push(career);
                });


                const request = await fetch(API_ENDOINT + "/admin/storeProyecto", {
                    method: "POST",
                    // eslint-disable-next-line
                    body: JSON.stringify({
                        nombre: this.project.name,
                        contraparte: this.project.counterpart,
                        // eslint-disable-next-line
                        cupos_act: 0,
                        cupos: this.project.spaces,
                        descripcion: this.project.description,
                        encargado: this.project.owner,
                        estado: 1,
                        // eslint-disable-next-line
                        fecha_inicio: this.project.startDate.substring(0, 10),
                        // eslint-disable-next-line
                        fecha_fin: this.project.endDate.substring(0, 10),
                        horario: this.project.schedule,
                        // eslint-disable-next-line
                        tipo_horas: this.project.hoursType,
                        // eslint-disable-next-line
                        correo_encargado: this.project.ownerEmail,
                        carreraPerfil: selectedCareers,
                        // eslint-disable-next-line
                        perfil_estudiante: this.project.profile,
                        // eslint-disable-next-line
                        estado_proyecto: 'En curso'
                    }),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        'Authorization': 'Bearer ' + this.apiToken
                    }
                })

                if(request.status === 200) {
                    this.showSuccessToast('Proeycto creado exitosamente.');
                    location.reload();
                    this.$emit('dataUpdated');
                } else {
                    this.showErrorToast('Algo salió mal al crear el proyecto.');
                }
            } else {
                this.FormValidationFailed();
            }
        },
        async getAllCollegeCareers() {
            const API_ENDOINT = this.getAPIEndpoint();
            const request = await fetch(API_ENDOINT + "/getCarreras");

            const data = await request.json();

            if(request.status === 200) {
                this.collegeCareers = data;
            } else {
                this.showErrorToast('Algo salió mal al obtener las carreras.');
            }
        }
    }
}
</script>