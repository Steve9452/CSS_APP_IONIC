<template>
    <ion-header class="ion-no-border" translucent>
        <ion-toolbar>
            <ion-buttons slot="start">
                <ion-button @click="closeModal()"><ion-icon color="light" :icon="arrowBackOutline"></ion-icon></ion-button>
            </ion-buttons>
            <ion-title>
                <ion-text color="light">
                        Editar proyecto 
                </ion-text>
            </ion-title>
            <ion-progress-bar v-if="fetching" type="indeterminate"></ion-progress-bar>


        </ion-toolbar>
    </ion-header>


    <ion-toolbar>
        <ion-segment :value="view">

            <ion-segment-button value="general" @click="view = 'general';">
                <ion-label>
                    <small>General</small>
                </ion-label>
            </ion-segment-button>

            <ion-segment-button value="students" @click="view = 'students';">
                <ion-label><small>Estudiantes</small></ion-label>
            </ion-segment-button>

            <ion-segment-button value="reunion" @click="view = 'reunion';">
                <ion-label>
                    <small>Reunion</small>
                </ion-label>
            </ion-segment-button>

            <ion-segment-button value="change-status" @click="view = 'change-status';" :hidden="disableStatus">
                <ion-label>
                    <small>Cambiar estado</small>
                </ion-label>
            </ion-segment-button>
        </ion-segment>
    </ion-toolbar>

    <ion-content>
        <ion-card class="my-3" color="" v-if="view === 'general'">
            <ion-card-content>
                <div class="form-group py-3 border-top border-bottom">
                    <h2 class="text-center text-muted font-weight-bold">
                        Información del Proyecto
                    </h2>
                </div>
                <div class="form-group">
                    <label class="text-muted font-weight-bold text-uppercase"><i
                            class="fas fa-align-center"></i>&nbsp;Contraparte</label>
                    <input v-model="project.counterpart" type="text" class="form-control custom-form"
                        placeholder="Contraparte" :disabled="disableInput">
                    <div class="text-danger">{{ validation.firstError('project.counterpart') }}</div>
                </div>
               <div class="form-group">
                    <label class="text-muted font-weight-bold text-uppercase"><i
                            class="fas fa-align-center"></i>&nbsp;Nombre</label>
                    <input v-model="project.name" type="text" class="form-control custom-form"
                        placeholder="Nombre del Proyecto" :disabled="disableInput">
                    <div class="text-danger">{{ validation.firstError('project.name') }}</div>
                </div>
                <div class="form-group">
                    <label class="text-muted font-weight-bold text-uppercase"><i
                            class="fas fa-align-center"></i>&nbsp;Perfil
                        del estudiante</label>
                    <textarea v-model="project.profile" class="form-control custom-form" placeholder="Perfil del estudiante"
                        :disabled="disableInput"></textarea>
                    <div class="text-danger">{{ validation.firstError('project.profile') }}</div>
                </div>
                <div class="form-group">
                    <label class="text-muted font-weight-bold text-uppercase"><i
                            class="far fa-user"></i>&nbsp;Encargado</label>
                    <input v-model="project.owner" type="text" class="form-control custom-form"
                        placeholder="Encargado del Proyecto" :disabled="disableInput">
                    <div class="text-danger">{{ validation.firstError('project.owner') }}</div>
                </div>

                <div class="form-group">
                    <label class="text-muted font-weight-bold text-uppercase"><i
                            class="fas fa-envelope-open-text"></i>&nbsp;Correo</label>
                    <input v-model="project.ownerEmail" type="text" class="form-control custom-form"
                        placeholder="Correo del Encargado" :disabled="disableInput">
                    <div class="text-danger">{{ validation.firstError('project.ownerEmail') }}</div>
                </div>

                <div class="form-group">
                    <label class="text-muted font-weight-bold text-uppercase"><i
                            class="fas fa-people-arrows"></i>&nbsp;Cupos</label>
                    <input v-model="project.spaces" type="number" class="form-control custom-form"
                        placeholder="Numero de cupos" :disabled="disableInput">
                    <div class="text-danger">{{ validation.firstError('project.spaces') }}</div>
                </div>

                <div class="form-group">
                    <label class="text-muted font-weight-bold text-uppercase"><i class="fas fa-people-arrows"></i>&nbsp;Tipo
                        de
                        Horas</label>
                    <ion-select placeholder="Seleccionar" v-model="project.hoursType" cancel-text="Cancelar">
                        <ion-select-option value="Internas">Internas</ion-select-option>
                        <ion-select-option value="Externas">Externas</ion-select-option>
                    </ion-select>
                    <div class="text-danger">{{ validation.firstError('project.hoursType') }}</div>
                </div>

                <div class="form-group">
                    <label class="text-muted font-weight-bold text-uppercase"><i
                            class="fas fa-people-arrows"></i>&nbsp;Horario</label>
                    <input v-model="project.schedule" type="text" class="form-control custom-form" placeholder="Horario"
                        :disabled="disableInput">
                    <div class="text-danger">{{ validation.firstError('project.schedule') }}</div>
                </div>

                <div class="form-group">
                    <label class="text-muted font-weight-bold text-uppercase"><i
                            class="fas fa-align-center"></i>&nbsp;Descripción</label>
                    <textarea v-model="project.description" class="form-control custom-form" placeholder="Descripcion"
                        :disabled="disableInput"></textarea>
                </div>

                


                <div class="form-group">
                    <label class="text-muted font-weight-bold text-uppercase"><i class="far fa-calendar-alt"></i>&nbsp;Fecha
                        de
                        Inicio</label>
                    <ion-datetime v-model="project.startDate" display-format="YYYY/MM/DD" picker-format="DD/MM/YYYY"
                        :disabled="disableInput"></ion-datetime>
                    <div class="text-danger">{{ validation.firstError('project.startDate') }}</div>
                </div>

                <div class="form-group">
                    <label class="text-muted font-weight-bold text-uppercase"><i class="far fa-calendar-alt"></i>&nbsp;Fecha
                        de
                        Finalización</label>
                    <ion-datetime v-model="project.endDate" display-format="YYYY/MM/DD" picker-format="DD/MM/YYYY"
                        :disabled="disableInput">
                    </ion-datetime>
                    <div class="text-danger">{{ validation.firstError('project.endDate') }}</div>
                </div>

                <div class="form-group" v-if="userRol === 1">
                    <label class="text-muted font-weight-bold text-uppercase"><i
                            class="fas fa-graduation-cap"></i>&nbsp;Carreras</label>
                    <ion-select v-model="project.careers" placeholder="Seleccionar" cancel-text="Cancelar" multiple>
                        <ion-select-option v-for="item in collegeCareers" :key="item.idCarrera" :value="item.idCarrera">
                            {{ item.nombre }}
                        </ion-select-option>
                    </ion-select>
                    <div class="text-danger">{{ validation.firstError('project.careers') }}</div>
                </div>

                <div class="form-group mt-4" v-if="!disableInput">
                    <ion-button expand="block" color="primary" @click="updateProject()">
                        ACTUALIZAR
                    </ion-button>
                </div>
                <div class="form-group">
                </div>
            </ion-card-content>
        </ion-card>


        <ion-card class="my-3" v-if="view === 'students'">
            <ion-card-content v-if="project.students.length > 0">
                <div class="form-group py-2 border-top border-bottom">
                    <h6 class="text-center text-muted font-weight-bold">
                        Solicitudes de Estudiantes
                    </h6>
                </div>

                <div v-for="student in project.students" :key="student.idUser">
                    <ion-item v-if="student.pivot.estado === 1 || userRol === 1">
                        <ion-label>
                            <h6 class="text-primary text-uppercase">{{ student.nombres }} {{ student.apellidos }}</h6>
                            <small>
                                {{ student.correo }}
                                <br>
                                <small class="text-muted">{{ student.carrera.nombre }} -
                                    {{ student.carrera.facultad.nombre }}</small>
                            </small>
                        </ion-label>

                        <ion-buttons v-if="userRol === 1 && student.pivot.estado === 0">
                            <ion-button color="success" @click="sendApplicationRequest(student, 'accept')">
                                <ion-icon :icon="checkmark"></ion-icon>
                            </ion-button>
                            <ion-button color="danger" @click="sendApplicationRequest(student, 'deny')">
                                <ion-icon :icon="closeCircle"></ion-icon>
                            </ion-button>
                        </ion-buttons>

                        <ion-badge v-else-if="student.pivot.estado === 0" color="medium">
                            <small>PENDIENTE</small>
                        </ion-badge>

                        <ion-badge v-else-if="student.pivot.estado === 1" color="primary">
                            <small>ACEPTADO</small>
                        </ion-badge>

                        <ion-badge v-else-if="student.pivot.estado === 2" color="dark">
                            <small>RECHAZADO</small>
                        </ion-badge>
                    </ion-item>
                </div>

            </ion-card-content>

            <ion-card-content v-else>
                <img src="/assets/img/success.svg" class="img-fluid d-block mx-auto mt-5" style="width:50%;">
                <h1 class="text-primary text-center font-weight-bolder">
                    Hmmm
                </h1>
                <p class="text-muted text-center">
                    Parece ser que no se encontraron registros.
                </p>
            </ion-card-content>
        </ion-card>

        <!-- Pestana Programar Reunion  -->
        <ion-card class="my-3" v-if="view === 'reunion'">
            <ion-card-content>
                <div class="form-group py-3 border-top border-bottom">
                    <h2 class="text-center text-muted font-weight-bold">
                        Programar reunion
                    </h2>
                </div>

                <div class="form-group">
                    <label class="text-muted font-weight-bold text-uppercase"><i
                            class="fas fa-align-center"></i>&nbsp;Nombre
                        del proyecto</label>
                    <input v-model="project.name" type="text" class="form-control custom-form"
                        placeholder="Nombre del Proyecto" disabled>
                    <div class="text-danger">{{ validation.firstError('project.name') }}</div>
                </div>

                <div class="form-group">
                    <label class="text-muted font-weight-bold text-uppercase"><i
                            class="fas fa-envelope-open-text"></i>&nbsp;Lugar o enlace</label>
                    <input v-model="meetingPlace" type="text" class="form-control custom-form" placeholder="">
                    <div class="text-danger">{{ validation.firstError('project.ownerEmail') }}</div>
                </div>

                <div class="form-group">
                    <label class="text-muted font-weight-bold text-uppercase"><i
                            class="fas fa-align-center"></i>&nbsp;Descripción</label>
                    <textarea v-model="meetingDescription" class="form-control custom-form"
                        placeholder="Opcional"></textarea>
                    <div class="text-danger">{{ validation.firstError('project.description') }}</div>
                </div>


                <div class="form-group">
                    <label class="text-muted font-weight-bold text-uppercase"><i
                            class="far fa-calendar-alt"></i>&nbsp;Fecha</label>
                    <ion-datetime v-model="meetingScheduleDate" display-format="DD/MM/YYYY"
                        picker-format="DD/MM/YYYY"></ion-datetime>
                    <div class="text-danger">{{ validation.firstError('project.startDate') }}</div>
                </div>

                <div class="form-group">
                    <label class="text-muted font-weight-bold text-uppercase"><i class="far fa-calendar-alt"></i>&nbsp;Hora
                        (24h)</label>
                    <ion-datetime v-model="meetingScheduleTime" display-format="HH:mm" picker-format="HH:mm">
                    </ion-datetime>
                    <div class="text-danger">{{ validation.firstError('project.endDate') }}</div>
                </div>

                <label class="text-muted font-weight-bold text-uppercase"><i
                        class="fas fa-envelope-open-text"></i>&nbsp;Miembros</label>
                <div v-for="student in project.acceptedStudents" :key="student.idUser">
                    <ion-item v-if="student.pivot.estado === 1 || userRol === 1">
                        <ion-label>
                            <h6 class="text-primary text-uppercase">{{ student.nombres }} {{ student.apellidos }}</h6>
                            <small>
                                {{ student.correo }}
                                <br>
                                <small class="text-muted">{{ student.carrera.nombre }} -
                                    {{ student.carrera.facultad.nombre }}</small>
                            </small>
                        </ion-label>



                        <ion-badge v-if="student.pivot.estado === 1" color="primary">
                            <small>ACEPTADO</small>
                        </ion-badge>


                    </ion-item>
                </div>

                <div class="form-group mt-4" v-if="!disableInput">
                    <ion-button expand="block" color="secondary" :disabled=this.meetingMailButtonStatus
                        @click="sendMeetingRequest()">
                        PROGRAMAR REUNION
                    </ion-button>
                </div>

            </ion-card-content>
        </ion-card>

        <ion-card class="my-3" v-if="view === 'change-status'" :hidden="disableStatus">
            <ion-card-content>
                <div class="form-group py-3 border-top border-bottom">
                    <h2 class="text-center text-muted font-weight-bold">
                        Estado del Proyecto
                    </h2>
                </div>

                <div class="form-group">
                    <label class="text-muted font-weight-bold text-uppercase"><i
                            class="fas fa-people-arrows"></i>&nbsp;Estado
                        del proyecto</label>
                    <ion-select placeholder="Seleccionar" v-model="project.projectStatus" cancel-text="Cancelar">
                        <ion-select-option value="2">Finalizado</ion-select-option>
                        <ion-select-option value="1">Cancelado</ion-select-option>
                    </ion-select>
                    <!--<div class="text-danger">{{ validation.firstError('project.hoursType') }}</div>-->
                </div>

                <div class="form-group mt-4" v-if="!disableInput">
                    <ion-button expand="block" :disabled="project.projectStatus === 'En curso'" color="primary" @click="changeProjectStatus()">
                        Confirmar cambio de estado
                    </ion-button>
                </div>
                <div>
                    <ion-text>
                        <h3>
                            Al seleccionar <b>Cancelar</b>, el proyecto sera eliminado del registro.
                        </h3>
                    </ion-text>
                    <ion-text>
                        <h3>
                            Al seleccionar <b>Finalizar</b>, el proyecto sera enviado al Historial.
                        </h3>
                    </ion-text>
                </div>
            </ion-card-content>
        </ion-card>

    </ion-content>
