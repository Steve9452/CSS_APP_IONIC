<template>
    <div>
        <div>
            <div v-if="loading"  class="flex-center my-4">
                <ion-spinner  name="crescent" color="primary"></ion-spinner>
            </div>
            <div v-else>
            <p v-if="error" class="alert alert-danger" role="alert">
                Ha ocurrido un error al cargar los proyectos. Inténtelo nuevamente.
            </p>


            <p v-if="!applyPermission && !error" class="alert alert-warning" role="alert">
                No es posible aplicar a un nuevo proyecto.
            </p>
            <p v-if="!applyPermission && !error" class="alert alert-warning" role="alert">
                Ha excedido la cantidad de solicitudes diarias. Inténtelo nuevamente mañana.
            </p>
            <p v-if="timeout && !error" class="alert alert-danger" role="alert">
                Penalización: Por el momento no puede aplicar a nuevos proyectos.
            </p>
            <div v-if="activeProject && !error" class="alert alert-warning" role="alert">
            Ya se encuentra inscrito en un proyecto activo. Le invitamos a revisar el estado de la solicitud en proyectos
            aplicados.
            </div>
            </div>


        </div>

        

        <ion-grid>
            <ion-col class="large-chip">
                <ion-chip class="large-chip" :outline="true">
                    <ion-icon :icon="searchOutline" color="secundary"></ion-icon>
                    <ion-input @ionInput="inputHandler" placeholder="Buscar"></ion-input>
                </ion-chip>
            </ion-col>
            <ion-col size="3">
                <ion-chip @click="presentActionSheetFilter(handleFilter)">
                    <ion-icon :icon="filterOutline" color="secundary"></ion-icon>
                    <ion-label>Filtro</ion-label>
                </ion-chip>
            </ion-col>
        </ion-grid>

        <div class="center-row" style=" font-size: auto; padding: 0px 10px 0px 10px ">
          
            <ion-chip style="padding: 5px 1.5em 5px 1.5em;" color="primary" size="small">
                   <span> {{ userCarrera}} </span>
                </ion-chip>
            <ion-chip style="padding: 5px 1.5em 5px 1.5em;" color="primary" size="small">
                   <span> {{ userPerfil }} </span>
                </ion-chip>
        </div>          
        
        

        <div v-if="projects.length > 0">
            <!-- <ion-list lines="full">
                <ion-item v-for="project in projects" :key="project.idProyecto"  >
                    <show-project  :key="project.idProyecto" :project-data="project"
                :apply-permission="applyPermission" :active-project="activeProject" :show-unapply="false"
                v-on:dataUpdated="getAvailableProjects()">
            </show-project>
                </ion-item>
            </ion-list> -->

            <ion-refresher slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200" @ionRefresh="handleRefresh($event)">
                <ion-refresher-content></ion-refresher-content>
              </ion-refresher>

            <ion-list>
                <show-project v-for="project in projects" :key="project.idProyecto" :project-data="project"
                    :apply-permission="applyPermission" :active-project="activeProject" :show-unapply="false"
                    v-on:dataUpdated="resetData()">
                </show-project>
            </ion-list>

            <!-- <show-project  v-for="project in projects" :key="project.idProyecto" :project-data="project"
                :apply-permission="applyPermission" :active-project="activeProject" :show-unapply="false"
                v-on:dataUpdated="getAvailableProjects()">
            </show-project> -->

            <ion-infinite-scroll threshold="100px" @ionInfinite="getAvailableProjects($event)">
                <ion-infinite-scroll-content loadingSpinner="bubbles" loadingText="Cargando más proyectos...">
                </ion-infinite-scroll-content>
            </ion-infinite-scroll>

        </div>

        <div class="container" v-else-if="loaded">
            <div class="row justify-content-center align-items-center">
                <div class="col">
                    <img src="/assets/img/success.svg" class="img-fluid d-block mx-auto mt-5" style="width:50%;">
                    <h1 class="text-primary text-center font-weight-bolder">
                        Hmmm
                    </h1>
                    <p class="text-muted text-center">
                        Parece ser que no se encontraron registros.
                    </p>
                </div>
            </div>
        </div>

        
    </div>
</template>

<script>
import ShowProject from './ShowProject.vue'

