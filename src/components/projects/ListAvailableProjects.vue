<template>
    <div>
        <div>
            <div v-if="loading"  class="flex-center my-4">
                <ion-spinner  name="crescent" color="primary"></ion-spinner>
            </div>
            <div v-else>
            <p v-if="error" class="alert alert-danger" role="alert">
                Ha ocurrido un error al cargar los proyectos. Espere e Inténtelo nuevamente más tarde.
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
                <ion-chip @click="presentActionSheetFilter(careers, handleFilterTipo, handleFilterCarrera, handleFilterAno)">
                    <ion-icon :icon="filterOutline" color="secundary"></ion-icon>
                    <ion-label>Filtro</ion-label>
                </ion-chip>
                <!-- <ion-chip  color="primary" size="small">
                   <span> Limpiar </span>
                </ion-chip> -->
            </ion-col>
        </ion-grid>

        <div class="" style="overflow-x: scroll; scrollbar-width: none; width: 100vw; max-width: 100vw">

            <div class="" style="white-space: nowrap; margin-left: auto; margin-right: auto; width: fit-content; max-width: 200vw; font-size: auto; padding: 0px 16px 0px 10px ">
                
                <ion-chip v-if="!defaultTipo" @click="handleFilterTipo('', 'todas', true)" style="padding: 5px 1.5em 5px 1.5em;" color="primary" size="small">
                   <span> {{ filtroTipoHorasLabel}} </span>
                   <ion-icon style="fill: var(--ion-color-tertiary)"  :icon="closeCircle"></ion-icon>
            </ion-chip>
        
        <ion-chip v-if="!defaultCarrera" @click="handleFilterCarrera(userCarrera, userCarreraId, true)" style="padding: 5px 1.5em 5px 1.5em;" color="primary" size="small">
                   <span> {{ filtroCarreraLabel}} </span>
                <ion-icon style="fill: var(--ion-color-tertiary)"  :icon="closeCircle"></ion-icon>
            </ion-chip>
        <ion-chip v-else @click="presentActionSheetFilterCarrera(careers, handleFilterCarrera)" style="padding: 5px 1.5em 5px 1.5em;" color="primary" size="small">
            <span> {{ filtroCarreraLabel}} </span>
            </ion-chip>

        <ion-chip v-if="!defaultAno" @click="handleFilterAno(userPerfil, userPerfilId, true)" style="padding: 5px 1.5em 5px 1.5em;" color="primary" size="small">
            <span> {{ filtroPerfilLabel }} </span>
                   <ion-icon style="fill: var(--ion-color-tertiary)" :icon="closeCircle"></ion-icon>
            </ion-chip>
            <ion-chip v-else @click="presentActionSheetFilterAno(handleFilterAno)" style="padding: 5px 1.5em 5px 1.5em;" color="primary" size="small">
                   <span> {{ filtroPerfilLabel }} </span>
            </ion-chip>

        </div>          
        </div>
        
        

        <div class="mt-2" v-if="projects.length > 0">

            <ion-refresher slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200" @ionRefresh="handleRefresh($event)">
                <ion-refresher-content></ion-refresher-content>
              </ion-refresher>

            <ion-list>
                <show-project v-for="project in projects" :key="project.idProyecto" :project-data="project"
                    :apply-permission="applyPermission" :active-project="activeProject" :show-unapply="false"
                    v-on:dataUpdated="resetData()">
                </show-project>
            </ion-list>

            <ion-infinite-scroll threshold="100px" @ionInfinite="getAvailableProjects($event)">
                <ion-infinite-scroll-content loadingSpinner="bubbles" loadingText="Cargando más proyectos...">
                </ion-infinite-scroll-content>
            </ion-infinite-scroll>

        </div>

        <div class="container" v-else-if="loaded">
            <div class="row justify-content-center align-items-center">
                <div class="col">
                    <img src="/assets/img/success.svg" class="img-fluid d-block mx-auto mt-5" style="width:50%;">

                    <p class="text-muted text-center">
                        Parece ser que no se encontraron projectos.
                    </p>
                </div>
            </div>
        </div>

        
    </div>
