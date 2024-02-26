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
                            <ion-button color="secondary" :disabled="applyDisabled" @click="applyToProject()"> Aplicar </ion-button>
                        </ion-row>
                        <ion-row v-else-if="acepted == 1">
                            <ion-button color="success"> Aceptado </ion-button>
                        </ion-row>
                        <ion-row v-else-if="acepted == 2">
                            <ion-button color="danger"> Rechazado </ion-button>
                        </ion-row>
                        <ion-row v-else>
                            <ion-button color="secondary" :disabled="applyDisabled" @click="unapplyToProject()"> Desaplicar </ion-button>
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
                        <ion-row>
                            <ion-label class="text-muted font-weight-ligth"><i class="fas fa-align-center"></i>Perfil del estudiante
                                &nbsp;</ion-label>
                            <ion-text v-text="project.perfil_estudiante" class=""> </ion-text>
                        </ion-row>

                        <ion-row>
                            <ion-label class="text-muted font-weight-ligth">
                                <i class="fas fa-envelope-open-text"></i>Correo encargado &nbsp;</ion-label>
                            <ion-text>
                                {{ project.ownerEmail }}
                            </ion-text>
                        </ion-row>


                        <ion-row>
                            <ion-label class="text-muted font-weight-ligth"><i class="fas fa-people-arrows"></i>Horario
                                &nbsp;</ion-label>
                            <ion-text v-text="project.schedule" type="text" class=""> </ion-text>
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
                        <ion-row v-if="project.description.length > 2">
                            <ion-label class="text-muted font-weight-ligth"><i class="fas fa-align-center"></i>Descripción
                                adicional
                                &nbsp;</ion-label>
                            <ion-text v-text="project.description" class=""> </ion-text>
                        </ion-row>

                        <!---ion-row v-if="userRol === 1">
                    <ion-label class="text-muted font-weight-ligth"><i
                            class="fas fa-graduation-cap"></i>&nbsp;Carreras</ion-label>
                    <ion-select v-text="project. cancel-text="Cancelar" multiple>
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
            applyDisabled: false,
            meetingMailButtonStatus: false,
        };
    },
    props: ['projectData', 'showUnapplyProp', 'applyPermission', 'activeProject'],
    created() {
        this.apiToken = this.getApiToken();
        this.userRol = this.getUserRolId();
        this.userId = this.getUserId();

        this.showUnapply = this.showUnapplyProp;
        //console.log("showUnapply", this.showUnapply);
        // const currentDate = new Date();


        // this.meetingScheduleDate = currentDate.toLocaleDateString('es-ES', { day: '2-digit',month: '2-digit', year: 'numeric'});
        //this.meetingScheduleTime = currentDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });


        // console.log(this.projectData);
        if (this.userRol === 1) {
            this.getAllCollegeCareers();
        }
        this.setProjectData();
    },

    methods: {
        async unapplyToProject() {
            this.applyDisabled = true;
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
                this.applyDisabled = false;
            }

            this.fetching = false
        },
        async applyToProject() {
            this.fetching = true
            this.applyDisabled = true;
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
                    this.applyDisabled = false;
                    //location.reload();
                }
            } else {
                this.showErrorToast('No puede aplicar a otro proyecto este día. Inténtelo mañana nuevamente.');
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

            if (this.projectData.estadoPxe) {
                this.project.students = this.projectData.estudiantes;
                this.acepted = this.projectData.estadoPxe
            }
        },
        async closeModal() {
            await modalController.dismiss();
        },

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