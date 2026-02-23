<template>
	<ion-page>
		<ion-content fullscreen>
			<div style="height: 95%;" class="d-flex flex-column justify-content-between mx-4 mt-3">
				<div>
					<!-- <img v-if="user.gender === 'M'" src="/assets/img/male-avatar.jpg" class="img-fluid d-block w-50 my-3 mx-auto">
					<img v-else src="/assets/img/female-avatar.jpg" class="img-fluid d-block w-50 my-3 mx-auto"> -->
					<div class="my-3">
						<h1 class="font-weight-bolder">
							{{ user.fname }} {{ user.lname }}
						</h1>
					</div>
					<div class="my-3">
						<ion-text>
							<small class="d-block text-muted font-weight-bold">
								<i class="fas fa-envelope-open-text"></i>&nbsp;Correo
							</small>
							<p>
								{{ user.email }}
							</p>
						</ion-text>
					</div>

					<div v-if="user.rol === 2">
						<ion-text>
							<small class="d-block text-muted font-weight-bold ">
								<i class="fas fa-university"></i>&nbsp;Facultad
							</small>
							<p>
								{{ user.faculty }}
							</p>
						</ion-text>
					</div>

					<div v-if="user.rol === 2 && !showModal">
						<ion-text>
							<small class="d-block text-muted font-weight-bold ">
								<i class="fas fa-graduation-cap"></i>&nbsp;Carrera
							</small>
							<p>
								{{ user.collegeCareer }}
							</p>
						</ion-text>
					</div>
					<div v-if="user.rol === 2 && showModal"
						class="w-100 mb-4 justify-content-center align-content-center" expand="block" full>
						<ion-select expand="block" class="w-100" placeholder="Seleccionar " v-model="newCareer" full on>
							<ion-select-option v-for="c in careers" :key="c.idCarrera"
								:value="c.idCarrera">{{ c.nombre }}</ion-select-option>
						</ion-select>
					</div>

					<div v-if="user.rol === 2 && !showModal">
						<ion-text>
							<small class="d-block text-muted font-weight-bold ">
								<i class="far fa-id-badge"></i>&nbsp;Perfil
							</small>
							<p>
								{{ user.profile }}
							</p>
						</ion-text>
					</div>

					<div v-if="user.rol === 2 && showModal" class="w-100 justify-content-center align-content-center"
						expand="block" full>
						<ion-select expand="block" class="w-100" placeholder="Seleccionar " v-model="newProfile" full
							on>
							<ion-select-option :value="1">Primer año</ion-select-option>
							<ion-select-option :value="2">Segundo año</ion-select-option>
							<ion-select-option :value="3">Tercer año</ion-select-option>
							<ion-select-option :value="4">Cuarto año</ion-select-option>
							<ion-select-option :value="5">Quinto año</ion-select-option>
							<ion-select-option :value="6">Egresado</ion-select-option>

						</ion-select>
					</div>


				</div>


				<div class="mx-auto">
					<ion-chip class="px-4 py-2" size="large" v-if="user.rol === 2 && !showModal" expand="block" full color="primary"
						@click="setShowModal(true)" fill="outline">
						Editar perfil
					</ion-chip>

					<ion-chip v-if="user.rol === 1" class="px-4 py-2 mb-2" size="large" expand="block" color="secondary" 
						@click="showAdminList = !showAdminList" fill="outline">
						<i class="fas fa-users-cog me-2"></i> Administrar administradores
					</ion-chip>

					<div v-if="showAdminList" class="admin-list-container mb-3 p-3 border rounded">
						<h5 class="mb-3">Selecciona administrador para eliminar</h5>
						
						<div v-if="loadingAdmins" class="text-center">
							<ion-spinner name="crescent"></ion-spinner>
						</div>
						
						<div v-else>
							<ion-list>
								<ion-item v-for="admin in admins" :key="admin.idUser" 
									:disabled="admin.idUser === user.idUsuario"
									:class="{ 'text-muted': admin.idUser === user.idUsuario }">
									
									<ion-label>
										<h3>{{ admin.nombres }} {{ admin.apellidos }}</h3>
										<p>{{ admin.correo }}</p>
										<small v-if="admin.idUser === user.idUsuario" class="text-warning">
											<i class="fas fa-exclamation-triangle"></i> No puedes eliminarte a ti mismo
										</small>
									</ion-label>
									
									<ion-button slot="end" color="danger" fill="clear" 
										@click="confirmDeleteAdmin(admin)"
										:disabled="admin.idUser === user.idUsuario || loading">
										<ion-icon :icon="trash"></ion-icon>
									</ion-button>
								</ion-item>
							</ion-list>
							
							<div v-if="admins.length === 0" class="text-center text-muted py-3">
								No hay otros administradores
							</div>
						</div>
						
						<ion-button expand="block" fill="clear" @click="showAdminList = false" class="mt-2">
							Cerrar
						</ion-button>
					</div>

					<div class="" v-if="showModal">
						<ion-chip class="px-4 py-2" size="large" expand="block"
							@click="updateProfile(); updateCarrera();" :disabled="loading">
							Confirmar cambios
						</ion-chip>
						<ion-chip class="px-4 py-2" size="large" expand="block" color="danger" @click="cancelUpdateProfile()"
							fill="outline" :disabled="loading">
							Cancelar
						</ion-chip>
					</div>
					
					<ion-chip v-else class="px-4 py-2" size="large" expand="block" color="danger" @click="signMeOut()">
						Cerrar sesion
					</ion-chip>
				</div>
			</div>
		</ion-content>
	</ion-page>

