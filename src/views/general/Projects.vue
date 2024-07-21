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
			:applyPermission="applyPermission && !timeout"
			:timeout="timeout"
			:activeProject="activeProject"
			:error="error"
			:loading="loading"
			/>

		<list-applied-projects 
			v-if="view === 'applied'"
			v-on:getPermissions="getApplyPermission"
			:applyPermission="applyPermission"
			/>

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
			applyPermission: null,
			timeout: null,
			activeProject: null,
			apiToken: '',
			userRol: '',
			view: '',
			rocket,
			checkmarkDone,
			logOut,
			timer,
			addCircleOutline,
			add,
			error: false,
			loading: true,
		}
	},
	async created() {
		this.userRol = await this.getUserRolId();
		this.apiToken = await this.getApiToken();
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
			
			this.loading = true;
			fetch(API_ENDOINT + '/getPermisoAplicar', {
				headers: {
					"Content-type": "application/json; charset=UTF-8",
					'Authorization': 'Bearer ' + this.apiToken
				}
			}).then(response => {
				// console.log(response)
				if (!response.ok) {
					this.error = true;
					throw new Error('La solicitud no pudo ser completada');
				}
				return response.json();
			}).then(data => {
				//console.log(data)
				
				this.applyPermission = data.permiso === 1 ? true : false;
				this.activeProject = data.proyectoActivo === 0 ? false : true;
				
				try{
					this.timeout = new Date(data.timeout).getTime() > Date.now();
					console.log("timeout", data.timeout)
				}catch{
					this.timeout = false
					console.log("timeout", data.timeout)
				}
				
				// console.log("TIMED OUT", this.timeout)
			}).finally(() => {
				this.loading = false;
			}).catch(error => {
				console.error('Error:', "Error getting data");
				this.error = true;

			});

		},
	},
}
</script>

<style scoped>
	ion-icon {
		font-size: 19px;
	}
</style>