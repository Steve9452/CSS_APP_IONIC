<template>
	<ion-card class="my-3">
		
		<ion-item color="primary">
			<ion-label @click="openModal">
				<ion-card-subtitle style="color:var(--ion-text-color);">
					{{ project.counterpart }}
				</ion-card-subtitle>
				<ion-card-subtitle style="color:var(--ion-text-color);">
					{{ project.name }}
				</ion-card-subtitle>
				
			</ion-label>
		</ion-item>
		
		<ion-card-content @click="openModal">
			<ion-card-subtitle style="color:var(--ion-text-color);">
					{{ project.profile }}
				</ion-card-subtitle>
			<p>
				{{  }}
			</p>
			<p>
				<ion-chip v-if="showUnapply && acepted" color="success" class="mr-1 success-border">
					<small>Aceptado</small>
				</ion-chip>
				<ion-chip v-if="showUnapply && rejected" color="danger" class="mr-1 danger-border">
					<small>Rechazado</small>
				</ion-chip>
				<ion-chip v-if="showUnapply && finished" color="warning" class="mr-1">
					<small>Proyecto finalizado</small>
				</ion-chip>
				<ion-chip color="primary" class="mr-1">
					<small>{{ project.spaces_act }}/{{ project.spaces }} Cupos</small>
				</ion-chip>
				<ion-chip :color="project.status === 1 ? 'primary' : 'medium'" class="mr-1">
					<small>{{ project.hoursType }}</small>
				</ion-chip>
			</p>

		</ion-card-content>
	</ion-card>
</template>

<script>
import ShowProjectDetails from './ShowProjectDetails.vue';
import ShowProjectDetailsStudent from './ShowProjectDetailsStudent.vue';
import {
	modalController,
	IonChip,
} from '@ionic/vue';
import {
	ellipsisHorizontal,
	personRemove,
	personAdd,
	close,
	create,
	heart,
	addCircle,
	trash,
	chevronDown,
} from 'ionicons/icons';

export default {
	components: {
		IonChip
	},
	props: ['projectData', 'applyPermission', 'showUnapply', 'activeProject', 'historyProject'],
	data: function () {
		return {
			userId: '',
			userRol: '',
			apiToken: '',
			project: {
				id: '',
				name: '',
				status: '',
				projectStatus: '',
				counterpart: '',
				spaces: '',
				// eslint-disable-next-line
				spaces_act: '',
				description: '',
				profile: '',
				owner: '',
				startDate: '',
				endDate: '',
				schedule: '',
				hoursType: '',
				ownerEmail: '',
			},
			projectOptions: [],
			ellipsisHorizontal,
			close,
			personRemove,
			personAdd,
			heart,
			create,
			addCircle,
			trash,
			chevronDown,
			fetching: false,
		};
	},
	async created() {
		this.setProjectData();
		this.apiToken = this.getApiToken();
		this.userId = this.getUserId();
		this.userRol = this.getUserRolId();

		if(this.projectData.estadoPxe !== undefined){

			this.acepted = this.projectData.estadoPxe == 1
			this.rejected = this.projectData.estadoPxe == 2
			this.finished = this.projectData.estadoPxe == 3
			//console.log("Aceptado", this.acepted)
		}

	},
	methods: {
		setProjectData() {
			this.project.id = this.projectData.idProyecto;
			this.project.name = this.projectData.nombre;
			this.project.status = this.projectData.estado;
			this.project.projectStatus = this.projectData.estado_proyecto;
			this.project.counterpart = this.projectData.contraparte;
			this.project.spaces = this.projectData.cupos;
			// eslint-disable-next-line
			this.project.spaces_act = this.projectData.cupos_act;
			this.project.description = this.projectData.descripcion;
			this.project.profile = this.projectData.perfil_estudiante;
			this.project.owner = this.projectData.encargado;
			this.project.startDate = this.projectData.fecha_inicio;
			this.project.endDate = this.projectData.fecha_fin;
			this.project.schedule = this.projectData.horario;
			this.project.hoursType = this.projectData.tipo_horas;
			this.project.ownerEmail = this.projectData.correo_encargado;

		},
		
		async openModal() {
			const modal = await modalController
				.create({
					component: this.userRol === 1 ? ShowProjectDetails : ShowProjectDetailsStudent,
					componentProps: {
						projectData: this.projectData,
						showUnapplyProp: this.showUnapply,
						applyPermission: this.applyPermission,
						activeProject: this.activeProject,
						disableStatus: this.historyProject
					},
				});
			modal.onDidDismiss().then(() => {
				this.$emit('dataUpdated');
			});
			return await modal.present();
		},
	}
}
</script>
<style>
	.success-border {
		border: 2px solid var(--ion-color-success-shade)
	}
	.danger-border {
		border: 2px solid var(--ion-color-danger-shade)
	}
</style>