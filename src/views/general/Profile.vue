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
import { IonContent } from '@ionic/vue';
import { Storage } from '@capacitor/storage';

export default {
	components: {
		IonContent
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
			loading: false
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
			// console.log("data from local storage")
			// console.log(this.data)
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
				// console.log("data local storage")
				// console.log(this.data)
				// console.log(response)
				// localStorage.setItem('user', JSON.stringify(this.data));
				await Storage.set({
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
				// console.log("data local storage")
				// console.log(this.data)
				// console.log(response)
				// localStorage.setItem('user', JSON.stringify(this.data));
				await Storage.set({
					key: 'user',
					value: JSON.stringify(this.data)
				});
				this.setUser();

				this.showSuccessToast('Perfil actualizado correctamente');
				this.loading = false;
			}
			this.setShowModal(false);
		},
	}
}
</script>