<template>
    <div class="ion-padding font-size-14 pt-0">
        <div class="form-group">
            <label class="text-muted font-weight-bold text-uppercase"><i
                    class="fas fa-align-center"></i>&nbsp;Contraparte</label>
            <input v-model="project.counterpart" type="text" class="form-control custom-form" placeholder="Contraparte">
            <div class="text-danger">{{ validation.firstError('project.counterpart') }}</div>
        </div>

        <div class="form-group">
            <label class="text-muted font-weight-bold text-uppercase"><i
                    class="fas fa-align-center"></i>&nbsp;Proyecto</label>
            <input v-model="project.name" type="text" class="form-control custom-form"
                placeholder="Nombre del Proyecto">
            <div class="text-danger">{{ validation.firstError('project.name') }}</div>
        </div>

        <div class="form-group">
            <label class="text-muted font-weight-bold text-uppercase"><i class="fas fa-align-center"></i>&nbsp;Perfil
                del estudiante</label>
            <textarea v-model="project.profile" class="form-control custom-form"
                placeholder="Perfil del estudiante"></textarea>
            <div class="text-danger">{{ validation.firstError('project.profile') }}</div>
        </div>

        <div class="form-group">
            <label class="text-muted font-weight-bold text-uppercase"><i class="far fa-user"></i>Encargado</label>
            <input v-model="project.owner" type="text" class="form-control custom-form"
                placeholder="Encargado del Proyecto">
            <div class="text-danger">{{ validation.firstError('project.owner') }}</div>
        </div>

        <div class="form-group">
            <label class="text-muted font-weight-bold text-uppercase"><i
                    class="fas fa-envelope-open-text"></i>&nbsp;Correo</label>
            <input v-model="project.ownerEmail" type="text" class="form-control custom-form"
                placeholder="Correo del Encargado">
            <div class="text-danger">{{ validation.firstError('project.ownerEmail') }}</div>
        </div>

        <div class="form-group">
            <label class="text-muted font-weight-bold text-uppercase"><i
                    class="fas fa-people-arrows"></i>&nbsp;Cupos</label>
            <input v-model="project.spaces" type="number" class="form-control custom-form"
                placeholder="Numero de cupos">
            <div class="text-danger">{{ validation.firstError('project.spaces') }}</div>
        </div>

        <div class="form-group">
            <label class="text-muted font-weight-bold text-uppercase"><i class="far fa-clock"></i>&nbsp;Tipo de
                Horas</label>
            <ion-select placeholder="Seleccionar" v-model="project.hoursType" cancel-text="Cancelar">
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
            <label class="text-muted font-weight-bold text-uppercase"><i
                    class="fas fa-align-center"></i>&nbsp;Descripción Adicional</label>
            <textarea v-model="project.description" class="form-control custom-form"
                placeholder="Descripcion"></textarea>
            <div class="text-danger">{{ validation.firstError('project.description') }}</div>
        </div>

        <div class="form-group">
            <label class="text-muted font-weight-bold text-uppercase"><i class="far fa-calendar-alt"></i>&nbsp;Fecha de
                Inicio</label>
            <ion-datetime v-model="project.startDate" display-format="YYYY/MM/DD"
                picker-format="DD/MM/YYYY"></ion-datetime>
            <div class="text-danger">{{ validation.firstError('project.startDate') }}</div>
        </div>

        <div class="form-group">
            <label class="text-muted font-weight-bold text-uppercase"><i class="far fa-calendar-alt"></i>&nbsp;Fecha de
                Finalización</label>
            <ion-datetime v-model="project.endDate" display-format="YYYY/MM/DD"
                picker-format="DD/MM/YYYY"></ion-datetime>
            <div class="text-danger">{{ validation.firstError('project.endDate') }}</div>
        </div>

        <!-- <div class="form-group">
        <label class="text-muted font-weight-bold text-uppercase"><i class="fas fa-graduation-cap"></i>&nbsp;Carreras</label>
        <ion-select
            class="custom-options"
            placeholder="Seleccionar"
            v-model="project.careers"
            cancel-text="Cancelar"
            multiple>
                <ion-select-option
                    v-for="item in collegeCareers"
                    :key="item.idCarrera"
                    :value="item.idCarrera"
                    
                    selectInterfaceOptions="popover"
                    
                    >
                        {{ item.nombre }}
                </ion-select-option>
        </ion-select>
    </div> -->

        <!-- <div class="form-group">
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
    </div> -->


        <label class="text-muted font-weight-bold text-uppercase">
            Carrera/Rango
        </label>

        <!-- Seleecionar las carreras -->
        <div v-if="editCarreras" class="form-group mb-4">
            <div v-if="!editSelectAllCarrers">

                <ion-button size="small" mode="ios" class="pl-0" xpand="block" color="medium"
                    @click="editSelectAllCarrers = true; selectedAllCarrers=false">
                    Seleccionar de forma individual
                </ion-button>
                <p class="pt-3">
                    Seleccionando todas las carreras excepto Ing.Civil y Lic. Psicologia desde/hasta
                </p>
                <div class="form-group">
                    <div class="d-flex" style="gap: 0.5rem">
                        <ion-select class="form-control custom-form" placeholder="Desde" v-model="allFrom">
                            <ion-select-option v-for="perfil in arrayPerfiles" :value="perfil.idPerfil"
                                :key="perfil.idPerfil">
                                {{ perfil.perfil }}
                            </ion-select-option>
                        </ion-select>
                        <ion-select class="form-control custom-form" placeholder="Desde" v-model="allTo">
                            <ion-select-option v-for="perfil in arrayPerfiles" :value="perfil.idPerfil"
                                :key="perfil.idPerfil">
                                {{ perfil.perfil }}
                            </ion-select-option>
                        </ion-select>
                        
                    </div>
                    <div v-if="errorInProjectsRange" class="text-danger"> Debes escoger un rango valido </div>
                </div>

                <ion-button size="small" mode="ios" id="agregarACP" type="button"
                    @click="toogleEditProjects(all=true)" color="success">
                    Guardar seleccion
                </ion-button>
            </div>

            <div v-if="editSelectAllCarrers">
                <ion-button size="small" mode="ios" class="pl-0" xpand="block" color="medium"
                    @click="editSelectAllCarrers = false">
                    Seleccionar todas las carreras
                </ion-button>
                <p class="pt-3">
                    Seleccionando carreras de forma individual
                </p>
                <div class="form-group " v-for="(acp, key) in this.project.careers" :key="acp.id">
                    <div class="d-flex flex-column" style="gap: 0.5rem">
                        <div>
                            <ion-select placeholder="Carrera" v-model="acp[0]">
                                <ion-select-option v-for="carrera in collegeCareers" :value="carrera.idCarrera"
                                    :key="carrera.idCarrera">
                                    {{ carrera.nombre }}
                                </ion-select-option>
                            </ion-select>
                        </div>

                        <div class="d-flex" style="gap: 1rem">
                            <ion-select class="form-control custom-form" placeholder="Desde" v-model="acp[1]">
                                <ion-select-option v-for="perfil in arrayPerfiles" :value="perfil.idPerfil"
                                    :key="perfil.idPerfil">
                                    {{ perfil.perfil }}
                                </ion-select-option>
                            </ion-select>

                            <ion-select class="form-control custom-form" placeholder="Hasta" v-model="acp[2]">
                                <ion-select-option v-for="perfil in arrayPerfiles" :value="perfil.idPerfil"
                                    :key="perfil.idPerfil">
                                    {{ perfil.perfil }}
                                </ion-select-option>
                            </ion-select>
                        </div>
                    </div>

                    <div class="mt-2">
                        <ion-button size="small" fill="clear" mode="ios" id="borrarACP" type="button"
                            @click="borrarACP(key)" color="danger">
                            Borrar
                        </ion-button>
                    </div>
                </div>
                <!-- :disabled="disabledBotonAgregarCarrera()" -->
                <ion-button size="small" mode="ios" id="agregarACP" type="button" @click="agregarACP()" color="primary">
                    Agregar carrera
                </ion-button>
                <ion-button size="small" mode="ios" id="agregarACP" type="button" @click="toogleEditProjects(all=false)"
                    color="success">
                    Guardar carreras
                </ion-button>
            </div>

            <div v-if="errorInProjectsEmpty" class="text-danger"> Debes escoger una carrera </div>
            <div v-if="errorInProjectsRange" class="text-danger"> Debes escoger un rango valido </div>
            <div v-if="errorInProjectsRepeted" class="text-danger"> Hay carreras repetidas </div>

        </div>

        <!-- Mostrar las carreras  -->
        <div v-else class="form-group">

            <ion-list v-if="selectedAllCarrers">
                <p class="pt-2">
                    Seleccionando todas las carreras excepto Ing.Civil y Lic. Psicologia desde <b> {{ arrayPerfiles[allFrom-1].perfil }} </b> hasta <b> {{ arrayPerfiles[allTo-1].perfil }} </b>
                </p>
            </ion-list>

            <ion-list v-else>
                <ion-item class="form-group" v-for="acp in this.project.careers" :key="acp.id">
                    <div>
                        <div class="d-flex flex-column">

                            <p class="mb-0 font-weight-bold">
                                {{ collegeCareers[acp[0] - 1].nombre }}
                            </p>
                        </div>
                        <div>
                            <p class="mb-3">
                                {{ `${arrayPerfiles[acp[1] - 1].perfil} - ${arrayPerfiles[acp[2] - 1].perfil}` }}
                            </p>
                        </div>
                    </div>
                </ion-item>
            </ion-list>
            <ion-button size="small" mode="ios" class="col-5 pl-0" xpand="block" color="warning"
                @click="toogleEditProjects()">
                Editar carreras
            </ion-button>


        </div>

        <div class="form-group">
            <ion-button :disabled="editCarreras" mode="ios" expand="block" color="primary" @click="StoreProject()">
                Crear proyecto
            </ion-button>
            <div v-if="editCarreras" class="text-danger"> Primero debes guardar las carreras </div>


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
            arrayPerfiles: [],
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
                careers: [[null, 1, 6]],
                profile: ''
            },
            allFrom: 1,
            allTo: 6,
            errorInProjectsEmpty: false,
            errorInProjectsRepeted: false,
            errorInProjectsRange: false,
            editCarreras: true,
            editSelectAllCarrers: true,
            selectedAllCarrers: false,
        };
    },
    async created() {
        this.apiToken = await this.getApiToken();
        this.getAllCollegeCareers();
        this.arrayPerfiles = this.setPerfiles();

        //  Alternativa para cambiar el estilo de los selects, actualmente se encuentra en el archivo global styles.scss


        //     const selects = document.querySelectorAll('.custom-options');

        //     for (let i = 0; i < selects.length; i++) {
        //     selects[i].interfaceOptions = {
        //         cssClass: 'my-custom-interface',
        //     };
        // }
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
        'project.profile': function (value) {
            return Validator.value(value).required('El campo perfil del estudiante es obligatorio.');
        }
    },
    methods: {
        setPerfiles() {
            return [
                {
                    idPerfil: 1,
                    perfil: "Primer Año"
                },
                {
                    idPerfil: 2,
                    perfil: "Segundo Año"
                },
                {
                    idPerfil: 3,
                    perfil: "Tercer Año"
                },
                {
                    idPerfil: 4,
                    perfil: "Cuarto Año"
                },
                {
                    idPerfil: 5,
                    perfil: "Quinto Año"
                },
                {
                    idPerfil: 6,
                    perfil: "Egresado"
                },
            ]
        },
        agregarACP() {

            const len = this.project.careers.length
            const lastC = this.project.careers[len - 1]


            if (lastC[0] != null) {
                this.errorInProjectsEmpty = false;
                this.project.careers.push([null, 1, 6])
            } else {
                this.errorInProjectsEmpty = true;
            }


            // Validar carreras

        },
        borrarACP(key) {
            if (this.project.careers.length > 1) {
                this.project.careers.splice(key, 1)
            }
        },
        toogleEditProjects(all=null) {

            if(all==null) {
                this.editCarreras = !this.editCarreras
                return
            }

            if (all) {
                if(this.allFrom < this.allTo){
                    this.editSelectAllCarrers = false;
                    this.errorInProjectsRange = false;
                    this.selectedAllCarrers = true;
                }else{
                    this.errorInProjectsRange = true;
                }
            } else {

                const selectedCareers = new Set()
                this.errorInProjectsEmpty = false;
                this.errorInProjectsRange = false;

                this.project.careers.forEach(el => {
                    if (el[0] == null) {
                        this.errorInProjectsEmpty = true;
                    }

                    if (selectedCareers.has(el[0])) {
                        this.errorInProjectsRepeted = true;
                    } else {
                        selectedCareers.add(el[0])

                    }

                    if(el[1] >= el[2]){
                        this.errorInProjectsRange = true;
                    }

                    if (selectedCareers.size == this.project.careers.length) {
                        this.errorInProjectsRepeted = false
                    }



                });

            }

            if (!this.errorInProjectsRange && !this.errorInProjectsEmpty && !this.errorInProjectsRepeted) {

                this.editCarreras = !this.editCarreras
            }


        },
        async StoreProject() {
            const validation = await this.$validate();
            if (validation) {
                const API_ENDOINT = this.getAPIEndpoint();

                // const selectedCareers = [];
                // this.project.careers.forEach((element) => {
                //     const career = [];
                //     career[0] = element;
                //     career[1] = parseInt(this.project.desde) ? parseInt(this.project.desde) : 0;
                //     career[2] = parseInt(this.project.hasta) ? parseInt(this.project.hasta) : 0;
                //     selectedCareers.push(career);
                // });


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
                        carreraPerfil: this.project.careers,
                        // eslint-disable-next-line
                        perfil_estudiante: this.project.profile,
                        // eslint-disable-next-line
                        estado_proyecto: 'En curso',
                        aplicarTodasCarreras: this.selectedAllCarrers,
                        // eslint-disable-next-line
                        p_lim_inf: this.allFrom,
                        // eslint-disable-next-line
                        p_lim_sup: this.allTo,
                    }),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        'Authorization': 'Bearer ' + this.apiToken
                    }
                })

                if (request.status === 200) {
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

            if (request.status === 200) {
                this.collegeCareers = data;
            } else {
                this.showErrorToast('Algo salió mal al obtener las carreras.');
            }
        }
    }
}
</script>
<style>
.my-custom-interface .select-interface-option .alert-checkbox-label {
    white-space: pre-line;
}

.font-size-14 {
    font-size: 14px;
}
</style>