<template>
    <ion-header translucent>
        <ion-toolbar>
            <ion-buttons>
                <ion-button @click="closeModal()"> <ion-icon :icon="arrowBackOutline"></ion-icon> </ion-button>
            </ion-buttons>
            <ion-progress-bar v-if="fetching" type="indeterminate"></ion-progress-bar>
        </ion-toolbar>
    </ion-header>

    <ion-content>
        <ion-grid v-if="view === 'general'">
            <ion-card-content>
                <ion-item>
                    <ion-grid>
                        <ion-row>
                            <ion-text class="modal-title" v-text="project.name"> </ion-text>
                        </ion-row>
                        <ion-row>
                            <ion-text>
                                <ion-label class="text-muted font-weight-ligth">

                                    {{ project.counterpart }}
                                </ion-label>
                            </ion-text>
                        </ion-row>
                        <ion-row>
                            <ion-label class="text-muted font-weight-ligth"><i class="far fa-user"></i>{{ `
                                ${project.owner}` }} &nbsp;</ion-label>
                        </ion-row>
                    </ion-grid>
                </ion-item>

                <ion-item>
                    <ion-grid class="gapped-grid-2">

                        <ion-row v-if="!showUnapply">
                            <ion-button color="secondary" @click="applyToProject()"> Aplicar </ion-button>
                        </ion-row>
                        <ion-row v-else-if="acepted == 1"> 
                            <ion-button color="success" > Aceptado </ion-button>
                        </ion-row>
                        <ion-row v-else-if="acepted == 2"> 
                            <ion-button color="danger" > Rechazado </ion-button>
                        </ion-row>
                        <ion-row v-else> 
                            <ion-button color="secondary" @click="unapplyToProject()"> Desaplicar </ion-button>
                        </ion-row>

                        <ion-row>
                            <ion-chip color="primary" class="mr-1">
                                <small>{{ project.spacesAct }}/{{ project.spaces }} Cupos</small>
                            </ion-chip>
                            <ion-chip :color="project.status === 1 ? 'primary' : 'medium'" class="mr-1">
                                <small>{{ project.hoursType }}</small>
                            </ion-chip>
                        </ion-row>
                    </ion-grid>
                </ion-item>

                <ion-item>
                    <ion-grid class="gapped-grid">
                        <ion-label class="text-muted font-weight-ligth">
                            <i class="fas fa-envelope-open-text"></i>Correo &nbsp;</ion-label>
                        <ion-row>
                            <ion-text>
                                {{ project.ownerEmail }}
                            </ion-text>
                        </ion-row>


                        <ion-row>
                            <ion-label class="text-muted font-weight-ligth"><i class="fas fa-people-arrows"></i>Horario
                                &nbsp;</ion-label>
                            <ion-text v-text="project.schedule" type="text" class="" placeholder="Horario"> </ion-text>
                        </ion-row>

                        <ion-row>
                            <ion-label class="text-muted font-weight-ligth"><i class="fas fa-align-center"></i>Descripción
                                &nbsp;</ion-label>
                            <ion-text v-text="project.description" class="" placeholder="Descripcion"> </ion-text>
                        </ion-row>

                        <ion-row>
                            <ion-label class="text-muted font-weight-ligth"><i class="far fa-calendar-alt"></i>Fecha de
                                Inicio &nbsp;</ion-label>
                            <ion-text v-text="project.startDate" display-format="YYYY/MM/DD" picker-format="DD/MM/YYYY">
                            </ion-text>
                        </ion-row>

                        <ion-row>
                            <ion-label class="text-muted font-weight-ligth"><i class="far fa-calendar-alt"></i>Fecha de
                                Finalización &nbsp;</ion-label>
                            <ion-text v-text="project.endDate" display-format="YYYY/MM/DD" picker-format="DD/MM/YYYY">
                            </ion-text>

                        </ion-row>

                        <!---ion-row v-if="userRol === 1">
                    <ion-label class="text-muted font-weight-ligth"><i
                            class="fas fa-graduation-cap"></i>&nbsp;Carreras</ion-label>
                    <ion-select v-text="project.careers" placeholder="Seleccionar" cancel-text="Cancelar" multiple>
                        <ion-select-option v-for="item in collegeCareers" :key="item.idCarrera" :value="item.idCarrera">
                            {{ item.nombre }}
                        </ion-select-option>
                    </ion-select>
                </div-->

                    </ion-grid>
                </ion-item>

            </ion-card-content>
        </ion-grid>
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
    arrowBackOutline,

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
            fetching: false,
            checkmark,
            closeCircle,
            list,
            people,
            arrowBackOutline,
            meetingScheduleDate: '',
            meetingScheduleTime: '',
            meetingPlace: '',
            meetingDescription: '',
            acceptedStudentsEmails: [],
            meetingMailButtonStatus: false,
        };
    },
    props: ['projectData', 'showUnapplyProp', 'applyPermission', 'activeProject' ],
    created() {
        this.apiToken = this.getApiToken();
        this.userRol = this.getUserRolId();
        this.userId = this.getUserId();

        this.showUnapply = this.showUnapplyProp;
        console.log("showUnapply", this.showUnapply);
        // const currentDate = new Date();


        // this.meetingScheduleDate = currentDate.toLocaleDateString('es-ES', { day: '2-digit',month: '2-digit', year: 'numeric'});
        //this.meetingScheduleTime = currentDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });


                              console.log(this.projectData);
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
        'project.description': function (value) {
            return Validator.value(value).required('El campo descripción es obligatorio.');
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
        async unapplyToProject() {
            this.fetching = true
            const API_ENDOINT = this.getAPIEndpoint();
            const request = await fetch(API_ENDOINT + `/postDesaplicarProyecto`, {
                method: "POST",
                body: JSON.stringify({
                    idProyecto: this.project.id,
                    idUser: this.userId,
                    estado: 0
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization': 'Bearer ' + this.apiToken
                }
            })

            if (request.status === 200) {
                this.showSuccessToast('Solicitud enviada exitosamente.');
                this.$emit('dataUpdated');
                this.showUnapply = !this.showUnapply;
                this.closeModal()
            } else {
                this.showErrorToast('Algo salió mal al enviar la solicitud.');
            }

            this.fetching = false
        },
        async applyToProject() {
            this.fetching = true
            //console.log("Apply permission " + this.applyPermission)
            //console.log("Proyecto activo " + this.activeProject)
            if (this.applyPermission && !this.activeProject) {
                const API_ENDOINT = this.getAPIEndpoint();
                const request = await fetch(API_ENDOINT + `/postAplicarProyecto`, {
                    method: "POST",
                    body: JSON.stringify({
                        idProyecto: this.project.id,
                        idUser: this.userId,
                        estado: 0
                    }),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        'Authorization': 'Bearer ' + this.apiToken
                    }
                })

                if (request.status === 200) {
                    this.showSuccessToast('Solicitud enviada exitosamente.');
                    this.$emit('dataUpdated');
                    this.showUnapply = !this.showUnapply
                    this.closeModal()
                    // location.reload();
                } else {
                    this.showErrorToast('Algo salió mal al enviar la solicitud.');
                    //location.reload();
                }
            } else {
                this.showErrorToast('No puede aplicar a otro proyecto este día. Inténtelo mañana nuevamente.');
            }

            this.fetching = false
        },
        async updateProject() {
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
                        descripcion: this.project.description,
                        encargado: this.project.owner,
                        // eslint-disable-next-line
                        fecha_inicio: this.project.startDate,
                        // eslint-disable-next-line
                        fecha_fin: this.project.endDate,
                        horario: this.project.schedule,
                        // eslint-disable-next-line
                        tipo_horas: this.project.hoursType,
                        // eslint-disable-next-line
                        correo_encargado: this.project.ownerEmail,
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
        },
        async sendApplicationRequest(student, status) {
            const API_ENDOINT = this.getAPIEndpoint();

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
            this.project.counterpart = this.projectData.contraparte;
            // eslint-disable-next-line
            this.project.spacesAct = this.projectData.cupos_act;
            this.project.spaces = this.projectData.cupos;
            this.project.description = this.projectData.descripcion;
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

            //console.log(this.projectData.estudiantes)

            if (this.projectData.estudiantes) {
                this.project.students = this.projectData.estudiantes;
                this.acepted = this.projectData.estudiantes[0].pivot.estado

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


        }
    },
    computed: {
        disableInput: function () {
            return this.userRol !== 1;
        }
    }
}
</script>

<style scoped>
ion-grid.gapped-grid-2>ion-row {

    margin-top: 0.3em;
    margin-bottom: 0.5em;
}

ion-grid.gapped-grid>ion-row {

    margin-bottom: 1em;
}

ion-grid {

    --ion-grid-row-padding: 30px;
}

ion-row {
    border: 0px;
}
</style>