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
	actionSheetController,
	alertController,
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
	props: ['projectData', 'applyPermission', 'showUnapply', 'activeProject'],
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
		async presentActionSheet() {

			if (this.userRol === 1) {
				this.projectOptions = [{
					text: 'Editar proyecto',
					icon: create,
					role: 'details',
				},
				{
					text: 'Agregar Alumno',
					icon: addCircle,
					role: 'addStudent',
				},
				{
					text: 'Cancelar',
					icon: close,
					role: 'cancel'
				},
				];
			} else {

				if (this.showUnapply) {
					this.projectOptions = [{
						text: 'Desaplicar',
						icon: personRemove,
						role: 'unapply',
					},
					{
						text: 'Ver Detalles',
						icon: create,
						role: 'details',
					},
					{
						text: 'Cancelar',
						icon: close,
						role: 'cancel'
					},
					];
				} else {
					this.projectOptions = [{
						text: 'Aplicar',
						icon: personAdd,
						role: 'apply'
					},
					{
						text: 'Ver Detalles',
						icon: create,
						role: 'details',
					},
					{
						text: 'Cancelar',
						icon: close,
						role: 'cancel'
					},
					];
				}

			}

			const actionSheet = await actionSheetController
				.create({
					header: 'Opciones de Proyecto',
					buttons: this.projectOptions,
				});
			await actionSheet.present();

			const {
				role
			} = await actionSheet.onDidDismiss();

			switch (role) {
				case 'details':
					this.openModal();
					break;

				case 'addStudent':
					this.addStudent();
					break;

				case 'apply':
					this.applyToProject();
					break;

				case 'unapply':
					this.unapplyToProject();
					break;
			}
		},
		async addStudent() {
			const action = await alertController
				.create({
					header: 'Agregar alumno',
					inputs: [{ name: 'carnet', type: 'number', placeholder: 'Ingrese carnet del alumno' }],
					buttons: [
						{ text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
						{
							text: 'Ok',
							role: 'add',
							handler: (data) => {
								this.addStudentToProject(data.carnet);
							},
						},
					],
				});
			return action.present();
		},
		async addStudentToProject(carnet) {
			const API_ENDOINT = this.getAPIEndpoint();
			const request = await fetch(API_ENDOINT + `/admin/postApplyStudent`, {
				method: "POST",
				body: JSON.stringify({
					idProyecto: this.project.id,
					carnet: carnet,
					estado: 1
				}),
				headers: {
					"Content-type": "application/json; charset=UTF-8",
					'Authorization': 'Bearer ' + this.apiToken
				}
			})

			if (request.status === 200) {
				this.showSuccessToast('Alumno agregado exitosamente.');
				this.$emit('dataUpdated');
				location.reload();
			} else {
				this.showErrorToast('Algo salió mal al agregar el alumno.');
			}
		},
		async applyToProject() {

			console.log("Apply permission " + this.applyPermission)
			console.log("Proyecto activo " + this.activeProject)
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
					location.reload();
				} else {
					this.showErrorToast('Algo salió mal al enviar la solicitud.');
					location.reload();
				}
			} else {
				this.showErrorToast('No puede aplicar a otro proyecto este día. Inténtelo mañana nuevamente.');
			}
		},
		async unapplyToProject() {
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
				location.reload();
			} else {
				this.showErrorToast('Algo salió mal al enviar la solicitud.');
			}
		},
		async openModal() {
			const modal = await modalController
				.create({
					component: this.userRol === 1 ? ShowProjectDetails : ShowProjectDetailsStudent,
					componentProps: {
						projectData: this.projectData,
						showUnapplyProp: this.showUnapply,
						applyPermission: this.applyPermission,
						activeProject: this.activeProject
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