</template>

<script>
import SimpleVueValidator from 'simple-vue-validator';
const Validator = SimpleVueValidator.Validator;
import {
    modalController,
} from "@ionic/vue";
import {
    checkmark,
    closeCircle,
    list,
    people,
    calendar,
    arrowBackOutline,
    sync,
} from 'ionicons/icons';

export default {
    mixins: [SimpleVueValidator.mixin],
    data() {
        return {
            apiToken: '',
            userRol: '',
            view: 'general',
            collegeCareers: [],
            project: {
                id: '',
                name: '',
                status: '',
                counterpart: '',
                // eslint-disable-next-line
                spacesAct: '',
                spaces: '',
                description: '',
                owner: '',
                startDate: '',
                endDate: '',
                schedule: '',
                hoursType: '',
                ownerEmail: '',
                careers: [],
                students: [],
                acceptedStudents: [],
            },
            checkmark,
            closeCircle,
            list,
            people,
            calendar,
            sync,
            meetingScheduleDate: '',
            meetingScheduleTime: '',
            meetingPlace: '',
            meetingDescription: '',
            acceptedStudentsEmails: [],
            meetingMailButtonStatus: false,
            fetching: false,
            arrowBackOutline
        };
    },
    props: ['projectData', 'disableStatus', "showUnapplyProp", "applyPermission", "activeProject",],
    async created() {
        this.apiToken = await this.getApiToken();
        this.userRol = await this.getUserRolId();
        // const currentDate = new Date();


        // this.meetingScheduleDate = currentDate.toLocaleDateString('es-ES', { day: '2-digit',month: '2-digit', year: 'numeric'});
        //this.meetingScheduleTime = currentDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });



        if (this.userRol === 1) {
            this.getAllCollegeCareers();
        }
        this.setProjectData();
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
        'project.profile': function (value) {
            return Validator.value(value).required('El campo perfil del estudiante es obligatorio.');
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
    },
    methods: {
        async updateProject() {
            this.fetching = true
            const validation = await this.$validate();
            if (validation) {
                const API_ENDOINT = this.getAPIEndpoint();
                const selectedCareers = [];

                if (this.userRol === 1) {
                    this.project.careers.forEach(element => {
                        const career = [];
                        career[0] = element;
                        career[1] = 0;
                        career[2] = 6;
                        selectedCareers.push(career);
                    });
                }

                const request = await fetch(API_ENDOINT + '/admin/putUpdateProyecto', {
                    method: "PUT",
                    // eslint-disable-next-line
                    body: JSON.stringify({
                        idProyecto: this.project.id,
                        nombre: this.project.name,
                        contraparte: this.project.counterpart,
                        cupos: this.project.spaces,
                        // eslint-disable-next-line
                        perfil_estudiante: this.project.profile,
                        descripcion: this.project.description,
                        encargado: this.project.owner,
                        // eslint-disable-next-line
                        fecha_inicio: this.project.startDate.substring(0, 10),
                        // eslint-disable-next-line
                        fecha_fin: this.project.endDate.substring(0, 10),
                        horario: this.project.schedule,
                        // eslint-disable-next-line
                        tipo_horas: this.project.hoursType,
                        // eslint-disable-next-line
                        correo_encargado: this.project.ownerEmail,
                        estado: 1,
                        // eslint-disable-next-line
                        estado_proyecto: "En curso",
                        carreraPerfil: selectedCareers
                    }),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        'Authorization': 'Bearer ' + this.apiToken
                    }
                })

                if (request.status === 200) {
                    this.showSuccessToast('Proyecto actualizado exitosamente.');
                    this.closeModal();
                    this.$emit('dataUpdated');
                    location.reload();
                } else {
                    this.showErrorToast('Algo salió mal al actualizar el proyecto.');
                }
                
            } else {
                this.FormValidationFailed();
            }
            this.fetching = false

        },
        async changeProjectStatus() {
            this.fetching = true

            const estadoProyecto = this.project.projectStatus;
            const API_ENDOINT = this.getAPIEndpoint();
            const request = await fetch(API_ENDOINT + `/admin/postProyecto${estadoProyecto == '2' ? 'Finalizar' : 'Cancelar' }`, {
            // const request = await fetch(API_ENDOINT + `postProyectoCancelarcancelar`, {}
                method: "POST",
                body: JSON.stringify({
                    idProyecto: this.project.id
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization': 'Bearer ' + this.apiToken
                }
            })

            if (request.status === 200) {
                this.showSuccessToast('Proyecto actualizado exitosamente.');
                this.$emit('dataUpdated');
                this.closeModal()
                // location.reload();
            } else {
                this.showErrorToast('Algo salió mal al actualizar el proyecto.');
            }
            this.fetching = false

        },
        async sendApplicationRequest(student, status) {
            const API_ENDOINT = this.getAPIEndpoint();
            this.fetching = true
            const request = await fetch(API_ENDOINT + '/admin/putAplicarEnProyecto', {
                method: "PUT",
                // eslint-disable-next-line
                body: JSON.stringify({
                    idProyecto: this.project.id,
                    idUser: student.idUser,
                    estado: status === 'accept' ? 1 : 2
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization': 'Bearer ' + this.apiToken
                }
            })

            if (request.status === 200) {
                this.showSuccessToast('Estado de alumno en el proyecto Actualizado.');
                this.closeModal();
                this.$emit('dataUpdated');
                // location.reload();
            } else {
                this.showErrorToast('Algo salió mal al actualizar el proyecto.');
            }
            this.fetching = false

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
        },
        setProjectData() {
            this.project.id = this.projectData.idProyecto;
            this.project.name = this.projectData.nombre;
            this.project.status = this.projectData.estado;
            this.project.projectStatus = this.projectData.estado_proyecto;
            this.project.counterpart = this.projectData.contraparte;
            // eslint-disable-next-line
            this.project.spacesAct = this.projectData.cupos_act;
            this.project.spaces = this.projectData.cupos;
            this.project.description = this.projectData.descripcion;
            this.project.profile = this.projectData.perfil_estudiante;
            this.project.owner = this.projectData.encargado;
            // eslint-disable-next-line
            this.project.startDate = this.projectData.fecha_inicio;
            // eslint-disable-next-line
            this.project.endDate = this.projectData.fecha_fin;
            this.project.schedule = this.projectData.horario;
            this.project.hoursType = this.projectData.tipo_horas;
            // eslint-disable-next-line
            this.project.ownerEmail = this.projectData.correo_encargado;

            if (this.userRol === 1 && this.projectData.carreras) {
                const careerIds = [];
                this.projectData.carreras.forEach(element => {
                    careerIds.push(element.idCarrera);
                });
                this.project.careers = careerIds;
            }

            if (this.projectData.estudiantes) {
                this.project.students = this.projectData.estudiantes;

                // filter students accepted
                this.project.acceptedStudents = this.project.students.filter(student => {
                    return student.pivot.estado === 1;
                });
            }
        },
        async closeModal() {
            await modalController.dismiss();
        },
        async sendMeetingRequest() {
            this.fetching = true

            // Validate inputs 
            if (this.meetingScheduleDate === '' || this.meetingScheduleTime === '' || this.meetingPlace === '') {
                this.showErrorToast('La fecha, hora y lugar son obligatorios.');
                return;
            }

            this.meetingMailButtonStatus = true;
            const API_ENDOINT = this.getAPIEndpoint();

            const emails = [];

            this.project.acceptedStudents.forEach(element => {
                console.log(element.correo)
                emails.push(element.correo);
            });



            const selectedTime = new Date(this.meetingScheduleTime);
            const parsedTime = selectedTime.toLocaleTimeString('us-EN', { hour: '2-digit', minute: '2-digit' });

            const selectedDate = new Date(this.meetingScheduleDate);
            const parsedDate = selectedDate.toLocaleDateString('us-EN', { day: '2-digit', month: '2-digit', year: 'numeric' });

            // console.log("Body");
            // console.log(JSON.stringify({
            //         estudiantes: emails,
            //         fecha: parsedDate,
            //         hora: parsedTime,
            //         lugar: this.meetingPlace,
            //         // eslint-disable-next-line
            //         nombre_proyecto: this.project.name,
            //         descripcion: this.meetingDescription,
            //         encargado: this.project.owner,
            //         // eslint-disable-next-line
            //         encargado_correo : this.project.ownerEmail,
            //     }));



            const request = await fetch(API_ENDOINT + '/admin/sendMeetingMail', {
                method: "POST",
                // eslint-disable-next-line
                body: JSON.stringify({
                    estudiantes: emails,
                    fecha: parsedDate,
                    hora: parsedTime,
                    lugar: this.meetingPlace,
                    // eslint-disable-next-line
                    nombre_proyecto: this.project.name,
                    descripcion: this.meetingDescription,
                    encargado: this.project.owner,
                    // eslint-disable-next-line
                    encargado_correo: this.project.ownerEmail,
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization': 'Bearer ' + this.apiToken
                }
            })

            if (request.status === 200) {
                this.showSuccessToast('Reunion programada exitosamente.');
                this.closeModal();
            }
            else {
                this.showErrorToast('Algo salió mal al programar la reunion.');
                this.closeModal();
            }
            this.fetching = false


        }
    },
    computed: {
        disableInput: function () {
            return this.userRol !== 1;
        }
    }
}
</script>

<style scoped>ion-icon {
    font-size: 1.5em;
}</style>