</template>

<script>
import { IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonSpinner } from '@ionic/vue';
import { trash } from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';

export default {
	components: {
		IonContent,
		IonList,
		IonItem,
		IonLabel,
		IonButton,
		IonIcon,
		IonSpinner
	},
	data: function () {
		return {
			data: {},
			careers: [],
			user: {
				fname: '',
				lname: '',
				gender: 'F',
				rol: '',
				email: '',
				faculty: '',
				collegeCareer: '',
				collegeCareerId: 1,
				profile: '',
				profileId: 1,
				idUsuario: ''
			},
			showModal: false,
			// showModalCarrers: false,
			// showModalProfile: false,
			newProfile: 0,
			newCareer: 0,
			apiToken: '',
			loading: false,
			showAdminList: false,
			admins: [],
			loadingAdmins: false,
			trash: trash
		}
	},
	async created() {
		await this.setUser();
		await this.fetchCarrers();

		this.apiToken = await this.getApiToken();
		this.newProfile = this.user.profileId;
		this.newCareer = this.user.collegeCareerId;
	},
	methods: {
		async signMeOut() {
			await this.signout()
			// this.$router.push("/login")
			location.reload();
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
		async setUser() {
			this.data = await this.getAuthenticatedUser();
			// // console.log("data from local storage")
			// // console.log(this.data)
			if (this.data) {
				this.user.fname = this.data.nombres;
				this.user.lname = this.data.apellidos;
				this.user.gender = this.data.genero;
				this.user.rol = this.data.rol.idRol;
				this.user.email = this.data.correo;
				this.user.profile = this.data.perfil ? this.data.perfil.descripcion : '';
				this.user.profileId = this.data.perfil ? this.data.perfil.idPerfil : '';
				this.user.faculty = this.data.carrera ? this.data.carrera.facultad.nombre : '';
				this.user.collegeCareer = this.data.carrera ? this.data.carrera.nombre : '';
				this.user.collegeCareerId = this.data.carrera ? this.data.carrera.idCarrera : '';
				// this.user.profileId = data.idPerfil ? data.idPerfil : '';
				this.newProfile = this.data.idPerfil ? this.data.idPerfil.toString() : '';
				this.user.idUsuario = this.data.idUser;
			}
		},
		setShowModal(value) {
			this.showModal = value;
		},
		async cancelUpdateProfile() {
			this.setShowModal(false);
			return;
		},
		async updateCarrera() {
			if (this.newProfile === this.data.idPerfil.toString()) {
				this.setShowModal(false);
				return;
			}
			this.loading = true;
			const API_ENDOINT = this.getAPIEndpoint();
			const request = await fetch(`${API_ENDOINT}/updateEstudianteCarrera`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${this.apiToken}`
				},
				body: JSON.stringify({
					idCarrera: this.newCareer,
					idUsuario: this.user.idUsuario
				},
				)
			});
			const response = await request.json();
			if (response) {
				this.showModal = false;
				this.data.carrera = response.carrera;
				// this.data.perfil = response.perfil;
				// // console.log("data local storage")
				// // console.log(this.data)
				// // console.log(response)
				// localStorage.setItem('user', JSON.stringify(this.data));
				await Preferences.set({
					key: 'user',
					value: JSON.stringify(this.data)
				});
				this.setUser();

				this.showSuccessToast('Perfil actualizado correctamente');
				location.reload();
				this.loading = false;
			}
			this.setShowModal(false);
		},
		async updateProfile() {
			if (this.newProfile === this.data.idPerfil.toString()) {
				this.setShowModal(false);
				return;
			}
			this.loading = true;
			const API_ENDOINT = this.getAPIEndpoint();
			const request = await fetch(`${API_ENDOINT}/updateEstudiantePerfil`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${this.apiToken}`
				},
				body: JSON.stringify({
					idPerfil: this.newProfile,
					idUsuario: this.user.idUsuario
				},
				)
			});
			const response = await request.json();
			if (response) {
				this.showModal = false;
				this.data.idPerfil = parseInt(response.idPerfil) ? parseInt(response.idPerfil) : 1;
				this.data.perfil = response.perfil;
				// // console.log("data local storage")
				// // console.log(this.data)
				// // console.log(response)
				// localStorage.setItem('user', JSON.stringify(this.data));
				await Preferences.set({
					key: 'user',
					value: JSON.stringify(this.data)
				});
				this.setUser();

				this.showSuccessToast('Perfil actualizado correctamente');
				this.loading = false;
			}
			this.setShowModal(false);
		},

		async fetchAdmins() {
			try {
				this.loadingAdmins = true;
				const API_ENDPOINT = this.getAPIEndpoint();
				
				const request = await fetch(API_ENDPOINT + `/admin/users/admin/all`, {
					headers: {
						'Authorization': `Bearer ${this.apiToken}`
					}
				});
				
				const data = await request.json();
				if (request.status === 200) {
					this.admins = data.users;
				} else {
					this.showErrorToast('Error al cargar administradores');
				}
			} catch (error) {
				console.error('Error:', error);
				this.showErrorToast('Error de conexión');
			} finally {
				this.loadingAdmins = false;
			}
		},

		confirmDeleteAdmin(admin) {
			// El backend ya maneja la validación, pero mostramos un mensaje amigable
			const alert = document.createElement('ion-alert');
			alert.header = 'Confirmar eliminación';
			alert.message = `¿Estás seguro de eliminar al administrador ${admin.nombres} ${admin.apellidos}?`;
			alert.buttons = [
				{
					text: 'Cancelar',
					role: 'cancel'
				},
				{
					text: 'Eliminar',
					handler: () => {
						this.deleteAdmin(admin.idUser);
					}
				}
			];
			document.body.appendChild(alert);
			alert.present();
		},

		async deleteAdmin(userId) {
			try {
				this.loading = true;
				const API_ENDPOINT = this.getAPIEndpoint();
				
				const request = await fetch(API_ENDPOINT + `/admin/deleteAdmin`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${this.apiToken}`
					},
					body: JSON.stringify({
						id: userId
					})
				});

				const response = await request.json();

				if (request.status === 200) {
					this.showSuccessToast('Administrador eliminado correctamente');
					// Recargar la lista
					await this.fetchAdmins();
				} else {
					// El backend ya envía mensajes como:
					// "No se puede eliminar su propio usuario" o 
					// "No se puede eliminar el ultimo administrador"
					this.showErrorToast(response.message || 'Error al eliminar administrador');
				}
			} catch (error) {
				console.error('Error:', error);
				this.showErrorToast('Error de conexión');
			} finally {
				this.loading = false;
			}
		}
	},

	// Modificar watch o created para cargar admins cuando se abre el panel
	watch: {
		showAdminList(newValue) {
			if (newValue && this.admins.length === 0) {
				this.fetchAdmins();
			}
		}
	}
}
</script>