import { filterOutline, swapVerticalOutline, searchOutline } from 'ionicons/icons';
import { IonChip, actionSheetController, IonList, IonInfiniteScroll, IonInfiniteScrollContent, IonRefresher, IonRefresherContent, IonInput, IonSpinner } from '@ionic/vue';
export default {
    components: {
        ShowProject,
        IonChip,
        IonList,
        // IonItem,
        IonInfiniteScroll,
        IonInfiniteScrollContent,
        IonRefresher,
        IonRefresherContent,
        IonInput,
        IonSpinner
    },
    props: ['applyPermission', 'activeProject', 'timeout', 'error', 'loading'],
    data: function () {
        return {
            apiToken: '',
            searchOutline,
            filterOutline,
            swapVerticalOutline,
            projects: [],
            nombreABuscar: "",
            filtroTipoHoras: "todas",
            filterButtonCallbackHandler: "todas",
            userCarrera: "",
            userPerfil: "",
            page: 1,
            loaded: false
        };
    },
    async created() {
        this.apiToken = await this.getApiToken();
        this.userData = await this.getAuthenticatedUser();
        this.loadData();
        this.userCarrera = this.userData.carrera.nombre
        this.userPerfil = this.userData.perfil.descripcion
    },
    watch: {
        filterButtonCallbackHandler: function () {
            this.resetData();
            // console.log(v)
        }
    },
    methods: {
        async fetchData(resetPage) {
            this.page = resetPage ? 1 : this.page;
            this.loaded = false
            const API_ENDOINT = this.getAPIEndpoint();
            const request = await fetch(API_ENDOINT + `/getAviableProjects?page=${this.page}&nombre=${this.nombreABuscar}&tipo=${this.filtroTipoHoras}`, {

                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization': 'Bearer ' + this.apiToken
                }
            });
            const data = await request.json();
            if (request.status === 200) {
                this.page++;
                this.loaded = true
            } else {
                this.showErrorToast('Ups! Algo salió mal.');
            }
            return data;
        },
        async getAvailableProjects(ev = null) {
            // console.log(ev)
            try {
                const data = await this.fetchData();
                if (this.page === data.pagination.lastPage) {
                    console.log("No hay más proyectos")
                    return;
                }
                this.projects = this.projects.concat(data.proyectos.data)

                //console.log(">>>>>>>>>>data: ")
                this.$emit("getPermissions")
                // console.log(data);

                if (ev) {
                    ev.target.complete();
                }
            }
            catch (error) {
                console.log("Error: " + error);
            }


        },
        async loadData(refreshPage) {
            try {
                const data = await this.fetchData(refreshPage);

                this.projects = data.proyectos.data;
            }
            catch (error) {
                console.log("Error: " + error);
            }
        },
        async handleRefresh(event) {
            this.loadData(true).finally( async () => {
                event.target.complete();
                this.userData = await this.getAuthenticatedUser();
                this.userCarrera = this.userData.user.carrera.nombre
        this.userPerfil = this.userData.user.perfil.descripcion
            });
            // event.target.complete();
        },
        resetData() {
            this.page = 1
            this.loadData()
        },
        inputHandler(ev) {
            this.nombreABuscar = ev.target.value;
            this.resetData()
        },
        handleFilter(filter){
            this.filtroTipoHoras = filter;
            this.resetData()
        },
        presentActionSheetFilter: async (handleFilter) => {

            const actionSheet = await actionSheetController.create({
                header: 'Filtrar por: ',
                buttons: [

                    {
                        text: 'Horas externas',
                        role: 'destructive',
                        handler: () => {
                            handleFilter("externas")
                        },
                    },
                    {
                        text: 'Horas internas',
                        role: 'destructive',
                        handler: () => {
                            handleFilter("internas")

                        },
                    },
                    {
                        text: 'Todos',
                        role: 'destructive',
                        handler: () => {
                            handleFilter("todas")
                        },
                    },
                ],
            });

            await actionSheet.present();

        },
        



    },



}
</script>

<style scoped>
    ion-grid {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .center-row{
        display: flex;
        justify-content: center;
    }

    .large-chip {
        width: 100%;
    }
    
    .large-row {
        width: auto;
    }

    .flex-space-around{
        display: flex;
        justify-content: space-around;
    }
</style>
