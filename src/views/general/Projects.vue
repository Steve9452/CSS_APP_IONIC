<template>
<ion-page>
	<ion-content>
		<ion-toolbar>
			<ion-segment :value="view">

				<ion-segment-button value="all" @click="view = 'all';" v-if="userRol === 1">
					<ion-label>
						<small>Todos</small>
					</ion-label>
				</ion-segment-button>

				<ion-segment-button value="history" @click="view = 'history';" v-if="userRol === 1">
					<ion-label><small>Historial</small></ion-label>
				</ion-segment-button>

				<ion-segment-button value="add" @click="view = 'add';" v-if="userRol === 1">
					<ion-label> <small>Nuevo</small></ion-label>
					
				</ion-segment-button>


				<ion-segment-button value="available" @click="view = 'available';" v-if="userRol === 2">
					<ion-label>
						<small>Disponibles</small>
					</ion-label>
				</ion-segment-button>

				<ion-segment-button value="applied" @click="view = 'applied';" v-if="userRol === 2">
					<ion-label class="ion-center"><small>Aplicados</small></ion-label>
				</ion-segment-button>

			</ion-segment>
		</ion-toolbar>

		<!-- ADMIN -->
		<list-all-projects v-if="view === 'all'"/>
		<list-projects-history v-if="view === 'history'"/>
		<create-project v-if="view === 'add'"/>

		<!-- STUDENTS -->
		<list-available-projects 
			v-if="view === 'available'"
			v-on:getPermissions="getApplyPermission"
			:applyPermission="applyPermission"
			:activeProject="activeProject"/>

		<list-applied-projects 
			v-if="view === 'applied'"
			v-on:getPermissions="getApplyPermission"
			:applyPermission="applyPermission"/>

	</ion-content>
</ion-page>
</template>

<script>
import ListAllProjects from '../../components/projects/ListAllProjects.vue';
import ListProjectsHistory from '../../components/projects/ListProjectsHistory.vue';
import CreateProject from '../../components/projects/CreateProject.vue';

import ListAvailableProjects from '../../components/projects/ListAvailableProjects.vue';
import ListAppliedProjects from '../../components/projects/ListAppliedProjects.vue';


import { rocket, checkmarkDone, addCircleOutline, logOut, timer, add } from 'ionicons/icons';

export default {
	components: {
		ListAllProjects,
		ListProjectsHistory,
		CreateProject,

		ListAvailableProjects,
		ListAppliedProjects,
	},
	data() {
		return {
			applyPermission: false,
			activeProject: true,
			apiToken: '',
			userRol: '',
			view: '',
			rocket,
			checkmarkDone,
			logOut,
			timer,
			addCircleOutline,
			add
		}
	},
	created() {
		this.userRol = this.getUserRolId();
		this.apiToken = this.getApiToken();
		this.getApplyPermission();
		
		console.log("Permisos apply/active")
		
		console.log(this.applyPermission, this.activeProject)

		if(this.userRol === 1) {
			this.view = 'all';
		} else {
			this.view = 'available';
		}
	},
	methods: {
		async getApplyPermission() {
			const API_ENDOINT = this.getAPIEndpoint();
			const request = await fetch(API_ENDOINT + '/getPermisoAplicar', {
				headers: {
					"Content-type": "application/json; charset=UTF-8",
					'Authorization': 'Bearer ' + this.apiToken
				}
			}).then(response => response.json()).then(data => {
				//console.log(data)
				this.applyPermission = data.permiso === 1 ? true : false;
				this.activeProject = data.proyectoActivo === 0 ? false : true;


			});
			//console.log("Permisos apply/active")
			// console.log(this.applyPermission, this.activeProject)

			// Refactorizar condiciones para que sean más legibles

			// proyecto activo = 0 si no tiene proyecto activo
			// permiso = 1 si no ha inscrito un proyecto ese dia


			
			// if(request.permiso === 1 && request.proyectoActivo === 0) {
			// 	this.applyPermission = true;
			// 	this.activeProject = false;
			// } else {
			// 	this.activeProject = request.proyectoActivo !== 0;
			// 	this.showErrorToast(
			// 		`${request.proyectoActivo !== 0 ? "Ya se encuentra inscrito en un proyecto actualmente. " : ""}` 
			// 		+ `${request.permiso !== 1 ? "Ha excedido el numero máximo de solicitudes diarias. Inténtelo mañana nuevamente" : ""}`
			// 		);
			// }
		},
	},
}
</script>

<style scoped>
	ion-icon {
		font-size: 19px;
	}
</style>