</template>

<script>
import ShowProject from './ShowProject.vue'

import { filterOutline, swapVerticalOutline, searchOutline } from 'ionicons/icons';
import { closeCircle } from 'ionicons/icons';
import { IonChip, actionSheetController, IonList, IonInfiniteScroll, IonInfiniteScrollContent, IonRefresher, IonRefresherContent, IonInput, IonSpinner } from '@ionic/vue';
import { Storage } from '@capacitor/storage';

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
            closeCircle,
            projects: [],
            careers: [],
            nombreABuscar: "",
            filtroTipoHoras: "todas",
            filtroTipoHorasLabel: "Todas",
            filtroPerfil: 1,
            filtroPerfilLabel: "",
            filtroCarrera: 1,
            filtroCarreraLabel: "",
            defaultTipo: true,
            defaultCarrera: true,
            defaultAno: true,
            filterButtonCallbackHandler: "todas",
            userCarrera: "",
            userCarreraId: 0,
            userPerfil: "",
            userPerfilId: 0,
            page: 1,
            loaded: false
        };
    },

    async created() {
        this.apiToken = await this.getApiToken();
        
        this.userData = await this.getAuthenticatedUser();
        
        this.userCarrera = this.userData.carrera.nombre
        this.userCarreraId = this.userData.carrera.idCarrera

        this.userPerfil = this.userData.perfil.descripcion
        this.userPerfilId = this.userData.perfil.idPerfil
        
        this.filtroCarrera =  this.userData.carrera.idCarrera
        this.filtroCarreraLabel = this.userData.carrera.nombre

        this.filtroPerfil = this.userData.perfil.idPerfil 
        this.filtroPerfilLabel= this.userData.perfil.descripcion

        this.loadData();
        
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
            const request = await fetch(API_ENDOINT + `/getAviableProjects?page=${this.page}&nombre=${this.nombreABuscar}&tipo=${this.filtroTipoHoras}&idPerfil=${this.filtroPerfil}&idCarrera=${this.filtroCarrera}`, {

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
        async fetchCarrers() {
            const API_ENDOINT = this.getAPIEndpoint();
            const request = await fetch(API_ENDOINT + `/getCarreras`, {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization': 'Bearer ' + this.apiToken
                }
            });
            const data = await request.json();
            if (request.status === 200) {
                this.careers = data; 
            } else {
                this.showErrorToast('Ups! Algo salió mal.');
            }
        },
        async setTotalProjects(total){
            if(this.defaultAno && this.defaultCarrera && this.defaultTipo){
                await Storage.set({key: "TOTAL_PROJECTS", value: JSON.stringify(total)})
            }
            console.log("TOTAL DE PROJECTOS GUARDADOS", total);
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
                this.setTotalProjects(data.pagination.total)
                await this.fetchCarrers();
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
        handleFilterTipo(label, filter, defaultv=false){
            this.filtroTipoHoras = filter
            this.filtroTipoHorasLabel = label
            this.defaultTipo = defaultv
            this.resetData()
        },
        handleFilterCarrera(label, filter, defaultv=false){
            this.filtroCarrera = filter
            this.filtroCarreraLabel = label
            this.defaultCarrera = defaultv
            this.resetData()
        },
        handleFilterAno(label, filter, defaultv=false){
            this.filtroPerfil = filter
            this.filtroPerfilLabel = label
            this.defaultAno = defaultv
            this.resetData()
        },
        presentActionSheetFilter: async (careers, handleFilterTipo, handleFilterCarrera, handleFilterAno) => {

            const actionSheetAno = await actionSheetController.create({
                header: 'Selecciona un año: ',
                buttons: [

                    {
                        text: 'Primer Año',
                        role: 'destructive',
                        handler: () => {
                            handleFilterAno('Primer Año', 1)
                        },
                    },
                    {
                        text: 'Segundo Año',
                        role: 'destructive',
                        handler: () => {
                            handleFilterAno('Segundo Año', 2)
                        },
                    },
                    {
                        text: 'Tercer Año',
                        role: 'destructive',
                        handler: () => {
                            handleFilterAno('Tercer Año', 3)
                        },
                    },
                    {
                        text: 'Cuarto Año',
                        role: 'destructive',
                        handler: () => {
                            handleFilterAno('Cuarto Año', 4)
                        },
                    },
                    {
                        text: 'Quito Año',
                        role: 'destructive',
                        handler: () => {
                            handleFilterAno('Quito Año', 5 )
                        },
                    },
                    {
                        text: 'Egresado',
                        role: 'destructive',
                        handler: () => {
                            handleFilterAno('Egresado', 6 )
                        },
                    },

                ],
            });

            const actionSheetCarrera = await actionSheetController.create({
                header: 'Selecciona un carrera: ',
                buttons: careers.map(c => {
                    return {
                        text: c.nombre,
                        role: 'destructive',
                        handler: () => {
                            handleFilterCarrera(c.nombre, c.idCarrera)
                        },
                    }})
            });

            // await actionSheet.present();

            const actionSheetTipo = await actionSheetController.create({
                header: 'Selecciona un tipo: ',
                buttons: [

                    {
                        text: 'Horas externas',
                        role: 'destructive',
                        handler: () => {
                            handleFilterTipo("Externas", "externas")
                        },
                    },
                    {
                        text: 'Horas internas',
                        role: 'destructive',
                        handler: () => {
                            handleFilterTipo("Internas", "internas")

                        },
                    },
                    {
                        text: 'Todos',
                        role: 'destructive',
                        handler: () => {
                            handleFilterTipo("Todas", "todas")
                        },
                    },
                ],
            });

            const actionSheet = await actionSheetController.create({
                header: 'Filtrar por: ',
                buttons: [

                    {
                        text: 'Horas externas/internas',
                        role: 'destructive',
                        handler: async () => {
                            await actionSheetTipo.present()
                        },
                    },
                    {
                        text: 'Año',
                        role: 'destructive',
                        handler: async () => {
                            await actionSheetAno.present()
                        },
                    },
                    {
                        text: 'Carrera',
                        role: 'destructive',
                        handler: async () => {
                            await actionSheetCarrera.present()
                        },
                    },
                ],
            });

            await actionSheet.present();

        },
        presentActionSheetFilterTipo: async (handleFilter) => {

            const actionSheet = await actionSheetController.create({
                header: 'Tipo: ',
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
        presentActionSheetFilterCarrera: async (careers, handleFilter) => {

            const actionSheet = await actionSheetController.create({
                header: 'Carrera: ',
                buttons: careers.map(c => {
                    return {
                        text: c.nombre,
                        role: 'destructive',
                        handler: () => {
                            handleFilter(c.nombre, c.idCarrera)
                        },
                    }})
            });

            await actionSheet.present();

        },
        presentActionSheetFilterAno: async (handleFilter) => {

            const actionSheet = await actionSheetController.create({
                header: 'Año: ',
                buttons: [

                    {
                        text: 'Primer Año',
                        role: 'destructive',
                        handler: () => {
                            handleFilter('Primer Año',)
                        },
                    },
                    {
                        text: 'Segundo Año',
                        role: 'destructive',
                        handler: () => {
                            handleFilter('Segundo Año',)
                        },
                    },
                    {
                        text: 'Tercer Año',
                        role: 'destructive',
                        handler: () => {
                            handleFilter('Tercer Año',)
                        },
                    },
                    {
                        text: 'Cuarto Año',
                        role: 'destructive',
                        handler: () => {
                            handleFilter('Cuarto Año',)
                        },
                    },
                    {
                        text: 'Quito Año',
                        role: 'destructive',
                        handler: () => {
                            handleFilter('Quito Año',)
                        },
                    },
                    {
                        text: 'Egresado',
                        role: 'destructive',
                        handler: () => {
                            handleFilter('Egresado')
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
